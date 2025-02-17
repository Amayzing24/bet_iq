import React from "react"
import { Container, Heading, SimpleGrid, Box, VStack, useColorModeValue } from "@chakra-ui/react"
import { yesterdaysGames, todaysGames, news, modelProfitData } from "../data/sampleData"
import GameCard from "../components/GameCard"
import InfoPopup from "../components/InfoPopup"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function HomePage() {
  const bgColor = useColorModeValue("white", "gray.800")
  const newsItemBg = useColorModeValue("gray.50", "gray.700")
  const chartTextColor = useColorModeValue("#1A202C", "#FFFFFF")
  const headerColor = useColorModeValue("gray.800", "white")

  const chartData = {
    labels: modelProfitData.labels,
    datasets: [
      {
        label: "Profit ($)",
        data: modelProfitData.data,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    scales: {
      x: { ticks: { color: chartTextColor } },
      y: { ticks: { color: chartTextColor } },
    },
    plugins: {
      legend: {
        labels: { color: chartTextColor },
      },
    },
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={4} mb={6}>
        <Heading size="lg" textAlign="center" color={headerColor}>BetIQ</Heading>
        <InfoPopup
          title="What is moneyline, over/under, and spread?"
          description="Moneyline: which team will win. Over/Under: total points. Spread: margin of victory or defeat."
        />
      </VStack>

      <SimpleGrid columns={[1, null, 3]} spacing={8}>
        <Box borderRadius="md" p={4} bg={bgColor} boxShadow="md">
          <Heading size="md" textAlign="center" mb={4}>Yesterday&apos;s Games</Heading>
          {yesterdaysGames.map((game) => (
            <GameCard key={game.id} game={game} isYesterday />
          ))}
        </Box>

        <Box borderRadius="md" p={4} bg={bgColor} boxShadow="md">
          <Heading size="md" textAlign="center" mb={4}>Today&apos;s Games</Heading>
          {todaysGames.map((game) => (
            <GameCard key={game.id} game={game} isYesterday={false} />
          ))}
        </Box>

        <Box borderRadius="md" p={4} bg={bgColor} boxShadow="md">
          <Heading size="md" textAlign="center" mb={4}>NBA News</Heading>
          {news.map((item, i) => (
            <Box key={i} bg={newsItemBg} p={3} mb={3} borderRadius="md">
              <Heading as="h4" size="sm" mb={1}>{item.title}</Heading>
              <Box fontSize="sm">{item.text}</Box>
            </Box>
          ))}
          <Heading size="md" textAlign="center" mb={4}>Model Profitability Over Time</Heading>
          <Line data={chartData} options={chartOptions} />
        </Box>
      </SimpleGrid>
    </Container>
  )
}
