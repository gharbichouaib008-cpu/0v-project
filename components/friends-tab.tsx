"use client"

import { useGameStore } from "@/lib/game-store"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Copy, Check, Users, Gift } from "lucide-react"
import { useState } from "react"

export function FriendsTab() {
  const { user } = useGameStore()
  const [copied, setCopied] = useState(false)

  const referralLink = `https://t.me/10C_bot?start=${user.referralCode}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    const text = `Join me on 10C and start mining! Use my code: ${user.referralCode}`
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  const leaderboard = [
    { rank: 1, name: "CryptoKing", referrals: 156, reward: "10,000" },
    { rank: 2, name: "MiningPro", referrals: 134, reward: "7,500" },
    { rank: 3, name: "TON_Master", referrals: 98, reward: "5,000" },
    { rank: 4, name: "BlockHunter", referrals: 87, reward: "2,500" },
    { rank: 5, name: "DiamondHands", referrals: 76, reward: "1,000" },
  ]

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white text-glow-purple" style={{ fontFamily: "Tanker, sans-serif" }}>
          Invite Friends
        </h2>
        <p className="text-sm text-white/60">Earn 100 10C for each friend who joins</p>
      </div>

      <div className="glass rounded-2xl p-6 text-center">
        <Image src="/icons/heart.png" alt="Referral" width={80} height={80} className="mx-auto mb-4 icon-float" />
        <div className="mb-4">
          <p className="text-sm text-white/60">Your Referral Code</p>
          <p className="text-3xl font-bold text-cyan text-glow-cyan" style={{ fontFamily: "Tanker, sans-serif" }}>
            {user.referralCode}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            className="flex-1 bg-white/10 text-white border border-white/10 hover:bg-white/15"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" /> Copy Link
              </>
            )}
          </Button>
          <Button
            onClick={handleShare}
            className="flex-1 bg-cyan/20 text-cyan border border-cyan/30 glow-cyan hover:bg-cyan/30"
          >
            <Users className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white" style={{ fontFamily: "Tanker, sans-serif" }}>
            Your Stats
          </h3>
          <Gift className="h-5 w-5 text-cyan" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold text-white" style={{ fontFamily: "Tanker, sans-serif" }}>
              {user.referralCount}
            </p>
            <p className="text-xs text-white/60">Friends Invited</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold text-cyan" style={{ fontFamily: "Tanker, sans-serif" }}>
              {user.referralCount * 100}
            </p>
            <p className="text-xs text-white/60">10C Earned</p>
          </div>
        </div>
      </div>

      {/* Leaderboard with globe icon */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Image src="/icons/globe.png" alt="Leaderboard" width={24} height={24} className="icon-float" />
          <h3 className="text-sm font-semibold text-white/80">Top Referrers</h3>
        </div>
        <div className="glass rounded-2xl overflow-hidden">
          {leaderboard.map((item, index) => (
            <div
              key={item.rank}
              className={`flex items-center gap-3 p-3 ${
                index !== leaderboard.length - 1 ? "border-b border-white/10" : ""
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
                  item.rank === 1
                    ? "bg-gold/20 text-gold"
                    : item.rank === 2
                      ? "bg-silver/20 text-silver"
                      : item.rank === 3
                        ? "bg-bronze/20 text-bronze"
                        : "bg-white/10 text-white/60"
                }`}
              >
                {item.rank}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-white">{item.name}</p>
                <p className="text-xs text-white/60">{item.referrals} referrals</p>
              </div>
              <p className="text-sm font-semibold text-cyan">+{item.reward}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
