'use client'

import { 
  Box, 
  Container, 
  VStack, 
  HStack,
  Heading, 
  Text, 
  Image,
  Grid,
  GridItem,
  Avatar,
  Icon,
  Flex,
  Badge,
  IconButton,
  Spinner
} from '@chakra-ui/react'
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaTrash,
  FaHeart
} from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { Sidebar, MobileNavbar } from '../../components/LazyComponents'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'

const SavedEventCard = ({ event, onRemove }) => (
  <Box
    bg="gray.800"
    rounded="lg"
    overflow="hidden"
    transition="transform 0.3s ease"
    _hover={{ transform: "scale(1.02)" }}
    position="relative"
  >
    <Box position="relative">
      <Image
        src={event.image}
        alt={event.title}
        w="full"
        h={64}
        objectFit="cover"
        loading="lazy"
      />
      <IconButton
        icon={<Icon as={FaTrash} />}
        position="absolute"
        top={2}
        right={2}
        size="sm"
        colorScheme="red"
        bg="rgba(255, 0, 0, 0.8)"
        color="white"
        _hover={{
          bg: "red.600",
          transform: "scale(1.1)"
        }}
        transition="all 0.2s ease"
        onClick={(e) => {
          e.stopPropagation()
          onRemove(event.id)
        }}
        aria-label="Remove from saved"
        zIndex={1}
      />
    </Box>
    <Box p={4}>
      <HStack spacing={2} mb={2}>
        <Avatar
          size="sm"
          src={event.organizer?.avatar}
          name={event.organizer?.name}
        />
        <Text fontWeight="medium" fontSize="sm">
          {event.organizer?.name}
        </Text>
      </HStack>
      <Heading size="md" mb={1}>
        {event.title}
      </Heading>
      <Text color="gray.400" fontSize="sm" mb={3}>
        {event.description}
      </Text>
      <Flex justify="space-between" align="center" mb={3}>
        <HStack spacing={4} fontSize="sm" color="gray.400">
          <HStack spacing={1}>
            <Icon as={FaCalendarAlt} />
            <Text>{event.date}</Text>
          </HStack>
          <HStack spacing={1}>
            <Icon as={FaMapMarkerAlt} />
            <Text>{event.venue || event.location}</Text>
          </HStack>
        </HStack>
        <Badge colorScheme="teal" variant="solid">
          ₹{event.price}
        </Badge>
      </Flex>
    </Box>
  </Box>
)

const SavedPage = () => {
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only redirect on client side after mounting
    if (mounted && !loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [mounted, loading, isAuthenticated, router])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null
  }

  // Show loading while checking authentication
  if (loading) {
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

  // Remove event from saved
  const handleRemoveEvent = (eventId) => {
    // This would be implemented with the actual API call to remove from saved events
    console.log('Remove event:', eventId)
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
        {/* Header */}
        <Box
          p={6}
          borderBottom="1px solid"
          borderColor="gray.800"
        >
          <Container maxW="full">
            <VStack align="start" spacing={2}>
              <HStack spacing={3}>
                <Icon as={FaHeart} color="red.400" boxSize={8} />
                <Heading size="xl">Saved Events</Heading>
              </HStack>
              <Text color="gray.400">
                Events you've saved for later
              </Text>
              <Badge colorScheme="teal" variant="solid">
                {user.savedEvents?.length || 0} saved events
              </Badge>
            </VStack>
          </Container>
        </Box>

        {/* Saved Events Grid */}
        <Box p={6}>
          <Container maxW="full">
            {user.savedEvents && user.savedEvents.length > 0 ? (
              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                  xl: "repeat(4, 1fr)"
                }}
                gap={6}
              >
                {user.savedEvents.map((event) => (
                  <GridItem key={event._id}>
                    <SavedEventCard 
                      event={event} 
                      onRemove={handleRemoveEvent}
                    />
                  </GridItem>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" py={20}>
                <Icon as={FaHeart} boxSize={16} color="gray.500" mb={6} />
                <Heading size="lg" color="gray.400" mb={4}>
                  No Saved Events Yet
                </Heading>
                <Text color="gray.500" fontSize="lg">
                  Start exploring events and save the ones you like!
                </Text>
              </Box>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export default SavedPage
