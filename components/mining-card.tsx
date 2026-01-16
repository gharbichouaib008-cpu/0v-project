"use client"

import { useEffect, useState, useCallback } from "react"
import { useGameStore } from "@/lib/game-store"
import Image from "next/image"
import { Sparkles } from "lucide-react"

export function MiningCard() {
  const { user, calculatePendingCoins, claimCoins, isInitialized, initializeUser, checkAutoCollect } = useGameStore()
  const [pendingCoins, setPendingCoins] = useState(0)
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimedAmount, setClaimedAmount] = useState<number | null>(null)
  const [autoCollected, setAutoCollected] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      initializeUser()
    }
  }, [isInitialized, initializeUser])

  const handleAutoCollect = useCallback(() => {
    const collected = checkAutoCollect()
    if (collected > 0) {
      setAutoCollected(true)
      setClaimedAmount(collected)
      setPendingCoins(0)
      setTimeout(() => {
        setClaimedAmount(null)
        setAutoCollected(false)
      }, 3000)
    }
  }, [checkAutoCollect])

  useEffect(() => {
    const interval = setInterval(() => {
      setPendingCoins(calculatePendingCoins())
      if (user.upgrades.autoCollect) {
        handleAutoCollect()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [calculatePendingCoins, user.upgrades.autoCollect, handleAutoCollect])

  const handleClaim = async () => {
    if (pendingCoins <= 0) return

    setIsClaiming(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const claimed = claimCoins()
    setClaimedAmount(claimed)
    setPendingCoins(0)
    setIsClaiming(false)

    setTimeout(() => setClaimedAmount(null), 2000)
  }

  const capacityHours = [1, 2, 4, 8, 16, 32][user.upgrades.miningCapacity]
  const maxPending = user.miningRate * capacityHours
  const fillPercentage = Math.min((pendingCoins / maxPending) * 100, 100)

  const radius = 90
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (fillPercentage / 100) * circumference

  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden">
      {claimedAmount !== null && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10 animate-in fade-in duration-300">
          <div className="text-center">
            <p className="text-5xl font-bold text-cyan text-glow-cyan" style={{ fontFamily: "Tanker, sans-serif" }}>
              +{claimedAmount.toLocaleString()}
            </p>
            <p className="text-white/70">{autoCollected ? "Auto-Collected!" : "10C Claimed!"}</p>
          </div>
        </div>
      )}

      {/* Mining Status Row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-white/60">Mining Status</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan mining-active" />
            <span className="text-sm font-medium text-cyan">Active</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/60">Rate</p>
          <p className="font-semibold text-white">{user.miningRate} 10C/hr</p>
        </div>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          {/* Outer glow effect */}
          <div className="absolute inset-0 rounded-full bg-cyan/20 blur-3xl scale-125 animate-pulse-slow" />

          {/* SVG Radial Progress Ring */}
          <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] -rotate-90" viewBox="0 0 200 200">
            {/* Background ring */}
            <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            {/* Progress ring with cyan glow */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="url(#cyanGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
              style={{
                filter: "drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))",
              }}
            />
            <defs>
              <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          <button
            onClick={handleClaim}
            disabled={pendingCoins <= 0 || isClaiming}
            className={`
              relative w-44 h-44 rounded-full 
              flex flex-col items-center justify-center
              bg-gradient-to-br from-cyan/20 to-purple-500/20
              border border-cyan/30
              transition-all duration-300
              ${pendingCoins > 0 && !isClaiming ? "claim-button-glow cursor-pointer hover:scale-105 active:scale-95" : "opacity-50 cursor-not-allowed"}
            `}
          >
            {/* Mining sphere icon */}
            <Image
              src="/icons/sphere.png"
              alt="Mining"
              width={70}
              height={70}
              className="icon-float animate-float mb-2"
            />

            {/* CLAIM text with Tanker font */}
            <span
              className="text-2xl text-cyan text-glow-cyan tracking-wider"
              style={{ fontFamily: "Tanker, sans-serif" }}
            >
              {isClaiming ? "..." : "CLAIM"}
            </span>
          </button>
        </div>

        {/* Pending Coins Display */}
        <div className="text-center mt-6">
          <p className="text-sm text-white/60 mb-1">Pending Coins</p>
          <p
            className="text-5xl font-bold text-white text-glow-cyan tracking-tight"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            {pendingCoins.toLocaleString()}
          </p>
          <p className="text-xs text-white/50 mt-2">
            Storage: {fillPercentage.toFixed(0)}% ({capacityHours}h capacity)
          </p>
        </div>
      </div>

      {/* Auto-collect & Premium badges */}
      <div className="flex items-center justify-center gap-4">
        {user.upgrades.autoCollect && (
          <div className="flex items-center gap-1 text-xs text-cyan bg-cyan/10 px-3 py-1 rounded-full border border-cyan/20">
            <Sparkles className="h-3 w-3" />
            <span>Auto-Collect</span>
          </div>
        )}
        {user.isPremium && (
          <div className="flex items-center gap-1 text-xs text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
            <span>1.5x VIP</span>
          </div>
        )}
      </div>
    </div>
  )
}
