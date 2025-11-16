'use client'

import React from 'react'
import { Box, Text, Button, VStack } from '@chakra-ui/react'

class HydrationErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log hydration errors specifically
    if (error.message.includes('Hydration') || error.message.includes('hydration')) {
      console.error('Hydration Error Caught:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box 
          p={6} 
          textAlign="center" 
          bg="red.50" 
          border="1px solid" 
          borderColor="red.200" 
          borderRadius="md"
        >
          <VStack spacing={4}>
            <Text fontSize="lg" fontWeight="bold" color="red.600">
              Something went wrong
            </Text>
            <Text color="red.500" fontSize="sm">
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            <Button 
              size="sm" 
              colorScheme="red" 
              variant="outline"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </Button>
          </VStack>
        </Box>
      )
    }

    return this.props.children
  }
}

export default HydrationErrorBoundary