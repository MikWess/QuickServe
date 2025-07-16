export interface ServiceHour {
  id: string
  title: string
  organization: string
  description: string
  startTime: Date
  endTime: Date | null
  duration: number // in minutes
  category: string
  isCompleted: boolean
  notes?: string
  supervisor?: string
  location?: string
}

export interface ServiceStats {
  totalHours: number
  thisWeekHours: number
  thisMonthHours: number
  completedSessions: number
  currentStreak: number
}

export interface ClockState {
  isClocked: boolean
  currentSession: Partial<ServiceHour> | null
  clockInTime: Date | null
}

export interface UserProfile {
  id: string // Firebase Auth UID
  displayName: string
  email: string
  bio?: string
  profileImageUrl?: string
  location?: string
  organization?: string
  joinDate: Date
  createdAt: Date
  updatedAt?: Date
} 