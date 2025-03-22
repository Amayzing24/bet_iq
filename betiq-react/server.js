import express from 'express'
import { join } from 'path'
import axios from 'axios'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(join(process.cwd(), 'dist')))

app.get('/api/news', async (req, res) => {
  try {
    const API_KEY = "25525051b0d1bac5fd19f9da79a161b3"
    
    const { q, sortBy, language, pageSize } = req.query

    const today = new Date()
    const fromDate = new Date()
    fromDate.setMonth(today.getMonth() - 3) 
    
    const response = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: q || 'NBA basketball', 
        lang: language || 'en',    
        max: pageSize || 10,       
        from: fromDate.toISOString(),
        to: today.toISOString(),
        sortby: sortBy || 'publishedAt',
        apikey: API_KEY
      }
    })
    
    const transformedResponse = {
      status: 'ok',
      totalResults: response.data.totalArticles,
      articles: response.data.articles.map(article => ({
        source: { 
          id: null, 
          name: article.source?.name || 'GNews' 
        },
        author: article.source?.name,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.image,
        publishedAt: article.publishedAt,
        content: article.content
      }))
    }
    
    // Send the transformed response back to the client
    res.json(transformedResponse)
  } catch (error) {
    console.error('News API proxy error:', error.message)
    
    // Send appropriate error response
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: error.response?.data?.message || 'Failed to fetch news data'
    })
  }
})

// Catch all route for SPA
app.get('*', (req, res) => {
  res.sendFile(join(process.cwd(), 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
  console.log(`News API available at http://localhost:${PORT}/api/news`)
})
