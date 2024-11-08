import { DataPoint, Param } from '../types/types'
// Helper function to validate Date
export function isValidDate(date: string): boolean {
  const parsedDate = Date.parse(date)
  return !isNaN(parsedDate)
}

// Helper function to validate params
export function areValidParams(params: Param[]): boolean {
  return params.every(
    (param) =>
      param.name && typeof param.name === 'string' && param.value !== undefined
  )
}

// Helper function to validate data points
export function areValidDataPoints(data: DataPoint[]): boolean {
  return (
    data.length > 0 &&
    data.every(
      (point) =>
        point.timestamp &&
        isValidDate(point.timestamp) &&
        typeof point.value === 'number'
    )
  )
}
