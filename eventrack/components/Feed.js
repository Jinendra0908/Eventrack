'use client'

import { Box, VStack } from '@chakra-ui/react'
import { memo, useState, useEffect } from 'react'
import PostCard from './PostCard'
import FeedSkeleton from './FeedSkeleton'

const Feed = memo(() => {
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])

  useEffect(() => {
    // Fetch random events from database
    const loadEvents = async () => {
      setLoading(true)
      
      try {
        const response = await fetch('/api/events?limit=100')
        const data = await response.json()
        
        if (data.success && data.data.events) {
          // Get 2 random events from the fetched events
          const allEvents = data.data.events
          const randomEvents = []
          
          if (allEvents.length > 0) {
            // Shuffle and pick 2 random events
            const shuffled = [...allEvents].sort(() => Math.random() - 0.5)
            randomEvents.push(...shuffled.slice(0, 2))
          }
          
          setEvents(randomEvents)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  if (loading) {
    return <FeedSkeleton />
  }

  return (
    <Box
      maxW={{ base: "100%", md: "xl", lg: "2xl" }}
      w="full"
      mx="auto"
      px={{ base: 2, md: 4 }}
    >
      <VStack spacing={{ base: 4, md: 6 }}>
        {events.map((event) => (
          <PostCard 
            key={event._id || event.id} 
            post={{
              eventId: event._id || event.id,
              username: event.organizer?.name || 'Event Organizer',
              userAvatar: event.organizer?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
              timeAgo: 'Featured Event',
              content: event.title,
              image: event.image,
              imageAlt: event.title,
              description: event.description,
              commentsCount: event.attendees?.length || 0,
              date: event.date,
              category: event.category,
              venue: event.venue,
              ticketType: event.ticketType,
              ticketPrice: event.ticketPrice
            }} 
          />
        ))}
      </VStack>
    </Box>
  )
})

Feed.displayName = 'Feed'

export default Feed
