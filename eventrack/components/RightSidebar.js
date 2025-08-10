'use client'

import { Box, VStack, HStack, Text, Avatar, Button, Icon } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'

const RightSidebar = () => {
  const suggestedHosts = [
    {
      name: 'TechEvents',
      category: 'Technology Conferences',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    },
    {
      name: 'MusicFest',
      category: 'Music Festivals',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    },
    {
      name: 'ArtGallery',
      category: 'Art Exhibitions',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
    }
  ]

  return (
    <Box
      w="320px"
      p={6}
      bg="rgba(31, 41, 55, 0.7)"
      color="white"
      display={{ base: 'none', xl: 'block' }}
      position="fixed"
      right={0}
      top={0}
      h="100vh"
      overflowY="auto"
    >
      {/* Suggested Hosts */}
      <Box bg="gray.800" rounded="lg" p={4}>
        <Text fontWeight="bold" mb={4} fontSize="lg">
          Suggested Event Hosts
        </Text>
        
        <VStack spacing={4} align="stretch">
          {suggestedHosts.map((host, index) => (
            <HStack key={index} justify="space-between" align="center">
              <HStack spacing={3} flex={1} minW={0}>
                <Avatar size="sm" src={host.avatar} />
                <Box flex={1} minW={0}>
                  <Text 
                    fontWeight="medium" 
                    fontSize="sm"
                    noOfLines={1}
                  >
                    {host.name}
                  </Text>
                  <Text 
                    color="gray.400" 
                    fontSize="xs"
                    noOfLines={1}
                  >
                    {host.category}
                  </Text>
                </Box>
              </HStack>
              <Button
                size="sm"
                variant="ghost"
                color="teal.300"
                _hover={{ color: 'white', bg: 'teal.900' }}
                p={2}
                minW="auto"
                transition="all 0.2s"
              >
                <Icon as={FaPlus} />
              </Button>
            </HStack>
          ))}
        </VStack>

        <Button
          variant="ghost"
          size="sm"
          color="teal.300"
          _hover={{ 
            textDecoration: 'underline',
            bg: 'transparent'
          }}
          mt={4}
          w="full"
          fontSize="sm"
        >
          See More Suggestions
        </Button>
      </Box>
    </Box>
  )
}

export default RightSidebar
