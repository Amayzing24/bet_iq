import React from "react"
import { Flex, Heading, Spacer, IconButton } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { useColorMode } from "@chakra-ui/react"

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex
      bg="gray.800"
      p={4}
      align="center"
      boxShadow="md"
    >
      <Link to="/">
        <Heading
          as="h1"
          size="md"
          bgGradient="linear(to-r, teal.300, blue.500)"
          bgClip="text"
        >
          BetIQ
        </Heading>
      </Link>
      <Spacer />
      <Link to="/risk">
        {/* optional risk button or link */}
      </Link>
      <IconButton
        ml={4}
        variant="outline"
        colorScheme="teal"
        aria-label="Toggle color mode"
        onClick={toggleColorMode}
        icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
      />
    </Flex>
  )
}
