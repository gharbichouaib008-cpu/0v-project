"use client"

import { useGameStore } from "@/lib/game-store"
import { Card } from "@/components/ui/card"
import { TrendingUp, Users, Zap } from "lucide-react"

export function QuickStats() {
  const { user } = useGameStore()

  const stats = [
    {
      label: "Total Mined",
      value: user.totalMined.toLocaleString(),
      icon: <TrendingUp className="h-4 w-4 text-primary" />,
    },
    {
      label: "Referrals",
      value: user.referralCount.toString(),
      icon: <Users className="h-4 w-4 text-primary" />,
    },
    {
      label: "Mining Power",
      value: `${user.miningRate}/hr`,
      icon: <Zap className="h-4 w-4 text-primary" />,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="glass p-3 text-center">
          <div className="flex justify-center mb-2">{stat.icon}</div>
          <p className="text-lg font-bold">{stat.value}</p>
          <p className="text-[10px] text-muted-foreground">{stat.label}</p>
        </Card>
      ))}
    </div>
  )
}
