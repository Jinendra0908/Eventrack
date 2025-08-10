'use client'

import { Box, VStack } from '@chakra-ui/react'
import { memo, useState, useEffect } from 'react'
import PostCard from './PostCard'
import FeedSkeleton from './FeedSkeleton'

const Feed = memo(() => {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    // Simulate data loading
    const loadPosts = async () => {
      setLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const postData = [
        {
          username: 'TechEvents',
          userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
          timeAgo: '2h ago',
          content: 'Just announced! Our biggest tech conference of the year is happening next month. Early bird tickets are now available!',
          image: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg',
          imageAlt: 'Tech Conference',
          description: 'Early bird tickets available until June 30th. Don\'t miss out on this incredible opportunity to network with industry leaders!',
          commentsCount: 84,
          date: 'June 1, 2023'
        },
        {
          username: 'MusicFest',
          userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
          timeAgo: '5h ago',
          content: 'Lineup announcement coming this Friday! Who are you hoping to see at this year\'s festival?',
          image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
          imageAlt: 'Music Festival',
          description: 'Only 2 days until we reveal the full lineup! Stay tuned for updates.',
          commentsCount: 56,
          date: 'May 31, 2023'
        }
      ]
      
      setPosts(postData)
      setLoading(false)
    }

    loadPosts()
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
        {posts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </VStack>
    </Box>
  )
})

Feed.displayName = 'Feed'

export default Feed
