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
  useToast
} from '@chakra-ui/react'
import { FaCalendarAlt } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [mounted, setMounted] = useState(false)
  const toast = useToast()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLogin = () => {
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

    if (mounted) {
      // Check if user exists in localStorage (simple demo logic)
      const savedEmail = localStorage.getItem('email')
      
      if (savedEmail === formData.email) {
        toast({
          title: 'Welcome Back!',
          description: 'Successfully logged in',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
        
        router.push('/')
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
      }
    }
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
              onClick={handleLogin}
            >
              Sign In
            </Button>
          </VStack>
        </Box>

        {/* Signup Link */}
        <Box textAlign="center" mt={8}>
          <Text color="gray.400">
            Don't have an account?{' '}
            <Link href="/signup" passHref>
              <ChakraLink color="teal.300" _hover={{ textDecoration: 'underline' }} fontWeight="medium">
                Create account
              </ChakraLink>
            </Link>
          </Text>
        </Box>
      </Container>
    </Box>
  )
}

export default LoginPage
