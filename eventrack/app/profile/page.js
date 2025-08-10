'use client'

import { 
  Box, 
  Container, 
  VStack, 
  HStack,
  Heading, 
  Text, 
  Avatar,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  GridItem,
  Icon,
  Flex,
  Badge,
  Divider,
  Center
} from '@chakra-ui/react'
import { 
  FaCalendarAlt, 
  FaBookmark, 
  FaClock,
  FaEdit,
  FaCog
} from 'react-icons/fa'
import { useState, useEffect, memo } from 'react'
import { Sidebar, MobileNavbar } from '../../components/LazyComponents'

const StatCard = memo(({ value, label }) => (
  <VStack spacing={1}>
    <Text fontSize="xl" fontWeight="bold">
      {value}
    </Text>
    <Text fontSize="sm" color="gray.400">
      {label}
    </Text>
  </VStack>
))

StatCard.displayName = 'StatCard'

const ContentItem = memo(({ icon, type }) => (
  <Box
    aspectRatio={1}
    bg="gray.800"
    display="flex"
    alignItems="center"
    justifyContent="center"
    _hover={{
      bg: "gray.700",
      transform: "scale(1.02)"
    }}
    transition="all 0.2s"
    cursor="pointer"
    rounded="md"
  >
    <Icon as={icon} boxSize={8} color="teal.300" />
  </Box>
))

ContentItem.displayName = 'ContentItem'

const ProfilePage = () => {
  const [mounted, setMounted] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: 'Rohan Sharma',
    username: '@sharmarohan',
    bio: 'Digital creator | Event organizer | Deadline chaser | Making things happen one day at a time',
    avatar: 'https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg',
    stats: {
      events: 142,
      followers: '1.2k',
      following: 356
    }
  })

  useEffect(() => {
    setMounted(true)
    
    // Load user data from localStorage if available
    if (typeof window !== 'undefined') {
      const savedUsername = localStorage.getItem('username')
      const savedFirstName = localStorage.getItem('firstName')
      const savedLastName = localStorage.getItem('lastName')
      
      if (savedUsername) {
        setUserProfile(prev => ({
          ...prev,
          username: `@${savedUsername}`,
          name: savedFirstName && savedLastName ? `${savedFirstName} ${savedLastName}` : savedUsername
        }))
      }
    }
  }, [])

  const contentItems = [
    { icon: FaCalendarAlt, type: 'event' },
    { icon: FaBookmark, type: 'saved' },
    { icon: FaClock, type: 'deadline' },
    { icon: FaCalendarAlt, type: 'event' },
    { icon: FaBookmark, type: 'saved' },
    { icon: FaClock, type: 'deadline' },
    { icon: FaCalendarAlt, type: 'event' },
    { icon: FaBookmark, type: 'saved' },
    { icon: FaClock, type: 'deadline' },
    { icon: FaCalendarAlt, type: 'event' },
    { icon: FaBookmark, type: 'saved' },
    { icon: FaClock, type: 'deadline' }
  ]

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
        {/* Profile Header */}
        <Container maxW="2xl" py={8}>
          <VStack spacing={6}>
            {/* Profile Picture */}
            <Avatar
              size="2xl"
              src={userProfile.avatar}
              name={userProfile.name}
              border="3px solid"
              borderColor="teal.600"
            />

            {/* User Info */}
            <VStack spacing={2} textAlign="center">
              <Heading size="xl">
                {mounted ? userProfile.name : 'Loading...'}
              </Heading>
              <Text color="teal.300" fontSize="lg">
                {mounted ? userProfile.username : '@loading'}
              </Text>
            </VStack>

            {/* Bio */}
            <Box maxW="md" textAlign="center">
              <Text color="gray.300" lineHeight="1.6">
                {userProfile.bio}
              </Text>
            </Box>

            {/* Action Buttons */}
            <HStack spacing={4}>
              <Button
                leftIcon={<FaEdit />}
                variant="outline"
                borderColor="teal.600"
                color="teal.300"
                _hover={{
                  bg: "teal.900",
                  borderColor: "teal.500"
                }}
              >
                Edit Profile
              </Button>
              <Button
                leftIcon={<FaCog />}
                variant="ghost"
                color="gray.400"
                _hover={{
                  bg: "gray.800",
                  color: "white"
                }}
              >
                Settings
              </Button>
            </HStack>

            {/* Stats */}
            <HStack spacing={12} py={4}>
              <StatCard value={userProfile.stats.events} label="Events" />
              <StatCard value={userProfile.stats.followers} label="Followers" />
              <StatCard value={userProfile.stats.following} label="Following" />
            </HStack>

            <Divider borderColor="gray.700" />

            {/* Content Tabs */}
            <Box w="full">
              <Tabs variant="unstyled" colorScheme="teal" w="full">
                <TabList justifyContent="center" borderBottom="1px solid" borderColor="gray.700">
                  <Tab
                    _selected={{
                      color: "white",
                      borderBottom: "2px solid",
                      borderColor: "teal.600"
                    }}
                    _hover={{
                      color: "white"
                    }}
                    color="gray.400"
                    fontWeight="medium"
                    px={8}
                    py={4}
                  >
                    Events
                  </Tab>
                  <Tab
                    _selected={{
                      color: "white",
                      borderBottom: "2px solid",
                      borderColor: "teal.600"
                    }}
                    _hover={{
                      color: "white"
                    }}
                    color="gray.400"
                    fontWeight="medium"
                    px={8}
                    py={4}
                  >
                    Saved
                  </Tab>
                  <Tab
                    _selected={{
                      color: "white",
                      borderBottom: "2px solid",
                      borderColor: "teal.600"
                    }}
                    _hover={{
                      color: "white"
                    }}
                    color="gray.400"
                    fontWeight="medium"
                    px={8}
                    py={4}
                  >
                    Deadlines
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel p={0} pt={6}>
                    <Grid
                      templateColumns={{
                        base: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)"
                      }}
                      gap={2}
                    >
                      {contentItems.filter(item => item.type === 'event').map((item, index) => (
                        <GridItem key={`event-${index}`}>
                          <ContentItem icon={item.icon} type={item.type} />
                        </GridItem>
                      ))}
                      {contentItems.filter(item => item.type === 'event').length === 0 && (
                        <GridItem colSpan={{ base: 2, md: 3, lg: 4 }}>
                          <Center py={12}>
                            <VStack spacing={4}>
                              <Icon as={FaCalendarAlt} boxSize={12} color="gray.500" />
                              <VStack spacing={2}>
                                <Text fontSize="lg" fontWeight="medium" color="gray.400">
                                  No events yet
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  Start creating events to see them here
                                </Text>
                              </VStack>
                            </VStack>
                          </Center>
                        </GridItem>
                      )}
                    </Grid>
                  </TabPanel>

                  <TabPanel p={0} pt={6}>
                    <Grid
                      templateColumns={{
                        base: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)"
                      }}
                      gap={2}
                    >
                      {contentItems.filter(item => item.type === 'saved').map((item, index) => (
                        <GridItem key={`saved-${index}`}>
                          <ContentItem icon={item.icon} type={item.type} />
                        </GridItem>
                      ))}
                    </Grid>
                  </TabPanel>

                  <TabPanel p={0} pt={6}>
                    <Grid
                      templateColumns={{
                        base: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)"
                      }}
                      gap={2}
                    >
                      {contentItems.filter(item => item.type === 'deadline').map((item, index) => (
                        <GridItem key={`deadline-${index}`}>
                          <ContentItem icon={item.icon} type={item.type} />
                        </GridItem>
                      ))}
                    </Grid>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

export default ProfilePage
