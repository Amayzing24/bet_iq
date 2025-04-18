import React from "react"
import { useParams } from "react-router-dom"
import { todaysGames } from "../data/sampleData"
import { Box, Heading, Text, VStack } from "@chakra-ui/react"
import GameNews from "../components/GameNews"

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
    <Box maxW="container.lg" mx="auto" mb={16}>
      {/* Game details box */}
      <Box bg="gray.800" p={6} borderRadius="md" mt={8} mb={8} boxShadow="lg">
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

      {/* News about this specific game */}
      <GameNews homeTeam={game.homeTeam} awayTeam={game.awayTeam} />
    </Box>
  )
}
