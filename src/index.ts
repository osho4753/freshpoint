import express from 'express'
import predictRouter from './routes/router'

const app = express()

app.use(express.json())
app.use('/', predictRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
