import express from 'express'
import { join } from 'path'
const app = express()
const PORT = 3000
app.use(express.static(join(process.cwd(), 'dist')))
app.get('*', (req, res) => {
  res.sendFile(join(process.cwd(), 'dist', 'index.html'))
})
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
