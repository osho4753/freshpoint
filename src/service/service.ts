import { Param, DataPoint, ModelConfig } from '../types/types'

export function predictDemand(data: DataPoint[], params: Param[]): DataPoint[] {
  const changepointPriorScale =
    params.find((param) => param.name === 'changepoint_prior_scale')?.value || 1

  const changepointRange =
    params.find((param) => param.name === 'changepoint_range')?.value || 1

  const intervalWidth =
    params.find((param) => param.name === 'interval_width')?.value || 0

  //This is where we determine how much time of everything we will analyze.
  const dataLength = data.length
  const rangeSize = Math.floor(dataLength * changepointRange)
  const recentData = data.slice(0, rangeSize)

  const config = {
    changepointPriorScale,
    forecastWeeks: 10,
    recentData,
    intervalWidth,
  }

  return performPrediction(config, data)
}

function performPrediction(
  config: ModelConfig,
  data: DataPoint[]
): DataPoint[] {
  const forecastWeeks = config.forecastWeeks
  const changepointPriorScale = config.changepointPriorScale
  const intervalWidth = config.intervalWidth
  const newData = config.recentData

  const sales = newData.map((item) => item.value)
  const timestamps = data.map((item) => item.timestamp)

  const { minSale, trendSlope } = trendFind(sales)

  //Here we apply sensitivity to the trend if it is not set, it is equal to 1
  //which does not affect the result. The same for the intervalWidth
  const adjustedSlope = trendSlope * changepointPriorScale * (1 - intervalWidth)

  const predictions: DataPoint[] = []

  let lastValue = sales[sales.length - 1]

  for (let i = 1; i <= forecastWeeks; i++) {
    const nextTimestamp = new Date(timestamps[timestamps.length - 1])
    nextTimestamp.setDate(nextTimestamp.getDate() + i * 7)

    /** 
      we will find predictable sales using the formula y=a+bx
      where y is the volume of sales so what we find
      a is the minimum sales for the period
      b is the slope factor of the trend
      x is the numbering of the week by the index
    */
    const forecastValue = Math.floor(
      minSale + adjustedSlope * (sales.length + i)
    )

    predictions.push({
      timestamp: nextTimestamp.toISOString(),
      value: forecastValue,
    })

    lastValue = forecastValue
  }

  return predictions
}

function trendFind(data: number[]): {
  minSale: number
  trendSlope: number
} {
  const weeks = data.length
  const averageVal = data.reduce((sum, val) => sum + val, 0) / weeks
  const averageIdx = (weeks * (weeks + 1)) / 2 / weeks

  let arr1 = []
  let arr2 = []
  let numerator = 0
  let denominator = 0

  /**
    Here we use the formula to find the slope factor and the minimum sales for further use
    where to find slope factor we need to ∑(x[i]-averageIdx)(y[i]-averageVal)/∑(x[i]-averageIdx)^2
  */
  for (let i = 1; i <= weeks; i++) {
    const resultWeek = (i - averageIdx) * (data[i - 1] - averageVal)
    arr1.push(resultWeek)

    numerator = arr1.reduce((sum, val) => sum + val)

    const resultVal = (i - averageIdx) ** 2
    arr2.push(resultVal)

    denominator = arr2.reduce((sum, val) => sum + val)
  }
  const trendSlope = numerator / denominator

  //and here to find easy to say minimum sales we need to averageVal - (slopeFactor * averageIdx)

  const minSale = averageVal - trendSlope * averageIdx
  return { minSale, trendSlope }
}
