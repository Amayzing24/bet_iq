import React, { useState, useRef, useEffect } from "react";
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
  Tooltip,
  ButtonGroup
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon, StarIcon } from "@chakra-ui/icons";
import GameNews from "../components/GameNews";

// Import all score files
import scores20250417 from "../data/scores/2025-04-17.json";
import scores20250416 from "../data/scores/2025-04-16.json";
import scores20250415 from "../data/scores/2025-04-15.json";
import scores20250414 from "../data/scores/2025-04-14.json";
import scores20250413 from "../data/scores/2025-04-13.json";
import scores20250412 from "../data/scores/2025-04-12.json";
import scores20250411 from "../data/scores/2025-04-11.json";
import scores20250410 from "../data/scores/2025-04-10.json";
import scores20250409 from "../data/scores/2025-04-09.json";
import scores20250408 from "../data/scores/2025-04-08.json";
import scores20250407 from "../data/scores/2025-04-07.json";

// Map of date strings to imported score data
const scoreDataMap = {
  "2025-04-17": scores20250417,
  "2025-04-16": scores20250416,
  "2025-04-15": scores20250415,
  "2025-04-14": scores20250414,
  "2025-04-13": scores20250413,
  "2025-04-12": scores20250412,
  "2025-04-11": scores20250411,
  "2025-04-10": scores20250410,
  "2025-04-09": scores20250409,
  "2025-04-08": scores20250408,
  "2025-04-07": scores20250407
};

// NBA team logo mapping
const teamLogos = {
    // Eastern Conference
    "Atlanta Hawks": "https://cdn.nba.com/logos/nba/1610612737/global/L/logo.svg",
    "Boston Celtics": "https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg",
    "Brooklyn Nets": "https://cdn.nba.com/logos/nba/1610612751/global/L/logo.svg",
    "Charlotte Hornets": "https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg",
    "Chicago Bulls": "https://cdn.nba.com/logos/nba/1610612741/global/L/logo.svg",
    "Cleveland Cavaliers": "https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg",
    "Detroit Pistons": "https://cdn.nba.com/logos/nba/1610612765/global/L/logo.svg",
    "Indiana Pacers": "https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg",
    "Miami Heat": "https://cdn.nba.com/logos/nba/1610612748/global/L/logo.svg",
    "Milwaukee Bucks": "https://cdn.nba.com/logos/nba/1610612749/global/L/logo.svg",
    "New York Knicks": "https://cdn.nba.com/logos/nba/1610612752/global/L/logo.svg",
    "Orlando Magic": "https://cdn.nba.com/logos/nba/1610612753/global/L/logo.svg",
    "Philadelphia 76ers": "https://cdn.nba.com/logos/nba/1610612755/global/L/logo.svg",
    "Toronto Raptors": "https://cdn.nba.com/logos/nba/1610612761/global/L/logo.svg",
    "Washington Wizards": "https://cdn.nba.com/logos/nba/1610612764/global/L/logo.svg",
  
    // Western Conference
    "Dallas Mavericks": "https://cdn.nba.com/logos/nba/1610612742/global/L/logo.svg",
    "Denver Nuggets": "https://cdn.nba.com/logos/nba/1610612743/global/L/logo.svg",
    "Golden State Warriors": "https://cdn.nba.com/logos/nba/1610612744/global/L/logo.svg",
    "Houston Rockets": "https://cdn.nba.com/logos/nba/1610612745/global/L/logo.svg",
    "Los Angeles Clippers": "https://cdn.nba.com/logos/nba/1610612746/global/L/logo.svg",
    "Los Angeles Lakers": "https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg",
    "Memphis Grizzlies": "https://cdn.nba.com/logos/nba/1610612763/global/L/logo.svg",
    "Minnesota Timberwolves": "https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg",
    "New Orleans Pelicans": "https://cdn.nba.com/logos/nba/1610612740/global/L/logo.svg",
    "Oklahoma City Thunder": "https://cdn.nba.com/logos/nba/1610612760/global/L/logo.svg",
    "Phoenix Suns": "https://cdn.nba.com/logos/nba/1610612756/global/L/logo.svg",
    "Portland Trail Blazers": "https://cdn.nba.com/logos/nba/1610612757/global/L/logo.svg",
    "Sacramento Kings": "https://cdn.nba.com/logos/nba/1610612758/global/L/logo.svg",
    "San Antonio Spurs": "https://cdn.nba.com/logos/nba/1610612759/global/L/logo.svg",
    "Utah Jazz": "https://cdn.nba.com/logos/nba/1610612762/global/L/logo.svg"
};

// Get team name from team name (e.g., "BKN Nets" -> "Brooklyn Nets")
const getTeamCode = (teamName) => {
  // If the team name is already in the correct format, return it
  if (teamLogos[teamName]) {
    return teamName;
  }
  
  // Map of team codes to full team names
  const teamCodeToName = {
    "ATL": "Atlanta Hawks",
    "BOS": "Boston Celtics",
    "BKN": "Brooklyn Nets",
    "CHA": "Charlotte Hornets",
    "CHI": "Chicago Bulls",
    "CLE": "Cleveland Cavaliers",
    "DET": "Detroit Pistons",
    "IND": "Indiana Pacers",
    "MIA": "Miami Heat",
    "MIL": "Milwaukee Bucks",
    "NYK": "New York Knicks",
    "ORL": "Orlando Magic",
    "PHI": "Philadelphia 76ers",
    "TOR": "Toronto Raptors",
    "WAS": "Washington Wizards",
    "DAL": "Dallas Mavericks",
    "DEN": "Denver Nuggets",
    "GSW": "Golden State Warriors",
    "HOU": "Houston Rockets",
    "LAC": "Los Angeles Clippers",
    "LAL": "Los Angeles Lakers",
    "MEM": "Memphis Grizzlies",
    "MIN": "Minnesota Timberwolves",
    "NOP": "New Orleans Pelicans",
    "OKC": "Oklahoma City Thunder",
    "PHX": "Phoenix Suns",
    "POR": "Portland Trail Blazers",
    "SAC": "Sacramento Kings",
    "SAS": "San Antonio Spurs",
    "UTA": "Utah Jazz"
  };

  const teamCode = teamName.split(" ")[0];
  return teamCodeToName[teamCode] || teamName;
};

// Generate the last 7 days for date selector
const getLastSevenDays = () => {
  const days = [];
  const today = new Date();
  
  for (let i = 9; i >= 0; i--) {
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

// Add sportsbook constants
const SPORTSBOOKS = {
  DRAFTKINGS: {
    name: "DraftKings",
    logo: "https://logo.clearbit.com/draftkings.com",
  },
  FANDUEL: {
    name: "FanDuel",
    logo: "https://logo.clearbit.com/fanduel.com",
  }
};

// Check if moneyline bet was correct
const checkMoneylineBet = (game, pick) => {
  if (!game.isDone) return null;
  const awayWon = game.awayScore > game.homeScore;
  const pickedAway = pick === getTeamCode(game.awayTeam);
  return awayWon === pickedAway ? "hit" : "miss";
};

// Check if spread bet was correct
const checkSpreadBet = (game, odds) => {
  if (!game.isDone) return null;
  
  const favorite = odds.spread.favorite;
  const points = odds.spread.points;
  const pick = odds.spread.pick;
  
  const scoreDiff = game.awayScore - game.homeScore;
  const adjustedDiff = favorite === getTeamCode(game.awayTeam) ? 
    scoreDiff + points : 
    scoreDiff - points;
    
  if (Math.abs(adjustedDiff) < 0.0001) return "push"; // Handle exact push
  
  const favoredTeamCovered = adjustedDiff > 0;
  const pickedFavorite = pick === favorite;
  
  return favoredTeamCovered === pickedFavorite ? "hit" : "miss";
};

// Check if total bet was correct
const checkTotalBet = (game, odds) => {
  if (!game.isDone) return null;
  
  const totalScore = game.awayScore + game.homeScore;
  const line = odds.total.value;
  const pick = odds.total.pick;
  
  if (Math.abs(totalScore - line) < 0.0001) return "push";
  const wentOver = totalScore > line;
  return (wentOver && pick === "OVER") || (!wentOver && pick === "UNDER") ? "hit" : "miss";
};

const BetIQBadge = ({ outcome }) => {
  if (!outcome) return (
    <Badge 
      bg="yellow.300" 
      color="gray.800" 
      variant="solid" 
      px={2}
    >
      BetIQ Pick
    </Badge>
  );

  const colors = {
    hit: { bg: "green.400", text: "white" },
    miss: { bg: "red.400", text: "white" },
    push: { bg: "orange.400", text: "white" }
  };

  const labels = {
    hit: "BetIQ Hit",
    miss: "BetIQ Miss",
    push: "BetIQ Push"
  };

  return (
    <Badge 
      bg={colors[outcome].bg}
      color={colors[outcome].text}
      variant="solid" 
      px={2}
    >
      {labels[outcome]}
    </Badge>
  );
};

const ActiveGames = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayedGames, setDisplayedGames] = useState([]);
  const scrollRef = useRef(null);
  const dateScrollRef = useRef(null);
  const lastSevenDays = getLastSevenDays();
  const [selectedSportsbook, setSelectedSportsbook] = useState('draftkings');

  // Function to get games based on selected date
  const getGamesByDate = (date) => {
    try {
      // Format date as YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0];
      console.log('Looking for games on date:', formattedDate);
      console.log('Available dates in scoreDataMap:', Object.keys(scoreDataMap));
      
      const games = scoreDataMap[formattedDate] || [];
      console.log('Found games:', games.length);
      
      if (games.length === 0) {
        console.log('No games found for date:', formattedDate);
      }
      
      return games;
    } catch (error) {
      console.error('Error getting games:', error);
      return [];
    }
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleDateClick = async (date) => {
    setSelectedDate(date.fullDate);
    const games = await getGamesByDate(date.fullDate);
    setDisplayedGames(games);
    setSelectedGame(null); // Reset selected game when changing dates
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

  // Add this before the betting information grid
  const renderSportsbookSelector = () => (
    <ButtonGroup spacing={4} mb={3} justifyContent="center" width="full">
      {Object.entries(SPORTSBOOKS).map(([key, book]) => {
        // Create a mapping for the sportsbook keys to match the data structure
        const keyMapping = {
          DRAFTKINGS: 'draftkings',
          FANDUEL: 'fanduel',
        };
        
        return (
          <Button
            key={key}
            onClick={() => setSelectedSportsbook(keyMapping[key])}
            variant={selectedSportsbook === keyMapping[key] ? "solid" : "outline"}
            colorScheme="gray"
            size="lg"
            p={4}
            _hover={{ bg: "gray.700" }}
            isActive={selectedSportsbook === keyMapping[key]}
          >
            <Image
              src={book.logo}
              alt={book.name}
              boxSize="24px"
              mr={2}
              fallbackSrc="https://via.placeholder.com/24"
            />
            {book.name}
          </Button>
        );
      })}
    </ButtonGroup>
  );

  // Update the betting information section to use selected sportsbook
  const getSelectedOdds = (game) => {
    return game.odds[selectedSportsbook];
  };

  // Load initial games
  useEffect(() => {
    const loadInitialGames = async () => {
      const games = await getGamesByDate(new Date());
      setDisplayedGames(games);
    };
    loadInitialGames();
  }, []);

  // Update the existing useEffect to handle both scrollers
  useEffect(() => {
    if (dateScrollRef.current) {
      dateScrollRef.current.scrollLeft = dateScrollRef.current.scrollWidth;
    }
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" mb={8}>
        
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
                bg={selectedDate.getDate() === day.fullDate.getDate() ? "blue.900" : "gray.800"}
                cursor="pointer"
                onClick={() => handleDateClick(day)}
                transition="all 0.2s"
                _hover={{ bg: "gray.700" }}
                boxShadow="md"
                borderWidth="1px"
                borderColor={selectedDate.getDate() === day.fullDate.getDate() ? "cyan.400" : "transparent"}
              >
                <Text color="white" fontWeight={selectedDate.getDate() === day.fullDate.getDate() ? "bold" : "normal"}>
                  {day.display}
                </Text>
                {day.isToday && (
                  <Badge colorScheme="gray" mt={1}>Today</Badge>
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
            {displayedGames.map((game) => (
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
                  {game.isLive ? (
                    <>
                      <Badge colorScheme="green" variant="solid" px={2}>LIVE</Badge>
                      <Text color="gray.300" fontSize="sm">{game.quarter}</Text>
                    </>
                  ) : (game.isDone || (game.homeScore !== null && game.awayScore !== null)) ? (
                    <Text color="gray.300" fontSize="sm">FINAL</Text>
                  ) : (
                    <Text color="gray.300" fontSize="sm">Upcoming</Text>
                  )}
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
                  {(game.isLive || game.isDone) && (
                    <Text color="yellow.400" fontWeight="bold">{game.awayScore}</Text>
                  )}
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
                  {(game.isLive || game.isDone) && (
                    <Text color="yellow.400" fontWeight="bold">{game.homeScore}</Text>
                  )}
                </Flex>
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
            {selectedGame.isLive && (
              <Badge colorScheme="green" fontSize="md" py={1} px={3}>
                LIVE: {selectedGame.quarter} - {selectedGame.time}
              </Badge>
            )}
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
              {(selectedGame.isLive || selectedGame.isDone) && (
                <Text color="yellow.400" fontSize="2xl" fontWeight="bold">{selectedGame.awayScore}</Text>
              )}
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
              {(selectedGame.isLive || selectedGame.isDone) && (
                <Text color="yellow.400" fontSize="2xl" fontWeight="bold">{selectedGame.homeScore}</Text>
              )}
            </VStack>
          </Flex>

          {/* Moved Sportsbook Selector here */}
          <Box mb={3}>
            {renderSportsbookSelector()}
          </Box>

          {/* Betting Information Grid */}
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
                    {getSelectedOdds(selectedGame).moneyline.pick === getTeamCode(selectedGame.awayTeam) && (
                      <BetIQBadge 
                        outcome={selectedGame.isDone ? 
                          checkMoneylineBet(selectedGame, getTeamCode(selectedGame.awayTeam)) : 
                          null
                        }
                      />
                    )}
                  </Flex>
                  <Text 
                    color={getSelectedOdds(selectedGame).moneyline.away > 0 ? "green.400" : "red.400"}
                    fontWeight="bold"
                  >
                    {formatMoneyline(getSelectedOdds(selectedGame).moneyline.away)}
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
                    {getSelectedOdds(selectedGame).moneyline.pick === getTeamCode(selectedGame.homeTeam) && (
                      <BetIQBadge 
                        outcome={selectedGame.isDone ? 
                          checkMoneylineBet(selectedGame, getTeamCode(selectedGame.homeTeam)) : 
                          null
                        }
                      />
                    )}
                  </Flex>
                  <Text 
                    color={getSelectedOdds(selectedGame).moneyline.home > 0 ? "green.400" : "red.400"}
                    fontWeight="bold"
                  >
                    {formatMoneyline(getSelectedOdds(selectedGame).moneyline.home)}
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
                    {getSelectedOdds(selectedGame).spread.pick === getTeamCode(selectedGame.awayTeam) && (
                      <BetIQBadge 
                        outcome={selectedGame.isDone ? 
                          checkSpreadBet(selectedGame, getSelectedOdds(selectedGame)) : 
                          null
                        }
                      />
                    )}
                  </Flex>
                  <Text color="white" fontWeight="bold">
                    {getSelectedOdds(selectedGame).spread.favorite === getTeamCode(selectedGame.awayTeam) 
                      ? `-${getSelectedOdds(selectedGame).spread.points}` 
                      : `+${getSelectedOdds(selectedGame).spread.points}`} ({getSelectedOdds(selectedGame).spread.odds})
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
                    {getSelectedOdds(selectedGame).spread.pick === getTeamCode(selectedGame.homeTeam) && (
                      <BetIQBadge 
                        outcome={selectedGame.isDone ? 
                          checkSpreadBet(selectedGame, getSelectedOdds(selectedGame)) : 
                          null
                        }
                      />
                    )}
                  </Flex>
                  <Text color="white" fontWeight="bold">
                    {getSelectedOdds(selectedGame).spread.favorite === getTeamCode(selectedGame.homeTeam) 
                      ? `-${getSelectedOdds(selectedGame).spread.points}` 
                      : `+${getSelectedOdds(selectedGame).spread.points}`} ({getSelectedOdds(selectedGame).spread.odds})
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
                    <Text color="white" mr={2}>Over {getSelectedOdds(selectedGame).total.value}</Text>
                    {getSelectedOdds(selectedGame).total.pick === "OVER" && (
                      <BetIQBadge 
                        outcome={selectedGame.isDone ? 
                          checkTotalBet(selectedGame, getSelectedOdds(selectedGame)) : 
                          null
                        }
                      />
                    )}
                  </Flex>
                  <Text color="white" fontWeight="bold">{getSelectedOdds(selectedGame).total.overOdds}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Flex align="center">
                    <Text color="white" mr={2}>Under {getSelectedOdds(selectedGame).total.value}</Text>
                    {getSelectedOdds(selectedGame).total.pick === "UNDER" && (
                      <BetIQBadge 
                        outcome={selectedGame.isDone ? 
                          checkTotalBet(selectedGame, getSelectedOdds(selectedGame)) : 
                          null
                        }
                      />
                    )}
                  </Flex>
                  <Text color="white" fontWeight="bold">{getSelectedOdds(selectedGame).total.underOdds}</Text>
                </Flex>
              </Box>
            </GridItem>
          </Grid>

          {/* Add the GameNews component here */}
          <Box mt={8}>
            <GameNews homeTeam={selectedGame.homeTeam} awayTeam={selectedGame.awayTeam} />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default ActiveGames;
