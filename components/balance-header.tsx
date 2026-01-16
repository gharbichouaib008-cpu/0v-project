"use client"

import { useGameStore } from "@/lib/game-store"
import Image from "next/image"

export function BalanceHeader() {
  const { user } = useGameStore()

  const getLevel = (exp: number) => Math.floor(exp / 100) + 1
  const getExpProgress = (exp: number) => exp % 100

  return (
    <header className="glass-strong sticky top-0 z-50 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image src="/icons/sphere.png" alt="10C" width={44} height={44} className="icon-float" />
          </div>
          <div>
            <p className="text-xs text-white/60">Total Balance</p>
            <p className="text-2xl font-bold text-white text-glow-cyan" style={{ fontFamily: "Tanker, sans-serif" }}>
              {user.balance.toLocaleString()} <span className="text-cyan text-lg">10C</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-white/60">Level {getLevel(user.experience)}</p>
            <div className="h-1.5 w-16 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan to-purple-400 transition-all"
                style={{ width: `${getExpProgress(user.experience)}%` }}
              />
            </div>
          </div>
          {user.isPremium && (
            <div className="flex h-8 items-center rounded-full bg-gold/20 px-3 border border-gold/30">
              <span className="text-xs font-semibold text-gold">VIP</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
