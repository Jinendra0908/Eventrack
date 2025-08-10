'use client'

import { 
  Box, 
  Container, 
  VStack, 
  HStack,
  Heading, 
  Text, 
  Image,
  Button,
  Grid,
  GridItem,
  Icon,
  Flex,
  Badge,
  Divider,
  Avatar,
  AvatarGroup,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  useDisclosure
} from '@chakra-ui/react'
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock,
  FaBookmark,
  FaShare,
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaTicketAlt,
  FaHeart,
  FaUsers,
  FaEdit,
  FaTrash
} from 'react-icons/fa'
import { useState, useEffect, memo } from 'react'
import Link from 'next/link'
import { Sidebar, MobileNavbar } from '../../components/LazyComponents'

const EventCard = memo(({ event, onRemove }) => (
  <Card
    bg="rgba(31, 41, 55, 0.8)"
    backdropFilter="blur(5px)"
    border="1px solid"
    borderColor="gray.700"
    _hover={{
      transform: "translateY(-5px)",
      borderColor: "teal.600"
    }}
    transition="all 0.3s ease"
    overflow="hidden"
  >
    <Box position="relative">
      <Image
        src={event.image}
        alt={event.title}
        h="200px"
        w="full"
        objectFit="cover"
      />
      <Button
        position="absolute"
        top={2}
        right={2}
        size="sm"
        colorScheme="red"
        variant="solid"
        leftIcon={<FaBookmark />}
        onClick={() => onRemove(event.id)}
        bg="red.500"
        _hover={{ bg: "red.600" }}
      >
        Saved
      </Button>
    </Box>
    
    <CardBody>
      <VStack align="start" spacing={3}>
        <Heading size="md" color="white">
          {event.title}
        </Heading>
        
        <Text color="teal.300" fontSize="sm">
          {event.date} • {event.location}
        </Text>
        
        <HStack spacing={4} wrap="wrap">
          <HStack spacing={1}>
            <Icon as={FaCalendarAlt} color="teal.300" />
            <Text fontSize="sm" color="gray.300">{event.date}</Text>
          </HStack>
          <HStack spacing={1}>
            <Icon as={FaMapMarkerAlt} color="teal.300" />
            <Text fontSize="sm" color="gray.300">{event.venue}</Text>
          </HStack>
        </HStack>
        
        <Text color="gray.300" fontSize="sm" noOfLines={2}>
          {event.description}
        </Text>
        
        <HStack spacing={2}>
          <Badge colorScheme="teal" variant="outline">
            {event.category}
          </Badge>
          <Badge colorScheme="orange" variant="outline">
            ${event.price}
          </Badge>
        </HStack>
        
        <Divider borderColor="gray.600" />
        
        <Flex justify="space-between" align="center" w="full">
          <HStack spacing={2}>
            <Avatar size="sm" src={event.organizer.avatar} />
            <VStack spacing={0} align="start">
              <Text fontSize="xs" color="white" fontWeight="bold">
                {event.organizer.name}
              </Text>
              <Text fontSize="xs" color="gray.400">
                Organizer
              </Text>
            </VStack>
          </HStack>
          
          <HStack spacing={1}>
            <Button
              size="sm"
              bgGradient="linear(135deg, teal.600 0%, teal.400 100%)"
              _hover={{
                bgGradient: "linear(135deg, teal.700 0%, teal.500 100%)",
                transform: "scale(1.05)"
              }}
              transition="all 0.2s ease"
              leftIcon={<FaTicketAlt />}
            >
              Get Tickets
            </Button>
          </HStack>
        </Flex>
      </VStack>
    </CardBody>
  </Card>
))

EventCard.displayName = 'EventCard'

const SavedPage = () => {
  const [mounted, setMounted] = useState(false)
  const [savedEvents, setSavedEvents] = useState([
    {
      id: 1,
      title: "Tech Conference 2023",
      date: "November 15-17",
      location: "San Francisco",
      venue: "Moscone Center",
      price: "299",
      category: "Technology",
      image: "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg",
      description: "Join us for the biggest tech conference of the year featuring industry leaders, cutting-edge workshops, and networking opportunities.",
      organizer: {
        name: "TechEvents Inc.",
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
      }
    },
    {
      id: 2,
      title: "Summer Music Festival",
      date: "June 20-22",
      location: "Los Angeles",
      venue: "Hollywood Bowl",
      price: "150",
      category: "Music",
      image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      description: "Experience amazing live performances from top artists in this three-day music extravaganza under the stars.",
      organizer: {
        name: "Music Makers",
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
      }
    },
    {
      id: 3,
      title: "Modern Art Exhibition",
      date: "August 5-15",
      location: "New York",
      venue: "MoMA",
      price: "45",
      category: "Art",
      image: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg",
      description: "Discover contemporary artworks from emerging and established artists in this thought-provoking exhibition.",
      organizer: {
        name: "Art Gallery NYC",
        avatar: "https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg"
      }
    },
    {
      id: 4,
      title: "Food & Wine Festival",
      date: "September 10-12",
      location: "Napa Valley",
      venue: "Outdoor Venues",
      price: "200",
      category: "Food & Drink",
      image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
      description: "Taste exquisite wines and gourmet food from renowned chefs and winemakers in beautiful Napa Valley.",
      organizer: {
        name: "Wine Society",
        avatar: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg"
      }
    },
    {
      id: 5,
      title: "Startup Pitch Competition",
      date: "October 3",
      location: "Austin",
      venue: "Convention Center",
      price: "75",
      category: "Business",
      image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
      description: "Watch innovative startups pitch their ideas to investors and compete for funding opportunities.",
      organizer: {
        name: "Startup Hub",
        avatar: "https://images.pexels.com/photos/936137/pexels-photo-936137.jpeg"
      }
    },
    {
      id: 6,
      title: "Marathon Challenge",
      date: "November 28",
      location: "Boston",
      venue: "City Streets",
      price: "120",
      category: "Sports",
      image: "https://images.pexels.com/photos/2402926/pexels-photo-2402926.jpeg",
      description: "Join thousands of runners in this annual marathon through the historic streets of Boston.",
      organizer: {
        name: "Boston Athletics",
        avatar: "https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg"
      }
    }
  ])

  useEffect(() => {
    setMounted(true)
    
    // Load saved events from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedEvents')
      if (saved) {
        try {
          setSavedEvents(JSON.parse(saved))
        } catch (error) {
          console.error('Error loading saved events:', error)
        }
      }
    }
  }, [])

  const removeEvent = (eventId) => {
    const updatedEvents = savedEvents.filter(event => event.id !== eventId)
    setSavedEvents(updatedEvents)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedEvents', JSON.stringify(updatedEvents))
    }
  }

  const clearAllSaved = () => {
    setSavedEvents([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('savedEvents')
    }
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
        <Container maxW="7xl" py={8}>
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <VStack align="start" spacing={2}>
                <Heading size="xl" display="flex" alignItems="center">
                  <Icon as={FaBookmark} mr={3} color="teal.300" />
                  Saved Events
                </Heading>
                <Text color="gray.400">
                  {mounted ? `${savedEvents.length} events saved` : 'Loading...'}
                </Text>
              </VStack>
              
              {savedEvents.length > 0 && (
                <Button
                  variant="outline"
                  borderColor="red.600"
                  color="red.400"
                  _hover={{
                    bg: "red.900",
                    borderColor: "red.500"
                  }}
                  leftIcon={<FaTrash />}
                  onClick={clearAllSaved}
                >
                  Clear All
                </Button>
              )}
            </Flex>

            {/* Events Grid */}
            {savedEvents.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {savedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRemove={removeEvent}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py={20}
                textAlign="center"
              >
                <Icon as={FaBookmark} boxSize={20} color="gray.500" mb={6} />
                <Heading size="lg" color="gray.400" mb={4}>
                  No Saved Events
                </Heading>
                <Text color="gray.500" maxW="md" mb={8}>
                  You haven't saved any events yet. Start exploring events and save the ones you're interested in to see them here.
                </Text>
                <Link href="/explore">
                  <Button
                    bgGradient="linear(135deg, teal.600 0%, teal.400 100%)"
                    _hover={{
                      bgGradient: "linear(135deg, teal.700 0%, teal.500 100%)",
                      transform: "scale(1.05)"
                    }}
                    transition="all 0.2s ease"
                    leftIcon={<FaCalendarAlt />}
                    size="lg"
                  >
                    Explore Events
                  </Button>
                </Link>
              </Flex>
            )}

            {/* Statistics Section */}
            {savedEvents.length > 0 && (
              <Box mt={12}>
                <Heading size="md" mb={6} color="teal.300">
                  Your Saved Events Summary
                </Heading>
                
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                  <Card bg="gray.800" border="1px solid" borderColor="gray.700">
                    <CardBody textAlign="center">
                      <Text fontSize="2xl" fontWeight="bold" color="teal.300">
                        {savedEvents.length}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        Total Saved
                      </Text>
                    </CardBody>
                  </Card>
                  
                  <Card bg="gray.800" border="1px solid" borderColor="gray.700">
                    <CardBody textAlign="center">
                      <Text fontSize="2xl" fontWeight="bold" color="orange.300">
                        {new Set(savedEvents.map(e => e.category)).size}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        Categories
                      </Text>
                    </CardBody>
                  </Card>
                  
                  <Card bg="gray.800" border="1px solid" borderColor="gray.700">
                    <CardBody textAlign="center">
                      <Text fontSize="2xl" fontWeight="bold" color="green.300">
                        {new Set(savedEvents.map(e => e.location)).size}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        Cities
                      </Text>
                    </CardBody>
                  </Card>
                  
                  <Card bg="gray.800" border="1px solid" borderColor="gray.700">
                    <CardBody textAlign="center">
                      <Text fontSize="2xl" fontWeight="bold" color="purple.300">
                        ${Math.round(savedEvents.reduce((sum, e) => sum + parseInt(e.price), 0) / savedEvents.length)}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        Avg. Price
                      </Text>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </Box>
            )}
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

export default SavedPage
