'use client'

import { 
  Box, 
  Container, 
  VStack, 
  HStack,
  Heading, 
  Text, 
  Input,
  Button,
  FormControl,
  FormLabel,
  Progress,
  Checkbox,
  Link as ChakraLink,
  Grid,
  GridItem,
  Icon,
  useToast,
  Spinner,
  Radio,
  RadioGroup,
  Stack
} from '@chakra-ui/react'
import { FaCalendarAlt } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'participant', // Default to participant
    agreeToTerms: false
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { register, loading, isAuthenticated } = useAuth()
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

  const calculatePasswordStrength = (password) => {
    let strength = 0
    
    if (password.length > 0) strength += 20
    if (password.length >= 8) strength += 20
    if (/[A-Z]/.test(password)) strength += 20
    if (/[0-9]/.test(password)) strength += 20
    if (/[^A-Za-z0-9]/.test(password)) strength += 20
    
    return strength
  }

  const getPasswordStrengthColor = (strength) => {
    if (strength < 40) return 'red.400'
    if (strength < 80) return 'orange.400'
    return 'green.400'
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password) {
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

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
      return
    }

    if (!formData.agreeToTerms) {
      toast({
        title: 'Terms Agreement Required',
        description: 'Please agree to the Terms of Service and Privacy Policy',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
      return
    }

    if (passwordStrength < 60) {
      toast({
        title: 'Weak Password',
        description: 'Please create a stronger password',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
      return
    }

    // Register user using AuthContext
    await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role
    })
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
            <Text color="gray.400">Create your account</Text>
          </VStack>
        </VStack>

        {/* Signup Form */}
        <Box
          as="form"
          onSubmit={handleSignup}
          bg="rgba(0, 0, 0, 0.5)"
          rounded="lg"
          p={8}
          shadow="lg"
          backdropFilter="blur(10px)"
        >
          <Heading size="xl" mb={6} textAlign="center">
            Get Started
          </Heading>
          
          <VStack spacing={4}>
            {/* Name Fields */}
            <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
              <GridItem>
                <FormControl>
                  <FormLabel color="gray.400">First Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="John"
                    bg="rgba(255, 255, 255, 0.1)"
                    border="1px solid"
                    borderColor="teal.600"
                    _focus={{
                      ring: 2,
                      ringColor: 'teal.300',
                      borderColor: 'teal.300'
                    }}
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel color="gray.400">Last Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Doe"
                    bg="rgba(255, 255, 255, 0.1)"
                    border="1px solid"
                    borderColor="teal.600"
                    _focus={{
                      ring: 2,
                      ringColor: 'teal.300',
                      borderColor: 'teal.300'
                    }}
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </FormControl>
              </GridItem>
            </Grid>
            
            {/* Username */}
            <FormControl>
              <FormLabel color="gray.400">Username</FormLabel>
              <Input
                type="text"
                placeholder="@username"
                bg="rgba(255, 255, 255, 0.1)"
                border="1px solid"
                borderColor="teal.600"
                _focus={{
                  ring: 2,
                  ringColor: 'teal.300',
                  borderColor: 'teal.300'
                }}
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
              />
            </FormControl>
            
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
              {formData.password && (
                <Progress
                  value={passwordStrength}
                  colorScheme={passwordStrength < 40 ? 'red' : passwordStrength < 80 ? 'orange' : 'green'}
                  size="sm"
                  mt={2}
                  bg="gray.700"
                  rounded="full"
                />
              )}
            </FormControl>
            
            {/* Confirm Password */}
            <FormControl>
              <FormLabel color="gray.400">Confirm Password</FormLabel>
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
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              />
            </FormControl>

            {/* Role Selection */}
            <FormControl>
              <FormLabel color="gray.400">I am joining as a:</FormLabel>
              <RadioGroup 
                value={formData.role} 
                onChange={(value) => handleInputChange('role', value)}
              >
                <Stack direction="column" spacing={3}>
                  <Box>
                    <Radio 
                      value="participant" 
                      colorScheme="teal"
                      _focus={{
                        ring: 2,
                        ringColor: 'teal.300'
                      }}
                    >
                      <Text color="white" fontWeight="medium" ml={2}>Participant</Text>
                    </Radio>
                    <Text fontSize="sm" color="gray.400" ml={6} mt={1}>
                      I want to discover and attend events
                    </Text>
                  </Box>
                  <Box>
                    <Radio 
                      value="host" 
                      colorScheme="teal"
                      _focus={{
                        ring: 2,
                        ringColor: 'teal.300'
                      }}
                    >
                      <Text color="white" fontWeight="medium" ml={2}>Host/Organizer</Text>
                    </Radio>
                    <Text fontSize="sm" color="gray.400" ml={6} mt={1}>
                      I want to create and manage events
                    </Text>
                  </Box>
                </Stack>
              </RadioGroup>
            </FormControl>
            
            {/* Terms Checkbox */}
            <FormControl>
              <Checkbox
                isChecked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                colorScheme="teal"
              >
                <Text fontSize="sm" color="gray.400">
                  I agree to the{' '}
                  <ChakraLink color="teal.300" _hover={{ textDecoration: 'underline' }}>
                    Terms of Service
                  </ChakraLink>
                  {' '}and{' '}
                  <ChakraLink color="teal.300" _hover={{ textDecoration: 'underline' }}>
                    Privacy Policy
                  </ChakraLink>
                </Text>
              </Checkbox>
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
              loadingText="Creating account..."
              spinner={<Spinner size="sm" />}
            >
              Create Account
            </Button>
          </VStack>
        </Box>

        {/* Login Link */}
        <Box textAlign="center" mt={8}>
          <Text color="gray.400">
            Already have an account?{' '}
            <ChakraLink as={Link} href="/login" color="teal.300" _hover={{ textDecoration: 'underline' }} fontWeight="medium">
              Log in
            </ChakraLink>
          </Text>
        </Box>
      </Container>
    </Box>
  )
}

export default SignupPage
