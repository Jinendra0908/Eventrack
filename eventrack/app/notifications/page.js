'use client'

import { 
  Box, 
  Container, 
  VStack, 
  HStack,
  Heading, 
  Text, 
  Button,
  Icon,
  Flex,
  Divider,
  ButtonGroup,
  Card,
  CardBody
} from '@chakra-ui/react'
import { 
  FaClock,
  FaEdit,
  FaCheck,
  FaTicketAlt,
  FaBellSlash,
  FaFileUpload,
  FaCalendarPlus,
  FaHotel,
  FaCalendarDay,
  FaBell
} from 'react-icons/fa'
import { useState, useEffect, memo } from 'react'
import { Sidebar, MobileNavbar } from '../../components/LazyComponents'

const CountdownTimer = memo(({ targetDate, textColor = "teal.300" }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const diff = new Date(targetDate) - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      setTimeLeft({ days, hours, minutes })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <Text
      fontFamily="monospace"
      fontSize="lg"
      fontWeight="bold"
      color={textColor}
    >
      {String(timeLeft.days).padStart(2, '0')}d{' '}
      {String(timeLeft.hours).padStart(2, '0')}h{' '}
      {String(timeLeft.minutes).padStart(2, '0')}m
    </Text>
  )
})

CountdownTimer.displayName = 'CountdownTimer'

const NotificationItem = memo(({ notification, type = 'deadline' }) => {
  const getBorderColor = () => {
    if (type === 'deadline') {
      switch (notification.priority) {
        case 'urgent': return 'red.500'
        case 'warning': return 'yellow.500'
        case 'normal': return 'green.500'
        default: return 'gray.500'
      }
    }
    return 'teal.500'
  }

  const getTitleColor = () => {
    if (type === 'deadline') {
      switch (notification.priority) {
        case 'urgent': return 'red.400'
        case 'warning': return 'yellow.400'
        case 'normal': return 'white'
        default: return 'white'
      }
    }
    return 'white'
  }

  const getTimerColor = () => {
    if (type === 'deadline') {
      switch (notification.priority) {
        case 'urgent': return 'red.400'
        case 'warning': return 'yellow.400'
        case 'normal': return 'green.400'
        default: return 'teal.300'
      }
    }
    return 'teal.300'
  }

  return (
    <Card
      bg="gray.800"
      borderLeft="4px solid"
      borderLeftColor={getBorderColor()}
      borderRadius="0 md md 0"
      _hover={{
        bg: "rgba(44, 122, 122, 0.2)"
      }}
      transition="background-color 0.2s ease"
      mb={3}
    >
      <CardBody>
        <Flex justify="space-between" align="start" mb={4}>
          <VStack align="start" spacing={2} flex={1}>
            <Heading size="md" color={getTitleColor()}>
              {notification.priority === 'urgent' && 'URGENT: '}
              {notification.title}
            </Heading>
            <Text color="gray.400">
              {notification.subtitle}
            </Text>
            <HStack spacing={2}>
              <Icon as={FaCalendarDay} color="teal.300" />
              <Text fontSize="sm" color="gray.300">
                {notification.dueDate}
              </Text>
            </HStack>
          </VStack>
          
          <CountdownTimer 
            targetDate={notification.targetDate} 
            textColor={getTimerColor()}
          />
        </Flex>
        
        <Divider borderColor="gray.700" mb={3} />
        
        <Flex justify="flex-end" gap={2}>
          {notification.actions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              leftIcon={<Icon as={action.icon} />}
              bg={action.primary ? "teal.800" : "gray.700"}
              _hover={{
                bg: action.primary ? "teal.700" : "gray.600"
              }}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </Flex>
      </CardBody>
    </Card>
  )
})

NotificationItem.displayName = 'NotificationItem'

const NotificationsPage = () => {
  const [mounted, setMounted] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  
  // Sample notification data
  const [deadlines] = useState([
    {
      id: 1,
      title: "Final Submission",
      subtitle: "Tech Conference Proposal",
      dueDate: "Due: August 15, 2025 at 11:59 PM",
      targetDate: "2025-08-15T23:59:59",
      priority: "urgent",
      actions: [
        { label: "Edit", icon: FaEdit, primary: true, onClick: () => {} },
        { label: "Mark Complete", icon: FaCheck, primary: false, onClick: () => {} }
      ]
    },
    {
      id: 2,
      title: "Early Bird Registration",
      subtitle: "Summer Music Festival",
      dueDate: "Due: August 30, 2025 at 11:59 PM",
      targetDate: "2025-08-30T23:59:59",
      priority: "warning",
      actions: [
        { label: "Register", icon: FaTicketAlt, primary: true, onClick: () => {} },
        { label: "Snooze", icon: FaBellSlash, primary: false, onClick: () => {} }
      ]
    },
    {
      id: 3,
      title: "Artist Application",
      subtitle: "Modern Art Exhibition",
      dueDate: "Due: September 10, 2025 at 5:00 PM",
      targetDate: "2025-09-10T17:00:00",
      priority: "normal",
      actions: [
        { label: "Submit", icon: FaFileUpload, primary: true, onClick: () => {} },
        { label: "Snooze", icon: FaBellSlash, primary: false, onClick: () => {} }
      ]
    }
  ])

  const [alarms] = useState([
    {
      id: 4,
      title: "Tech Conference Starts",
      subtitle: "Future Tech Conference",
      dueDate: "Starts: September 22, 2025 at 9:00 AM",
      targetDate: "2025-09-22T09:00:00",
      actions: [
        { label: "Add to Calendar", icon: FaCalendarPlus, primary: true, onClick: () => {} },
        { label: "Dismiss", icon: FaBellSlash, primary: false, onClick: () => {} }
      ]
    },
    {
      id: 5,
      title: "Travel Reminder",
      subtitle: "Summer Music Festival",
      dueDate: "Reminder: August 14, 2025 at 6:00 AM",
      targetDate: "2025-08-14T06:00:00",
      actions: [
        { label: "Book Hotel", icon: FaHotel, primary: true, onClick: () => {} },
        { label: "Dismiss", icon: FaBellSlash, primary: false, onClick: () => {} }
      ]
    }
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  const getFilteredNotifications = () => {
    switch (activeFilter) {
      case 'deadlines':
        return { deadlines, alarms: [] }
      case 'alarms':
        return { deadlines: [], alarms }
      default:
        return { deadlines, alarms }
    }
  }

  const { deadlines: filteredDeadlines, alarms: filteredAlarms } = getFilteredNotifications()

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
        {/* Sticky Header */}
        <Box
          position="sticky"
          top={0}
          zIndex={10}
          p={4}
          bg="rgba(0, 0, 0, 0.8)"
          backdropFilter="blur(8px)"
          borderBottom="1px solid"
          borderColor="gray.800"
        >
          <VStack align="start" spacing={4}>
            <Heading size="xl">Notifications</Heading>
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button
                bg={activeFilter === 'all' ? 'teal.800' : 'transparent'}
                borderColor="teal.600"
                _hover={{ bg: activeFilter === 'all' ? 'teal.700' : 'gray.800' }}
                onClick={() => setActiveFilter('all')}
              >
                All
              </Button>
              <Button
                bg={activeFilter === 'deadlines' ? 'teal.800' : 'transparent'}
                borderColor="teal.600"
                _hover={{ bg: activeFilter === 'deadlines' ? 'teal.700' : 'gray.800' }}
                onClick={() => setActiveFilter('deadlines')}
              >
                Deadlines
              </Button>
              <Button
                bg={activeFilter === 'alarms' ? 'teal.800' : 'transparent'}
                borderColor="teal.600"
                _hover={{ bg: activeFilter === 'alarms' ? 'teal.700' : 'gray.800' }}
                onClick={() => setActiveFilter('alarms')}
              >
                Alarms
              </Button>
              <Button
                bg={activeFilter === 'mentions' ? 'teal.800' : 'transparent'}
                borderColor="teal.600"
                _hover={{ bg: activeFilter === 'mentions' ? 'teal.700' : 'gray.800' }}
                onClick={() => setActiveFilter('mentions')}
              >
                Mentions
              </Button>
            </ButtonGroup>
          </VStack>
        </Box>

        <Container maxW="4xl" py={6}>
          <VStack spacing={8} align="stretch">
            {/* Deadlines Section */}
            {filteredDeadlines.length > 0 && (
              <Box>
                <Heading size="lg" mb={4} display="flex" alignItems="center">
                  <Icon as={FaClock} mr={2} color="teal.300" />
                  Upcoming Deadlines
                </Heading>
                
                {filteredDeadlines.map((deadline) => (
                  <NotificationItem
                    key={deadline.id}
                    notification={deadline}
                    type="deadline"
                  />
                ))}
              </Box>
            )}

            {/* Alarms Section */}
            {filteredAlarms.length > 0 && (
              <Box borderTop={filteredDeadlines.length > 0 ? "1px solid" : "none"} borderColor="gray.800" pt={filteredDeadlines.length > 0 ? 8 : 0}>
                <Heading size="lg" mb={4} display="flex" alignItems="center">
                  <Icon as={FaClock} mr={2} color="teal.300" />
                  Active Alarms
                </Heading>
                
                {filteredAlarms.map((alarm) => (
                  <NotificationItem
                    key={alarm.id}
                    notification={alarm}
                    type="alarm"
                  />
                ))}
              </Box>
            )}

            {/* Empty State */}
            {filteredDeadlines.length === 0 && filteredAlarms.length === 0 && (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py={20}
                textAlign="center"
              >
                <Icon as={FaBell} boxSize={20} color="gray.500" mb={6} />
                <Heading size="lg" color="gray.400" mb={4}>
                  No Notifications
                </Heading>
                <Text color="gray.500" maxW="md">
                  You're all caught up! No new notifications at this time.
                </Text>
              </Flex>
            )}
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

export default NotificationsPage
