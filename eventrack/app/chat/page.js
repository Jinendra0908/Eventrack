'use client'

import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Input,
  Button,
  Avatar,
  Flex,
  IconButton,
  Badge,
  Spinner
} from '@chakra-ui/react'
import { 
  FaPaperPlane, 
  FaSmile, 
  FaUsers,
  FaArrowLeft
} from 'react-icons/fa'
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'

const ChatMessage = ({ message, isOwn = false }) => (
  <HStack
    spacing={3}
    align="start"
    justify={isOwn ? "flex-end" : "flex-start"}
    w="full"
  >
    {!isOwn && (
      <Avatar 
        size="sm" 
        src={message.avatar} 
        name={message.username}
        loading="lazy"
      />
    )}
    <VStack
      align={isOwn ? "flex-end" : "flex-start"}
      spacing={1}
      maxW="70%"
    >
      {!isOwn && (
        <Text fontSize="xs" color="gray.400">
          {message.username}
        </Text>
      )}
      <Box
        bg={isOwn ? "teal.600" : "gray.700"}
        color="white"
        px={4}
        py={2}
        rounded="lg"
        roundedTopLeft={isOwn ? "lg" : "sm"}
        roundedTopRight={isOwn ? "sm" : "lg"}
      >
        <Text fontSize="sm">{message.text}</Text>
      </Box>
      <Text fontSize="xs" color="gray.400">
        {message.time}
      </Text>
    </VStack>
    {isOwn && (
      <Avatar 
        size="sm" 
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23319795'/%3E%3Ctext x='50%25' y='50%25' dy='0.35em' text-anchor='middle' fill='white' font-family='sans-serif' font-size='14'%3EYou%3C/text%3E%3C/svg%3E" 
        name="You"
        loading="lazy"
      />
    )}
  </HStack>
)

const ChatPage = () => {
  const [mounted, setMounted] = useState(false)
  const [message, setMessage] = useState('')
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const messageIdRef = useRef(4) // Start from 4 since we have 3 initial messages

  // Memoize initial messages to prevent re-creation
  const initialMessages = useMemo(() => [
    {
      id: 1,
      username: 'MusicLover23',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Crect width="32" height="32" fill="%23805ad5"/%3E%3Ctext x="50%25" y="50%25" dy="0.35em" text-anchor="middle" fill="white" font-family="sans-serif" font-size="12"%3EML%3C/text%3E%3C/svg%3E',
      text: 'Hey everyone! Excited about the upcoming concert!',
      time: '2:30 PM',
      isOwn: false
    },
    {
      id: 2,
      username: 'BeatDrop',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Crect width="32" height="32" fill="%23ed8936"/%3E%3Ctext x="50%25" y="50%25" dy="0.35em" text-anchor="middle" fill="white" font-family="sans-serif" font-size="12"%3EBD%3C/text%3E%3C/svg%3E',
      text: 'Same here! The lineup looks amazing this year.',
      time: '2:32 PM',
      isOwn: false
    },
    {
      id: 3,
      username: 'You',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Crect width="32" height="32" fill="%23319795"/%3E%3Ctext x="50%25" y="50%25" dy="0.35em" text-anchor="middle" fill="white" font-family="sans-serif" font-size="14"%3EYou%3C/text%3E%3C/svg%3E',
      text: 'I already got my tickets! Can\'t wait!',
      time: '2:35 PM',
      isOwn: true
    }
  ], [])

  const [messages, setMessages] = useState(initialMessages)

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      const newMessage = {
        id: messageIdRef.current++,
        username: 'You',
        avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Crect width="32" height="32" fill="%23319795"/%3E%3Ctext x="50%25" y="50%25" dy="0.35em" text-anchor="middle" fill="white" font-family="sans-serif" font-size="14"%3EYou%3C/text%3E%3C/svg%3E',
        text: message,
        time: 'Just now',
        isOwn: true
      }
      setMessages(prev => [...prev, newMessage])
      setMessage('')
    }
  }, [message])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated
    if (mounted && !loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [mounted, loading, isAuthenticated, router])

  // Show loading while checking authentication or not mounted
  if (!mounted || loading) {
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

  return (
    <Box
      minH="100vh"
      bgGradient="linear(135deg, #000000 0%, #0a2626 100%)"
      color="white"
    >
      {/* Header */}
      <Box
        bg="rgba(10, 38, 38, 0.95)"
        backdropFilter="blur(10px)"
        p={4}
        borderBottom="1px solid"
        borderColor="gray.700"
      >
        <Container maxW="container.xl">
          <HStack justify="space-between">
            <HStack spacing={4}>
              <IconButton
                as={Link}
                href="/communities"
                icon={<FaArrowLeft />}
                variant="ghost"
                color="white"
                aria-label="Go back"
              />
              <HStack spacing={3}>
                <Box
                  w={10}
                  h={10}
                  bg="rgba(13, 148, 136, 0.2)"
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FaUsers color="teal" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Heading size="md">Pop Music Community</Heading>
                  <HStack spacing={2}>
                    <Badge colorScheme="green" variant="subtle">
                      Online
                    </Badge>
                    <Text fontSize="sm" color="gray.400">
                      1.2k members
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Chat Area */}
      <Container maxW="container.xl" h="calc(100vh - 140px)" py={4}>
        <Flex direction="column" h="full">
          {/* Messages */}
          <VStack
            flex={1}
            spacing={4}
            overflowY="auto"
            p={4}
            bg="rgba(31, 41, 55, 0.3)"
            rounded="lg"
            mb={4}
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} isOwn={msg.isOwn} />
            ))}
          </VStack>

          {/* Message Input */}
          <HStack spacing={3}>
            <IconButton
              icon={<FaSmile />}
              variant="ghost"
              color="gray.400"
              aria-label="Add emoji"
            />
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              bg="gray.700"
              border="none"
              _placeholder={{ color: 'gray.400' }}
              _focus={{ bg: 'gray.600' }}
            />
            <Button
              onClick={handleSendMessage}
              colorScheme="teal"
              leftIcon={<FaPaperPlane />}
              isDisabled={!message.trim()}
            >
              Send
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default ChatPage
