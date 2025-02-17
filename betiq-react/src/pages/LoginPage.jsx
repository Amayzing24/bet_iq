import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  VStack,
  Input,
  Button,
  Heading,
  FormControl,
  FormLabel,
  useToast,
  Box,
  Text,
  Link
} from "@chakra-ui/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = () => {
    // Mock authentication (replace with real auth logic)
    if (
      (email === "user@example.com" && password === "password") ||
      (email === "mxwng@sas.upenn.edu" && password === "asdf1234!@#$")
    ) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authToken", "demoToken12345"); // Fake token for demo
      toast({ title: "Login successful", status: "success", duration: 2000 });
      navigate("/home"); // Redirect to home page
    } else {
      toast({ title: "Invalid credentials", status: "error", duration: 2000 });
    }
  };

  return (
    <Container centerContent>
      <Box p={6} boxShadow="md" borderRadius="lg">
        <VStack spacing={4}>
          <Heading size="lg">Login</Heading>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button colorScheme="blue" onClick={handleLogin}>Login</Button>
          <Text fontSize="sm">
            Don't have an account? <Link color="blue.500" onClick={() => navigate("/create-account")}>Create an account</Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
}
