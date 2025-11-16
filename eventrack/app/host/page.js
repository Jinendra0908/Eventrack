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
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  Wrap,
  WrapItem,
  Tag,
  RadioGroup,
  Radio,
  Stack
} from '@chakra-ui/react'
import { 
  FaCalendarAlt, 
  FaBookmark, 
  FaClock,
  FaEdit,
  FaCog,
  FaPlus,
  FaMapMarkerAlt,
  FaUsers,
  FaDollarSign,
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaCopy,
  FaUserPlus,
  FaImage,
  FaTags,
  FaGlobe,
  FaLock,
  FaUserFriends,
  FaFileExport,
  FaChartLine,
  FaSignOutAlt
} from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'
import { Sidebar, MobileNavbar } from '../../components/LazyComponents'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'

const HostProfilePage = () => {
  const [mounted, setMounted] = useState(false)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const toast = useToast()
  
  // Modal states
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const { isOpen: isParticipantsOpen, onOpen: onParticipantsOpen, onClose: onParticipantsClose } = useDisclosure()
  const cancelRef = useRef()

  // Form state for event creation/editing
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    poster: '',
    date: '',
    time: '10:00',
    location: '',
    venue: '',
    category: 'Technology',
    visibility: 'public',
    ticketType: 'free',
    ticketPrice: 0,
    ticketDetails: '',
    maxAttendees: '',
    tags: '',
    status: 'published',
    coHosts: []
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [mounted, authLoading, isAuthenticated, router])

  useEffect(() => {
    if (mounted && isAuthenticated && user?.role !== 'host') {
      router.push('/profile')
    }
  }, [mounted, isAuthenticated, user, router])

  useEffect(() => {
    if (mounted && isAuthenticated && user?.role === 'host') {
      fetchHostEvents()
    }
  }, [mounted, isAuthenticated, user])

  const fetchHostEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events/host', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setEvents(data.data?.events || data.events || [])
      }
    } catch (error) {
      console.error('Error fetching host events:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch your events',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async () => {
    try {
      const eventData = {
        ...formData,
        price: formData.ticketType === 'free' ? '0' : formData.ticketPrice.toString(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify(eventData)
      })

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Event created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        onCreateClose()
        resetForm()
        fetchHostEvents()
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create event')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleEditEvent = async () => {
    try {
      const eventData = {
        ...formData,
        price: formData.ticketType === 'free' ? '0' : formData.ticketPrice.toString(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      const response = await fetch(`/api/events/${selectedEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify(eventData)
      })

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Event updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        onEditClose()
        resetForm()
        fetchHostEvents()
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update event')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`/api/events/${selectedEvent._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      })

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Event deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        onDeleteClose()
        fetchHostEvents()
      } else {
        throw new Error('Failed to delete event')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      poster: '',
      date: '',
      time: '10:00',
      location: '',
      venue: '',
      category: 'Technology',
      visibility: 'public',
      ticketType: 'free',
      ticketPrice: 0,
      ticketDetails: '',
      maxAttendees: '',
      tags: '',
      status: 'published',
      coHosts: []
    })
    setSelectedEvent(null)
  }

  const openEditModal = (event) => {
    setSelectedEvent(event)
    setFormData({
      title: event.title || '',
      description: event.description || '',
      image: event.image || '',
      poster: event.poster || '',
      date: event.date || '',
      time: event.time || '10:00',
      location: event.location || '',
      venue: event.venue || '',
      category: event.category || 'Technology',
      visibility: event.visibility || 'public',
      ticketType: event.ticketType || 'free',
      ticketPrice: event.ticketPrice || 0,
      ticketDetails: event.ticketDetails || '',
      maxAttendees: event.maxAttendees || '',
      tags: event.tags?.join(', ') || '',
      status: event.status || 'published',
      coHosts: event.coHosts || []
    })
    onEditOpen()
  }

  const openDeleteModal = (event) => {
    setSelectedEvent(event)
    onDeleteOpen()
  }

  const openParticipantsModal = (event) => {
    setSelectedEvent(event)
    onParticipantsOpen()
  }

  if (!mounted) return null

  if (authLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="teal.300" />
      </Box>
    )
  }

  if (!isAuthenticated) return null

  if (user?.role !== 'host') {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text fontSize="xl" color="red.400">Access Denied</Text>
          <Text color="gray.400">Only hosts can access this page</Text>
          <Button onClick={() => router.push('/profile')} colorScheme="teal">
            Go to Profile
          </Button>
        </VStack>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="black">
      <Flex>
        {/* Desktop Sidebar */}
        <Box display={{ base: 'none', lg: 'block' }}>
          <Sidebar />
        </Box>

        {/* Main Content */}
        <Box flex="1" ml={{ base: 0, lg: '260px' }}>
          {/* Mobile Navbar */}
          <Box display={{ base: 'block', lg: 'none' }}>
            <MobileNavbar />
          </Box>

          <Container maxW="7xl" py={8} px={4}>
            {/* Header */}
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between" align="center">
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Avatar src={user?.avatar} size="lg" />
                    <VStack align="start" spacing={1}>
                      <Heading size="lg" color="white">
                        {user?.firstName} {user?.lastName}
                      </Heading>
                      <Badge colorScheme="teal" variant="subtle">
                        Event Organizer
                      </Badge>
                    </VStack>
                  </HStack>
                </VStack>
                
                <HStack spacing={3}>
                  <Button
                    variant="outline"
                    colorScheme="gray"
                    size="md"
                    onClick={() => router.push('/profile')}
                  >
                    View Profile
                  </Button>
                  <Button
                    leftIcon={<FaSignOutAlt />}
                    variant="outline"
                    colorScheme="red"
                    size="md"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                  <Button
                    leftIcon={<FaPlus />}
                    colorScheme="teal"
                    size="lg"
                    onClick={onCreateOpen}
                  >
                    Create Event
                  </Button>
                </HStack>
              </HStack>

              {/* Stats */}
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                <Card bg="gray.800" border="1px solid" borderColor="gray.700">
                  <CardBody textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="teal.300">
                      {events.length}
                    </Text>
                    <Text color="gray.400">Total Events</Text>
                  </CardBody>
                </Card>
                <Card bg="gray.800" border="1px solid" borderColor="gray.700">
                  <CardBody textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="blue.300">
                      {events.filter(e => {
                        const eventDate = new Date(e.date)
                        return eventDate >= new Date() && e.status !== 'draft'
                      }).length}
                    </Text>
                    <Text color="gray.400">Upcoming</Text>
                  </CardBody>
                </Card>
                <Card bg="gray.800" border="1px solid" borderColor="gray.700">
                  <CardBody textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="green.300">
                      {events.reduce((total, event) => total + (event.attendees?.length || 0), 0)}
                    </Text>
                    <Text color="gray.400">Total Attendees</Text>
                  </CardBody>
                </Card>
                <Card bg="gray.800" border="1px solid" borderColor="gray.700">
                  <CardBody textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="purple.300">
                      ${events.reduce((total, event) => {
                        if (event.ticketType === 'paid') {
                          return total + ((event.attendees?.length || 0) * (event.ticketPrice || 0))
                        }
                        return total
                      }, 0).toFixed(2)}
                    </Text>
                    <Text color="gray.400">Total Revenue</Text>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Events Tabs */}
              <Tabs colorScheme="teal" variant="line">
                <TabList>
                  <Tab color="gray.400" _selected={{ color: 'teal.300' }}>All Events</Tab>
                  <Tab color="gray.400" _selected={{ color: 'teal.300' }}>Upcoming</Tab>
                  <Tab color="gray.400" _selected={{ color: 'teal.300' }}>Past Events</Tab>
                  <Tab color="gray.400" _selected={{ color: 'teal.300' }}>Drafts</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0}>
                    <EventsGrid 
                      events={events} 
                      loading={loading}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                      onViewParticipants={openParticipantsModal}
                    />
                  </TabPanel>
                  <TabPanel px={0}>
                    <EventsGrid 
                      events={events.filter(e => {
                        const eventDate = new Date(e.date)
                        return eventDate >= new Date() && e.status !== 'draft'
                      })} 
                      loading={loading}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                      onViewParticipants={openParticipantsModal}
                    />
                  </TabPanel>
                  <TabPanel px={0}>
                    <EventsGrid 
                      events={events.filter(e => {
                        const eventDate = new Date(e.date)
                        return eventDate < new Date() || e.status === 'completed'
                      })} 
                      loading={loading}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                      onViewParticipants={openParticipantsModal}
                    />
                  </TabPanel>
                  <TabPanel px={0}>
                    <EventsGrid 
                      events={events.filter(e => e.status === 'draft')} 
                      loading={loading}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                      onViewParticipants={openParticipantsModal}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </Container>
        </Box>
      </Flex>

      {/* Create Event Modal */}
      <EventModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        title="Create New Event"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateEvent}
        submitText="Create Event"
      />

      {/* Edit Event Modal */}
      <EventModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        title="Edit Event"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditEvent}
        submitText="Update Event"
      />

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800" border="1px solid" borderColor="gray.600">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="white">
              Delete Event
            </AlertDialogHeader>

            <AlertDialogBody color="gray.300">
              Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteEvent} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Participants Modal */}
      <Modal isOpen={isParticipantsOpen} onClose={onParticipantsClose} size="3xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg="gray.800" border="1px solid" borderColor="gray.600">
          <ModalHeader color="white">
            <VStack align="start" spacing={2}>
              <Text>Event Participants</Text>
              <Text fontSize="md" fontWeight="normal" color="gray.400">
                {selectedEvent?.title}
              </Text>
              <HStack spacing={4} fontSize="sm" color="gray.400">
                <HStack>
                  <Icon as={FaCalendarAlt} />
                  <Text>{selectedEvent?.date}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaMapMarkerAlt} />
                  <Text>{selectedEvent?.venue}</Text>
                </HStack>
              </HStack>
            </VStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {/* Summary Stats */}
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                <Card bg="gray.700" border="1px solid" borderColor="gray.600">
                  <CardBody textAlign="center" py={3}>
                    <Text fontSize="xl" fontWeight="bold" color="teal.300">
                      {selectedEvent?.attendees?.length || 0}
                    </Text>
                    <Text fontSize="xs" color="gray.400">Total Registered</Text>
                  </CardBody>
                </Card>
                <Card bg="gray.700" border="1px solid" borderColor="gray.600">
                  <CardBody textAlign="center" py={3}>
                    <Text fontSize="xl" fontWeight="bold" color="blue.300">
                      {selectedEvent?.maxAttendees || '∞'}
                    </Text>
                    <Text fontSize="xs" color="gray.400">Max Capacity</Text>
                  </CardBody>
                </Card>
                <Card bg="gray.700" border="1px solid" borderColor="gray.600">
                  <CardBody textAlign="center" py={3}>
                    <Text fontSize="xl" fontWeight="bold" color="green.300">
                      {selectedEvent?.ticketType === 'free' ? '$0' : `$${(selectedEvent?.attendees?.length || 0) * (selectedEvent?.ticketPrice || 0)}`}
                    </Text>
                    <Text fontSize="xs" color="gray.400">Total Revenue</Text>
                  </CardBody>
                </Card>
                <Card bg="gray.700" border="1px solid" borderColor="gray.600">
                  <CardBody textAlign="center" py={3}>
                    <Text fontSize="xl" fontWeight="bold" color="purple.300">
                      {selectedEvent?.maxAttendees ? `${Math.round(((selectedEvent?.attendees?.length || 0) / selectedEvent.maxAttendees) * 100)}%` : 'N/A'}
                    </Text>
                    <Text fontSize="xs" color="gray.400">Capacity Used</Text>
                  </CardBody>
                </Card>
              </SimpleGrid>

              <Divider borderColor="gray.600" />

              {/* Participants List */}
              <VStack align="stretch" spacing={3}>
                <Heading size="sm" color="teal.300">Registered Participants</Heading>
                
                {selectedEvent?.attendees && selectedEvent.attendees.length > 0 ? (
                  <VStack align="stretch" spacing={2} maxH="400px" overflowY="auto">
                    {selectedEvent.attendees.map((attendee, index) => (
                      <HStack
                        key={attendee._id || index}
                        p={3}
                        bg="gray.700"
                        rounded="md"
                        justify="space-between"
                        border="1px solid"
                        borderColor="gray.600"
                      >
                        <HStack spacing={3}>
                          <Avatar 
                            src={attendee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${attendee.email}`} 
                            size="md" 
                            name={`${attendee.firstName} ${attendee.lastName}`}
                          />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" color="white">
                              {attendee.firstName} {attendee.lastName}
                            </Text>
                            <Text fontSize="sm" color="gray.400">
                              {attendee.email}
                            </Text>
                            {attendee.registeredAt && (
                              <Text fontSize="xs" color="gray.500">
                                Registered: {new Date(attendee.registeredAt).toLocaleDateString()}
                              </Text>
                            )}
                          </VStack>
                        </HStack>
                        <Badge colorScheme="green" variant="subtle">
                          Confirmed
                        </Badge>
                      </HStack>
                    ))}
                  </VStack>
                ) : (
                  <Center py={8}>
                    <VStack spacing={2}>
                      <Icon as={FaUsers} boxSize={10} color="gray.500" />
                      <Text color="gray.400">No participants yet</Text>
                      <Text fontSize="sm" color="gray.500">
                        Share your event to get attendees!
                      </Text>
                    </VStack>
                  </Center>
                )}
              </VStack>

              {/* Export Options */}
              {selectedEvent?.attendees && selectedEvent.attendees.length > 0 && (
                <>
                  <Divider borderColor="gray.600" />
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.400">
                      Export participant list
                    </Text>
                    <HStack>
                      <Button size="sm" variant="outline" colorScheme="teal">
                        Export CSV
                      </Button>
                      <Button size="sm" variant="outline" colorScheme="teal">
                        Export PDF
                      </Button>
                    </HStack>
                  </HStack>
                </>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onParticipantsClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

// Events Grid Component
const EventsGrid = ({ events, loading, onEdit, onDelete, onViewParticipants }) => {
  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="teal.300" />
      </Center>
    )
  }

  if (events.length === 0) {
    return (
      <Center py={10}>
        <VStack spacing={4}>
          <Icon as={FaCalendarAlt} boxSize={12} color="gray.500" />
          <Text color="gray.400">No events found</Text>
        </VStack>
      </Center>
    )
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6} mt={6}>
      {events.map((event) => (
        <EventCard 
          key={event._id} 
          event={event} 
          onEdit={onEdit}
          onDelete={onDelete}
          onViewParticipants={onViewParticipants}
        />
      ))}
    </SimpleGrid>
  )
}

// Event Card Component
const EventCard = ({ event, onEdit, onDelete, onViewParticipants }) => {
  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'public': return FaGlobe
      case 'private': return FaLock
      case 'invite-only': return FaUserFriends
      default: return FaGlobe
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'green'
      case 'draft': return 'yellow'
      case 'cancelled': return 'red'
      case 'completed': return 'gray'
      default: return 'gray'
    }
  }

  return (
    <Card bg="gray.800" border="1px solid" borderColor="gray.700" overflow="hidden">
      <Box position="relative">
        <Image 
          src={event.image} 
          alt={event.title}
          height="200px"
          width="100%"
          objectFit="cover"
        />
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme={getStatusColor(event.status)}
          textTransform="capitalize"
        >
          {event.status}
        </Badge>
      </Box>
      
      <CardBody>
        <VStack align="start" spacing={3}>
          <Heading size="md" color="white" noOfLines={2}>
            {event.title}
          </Heading>
          
          <HStack spacing={4} fontSize="sm" color="gray.400">
            <HStack>
              <Icon as={FaCalendarAlt} />
              <Text>{event.date}</Text>
            </HStack>
            <HStack>
              <Icon as={FaClock} />
              <Text>{event.time}</Text>
            </HStack>
          </HStack>

          <HStack spacing={4} fontSize="sm" color="gray.400">
            <HStack>
              <Icon as={FaMapMarkerAlt} />
              <Text noOfLines={1}>{event.venue}</Text>
            </HStack>
          </HStack>

          <HStack spacing={2}>
            <Icon as={getVisibilityIcon(event.visibility)} />
            <Text fontSize="sm" color="gray.400" textTransform="capitalize">
              {event.visibility}
            </Text>
            <Badge colorScheme="teal" size="sm">
              {event.category}
            </Badge>
          </HStack>

          <HStack spacing={4} fontSize="sm" color="gray.400">
            <HStack>
              <Icon as={FaUsers} />
              <Text>{event.attendees?.length || 0} attendees</Text>
            </HStack>
            <HStack>
              <Icon as={FaDollarSign} />
              <Text>{event.ticketType === 'free' ? 'Free' : `$${event.ticketPrice}`}</Text>
            </HStack>
          </HStack>
        </VStack>
      </CardBody>

      <CardFooter>
        <VStack spacing={2} width="100%">
          <HStack spacing={2} width="100%">
            <Button
              leftIcon={<FaEdit />}
              size="sm"
              variant="outline"
              colorScheme="teal"
              flex={1}
              onClick={() => onEdit(event)}
            >
              Edit
            </Button>
            <Button
              leftIcon={<FaTrash />}
              size="sm"
              variant="outline"
              colorScheme="red"
              flex={1}
              onClick={() => onDelete(event)}
            >
              Delete
            </Button>
          </HStack>
          <Button
            leftIcon={<FaUsers />}
            size="sm"
            variant="solid"
            colorScheme="blue"
            width="100%"
            onClick={() => onViewParticipants(event)}
          >
            View Participants ({event.attendees?.length || 0})
          </Button>
        </VStack>
      </CardFooter>
    </Card>
  )
}

// Event Modal Component (Create/Edit)
const EventModal = ({ isOpen, onClose, title, formData, setFormData, onSubmit, submitText }) => {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg="gray.800" border="1px solid" borderColor="gray.600" maxH="90vh">
        <ModalHeader color="white">{title}</ModalHeader>
        <ModalCloseButton color="gray.400" />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Basic Information */}
            <Heading size="md" color="teal.300">Basic Information</Heading>
            
            <FormControl>
              <FormLabel color="gray.300">Event Title</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                bg="gray.700"
                border="1px solid"
                borderColor="gray.600"
                color="white"
                _focus={{ borderColor: 'teal.400' }}
                placeholder="Enter event title"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.300">Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                bg="gray.700"
                border="1px solid"
                borderColor="gray.600"
                color="white"
                _focus={{ borderColor: 'teal.400' }}
                placeholder="Describe your event"
                rows={4}
              />
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel color="gray.300">Category</FormLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  bg="gray.700"
                  border="1px solid"
                  borderColor="gray.600"
                  color="white"
                  _focus={{ borderColor: 'teal.400' }}
                >
                  <option value="Technology">Technology</option>
                  <option value="Music">Music</option>
                  <option value="Art">Art</option>
                  <option value="Sports">Sports</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Business">Business</option>
                  <option value="Food & Drink">Food & Drink</option>
                  <option value="General">General</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel color="gray.300">Visibility</FormLabel>
                <RadioGroup
                  value={formData.visibility}
                  onChange={(value) => handleInputChange('visibility', value)}
                >
                  <Stack direction="row" spacing={4}>
                    <Radio value="public" colorScheme="teal">
                      <HStack>
                        <Icon as={FaGlobe} />
                        <Text color="gray.300">Public</Text>
                      </HStack>
                    </Radio>
                    <Radio value="private" colorScheme="teal">
                      <HStack>
                        <Icon as={FaLock} />
                        <Text color="gray.300">Private</Text>
                      </HStack>
                    </Radio>
                    <Radio value="invite-only" colorScheme="teal">
                      <HStack>
                        <Icon as={FaUserFriends} />
                        <Text color="gray.300">Invite Only</Text>
                      </HStack>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>

            {/* Date & Time */}
            <Heading size="md" color="teal.300">Date & Time</Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel color="gray.300">Date</FormLabel>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  bg="gray.700"
                  border="1px solid"
                  borderColor="gray.600"
                  color="white"
                  _focus={{ borderColor: 'teal.400' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="gray.300">Time</FormLabel>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  bg="gray.700"
                  border="1px solid"
                  borderColor="gray.600"
                  color="white"
                  _focus={{ borderColor: 'teal.400' }}
                />
              </FormControl>
            </SimpleGrid>

            {/* Location */}
            <Heading size="md" color="teal.300">Location</Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel color="gray.300">Venue</FormLabel>
                <Input
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  bg="gray.700"
                  border="1px solid"
                  borderColor="gray.600"
                  color="white"
                  _focus={{ borderColor: 'teal.400' }}
                  placeholder="e.g., Convention Center"
                />
              </FormControl>

              <FormControl>
                <FormLabel color="gray.300">Address</FormLabel>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  bg="gray.700"
                  border="1px solid"
                  borderColor="gray.600"
                  color="white"
                  _focus={{ borderColor: 'teal.400' }}
                  placeholder="Full address"
                />
              </FormControl>
            </SimpleGrid>

            {/* Images */}
            <Heading size="md" color="teal.300">Images</Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel color="gray.300">Main Image URL</FormLabel>
                <Input
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  bg="gray.700"
                  border="1px solid"
                  borderColor="gray.600"
                  color="white"
                  _focus={{ borderColor: 'teal.400' }}
                  placeholder="Event image URL"
                />
              </FormControl>

              <FormControl>
                <FormLabel color="gray.300">Poster/Flyer URL (Optional)</FormLabel>
                <Input
                  value={formData.poster}
                  onChange={(e) => handleInputChange('poster', e.target.value)}
                  bg="gray.700"
                  border="1px solid"
                  borderColor="gray.600"
                  color="white"
                  _focus={{ borderColor: 'teal.400' }}
                  placeholder="Digital poster URL"
                />
              </FormControl>
            </SimpleGrid>

            {/* Ticket Information */}
            <Heading size="md" color="teal.300">Ticket Information</Heading>
            
            <FormControl>
              <FormLabel color="gray.300">Ticket Type</FormLabel>
              <RadioGroup
                value={formData.ticketType}
                onChange={(value) => handleInputChange('ticketType', value)}
              >
                <Stack direction="row" spacing={6}>
                  <Radio value="free" colorScheme="teal">
                    <Text color="gray.300">Free Event</Text>
                  </Radio>
                  <Radio value="paid" colorScheme="teal">
                    <Text color="gray.300">Paid Event</Text>
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {formData.ticketType === 'paid' && (
              <FormControl>
                <FormLabel color="gray.300">Ticket Price ($)</FormLabel>
                <NumberInput
                  value={formData.ticketPrice}
                  onChange={(value) => handleInputChange('ticketPrice', parseFloat(value) || 0)}
                  min={0}
                  precision={2}
                  step={0.01}
                >
                  <NumberInputField
                    bg="gray.700"
                    border="1px solid"
                    borderColor="gray.600"
                    color="white"
                    _focus={{ borderColor: 'teal.400' }}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            )}

            <FormControl>
              <FormLabel color="gray.300">Ticket Details (Optional)</FormLabel>
              <Textarea
                value={formData.ticketDetails}
                onChange={(e) => handleInputChange('ticketDetails', e.target.value)}
                bg="gray.700"
                border="1px solid"
                borderColor="gray.600"
                color="white"
                _focus={{ borderColor: 'teal.400' }}
                placeholder="Additional ticket information"
                rows={2}
              />
            </FormControl>

            {/* Additional Settings */}
            <Heading size="md" color="teal.300">Additional Settings</Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel color="gray.300">Max Attendees (Optional)</FormLabel>
                <NumberInput
                  value={formData.maxAttendees}
                  onChange={(value) => handleInputChange('maxAttendees', value)}
                  min={1}
                >
                  <NumberInputField
                    bg="gray.700"
                    border="1px solid"
                    borderColor="gray.600"
                    color="white"
                    _focus={{ borderColor: 'teal.400' }}
                    placeholder="Leave empty for unlimited"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel color="gray.300">Tags (comma-separated)</FormLabel>
                <Input
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  bg="gray.700"
                  border="1px solid"
                  borderColor="gray.600"
                  color="white"
                  _focus={{ borderColor: 'teal.400' }}
                  placeholder="e.g., networking, tech, startup"
                />
              </FormControl>
            </SimpleGrid>

            {/* Co-Host Management */}
            <Heading size="md" color="teal.300">Co-Host Management (Optional)</Heading>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" color="gray.400">
                Add co-hosts to help manage your event. Co-hosts can have different permission levels.
              </Text>
              
              {formData.coHosts.length > 0 && (
                <VStack align="stretch" spacing={2}>
                  {formData.coHosts.map((coHost, index) => (
                    <HStack 
                      key={index}
                      p={3}
                      bg="gray.700"
                      rounded="md"
                      justify="space-between"
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" color="white">{coHost.name}</Text>
                        <HStack spacing={4} fontSize="xs" color="gray.400">
                          <Text>Edit: {coHost.permissions.canEdit ? '✓' : '✗'}</Text>
                          <Text>Manage Attendees: {coHost.permissions.canManageAttendees ? '✓' : '✗'}</Text>
                          <Text>Cancel: {coHost.permissions.canCancel ? '✓' : '✗'}</Text>
                        </HStack>
                      </VStack>
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => {
                          const newCoHosts = formData.coHosts.filter((_, i) => i !== index)
                          handleInputChange('coHosts', newCoHosts)
                        }}
                      >
                        Remove
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              )}
              
              <Button
                leftIcon={<FaUserPlus />}
                variant="outline"
                colorScheme="teal"
                size="sm"
                onClick={() => {
                  // For demo purposes, add a sample co-host
                  // In a real app, this would open a user search modal
                  const newCoHost = {
                    userId: 'sample-id',
                    name: 'Sample Co-Host',
                    avatar: 'https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg',
                    permissions: {
                      canEdit: true,
                      canManageAttendees: true,
                      canCancel: false
                    }
                  }
                  handleInputChange('coHosts', [...formData.coHosts, newCoHost])
                }}
              >
                Add Co-Host (Demo)
              </Button>
              
              <Text fontSize="xs" color="gray.500">
                Note: In the full version, you would search and select existing users as co-hosts.
              </Text>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="teal" onClick={onSubmit}>
            {submitText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default HostProfilePage