"use client";

import { useState } from "react";
import { Icon } from "../icons";
import { motion } from "framer-motion";
import { Code } from "../layout/code";
import { Logo } from "../atoms/logo";

export const Ergonomics = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  return (
    <section className="relative my-4">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16">
        <h2 className="font-display mb-6 text-2xl sm:text-3xl lg:text-4xl text-white text-center">
          {content.heading}
        </h2>
        <p className="text-center text-muted-foreground max-w-xl mx-auto">{content.text}</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 gap-x-6 pt-12">
          <div className="flex flex-col items-center gap-6">
            <div className="lg:pr-16">
              <ul>
                {content.features.map(({ name, description, color }, index) => (
                  <li key={index}>
                    {index > 0 && (
                      <Icon
                        name="arrow-down"
                        className="h-3 ml-2 text-zinc-600 -translate-x-px"
                      />
                    )}
                    <button
                      onClick={() => setCurrentIndex(index)}
                      className="text-white flex gap-4 items-center text-left relative"
                    >
                      {currentIndex >= index && (
                        <>
                          <div
                            className="absolute -left-2 w-9 h-9 rounded-sm"
                            style={{ backgroundColor: color }}
                          />
                          <div className="absolute -left-2 w-9 h-9 rounded-sm border border-white/10" />
                        </>
                      )}
                      <div className="relative bg-gradient-to-br from-zinc-100 to-zinc-500 h-5 w-5 rounded-sm p-px">
                        <div
                          className={`rounded-sm-[5px] h-full w-full flex items-center justify-center ${currentIndex >= index ? "bg-white" : "bg-black"
                            }`}
                        >
                          <Icon name="check" className="ml-px h-3.5 text-black" />
                        </div>
                      </div>
                      <div>
                        <div>{name}</div>
                        <div className="text-xs text-zinc-400">{description}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6">
            <Code
              tabs={[
                {
                  name: content.features[currentIndex].withApalis.fileName,
                  content: content.features[currentIndex].withApalis.code,
                  highlights:
                    content.features[currentIndex].withApalis.highlights,
                },
              ]}
              fixedHeight={300}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const content = {
  heading: "Simple and ergonomic API",
  text: `Apalis provides production-ready task processing with minimal boilerplate, letting you focus on business logic.`,
  features: [
    {
      name: "Error Handling",
      description: "Built-in error handling with automatic retry capabilities.",
      color: "#283413",
      withoutApalis: {
        fileName: "main.rs",
        code: `\
async fn send_email(email: String) -> Result<(), BoxDynError> {
    if !is_valid_email(&email) {
        return Err(anyhow!("Invalid email address").into());
    }
    Ok(())
}

#[tokio::main]
async fn main() -> Result<()> {
    let conn = Connection::open("tasks.db")?;
    init_db(&conn)?;

    loop {
        if let Some((id, data)) = fetch_task(&conn)? {
            let res = send_email(data).await;
            if res.is_ok() { // TODO: Handle retries
                mark_processed(&conn, id)?;
            }
        } else {
            time::sleep(Duration::from_secs(2)).await;
        }
    }
}\
        `,
        highlights: [
          {
            color: "#283413",
            lines: [1, 2, 3, 4, 5, 6, 14, 16, 17],
          },
        ],
      },
      withApalis: {
        fileName: "main.rs",
        code: `\
struct EmailTask {
    to: String,
    subject: String,
}

async fn send_email(task: EmailTask, _ctx: TaskContext) -> Result<(), Error> {
    if !is_valid_email(&task.to) {
        return Err(anyhow!("Invalid email address").into());
    }
    Ok(())
}
    
#[tokio::main]
async fn main() -> Result<()> {
    let worker = WorkerBuilder::new("rango-tango")
        .backend(backend)
        .retry(RetryPolicy::retries(5))
        .build(send_email);
    worker.run().await?;
}\
        `,
        highlights: [
          {
            color: "#283413",
            lines: [6, 7, 8, 9, 10, 17, 19],
          },
        ],
      },
    },
    {
      name: "Retry Mechanism",
      description: "Configurable retry policies with exponential backoff.",
      color: "#39300D",
      withoutApalis: {
        fileName: "main.rs",
        code: `\
use std::time::Duration;
use tokio::time;

async fn process_with_retries(max_retries: u32) -> Result<(), String> {
    let mut attempts = 0;
    let mut delay = Duration::from_secs(1);
    
    loop {
        match send_email().await {
            Ok(()) => return Ok(()),
            Err(e) if attempts < max_retries => {
                attempts += 1;
                time::sleep(delay).await;
                delay *= 2;
            }
            Err(e) => return Err(e),
        }
    }
}\
        `,
        highlights: [
          {
            color: "#39300D",
            lines: [4, 9, 12, 13, 14],
          },
        ],
      },
      withApalis: {
        fileName: "main.rs",
        code: `\
use apalis::{
    layers::{retry::RetryPolicy, backoff::ExponentialBackoff},
    prelude::*,
};

WorkerBuilder::new("email-worker")
    .retry(RetryPolicy::retries(3)
    .with_backoff(ExponentialBackoff::default()))
    .build(send_email)
    .run()
    .await?;\
        `,
        highlights: [
          {
            color: "#39300D",
            lines: [7, 8, 9],
          },
        ],
      },
    },
    {
      name: "Graceful Shutdown",
      description: "Clean shutdown handling with configurable timeouts.",
      color: "#28233B",
      withoutApalis: {
        fileName: "main.rs",
        code: `\
use tokio::sync::mpsc;
use tokio::signal;

async fn worker_loop(rx: mpsc::Receiver<Task>) {
    let mut shutdown = false;
    
    tokio::select! {
        _ = signal::ctrl_c() => {
            shutdown = true;
        }
        _ = async {
            while let Some(task) = rx.recv().await {
                if shutdown {
                    break;
                }
                process_task(task).await;
            }
        } => {}
    }
}\
        `,
        highlights: [
          {
            color: "#28233B",
            lines: [6, 7, 8, 9, 10, 11, 12, 13, 14],
          },
        ],
      },
      withApalis: {
        fileName: "main.rs",
        code: `\
use apalis::prelude::*;

Monitor::new()
    .register(worker)
    .shutdown_timeout(Duration::from_secs(30))
    .run_with_signal(tokio::signal::ctrl_c())
    .await?;\
        `,
        highlights: [
          {
            color: "#28233B",
            lines: [4, 5],
          },
        ],
      },
    },
    {
      name: "Observability",
      description: "Built-in metrics and tracing integration.",
      color: "#10322E",
      withoutApalis: {
        fileName: "main.rs",
        code: `\
use prometheus::{Counter, Registry};
use std::sync::Arc;

lazy_static! {
    static ref JOB_COUNTER: Counter = register_counter!(
        "tasks_processed_total",
        "Total number of tasks processed"
    ).unwrap();
}

async fn process_task(task: Task) {
    let start = std::time::Instant::now();
    
    // Task processing...
    
    let duration = start.elapsed().as_secs_f64();
    JOB_COUNTER.inc();
    metrics::histogram!("task_duration_seconds", duration);
}\
        `,
        highlights: [
          {
            color: "#10322E",
            lines: [4, 5, 6, 7, 12, 13, 14, 15, 16],
          },
        ],
      },
      withApalis: {
        fileName: "main.rs",
        code: `\
use apalis::{
    layers::{prometheus::PrometheusLayer, tracing::TraceLayer},
    prelude::*,
};

Monitor::new()
    .register(
        WorkerBuilder::new("email-worker")
            .layer(PrometheusLayer)
            .layer(TraceLayer::new())
            .build_fn(send_email)
    )
    .run()
    .await?;\
        `,
        highlights: [
          {
            color: "#10322E",
            lines: [8, 9],
          },
        ],
      },
    },
    {
      name: "Storage Backends",
      description:
        "Multiple storage options including Redis, Postgres and SQLite.",
      color: "#2E1F3B",
      withoutApalis: {
        fileName: "main.rs",
        code: `\
use redis::Commands;
use serde_json;

struct RedisQueue {
    conn: redis::Connection,
    queue_name: String,
}

impl RedisQueue {
    async fn enqueue(&mut self, task: &Task) -> Result<(), redis::RedisError> {
        let serialized = serde_json::to_string(task)?;
        self.conn.lpush(&self.queue_name, serialized)?;
        Ok(())
    }
}\
        `,
        highlights: [
          {
            color: "#2E1F3B",
            lines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          },
        ],
      },
      withApalis: {
        fileName: "main.rs",
        code: `\
use apalis::{prelude::*, redis::RedisStorage};

#[tokio::main]
async fn main() -> Result<()> {
    let redis_url = std::env::var("REDIS_URL")?;
    let storage = RedisStorage::connect(redis_url).await?;
    
    // Push tasks
    storage.push(EmailTask { to: "user@example.com" }).await?;
    
    // Worker setup
    Monitor::new()
        .register(
            WorkerBuilder::new("email-worker")
                .with_storage(storage)
                .build_fn(send_email)
        )
        .run()
        .await?;
}\
        `,
        highlights: [
          {
            color: "#2E1F3B",
            lines: [5, 6, 7, 8, 12, 13],
          },
        ],
      },
    },
  ],
};
