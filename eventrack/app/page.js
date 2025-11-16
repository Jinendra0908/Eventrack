'use client'

import { Box, Flex, Text, Heading, VStack, useDisclosure, IconButton, Button, Link as ChakraLink } from '@chakra-ui/react'
import { useEffect, useState, Suspense } from 'react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { Feed, Sidebar, RightSidebar, MobileNavbar } from '../components/LazyComponents'
import LoadingSpinner from '../components/LoadingSpinner'
import ClientOnly from '../components/ClientOnly'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <Box 
        minH="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bgGradient="linear(135deg, #000000 0%, #0a2626 100%)"
      >
        <LoadingSpinner />
      </Box>
    )
  }

  // Show loading while auth is being checked
  if (loading) {
    return (
      <Box 
        minH="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bgGradient="linear(135deg, #000000 0%, #0a2626 100%)"
      >
        <LoadingSpinner />
      </Box>
    )
  }

  return (
    <Box
      minH="100vh"
      bgGradient="linear(135deg, #000000 0%, #0a2626 100%)"
      color="white"
      position="relative"
    >
      {/* Mobile Header */}
      <Box
        display={{ base: 'flex', md: 'none' }}
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        bg="rgba(10, 38, 38, 0.95)"
        backdropFilter="blur(10px)"
        p={4}
        justifyContent="space-between"
        alignItems="center"
      >
        <IconButton
          icon={<HamburgerIcon />}
          variant="ghost"
          color="white"
          onClick={onOpen}
          aria-label="Open menu"
        />
        <Heading size="md" color="teal.300">EventTrack</Heading>
        <Box w={10} /> {/* Spacer for centering */}
      </Box>

      {/* Desktop Sidebar */}
      <ClientOnly>
        <Sidebar isOpen={isOpen} onClose={onClose} />
      </ClientOnly>

      {/* Mobile Bottom Navigation */}
      <ClientOnly>
        <MobileNavbar />
      </ClientOnly>

      {/* Main Content */}
      <Flex
        ml={{ base: 0, md: "256px" }}
        mr={{ base: 0, xl: "320px" }}
        justify="center"
        minH="100vh"
        pt={{ base: "60px", md: 0 }}
        pb={{ base: "80px", md: 0 }}
      >
        <Box
          flex={1}
          overflowY="auto"
          py={6}
          px={{ base: 2, md: 6 }}
          maxW={{ base: "100%", md: "2xl", lg: "4xl" }}
        >
          {/* Welcome Message */}
          <ClientOnly>
            <VStack spacing={4} mb={6} textAlign="center" px={4}>
              {user ? (
                <>
                  <Heading 
                    size={{ base: "sm", md: "md" }} 
                    color="teal.300"
                  >
                    Welcome back, {user.username}!
                  </Heading>
                  <Text fontSize="sm" color="gray.400">
                    {user.firstName} {user.lastName}
                  </Text>
                </>
              ) : (
                <>
                  <Heading 
                    size={{ base: "lg", md: "xl" }} 
                    color="teal.300"
                  >
                    Welcome to EventTrack
                  </Heading>
                  <Text fontSize="md" color="gray.400" maxW="md">
                    Discover amazing events happening around you. Join communities, connect with people, and never miss out on what matters to you.
                  </Text>
                  <VStack spacing={3} mt={4}>
                    <Button
                      as={Link}
                      href="/signup"
                      colorScheme="teal"
                      size="lg"
                      bgGradient="linear(135deg, teal.600 0%, #0a2626 100%)"
                      _hover={{ opacity: 0.9 }}
                    >
                      Get Started
                    </Button>
                    <Text 
                      as={Link}
                      href="/login"
                      color="teal.300" 
                      _hover={{ textDecoration: 'underline' }}
                    >
                      Already have an account? Sign in
                    </Text>
                  </VStack>
                </>
              )}
            </VStack>
          </ClientOnly>

          {/* Feed */}
          <Suspense fallback={<LoadingSpinner message="Loading posts..." />}>
            <Feed />
          </Suspense>
        </Box>
      </Flex>

      {/* Right Sidebar - Desktop only */}
      <Suspense fallback={null}>
        <RightSidebar />
      </Suspense>
    </Box>
  )
}
