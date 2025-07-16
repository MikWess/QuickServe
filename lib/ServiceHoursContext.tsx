'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ServiceHour, ServiceStats, ClockState } from './types'
import { useAuth } from './AuthContext'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'

interface ServiceHoursContextType {
  serviceHours: ServiceHour[]
  stats: ServiceStats
  clockState: ClockState
  addServiceHour: (serviceHour: Omit<ServiceHour, 'id'>) => Promise<void>
  updateServiceHour: (id: string, updates: Partial<ServiceHour>) => Promise<void>
  deleteServiceHour: (id: string) => Promise<void>
  clockIn: (title: string, organization: string, category: string) => void
  clockOut: (notes?: string) => Promise<void>
}

const ServiceHoursContext = createContext<ServiceHoursContextType | undefined>(undefined)

// Convert Firestore Timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate()
  }
  if (timestamp && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000)
  }
  return new Date(timestamp)
}

export function ServiceHoursProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [serviceHours, setServiceHours] = useState<ServiceHour[]>([])
  const [clockState, setClockState] = useState<ClockState>({
    isClocked: false,
    currentSession: null,
    clockInTime: null
  })

  // Listen to service hours from Firestore
  useEffect(() => {
    if (!user) {
      setServiceHours([])
      return
    }

    console.log('Setting up Firestore query for user:', user.uid)
    const q = query(
      collection(db, 'serviceHours'),
      where('userId', '==', user.uid)
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('Firestore query snapshot received, size:', querySnapshot.size)
      const hours: ServiceHour[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        console.log('Document data:', doc.id, data)
        hours.push({
          id: doc.id,
          ...data,
          startTime: timestampToDate(data.startTime),
          endTime: data.endTime ? timestampToDate(data.endTime) : null,
        } as ServiceHour)
      })
      // Sort by startTime descending on client side
      hours.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      console.log('Processed service hours:', hours.length)
      setServiceHours(hours)
    })

    return unsubscribe
  }, [user])

  const calculateStats = (hours: ServiceHour[]): ServiceStats => {
    const now = new Date()
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const completedHours = hours.filter(h => h.isCompleted)
    const totalMinutes = completedHours.reduce((sum, h) => sum + h.duration, 0)
    
    const thisWeekMinutes = completedHours
      .filter(h => h.startTime >= weekStart)
      .reduce((sum, h) => sum + h.duration, 0)
    
    const thisMonthMinutes = completedHours
      .filter(h => h.startTime >= monthStart)
      .reduce((sum, h) => sum + h.duration, 0)

    return {
      totalHours: Math.round(totalMinutes / 60 * 10) / 10,
      thisWeekHours: Math.round(thisWeekMinutes / 60 * 10) / 10,
      thisMonthHours: Math.round(thisMonthMinutes / 60 * 10) / 10,
      completedSessions: completedHours.length,
      currentStreak: 5 // Mock streak
    }
  }

  const [stats, setStats] = useState<ServiceStats>(calculateStats(serviceHours))

  useEffect(() => {
    setStats(calculateStats(serviceHours))
  }, [serviceHours])

  const addServiceHour = async (serviceHour: Omit<ServiceHour, 'id'>) => {
    if (!user) return

    try {
      await addDoc(collection(db, 'serviceHours'), {
        ...serviceHour,
        userId: user.uid,
        startTime: serviceHour.startTime,
        endTime: serviceHour.endTime,
        createdAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error adding service hour:', error)
      throw error
    }
  }

  const updateServiceHour = async (id: string, updates: Partial<ServiceHour>) => {
    if (!user) return

    try {
      const docRef = doc(db, 'serviceHours', id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating service hour:', error)
      throw error
    }
  }

  const deleteServiceHour = async (id: string) => {
    if (!user) return

    try {
      const docRef = doc(db, 'serviceHours', id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting service hour:', error)
      throw error
    }
  }

  const clockIn = (title: string, organization: string, category: string) => {
    const clockInTime = new Date()
    setClockState({
      isClocked: true,
      currentSession: {
        title,
        organization,
        category,
        startTime: clockInTime,
        isCompleted: false
      },
      clockInTime
    })
  }

  const clockOut = async (notes?: string) => {
    if (clockState.currentSession && clockState.clockInTime) {
      const endTime = new Date()
      const duration = Math.round((endTime.getTime() - clockState.clockInTime.getTime()) / (1000 * 60))
      
      const newServiceHour: Omit<ServiceHour, 'id'> = {
        title: clockState.currentSession.title || 'Service Session',
        organization: clockState.currentSession.organization || 'Unknown',
        description: 'Service session completed via clock in/out',
        startTime: clockState.clockInTime,
        endTime: endTime,
        duration: duration,
        category: clockState.currentSession.category || 'General',
        isCompleted: true,
        notes: notes || 'Completed via clock out'
      }
      
      try {
        await addServiceHour(newServiceHour)
      } catch (error) {
        console.error('Error saving service hour:', error)
        throw error
      }
    }
    
    setClockState({
      isClocked: false,
      currentSession: null,
      clockInTime: null
    })
  }

  return (
    <ServiceHoursContext.Provider value={{
      serviceHours,
      stats,
      clockState,
      addServiceHour,
      updateServiceHour,
      deleteServiceHour,
      clockIn,
      clockOut
    }}>
      {children}
    </ServiceHoursContext.Provider>
  )
}

export function useServiceHours() {
  const context = useContext(ServiceHoursContext)
  if (context === undefined) {
    throw new Error('useServiceHours must be used within a ServiceHoursProvider')
  }
  return context
} 