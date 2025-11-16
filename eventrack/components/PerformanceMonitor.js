'use client'

import { useEffect, useState } from 'react'

const PerformanceMonitor = () => {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return
    
    // Web Vitals monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          console.log('Page Load Time:', entry.loadEventEnd - entry.fetchStart, 'ms')
        }
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime, 'ms')
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime, 'ms')
        }
      }
    })

    // Observe different performance metrics
    observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'first-input'] })

    // Cleanup
    return () => observer.disconnect()
  }, [isClient])

  return null
}

export default PerformanceMonitor
