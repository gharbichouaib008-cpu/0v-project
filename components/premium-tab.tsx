"use client"

import { useGameStore } from "@/lib/game-store"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Check, Crown, Sparkles, Zap, Gift, Shield } from "lucide-react"

export function PremiumTab() {
  const { user, activatePremium } = useGameStore()

  const benefits = [
    { icon: <Zap className="h-5 w-5" />, text: "1.5x Mining Rewards" },
    { icon: <Gift className="h-5 w-5" />, text: "2x Daily Check-in Bonus" },
    { icon: <Sparkles className="h-5 w-5" />, text: "Exclusive Premium Badge" },
    { icon: <Shield className="h-5 w-5" />, text: "Priority Support" },
  ]

  const plans = [
    { days: 7, price: "0.5 TON", label: "1 Week" },
    { days: 30, price: "1.5 TON", label: "1 Month", popular: true },
    { days: 90, price: "3.5 TON", label: "3 Months" },
  ]

  const handlePurchase = (days: number) => {
    activatePremium(days)
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/30 mb-4">
          <Crown className="h-5 w-5 text-gold" />
          <span className="font-semibold text-gold">Premium</span>
        </div>
        <h2 className="text-2xl font-bold text-white text-glow-purple" style={{ fontFamily: "Tanker, sans-serif" }}>
          Unlock Premium
        </h2>
        <p className="text-sm text-white/60">Maximize your earning potential</p>
      </div>

      {user.isPremium && (
        <div className="glass rounded-2xl p-4 border-gold/30 glow-gold">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
              <Crown className="h-6 w-6 text-gold" />
            </div>
            <div>
              <p className="font-semibold text-gold" style={{ fontFamily: "Tanker, sans-serif" }}>
                Premium Active
              </p>
              <p className="text-xs text-white/60">
                Expires: {user.premiumExpiresAt ? new Date(user.premiumExpiresAt).toLocaleDateString() : "Never"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Card with phone icon */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Image src="/icons/phone.png" alt="Premium" width={50} height={50} className="icon-float" />
          <h3 className="font-semibold text-white" style={{ fontFamily: "Tanker, sans-serif" }}>
            Premium Benefits
          </h3>
        </div>
        <div className="space-y-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-gold border border-gold/30">
                {benefit.icon}
              </div>
              <span className="font-medium text-white">{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white/60">Choose Your Plan</h3>
        {plans.map((plan) => (
          <div
            key={plan.days}
            className={`glass rounded-2xl p-4 relative overflow-hidden ${plan.popular ? "border-cyan/50" : ""}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-cyan text-black text-xs font-semibold px-3 py-1 rounded-bl-lg">
                Popular
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white" style={{ fontFamily: "Tanker, sans-serif" }}>
                  {plan.label}
                </p>
                <p className="text-sm text-white/60">{plan.price}</p>
              </div>
              <Button
                onClick={() => handlePurchase(plan.days)}
                disabled={user.isPremium}
                className={
                  plan.popular
                    ? "bg-cyan/20 text-cyan border border-cyan/30 glow-cyan hover:bg-cyan/30"
                    : "bg-white/10 text-white border border-white/10 hover:bg-white/15"
                }
              >
                {user.isPremium ? (
                  <>
                    <Check className="mr-1 h-4 w-4" /> Active
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-center text-white/50">Payment via TON wallet. Connect your wallet to proceed.</p>
    </div>
  )
}
