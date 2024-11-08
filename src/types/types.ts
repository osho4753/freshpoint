export interface DataPoint {
  value: number
  timestamp: string
}

export interface Param {
  name: string
  value: number
}

export interface ModelConfig {
  changepointPriorScale: number
  forecastWeeks: number
  recentData: DataPoint[]
  intervalWidth: number
}
