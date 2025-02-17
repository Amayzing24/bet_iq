import React from "react"
import { Box, Heading, Text, Badge, Stack, useColorModeValue } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

export default function GameCard({ game, isYesterday }) {
  const navigate = useNavigate()
  const bgColor = useColorModeValue("white", "gray.800")
  const hoverBgColor = useColorModeValue("gray.50", "gray.700")
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100")

  const handleClick = () => {
    if (isYesterday) {
      navigate(`/game/${game.id}`)
    } else {
      navigate(`/today/${game.id}`)
    }
  }

  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      bg={bgColor}
      p={6}
      mb={4}
      cursor="pointer"
      _hover={{ 
        transform: "translateY(-2px)",
        boxShadow: "xl",
        bg: hoverBgColor 
      }}
      transition="all 0.2s ease-in-out"
      onClick={handleClick}
      boxShadow="md"
    >
      <Heading 
        as="h3" 
        size="md" 
        textAlign="center" 
        mb={4}
        color={useColorModeValue("gray.800", "white")}
      >
        {game.homeTeam} vs {game.awayTeam}
      </Heading>

      {isYesterday ? (
        <Stack spacing={3}>
          <Text 
            fontSize="lg" 
            textAlign="center" 
            fontWeight="bold"
            color={useColorModeValue("brand.600", "brand.200")}
            mb={2}
          >
            Final Score: {game.finalScore}
          </Text>
          <Box 
            p={4} 
            bg={useColorModeValue("gray.50", "gray.900")} 
            borderRadius="lg"
          >
            <Stack spacing={3}>
              <PredictionRow
                label="Moneyline"
                value={game.moneyline.label}
                isCorrect={game.moneyline.correct}
              />
              <PredictionRow
                label="Over/Under"
                value={game.overUnder.label}
                isCorrect={game.overUnder.correct}
              />
              <PredictionRow
                label="Spread"
                value={game.spread.label}
                isCorrect={game.spread.correct}
              />
            </Stack>
          </Box>
        </Stack>
      ) : (
        <Stack spacing={4}>
          <PredictionSection
            label="Moneyline"
            odds={game.moneyline.odds}
            prediction={game.moneyline.prediction}
          />
          <PredictionSection
            label="Over/Under"
            odds={game.overUnder.odds}
            prediction={game.overUnder.prediction}
          />
          <PredictionSection
            label="Spread"
            odds={game.spread.odds}
            prediction={game.spread.prediction}
          />
        </Stack>
      )}
    </Box>
  )
}

const PredictionRow = ({ label, value, isCorrect }) => (
  <Stack direction="row" justify="space-between" align="center">
    <Text fontWeight="medium">{label}:</Text>
    <Stack direction="row" align="center" spacing={2}>
      <Text>{value}</Text>
      <Badge 
        colorScheme={isCorrect ? "green" : "red"}
        variant="subtle"
        px={2}
        py={1}
        borderRadius="full"
      >
        {isCorrect ? "Correct" : "Incorrect"}
      </Badge>
    </Stack>
  </Stack>
)

const PredictionSection = ({ label, odds, prediction }) => (
  <Box 
    p={3} 
    bg={useColorModeValue("gray.50", "gray.900")}
    borderRadius="lg"
  >
    <Text fontWeight="bold" mb={2} color={useColorModeValue("brand.600", "brand.200")}>
      {label}
    </Text>
    <Stack spacing={1}>
      <Text fontSize="sm">
        <Text as="span" fontWeight="medium">Odds:</Text> {odds}
      </Text>
      <Text fontSize="sm">
        <Text as="span" fontWeight="medium">Prediction:</Text> {prediction}
      </Text>
    </Stack>
  </Box>
)
