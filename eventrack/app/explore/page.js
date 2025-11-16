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
  Image,
  Grid,
  GridItem,
  Avatar,
  Icon,
  InputGroup,
  InputLeftElement,
  Flex,
  Badge,
  IconButton,
  useToast
} from '@chakra-ui/react'
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaBookmark,
  FaRegBookmark,
  FaUserPlus,
  FaCheck
} from 'react-icons/fa'
import { useState, memo, useEffect } from 'react'
import { Sidebar, MobileNavbar } from '../../components/LazyComponents'

const EventCard = memo(({ event, onSave, isSaved, onRegister, isRegistered, mounted }) => (
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
      {mounted && (
        <IconButton
          icon={<Icon as={isSaved ? FaBookmark : FaRegBookmark} />}
          position="absolute"
          top={2}
          right={2}
          size="sm"
          colorScheme={isSaved ? "red" : "gray"}
          bg={isSaved ? "red.500" : "rgba(0, 0, 0, 0.6)"}
          color="white"
          _hover={{
            bg: isSaved ? "red.600" : "rgba(0, 0, 0, 0.8)",
            transform: "scale(1.1)"
          }}
          transition="all 0.2s ease"
          onClick={(e) => {
            e.stopPropagation()
            onSave(event)
          }}
          aria-label={isSaved ? "Remove from saved" : "Save event"}
          zIndex={1}
        />
      )}
    </Box>
    <Box p={4}>
      <HStack spacing={2} mb={2}>
        <Avatar
          size="sm"
          src={event.organizer.avatar}
          name={event.organizer.name}
        />
        <Text fontWeight="medium" fontSize="sm">
          {event.organizer.name}
        </Text>
      </HStack>
      <Heading size="md" mb={1}>
        {event.title}
      </Heading>
      <Text color="gray.400" fontSize="sm" mb={3} noOfLines={2}>
        {event.description}
      </Text>
      <VStack spacing={3} align="stretch">
        <Flex justify="space-between" fontSize="sm" color="gray.400">
          <HStack spacing={1}>
            <Icon as={FaCalendarAlt} />
            <Text>{event.date}</Text>
          </HStack>
          <HStack spacing={1}>
            <Icon as={FaMapMarkerAlt} />
            <Text noOfLines={1}>{event.location}</Text>
          </HStack>
        </Flex>
        {mounted && (
          <Button
            leftIcon={<Icon as={isRegistered ? FaCheck : FaUserPlus} />}
            size="sm"
            colorScheme={isRegistered ? "green" : "teal"}
            variant={isRegistered ? "solid" : "outline"}
            width="full"
            onClick={(e) => {
              e.stopPropagation()
              onRegister(event)
            }}
            isDisabled={isRegistered}
          >
            {isRegistered ? "Registered" : "Register for Event"}
          </Button>
        )}
      </VStack>
    </Box>
  </Box>
))

EventCard.displayName = 'EventCard'

const CategoryButton = memo(({ category, isActive, onClick }) => (
  <Button
    size="sm"
    px={4}
    py={1}
    bg={isActive ? "teal.800" : "transparent"}
    color="white"
    _hover={{ bg: isActive ? "teal.700" : "gray.800" }}
    rounded="full"
    fontWeight="medium"
    onClick={() => onClick(category)}
    whiteSpace="nowrap"
  >
    {category}
  </Button>
))

CategoryButton.displayName = 'CategoryButton'

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [savedEvents, setSavedEvents] = useState([])
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const toast = useToast()

  // Load saved events from localStorage and fetch events from API
  useEffect(() => {
    setMounted(true)
    
    // Load saved events from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedEvents')
      if (saved) {
        try {
          setSavedEvents(JSON.parse(saved))
        } catch (error) {
          console.error('Error loading saved events:', error)
        }
      }
      
      // Load registered events from localStorage
      const registered = localStorage.getItem('registeredEvents')
      if (registered) {
        try {
          setRegisteredEvents(JSON.parse(registered))
        } catch (error) {
          console.error('Error loading registered events:', error)
        }
      }
    }
    
    // Fetch events from API
    fetchEvents()
  }, [])

  // Fetch events from database
  const fetchEvents = async (category = 'All', search = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (category !== 'All') {
        params.append('category', category)
      }
      
      if (search) {
        params.append('search', search)
      }
      
      const response = await fetch(`/api/events?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setEvents(data.data.events || [])
      } else {
        console.error('Error fetching events:', data.error)
        toast({
          title: "Error",
          description: "Failed to load events. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      toast({
        title: "Error",
        description: "Failed to connect to server. Please check your internet connection.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  // Refetch events when category or search changes
  useEffect(() => {
    if (mounted) {
      fetchEvents(activeCategory, searchQuery)
    }
  }, [activeCategory, searchQuery, mounted])

  // Save event function
  const handleSaveEvent = (event) => {
    const eventWithExtraData = {
      ...event,
      id: event._id || event.id, // Use MongoDB _id or fallback to id
      venue: event.venue || event.location, // Use venue or fallback to location
    }

    const eventId = event._id || event.id
    const isAlreadySaved = savedEvents.some(savedEvent => 
      (savedEvent._id === eventId) || (savedEvent.id === eventId)
    )
    
    let updatedSavedEvents
    if (isAlreadySaved) {
      // Remove from saved
      updatedSavedEvents = savedEvents.filter(savedEvent => 
        savedEvent._id !== eventId && savedEvent.id !== eventId
      )
      toast({
        title: "Event removed from saved",
        description: `${event.title} has been removed from your saved events.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      })
    } else {
      // Add to saved
      updatedSavedEvents = [...savedEvents, eventWithExtraData]
      toast({
        title: "Event saved!",
        description: `${event.title} has been added to your saved events.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    }
    
    setSavedEvents(updatedSavedEvents)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedEvents', JSON.stringify(updatedSavedEvents))
    }
  }

  // Check if event is saved
  const isEventSaved = (eventId) => {
    return savedEvents.some(savedEvent => 
      savedEvent._id === eventId || savedEvent.id === eventId
    )
  }

  // Register for event function
  const handleRegisterEvent = async (event) => {
    const eventId = event._id || event.id
    
    // Check if already registered
    const isAlreadyRegistered = registeredEvents.some(regEvent => 
      (regEvent._id === eventId) || (regEvent.id === eventId)
    )
    
    if (isAlreadyRegistered) {
      toast({
        title: "Already registered",
        description: "You have already registered for this event.",
        status: "info",
        duration: 3000,
        isClosable: true,
      })
      return
    }
    
    try {
      // Call API to register for event
      const token = localStorage.getItem('auth-token')
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to register for events.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        })
        return
      }
      
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Add to registered events
        const updatedRegisteredEvents = [...registeredEvents, event]
        setRegisteredEvents(updatedRegisteredEvents)
        
        // Save to localStorage
        localStorage.setItem('registeredEvents', JSON.stringify(updatedRegisteredEvents))
        
        toast({
          title: "Registration successful!",
          description: `You are now registered for ${event.title}.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: "Registration failed",
          description: data.message || "Failed to register for event.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error('Error registering for event:', error)
      toast({
        title: "Error",
        description: "Failed to register for event. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Check if user is registered for event
  const isEventRegistered = (eventId) => {
    return registeredEvents.some(regEvent => 
      regEvent._id === eventId || regEvent.id === eventId
    )
  }

  const categories = ['All', 'Trending', 'Music', 'Sports', 'Gaming', 'Art', 'Technology', 'Business']

  // Events are now fetched from database and stored in state

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
        {/* Search Bar */}
        <Box
          position="sticky"
          top={0}
          zIndex={10}
          p={4}
          bg="rgba(0, 0, 0, 0.8)"
          backdropFilter="blur(10px)"
        >
          <Container maxW="xl">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search events, people, or locations"
                bg="rgba(255, 255, 255, 0.1)"
                border="1px solid"
                borderColor="gray.600"
                rounded="full"
                _focus={{
                  ring: 2,
                  ringColor: 'teal.300',
                  borderColor: 'teal.300'
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Container>
        </Box>

        {/* Categories */}
        <Box
          p={4}
          borderBottom="1px solid"
          borderColor="gray.800"
          overflowX="auto"
        >
          <Container maxW="full">
            <HStack spacing={4} minW="max-content">
              {categories.map((category) => (
                <CategoryButton
                  key={category}
                  category={category}
                  isActive={activeCategory === category}
                  onClick={setActiveCategory}
                />
              ))}
            </HStack>
          </Container>
        </Box>

        {/* Results Info */}
        <Box p={4}>
          <Container maxW="full">
            <HStack justify="space-between" mb={4}>
              <Heading size="lg">
                {activeCategory === 'All' ? 'All Events' : `${activeCategory} Events`}
              </Heading>
              <Badge colorScheme="teal" variant="solid">
                {loading ? '...' : `${events.length} events`}
              </Badge>
            </HStack>
          </Container>
        </Box>

        {/* Event Grid */}
        <Box p={4}>
          <Container maxW="full">
            {loading ? (
              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                  xl: "repeat(4, 1fr)"
                }}
                gap={4}
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <GridItem key={index}>
                    <Box
                      bg="gray.800"
                      rounded="lg"
                      overflow="hidden"
                      h={80}
                      animation="pulse"
                    >
                      <Box bg="gray.700" h={64} />
                      <Box p={4}>
                        <Box bg="gray.700" h={4} mb={2} rounded />
                        <Box bg="gray.600" h={3} mb={2} rounded />
                        <Box bg="gray.600" h={3} w="70%" rounded />
                      </Box>
                    </Box>
                  </GridItem>
                ))}
              </Grid>
            ) : events.length > 0 ? (
              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                  xl: "repeat(4, 1fr)"
                }}
                gap={4}
              >
                {events.map((event) => (
                  <GridItem key={event._id || event.id}>
                    <EventCard 
                      event={event} 
                      onSave={handleSaveEvent}
                      isSaved={isEventSaved(event._id || event.id)}
                      onRegister={handleRegisterEvent}
                      isRegistered={isEventRegistered(event._id || event.id)}
                      mounted={mounted}
                    />
                  </GridItem>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" py={12}>
                <Icon as={FaSearch} boxSize={12} color="gray.500" mb={4} />
                <Heading size="md" color="gray.400" mb={2}>
                  No events found
                </Heading>
                <Text color="gray.500">
                  Try adjusting your search or category filter
                </Text>
              </Box>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export default ExplorePage
