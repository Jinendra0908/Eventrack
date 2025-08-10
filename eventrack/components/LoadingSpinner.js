'use client'

import { Box, Spinner, VStack, Text } from '@chakra-ui/react'

const LoadingSpinner = ({ message = "Loading..." }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    minH="100vh"
    bgGradient="linear(135deg, #000000 0%, #0a2626 100%)"
    color="white"
  >
    <VStack spacing={4}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="teal.500"
        size="xl"
      />
      <Text fontSize="lg">{message}</Text>
    </VStack>
  </Box>
)

export default LoadingSpinner
