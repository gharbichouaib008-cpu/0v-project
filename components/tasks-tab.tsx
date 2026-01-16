"use client"

import type React from "react"
import { useGameStore } from "@/lib/game-store"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Check, ExternalLink, Twitter, MessageCircle, Users } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  reward: number
  type: "social" | "daily" | "special"
  icon: React.ReactNode
}

const TASKS: Task[] = [
  {
    id: "telegram",
    title: "Join Telegram Channel",
    description: "Join our official Telegram for updates",
    reward: 500,
    type: "social",
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    id: "twitter",
    title: "Follow on X (Twitter)",
    description: "Follow @10C_Official on X",
    reward: 500,
    type: "social",
    icon: <Twitter className="h-5 w-5" />,
  },
  {
    id: "invite3",
    title: "Invite 3 Friends",
    description: "Invite 3 friends to earn bonus",
    reward: 1000,
    type: "social",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "watch_ad",
    title: "Watch Video",
    description: "Watch a short video for coins",
    reward: 50,
    type: "daily",
    icon: null,
  },
]

export function TasksTab() {
  const { user, completeTask } = useGameStore()

  const handleCompleteTask = (taskId: string, reward: number) => {
    completeTask(taskId, reward)
  }

  const isTaskCompleted = (taskId: string) => user.completedTasks?.includes(taskId) ?? false

  const socialTasks = TASKS.filter((t) => t.type === "social")
  const dailyTasks = TASKS.filter((t) => t.type === "daily")

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white text-glow-purple" style={{ fontFamily: "Tanker, sans-serif" }}>
          Tasks
        </h2>
        <p className="text-sm text-white/60">Complete tasks to earn bonus 10C</p>
      </div>

      {/* Social Tasks */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Image src="/icons/hand.png" alt="Social" width={24} height={24} className="icon-float" />
          <h3 className="text-sm font-semibold text-white/80">Social Tasks</h3>
        </div>
        <div className="space-y-2">
          {socialTasks.map((task) => {
            const completed = isTaskCompleted(task.id)
            return (
              <div key={task.id} className="glass rounded-2xl p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan/20 text-cyan border border-cyan/30">
                    {task.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{task.title}</h4>
                    <p className="text-xs text-white/60">{task.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-cyan">+{task.reward}</p>
                    {completed ? (
                      <div className="flex items-center gap-1 text-xs text-cyan">
                        <Check className="h-3 w-3" /> Done
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCompleteTask(task.id, task.reward)}
                        className="h-7 text-xs text-white/70 hover:text-white hover:bg-white/10"
                      >
                        Go <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Daily Tasks with play icon */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Image src="/icons/play.png" alt="Daily" width={24} height={24} className="icon-float" />
          <h3 className="text-sm font-semibold text-white/80">Daily Tasks</h3>
        </div>
        <div className="space-y-2">
          {dailyTasks.map((task) => {
            const completed = isTaskCompleted(task.id)
            return (
              <div key={task.id} className="glass rounded-2xl p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-gold border border-gold/30">
                    <Image src="/icons/play.png" alt="Watch" width={24} height={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{task.title}</h4>
                    <p className="text-xs text-white/60">{task.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gold">+{task.reward}</p>
                    {completed ? (
                      <div className="flex items-center gap-1 text-xs text-cyan">
                        <Check className="h-3 w-3" /> Done
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCompleteTask(task.id, task.reward)}
                        className="h-7 text-xs text-white/70 hover:text-white hover:bg-white/10"
                      >
                        Watch
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
