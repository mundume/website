"use client"

import { AnimatePresence, motion } from "framer-motion"
// import { Pill } from "../atoms/pill"
import { useEffect, useState } from "react"
import { Checklist } from "../atoms/checklist"
import { Button } from "../atoms/button"
// import { Video } from "../atoms/video"

export const headlines = [
  { text: "process background tasks", gradient: "from-violet-400 to-violet-600" },
  { text: "build reliable workers", gradient: "from-[#5B9EE9] to-[#2F74C0]" },
  { text: "handle task retries", gradient: "from-red-400 to-red-600" },
  { text: "scale horizontally", gradient: "from-orange-400 to-orange-600" },
  { text: "create workflows", gradient: "from-violet-400 to-violet-600" },
  { text: "monitor queues", gradient: "from-emerald-400 to-emerald-600" },
  { text: "schedule cron tasks", gradient: "from-green-400 to-green-600" },
  { text: "manage task backpressure", gradient: "from-orange-400 to-orange-600" }
]

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  useEffect(() => {
    const id = setInterval(
      () =>
        setCurrentIndex((id) => (id === headlines.length - 1 ? 0 : id + 1)),
      2500
    )
    return () => {
      clearInterval(id)
    }
  }, [])

  return (
    <section className="relative z-10">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 pt-16">
        <section className="flex flex-col gap-8 lg:gap-11 items-center text-center">
          <h1 className="font-display text-4xl sm:text-4xl lg:text-5xl mb-8 mx-auto">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-300 mx-auto">
              The rust library for
            </span>
            <br />
            <span className="block relative">
              <AnimatePresence initial={false}>
                <span className="relative opacity-0">
                  {headlines[currentIndex].text}
                </span>
                <motion.span
                  key={currentIndex}
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className={`not-sr-only absolute top-0 -bottom-4 block text-transparent bg-clip-text bg-gradient-to-br ${headlines[currentIndex].gradient}`}
                >
                  {headlines[currentIndex].text}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-300">
              with confidence
            </span>
          </h1>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Button href="/docs/quickstart">Get Started</Button>
            <Button href="/examples" secondary>
              View Examples
            </Button>
          </div>
          <img className="rounded-t-3xl border-b-0 border hover:cursor-pointer" src="https://raw.githubusercontent.com/apalis-dev/apalis-board/master/screenshots/task.png" />
          {/* <Checklist
            items={[
              "Multiple storage backends (Redis, Postgres, SQLite)",
              "Built-in cron scheduling and task workflows",
              "Type-safe task processing with Rust's compiler",
              "Observability with Prometheus and Tracing",
              "Graceful shutdown and concurrency control"
            ]}
          /> */}
        </section>
      </div>
    </section>
  )
}
