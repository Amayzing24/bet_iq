import React, { useState, useRef } from "react";
import {
  Box,
  Container,
  Heading,
  Flex,
  Text,
  IconButton,
  Badge,
  HStack,
  VStack,
  Grid,
  GridItem,
  Divider,
  useColorModeValue,
  Button,
  Image,
  Tooltip
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon, StarIcon } from "@chakra-ui/icons";

// NBA team logo mapping
const teamLogos = {
    // Eastern Conference
    "ATL": "https://cdn.nba.com/logos/nba/1610612737/global/L/logo.svg", // Hawks
    "BOS": "https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg", // Celtics
    "BKN": "https://cdn.nba.com/logos/nba/1610612751/global/L/logo.svg", // Nets
    "CHA": "https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg", // Hornets
    "CHI": "https://cdn.nba.com/logos/nba/1610612741/global/L/logo.svg", // Bulls
    "CLE": "https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg", // Cavaliers
    "DET": "https://cdn.nba.com/logos/nba/1610612765/global/L/logo.svg", // Pistons
    "IND": "https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg", // Pacers
    "MIA": "https://cdn.nba.com/logos/nba/1610612748/global/L/logo.svg", // Heat
    "MIL": "https://cdn.nba.com/logos/nba/1610612749/global/L/logo.svg", // Bucks
    "NYK": "https://cdn.nba.com/logos/nba/1610612752/global/L/logo.svg", // Knicks
    "ORL": "https://cdn.nba.com/logos/nba/1610612753/global/L/logo.svg", // Magic
    "PHI": "https://cdn.nba.com/logos/nba/1610612755/global/L/logo.svg", // 76ers
    "TOR": "https://cdn.nba.com/logos/nba/1610612761/global/L/logo.svg", // Raptors
    "WAS": "https://cdn.nba.com/logos/nba/1610612764/global/L/logo.svg", // Wizards
  
    // Western Conference
    "DAL": "https://cdn.nba.com/logos/nba/1610612742/global/L/logo.svg", // Mavericks
    "DEN": "https://cdn.nba.com/logos/nba/1610612743/global/L/logo.svg", // Nuggets
    "GSW": "https://cdn.nba.com/logos/nba/1610612744/global/L/logo.svg", // Warriors
    "HOU": "https://cdn.nba.com/logos/nba/1610612745/global/L/logo.svg", // Rockets
    "LAC": "https://cdn.nba.com/logos/nba/1610612746/global/L/logo.svg", // Clippers
    "LAL": "https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg", // Lakers
    "MEM": "https://cdn.nba.com/logos/nba/1610612763/global/L/logo.svg", // Grizzlies
    "MIN": "https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg", // Timberwolves
    "NOP": "https://cdn.nba.com/logos/nba/1610612740/global/L/logo.svg", // Pelicans
    "OKC": "https://cdn.nba.com/logos/nba/1610612760/global/L/logo.svg", // Thunder
    "PHX": "https://cdn.nba.com/logos/nba/1610612756/global/L/logo.svg", // Suns
    "POR": "https://cdn.nba.com/logos/nba/1610612757/global/L/logo.svg", // Trail Blazers
    "SAC": "https://cdn.nba.com/logos/nba/1610612758/global/L/logo.svg", // Kings
    "SAS": "https://cdn.nba.com/logos/nba/1610612759/global/L/logo.svg", // Spurs
    "UTA": "https://cdn.nba.com/logos/nba/1610612762/global/L/logo.svg", // Jazz
  };

// Get team code from team name (e.g., "BKN Nets" -> "BKN")
const getTeamCode = (teamName) => {
  return teamName.split(" ")[0];
};

<<<<<<< HEAD
// Generate the last 7 days for date selector
const getLastSevenDays = () => {
  const days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Format the date
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    
    days.push({
      fullDate: date,
      display: `${dayName}, ${month} ${dayNumber}`,
      isToday: i === 0
    });
  }
  
  return days;
};
=======
const getRandomPrediction = () => Math.random() > 0.5;
>>>>>>> 992473fbc364e690ae7e0634b43200730ef534bc

const ActiveGames = () => {
  // Sample active games data
  const activeGames = [
    {
      id: 1,
      homeTeam: "BKN Nets",
      awayTeam: "IND Pacers",
      homeScore: 41,
      awayScore: 52,
      time: "4:11",
      quarter: "2ND QUARTER",
      isLive: true,
      spread: { 
        favorite: "IND", 
        points: 15.5, 
        odds: -115,
        pick: "IND"
      },
      total: { 
        value: 221.5, 
        overOdds: -115, 
        underOdds: -115,
        pick: "UNDER"
      },
      moneyline: { 
        home: +1100, 
        away: -2500,
        pick: "IND"
      },
      homeForm: ["L", "W", "L", "L", "W"],
      awayForm: ["W", "W", "W", "L", "W"]
    },
    {
      id: 2,
      homeTeam: "LAL Lakers",
      awayTeam: "PHX Suns",
      homeScore: 62,
      awayScore: 58,
      time: "1:30",
      quarter: "3RD QUARTER",
      isLive: true,
      spread: { favorite: "LAL", points: 4.5, odds: -110 },
      total: { value: 235.5, overOdds: -110, underOdds: -110 },
      moneyline: { home: -180, away: +150 },
      homeForm: ["W", "W", "W", "L", "W"],
      awayForm: ["L", "W", "L", "W", "L"]
    },
    {
      id: 3,
      homeTeam: "MIA Heat",
      awayTeam: "BOS Celtics",
      homeScore: 84,
      awayScore: 92,
      time: "8:45",
      quarter: "4TH QUARTER",
      isLive: true,
      spread: { favorite: "BOS", points: 7.5, odds: -110 },
      total: { value: 218.5, overOdds: -110, underOdds: -110 },
      moneyline: { home: +320, away: -400 },
      homeForm: ["L", "L", "W", "W", "L"],
      awayForm: ["W", "W", "W", "W", "L"]
    },
    {
      id: 4,
      homeTeam: "GSW Warriors",
      awayTeam: "DAL Mavericks",
      homeScore: 15,
      awayScore: 22,
      time: "8:20",
      quarter: "1ST QUARTER",
      isLive: true,
      spread: { favorite: "GSW", points: 3.5, odds: -110 },
      total: { value: 232.5, overOdds: -110, underOdds: -110 },
      moneyline: { home: -160, away: +135 },
      homeForm: ["W", "L", "W", "L", "W"],
      awayForm: ["W", "W", "L", "L", "W"]
    },
    {
      id: 5,
      homeTeam: "DEN Nuggets",
      awayTeam: "POR Trail Blazers",
      homeScore: 36,
      awayScore: 28,
      time: "2:55",
      quarter: "2ND QUARTER",
      isLive: true,
      spread: { favorite: "DEN", points: 9.5, odds: -110 },
      total: { value: 224.5, overOdds: -110, underOdds: -110 },
      moneyline: { home: -450, away: +350 },
      homeForm: ["W", "W", "W", "L", "W"],
      awayForm: ["L", "L", "L", "W", "L"]
    }
  ];

  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const scrollRef = useRef(null);
  const dateScrollRef = useRef(null);
  const lastSevenDays = getLastSevenDays();

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date.fullDate);
    // In a real app, you would fetch games for this date
  };

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  const scrollDates = (scrollOffset) => {
    if (dateScrollRef.current) {
      dateScrollRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  const formatMoneyline = (value) => {
    return value > 0 ? `+${value}` : value;
  };

  // Render form indicators (W/L)
  const renderForm = (form) => {
    return (
      <HStack spacing={1} mt={1}>
        {form.map((result, index) => (
          <Badge 
            key={index} 
            colorScheme={result === "W" ? "green" : "red"}
            size="sm"
            minW="18px"
            textAlign="center"
          >
            {result}
          </Badge>
        ))}
      </HStack>
    );
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" mb={8}>
        <Heading size="lg" color="cyan.400" mb={6}>BetIQ</Heading>
        
        {/* Date Selector */}
        <Box position="relative" w="full" mb={4}>
          <IconButton
            aria-label="Scroll dates left"
            icon={<ChevronLeftIcon />}
            position="absolute"
            left={0}
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            onClick={() => scrollDates(-300)}
            bg="gray.800"
            color="white"
            _hover={{ bg: "gray.700" }}
            size="md"
          />
          
          <Flex
            ref={dateScrollRef}
            overflowX="auto"
            py={2}
            px={10}
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              'scrollbarWidth': 'none',
              'msOverflowStyle': 'none',
            }}
          >
            {lastSevenDays.map((day, index) => (
              <Box
                key={index}
                minW="150px"
                mx={2}
                p={3}
                borderRadius="md"
                bg={day.isToday ? "blue.900" : "gray.800"}
                cursor="pointer"
                onClick={() => handleDateClick(day)}
                transition="all 0.2s"
                _hover={{ bg: "gray.700" }}
                boxShadow="md"
                borderWidth="1px"
                borderColor={day.isToday ? "cyan.400" : "transparent"}
              >
                <Text color="white" fontWeight={day.isToday ? "bold" : "normal"}>
                  {day.display}
                </Text>
                {day.isToday && (
                  <Badge colorScheme="cyan" mt={1}>Today</Badge>
                )}
              </Box>
            ))}
          </Flex>
          
          <IconButton
            aria-label="Scroll dates right"
            icon={<ChevronRightIcon />}
            position="absolute"
            right={0}
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            onClick={() => scrollDates(300)}
            bg="gray.800"
            color="white"
            _hover={{ bg: "gray.700" }}
            size="md"
          />
        </Box>
        
        <Heading size="md" color="white" mb={4}>Active Games</Heading>
        
        {/* Games Scroller */}
        <Flex position="relative" w="full" mt={4}>
          <IconButton
            aria-label="Scroll left"
            icon={<ChevronLeftIcon />}
            position="absolute"
            left={0}
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            onClick={() => scroll(-300)}
            bg="gray.800"
            color="white"
            _hover={{ bg: "gray.700" }}
            size="md"
          />
          
          <Flex
            ref={scrollRef}
            overflowX="auto"
            py={4}
            px={10}
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              'scrollbarWidth': 'none',
              'msOverflowStyle': 'none',
            }}
          >
            {activeGames.map((game) => (
              <Box
                key={game.id}
                minW="250px"
                mx={2}
                p={4}
                borderRadius="md"
                bg={selectedGame?.id === game.id ? "blue.900" : "gray.800"}
                cursor="pointer"
                onClick={() => handleGameClick(game)}
                transition="all 0.2s"
                _hover={{ bg: "gray.700" }}
                boxShadow="md"
                borderWidth="1px"
                borderColor={selectedGame?.id === game.id ? "cyan.400" : "transparent"}
              >
                <Flex justify="space-between" mb={2}>
                  <Badge colorScheme="green" variant="solid" px={2}>LIVE</Badge>
                  <Text color="gray.300" fontSize="sm">{game.quarter}</Text>
                </Flex>
                
                <Flex justify="space-between" align="center" mb={2}>
                  <Flex align="center">
                    <Image 
                      src={teamLogos[getTeamCode(game.awayTeam)]} 
                      boxSize="24px" 
                      mr={2}
                      fallbackSrc="https://via.placeholder.com/24"
                      alt={getTeamCode(game.awayTeam)}
                    />
                    <Text color="white" fontWeight="bold">{game.awayTeam}</Text>
                  </Flex>
                  <Text color="yellow.400" fontWeight="bold">{game.awayScore}</Text>
                </Flex>
                
                <Flex justify="space-between" align="center">
                  <Flex align="center">
                    <Image 
                      src={teamLogos[getTeamCode(game.homeTeam)]} 
                      boxSize="24px" 
                      mr={2}
                      fallbackSrc="https://via.placeholder.com/24"
                      alt={getTeamCode(game.homeTeam)}
                    />
                    <Text color="white" fontWeight="bold">{game.homeTeam}</Text>
                  </Flex>
                  <Text color="yellow.400" fontWeight="bold">{game.homeScore}</Text>
                </Flex>
                
                <Text color="gray.400" fontSize="sm" textAlign="right" mt={2}>
                  {game.time} left
                </Text>
              </Box>
            ))}
          </Flex>
          
          <IconButton
            aria-label="Scroll right"
            icon={<ChevronRightIcon />}
            position="absolute"
            right={0}
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            onClick={() => scroll(300)}
            bg="gray.800"
            color="white"
            _hover={{ bg: "gray.700" }}
            size="md"
          />
        </Flex>
      </Box>

      {/* Game Details */}
      {selectedGame && (
        <Box
          mt={8}
          p={6}
          bg="gray.800"
          borderRadius="lg"
          boxShadow="xl"
          borderWidth="1px"
          borderColor="gray.700"
        >
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="md" color="white">Game Details</Heading>
            <Badge colorScheme="green" fontSize="md" py={1} px={3}>
              LIVE: {selectedGame.quarter} - {selectedGame.time}
            </Badge>
          </Flex>

          {/* Teams and Scores */}
          <Flex 
            justify="space-between" 
            align="center" 
            bg="gray.900" 
            p={4} 
            borderRadius="md" 
            mb={6}
          >
            <VStack spacing={1} align="flex-start" flex={1}>
              <Text color="gray.400" fontSize="sm">Away</Text>
              <Flex align="center">
                <Image 
                  src={teamLogos[getTeamCode(selectedGame.awayTeam)]} 
                  boxSize="32px" 
                  mr={2}
                  fallbackSrc="https://via.placeholder.com/32"
                  alt={getTeamCode(selectedGame.awayTeam)}
                />
                <Text color="white" fontWeight="bold" fontSize="xl">{selectedGame.awayTeam}</Text>
              </Flex>
              <Text color="yellow.400" fontSize="2xl" fontWeight="bold">{selectedGame.awayScore}</Text>
              {renderForm(selectedGame.awayForm)}
            </VStack>
            
            <Box px={4}>
              <Text color="cyan.400" fontWeight="bold">VS</Text>
            </Box>
            
            <VStack spacing={1} align="flex-end" flex={1}>
              <Text color="gray.400" fontSize="sm">Home</Text>
              <Flex align="center">
                <Text color="white" fontWeight="bold" fontSize="xl">{selectedGame.homeTeam}</Text>
                <Image 
                  src={teamLogos[getTeamCode(selectedGame.homeTeam)]} 
                  boxSize="32px" 
                  ml={2}
                  fallbackSrc="https://via.placeholder.com/32"
                  alt={getTeamCode(selectedGame.homeTeam)}
                />
              </Flex>
              <Text color="yellow.400" fontSize="2xl" fontWeight="bold">{selectedGame.homeScore}</Text>
              <HStack justify="flex-end" w="full">
                {renderForm(selectedGame.homeForm)}
              </HStack>
            </VStack>
          </Flex>

          {/* Betting Information */}
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem>
              <Box bg="gray.900" p={4} borderRadius="md" height="full" borderLeftWidth="2px" borderLeftColor="blue.400">
                <Text color="cyan.400" fontWeight="bold" mb={3}>Moneyline</Text>
                <Divider mb={3} opacity={0.1} />
                <Flex justify="space-between" mb={2}>
                  <Flex align="center">
                    <Image 
                      src={teamLogos[getTeamCode(selectedGame.awayTeam)]} 
                      boxSize="20px" 
                      mr={2}
                      fallbackSrc="https://via.placeholder.com/20"
                      alt={getTeamCode(selectedGame.awayTeam)}
                    />
                    <Text color="white" mr={2}>{selectedGame.awayTeam}</Text>
                    {selectedGame.moneyline.pick === getTeamCode(selectedGame.awayTeam) && (
                      <Badge 
                        bg="yellow.300" 
                        color="gray.800" 
                        variant="solid" 
                        px={2}
                      >
                        BetIQ Pick
                      </Badge>
                    )}
                  </Flex>
                  <Text 
                    color={selectedGame.moneyline.away > 0 ? "green.400" : "red.400"}
                    fontWeight="bold"
                  >
                    {formatMoneyline(selectedGame.moneyline.away)}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Flex align="center">
                    <Image 
                      src={teamLogos[getTeamCode(selectedGame.homeTeam)]} 
                      boxSize="20px" 
                      mr={2}
                      fallbackSrc="https://via.placeholder.com/20"
                      alt={getTeamCode(selectedGame.homeTeam)}
                    />
                    <Text color="white" mr={2}>{selectedGame.homeTeam}</Text>
                    {selectedGame.moneyline.pick === getTeamCode(selectedGame.homeTeam) && (
                      <Badge 
                        bg="yellow.300" 
                        color="gray.800" 
                        variant="solid" 
                        px={2}
                      >
                        BetIQ Pick
                      </Badge>
                    )}
                  </Flex>
                  <Text 
                    color={selectedGame.moneyline.home > 0 ? "green.400" : "red.400"}
                    fontWeight="bold"
                  >
                    {formatMoneyline(selectedGame.moneyline.home)}
                  </Text>
                </Flex>
              </Box>
            </GridItem>
            
            <GridItem>
              <Box bg="gray.900" p={4} borderRadius="md" height="full" borderLeftWidth="2px" borderLeftColor="purple.400">
                <Text color="cyan.400" fontWeight="bold" mb={3}>Spread</Text>
                <Divider mb={3} opacity={0.1} />
                <Flex justify="space-between" mb={2}>
                  <Flex align="center">
                    <Image 
                      src={teamLogos[getTeamCode(selectedGame.awayTeam)]} 
                      boxSize="20px" 
                      mr={2}
                      fallbackSrc="https://via.placeholder.com/20"
                      alt={getTeamCode(selectedGame.awayTeam)}
                    />
                    <Text color="white" mr={2}>{selectedGame.awayTeam}</Text>
                    {selectedGame.spread.pick === getTeamCode(selectedGame.awayTeam) && (
                      <Badge 
                        bg="yellow.300" 
                        color="gray.800" 
                        variant="solid" 
                        px={2}
                      >
                        BetIQ Pick
                      </Badge>
                    )}
                  </Flex>
                  <Text color="white" fontWeight="bold">
                    {selectedGame.spread.favorite === getTeamCode(selectedGame.awayTeam) 
                      ? `-${selectedGame.spread.points}` 
                      : `+${selectedGame.spread.points}`} ({selectedGame.spread.odds})
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Flex align="center">
                    <Image 
                      src={teamLogos[getTeamCode(selectedGame.homeTeam)]} 
                      boxSize="20px" 
                      mr={2}
                      fallbackSrc="https://via.placeholder.com/20"
                      alt={getTeamCode(selectedGame.homeTeam)}
                    />
                    <Text color="white" mr={2}>{selectedGame.homeTeam}</Text>
                    {selectedGame.spread.pick === getTeamCode(selectedGame.homeTeam) && (
                      <Badge 
                        bg="yellow.300" 
                        color="gray.800" 
                        variant="solid" 
                        px={2}
                      >
                        BetIQ Pick
                      </Badge>
                    )}
                  </Flex>
                  <Text color="white" fontWeight="bold">
                    {selectedGame.spread.favorite === getTeamCode(selectedGame.homeTeam) 
                      ? `-${selectedGame.spread.points}` 
                      : `+${selectedGame.spread.points}`} ({selectedGame.spread.odds})
                  </Text>
                </Flex>
              </Box>
            </GridItem>
            
            <GridItem>
              <Box bg="gray.900" p={4} borderRadius="md" height="full" borderLeftWidth="2px" borderLeftColor="green.400">
                <Text color="cyan.400" fontWeight="bold" mb={3}>Total</Text>
                <Divider mb={3} opacity={0.1} />
                <Flex justify="space-between" mb={2}>
                  <Flex align="center">
                    <Text color="white" mr={2}>Over {selectedGame.total.value}</Text>
                    {selectedGame.total.pick === "OVER" && (
                      <Badge 
                        bg="yellow.300" 
                        color="gray.800" 
                        variant="solid" 
                        px={2}
                      >
                        BetIQ Pick
                      </Badge>
                    )}
                  </Flex>
                  <Text color="white" fontWeight="bold">{selectedGame.total.overOdds}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Flex align="center">
                    <Text color="white" mr={2}>Under {selectedGame.total.value}</Text>
                    {selectedGame.total.pick === "UNDER" && (
                      <Badge 
                        bg="yellow.300" 
                        color="gray.800" 
                        variant="solid" 
                        px={2}
                      >
                        BetIQ Pick
                      </Badge>
                    )}
                  </Flex>
                  <Text color="white" fontWeight="bold">{selectedGame.total.underOdds}</Text>
                </Flex>
              </Box>
            </GridItem>
          </Grid>

          <Flex justify="center" mt={6} gap={4}>
            <Button
              colorScheme="teal"
              leftIcon={<InfoIcon />}
              size="md"
            >
              View Game Stats
            </Button>
            <Button
              variant="outline"
              colorScheme="cyan"
              leftIcon={<StarIcon />}
              size="md"
            >
              Add to Favorites
            </Button>
          </Flex>
        </Box>
      )}
    </Container>
  );
};

export default ActiveGames;
