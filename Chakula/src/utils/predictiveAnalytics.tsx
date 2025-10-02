import React from 'react';
export interface DataPoint {
  date: string;
  value: number;
}
export interface ForecastResult {
  forecast: DataPoint[];
  confidence: number;
  recommendation: string;
}
export const runMovingAverageForecast = (historicalData: DataPoint[]): ForecastResult => {
  if (!historicalData || historicalData.length < 7) {
    return {
      forecast: [],
      confidence: 0,
      recommendation: 'Insufficient data for forecasting'
    };
  }
  const windowSize = 7;
  const last7Days = historicalData.slice(-windowSize);
  const average = last7Days.reduce((sum, point) => sum + point.value, 0) / windowSize;
  const variance = last7Days.reduce((sum, point) => {
    return sum + Math.pow(point.value - average, 2);
  }, 0) / windowSize;
  const stdDev = Math.sqrt(variance);
  const volatility = stdDev / average;
  const confidenceScore = Math.max(0, Math.min(100, 100 * (1 - volatility)));
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  const forecast: DataPoint[] = [];
  for (let i = 1; i <= 7; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(lastDate.getDate() + i);
    const dayOfWeek = forecastDate.getDay();
    const historicalSameDays = historicalData.filter(point => new Date(point.date).getDay() === dayOfWeek);
    let forecastValue = average;
    if (historicalSameDays.length > 0) {
      forecastValue = historicalSameDays.reduce((sum, point) => sum + point.value, 0) / historicalSameDays.length;
    }
    const randomVariation = (Math.random() - 0.5) * 0.1 * forecastValue;
    forecastValue += randomVariation;
    forecast.push({
      date: forecastDate.toISOString(),
      value: Math.round(forecastValue)
    });
  }
  let recommendation = '';
  const trendingUp = forecast[6].value > forecast[0].value;
  const percentChange = Math.abs((forecast[6].value - forecast[0].value) / forecast[0].value * 100);
  if (trendingUp && percentChange > 15) {
    recommendation = `Prepare for ${Math.round(percentChange)}% higher demand next week. Consider increasing inventory.`;
  } else if (!trendingUp && percentChange > 15) {
    recommendation = `Prepare ${Math.round(percentChange)}% fewer perishable items next week to reduce potential waste.`;
  } else {
    recommendation = 'Demand is expected to remain stable. Maintain current inventory levels.';
  }
  return {
    forecast,
    confidence: Math.round(confidenceScore),
    recommendation
  };
};
export const generateDemoData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 180);
  for (let i = 0; i < 180; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dayOfWeek = currentDate.getDay();
    let baseValue = 100;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      baseValue = 150;
    } else if (dayOfWeek === 5) {
      baseValue = 130;
    }
    const monthFactor = 1 + 0.2 * Math.sin(2 * Math.PI * i / 30);
    const randomFactor = 0.8 + Math.random() * 0.4;
    const value = Math.round(baseValue * monthFactor * randomFactor);
    data.push({
      date: currentDate.toISOString(),
      value
    });
  }
  return data;
};
export const parseCsvData = (csvContent: string): DataPoint[] => {
  const lines = csvContent.trim().split('\n');
  const data: DataPoint[] = [];
  for (let i = 1; i < lines.length; i++) {
    const [dateStr, valueStr] = lines[i].split(',');
    const value = parseFloat(valueStr);
    if (!isNaN(value)) {
      data.push({
        date: new Date(dateStr).toISOString(),
        value
      });
    }
  }
  return data;
};