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
  Stack
} from '@chakra-ui/react'
import Image from 'next/image'
import { 
  FaEllipsisH, 
  FaGlobeAmericas, 
  FaCheckCircle, 
  FaStar, 
  FaQuestionCircle 
} from 'react-icons/fa'
import { memo } from 'react'

const PostCard = memo(({ post }) => {
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
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
            bgGradient="linear(135deg, #2c7a7a 0%, #38b2ac 100%)"
            color="white"
            opacity={0.85}
            _hover={{ opacity: 1, transform: 'scale(1.02)' }}
            transition="all 0.2s ease"
            leftIcon={<FaCheckCircle />}
            fontSize={{ base: "xs", md: "sm" }}
          >
            Participate
          </Button>
          <Button
            flex={1}
            size={{ base: "sm", md: "md" }}
            bg="gray.700"
            color="white"
            _hover={{ bg: 'gray.600', transform: 'scale(1.02)' }}
            transition="all 0.2s ease"
            leftIcon={<FaStar />}
            fontSize={{ base: "xs", md: "sm" }}
          >
            Interested
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
          >
            Enquiry
          </Button>
        </Stack>

        <VStack align="start" spacing={2}>
          <Text fontSize={{ base: "xs", md: "sm" }} lineHeight="1.4">
            <Text as="span" fontWeight="bold">{post.username}</Text> {post.description}
          </Text>
          <Text color="gray.400" fontSize={{ base: "xs", md: "sm" }}>
            View all {post.commentsCount} comments
          </Text>
          <Text color="gray.400" fontSize="xs">
            {post.date}
          </Text>
        </VStack>
      </Box>
    </Box>
  )
})

PostCard.displayName = 'PostCard'

export default PostCard
