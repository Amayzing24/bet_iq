import React from "react"
import { BrowserRouter } from "react-router-dom"
import { Box, Container, useColorModeValue } from "@chakra-ui/react"
import AppRouter from "./router/AppRouter"
import Header from "./components/Header"
import Footer from "./components/Footer"

export default function App() {
  const bgColor = useColorModeValue("gray.50", "gray.900")
  
  return (
    <BrowserRouter>
      <Box 
        minH="100vh" 
        display="flex" 
        flexDirection="column"
        bg={bgColor}
      >
        <Header />
        <Container 
          maxW="container.xl" 
          flex="1" 
          py={8}
          px={{ base: 4, md: 8 }}
        >
          <AppRouter />
        </Container>
        <Footer />
      </Box>
    </BrowserRouter>
  )
}
