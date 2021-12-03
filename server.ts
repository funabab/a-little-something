import express, { NextFunction, Request, Response } from 'express'
import router from './routes/news'
import { ServerError } from './types'

const PORT = process.env.PORT || 5000
const app = express()

app.set('x-powered-by', false)
app.use(express.json())

app.use('/api/news', router)

app.use((req, res, next: NextFunction) => {
  const error: ServerError = new Error('Not found')
  error.statusCode = 404
  next(error)
})
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const err = error as ServerError
  console.log(err)
  res.status(err.statusCode || 500).json({
    error: err.errors || err.message,
  })
})

app.listen(PORT, () => console.log('server started on port: %d', PORT))
