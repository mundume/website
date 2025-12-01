import { visit } from "unist-util-visit";
import { execSync } from "child_process";
import { tmpdir } from "os";
import { join } from "path";
import { writeFileSync, unlinkSync, mkdirSync, existsSync, readFileSync } from "fs";
import { createHash } from "crypto";
import type { Plugin } from "unified";
import type { Root } from "hast";

interface CompilerOptions {
  cargoToml?: string; // Optional Cargo.toml content for dependencies
  edition?: string; // Rust edition (2018, 2021, etc.)
  allowWarnings?: boolean; // Whether to treat warnings as errors
  cacheDir?: string; // Directory to store compilation cache
  enableCache?: boolean; // Whether to use caching (default: true)
}

interface CompilationResult {
  success: boolean;
  output: string;
  warnings: string[];
  errors: string[];
  hash: string;
  timestamp: number;
}

// In-memory cache for this session
const compilationCache = new Map<string, CompilationResult>();

// Persistent cache directory setup
let persistentCacheDir: string | null = null;

function initializePersistentCache(cacheDir?: string): void {
  if (!cacheDir) return;
  
  persistentCacheDir = cacheDir;
  if (!existsSync(persistentCacheDir)) {
    mkdirSync(persistentCacheDir, { recursive: true });
  }
}

function generateCacheKey(code: string, cargoToml: string, edition: string): string {
  const content = `${code}\n---CARGO---\n${cargoToml}\n---EDITION---\n${edition}`;
  return createHash('sha256').update(content).digest('hex');
}

function loadFromPersistentCache(hash: string): CompilationResult | null {
  if (!persistentCacheDir) return null;
  
  const cacheFile = join(persistentCacheDir, `${hash}.json`);
  if (!existsSync(cacheFile)) return null;
  
  try {
    const data = readFileSync(cacheFile, 'utf-8');
    const result = JSON.parse(data) as CompilationResult;
    
    // Cache expires after 24 hours
    const maxAge = 24 * 60 * 60 * 1000;
    if (Date.now() - result.timestamp > maxAge) {
      unlinkSync(cacheFile);
      return null;
    }
    
    return result;
  } catch (error) {
    // If cache file is corrupted, remove it
    try {
      unlinkSync(cacheFile);
    } catch {}
    return null;
  }
}

function saveToPersistentCache(result: CompilationResult): void {
  if (!persistentCacheDir) return;
  
  const cacheFile = join(persistentCacheDir, `${result.hash}.json`);
  try {
    writeFileSync(cacheFile, JSON.stringify(result), 'utf-8');
  } catch (error) {
    console.warn('Failed to save compilation cache:', error);
  }
}

function getCachedResult(hash: string, enableCache: boolean): CompilationResult | null {
  if (!enableCache) return null;
  
  // Check in-memory cache first
  const memoryResult = compilationCache.get(hash);
  if (memoryResult) return memoryResult;
  
  // Check persistent cache
  const persistentResult = loadFromPersistentCache(hash);
  if (persistentResult) {
    // Load into memory cache for faster access
    compilationCache.set(hash, persistentResult);
    return persistentResult;
  }
  
  return null;
}

function cacheResult(result: CompilationResult, enableCache: boolean): void {
  if (!enableCache) return;
  
  // Store in memory cache
  compilationCache.set(result.hash, result);
  
  // Store in persistent cache
  saveToPersistentCache(result);
}

// Shared compilation workspace to avoid creating multiple temp directories
let sharedWorkspace: string | null = null;
let workspaceRefCount = 0;

function getSharedWorkspace(cargoToml: string): string {
  if (!sharedWorkspace) {
    sharedWorkspace = join(tmpdir(), `rust-workspace-${Date.now()}`);
    mkdirSync(sharedWorkspace, { recursive: true });
    
    // Create Cargo.toml once
    const cargoTomlPath = join(sharedWorkspace, "Cargo.toml");
    writeFileSync(cargoTomlPath, cargoToml, "utf-8");
    
    // Create src directory
    const srcDir = join(sharedWorkspace, "src");
    mkdirSync(srcDir, { recursive: true });
  }
  workspaceRefCount++;
  return sharedWorkspace;
}

function releaseSharedWorkspace(): void {
  workspaceRefCount--;
  if (workspaceRefCount <= 0 && sharedWorkspace) {
    try {
      // Clean up the shared workspace
      execSync(`rm -rf "${sharedWorkspace}"`, { stdio: 'ignore' });
    } catch {
      // Ignore cleanup errors
    }
    sharedWorkspace = null;
    workspaceRefCount = 0;
  }
}

function compileRustCode(
  code: string, 
  cargoToml: string, 
  hash: string,
  workspace: string
): CompilationResult {
  const mainRsPath = join(workspace, "src", `${hash}.rs`);
  const cargoTomlPath = join(workspace, "Cargo.toml");
  
  try {
    // Wrap code in main function if it doesn't have one
    let finalCode = code;
    if (
      !code.includes("fn main") &&
      !code.includes("mod ") &&
      !code.includes("use ")
    ) {
      finalCode = `fn main() {\n${code}\n}`;
    }

    // Write the specific code file
    writeFileSync(mainRsPath, finalCode, "utf-8");

    // Update Cargo.toml to include this binary
    let currentCargoToml = cargoToml;
    if (!currentCargoToml.includes('[[bin]]')) {
      currentCargoToml += `\n[[bin]]\nname = "${hash}"\npath = "src/${hash}.rs"\n`;
    } else {
      currentCargoToml += `\n[[bin]]\nname = "${hash}"\npath = "src/${hash}.rs"\n`;
    }
    writeFileSync(cargoTomlPath, currentCargoToml, "utf-8");

    let compilationResult: CompilationResult;

    try {
      // Use cargo check for faster compilation
      const output = execSync(
        `cargo check --bin ${hash} --manifest-path "${cargoTomlPath}"`,
        { 
          cwd: workspace,
          stdio: "pipe",
          encoding: "utf-8",
          timeout: 30000 // 30 second timeout
        }
      );

      const warnings = output.toString()
        .split('\n')
        .filter(line => line.includes('warning:'))
        .map(line => line.trim());

      compilationResult = {
        success: true,
        output: output.toString(),
        warnings,
        errors: [],
        hash,
        timestamp: Date.now()
      };

    } catch (error: any) {
      const stderr = error.stderr?.toString() || error.message || 'Unknown error';
      const errors = stderr
        .split('\n')
        .filter(line => line.includes('error:') || line.includes('error['))
        .map(line => line.trim());

      const warnings = stderr
        .split('\n')
        .filter(line => line.includes('warning:'))
        .map(line => line.trim());

      compilationResult = {
        success: false,
        output: stderr,
        warnings,
        errors,
        hash,
        timestamp: Date.now()
      };
    }

    // Clean up the specific file
    try {
      unlinkSync(mainRsPath);
    } catch {}

    return compilationResult;

  } catch (error: any) {
    return {
      success: false,
      output: error.message || 'Unknown error',
      warnings: [],
      errors: [error.message || 'Unknown error'],
      hash,
      timestamp: Date.now()
    };
  }
}

export function rehypeExampleCompiler(options: CompilerOptions = {}) {
  const { 
    cargoToml = `[package]
name = "example"
version = "0.1.0"
edition = "2021"

[dependencies]
`, 
    edition = "2021",
    allowWarnings = true,
    cacheDir,
    enableCache = true
  } = options;

  // Initialize persistent cache
  initializePersistentCache(cacheDir);

  return function (tree, { data }) {
    // Collect all rust compile blocks first for batch processing
    const rustBlocks: { node: any, code: string, hash: string }[] = [];

    visit(tree, "code", function (node, index, parent) {
      if (node?.lang === "rust" && node?.meta?.includes("compile")) {
        const rustCode = node.value;

        if (!rustCode.trim()) {
          return;
        }

        const hash = generateCacheKey(rustCode, cargoToml, edition);
        rustBlocks.push({ node, code: rustCode, hash });
      }
    });

    // Process all blocks with caching
    if (rustBlocks.length > 0) {
      const workspace = getSharedWorkspace(cargoToml);

      rustBlocks.forEach(block => {
        try {
          // Check cache first
          let compilationResult = getCachedResult(block.hash, enableCache);
          
          if (!compilationResult) {
            // Not in cache, compile it
            console.log(`Compiling Rust code (hash: ${block.hash.substring(0, 8)}...)`);
            compilationResult = compileRustCode(block.code, cargoToml, block.hash, workspace);
            cacheResult(compilationResult, enableCache);
          } else {
            console.log(`Using cached result (hash: ${block.hash.substring(0, 8)}...)`);
          }

          // Update the node's meta with compilation result
          const resultStatus = compilationResult.success ? "Success" : "Fail";
          if (block.node.meta.includes('compile-result=')) {
            // Replace existing result
            block.node.meta = block.node.meta.replace(/compile-result="[^"]*"/, `compile-result="${resultStatus}"`);
          } else {
            // Add new result
            block.node.meta = block.node.meta + ` compile-result="${resultStatus}"`;
          }

          // Optionally add more detailed info to meta
          if (compilationResult.warnings.length > 0) {
            block.node.meta += ` compile-warnings="${compilationResult.warnings.length}"`;
          }
          if (compilationResult.errors.length > 0) {
            block.node.meta += ` compile-errors="${compilationResult.errors.length}"`;
          }

        } catch (error: any) {
          console.error("Failed to compile Rust code:", error);
          block.node.meta = block.node.meta + ` compile-result="Error"`;
        }
      });

      // Release the shared workspace
      releaseSharedWorkspace();
    }

    return tree;
  };
}

export default rehypeExampleCompiler;
