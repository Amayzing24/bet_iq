import React from "react"
import { useParams } from "react-router-dom"
import { todaysGames } from "../data/sampleData"
import { Box, Heading, Text, VStack } from "@chakra-ui/react"

export default function TodaysDetailsPage() {
  const { gameId } = useParams()
  const game = todaysGames.find(g => g.id === gameId)

  if (!game) {
    return (
      <Box textAlign="center" mt={8}>
        <Text>Game not found</Text>
      </Box>
    )
  }

  return (
    <Box maxW="container.md" mx="auto" bg="gray.800" p={6} borderRadius="md" mt={8}>
      <Heading mb={2}>{game.homeTeam} vs {game.awayTeam}</Heading>
      <VStack align="start" spacing={2} mt={4}>
        <Text>
          <Text as="span" fontWeight="bold">Moneyline:</Text> {game.moneyline.odds}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">Prediction:</Text> {game.moneyline.prediction}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">Over/Under:</Text> {game.overUnder.odds}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">Prediction:</Text> {game.overUnder.prediction}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">Spread:</Text> {game.spread.odds}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">Prediction:</Text> {game.spread.prediction}
        </Text>
      </VStack>
    </Box>
  )
}
