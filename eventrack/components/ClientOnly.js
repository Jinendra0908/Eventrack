'use client'

import { useState, useEffect } from 'react'

/**
 * ClientOnly component prevents hydration mismatches by only rendering
 * children on the client side after hydration is complete.
 */
const ClientOnly = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return fallback
  }

  return children
}

export default ClientOnly