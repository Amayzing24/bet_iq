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
  Input,
  IconButton,
  InputGroup,
  InputRightElement,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("NBA basketball");
  const [inputQuery, setInputQuery] = useState("NBA basketball");
  const [displayCount, setDisplayCount] = useState(12);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    fetchNews();
  }, [searchQuery]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching news for:", searchQuery);

      // Format date for six months ago to maximize article availability
      const today = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 6);
      const formattedDate = sixMonthsAgo.toISOString().split('T')[0];

      // Enhanced search query with NBA-related terms
      const enhancedQuery = searchQuery.toLowerCase().includes('nba')
        ? searchQuery
        : `${searchQuery} NBA basketball`;

      // Define API base URL - adjust if needed based on your environment
      const apiBaseUrl = process.env.NODE_ENV === 'production'
        ? '' // Empty string for same-origin requests in production
        : 'http://localhost:3000'; // Development server

      // Use our backend API endpoint
      const response = await axios.get(`${apiBaseUrl}/api/news`, {
        params: {
          q: enhancedQuery,
          from: formattedDate,
          sortBy: 'publishedAt',
          language: 'en',
          pageSize: 100 // Maximum articles allowed by the API
        },
        timeout: 10000 // 10 second timeout
      });

      console.log(`API response - status: ${response.data.status}, found ${response.data?.articles?.length || 0} articles`);

      // Check if we got a successful response
      if (response.data.status === 'ok') {
        if (response.data.articles && response.data.articles.length > 0) {
          // Filter for higher quality NBA-related content
          const relevantArticles = response.data.articles.filter(article => {
            // Skip articles without images
            if (!article.urlToImage) return false;

            const text = [
              article.title || '',
              article.description || '',
              article.content || ''
            ].join(' ').toLowerCase();

            // Look for basketball/NBA terms in the content
            return text.includes('nba') ||
              text.includes('basketball') ||
              text.includes('game') ||
              text.includes('player') ||
              text.includes('team') ||
              text.includes('league') ||
              text.includes('score');
          });

          console.log(`Found ${relevantArticles.length} relevant NBA articles out of ${response.data.articles.length} total`);
          setNews(relevantArticles);
          setError(null);
        } else {
          console.log("No articles found");
          setNews([]);
        }
      } else {
        const errorMessage = `API Error: ${response.data.message || 'Unknown error'}`;
        console.error(errorMessage, response.data);
        setError(errorMessage);
        setNews([]); // Set news to empty array on API error
      }

      setLoading(false);
    } catch (err) {
      const errorMessage = `Failed to fetch news: ${err.message}`;
      console.error(errorMessage, err);
      setError(errorMessage);
      setNews([]); // Set news to empty array on fetch error
      setLoading(false);
    }
  };


  const handleSearch = () => {
    setSearchQuery(inputQuery);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 6);
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

    // Generate a placeholder image with the article source
    const sourceName = article.source?.name || "News";
    return `https://placehold.co/600x400/teal/white?text=${encodeURIComponent(sourceName)}`;
  };

  // Format the publish date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return "Invalid date";
    }
  };

  if (error) {
    return (
      <Box>
        <Alert status="error" borderRadius="md" mt={5} mb={4}>
          <AlertIcon />
          <VStack align="start" spacing={2} flex="1">
            <AlertTitle fontSize="lg">Error Loading NBA News</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </VStack>
          <Button colorScheme="teal" ml={4} onClick={fetchNews}>
            Try Again
          </Button>
        </Alert>
      </Box>
    );
  }

  // Slice the news array according to display count
  const visibleNews = news.slice(0, displayCount);
  const hasMoreToShow = news.length > visibleNews.length;

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading
          as="h1"
          size="xl"
          bgGradient="linear(to-r, teal.300, blue.500)"
          bgClip="text"
        >
          NBA News
        </Heading>
        <Button
          colorScheme="teal"
          onClick={fetchNews}
          isLoading={loading}
          loadingText="Refreshing"
        >
          Refresh News
        </Button>
      </Flex>

      <InputGroup mb={6}>
        <Input
          placeholder="Search NBA news (e.g. Lakers, Celtics, playoffs)"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          size="lg"
          borderRadius="md"
        />
        <InputRightElement height="100%">
          <IconButton
            aria-label="Search"
            icon={<SearchIcon />}
            colorScheme="teal"
            onClick={handleSearch}
            size="lg"
          />
        </InputRightElement>
      </InputGroup>

      <Flex mb={6} wrap="wrap" gap={2}>
        <Text fontWeight="bold" alignSelf="center" mr={1}>Quick Search:</Text>
        {['NBA Playoffs', 'NBA Draft', 'NBA Trades', 'NBA Injuries', 'Lakers', 'Celtics'].map((term) => (
          <Button
            key={term}
            size="sm"
            colorScheme="teal"
            variant="outline"
            onClick={() => {
              setInputQuery(term);
              setSearchQuery(term);
            }}
          >
            {term}
          </Button>
        ))}
      </Flex>

      {news.length > 0 && (
        <Text mb={4} fontSize="md">
          Showing {visibleNews.length} of {news.length} articles
        </Text>
      )}

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        gap={6}
      >
        {loading ? (
          // Skeleton loaders while loading
          Array(6).fill().map((_, i) => (
            <GridItem key={i}>
              <Box
                p={5}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                borderColor={borderColor}
                bg={cardBg}
                transition="transform 0.3s"
                _hover={{ transform: "translateY(-5px)" }}
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
          ))
        ) : news.length === 0 ? (
          <GridItem colSpan={{ base: 1, md: 2, lg: 3 }}>
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <VStack align="start" spacing={2} flex="1">
                <AlertTitle>No news articles found</AlertTitle>
                <AlertDescription>
                  No results found for "{searchQuery}". Please try a different search term.
                </AlertDescription>
              </VStack>
            </Alert>
          </GridItem>
        ) : (
          visibleNews.map((article, index) => (
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
          ))
        )}
      </Grid>

      {hasMoreToShow && !loading && news.length > 0 && ( // Conditionally render "Load More" button
        <Flex justifyContent="center" mt={8}>
          <Button
            onClick={loadMore}
            colorScheme="teal"
            size="lg"
            width={{ base: "full", md: "auto" }}
          >
            Load More Articles
          </Button>
        </Flex>
      )}

      <Divider my={8} />

      <Text fontSize="sm" color="gray.500" mb={4}>
        News data powered by NewsAPI.org
      </Text>
    </Box>
  );
};

export default NewsPage;