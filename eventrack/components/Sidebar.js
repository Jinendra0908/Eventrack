'use client'

import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Link as ChakraLink, 
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Collapse,
  useDisclosure
} from '@chakra-ui/react'
import { 
  FaHome, 
  FaCompass, 
  FaBell, 
  FaBookmark, 
  FaUsers, 
  FaUser, 
  FaEllipsisH,
  FaCalendarAlt,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaChevronDown,
  FaMusic,
  FaRunning,
  FaGamepad,
  FaPlane,
  FaComments,
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const Sidebar = ({ isOpen, onClose }) => {
  const { isOpen: isCategoriesOpen, onToggle: onCategoriesToggle } = useDisclosure()
  const pathname = usePathname()
  
  const navItems = [
    { icon: FaHome, label: 'Home', href: '/' },
    { icon: FaCompass, label: 'Explore', href: '/explore' },
    { icon: FaBell, label: 'Notifications', href: '/notifications' },
    { icon: FaBookmark, label: 'Saved', href: '/saved' },
  ]

  const authItems = [
    { icon: FaSignInAlt, label: 'Sign In', href: '/login' },
    { icon: FaUserPlus, label: 'Sign Up', href: '/signup' },
  ]

  const communityCategories = [
    { icon: FaMusic, label: 'Music', href: '/communities#music' },
    { icon: FaRunning, label: 'Sports', href: '/communities#sports' },
    { icon: FaGamepad, label: 'Gaming', href: '/communities#gaming' },
    { icon: FaPlane, label: 'Travel', href: '/communities#travel' },
  ]

  const SidebarContent = () => (
    <VStack spacing={8} align="stretch" h="full">
      {/* Logo */}
      <HStack spacing={2}>
        <Icon as={FaCalendarAlt} color="teal.300" fontSize="2xl" />
        <Text fontWeight="bold" fontSize="xl">EventTrack</Text>
      </HStack>

      {/* Navigation */}
      <VStack spacing={4} align="stretch">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} passHref>
            <ChakraLink
              _hover={{ textDecoration: 'none' }}
              onClick={onClose}
            >
              <HStack
                spacing={3}
                p={3}
                rounded="lg"
                bg={pathname === item.href ? 'teal.900' : 'transparent'}
                _hover={{ bg: 'teal.900' }}
                transition="all 0.2s"
              >
                <Icon as={item.icon} w={5} h={5} />
                <Text fontSize={{ base: "sm", md: "md" }}>{item.label}</Text>
              </HStack>
            </ChakraLink>
          </Link>
        ))}

        {/* Communities with Dropdown */}
        <VStack spacing={1} align="stretch">
          <Button
            onClick={onCategoriesToggle}
            variant="ghost"
            justifyContent="flex-start"
            p={3}
            bg="teal.900"
            color="white"
            _hover={{ bg: 'teal.800' }}
            leftIcon={<Icon as={FaUsers} w={5} h={5} />}
            rightIcon={
              <Icon 
                as={FaChevronDown} 
                w={3} 
                h={3} 
                transform={isCategoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                transition="transform 0.2s"
              />
            }
          >
            Communities
          </Button>

          <Collapse in={isCategoriesOpen} animateOpacity>
            <VStack spacing={1} pl={8} pt={2}>
              {communityCategories.map((category) => (
                <Link
                  key={category.label}
                  href={category.href}
                  passHref
                >
                  <ChakraLink
                    _hover={{ textDecoration: 'none' }}
                    onClick={onClose}
                    w="full"
                  >
                    <HStack
                      spacing={3}
                      p={2}
                      rounded="lg"
                      _hover={{ bg: 'teal.900' }}
                      transition="all 0.2s"
                    >
                      <Icon as={category.icon} w={4} h={4} />
                      <Text fontSize="sm">{category.label}</Text>
                    </HStack>
                  </ChakraLink>
                </Link>
              ))}
            </VStack>
          </Collapse>
        </VStack>

        <Link href="/chat" passHref>
          <ChakraLink
            _hover={{ textDecoration: 'none' }}
            onClick={onClose}
          >
            <HStack
              spacing={3}
              p={3}
              rounded="lg"
              bg={pathname === '/chat' ? 'teal.900' : 'transparent'}
              _hover={{ bg: 'teal.900' }}
              transition="all 0.2s"
            >
              <Icon as={FaComments} w={5} h={5} />
              <Text fontSize={{ base: "sm", md: "md" }}>Chat</Text>
            </HStack>
          </ChakraLink>
        </Link>

        <Link href="/profile" passHref>
          <ChakraLink
            _hover={{ textDecoration: 'none' }}
            onClick={onClose}
          >
            <HStack
              spacing={3}
              p={3}
              rounded="lg"
              bg={pathname === '/profile' ? 'teal.900' : 'transparent'}
              _hover={{ bg: 'teal.900' }}
              transition="all 0.2s"
            >
              <Icon as={FaUser} w={5} h={5} />
              <Text fontSize={{ base: "sm", md: "md" }}>Profile</Text>
            </HStack>
          </ChakraLink>
        </Link>
      </VStack>

      {/* Authentication Section */}
      <VStack spacing={2} align="stretch">
        <Text fontSize="xs" color="gray.500" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
          Account
        </Text>
        {authItems.map((item) => (
          <Link key={item.label} href={item.href} passHref>
            <ChakraLink
              _hover={{ textDecoration: 'none' }}
              onClick={onClose}
            >
              <HStack
                spacing={3}
                p={3}
                rounded="lg"
                _hover={{ bg: 'teal.900' }}
                transition="all 0.2s"
              >
                <Icon as={item.icon} w={5} h={5} />
                <Text fontSize={{ base: "sm", md: "md" }}>{item.label}</Text>
              </HStack>
            </ChakraLink>
          </Link>
        ))}
      </VStack>

      {/* Footer */}
      <Box mt="auto">
        <HStack spacing={4} justify="center">
          <ChakraLink href="#" color="teal.300" _hover={{ color: 'white' }}>
            <Icon as={FaTwitter} boxSize={5} />
          </ChakraLink>
          <ChakraLink href="#" color="teal.300" _hover={{ color: 'white' }}>
            <Icon as={FaInstagram} boxSize={5} />
          </ChakraLink>
          <ChakraLink href="#" color="teal.300" _hover={{ color: 'white' }}>
            <Icon as={FaGithub} boxSize={5} />
          </ChakraLink>
        </HStack>
      </Box>
    </VStack>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        w="256px"
        h="100vh"
        p={6}
        bgGradient="linear(135deg, #0a2626 0%, #000000 100%)"
        color="white"
        position="fixed"
        left={0}
        top={0}
        display={{ base: 'none', md: 'block' }}
        zIndex={100}
      >
        <SidebarContent />
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent
          bgGradient="linear(135deg, #0a2626 0%, #000000 100%)"
          color="white"
        >
          <DrawerCloseButton />
          <DrawerBody p={6}>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Sidebar
