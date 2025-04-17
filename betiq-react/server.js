import express from 'express'
import { join } from 'path'
import axios from 'axios'
import cors from 'cors'
import * as stringSimilarity from 'string-similarity'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(join(process.cwd(), 'dist')))

// Existing News API endpoint
app.get('/api/news', async (req, res) => {
  const GNEWS_API_KEY = "19c4ce7a36a47f94c7c56b4c092e405c";
  const NEWSAPI_API_KEY = "07d5f93f8803488390bec2bb6bf23b8d"; // Your NewsAPI.org key
  const NEWSAPI_ENDPOINT = "https://newsapi.org/v2/everything";
  const GNEWS_ENDPOINT = "https://gnews.io/api/v4/search";

  try {
    const { q, sortBy, language, pageSize } = req.query;

    let apiResponse;
    let transformedResponse;
    const finalArticles = [];

    // Helper function to format date as YYYY-MM-DD for NewsAPI
    const formatDateForNewsAPI = (date) => date.toISOString().slice(0, 10);

    // --- Logic for Game-Specific News (using NewsAPI.org) ---
    if (q) {
      // Attempt to parse team names from q (assuming format "Team1 Team2 basketball")
      const parts = q.split(' ');
      let queryForNewsAPI = q; // Default to original q if parsing fails
      if (parts.length >= 3) { // Check if we likely have two names and "basketball"
        const team1 = parts[0];
        const team2 = parts[1];
        // Construct advanced query
        queryForNewsAPI = `("${team1}" AND "${team2}") AND (preview OR vs OR matchup)`; 
        console.log(`Constructed advanced NewsAPI query: ${queryForNewsAPI}`);
      } else {
        console.log(`Could not parse team names from q: '${q}'. Using original q for NewsAPI.`);
      }
      
      const today = new Date();
      const fromDate = new Date();
      fromDate.setDate(today.getDate() - 5); // Last 5 days

      const newsApiParams = {
        q: queryForNewsAPI,
        from: formatDateForNewsAPI(fromDate),
        to: formatDateForNewsAPI(today),
        sortBy: sortBy || 'publishedAt', // Use 'publishedAt' for recency
        language: language || 'en',
        pageSize: parseInt(pageSize) || 10, // NewsAPI uses pageSize
        apiKey: NEWSAPI_API_KEY
      };

      console.log("--- NewsAPI.org Request Params ---");
      console.log(newsApiParams);
      console.log("---------------------------------");

      apiResponse = await axios.get(NEWSAPI_ENDPOINT, { params: newsApiParams });

      // Transform NewsAPI.org response
      transformedResponse = {
        status: 'ok',
        totalResults: apiResponse.data.totalResults,
        // Map NewsAPI fields to our standard format
        articles: apiResponse.data.articles.map(article => ({
          source: {
            id: article.source?.id || null,
            name: article.source?.name || 'NewsAPI.org'
          },
          author: article.author,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          content: article.content
        }))
      };

      console.log("--- Raw NewsAPI.org Article Dates ---");
      (transformedResponse.articles || []).slice(0, 5).forEach((article, index) => {
         console.log(`Raw Article ${index + 1} publishedAt: ${article.publishedAt}`);
      });
      console.log("------------------------------------");

    } 
    // --- Logic for General News (using GNews) ---
    else {
      const searchQuery = 'NBA basketball'; // Default query for general news
      const today = new Date();
      const fromDate = new Date();
      fromDate.setDate(today.getDate() - 5);

      const gnewsParams = {
        q: searchQuery,
        lang: language || 'en',
        max: parseInt(pageSize) || 10, // GNews uses max
        from: fromDate.toISOString(),
        to: today.toISOString(),
        sortby: sortBy || 'publishedAt',
        apikey: GNEWS_API_KEY
      };

      console.log("--- GNews API Request Params ---");
      console.log(gnewsParams);
      console.log("------------------------------");

      apiResponse = await axios.get(GNEWS_ENDPOINT, { params: gnewsParams });

      // Transform GNews response
      transformedResponse = {
        status: 'ok',
        totalResults: apiResponse.data.totalArticles,
        // Map GNews fields to our standard format
        articles: apiResponse.data.articles.map(article => ({
          source: {
            id: null,
            name: article.source?.name || 'GNews'
          },
          author: article.source?.name, // GNews puts source name in author sometimes
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.image, // GNews uses 'image'
          publishedAt: article.publishedAt,
          content: article.content
        }))
      };
      
      console.log("--- Raw GNews Article Dates ---");
       (transformedResponse.articles || []).slice(0, 5).forEach((article, index) => {
         console.log(`Raw Article ${index + 1} publishedAt: ${article.publishedAt}`);
      });
      console.log("-----------------------------");
    }

    // --- Deduplication (applied to whichever API was used) ---
    const uniqueArticles = [];
    const seenImageUrls = new Set();
    const SIMILARITY_THRESHOLD = 0.9;

    for (const article of transformedResponse.articles) {
      if (article.urlToImage && seenImageUrls.has(article.urlToImage)) {
        continue;
      }
      let isTitleSimilar = false;
      for (const uniqueArticle of uniqueArticles) {
        const similarity = stringSimilarity.compareTwoStrings(article.title || '', uniqueArticle.title || '');
        if (similarity >= SIMILARITY_THRESHOLD) {
          isTitleSimilar = true;
          break;
        }
      }
      if (!isTitleSimilar) {
        uniqueArticles.push(article);
        if (article.urlToImage) {
          seenImageUrls.add(article.urlToImage);
        }
      }
    }

    // Final response structure
    const finalResponse = {
      status: 'ok',
      totalResults: uniqueArticles.length,
      articles: uniqueArticles
    };
    
    console.log("--- Final Response Article Dates ---");
     (finalResponse.articles || []).slice(0, 5).forEach((article, index) => {
      console.log(`Final Article ${index + 1} publishedAt: ${article.publishedAt}`);
    });
    console.log("----------------------------------");

    res.json(finalResponse);

  } catch (error) {
    console.error('News API proxy error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: error.response?.data?.message || 'Failed to fetch news data'
    });
  }
});

// -----------------------
// New /api/games endpoint
// -----------------------

// Set your Odds API key and base URL here:
const ODDS_API_KEY = "b73b6585e5f33502745131b2785875c6"  // Replace with your actual key
const ODDS_BASE_URL = "https://api.the-odds-api.com/v4"

// Helper functions for parsing and transforming Odds API responses

function parseMoneyline(outcomes, homeTeam, awayTeam) {
  let moneyline = {}
  outcomes.forEach(outcome => {
    if (outcome.name && outcome.name.toLowerCase() === homeTeam.toLowerCase()) {
      moneyline.home = outcome.price
    } else if (outcome.name && outcome.name.toLowerCase() === awayTeam.toLowerCase()) {
      moneyline.away = outcome.price
    }
  })
  if (moneyline.home !== undefined && moneyline.away !== undefined) {
    moneyline.pick = (Math.abs(moneyline.home) < Math.abs(moneyline.away)) ? homeTeam : awayTeam
  }
  return moneyline
}

function parseSpread(outcomes, homeTeam, awayTeam) {
  let spread = {}
  outcomes.forEach(outcome => {
    if (outcome.name && outcome.name.toLowerCase() === homeTeam.toLowerCase()) {
      spread.home = { points: outcome.point, odds: outcome.price }
    } else if (outcome.name && outcome.name.toLowerCase() === awayTeam.toLowerCase()) {
      spread.away = { points: outcome.point, odds: outcome.price }
    }
  })
  if (spread.home && spread.away) {
    spread.pick = (Math.abs(spread.home.odds) < Math.abs(spread.away.odds)) ? homeTeam : awayTeam
  }
  return spread
}

function parseTotal(outcomes) {
  let total = {}
  outcomes.forEach(outcome => {
    if (outcome.name && outcome.name.toLowerCase() === "over") {
      total.overOdds = outcome.price
      total.value = outcome.point
    } else if (outcome.name && outcome.name.toLowerCase() === "under") {
      total.underOdds = outcome.price
      total.value = outcome.point
    }
  })
  if (total.overOdds !== undefined && total.underOdds !== undefined) {
    total.pick = (Math.abs(total.overOdds) < Math.abs(total.underOdds)) ? "OVER" : "UNDER"
  }
  return total
}

function parseOddsForEvent(bookmakers, homeTeam, awayTeam) {
  let odds = {}
  const desired = ["draftkings", "fanduel", "espnbet", "espn_bet"]
  bookmakers.forEach(bm => {
    const key = bm.key.toLowerCase()
    if (desired.includes(key)) {
      // Normalize ESPN keys to "espnBet"
      let standardized = (key === "espnbet" || key === "espn_bet") ? "espnBet" : key
      let marketData = {}
      ;(bm.markets || []).forEach(market => {
        if (market.key === "h2h") {
          marketData.moneyline = parseMoneyline(market.outcomes, homeTeam, awayTeam)
        } else if (market.key === "spreads") {
          marketData.spread = parseSpread(market.outcomes, homeTeam, awayTeam)
        } else if (market.key === "totals") {
          marketData.total = parseTotal(market.outcomes)
        }
      })
      if (Object.keys(marketData).length > 0) {
        odds[standardized] = marketData
      }
    }
  })
  return odds
}

// Transform a completed game (scores available) using historical odds.
async function transformCompletedGame(game, sport) {
  const homeTeam = game.home_team
  const awayTeam = game.away_team
  let homeScore = null, awayScore = null
  if (game.scores && Array.isArray(game.scores)) {
    game.scores.forEach(score => {
      if (score.name && score.name.toLowerCase() === homeTeam.toLowerCase()) {
        homeScore = score.score
      } else if (score.name && score.name.toLowerCase() === awayTeam.toLowerCase()) {
        awayScore = score.score
      }
    })
  }
  // For completed games, set time and quarter fixed.
  const timeStr = "FINAL"
  const quarter = "GAME OVER"
  const commenceTime = new Date(game.commence_time)
  const snapshot = commenceTime.toISOString()

  // Call historical odds endpoint
  const oddsResponse = await axios.get(`${ODDS_BASE_URL}/historical/sports/${sport}/odds`, {
    params: {
      apiKey: ODDS_API_KEY,
      regions: "us",
      markets: "h2h,spreads,totals",
      oddsFormat: "american",
      date: snapshot
    }
  })
  let odds = {}
  // Depending on your plan the response may be wrapped inside a "data" field.
  const events = oddsResponse.data.data || oddsResponse.data
  // Find the event matching the game id.
  const matching = events.find(e => e.id === game.id)
  if (matching) {
    odds = parseOddsForEvent(matching.bookmakers, homeTeam, awayTeam)
  }
  return {
    id: game.id,
    homeTeam: homeTeam,
    awayTeam: awayTeam,
    homeScore: homeScore,
    awayScore: awayScore,
    time: timeStr,
    quarter: quarter,
    isLive: false,
    isDone: true,
    odds: odds,
    homeForm: [],
    awayForm: []
  }
}

// Transform an upcoming (or live) game using the odds endpoint.
function transformUpcomingGame(event, sport) {
  const homeTeam = event.home_team
  const awayTeam = event.away_team
  return {
    id: event.id,
    homeTeam: homeTeam,
    awayTeam: awayTeam,
    homeScore: null,
    awayScore: null,
    time: event.commence_time,
    quarter: "",
    isLive: false,
    isDone: false,
    odds: parseOddsForEvent(event.bookmakers, homeTeam, awayTeam),
    homeForm: [],
    awayForm: []
  }
}

// Main /api/games endpoint
app.get('/api/games', async (req, res) => {
  try {
    const sport = req.query.sport || 'basketball_nba'
    const dateStr = req.query.date // expected in YYYY-MM-DD format
    const today = new Date()
    const todayStr = today.toISOString().slice(0, 10)

    // Helper: compare two dates (YYYY-MM-DD)
    function isSameDay(d1, d2) {
      return d1.toISOString().slice(0,10) === d2.toISOString().slice(0,10)
    }

    if (dateStr) {
      const queryDate = new Date(dateStr)
      const queryDateStr = queryDate.toISOString().slice(0,10)
      if (queryDateStr > todayStr) {
        return res.status(400).json({ error: "Future dates are not supported." })
      }
      if (queryDateStr === todayStr) {
        // Today's games: use the odds endpoint.
        const oddsResponse = await axios.get(`${ODDS_BASE_URL}/sports/${sport}/odds`, {
          params: {
            apiKey: ODDS_API_KEY,
            regions: "us",
            markets: "h2h,spreads,totals",
            oddsFormat: "american"
          }
        })
        const events = oddsResponse.data
        // Transform each event
        const transformedGames = events.map(event => transformUpcomingGame(event, sport))
        // If any transformation returns a Promise (if asynchronous processing was needed),
        // you could use Promise.all(transformedGames) here.
        return res.json({ date: todayStr, games: transformedGames })
      } else {
        // Past date: must be within the past 7 days.
        const diffMs = today - queryDate
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        if (diffDays > 7) {
          return res.status(400).json({ error: "Date must be within the past 7 days." })
        }
        // Use the scores endpoint to get completed games.
        const scoresResponse = await axios.get(`${ODDS_BASE_URL}/sports/${sport}/scores`, {
          params: {
            apiKey: ODDS_API_KEY,
            daysFrom: diffDays,
            dateFormat: "iso"
          }
        })
        const scores = scoresResponse.data
        // Filter games matching the requested date.
        const filteredGames = scores.filter(game => {
          const gameDateStr = new Date(game.commence_time).toISOString().slice(0,10)
          return gameDateStr === queryDateStr
        })
        // Transform each game (awaiting asynchronous calls for historical odds)
        const transformedGames = await Promise.all(filteredGames.map(game => transformCompletedGame(game, sport)))
        return res.json({ date: queryDateStr, games: transformedGames })
      }
    } else {
      // No date provided: return a grouped response.
      // Today's games:
      const oddsResponse = await axios.get(`${ODDS_BASE_URL}/sports/${sport}/odds`, {
        params: {
          apiKey: ODDS_API_KEY,
          regions: "us",
          markets: "h2h,spreads,totals",
          oddsFormat: "american"
        }
      })
      const todayGames = oddsResponse.data.map(event => transformUpcomingGame(event, sport))
      
      // Past 7 days scores:
      const scoresResponse = await axios.get(`${ODDS_BASE_URL}/sports/${sport}/scores`, {
        params: {
          apiKey: ODDS_API_KEY,
          daysFrom: 7,
          dateFormat: "iso"
        }
      })
      const scores = scoresResponse.data
      const grouped = {}
      scores.forEach(game => {
        const gameDate = new Date(game.commence_time)
        const gameDateStr = gameDate.toISOString().slice(0,10)
        if (gameDateStr !== todayStr) {
          const diff = Math.floor((today - gameDate) / (1000 * 60 * 60 * 24))
          grouped[diff] = grouped[diff] || []
          grouped[diff].push(game)
        }
      })
      const diffKeyMap = {
        1: "yesterday",
        2: "twoDaysAgo",
        3: "threeDaysAgo",
        4: "fourDaysAgo",
        5: "fiveDaysAgo",
        6: "sixDaysAgo",
        7: "sevenDaysAgo"
      }
      let responseData = { today: todayGames }
      for (const diff in grouped) {
        const key = diffKeyMap[diff] || `${diff}DaysAgo`
        const transformed = await Promise.all(grouped[diff].map(game => transformCompletedGame(game, sport)))
        responseData[key] = transformed
      }
      return res.json(responseData)
    }
  } catch (error) {
    console.error("Error in /api/games:", error.message)
    res.status(500).json({ error: "Failed to fetch games data" })
  }
})

// Catch all route for SPA
app.get('*', (req, res) => {
  res.sendFile(join(process.cwd(), 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
  console.log(`News API available at http://localhost:${PORT}/api/news`)
  console.log(`Games API available at http://localhost:${PORT}/api/games`)
})
