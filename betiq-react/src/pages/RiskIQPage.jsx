import React, { useState } from "react"
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react"

export default function RiskIQPage() {
  const [bankroll, setBankroll] = useState("")
  const [odds, setOdds] = useState("")
  const [prob, setProb] = useState("")
  const [result, setResult] = useState(0)
  const [fraction, setFraction] = useState(0)

  const calculateBet = () => {
    const br = parseFloat(bankroll) || 0
    const p = parseFloat(prob) / 100 || 0
    let decimalOdds = 0
    if (odds.startsWith("+")) {
      decimalOdds = parseInt(odds) / 100 + 1
    } else {
      decimalOdds = 100 / Math.abs(parseInt(odds)) + 1
    }
    const b = decimalOdds - 1
    const q = 1 - p
    const k = (b * p - q) / b
    const bet = Math.max(0, k * br)
    setResult(bet)
    setFraction(k)
  }

  return (
    <Box maxW="md" mx="auto" bg="gray.800" p={6} borderRadius="md" mt={8}>
      <Heading size="md" textAlign="center" mb={4}>BetIQ: Kelly Criterion Calculator</Heading>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Enter Your Bankroll ($)</FormLabel>
          <Input
            type="number"
            placeholder="1000"
            value={bankroll}
            onChange={(e) => setBankroll(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Enter American Odds (+XXX or -XXX)</FormLabel>
          <Input
            type="text"
            placeholder="+150 or -200"
            value={odds}
            onChange={(e) => setOdds(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Enter Win Probability (%)</FormLabel>
          <Input
            type="number"
            placeholder="60"
            value={prob}
            onChange={(e) => setProb(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={calculateBet}>
          Calculate Bet
        </Button>
        <Box bg="gray.700" p={3} borderRadius="md" textAlign="center" w="full">
          <Text>Suggested Bet: ${result.toFixed(2)}</Text>
          <Text fontSize="sm">({(fraction * 100).toFixed(1)}% of bankroll)</Text>
        </Box>
      </VStack>
    </Box>
  )
}
