import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface UserStats {
  balance: number
  totalMined: number
  miningRate: number
  lastClaimTime: number
  checkInStreak: number
  lastCheckIn: string | null
  level: number
  experience: number
  referralCount: number
  referralCode: string
  isPremium: boolean
  premiumExpiresAt: number | null
  upgrades: {
    miningSpeed: number
    miningCapacity: number
    autoCollect: boolean
  }
  completedTasks: string[]
}

interface GameState {
  user: UserStats
  pendingCoins: number
  isInitialized: boolean

  // Actions
  initializeUser: (telegramId?: string) => void
  claimCoins: () => number
  performCheckIn: () => { success: boolean; reward: number; newStreak: number }
  purchaseUpgrade: (type: "miningSpeed" | "miningCapacity" | "autoCollect") => boolean
  activatePremium: (days: number) => void
  addReferral: () => void
  calculatePendingCoins: () => number
  completeTask: (taskId: string, reward: number) => boolean
  checkAutoCollect: () => number
}

const UPGRADE_COSTS = {
  miningSpeed: [100, 500, 2000, 5000, 15000],
  miningCapacity: [200, 800, 3000, 8000, 20000],
  autoCollect: [5000],
}

const MINING_RATES = [10, 25, 50, 100, 200, 500] // coins per hour based on speed level
const CAPACITY_MULTIPLIERS = [1, 2, 4, 8, 16, 32] // hours of storage

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      user: {
        balance: 0,
        totalMined: 0,
        miningRate: 10,
        lastClaimTime: Date.now(),
        checkInStreak: 0,
        lastCheckIn: null,
        level: 1,
        experience: 0,
        referralCount: 0,
        referralCode: "",
        isPremium: false,
        premiumExpiresAt: null,
        upgrades: {
          miningSpeed: 0,
          miningCapacity: 0,
          autoCollect: false,
        },
        completedTasks: [],
      },
      pendingCoins: 0,
      isInitialized: false,

      initializeUser: (telegramId) => {
        const state = get()
        if (state.isInitialized) return

        const referralCode = telegramId
          ? `10C${telegramId.slice(-6).toUpperCase()}`
          : `10C${Math.random().toString(36).substring(2, 8).toUpperCase()}`

        set((state) => ({
          isInitialized: true,
          user: {
            ...state.user,
            referralCode,
            lastClaimTime: Date.now(),
          },
        }))
      },

      claimCoins: () => {
        const state = get()
        const pending = state.calculatePendingCoins()

        if (pending <= 0) return 0

        const premiumBonus = state.user.isPremium ? 1.5 : 1
        const totalClaim = Math.floor(pending * premiumBonus)

        set((state) => ({
          user: {
            ...state.user,
            balance: state.user.balance + totalClaim,
            totalMined: state.user.totalMined + totalClaim,
            lastClaimTime: Date.now(),
            experience: state.user.experience + Math.floor(totalClaim / 10),
          },
          pendingCoins: 0,
        }))

        return totalClaim
      },

      performCheckIn: () => {
        const state = get()
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()

        if (state.user.lastCheckIn === today) {
          return { success: false, reward: 0, newStreak: state.user.checkInStreak }
        }

        const newStreak = state.user.lastCheckIn === yesterday ? state.user.checkInStreak + 1 : 1

        const baseReward = 50
        const streakBonus = Math.min(newStreak, 7) * 10
        const premiumMultiplier = state.user.isPremium ? 2 : 1
        const reward = (baseReward + streakBonus) * premiumMultiplier

        set((state) => ({
          user: {
            ...state.user,
            balance: state.user.balance + reward,
            checkInStreak: newStreak,
            lastCheckIn: today,
            experience: state.user.experience + 25,
          },
        }))

        return { success: true, reward, newStreak }
      },

      purchaseUpgrade: (type) => {
        const state = get()
        const currentLevel =
          type === "autoCollect" ? (state.user.upgrades.autoCollect ? 1 : 0) : state.user.upgrades[type]

        const costs = UPGRADE_COSTS[type]
        if (currentLevel >= costs.length) return false

        const cost = costs[currentLevel]
        if (state.user.balance < cost) return false

        set((state) => {
          const newUpgrades = { ...state.user.upgrades }
          if (type === "autoCollect") {
            newUpgrades.autoCollect = true
          } else {
            newUpgrades[type] = currentLevel + 1
          }

          const newMiningRate = MINING_RATES[newUpgrades.miningSpeed]

          return {
            user: {
              ...state.user,
              balance: state.user.balance - cost,
              upgrades: newUpgrades,
              miningRate: newMiningRate,
              experience: state.user.experience + 50,
            },
          }
        })

        return true
      },

      activatePremium: (days) => {
        set((state) => ({
          user: {
            ...state.user,
            isPremium: true,
            premiumExpiresAt: Date.now() + days * 86400000,
          },
        }))
      },

      addReferral: () => {
        const referralReward = 100
        set((state) => ({
          user: {
            ...state.user,
            referralCount: state.user.referralCount + 1,
            balance: state.user.balance + referralReward,
          },
        }))
      },

      calculatePendingCoins: () => {
        const state = get()
        const now = Date.now()
        const elapsed = now - state.user.lastClaimTime
        const hoursElapsed = elapsed / (1000 * 60 * 60)

        const maxHours = CAPACITY_MULTIPLIERS[state.user.upgrades.miningCapacity]
        const cappedHours = Math.min(hoursElapsed, maxHours)

        return Math.floor(cappedHours * state.user.miningRate)
      },

      completeTask: (taskId, reward) => {
        const state = get()
        if (state.user.completedTasks.includes(taskId)) return false

        const premiumMultiplier = state.user.isPremium ? 1.5 : 1
        const finalReward = Math.floor(reward * premiumMultiplier)

        set((state) => ({
          user: {
            ...state.user,
            balance: state.user.balance + finalReward,
            completedTasks: [...state.user.completedTasks, taskId],
            experience: state.user.experience + 25,
          },
        }))

        return true
      },

      checkAutoCollect: () => {
        const state = get()
        if (!state.user.upgrades.autoCollect) return 0

        const pending = state.calculatePendingCoins()
        const maxHours = CAPACITY_MULTIPLIERS[state.user.upgrades.miningCapacity]
        const maxPending = state.user.miningRate * maxHours

        // Auto-collect when storage is 95% full
        if (pending >= maxPending * 0.95) {
          return state.claimCoins()
        }

        return 0
      },
    }),
    {
      name: "10c-game-storage",
    },
  ),
)
