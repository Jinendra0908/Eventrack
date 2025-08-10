'use client'

import { Box, Skeleton, VStack, HStack, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

const PostCardSkeleton = () => (
  <Box
    bg="gray.800"
    rounded="lg"
    mb={{ base: 4, md: 6 }}
    overflow="hidden"
    w="full"
    mx="auto"
    p={4}
  >
    {/* Header Skeleton */}
    <HStack spacing={3} mb={4}>
      <SkeletonCircle size="12" />
      <VStack align="start" spacing={2} flex={1}>
        <Skeleton height="20px" width="120px" />
        <Skeleton height="16px" width="80px" />
      </VStack>
    </HStack>

    {/* Content Skeleton */}
    <SkeletonText mt="4" noOfLines={3} spacing="4" mb={4} />

    {/* Image Skeleton */}
    <Skeleton height={{ base: "200px", md: "300px", lg: "400px" }} width="100%" mb={4} />

    {/* Actions Skeleton */}
    <HStack spacing={2} mb={3}>
      <Skeleton height="40px" flex={1} />
      <Skeleton height="40px" flex={1} />
      <Skeleton height="40px" flex={1} />
    </HStack>

    {/* Footer Skeleton */}
    <VStack align="start" spacing={2}>
      <SkeletonText noOfLines={2} spacing="2" />
      <Skeleton height="16px" width="100px" />
    </VStack>
  </Box>
)

const FeedSkeleton = () => (
  <Box
    maxW={{ base: "100%", md: "xl", lg: "2xl" }}
    w="full"
    mx="auto"
    px={{ base: 2, md: 4 }}
  >
    <VStack spacing={{ base: 4, md: 6 }}>
      {[...Array(3)].map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </VStack>
  </Box>
)

export default FeedSkeleton
