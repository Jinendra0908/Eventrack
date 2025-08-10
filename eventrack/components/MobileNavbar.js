'use client'

import { Box, HStack, VStack, Icon, Text } from '@chakra-ui/react'
import { 
  FaHome, 
  FaCompass, 
  FaBell, 
  FaBookmark, 
  FaUser
} from 'react-icons/fa'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MobileNavbar = () => {
  const pathname = usePathname()
  
  const navItems = [
    { icon: FaHome, label: 'Home', href: '/' },
    { icon: FaCompass, label: 'Explore', href: '/explore' },
    { icon: FaBell, label: 'Notifications', href: '/notifications' },
    { icon: FaBookmark, label: 'Saved', href: '/saved' },
    { icon: FaUser, label: 'Profile', href: '/profile' },
  ]

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="rgba(10, 38, 38, 0.95)"
      backdropFilter="blur(10px)"
      borderTop="1px solid"
      borderColor="gray.700"
      py={2}
      px={4}
      display={{ base: 'block', md: 'none' }}
      zIndex={1000}
    >
      <HStack spacing={0} justify="space-around">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <VStack
              spacing={1}
              flex={1}
              py={2}
              color={pathname === item.href ? 'teal.300' : 'gray.400'}
              _hover={{ color: 'teal.300' }}
              transition="all 0.2s"
              cursor="pointer"
            >
              <Icon as={item.icon} boxSize={5} />
              <Text fontSize="xs" fontWeight="medium">
                {item.label}
              </Text>
            </VStack>
          </Link>
        ))}
      </HStack>
    </Box>
  )
}

export default MobileNavbar
