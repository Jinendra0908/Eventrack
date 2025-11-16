'use client'

import { 
  Box, 
  Container, 
  VStack,
  Heading, 
  Text, 
  Input,
  Button,
  FormControl,
  FormLabel,
  Link as ChakraLink,
  Icon,
  useToast,
  Spinner
} from '@chakra-ui/react'
import { FaCalendarAlt } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [mounted, setMounted] = useState(false)
  const { login, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Redirect if already authenticated
    if (mounted && isAuthenticated) {
      router.push('/')
    }
  }, [mounted, isAuthenticated, router])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null
  }

  // Show loading while redirecting
  if (isAuthenticated) {
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
      return
    }

    await login(formData.email, formData.password)
  }

  return (
    <Box
      minH="100vh"
      bgGradient="linear(135deg, #000000 0%, #0a2626 100%)"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="md">
        {/* Logo/Branding */}
        <VStack spacing={8} mb={8} textAlign="center">
          <Icon as={FaCalendarAlt} boxSize={16} color="teal.300" />
          <VStack spacing={2}>
            <Heading size="2xl">EventTrack</Heading>
            <Text color="gray.400">Welcome back</Text>
          </VStack>
        </VStack>

        {/* Login Form */}
        <Box
          as="form"
          onSubmit={handleLogin}
          bg="rgba(0, 0, 0, 0.5)"
          rounded="lg"
          p={8}
          shadow="lg"
          backdropFilter="blur(10px)"
        >
          <Heading size="xl" mb={6} textAlign="center">
            Sign In
          </Heading>
          
          <VStack spacing={4}>
            {/* Email */}
            <FormControl>
              <FormLabel color="gray.400">Email</FormLabel>
              <Input
                type="email"
                placeholder="your@email.com"
                bg="rgba(255, 255, 255, 0.1)"
                border="1px solid"
                borderColor="teal.600"
                _focus={{
                  ring: 2,
                  ringColor: 'teal.300',
                  borderColor: 'teal.300'
                }}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </FormControl>
            
            {/* Password */}
            <FormControl>
              <FormLabel color="gray.400">Password</FormLabel>
              <Input
                type="password"
                placeholder="••••••••"
                bg="rgba(255, 255, 255, 0.1)"
                border="1px solid"
                borderColor="teal.600"
                _focus={{
                  ring: 2,
                  ringColor: 'teal.300',
                  borderColor: 'teal.300'
                }}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </FormControl>
            
            {/* Submit Button */}
            <Button
              type="submit"
              w="full"
              bgGradient="linear(135deg, teal.600 0%, #0a2626 100%)"
              color="white"
              _hover={{
                opacity: 0.9,
                transform: 'translateY(-1px)'
              }}
              _active={{
                transform: 'translateY(0)'
              }}
              size="lg"
              isLoading={loading}
              loadingText="Signing in..."
              spinner={<Spinner size="sm" />}
            >
              Sign In
            </Button>
          </VStack>
        </Box>

        {/* Signup Link */}
        <Box textAlign="center" mt={8}>
          <Text color="gray.400">
            Don't have an account?{' '}
            <ChakraLink as={Link} href="/signup" color="teal.300" _hover={{ textDecoration: 'underline' }} fontWeight="medium">
              Create account
            </ChakraLink>
          </Text>
        </Box>
      </Container>
    </Box>
  )
}

export default LoginPage
