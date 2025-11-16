'use client'

import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Grid, 
  VStack, 
  HStack, 
  Icon
} from '@chakra-ui/react'
import { 
  FaMusic, 
  FaRunning, 
  FaGamepad, 
  FaPlane, 
  FaFutbol
} from 'react-icons/fa'
import { memo, useMemo } from 'react'
import Link from 'next/link'

const CommunityCard = memo(({ community }) => (
  <Link href="/chat">
    <Box
      bg="rgba(0, 0, 0, 0.7)"
      rounded="lg"
      p={6}
      transition="all 0.3s ease"
      _hover={{ 
        bg: "rgba(0, 0, 0, 0.9)",
        transform: "translateY(-2px)"
      }}
    >
      <HStack spacing={4}>
        <Box
          w={16}
          h={16}
          bg="rgba(13, 148, 136, 0.2)"
          rounded="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={community.icon} fontSize="2xl" color="teal.400" />
        </Box>
        <VStack align="start" spacing={1}>
          <Heading size="md">{community.name}</Heading>
          <Text color="gray.400" fontSize="sm">
            {community.memberCount} members
          </Text>
        </VStack>
      </HStack>
    </Box>
  </Link>
))

CommunityCard.displayName = 'CommunityCard'

const CommunitySection = memo(({ title, icon, communities, sectionId }) => (
  <Box mb={12} id={sectionId}>
    <Heading 
      size="lg" 
      mb={6} 
      display="flex" 
      alignItems="center" 
      gap={3}
    >
      <Icon as={icon} color="teal.400" />
      {title}
    </Heading>
    <Grid 
      templateColumns={{ 
        base: "1fr", 
        md: "repeat(2, 1fr)", 
        lg: "repeat(3, 1fr)" 
      }}
      gap={6}
    >
      {communities.map((community, index) => (
        <CommunityCard key={index} community={community} />
      ))}
    </Grid>
  </Box>
))

CommunitySection.displayName = 'CommunitySection'

const CommunitiesPage = () => {
  // Memoize community data to prevent re-creation
  const communityData = useMemo(() => ({
    musicCommunities: [
      { name: 'Pop Music', memberCount: '1.2k', icon: FaMusic },
      { name: 'Rock & Metal', memberCount: '980', icon: FaMusic },
      { name: 'Electronic Dance', memberCount: '2.1k', icon: FaMusic },
      { name: 'Classical Music', memberCount: '567', icon: FaMusic },
      { name: 'Hip Hop Culture', memberCount: '1.8k', icon: FaMusic },
      { name: 'Jazz Enthusiasts', memberCount: '432', icon: FaMusic }
    ],
    sportsCommunities: [
      { name: 'Soccer Fans', memberCount: '3.4k', icon: FaFutbol },
      { name: 'Basketball League', memberCount: '2.7k', icon: FaRunning },
      { name: 'Tennis Club', memberCount: '1.1k', icon: FaRunning },
      { name: 'Marathon Runners', memberCount: '1.9k', icon: FaRunning },
      { name: 'Cycling Community', memberCount: '1.5k', icon: FaRunning },
      { name: 'Swimming Club', memberCount: '890', icon: FaRunning }
    ],
    gamingCommunities: [
      { name: 'PC Gaming', memberCount: '4.2k', icon: FaGamepad },
      { name: 'Console Gamers', memberCount: '3.1k', icon: FaGamepad },
      { name: 'Mobile Gaming', memberCount: '2.8k', icon: FaGamepad },
      { name: 'Esports Fans', memberCount: '5.1k', icon: FaGamepad },
      { name: 'Indie Games', memberCount: '1.3k', icon: FaGamepad },
      { name: 'Retro Gaming', memberCount: '976', icon: FaGamepad }
    ],
    travelCommunities: [
      { name: 'Solo Travelers', memberCount: '2.3k', icon: FaPlane },
      { name: 'Adventure Seekers', memberCount: '1.8k', icon: FaPlane },
      { name: 'Budget Travel', memberCount: '3.2k', icon: FaPlane },
      { name: 'Luxury Travel', memberCount: '1.1k', icon: FaPlane },
      { name: 'Cultural Explorers', memberCount: '1.6k', icon: FaPlane },
      { name: 'Digital Nomads', memberCount: '2.9k', icon: FaPlane }
    ]
  }), [])

  return (
    <Box
      minH="100vh"
      bgGradient="linear(135deg, #000000 0%, #0a2626 100%)"
      color="white"
    >
      <Container maxW="container.xl" py={8}>
        <Heading size="2xl" mb={8}>
          Event Communities
        </Heading>

        <CommunitySection
          title="Music Communities"
          icon={FaMusic}
          communities={communityData.musicCommunities}
          sectionId="music"
        />

        <CommunitySection
          title="Sports Communities"
          icon={FaRunning}
          communities={communityData.sportsCommunities}
          sectionId="sports"
        />

        <CommunitySection
          title="Gaming Communities"
          icon={FaGamepad}
          communities={communityData.gamingCommunities}
          sectionId="gaming"
        />

        <CommunitySection
          title="Travel Communities"
          icon={FaPlane}
          communities={communityData.travelCommunities}
          sectionId="travel"
        />
      </Container>
    </Box>
  )
}

export default CommunitiesPage
