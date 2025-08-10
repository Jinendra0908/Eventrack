'use client'

import { 
  Box, 
  Container, 
  VStack,
  Heading, 
  Text, 
  Button,
  Grid,
  GridItem,
  Icon,
  useToast,
  HStack,
  Badge
} from '@chakra-ui/react'
import { 
  FaMusic, 
  FaRunning, 
  FaGamepad, 
  FaPlane, 
  FaFilm,
  FaBook,
  FaCameraRetro,
  FaUtensils
} from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const PreferencesPage = () => {
  const [selectedHobbies, setSelectedHobbies] = useState([])
  const [mounted, setMounted] = useState(false)
  const toast = useToast()
  const router = useRouter()

  const hobbies = [
    { name: 'Music', icon: FaMusic, color: 'purple.400' },
    { name: 'Sports', icon: FaRunning, color: 'orange.400' },
    { name: 'Gaming', icon: FaGamepad, color: 'blue.400' },
    { name: 'Travel', icon: FaPlane, color: 'green.400' },
    { name: 'Movies', icon: FaFilm, color: 'red.400' },
    { name: 'Reading', icon: FaBook, color: 'teal.400' },
    { name: 'Photography', icon: FaCameraRetro, color: 'pink.400' },
    { name: 'Food', icon: FaUtensils, color: 'yellow.400' }
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleHobby = (hobbyName) => {
    setSelectedHobbies(prev => {
      if (prev.includes(hobbyName)) {
        return prev.filter(h => h !== hobbyName)
      } else {
        return [...prev, hobbyName]
      }
    })
  }

  const savePreferences = () => {
    if (selectedHobbies.length === 0) {
      toast({
        title: 'Select Interests',
        description: 'Please select at least one interest',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
      return
    }

    if (mounted) {
      localStorage.setItem('hobbies', JSON.stringify(selectedHobbies))
      
      toast({
        title: 'Preferences Saved!',
        description: 'Your interests have been saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
      
      router.push('/')
    }
  }

  return (
    <Box
      minH="100vh"
      bgGradient="linear(135deg, #000000 0%, #0a2626 100%)"
      color="white"
      py={8}
    >
      <Container maxW="2xl">
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading size="2xl">Choose Your Interests</Heading>
            <Text color="gray.400" fontSize="lg">
              Select the topics you're passionate about to personalize your experience
            </Text>
          </VStack>

          {/* Hobbies Grid */}
          <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={6} w="full">
            {hobbies.map((hobby) => (
              <GridItem key={hobby.name}>
                <VStack
                  spacing={3}
                  p={6}
                  bg={selectedHobbies.includes(hobby.name) ? "rgba(13, 148, 136, 0.3)" : "rgba(0, 0, 0, 0.5)"}
                  border="2px solid"
                  borderColor={selectedHobbies.includes(hobby.name) ? "teal.400" : "transparent"}
                  rounded="xl"
                  cursor="pointer"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-2px)",
                    bg: selectedHobbies.includes(hobby.name) ? "rgba(13, 148, 136, 0.4)" : "rgba(0, 0, 0, 0.7)"
                  }}
                  onClick={() => toggleHobby(hobby.name)}
                >
                  <Icon as={hobby.icon} boxSize={8} color={hobby.color} />
                  <Text fontWeight="medium">{hobby.name}</Text>
                </VStack>
              </GridItem>
            ))}
          </Grid>

          {/* Selected Count */}
          {selectedHobbies.length > 0 && (
            <HStack spacing={2}>
              <Text color="gray.400">Selected:</Text>
              <Badge colorScheme="teal" variant="solid">
                {selectedHobbies.length} interest{selectedHobbies.length !== 1 ? 's' : ''}
              </Badge>
            </HStack>
          )}

          {/* Action Buttons */}
          <VStack spacing={4} w="full" maxW="md">
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
              onClick={savePreferences}
            >
              Save Preferences
            </Button>
            
            <Button
              variant="ghost"
              color="gray.400"
              _hover={{
                color: "white",
                bg: "rgba(255, 255, 255, 0.1)"
              }}
              onClick={() => router.push('/')}
            >
              Skip for now
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}

export default PreferencesPage
