"use client"

import { useState, useEffect } from "react"
import { VideoBackground } from "@/components/video-background"
import { BalanceHeader } from "@/components/balance-header"
import { MiningCard } from "@/components/mining-card"
import { DailyCheckIn } from "@/components/daily-checkin"
import { QuickStats } from "@/components/quick-stats"
import { BottomNavigation } from "@/components/bottom-navigation"
import { UpgradesTab } from "@/components/upgrades-tab"
import { TasksTab } from "@/components/tasks-tab"
import { FriendsTab } from "@/components/friends-tab"
import { PremiumTab } from "@/components/premium-tab"
import { EarnRewardsTab } from "@/components/earn-rewards-tab"
import { useGameStore } from "@/lib/game-store"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")
  const { isInitialized, initializeUser } = useGameStore()

  useEffect(() => {
    if (!isInitialized) {
      initializeUser()
    }
  }, [isInitialized, initializeUser])

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-4">
            <MiningCard />
            <DailyCheckIn />
            <QuickStats />
          </div>
        )
      case "upgrades":
        return <UpgradesTab />
      case "tasks":
        return <TasksTab />
      case "earn":
        return <EarnRewardsTab />
      case "friends":
        return <FriendsTab />
      case "premium":
        return <PremiumTab />
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen pb-20">
      <VideoBackground />
      <BalanceHeader />
      <div className="px-4 py-4">{renderContent()}</div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  )
}
