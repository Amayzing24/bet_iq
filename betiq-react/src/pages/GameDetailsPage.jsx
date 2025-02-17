import React from "react"
import { useParams } from "react-router-dom"
import { yesterdaysGames } from "../data/sampleData"
import { Box, Heading, Text, Badge, VStack } from "@chakra-ui/react"

export default function GameDetailsPage() {
  const { gameId } = useParams()
  const game = yesterdaysGames.find(g => g.id === gameId)

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
      <Text mb={4} fontSize="sm">Final Score: {game.finalScore}</Text>
      <VStack align="start" spacing={2}>
        <Text>
          <Text as="span" fontWeight="bold">Moneyline:</Text> {game.moneyline.label}{' '}
          {game.moneyline.correct ? (
            <Badge colorScheme="green" ml={1}>Correct</Badge>
          ) : (
            <Badge colorScheme="red" ml={1}>Incorrect</Badge>
          )}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">Over/Under:</Text> {game.overUnder.label}{' '}
          {game.overUnder.correct ? (
            <Badge colorScheme="green" ml={1}>Correct</Badge>
          ) : (
            <Badge colorScheme="red" ml={1}>Incorrect</Badge>
          )}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">Spread:</Text> {game.spread.label}{' '}
          {game.spread.correct ? (
            <Badge colorScheme="green" ml={1}>Correct</Badge>
          ) : (
            <Badge colorScheme="red" ml={1}>Incorrect</Badge>
          )}
        </Text>
      </VStack>
    </Box>
  )
}
