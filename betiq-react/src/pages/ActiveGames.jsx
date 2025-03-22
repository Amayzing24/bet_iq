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
  Tooltip,
  ButtonGroup
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

// Add sportsbook constants
const SPORTSBOOKS = {
  DRAFTKINGS: {
    name: "DraftKings",
    logo: "https://logo.clearbit.com/draftkings.com",
  },
  FANDUEL: {
    name: "FanDuel",
    logo: "https://logo.clearbit.com/fanduel.com",
  },
  ESPNBET: {
    name: "ESPN BET",
    logo: "https://logo.clearbit.com/espn.com",
  }
};

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
      isDone: false,
      odds: {
        draftkings: {
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
          }
        },
        fanduel: {
          spread: { 
            favorite: "IND", 
            points: 15, 
            odds: -110,
            pick: "IND"
          },
          total: { 
            value: 222, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: +1050, 
            away: -2300,
            pick: "IND"
          }
        },
        espnBet: {
          spread: { 
            favorite: "IND", 
            points: 15.5, 
            odds: -112,
            pick: "IND"
          },
          total: { 
            value: 221.5, 
            overOdds: -112, 
            underOdds: -112,
            pick: "OVER"
          },
          moneyline: { 
            home: +1080, 
            away: -2400,
            pick: "IND"
          }
        }
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
      isDone: false,
      odds: {
        draftkings: {
          spread: { 
            favorite: "LAL", 
            points: 4.5, 
            odds: -110,
            pick: "LAL"
          },
          total: { 
            value: 235.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -180, 
            away: +150,
            pick: "LAL"
          }
        },
        fanduel: {
          spread: { 
            favorite: "LAL", 
            points: 4.5, 
            odds: -110,
            pick: "LAL"
          },
          total: { 
            value: 235.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -180, 
            away: +150,
            pick: "LAL"
          }
        },
        espnBet: {
          spread: { 
            favorite: "LAL", 
            points: 4.5, 
            odds: -110,
            pick: "LAL"
          },
          total: { 
            value: 235.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -180, 
            away: +150,
            pick: "LAL"
          }
        }
      },
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
      isDone: false,
      odds: {
        draftkings: {
          spread: { 
            favorite: "BOS", 
            points: 7.5, 
            odds: -110,
            pick: "MIA"
          },
          total: { 
            value: 218.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: +320, 
            away: -400,
            pick: "BOS"
          }
        },
        fanduel: {
          spread: { 
            favorite: "BOS", 
            points: 7.5, 
            odds: -110,
            pick: "MIA"
          },
          total: { 
            value: 218.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: +320, 
            away: -400,
            pick: "BOS"
          }
        },
        espnBet: {
          spread: { 
            favorite: "BOS", 
            points: 7.5, 
            odds: -110,
            pick: "MIA"
          },
          total: { 
            value: 218.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: +320, 
            away: -400,
            pick: "BOS"
          }
        }
      },
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
      isDone: false,
      odds: {
        draftkings: {
          spread: { 
            favorite: "GSW", 
            points: 3.5, 
            odds: -110,
            pick: "DAL"
          },
          total: { 
            value: 232.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -160, 
            away: +135,
            pick: "DAL"
          }
        },
        fanduel: {
          spread: { 
            favorite: "GSW", 
            points: 3.5, 
            odds: -110,
            pick: "DAL"
          },
          total: { 
            value: 232.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -160, 
            away: +135,
            pick: "DAL"
          }
        },
        espnBet: {
          spread: { 
            favorite: "GSW", 
            points: 3.5, 
            odds: -110,
            pick: "DAL"
          },
          total: { 
            value: 232.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -160, 
            away: +135,
            pick: "DAL"
          }
        }
      },
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
      isDone: false,
      odds: {
        draftkings: {
          spread: { 
            favorite: "DEN", 
            points: 9.5, 
            odds: -110,
            pick: "DEN"
          },
          total: { 
            value: 224.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: -450, 
            away: +350,
            pick: "DEN"
          }
        },
        fanduel: {
          spread: { 
            favorite: "DEN", 
            points: 9.5, 
            odds: -110,
            pick: "DEN"
          },
          total: { 
            value: 224.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: -450, 
            away: +350,
            pick: "DEN"
          }
        },
        espnBet: {
          spread: { 
            favorite: "DEN", 
            points: 9.5, 
            odds: -110,
            pick: "DEN"
          },
          total: { 
            value: 224.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: -450, 
            away: +350,
            pick: "DEN"
          }
        }
      },
      homeForm: ["W", "W", "W", "L", "W"],
      awayForm: ["L", "L", "L", "W", "L"]
    },
    {
      id: 6,
      homeTeam: "PHI 76ers",
      awayTeam: "TOR Raptors",
      isLive: false,
      isDone: false,
      odds: {
        draftkings: {
          spread: { 
            favorite: "PHI", 
            points: 6.5, 
            odds: -110,
            pick: "TOR"
          },
          total: { 
            value: 228.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -240, 
            away: +200,
            pick: "PHI"
          }
        },
        fanduel: {
          spread: { 
            favorite: "PHI", 
            points: 6.5, 
            odds: -110,
            pick: "TOR"
          },
          total: { 
            value: 228.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -240, 
            away: +200,
            pick: "PHI"
          }
        },
        espnBet: {
          spread: { 
            favorite: "PHI", 
            points: 6.5, 
            odds: -110,
            pick: "TOR"
          },
          total: { 
            value: 228.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -240, 
            away: +200,
            pick: "PHI"
          }
        }
      },
      homeForm: ["W", "W", "L", "W", "W"],
      awayForm: ["L", "L", "W", "L", "W"]
    }
  ];
  
  const yesterdayGames = [
    {
      id: 6,
      homeTeam: "CLE Cavaliers",
      awayTeam: "CHI Bulls",
      homeScore: 112,
      awayScore: 105,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "CLE", 
            points: 6.5, 
            odds: -110,
            pick: "CLE"
          },
          total: { 
            value: 219.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: -250, 
            away: +200,
            pick: "CLE"
          }
        },
        fanduel: {
          spread: { 
            favorite: "CLE", 
            points: 6.5, 
            odds: -110,
            pick: "CLE"
          },
          total: { 
            value: 219.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: -250, 
            away: +200,
            pick: "CLE"
          }
        },
        espnBet: {
          spread: { 
            favorite: "CLE", 
            points: 6.5, 
            odds: -110,
            pick: "CLE"
          },
          total: { 
            value: 219.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: -250, 
            away: +200,
            pick: "CLE"
          }
        }
      },
      homeForm: ["W", "L", "W", "W", "L"],
      awayForm: ["L", "L", "W", "L", "W"]
    },
    {
      id: 7,
      homeTeam: "OKC Thunder",
      awayTeam: "MEM Grizzlies",
      homeScore: 128,
      awayScore: 115,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "OKC", 
            points: 8.5, 
            odds: -110,
            pick: "OKC"
          },
          total: { 
            value: 230.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -380, 
            away: +290,
            pick: "OKC"
          }
        },
        fanduel: {
          spread: { 
            favorite: "OKC", 
            points: 8.5, 
            odds: -110,
            pick: "OKC"
          },
          total: { 
            value: 230.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -380, 
            away: +290,
            pick: "OKC"
          }
        },
        espnBet: {
          spread: { 
            favorite: "OKC", 
            points: 8.5, 
            odds: -110,
            pick: "OKC"
          },
          total: { 
            value: 230.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -380, 
            away: +290,
            pick: "OKC"
          }
        }
      },
      homeForm: ["W", "W", "W", "W", "L"],
      awayForm: ["L", "W", "L", "L", "L"]
    },
    {
      id: 8,
      homeTeam: "TOR Raptors",
      awayTeam: "ATL Hawks",
      homeScore: 98,
      awayScore: 119,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "ATL", 
            points: 5.5, 
            odds: -110,
            pick: "ATL"
          },
          total: { 
            value: 226.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: +190, 
            away: -230,
            pick: "ATL"
          }
        },
        fanduel: {
          spread: { 
            favorite: "ATL", 
            points: 5.5, 
            odds: -110,
            pick: "ATL"
          },
          total: { 
            value: 226.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: +190, 
            away: -230,
            pick: "ATL"
          }
        },
        espnBet: {
          spread: { 
            favorite: "ATL", 
            points: 5.5, 
            odds: -110,
            pick: "ATL"
          },
          total: { 
            value: 226.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: +190, 
            away: -230,
            pick: "ATL"
          }
        }
      },
      homeForm: ["L", "L", "L", "W", "L"],
      awayForm: ["W", "L", "W", "W", "W"]
    },
    {
      id: 9,
      homeTeam: "MIN Timberwolves",
      awayTeam: "DET Pistons",
      homeScore: 126,
      awayScore: 103,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "MIN", 
            points: 10.5, 
            odds: -110,
            pick: "MIN"
          },
          total: { 
            value: 227.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -500, 
            away: +380,
            pick: "MIN"
          }
        },
        fanduel: {
          spread: { 
            favorite: "MIN", 
            points: 10.5, 
            odds: -110,
            pick: "MIN"
          },
          total: { 
            value: 227.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -500, 
            away: +380,
            pick: "MIN"
          }
        },
        espnBet: {
          spread: { 
            favorite: "MIN", 
            points: 10.5, 
            odds: -110,
            pick: "MIN"
          },
          total: { 
            value: 227.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -500, 
            away: +380,
            pick: "MIN"
          }
        }
      },
      homeForm: ["W", "W", "L", "W", "W"],
      awayForm: ["L", "L", "L", "L", "W"]
    },
    {
      id: 10,
      homeTeam: "SAS Spurs",
      awayTeam: "WAS Wizards",
      homeScore: 118,
      awayScore: 105,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "SAS", 
            points: 7, 
            odds: -110,
            pick: "SAS"
          },
          total: { 
            value: 229.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -275, 
            away: +220,
            pick: "SAS"
          }
        },
        fanduel: {
          spread: { 
            favorite: "SAS", 
            points: 7, 
            odds: -110,
            pick: "SAS"
          },
          total: { 
            value: 229.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -275, 
            away: +220,
            pick: "SAS"
          }
        },
        espnBet: {
          spread: { 
            favorite: "SAS", 
            points: 7, 
            odds: -110,
            pick: "SAS"
          },
          total: { 
            value: 229.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -275, 
            away: +220,
            pick: "SAS"
          }
        }
      },
      homeForm: ["W", "L", "L", "W", "L"],
      awayForm: ["L", "L", "L", "L", "W"]
    }
  ];
  
  const twoDaysAgoGames = [
    {
      id: 11,
      homeTeam: "UTA Jazz",
      awayTeam: "SAC Kings",
      homeScore: 107,
      awayScore: 123,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "SAC", 
            points: 7.5, 
            odds: -110,
            pick: "SAC"
          },
          total: { 
            value: 228.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +260, 
            away: -320,
            pick: "SAC"
          }
        },
        fanduel: {
          spread: { 
            favorite: "SAC", 
            points: 7.5, 
            odds: -110,
            pick: "SAC"
          },
          total: { 
            value: 228.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +260, 
            away: -320,
            pick: "SAC"
          }
        },
        espnBet: {
          spread: { 
            favorite: "SAC", 
            points: 7.5, 
            odds: -110,
            pick: "SAC"
          },
          total: { 
            value: 228.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +260, 
            away: -320,
            pick: "SAC"
          }
        }
      },
      homeForm: ["L", "L", "W", "L", "L"],
      awayForm: ["W", "W", "L", "W", "W"]
    },
    {
      id: 12,
      homeTeam: "NYK Knicks",
      awayTeam: "PHI 76ers",
      homeScore: 114,
      awayScore: 102,
      time: "FINAL",
      quarter: "GAME OVER", 
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "NYK", 
            points: 4.5, 
            odds: -110,
            pick: "NYK"
          },
          total: { 
            value: 215.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -180, 
            away: +150,
            pick: "NYK"
          }
        },
        fanduel: {
          spread: { 
            favorite: "NYK", 
            points: 4.5, 
            odds: -110,
            pick: "NYK"
          },
          total: { 
            value: 215.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -180, 
            away: +150,
            pick: "NYK"
          }
        },
        espnBet: {
          spread: { 
            favorite: "NYK", 
            points: 4.5, 
            odds: -110,
            pick: "NYK"
          },
          total: { 
            value: 215.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -180, 
            away: +150,
            pick: "NYK"
          }
        }
      },
      homeForm: ["W", "W", "L", "W", "W"],
      awayForm: ["L", "W", "L", "W", "L"]
    },
    {
      id: 13,
      homeTeam: "MIL Bucks",
      awayTeam: "CHA Hornets",
      homeScore: 131,
      awayScore: 115,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "MIL", 
            points: 9.5, 
            odds: -110,
            pick: "MIL"
          },
          total: { 
            value: 230.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -450, 
            away: +340,
            pick: "MIL"
          }
        },
        fanduel: {
          spread: { 
            favorite: "MIL", 
            points: 9.5, 
            odds: -110,
            pick: "MIL"
          },
          total: { 
            value: 230.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -450, 
            away: +340,
            pick: "MIL"
          }
        },
        espnBet: {
          spread: { 
            favorite: "MIL", 
            points: 9.5, 
            odds: -110,
            pick: "MIL"
          },
          total: { 
            value: 230.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -450, 
            away: +340,
            pick: "MIL"
          }
        }
      },
      homeForm: ["W", "W", "L", "W", "W"],
      awayForm: ["L", "W", "L", "L", "L"]
    },
    {
      id: 14,
      homeTeam: "NOP Pelicans",
      awayTeam: "HOU Rockets",
      homeScore: 115,
      awayScore: 110,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "NOP", 
            points: 3.5, 
            odds: -110,
            pick: "NOP"
          },
          total: { 
            value: 222.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -165, 
            away: +140,
            pick: "NOP"
          }
        },
        fanduel: {
          spread: { 
            favorite: "NOP", 
            points: 3.5, 
            odds: -110,
            pick: "NOP"
          },
          total: { 
            value: 222.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -165, 
            away: +140,
            pick: "NOP"
          }
        },
        espnBet: {
          spread: { 
            favorite: "NOP", 
            points: 3.5, 
            odds: -110,
            pick: "NOP"
          },
          total: { 
            value: 222.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -165, 
            away: +140,
            pick: "NOP"
          }
        }
      },
      homeForm: ["W", "L", "W", "W", "L"],
      awayForm: ["W", "L", "W", "L", "L"]
    },
    {
      id: 15,
      homeTeam: "ORL Magic",
      awayTeam: "CLE Cavaliers",
      homeScore: 109,
      awayScore: 118,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "CLE", 
            points: 2.5, 
            odds: -110,
            pick: "CLE"
          },
          total: { 
            value: 218.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +120, 
            away: -140,
            pick: "CLE"
          }
        },
        fanduel: {
          spread: { 
            favorite: "CLE", 
            points: 2.5, 
            odds: -110,
            pick: "CLE"
          },
          total: { 
            value: 218.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +120, 
            away: -140,
            pick: "CLE"
          }
        },
        espnBet: {
          spread: { 
            favorite: "CLE", 
            points: 2.5, 
            odds: -110,
            pick: "CLE"
          },
          total: { 
            value: 218.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +120, 
            away: -140,
            pick: "CLE"
          }
        }
      },
      homeForm: ["L", "W", "W", "L", "W"],
      awayForm: ["W", "L", "W", "W", "L"]
    }
  ];
  
  const threeDaysAgoGames = [
    {
      id: 16,
      homeTeam: "LAC Clippers",
      awayTeam: "DEN Nuggets",
      homeScore: 112,
      awayScore: 119,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "DEN", 
            points: 3.5, 
            odds: -110,
            pick: "DEN"
          },
          total: { 
            value: 226.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +145, 
            away: -170,
            pick: "DEN"
          }
        },
        fanduel: {
          spread: { 
            favorite: "DEN", 
            points: 3.5, 
            odds: -110,
            pick: "DEN"
          },
          total: { 
            value: 226.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +145, 
            away: -170,
            pick: "DEN"
          }
        },
        espnBet: {
          spread: { 
            favorite: "DEN", 
            points: 3.5, 
            odds: -110,
            pick: "DEN"
          },
          total: { 
            value: 226.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +145, 
            away: -170,
            pick: "DEN"
          }
        }
      },
      homeForm: ["L", "W", "W", "L", "W"],
      awayForm: ["W", "W", "W", "L", "W"]
    },
    {
      id: 17,
      homeTeam: "GSW Warriors",
      awayTeam: "POR Trail Blazers",
      homeScore: 131,
      awayScore: 109,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "GSW", 
            points: 11.5, 
            odds: -110,
            pick: "GSW"
          },
          total: { 
            value: 233.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -600, 
            away: +450,
            pick: "GSW"
          }
        },
        fanduel: {
          spread: { 
            favorite: "GSW", 
            points: 11.5, 
            odds: -110,
            pick: "GSW"
          },
          total: { 
            value: 233.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -600, 
            away: +450,
            pick: "GSW"
          }
        },
        espnBet: {
          spread: { 
            favorite: "GSW", 
            points: 11.5, 
            odds: -110,
            pick: "GSW"
          },
          total: { 
            value: 233.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -600, 
            away: +450,
            pick: "GSW"
          }
        }
      },
      homeForm: ["W", "L", "W", "L", "W"],
      awayForm: ["L", "L", "L", "W", "L"]
    },
    {
      id: 18,
      homeTeam: "BKN Nets",
      awayTeam: "ATL Hawks",
      homeScore: 98,
      awayScore: 104,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "ATL", 
            points: 5, 
            odds: -110,
            pick: "ATL"
          },
          total: { 
            value: 224.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: +180, 
            away: -220,
            pick: "ATL"
          }
        },
        fanduel: {
          spread: { 
            favorite: "ATL", 
            points: 5, 
            odds: -110,
            pick: "ATL"
          },
          total: { 
            value: 224.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: +180, 
            away: -220,
            pick: "ATL"
          }
        },
        espnBet: {
          spread: { 
            favorite: "ATL", 
            points: 5, 
            odds: -110,
            pick: "ATL"
          },
          total: { 
            value: 224.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: +180, 
            away: -220,
            pick: "ATL"
          }
        }
      },
      homeForm: ["L", "W", "L", "L", "W"],
      awayForm: ["W", "L", "W", "W", "W"]
    },
    {
      id: 19,
      homeTeam: "IND Pacers",
      awayTeam: "MIA Heat",
      homeScore: 122,
      awayScore: 115,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "IND", 
            points: 4, 
            odds: -110,
            pick: "IND"
          },
          total: { 
            value: 230.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -175, 
            away: +145,
            pick: "IND"
          }
        },
        fanduel: {
          spread: { 
            favorite: "IND", 
            points: 4, 
            odds: -110,
            pick: "IND"
          },
          total: { 
            value: 230.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -175, 
            away: +145,
            pick: "IND"
          }
        },
        espnBet: {
          spread: { 
            favorite: "IND", 
            points: 4, 
            odds: -110,
            pick: "IND"
          },
          total: { 
            value: 230.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -175, 
            away: +145,
            pick: "IND"
          }
        }
      },
      homeForm: ["W", "W", "W", "L", "W"],
      awayForm: ["L", "L", "W", "W", "L"]
    },
    {
      id: 20,
      homeTeam: "BOS Celtics",
      awayTeam: "TOR Raptors",
      homeScore: 126,
      awayScore: 107,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "BOS", 
            points: 12, 
            odds: -110,
            pick: "BOS"
          },
          total: { 
            value: 229.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -650, 
            away: +475,
            pick: "BOS"
          }
        },
        fanduel: {
          spread: { 
            favorite: "BOS", 
            points: 12, 
            odds: -110,
            pick: "BOS"
          },
          total: { 
            value: 229.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -650, 
            away: +475,
            pick: "BOS"
          }
        },
        espnBet: {
          spread: { 
            favorite: "BOS", 
            points: 12, 
            odds: -110,
            pick: "BOS"
          },
          total: { 
            value: 229.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -650, 
            away: +475,
            pick: "BOS"
          }
        }
      },
      homeForm: ["W", "W", "W", "W", "L"],
      awayForm: ["L", "L", "L", "W", "L"]
    }
  ];
  
  const fourDaysAgoGames = [
    {
      id: 21,
      homeTeam: "PHX Suns",
      awayTeam: "DAL Mavericks",
      homeScore: 115,
      awayScore: 120,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "DAL", 
            points: 1.5, 
            odds: -110,
            pick: "DAL"
          },
          total: { 
            value: 235.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +105, 
            away: -125,
            pick: "DAL"
          }
        },
        fanduel: {
          spread: { 
            favorite: "DAL", 
            points: 1.5, 
            odds: -110,
            pick: "DAL"
          },
          total: { 
            value: 235.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +105, 
            away: -125,
            pick: "DAL"
          }
        },
        espnBet: {
          spread: { 
            favorite: "DAL", 
            points: 1.5, 
            odds: -110,
            pick: "DAL"
          },
          total: { 
            value: 235.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +105, 
            away: -125,
            pick: "DAL"
          }
        }
      },
      homeForm: ["L", "W", "L", "W", "L"],
      awayForm: ["W", "W", "L", "L", "W"]
    },
    {
      id: 22,
      homeTeam: "CHI Bulls",
      awayTeam: "DET Pistons",
      homeScore: 121,
      awayScore: 113,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "CHI", 
            points: 7, 
            odds: -110,
            pick: "CHI"
          },
          total: { 
            value: 225.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -300, 
            away: +240,
            pick: "CHI"
          }
        },
        fanduel: {
          spread: { 
            favorite: "CHI", 
            points: 7, 
            odds: -110,
            pick: "CHI"
          },
          total: { 
            value: 225.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -300, 
            away: +240,
            pick: "CHI"
          }
        },
        espnBet: {
          spread: { 
            favorite: "CHI", 
            points: 7, 
            odds: -110,
            pick: "CHI"
          },
          total: { 
            value: 225.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -300, 
            away: +240,
            pick: "CHI"
          }
        }
      },
      homeForm: ["L", "L", "W", "L", "W"],
      awayForm: ["L", "L", "L", "L", "W"]
    },
    {
      id: 23,
      homeTeam: "HOU Rockets",
      awayTeam: "OKC Thunder",
      homeScore: 105,
      awayScore: 119,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "OKC", 
            points: 6.5, 
            odds: -110,
            pick: "OKC"
          },
          total: { 
            value: 227.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +220, 
            away: -270,
            pick: "OKC"
          }
        },
        fanduel: {
          spread: { 
            favorite: "OKC", 
            points: 6.5, 
            odds: -110,
            pick: "OKC"
          },
          total: { 
            value: 227.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +220, 
            away: -270,
            pick: "OKC"
          }
        },
        espnBet: {
          spread: { 
            favorite: "OKC", 
            points: 6.5, 
            odds: -110,
            pick: "OKC"
          },
          total: { 
            value: 227.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +220, 
            away: -270,
            pick: "OKC"
          }
        }
      },
      homeForm: ["W", "L", "W", "L", "L"],
      awayForm: ["W", "W", "W", "W", "L"]
    },
    {
      id: 24,
      homeTeam: "MEM Grizzlies",
      awayTeam: "SAS Spurs",
      homeScore: 109,
      awayScore: 115,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "SAS", 
            points: 2, 
            odds: -110,
            pick: "SAS"
          },
          total: { 
            value: 221.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +115, 
            away: -135,
            pick: "SAS"
          }
        },
        fanduel: {
          spread: { 
            favorite: "SAS", 
            points: 2, 
            odds: -110,
            pick: "SAS"
          },
          total: { 
            value: 221.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +115, 
            away: -135,
            pick: "SAS"
          }
        },
        espnBet: {
          spread: { 
            favorite: "SAS", 
            points: 2, 
            odds: -110,
            pick: "SAS"
          },
          total: { 
            value: 221.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +115, 
            away: -135,
            pick: "SAS"
          }
        }
      },
      homeForm: ["L", "W", "L", "L", "L"],
      awayForm: ["W", "L", "L", "W", "L"]
    },
    {
      id: 25,
      homeTeam: "WAS Wizards",
      awayTeam: "ORL Magic",
      homeScore: 102,
      awayScore: 114,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "ORL", 
            points: 8, 
            odds: -110,
            pick: "ORL"
          },
          total: { 
            value: 222.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +290, 
            away: -360,
            pick: "ORL"
          }
        },
        fanduel: {
          spread: { 
            favorite: "ORL", 
            points: 8, 
            odds: -110,
            pick: "ORL"
          },
          total: { 
            value: 222.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +290, 
            away: -360,
            pick: "ORL"
          }
        },
        espnBet: {
          spread: { 
            favorite: "ORL", 
            points: 8, 
            odds: -110,
            pick: "ORL"
          },
          total: { 
            value: 222.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +290, 
            away: -360,
            pick: "ORL"
          }
        }
      },
      homeForm: ["L", "L", "L", "L", "W"],
      awayForm: ["L", "W", "W", "L", "W"]
    }
  ];
  
  const fiveDaysAgoGames = [
    {
      id: 26,
      homeTeam: "MIN Timberwolves",
      awayTeam: "LAL Lakers",
      homeScore: 127,
      awayScore: 117,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "MIN", 
            points: 5, 
            odds: -110,
            pick: "MIN"
          },
          total: { 
            value: 233.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -200, 
            away: +170,
            pick: "MIN"
          }
        },
        fanduel: {
          spread: { 
            favorite: "MIN", 
            points: 5, 
            odds: -110,
            pick: "MIN"
          },
          total: { 
            value: 233.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -200, 
            away: +170,
            pick: "MIN"
          }
        },
        espnBet: {
          spread: { 
            favorite: "MIN", 
            points: 5, 
            odds: -110,
            pick: "MIN"
          },
          total: { 
            value: 233.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -200, 
            away: +170,
            pick: "MIN"
          }
        }
      },
      homeForm: ["W", "W", "L", "W", "W"],
      awayForm: ["W", "W", "W", "L", "W"]
    },
    {
      id: 27,
      homeTeam: "SAC Kings",
      awayTeam: "LAC Clippers",
      homeScore: 118,
      awayScore: 111,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "SAC", 
            points: 3, 
            odds: -110,
            pick: "SAC"
          },
          total: { 
            value: 226.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -150, 
            away: +125,
            pick: "SAC"
          }
        },
        fanduel: {
          spread: { 
            favorite: "SAC", 
            points: 3, 
            odds: -110,
            pick: "SAC"
          },
          total: { 
            value: 226.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -150, 
            away: +125,
            pick: "SAC"
          }
        },
        espnBet: {
          spread: { 
            favorite: "SAC", 
            points: 3, 
            odds: -110,
            pick: "SAC"
          },
          total: { 
            value: 226.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -150, 
            away: +125,
            pick: "SAC"
          }
        }
      },
      homeForm: ["W", "W", "L", "W", "W"],
      awayForm: ["L", "W", "W", "L", "W"]
    },
    {
      id: 28,
      homeTeam: "PHI 76ers",
      awayTeam: "CHA Hornets",
      homeScore: 124,
      awayScore: 117,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "PHI", 
            points: 8, 
            odds: -110,
            pick: "PHI"
          },
          total: { 
            value: 228.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -360, 
            away: +280,
            pick: "PHI"
          }
        },
        fanduel: {
          spread: { 
            favorite: "PHI", 
            points: 8, 
            odds: -110,
            pick: "PHI"
          },
          total: { 
            value: 228.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -360, 
            away: +280,
            pick: "PHI"
          }
        },
        espnBet: {
          spread: { 
            favorite: "PHI", 
            points: 8, 
            odds: -110,
            pick: "PHI"
          },
          total: { 
            value: 228.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -360, 
            away: +280,
            pick: "PHI"
          }
        }
      },
      homeForm: ["L", "W", "L", "W", "L"],
      awayForm: ["L", "W", "L", "L", "L"]
    },
    {
      id: 29,
      homeTeam: "ATL Hawks",
      awayTeam: "MIL Bucks",
      homeScore: 110,
      awayScore: 124,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "MIL", 
            points: 6, 
            odds: -110,
            pick: "MIL"
          },
          total: { 
            value: 232.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +200, 
            away: -240,
            pick: "MIL"
          }
        },
        fanduel: {
          spread: { 
            favorite: "MIL", 
            points: 6, 
            odds: -110,
            pick: "MIL"
          },
          total: { 
            value: 232.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +200, 
            away: -240,
            pick: "MIL"
          }
        },
        espnBet: {
          spread: { 
            favorite: "MIL", 
            points: 6, 
            odds: -110,
            pick: "MIL"
          },
          total: { 
            value: 232.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +200, 
            away: -240,
            pick: "MIL"
          }
        }
      },
      homeForm: ["W", "L", "W", "W", "W"],
      awayForm: ["W", "W", "L", "W", "W"]
    },
    {
      id: 30,
      homeTeam: "NYK Knicks",
      awayTeam: "CLE Cavaliers",
      homeScore: 119,
      awayScore: 122,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "CLE", 
            points: 1, 
            odds: -110,
            pick: "CLE"
          },
          total: { 
            value: 219.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +100, 
            away: -120,
            pick: "CLE"
          }
        },
        fanduel: {
          spread: { 
            favorite: "CLE", 
            points: 1, 
            odds: -110,
            pick: "CLE"
          },
          total: { 
            value: 219.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +100, 
            away: -120,
            pick: "CLE"
          }
        },
        espnBet: {
          spread: { 
            favorite: "CLE", 
            points: 1, 
            odds: -110,
            pick: "CLE"
          },
          total: { 
            value: 219.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +100, 
            away: -120,
            pick: "CLE"
          }
        }
      },
      homeForm: ["W", "W", "L", "W", "W"],
      awayForm: ["W", "L", "W", "W", "L"]
    }
  ];
  
  const sixDaysAgoGames = [
    {
      id: 31,
      homeTeam: "POR Trail Blazers",
      awayTeam: "UTA Jazz",
      homeScore: 112,
      awayScore: 103,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "POR", 
            points: 1.5, 
            odds: -110,
            pick: "POR"
          },
          total: { 
            value: 220.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -125, 
            away: +105,
            pick: "POR"
          }
        },
        fanduel: {
          spread: { 
            favorite: "POR", 
            points: 1.5, 
            odds: -110,
            pick: "POR"
          },
          total: { 
            value: 220.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -125, 
            away: +105,
            pick: "POR"
          }
        },
        espnBet: {
          spread: { 
            favorite: "POR", 
            points: 1.5, 
            odds: -110,
            pick: "POR"
          },
          total: { 
            value: 220.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -125, 
            away: +105,
            pick: "POR"
          }
        }
      },
      homeForm: ["L", "L", "L", "W", "L"],
      awayForm: ["L", "L", "W", "L", "L"]
    },
    {
      id: 32,
      homeTeam: "DAL Mavericks",
      awayTeam: "DEN Nuggets",
      homeScore: 115,
      awayScore: 121,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "DEN", 
            points: 2, 
            odds: -110,
            pick: "DEN"
          },
          total: { 
            value: 230.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +110, 
            away: -130,
            pick: "DEN"
          }
        },
        fanduel: {
          spread: { 
            favorite: "DEN", 
            points: 2, 
            odds: -110,
            pick: "DEN"
          },
          total: { 
            value: 230.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +110, 
            away: -130,
            pick: "DEN"
          }
        },
        espnBet: {
          spread: { 
            favorite: "DEN", 
            points: 2, 
            odds: -110,
            pick: "DEN"
          },
          total: { 
            value: 230.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +110, 
            away: -130,
            pick: "DEN"
          }
        }
      },
      homeForm: ["W", "W", "L", "L", "W"],
      awayForm: ["W", "W", "W", "L", "W"]
    },
    {
      id: 33,
      homeTeam: "MIA Heat",
      awayTeam: "BKN Nets",
      homeScore: 112,
      awayScore: 97,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "MIA", 
            points: 7, 
            odds: -110,
            pick: "MIA"
          },
          total: { 
            value: 217.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -300, 
            away: +240,
            pick: "MIA"
          }
        },
        fanduel: {
          spread: { 
            favorite: "MIA", 
            points: 7, 
            odds: -110,
            pick: "MIA"
          },
          total: { 
            value: 217.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -300, 
            away: +240,
            pick: "MIA"
          }
        },
        espnBet: {
          spread: { 
            favorite: "MIA", 
            points: 7, 
            odds: -110,
            pick: "MIA"
          },
          total: { 
            value: 217.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: -300, 
            away: +240,
            pick: "MIA"
          }
        }
      },
      homeForm: ["L", "L", "W", "W", "L"],
      awayForm: ["L", "W", "L", "L", "W"]
    },
    {
      id: 34,
      homeTeam: "TOR Raptors",
      awayTeam: "IND Pacers",
      homeScore: 105,
      awayScore: 123,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "IND", 
            points: 8, 
            odds: -110,
            pick: "IND"
          },
          total: { 
            value: 231.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +280, 
            away: -350,
            pick: "IND"
          }
        },
        fanduel: {
          spread: { 
            favorite: "IND", 
            points: 8, 
            odds: -110,
            pick: "IND"
          },
          total: { 
            value: 231.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +280, 
            away: -350,
            pick: "IND"
          }
        },
        espnBet: {
          spread: { 
            favorite: "IND", 
            points: 8, 
            odds: -110,
            pick: "IND"
          },
          total: { 
            value: 231.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "OVER"
          },
          moneyline: { 
            home: +280, 
            away: -350,
            pick: "IND"
          }
        }
      },
      homeForm: ["L", "L", "L", "W", "L"],
      awayForm: ["W", "W", "W", "L", "W"]
    },
    {
      id: 35,
      homeTeam: "DET Pistons",
      awayTeam: "BOS Celtics",
      homeScore: 98,
      awayScore: 119,
      time: "FINAL",
      quarter: "GAME OVER",
      isLive: false,
      isDone: true,
      odds: {
        draftkings: {
          spread: { 
            favorite: "BOS", 
            points: 13.5, 
            odds: -110,
            pick: "BOS"
          },
          total: { 
            value: 224.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: +700, 
            away: -1100,
            pick: "BOS"
          }
        },
        fanduel: {
          spread: { 
            favorite: "BOS", 
            points: 13.5, 
            odds: -110,
            pick: "BOS"
          },
          total: { 
            value: 224.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: +700, 
            away: -1100,
            pick: "BOS"
          }
        },
        espnBet: {
          spread: { 
            favorite: "BOS", 
            points: 13.5, 
            odds: -110,
            pick: "BOS"
          },
          total: { 
            value: 224.5, 
            overOdds: -110, 
            underOdds: -110,
            pick: "UNDER"
          },
          moneyline: { 
            home: +700, 
            away: -1100,
            pick: "BOS"
          }
        }
      },
      homeForm: ["L", "L", "L", "L", "W"],
      awayForm: ["W", "W", "W", "W", "L"]
    }
  ];

  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayedGames, setDisplayedGames] = useState(activeGames);
  const scrollRef = useRef(null);
  const dateScrollRef = useRef(null);
  const lastSevenDays = getLastSevenDays();
  const [selectedSportsbook, setSelectedSportsbook] = useState('draftkings');

  // Function to get games based on selected date
  const getGamesByDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const fourDaysAgo = new Date(today);
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    // Compare dates without time
    const isSameDay = (date1, date2) => {
      return date1.getDate() === date2.getDate() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getFullYear() === date2.getFullYear();
    };

    if (isSameDay(date, today)) return activeGames;
    if (isSameDay(date, yesterday)) return yesterdayGames;
    if (isSameDay(date, twoDaysAgo)) return twoDaysAgoGames;
    if (isSameDay(date, threeDaysAgo)) return threeDaysAgoGames;
    if (isSameDay(date, fourDaysAgo)) return fourDaysAgoGames;
    if (isSameDay(date, fiveDaysAgo)) return fiveDaysAgoGames;
    if (isSameDay(date, sixDaysAgo)) return sixDaysAgoGames;
    
    return []; // Return empty array if no games found for the date
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date.fullDate);
    setDisplayedGames(getGamesByDate(date.fullDate));
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

  // Add this before the betting information grid
  const renderSportsbookSelector = () => (
    <ButtonGroup spacing={4} mb={3} justifyContent="center" width="full">
      {Object.entries(SPORTSBOOKS).map(([key, book]) => {
        // Create a mapping for the sportsbook keys to match the data structure
        const keyMapping = {
          DRAFTKINGS: 'draftkings',
          FANDUEL: 'fanduel',
          ESPNBET: 'espnBet'
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
                  ) : game.isDone ? (
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
              {(selectedGame.isLive || selectedGame.isDone) && (
                <Text color="yellow.400" fontSize="2xl" fontWeight="bold">{selectedGame.homeScore}</Text>
              )}
              <HStack justify="flex-end" w="full">
                {renderForm(selectedGame.homeForm)}
              </HStack>
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
                  <Text color="white" fontWeight="bold">{getSelectedOdds(selectedGame).total.overOdds}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Flex align="center">
                    <Text color="white" mr={2}>Under {getSelectedOdds(selectedGame).total.value}</Text>
                    {getSelectedOdds(selectedGame).total.pick === "UNDER" && (
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
                  <Text color="white" fontWeight="bold">{getSelectedOdds(selectedGame).total.underOdds}</Text>
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
