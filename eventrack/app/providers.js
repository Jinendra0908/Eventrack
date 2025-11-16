'use client'

import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import { AuthProvider } from '../contexts/AuthContext'

export function Providers({ children }) {
  return (
    <ChakraProvider 
      theme={theme} 
      toastOptions={{ defaultOptions: { position: 'top' } }}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </ChakraProvider>
  )
}
