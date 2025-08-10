'use client'

import dynamic from 'next/dynamic'
import LoadingSpinner from './LoadingSpinner'

// Lazy load heavy components
const Feed = dynamic(() => import('./Feed'), {
  loading: () => <LoadingSpinner message="Loading feed..." />,
  ssr: false
})

const Sidebar = dynamic(() => import('./Sidebar'), {
  loading: () => null,
  ssr: false
})

const RightSidebar = dynamic(() => import('./RightSidebar'), {
  loading: () => null,
  ssr: false
})

const MobileNavbar = dynamic(() => import('./MobileNavbar'), {
  loading: () => null,
  ssr: false
})

export { Feed, Sidebar, RightSidebar, MobileNavbar }
