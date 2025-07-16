'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from './firebase'
import { useAuth } from './AuthContext'
import { UserProfile } from './types'

interface ProfileContextType {
  profile: UserProfile | null
  loading: boolean
  createProfile: (profileData: Partial<UserProfile>) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Load profile when user changes
  useEffect(() => {
    if (user) {
      loadProfile()
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      const profileDoc = await getDoc(doc(db, 'userProfiles', user.uid))
      
      if (profileDoc.exists()) {
        const data = profileDoc.data()
        setProfile({
          ...data,
          joinDate: data.joinDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate(),
        } as UserProfile)
      } else {
        // Create a default profile if one doesn't exist
        await createDefaultProfile()
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const createDefaultProfile = async () => {
    if (!user) return

    const defaultProfile: UserProfile = {
      id: user.uid,
      displayName: user.displayName || 'Anonymous User',
      email: user.email || '',
      bio: '',
      joinDate: new Date(),
      createdAt: new Date(),
    }

    await createProfile(defaultProfile)
  }

  const createProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      const now = new Date()
      const newProfile: UserProfile = {
        id: user.uid,
        displayName: user.displayName || 'Anonymous User',
        email: user.email || '',
        joinDate: now,
        createdAt: now,
        ...profileData,
      }

      await setDoc(doc(db, 'userProfiles', user.uid), {
        ...newProfile,
        joinDate: Timestamp.fromDate(newProfile.joinDate),
        createdAt: Timestamp.fromDate(newProfile.createdAt),
        updatedAt: Timestamp.fromDate(now),
      })

      setProfile(newProfile)
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) throw new Error('User and profile must be available')

    try {
      const now = new Date()
      const updatedProfile = { ...profile, ...updates, updatedAt: now }

      const firestoreUpdates: any = { ...updates }
      if (updates.joinDate) {
        firestoreUpdates.joinDate = Timestamp.fromDate(updates.joinDate)
      }
      firestoreUpdates.updatedAt = Timestamp.fromDate(now)

      await updateDoc(doc(db, 'userProfiles', user.uid), firestoreUpdates)
      setProfile(updatedProfile)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const refreshProfile = async () => {
    await loadProfile()
  }

  const value = {
    profile,
    loading,
    createProfile,
    updateProfile,
    refreshProfile,
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
} 