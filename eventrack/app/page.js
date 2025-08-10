'use client'

import { Box, Flex, Text, Heading, VStack, useDisclosure, IconButton } from '@chakra-ui/react'
import { useEffect, useState, Suspense } from 'react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { Feed, Sidebar, RightSidebar, MobileNavbar } from '../components/LazyComponents'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Home() {
  const [username, setUsername] = useState('')
  const [hobbies, setHobbies] = useState([])
  const [mounted, setMounted] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true)
    
    // Get user data from localStorage with debounced execution
    const timeoutId = setTimeout(() => {
      const storedUsername = localStorage.getItem('username')
      const storedHobbies = JSON.parse(localStorage.getItem('hobbies') || '[]')
      
      if (storedUsername) setUsername(storedUsername)
      if (storedHobbies) setHobbies(storedHobbies)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [])

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
      <Sidebar isOpen={isOpen} onClose={onClose} />

      {/* Mobile Bottom Navigation */}
      <MobileNavbar />

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
          {/* Welcome Message (if user data exists) */}
          {mounted && username && (
            <VStack spacing={4} mb={6} textAlign="center" px={4}>
              <Heading 
                size={{ base: "sm", md: "md" }} 
                color="teal.300"
              >
                Welcome, {username}!
              </Heading>
              {hobbies.length > 0 && (
                <VStack spacing={3}>
                  <Text fontSize="sm" color="gray.400">Your interests:</Text>
                  <Flex wrap="wrap" gap={2} justify="center" maxW="md">
                    {hobbies.map((hobby, index) => (
                      <Text
                        key={index}
                        px={3}
                        py={1}
                        bg="teal.900"
                        rounded="full"
                        fontSize="xs"
                        whiteSpace="nowrap"
                      >
                        {hobby}
                      </Text>
                    ))}
                  </Flex>
                </VStack>
              )}
            </VStack>
          )}

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
