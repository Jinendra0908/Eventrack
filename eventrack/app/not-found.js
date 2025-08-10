'use client'

import { 
  Box, 
  Container, 
  VStack,
  Heading, 
  Text, 
  Button,
  Icon
} from '@chakra-ui/react'
import { FaHome, FaExclamationTriangle } from 'react-icons/fa'
import Link from 'next/link'

const NotFoundPage = () => {
  return (
    <Box
      minH="100vh"
      bgGradient="linear(135deg, #000000 0%, #0a2626 100%)"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="md" textAlign="center">
        <VStack spacing={8}>
          <Icon as={FaExclamationTriangle} boxSize={20} color="teal.300" />
          
          <VStack spacing={4}>
            <Heading size="2xl">404</Heading>
            <Heading size="lg" color="gray.400">
              Page Not Found
            </Heading>
            <Text color="gray.500" maxW="md">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </Text>
          </VStack>

          <VStack spacing={4}>
            <Link href="/" passHref>
              <Button
                leftIcon={<FaHome />}
                bgGradient="linear(135deg, teal.600 0%, #0a2626 100%)"
                color="white"
                _hover={{
                  opacity: 0.9,
                  transform: 'translateY(-1px)'
                }}
                _active={{
                  transform: 'translateY(0)'
                }}
                size="lg"
              >
                Go Home
              </Button>
            </Link>
            
            <Link href="/explore" passHref>
              <Button
                variant="ghost"
                color="gray.400"
                _hover={{
                  color: "white",
                  bg: "rgba(255, 255, 255, 0.1)"
                }}
              >
                Explore Events
              </Button>
            </Link>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}

export default NotFoundPage
