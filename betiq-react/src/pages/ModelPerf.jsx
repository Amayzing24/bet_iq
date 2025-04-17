import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

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

// Get team name from team name (e.g., "BKN Nets" -> "Brooklyn Nets")
const getTeamCode = (teamName) => {
  // If the team name is already in the correct format, return it
  if (teamName.includes("Hawks") || teamName.includes("Celtics") || 
      teamName.includes("Nets") || teamName.includes("Hornets") || 
      teamName.includes("Bulls") || teamName.includes("Cavaliers") || 
      teamName.includes("Pistons") || teamName.includes("Pacers") || 
      teamName.includes("Heat") || teamName.includes("Bucks") || 
      teamName.includes("Knicks") || teamName.includes("Magic") || 
      teamName.includes("76ers") || teamName.includes("Raptors") || 
      teamName.includes("Wizards") || teamName.includes("Mavericks") || 
      teamName.includes("Nuggets") || teamName.includes("Warriors") || 
      teamName.includes("Rockets") || teamName.includes("Clippers") || 
      teamName.includes("Lakers") || teamName.includes("Grizzlies") || 
      teamName.includes("Timberwolves") || teamName.includes("Pelicans") || 
      teamName.includes("Thunder") || teamName.includes("Suns") || 
      teamName.includes("Trail Blazers") || teamName.includes("Kings") || 
      teamName.includes("Spurs") || teamName.includes("Jazz")) {
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

// Calculate PnL for a bet
const calculatePnL = (odds, outcome) => {
  if (outcome === "push") return 0;
  if (outcome === "miss") return -1;
  
  // Convert American odds to decimal odds
  const decimalOdds = odds > 0 ? (odds / 100) + 1 : (100 / Math.abs(odds)) + 1;
  return decimalOdds - 1; // Return profit (not including stake)
};

const ModelPerf = () => {
  const [performance, setPerformance] = useState({
    draftkings: {
      moneyline: { hits: 0, misses: 0, pushes: 0, pnl: 0 },
      spread: { hits: 0, misses: 0, pushes: 0, pnl: 0 },
      total: { hits: 0, misses: 0, pushes: 0, pnl: 0 }
    },
    fanduel: {
      moneyline: { hits: 0, misses: 0, pushes: 0, pnl: 0 },
      spread: { hits: 0, misses: 0, pushes: 0, pnl: 0 },
      total: { hits: 0, misses: 0, pushes: 0, pnl: 0 }
    }
  });

  useEffect(() => {
    const calculatePerformance = () => {
      const newPerformance = {
        draftkings: {
          moneyline: { hits: 0, misses: 0, pushes: 0, pnl: 0 },
          spread: { hits: 0, misses: 0, pushes: 0, pnl: 0 },
          total: { hits: 0, misses: 0, pushes: 0, pnl: 0 }
        },
        fanduel: {
          moneyline: { hits: 0, misses: 0, pushes: 0, pnl: 0 },
          spread: { hits: 0, misses: 0, pushes: 0, pnl: 0 },
          total: { hits: 0, misses: 0, pushes: 0, pnl: 0 }
        }
      };

      // Process each date's games
      Object.values(scoreDataMap).forEach(games => {
        if (!Array.isArray(games)) return; // Skip if not an array
        
        games.forEach(game => {
          if (!game.isDone) return;

          // Process DraftKings bets
          const dkOdds = game.odds?.draftkings;
          if (dkOdds) {
            // Moneyline
            const mlOutcome = checkMoneylineBet(game, dkOdds.moneyline.pick);
            if (mlOutcome) {
              if (mlOutcome === "hit") {
                newPerformance.draftkings.moneyline.hits++;
              } else if (mlOutcome === "miss") {
                newPerformance.draftkings.moneyline.misses++;
              } else if (mlOutcome === "push") {
                newPerformance.draftkings.moneyline.pushes++;
              }
              const odds = dkOdds.moneyline.pick === getTeamCode(game.awayTeam) ? 
                dkOdds.moneyline.away : dkOdds.moneyline.home;
              newPerformance.draftkings.moneyline.pnl += calculatePnL(odds, mlOutcome);
            }

            // Spread
            const spreadOutcome = checkSpreadBet(game, dkOdds);
            if (spreadOutcome) {
              if (spreadOutcome === "hit") {
                newPerformance.draftkings.spread.hits++;
              } else if (spreadOutcome === "miss") {
                newPerformance.draftkings.spread.misses++;
              } else if (spreadOutcome === "push") {
                newPerformance.draftkings.spread.pushes++;
              }
              newPerformance.draftkings.spread.pnl += calculatePnL(dkOdds.spread.odds, spreadOutcome);
            }

            // Total
            const totalOutcome = checkTotalBet(game, dkOdds);
            if (totalOutcome) {
              if (totalOutcome === "hit") {
                newPerformance.draftkings.total.hits++;
              } else if (totalOutcome === "miss") {
                newPerformance.draftkings.total.misses++;
              } else if (totalOutcome === "push") {
                newPerformance.draftkings.total.pushes++;
              }
              const odds = dkOdds.total.pick === "OVER" ? dkOdds.total.overOdds : dkOdds.total.underOdds;
              newPerformance.draftkings.total.pnl += calculatePnL(odds, totalOutcome);
            }
          }

          // Process FanDuel bets
          const fdOdds = game.odds?.fanduel;
          if (fdOdds) {
            // Moneyline
            const mlOutcome = checkMoneylineBet(game, fdOdds.moneyline.pick);
            if (mlOutcome) {
              if (mlOutcome === "hit") {
                newPerformance.fanduel.moneyline.hits++;
              } else if (mlOutcome === "miss") {
                newPerformance.fanduel.moneyline.misses++;
              } else if (mlOutcome === "push") {
                newPerformance.fanduel.moneyline.pushes++;
              }
              const odds = fdOdds.moneyline.pick === getTeamCode(game.awayTeam) ? 
                fdOdds.moneyline.away : fdOdds.moneyline.home;
              newPerformance.fanduel.moneyline.pnl += calculatePnL(odds, mlOutcome);
            }

            // Spread
            const spreadOutcome = checkSpreadBet(game, fdOdds);
            if (spreadOutcome) {
              if (spreadOutcome === "hit") {
                newPerformance.fanduel.spread.hits++;
              } else if (spreadOutcome === "miss") {
                newPerformance.fanduel.spread.misses++;
              } else if (spreadOutcome === "push") {
                newPerformance.fanduel.spread.pushes++;
              }
              newPerformance.fanduel.spread.pnl += calculatePnL(fdOdds.spread.odds, spreadOutcome);
            }

            // Total
            const totalOutcome = checkTotalBet(game, fdOdds);
            if (totalOutcome) {
              if (totalOutcome === "hit") {
                newPerformance.fanduel.total.hits++;
              } else if (totalOutcome === "miss") {
                newPerformance.fanduel.total.misses++;
              } else if (totalOutcome === "push") {
                newPerformance.fanduel.total.pushes++;
              }
              const odds = fdOdds.total.pick === "OVER" ? fdOdds.total.overOdds : fdOdds.total.underOdds;
              newPerformance.fanduel.total.pnl += calculatePnL(odds, totalOutcome);
            }
          }
        });
      });

      console.log('Calculated Performance:', newPerformance); // Debug log
      setPerformance(newPerformance);
    };

    calculatePerformance();
  }, []);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Model Performance Since 4/07/2025</Heading>
        
        {/* Aggregated Summary */}
        <Box bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          <Heading size="md" mb={4} textAlign="center">Aggregated Performance</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Hits</Th>
                <Th>Misses</Th>
                <Th>Pushes</Th>
                <Th>Win %</Th>
                <Th>Total PnL</Th>
                <Th>PnL/Game</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                {(() => {
                  // Aggregate stats across all bet types and both sportsbooks
                  let totalHits = 0;
                  let totalMisses = 0;
                  let totalPushes = 0;
                  let totalPnL = 0;
                  
                  // Sum up all bet types for both sportsbooks
                  ["moneyline", "spread", "total"].forEach(betType => {
                    totalHits += performance.draftkings[betType].hits + performance.fanduel[betType].hits;
                    totalMisses += performance.draftkings[betType].misses + performance.fanduel[betType].misses;
                    totalPushes += performance.draftkings[betType].pushes + performance.fanduel[betType].pushes;
                    totalPnL += performance.draftkings[betType].pnl + performance.fanduel[betType].pnl;
                  });
                  
                  const totalGames = totalHits + totalMisses + totalPushes;
                  const winPercentage = totalHits + totalMisses > 0 ? 
                    ((totalHits / (totalHits + totalMisses)) * 100).toFixed(1) : "0.0";
                  const pnlPerGame = totalGames > 0 ? (totalPnL / totalGames).toFixed(2) : "0.00";
                  
                  return (
                    <>
                      <Td>{totalHits}</Td>
                      <Td>{totalMisses}</Td>
                      <Td>{totalPushes}</Td>
                      <Td>{winPercentage}%</Td>
                      <Td>
                        <Badge colorScheme={totalPnL >= 0 ? "green" : "red"}>
                          {totalPnL.toFixed(2)}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme={parseFloat(pnlPerGame) >= 0 ? "green" : "red"}>
                          {pnlPerGame}
                        </Badge>
                      </Td>
                    </>
                  );
                })()}
              </Tr>
            </Tbody>
          </Table>
        </Box>
        
        {/* Individual Sportsbook Performance */}
        {["draftkings", "fanduel"].map(sportsbook => (
          <Box key={sportsbook} bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <Heading size="md" mb={4} textTransform="capitalize">{sportsbook}</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Bet Type</Th>
                  <Th>Hits</Th>
                  <Th>Misses</Th>
                  <Th>Pushes</Th>
                  <Th>Win %</Th>
                  <Th>PnL (Units)</Th>
                </Tr>
              </Thead>
              <Tbody>
                {["moneyline", "spread", "total"].map(betType => {
                  const stats = performance[sportsbook][betType];
                  const totalBets = stats.hits + stats.misses + stats.pushes;
                  const winPercentage = totalBets > 0 ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1) : "0.0";
                  
                  return (
                    <Tr key={betType}>
                      <Td textTransform="capitalize">{betType}</Td>
                      <Td>{stats.hits}</Td>
                      <Td>{stats.misses}</Td>
                      <Td>{stats.pushes}</Td>
                      <Td>{winPercentage}%</Td>
                      <Td>
                        <Badge colorScheme={stats.pnl >= 0 ? "green" : "red"}>
                          {stats.pnl.toFixed(2)}
                        </Badge>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default ModelPerf;
