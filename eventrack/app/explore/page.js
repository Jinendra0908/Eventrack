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
  Badge
} from '@chakra-ui/react'
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaMapMarkerAlt 
} from 'react-icons/fa'
import { useState, memo } from 'react'
import { Sidebar, MobileNavbar } from '../../components/LazyComponents'

const EventCard = memo(({ event }) => (
  <Box
    bg="gray.800"
    rounded="lg"
    overflow="hidden"
    transition="transform 0.3s ease"
    _hover={{ transform: "scale(1.02)" }}
    cursor="pointer"
  >
    <Image
      src={event.image}
      alt={event.title}
      w="full"
      h={64}
      objectFit="cover"
      loading="lazy"
    />
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
      <Text color="gray.400" fontSize="sm" mb={3}>
        {event.description}
      </Text>
      <Flex justify="space-between" fontSize="sm" color="gray.400">
        <HStack spacing={1}>
          <Icon as={FaCalendarAlt} />
          <Text>{event.date}</Text>
        </HStack>
        <HStack spacing={1}>
          <Icon as={FaMapMarkerAlt} />
          <Text>{event.location}</Text>
        </HStack>
      </Flex>
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

  const categories = ['All', 'Trending', 'Music', 'Sports', 'Gaming', 'Art', 'Technology']

  const events = [
    {
      id: 1,
      title: 'Summer Music Festival',
      description: 'Join us for the biggest music event of the year!',
      image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
      date: 'June 15, 2025',
      location: 'Bhopal',
      organizer: {
        name: 'MusicEvents',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
      },
      category: 'Music'
    },
    {
      id: 2,
      title: 'Future Tech Conference',
      description: 'Exploring the latest in AI and blockchain technology',
      image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg',
      date: 'July 22, 2025',
      location: 'Indore',
      organizer: {
        name: 'TechTalks',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
      },
      category: 'Technology'
    },
    {
      id: 3,
      title: 'Modern Art Exhibition',
      description: 'Showcasing contemporary artists from around the world',
      image: 'https://images.pexels.com/photos/248159/pexels-photo-248159.jpeg',
      date: 'August 5, 2025',
      location: 'Bhopal',
      organizer: {
        name: 'ArtGallery',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
      },
      category: 'Art'
    },
    {
      id: 4,
      title: 'Gaming Championship',
      description: 'Ultimate esports tournament with massive prizes',
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
      date: 'September 10, 2025',
      location: 'Delhi',
      organizer: {
        name: 'GameMasters',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg'
      },
      category: 'Gaming'
    },
    {
      id: 5,
      title: 'Marathon Championship',
      description: 'Annual city marathon for fitness enthusiasts',
      image: 'https://images.pexels.com/photos/618612/pexels-photo-618612.jpeg',
      date: 'October 15, 2025',
      location: 'Mumbai',
      organizer: {
        name: 'FitLife',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg'
      },
      category: 'Sports'
    },
    {
      id: 6,
      title: 'Startup Pitch Night',
      description: 'Innovative startups presenting their ideas to investors',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
      date: 'November 20, 2025',
      location: 'Bangalore',
      organizer: {
        name: 'StartupHub',
        avatar: 'https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg'
      },
      category: 'Technology'
    }
  ]

  const filteredEvents = events.filter(event => {
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

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
                {filteredEvents.length} events
              </Badge>
            </HStack>
          </Container>
        </Box>

        {/* Event Grid */}
        <Box p={4}>
          <Container maxW="full">
            {filteredEvents.length > 0 ? (
              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                  xl: "repeat(4, 1fr)"
                }}
                gap={4}
              >
                {filteredEvents.map((event) => (
                  <GridItem key={event.id}>
                    <EventCard event={event} />
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
