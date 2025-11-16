'use client'

import { 
  Box, 
  Container, 
  VStack,
  Heading, 
  Text,
  Icon,
  Spinner
} from '@chakra-ui/react'
import { FaBell } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { Sidebar, MobileNavbar } from '../../components/LazyComponents'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'

const NotificationsPage = () => {
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated
    if (mounted && !loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [mounted, loading, isAuthenticated, router])

  // Show loading while checking authentication or not mounted
  if (!mounted || loading) {
    return (
      <Box 
        minH="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bgGradient="linear(135deg, #000000 0%, #0a2626 100%)"
      >
        <Spinner size="xl" color="teal.300" />
      </Box>
    )
  }

  // Show loading while redirecting
  if (!isAuthenticated) {
    return (
      <Box 
        minH="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bgGradient="linear(135deg, #000000 0%, #0a2626 100%)"
      >
        <Spinner size="xl" color="teal.300" />
      </Box>
    )
  }

  return (
    <Box
      minH="100vh"
      bgGradient="linear(135deg, #000000 0%, #0a2626 100%)"
      color="white"
    >
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Bottom Navigation */}
      <MobileNavbar />

      {/* Main Content */}
      <Box
        ml={{ base: 0, md: "256px" }}
        minH="100vh"
        overflowY="auto"
        pt={{ base: "60px", md: 0 }}
        pb={{ base: "80px", md: 0 }}
      >
        <Container maxW="2xl" py={8}>
          <VStack spacing={8} align="stretch">
            <VStack spacing={4} textAlign="center">
              <Icon as={FaBell} boxSize={16} color="teal.300" />
              <Heading size="xl">Notifications</Heading>
              <Text color="gray.400" fontSize="lg">
                Stay updated with your latest activity
              </Text>
            </VStack>

            <Box textAlign="center" py={20}>
              <Icon as={FaBell} boxSize={16} color="gray.500" mb={6} />
              <Heading size="lg" color="gray.400" mb={4}>
                No Notifications Yet
              </Heading>
              <Text color="gray.500" fontSize="lg">
                You'll see notifications about your events and interactions here.
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

export default NotificationsPage
