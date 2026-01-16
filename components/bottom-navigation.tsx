"use client"

import Image from "next/image"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "home", label: "Home", icon: "/icons/sphere.png" },
  { id: "upgrades", label: "Upgrades", icon: "/icons/chart.png" },
  { id: "tasks", label: "Tasks", icon: "/icons/hand.png" },
  { id: "earn", label: "Earn", icon: "/icons/present.png" },
  { id: "friends", label: "Friends", icon: "/icons/heart.png" },
  { id: "premium", label: "Premium", icon: "/icons/phone.png" },
]

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="glass-strong fixed bottom-0 left-0 right-0 z-50 px-1 pb-safe">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 transition-all ${
                isActive ? "bg-cyan/20 border border-cyan/30" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Image
                src={tab.icon || "/placeholder.svg"}
                alt={tab.label}
                width={28}
                height={28}
                className={`transition-all ${isActive ? "icon-float scale-110" : "opacity-70"}`}
              />
              <span className={`text-[10px] font-medium ${isActive ? "text-cyan" : "text-white/60"}`}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
