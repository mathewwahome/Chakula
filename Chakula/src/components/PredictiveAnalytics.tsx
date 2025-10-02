import React, { useState, useRef } from 'react';
import { runMovingAverageForecast, generateDemoData, parseCsvData, DataPoint, ForecastResult } from '../utils/predictiveAnalytics';
import { UploadIcon, TrendingUpIcon } from 'lucide-react';
import { formatDate } from '../utils/formatters';
const PredictiveAnalytics: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<DataPoint[] | null>(null);
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleDemoData = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const demoData = generateDemoData();
      setData(demoData);
      const result = runMovingAverageForecast(demoData);
      setForecast(result);
      setIsProcessing(false);
    }, 1000);
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    const reader = new FileReader();
    reader.onprogress = event => {
      if (event.lengthComputable) {
        const progress = Math.round(event.loaded / event.total * 100);
        setUploadProgress(progress);
      }
    };
    reader.onload = event => {
      setIsUploading(false);
      setIsProcessing(true);
      setTimeout(() => {
        const csvContent = event.target?.result as string;
        const parsedData = parseCsvData(csvContent);
        setData(parsedData);
        const result = runMovingAverageForecast(parsedData);
        setForecast(result);
        setIsProcessing(false);
      }, 1500);
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('Error reading file');
    };
    reader.readAsText(file);
  };
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  const renderChart = () => {
    if (!data || !forecast) return null;
    const allData = [...data.slice(-14), ...forecast.forecast];
    const maxValue = Math.max(...allData.map(d => d.value)) * 1.2;
    const getY = (value: number) => {
      return 100 - value / maxValue * 100;
    };
    const getX = (index: number, totalPoints: number) => {
      return index / (totalPoints - 1) * 100;
    };
    const historicalPoints = data.slice(-14).map((point, index) => {
      const x = getX(index, data.slice(-14).length + forecast.forecast.length);
      const y = getY(point.value);
      return `${x},${y}`;
    }).join(' ');
    const forecastPoints = forecast.forecast.map((point, index) => {
      const x = getX(index + data.slice(-14).length, data.slice(-14).length + forecast.forecast.length);
      const y = getY(point.value);
      return `${x},${y}`;
    }).join(' ');
    return <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">7-Day Forecast</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="relative h-64 w-full">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline points={historicalPoints} fill="none" stroke="#00233c" strokeWidth="2" />
              <polyline points={forecastPoints} fill="none" stroke="#8ac826" strokeWidth="2" strokeDasharray="4" />
            </svg>
            <div className="absolute bottom-0 left-0 w-full border-t border-gray-200"></div>
            <div className="absolute left-0 top-0 h-full border-r border-gray-200"></div>
            <div className="absolute bottom-0 left-0 text-xs text-gray-500">
              Historical
            </div>
            <div className="absolute bottom-0 right-0 text-xs text-gray-500">
              Forecast
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <div className="text-sm text-gray-500">
              {formatDate(data.slice(-14)[0].date)}
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(forecast.forecast[forecast.forecast.length - 1].date)}
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-3">
                <TrendingUpIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Confidence Score</h4>
                <p className="text-2xl font-bold">{forecast.confidence}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-medium mb-2">Recommendation</h4>
            <p className="text-gray-700">{forecast.recommendation}</p>
          </div>
        </div>
      </div>;
  };
  return <div className="bg-neutral-light p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Predictive Analytics</h2>
      {!data && !isUploading && !isProcessing && <div className="space-y-4">
          <p className="text-gray-700">
            Upload historical data or use our demo data to generate a 7-day
            forecast of surplus food.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleDemoData} className="bg-primary hover:bg-primary-hover text-white py-2 px-4 rounded-lg transition">
              Use Demo Data
            </button>
            <button onClick={triggerFileUpload} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition flex items-center justify-center">
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload CSV (6 months)
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
          </div>
          <p className="text-sm text-gray-500">
            CSV format: date,value (e.g., 2023-01-01,120)
          </p>
        </div>}
      {isUploading && <div className="space-y-4">
          <p className="text-gray-700">Uploading file...</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{
          width: `${uploadProgress}%`
        }}></div>
          </div>
          <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
        </div>}
      {isProcessing && <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-700">Processing data...</p>
        </div>}
      {data && forecast && !isProcessing && !isUploading && <>
          {renderChart()}
          <div className="mt-6 flex justify-center">
            <button onClick={() => {
          setData(null);
          setForecast(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }} className="text-primary hover:underline">
              Start Over
            </button>
          </div>
        </>}
    </div>;
};
export default PredictiveAnalytics;