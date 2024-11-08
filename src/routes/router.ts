import express, { Request, Response } from 'express'
import { Param, DataPoint } from '../types/types'
import { predictDemand } from '../service/service'
import { areValidDataPoints, areValidParams } from '../validation/validation'

const router = express.Router()

let lastPrediction: {
  params: Param[]
  data: DataPoint[]
  timestamp: string
} | null = null

router.post('/predict', (req: Request, res: Response) => {
  const { params, data } = req.body as {
    params: Param[]
    data: DataPoint[]
  }
  if (!Array.isArray(params) || !areValidParams(params)) {
    res
      .status(400)
      .json({ error: 'Invalid or missing parameters in request body' })
  }

  if (!Array.isArray(data) || !areValidDataPoints(data)) {
    res
      .status(400)
      .json({ error: 'Invalid or missing data points in request body' })
  }
  const predictions = predictDemand(data, params)
  lastPrediction = {
    params,
    timestamp: new Date().toISOString(),
    data: predictions,
  }
  res.json({ data, predictions })
})

router.get('/prediction', (req: Request, res: Response) => {
  if (!lastPrediction) {
    res.status(404).json({ error: 'Prediction not found' })
  } else {
    res.json(lastPrediction)
  }
})

export default router
