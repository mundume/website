import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/dist/api/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  // Use R2 for caching generated OG images and other ISR content
  incrementalCache: r2IncrementalCache,
  
  // Note: OpenNext for Cloudflare uses the Node.js runtime by default
  // which is required for next/og's ImageResponse.
});
