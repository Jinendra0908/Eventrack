'use client'

import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Avatar, 
  Button, 
  Icon,
  IconButton,
  Stack,
  useToast
} from '@chakra-ui/react'
import Image from 'next/image'
import { 
  FaEllipsisH, 
  FaGlobeAmericas, 
  FaCheckCircle, 
  FaStar, 
  FaQuestionCircle,
  FaBookmark,
  FaRegBookmark
} from 'react-icons/fa'
import { memo, useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

const PostCard = memo(({ post }) => {
  const [isRegistered, setIsRegistered] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()
  const toast = useToast()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Check if event is saved
    if (typeof window !== 'undefined' && post.eventId) {
      const saved = localStorage.getItem('savedEvents')
      if (saved) {
        try {
          const savedEvents = JSON.parse(saved)
          const isEventSaved = savedEvents.some(e => e._id === post.eventId || e.id === post.eventId)
          setIsSaved(isEventSaved)
        } catch (error) {
          console.error('Error loading saved events:', error)
        }
      }
      
      // Check if user is registered
      if (user?._id) {
        const registered = localStorage.getItem(`registeredEvents_${user._id}`)
        if (registered) {
          try {
            const registeredEvents = JSON.parse(registered)
            const isEventRegistered = registeredEvents.some(e => e._id === post.eventId || e.id === post.eventId)
            setIsRegistered(isEventRegistered)
          } catch (error) {
            console.error('Error loading registered events:', error)
          }
        }
      }
    }
  }, [post.eventId, user?._id])

  const handleParticipate = async () => {
    if (!user?._id) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for events.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
      router.push('/login')
      return
    }

    if (isRegistered) {
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
      const token = localStorage.getItem('auth-token')
      const response = await fetch(`/api/events/${post.eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        setIsRegistered(true)
        
        // Update localStorage
        const registered = localStorage.getItem(`registeredEvents_${user._id}`)
        const registeredEvents = registered ? JSON.parse(registered) : []
        registeredEvents.push({ _id: post.eventId, id: post.eventId, title: post.content })
        localStorage.setItem(`registeredEvents_${user._id}`, JSON.stringify(registeredEvents))
        
        toast({
          title: "Registration successful!",
          description: `You are now registered for ${post.content}.`,
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

  const handleSave = () => {
    if (!mounted) return

    const eventData = {
      _id: post.eventId,
      id: post.eventId,
      title: post.content,
      description: post.description,
      image: post.image,
      date: post.date,
      venue: post.venue,
      location: post.venue,
      category: post.category,
      ticketType: post.ticketType,
      ticketPrice: post.ticketPrice,
      organizer: {
        name: post.username,
        avatar: post.userAvatar
      }
    }

    const saved = localStorage.getItem('savedEvents')
    let savedEvents = saved ? JSON.parse(saved) : []

    if (isSaved) {
      savedEvents = savedEvents.filter(e => e._id !== post.eventId && e.id !== post.eventId)
      setIsSaved(false)
      toast({
        title: "Event removed from saved",
        description: `${post.content} has been removed from your saved events.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      })
    } else {
      savedEvents.push(eventData)
      setIsSaved(true)
      toast({
        title: "Event saved!",
        description: `${post.content} has been added to your saved events.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    }

    localStorage.setItem('savedEvents', JSON.stringify(savedEvents))
  }

  const handleEnquiry = () => {
    toast({
      title: "Contact Information",
      description: "For enquiries, please check the event details or contact the organizer.",
      status: "info",
      duration: 4000,
      isClosable: true,
    })
  }
  return (
    <Box
      bg="gray.800"
      rounded="lg"
      mb={{ base: 4, md: 6 }}
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{ transform: 'translateY(-5px)' }}
      w="full"
      mx="auto"
    >
      {/* Post Header */}
      <HStack p={4} justify="space-between" align="start">
        <HStack spacing={3} flex={1}>
          <Avatar size={{ base: "sm", md: "md" }} src={post.userAvatar} />
          <Box flex={1} minW={0}>
            <Text 
              fontWeight="bold" 
              fontSize={{ base: "sm", md: "md" }}
              noOfLines={1}
            >
              {post.username}
            </Text>
            <HStack spacing={1} color="gray.400" fontSize="xs">
              <Text>{post.timeAgo}</Text>
              <Text>·</Text>
              <Icon as={FaGlobeAmericas} />
            </HStack>
          </Box>
        </HStack>
        <IconButton
          variant="ghost"
          size="sm"
          color="gray.400"
          _hover={{ color: 'white' }}
          icon={<FaEllipsisH />}
          minW="auto"
        />
      </HStack>

      {/* Post Content */}
      <Box
        px={4}
        pb={3}
        transition="all 0.3s ease"
        bg="rgba(31, 41, 55, 0.8)"
        _groupHover={{ bg: 'transparent' }}
      >
        <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.5">
          {post.content}
        </Text>
      </Box>

      {/* Post Image */}
      <Box position="relative" w="full" h={{ base: "200px", md: "300px", lg: "400px" }}>
        <Image 
          src={post.image} 
          alt={post.imageAlt} 
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          unoptimized
        />
      </Box>

      {/* Post Actions */}
      <Box p={4}>
        <Stack 
          direction={{ base: "column", sm: "row" }}
          spacing={2} 
          mb={3}
        >
          <Button
            flex={1}
            size={{ base: "sm", md: "md" }}
            bgGradient={isRegistered ? "linear(135deg, #38a169 0%, #48bb78 100%)" : "linear(135deg, #2c7a7a 0%, #38b2ac 100%)"}
            color="white"
            opacity={0.85}
            _hover={{ opacity: 1, transform: 'scale(1.02)' }}
            transition="all 0.2s ease"
            leftIcon={<FaCheckCircle />}
            fontSize={{ base: "xs", md: "sm" }}
            onClick={handleParticipate}
            isDisabled={isRegistered}
          >
            {isRegistered ? 'Registered' : 'Participate'}
          </Button>
          <Button
            flex={1}
            size={{ base: "sm", md: "md" }}
            bg="gray.700"
            color="white"
            _hover={{ bg: 'gray.600', transform: 'scale(1.02)' }}
            transition="all 0.2s ease"
            leftIcon={isSaved ? <FaBookmark /> : <FaRegBookmark />}
            fontSize={{ base: "xs", md: "sm" }}
            onClick={handleSave}
          >
            {isSaved ? 'Saved' : 'Interested'}
          </Button>
          <Button
            flex={1}
            size={{ base: "sm", md: "md" }}
            bg="gray.700"
            color="white"
            _hover={{ bg: 'gray.600', transform: 'scale(1.02)' }}
            transition="all 0.2s ease"
            leftIcon={<FaQuestionCircle />}
            fontSize={{ base: "xs", md: "sm" }}
            onClick={handleEnquiry}
          >
            Enquiry
          </Button>
        </Stack>

        <VStack align="start" spacing={2}>
          <Text fontSize={{ base: "xs", md: "sm" }} lineHeight="1.4">
            <Text as="span" fontWeight="bold">{post.username}</Text> {post.description}
          </Text>
          {post.venue && (
            <Text color="teal.300" fontSize={{ base: "xs", md: "sm" }}>
              📍 {post.venue}
            </Text>
          )}
          {post.category && (
            <Text color="gray.400" fontSize={{ base: "xs", md: "sm" }}>
              🏷️ {post.category}
            </Text>
          )}
          {post.ticketType && (
            <Text color="green.300" fontSize={{ base: "xs", md: "sm" }}>
              💰 {post.ticketType === 'free' ? 'Free Event' : `₹${post.ticketPrice}`}
            </Text>
          )}
          <Text color="gray.400" fontSize={{ base: "xs", md: "sm" }}>
            {post.commentsCount} attendees
          </Text>
          <Text color="gray.400" fontSize="xs">
            📅 {post.date}
          </Text>
        </VStack>
      </Box>
    </Box>
  )
})

PostCard.displayName = 'PostCard'

export default PostCard
