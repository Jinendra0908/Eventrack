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
  Center,
  Spinner
} from '@chakra-ui/react'
import { 
  FaCalendarAlt, 
  FaBookmark, 
  FaClock,
  FaEdit,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa'
import { useState, useEffect, memo } from 'react'
import { Sidebar, MobileNavbar } from '../../components/LazyComponents'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'

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
  const { user, isAuthenticated, loading, logout } = useAuth()
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
            {/* Host Banner */}
            {user?.role === 'host' && (
              <Box
                w="full"
                p={4}
                bg="teal.900"
                border="1px solid"
                borderColor="teal.600"
                rounded="lg"
                textAlign="center"
              >
                <VStack spacing={2}>
                  <HStack>
                    <Icon as={FaCalendarAlt} color="teal.300" />
                    <Text color="teal.300" fontWeight="bold">
                      You're viewing your personal profile
                    </Text>
                  </HStack>
                  <Text color="gray.300" fontSize="sm">
                    As a host, you can manage your events from your Host Dashboard
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="teal"
                    onClick={() => router.push('/host')}
                  >
                    Go to Host Dashboard
                  </Button>
                </VStack>
              </Box>
            )}

            {/* Profile Picture */}
            <Avatar
              size="2xl"
              src="/placeholder-avatar.svg"
              name={`${user.firstName} ${user.lastName}`}
              border="3px solid"
              borderColor="teal.600"
            />

            {/* User Info */}
            <VStack spacing={2} textAlign="center">
              <Heading size="xl">
                {user.firstName} {user.lastName}
              </Heading>
              <Text color="teal.300" fontSize="lg">
                @{user.username}
              </Text>
              <Text color="gray.400" fontSize="sm">
                {user.email}
              </Text>
            </VStack>

            {/* Bio */}
            <Box maxW="md" textAlign="center">
              <Text color="gray.300" lineHeight="1.6">
                {user.bio || "Welcome to EventTrack! Update your bio to tell others about yourself."}
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
              <Button
                leftIcon={<FaSignOutAlt />}
                variant="outline"
                borderColor="red.600"
                color="red.300"
                _hover={{
                  bg: "red.900",
                  borderColor: "red.500"
                }}
                onClick={logout}
              >
                Logout
              </Button>
            </HStack>

            {/* Stats */}
            <HStack spacing={12} py={4}>
              <StatCard value={user.savedEvents?.length || 0} label="Saved Events" />
              <StatCard value={user.createdEvents?.length || 0} label="Created Events" />
              <StatCard value={0} label="Following" />
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
