import React from "react"
import { Box, Heading, Text, Badge, Stack, useColorModeValue, useTheme } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

export default function GameCard({ game, isYesterday }) {
  const navigate = useNavigate()
  const theme = useTheme()
  const bgColor = useColorModeValue(theme.colors.lightMode.cardBg, "gray.800")
  const hoverBgColor = useColorModeValue(theme.colors.lightMode.hoverBg, "gray.700")
  const borderColor = useColorModeValue(theme.colors.lightMode.border, "whiteAlpha.100")
  const sectionBgColor = useColorModeValue(theme.colors.lightMode.sectionBg, "gray.900")
  const accentColor = useColorModeValue(theme.colors.lightMode.text.accent, "brand.200")
  const textColor = useColorModeValue(theme.colors.lightMode.text.primary, "whiteAlpha.900")
  const secondaryTextColor = useColorModeValue(theme.colors.lightMode.text.secondary, "whiteAlpha.800")

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
      boxShadow={useColorModeValue("md", "lg")}
    >
      <Heading 
        as="h3" 
        size="md" 
        textAlign="center" 
        mb={4}
        color={textColor}
      >
        {game.homeTeam} vs {game.awayTeam}
      </Heading>

      {isYesterday ? (
        <Stack spacing={3}>
          <Text 
            fontSize="lg" 
            textAlign="center" 
            fontWeight="bold"
            color={accentColor}
            mb={2}
          >
            Final Score: {game.finalScore}
          </Text>
          <Box 
            p={4} 
            bg={sectionBgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
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

const PredictionRow = ({ label, value, isCorrect }) => {
  const theme = useTheme()
  const labelColor = useColorModeValue(theme.colors.lightMode.text.secondary, "whiteAlpha.800")
  const valueColor = useColorModeValue(theme.colors.lightMode.text.primary, "whiteAlpha.900")
  
  return (
    <Stack direction="row" justify="space-between" align="center">
      <Text fontWeight="medium" color={labelColor}>{label}:</Text>
      <Stack direction="row" align="center" spacing={2}>
        <Text color={valueColor}>{value}</Text>
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
}

const PredictionSection = ({ label, odds, prediction }) => {
  const theme = useTheme()
  const sectionBgColor = useColorModeValue(theme.colors.lightMode.sectionBg, "gray.900")
  const borderColor = useColorModeValue(theme.colors.lightMode.border, "whiteAlpha.100")
  const labelColor = useColorModeValue(theme.colors.lightMode.text.accent, "brand.200")
  const textColor = useColorModeValue(theme.colors.lightMode.text.secondary, "whiteAlpha.800")
  const valueColor = useColorModeValue(theme.colors.lightMode.text.primary, "whiteAlpha.900")

  return (
    <Box 
      p={3} 
      bg={sectionBgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Text fontWeight="bold" mb={2} color={labelColor}>
        {label}
      </Text>
      <Stack spacing={1}>
        <Text fontSize="sm" color={textColor}>
          <Text as="span" fontWeight="medium">Odds:</Text>{" "}
          <Text as="span" color={valueColor}>{odds}</Text>
        </Text>
        <Text fontSize="sm" color={textColor}>
          <Text as="span" fontWeight="medium">Prediction:</Text>{" "}
          <Text as="span" color={valueColor}>{prediction}</Text>
        </Text>
      </Stack>
    </Box>
  )
}
