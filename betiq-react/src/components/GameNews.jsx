import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Image,
  Flex,
  Link,
  Badge,
  Skeleton,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  VStack,
} from "@chakra-ui/react";

const GameNews = ({ homeTeam, awayTeam }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(3);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const headingGradient = "linear(to-r, teal.400, blue.500)";

  // Extract team names to create search query (removing city names if present)
  const getTeamName = (fullTeamName) => {
    if (!fullTeamName) return "";
    
    // Extract team name from "CityName TeamName" format
    const parts = fullTeamName.split(" ");
    if (parts.length >= 2) {
      // If format is like "LAL Lakers" or "GSW Warriors", return just the team name
      return parts[parts.length - 1]; 
    }
    return fullTeamName;
  };

  const homeTeamName = getTeamName(homeTeam);
  const awayTeamName = getTeamName(awayTeam);

  useEffect(() => {
    fetchNews();
  }, [homeTeam, awayTeam]);

  const fetchNews = async () => {
    if (!homeTeam || !awayTeam) return;
    
    setLoading(true);
    setError(null);

    try {
      // Create a search query for this matchup
      const searchQuery = `${homeTeamName} ${awayTeamName} basketball`;
      console.log("Fetching news for matchup:", searchQuery);

      // Define API base URL - adjust if needed based on your environment
      const apiBaseUrl = process.env.NODE_ENV === 'production'
        ? '' // Empty string for same-origin requests in production
        : 'http://localhost:3000'; // Development server

      // Use our backend API endpoint
      const response = await axios.get(`${apiBaseUrl}/api/news`, {
        params: {
          q: searchQuery,
          language: 'en',
          pageSize: 10 // Limit to 10 articles
        },
        timeout: 10000 // 10 second timeout
      });

      if (response.data.status === 'ok') {
        if (response.data.articles && response.data.articles.length > 0) {
          // Filter for articles with images and relevant content
          const relevantArticles = response.data.articles.filter(article => {
            // Skip articles without images
            if (!article.urlToImage) return false;

            const text = [
              article.title || '',
              article.description || '',
              article.content || ''
            ].join(' ').toLowerCase();

            // Look for team names in the content
            return text.includes(homeTeamName.toLowerCase()) || 
                   text.includes(awayTeamName.toLowerCase());
          });

          console.log(`Found ${relevantArticles.length} relevant articles for ${homeTeamName} vs ${awayTeamName}`);
          setNews(relevantArticles);
        } else {
          console.log("No articles found for this matchup");
          setNews([]);
        }
      } else {
        setError(`API Error: ${response.data.message || 'Unknown error'}`);
        setNews([]);
      }

      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch news: ${err.message}`);
      setNews([]);
      setLoading(false);
    }
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 3);
  };

  // Function to get a source-specific logo
  const getSourceLogo = (source) => {
    const sourceName = source?.name || "";

    const logos = {
      "ESPN": "https://a.espncdn.com/combiner/i?img=/i/espn/teamlogos/lrg/trans/espn_dotcom_black.png",
      "NBA.com": "https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg",
      "The Athletic": "https://theathletic.com/static-assets/images/athletic-lettermark-red.svg",
      "Bleacher Report": "https://www.logo.wine/a/logo/Bleacher_Report/Bleacher_Report-Logo.wine.svg",
      "CBS Sports": "https://sportsfly.cbsistatic.com/fly-0411/bundles/sportsmediacss/images/core/cbssports-logo-recirc-white.svg",
      "Yahoo Sports": "https://s.yimg.com/ny/api/res/1.2/2p2kQDjtI_xmCiQiOYfUiw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTI3MA--/https://media.zenfs.com/en/hoops_hype_usa_today_sports_articles_974/d5a6739fe778e6760714e13ac078eb39",
      "The Ringer": "https://cdn.vox-cdn.com/uploads/chorus_asset/file/16278797/TheRinger.0.1552655165.png",
      "Sports Illustrated": "https://www.si.com/.image/t_share/MTY4MTkyMjczODM4OTc0ODQ5/silogo.jpg"
    };

    // Look for partial matches in source names
    for (const [key, url] of Object.entries(logos)) {
      if (sourceName.toLowerCase().includes(key.toLowerCase())) {
        return url;
      }
    }

    // Default fallback logo
    return "https://placehold.co/100x50/teal/white?text=News";
  };

  // Function to get a fallback image if the article image is missing or invalid
  const getImageUrl = (article) => {
    if (article.urlToImage && article.urlToImage.startsWith('http')) {
      return article.urlToImage;
    }

    // Generate a placeholder image
    return `https://placehold.co/600x400/teal/white?text=${encodeURIComponent(homeTeamName + " vs " + awayTeamName)}`;
  };

  // Format the publish date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return "Invalid date";
    }
  };

  // Slice the news array according to display count
  const visibleNews = news.slice(0, displayCount);
  const hasMoreToShow = news.length > visibleNews.length;

  return (
    <Box 
      bg={bgColor} 
      borderRadius="xl" 
      p={6} 
      mb={8} 
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading
          as="h2"
          size="lg"
          bgGradient={headingGradient}
          bgClip="text"
        >
          {homeTeamName} vs {awayTeamName} News
        </Heading>
        <Button
          colorScheme="teal"
          size="sm"
          onClick={fetchNews}
          isLoading={loading}
          loadingText="Refreshing"
        >
          Refresh
        </Button>
      </Flex>

      {error && (
        <Alert status="error" borderRadius="md" mb={4}>
          <AlertIcon />
          <VStack align="start" spacing={2} flex="1">
            <AlertTitle fontSize="md">Error Loading News</AlertTitle>
            <AlertDescription fontSize="sm">{error}</AlertDescription>
          </VStack>
          <Button colorScheme="teal" size="sm" ml={4} onClick={fetchNews}>
            Try Again
          </Button>
        </Alert>
      )}

      {loading ? (
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={6}
        >
          {Array(3).fill().map((_, i) => (
            <GridItem key={i}>
              <Box
                p={5}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                borderColor={borderColor}
                bg={cardBg}
                transition="transform 0.3s"
                h="full"
              >
                <Skeleton height="40px" mb={4} />
                <Skeleton height="200px" mb={4} />
                <Skeleton height="24px" mb={3} width="80%" />
                <Skeleton height="16px" mb={3} />
                <Skeleton height="16px" mb={3} />
                <Skeleton height="16px" width="60%" />
              </Box>
            </GridItem>
          ))}
        </Grid>
      ) : news.length === 0 ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={2} flex="1">
            <AlertTitle>No news found</AlertTitle>
            <AlertDescription>
              No recent news articles found for this matchup.
            </AlertDescription>
          </VStack>
        </Alert>
      ) : (
        <>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={6}
          >
            {visibleNews.map((article, index) => (
              <GridItem key={index}>
                <Box
                  p={5}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  borderColor={borderColor}
                  bg={cardBg}
                  transition="transform 0.3s, box-shadow 0.3s"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "xl"
                  }}
                  h="full"
                  display="flex"
                  flexDirection="column"
                >
                  <Flex mb={4} h="40px" alignItems="center">
                    <Image
                      src={getSourceLogo(article.source)}
                      alt={article.source?.name || "News Source"}
                      maxH="40px"
                      maxW="120px"
                      mr={2}
                      objectFit="contain"
                      fallbackSrc="https://placehold.co/100x50/teal/white?text=News"
                    />
                    <Badge colorScheme="teal" ml="auto">
                      {article.source?.name || "News"}
                    </Badge>
                  </Flex>

                  <Image
                    src={getImageUrl(article)}
                    alt={article.title || "News article"}
                    borderRadius="md"
                    height="200px"
                    objectFit="cover"
                    mb={4}
                    fallbackSrc="https://placehold.co/600x400/teal/white?text=NBA+News"
                  />

                  <Heading as="h3" size="md" mb={2}>
                    {article.title || "Untitled Article"}
                  </Heading>

                  <Text fontSize="sm" mb={4} flex="1">
                    {article.description || "No description available"}
                  </Text>

                  <Flex justifyContent="space-between" alignItems="center" mt="auto">
                    <Text fontSize="xs" color="gray.500">
                      {formatDate(article.publishedAt)}
                    </Text>
                    <Link
                      href={article.url}
                      isExternal
                      color="teal.500"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      Read More
                    </Link>
                  </Flex>
                </Box>
              </GridItem>
            ))}
          </Grid>

          {hasMoreToShow && (
            <Flex justifyContent="center" mt={6}>
              <Button
                onClick={loadMore}
                colorScheme="teal"
                size="md"
                variant="outline"
              >
                Load More Articles
              </Button>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

export default GameNews; 