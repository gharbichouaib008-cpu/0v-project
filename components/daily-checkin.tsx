"use client"

import { useState } from "react"
import { useGameStore } from "@/lib/game-store"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Check, Gift } from "lucide-react"

export function DailyCheckIn() {
  const { user, performCheckIn } = useGameStore()
  const [checkInResult, setCheckInResult] = useState<{
    success: boolean
    reward: number
    newStreak: number
  } | null>(null)

  const today = new Date().toDateString()
  const hasCheckedIn = user.lastCheckIn === today

  const handleCheckIn = () => {
    const result = performCheckIn()
    setCheckInResult(result)
    setTimeout(() => setCheckInResult(null), 3000)
  }

  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"]
  const rewards = [50, 60, 70, 80, 90, 100, 120]

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Image src="/icons/present.png" alt="Check-in" width={44} height={44} className="icon-float" />
          <div>
            <h3 className="font-semibold text-white" style={{ fontFamily: "Tanker, sans-serif" }}>
              Daily Check-in
            </h3>
            <p className="text-xs text-white/60">Streak: {user.checkInStreak} days</p>
          </div>
        </div>

        <Button
          onClick={handleCheckIn}
          disabled={hasCheckedIn}
          size="sm"
          className={
            hasCheckedIn
              ? "bg-white/10 text-white/50 border border-white/10"
              : "bg-cyan/20 text-cyan border border-cyan/30 glow-cyan hover:bg-cyan/30"
          }
        >
          {hasCheckedIn ? (
            <>
              <Check className="mr-1 h-4 w-4" /> Done
            </>
          ) : (
            <>
              <Gift className="mr-1 h-4 w-4" /> Claim
            </>
          )}
        </Button>
      </div>

      {checkInResult?.success && (
        <div className="mb-4 rounded-xl bg-cyan/20 border border-cyan/30 p-3 text-center animate-in slide-in-from-top">
          <p className="text-lg font-bold text-cyan text-glow-cyan" style={{ fontFamily: "Tanker, sans-serif" }}>
            +{checkInResult.reward} 10C
          </p>
          <p className="text-xs text-white/60">Day {checkInResult.newStreak} bonus!</p>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCompleted = index < user.checkInStreak % 7 || (index === 0 && hasCheckedIn)
          const isCurrent = index === user.checkInStreak % 7

          return (
            <div
              key={day}
              className={`flex flex-col items-center rounded-lg p-2 text-center transition-all border ${
                isCompleted
                  ? "bg-cyan/20 border-cyan/30"
                  : isCurrent
                    ? "bg-purple-500/20 border-purple-500/30 ring-1 ring-purple-400"
                    : "bg-white/5 border-white/10"
              }`}
            >
              <span className="text-[10px] text-white/60">{day.split(" ")[1]}</span>
              <span className={`text-xs font-semibold ${isCompleted ? "text-cyan" : "text-white/80"}`}>
                {isCompleted ? <Check className="h-3 w-3" /> : rewards[index]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
