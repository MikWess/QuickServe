'use client'

import { motion } from 'framer-motion'

interface LoadingScreenProps {
  backgroundImage?: string
}

export default function LoadingScreen({ 
  backgroundImage = '/images/loading-bg.jpg'
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${backgroundImage})`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* QuickServe Text - No Animation */}
        <div className="mb-12">
          <h1 className="text-8xl md:text-9xl font-bold text-white text-center drop-shadow-2xl">
            QuickServe
          </h1>
        </div>

        {/* Loading Bar - Single completion animation */}
        <div className="w-80 h-1 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: 1.8,
              ease: "easeInOut"
            }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>
    </div>
  )
} 