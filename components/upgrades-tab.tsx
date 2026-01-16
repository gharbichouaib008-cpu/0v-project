"use client"

import { useGameStore } from "@/lib/game-store"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Check, Lock } from "lucide-react"

const UPGRADE_DATA = {
  miningSpeed: {
    name: "Mining Speed",
    description: "Increase coins mined per hour",
    icon: "/icons/sphere.png",
    levels: ["10/hr", "25/hr", "50/hr", "100/hr", "200/hr", "500/hr"],
    costs: [100, 500, 2000, 5000, 15000],
  },
  miningCapacity: {
    name: "Storage Capacity",
    description: "Store more coins before claiming",
    icon: "/icons/pig.png",
    levels: ["1 hour", "2 hours", "4 hours", "8 hours", "16 hours", "32 hours"],
    costs: [200, 800, 3000, 8000, 20000],
  },
  autoCollect: {
    name: "Auto Collector",
    description: "Automatically claim when storage is full",
    icon: "/icons/hand.png",
    levels: ["Disabled", "Enabled"],
    costs: [5000],
  },
}

export function UpgradesTab() {
  const { user, purchaseUpgrade } = useGameStore()

  const renderUpgradeCard = (type: "miningSpeed" | "miningCapacity" | "autoCollect") => {
    const data = UPGRADE_DATA[type]
    const currentLevel = type === "autoCollect" ? (user.upgrades.autoCollect ? 1 : 0) : user.upgrades[type]
    const isMaxed = currentLevel >= data.costs.length
    const nextCost = isMaxed ? null : data.costs[currentLevel]
    const canAfford = nextCost !== null && user.balance >= nextCost

    return (
      <div key={type} className="glass rounded-2xl p-4">
        <div className="flex items-start gap-4">
          <Image src={data.icon || "/placeholder.svg"} alt={data.name} width={60} height={60} className="icon-float" />
          <div className="flex-1">
            <h3 className="font-semibold text-white" style={{ fontFamily: "Tanker, sans-serif" }}>
              {data.name}
            </h3>
            <p className="text-xs text-white/60 mb-2">{data.description}</p>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-cyan">{data.levels[currentLevel]}</span>
              {!isMaxed && (
                <>
                  <span className="text-white/40">→</span>
                  <span className="text-sm font-medium text-white">{data.levels[currentLevel + 1]}</span>
                </>
              )}
            </div>

            {isMaxed ? (
              <div className="flex items-center gap-2 text-cyan">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Maxed Out</span>
              </div>
            ) : (
              <Button
                onClick={() => purchaseUpgrade(type)}
                disabled={!canAfford}
                size="sm"
                className={
                  canAfford
                    ? "bg-cyan/20 text-cyan border border-cyan/30 glow-cyan hover:bg-cyan/30"
                    : "bg-white/10 text-white/50 border border-white/10"
                }
              >
                {canAfford ? (
                  `Upgrade for ${nextCost?.toLocaleString()} 10C`
                ) : (
                  <>
                    <Lock className="mr-1 h-3 w-3" />
                    {nextCost?.toLocaleString()} 10C
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-24">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white text-glow-purple" style={{ fontFamily: "Tanker, sans-serif" }}>
          Upgrades
        </h2>
        <p className="text-sm text-white/60">Boost your mining power</p>
      </div>

      <div className="space-y-3">
        {renderUpgradeCard("miningSpeed")}
        {renderUpgradeCard("miningCapacity")}
        {renderUpgradeCard("autoCollect")}
      </div>
    </div>
  )
}
