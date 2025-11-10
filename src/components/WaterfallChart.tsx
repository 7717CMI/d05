import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { formatWithCommas } from '../utils/dataGenerator'

interface WaterfallChartProps {
  data: Array<{
    year: string
    baseValue?: number
    incrementalValue?: number
    totalValue?: number
    isBase?: boolean
    isTotal?: boolean
  }>
  xAxisLabel?: string
  yAxisLabel?: string
  incrementalOpportunity?: number
}

export function WaterfallChart({ 
  data, 
  xAxisLabel = 'Year', 
  yAxisLabel = 'Market Value (US$ Mn)',
  incrementalOpportunity
}: WaterfallChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary-light dark:text-text-secondary-dark">
        No data available
      </div>
    )
  }

  // Find the base value (threshold) from 2024 data
  const baseItem = data.find(item => item.isBase)
  const threshold = baseItem?.baseValue || baseItem?.totalValue || 0

  // Transform data to show market value per year with two-tone bars
  // Include all years (including 2032 which is marked as isTotal)
  const chartData = data.map(item => {
      const marketValue = item.totalValue || item.baseValue || 0
      const belowThreshold = Math.min(marketValue, threshold)
      const aboveThreshold = Math.max(0, marketValue - threshold)
      
      return {
        year: item.year,
        marketValue,
        belowThreshold,
        aboveThreshold,
      }
    })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className={`p-4 rounded-lg border-2 shadow-lg ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          <p className="font-bold text-base mb-2">Year: {label}</p>
          <p className="text-sm">
            <strong>Market Value:</strong> {formatWithCommas(data.marketValue || 0, 1)} US$ Mn
          </p>
          {data.marketValue > threshold && (
            <p className="text-sm text-blue-400">
              <strong>Above Threshold:</strong> {formatWithCommas(data.aboveThreshold || 0, 1)} US$ Mn
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // Two-tone blue colors
  const darkBlue = '#1E40AF' // Darker blue for below threshold
  const lightBlue = '#60A5FA' // Lighter blue for above threshold

  return (
    <div className="relative w-full h-full">
      {/* Demo Data Watermark */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        style={{ opacity: 0.12 }}
      >
        <span 
          className="text-4xl font-bold text-gray-400 dark:text-gray-600 select-none"
          style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
        >
          Demo Data
        </span>
      </div>

      {/* Bold Title - Incremental Opportunity */}
      {incrementalOpportunity && (
        <div className="absolute top-4 left-0 right-0 z-20 text-center mb-4">
          <h3 className="text-2xl font-bold text-electric-blue dark:text-cyan-accent">
            Incremental Opportunity: {formatWithCommas(incrementalOpportunity, 1)} US$ Mn
          </h3>
        </div>
      )}

      <ResponsiveContainer width="100%" height="100%" className="relative z-10">
        <RechartsBarChart
          data={chartData}
          margin={{
            top: incrementalOpportunity ? 70 : 20,
            right: 40,
            left: 80,
            bottom: 80,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#EAEAEA'} />
          <XAxis 
            dataKey="year"
            stroke={isDark ? '#A0AEC0' : '#4A5568'}
            style={{ fontSize: '13px', fontWeight: 500 }}
            tick={{ fill: isDark ? '#E2E8F0' : '#2D3748', fontSize: 12 }}
            tickMargin={10}
            label={{
              value: xAxisLabel,
              position: 'insideBottom',
              offset: -5,
              style: { 
                fontSize: '14px', 
                fontWeight: 500,
                fill: isDark ? '#E2E8F0' : '#2D3748'
              }
            }}
          />
          <YAxis 
            stroke={isDark ? '#A0AEC0' : '#4A5568'}
            style={{ fontSize: '13px', fontWeight: 500 }}
            tickFormatter={(value) => formatWithCommas(value, 0)}
            width={90}
            tick={{ fill: isDark ? '#E2E8F0' : '#2D3748' }}
            tickMargin={15}
            domain={[0, 'auto']}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              offset: -10,
              style: { 
                fontSize: '14px', 
                fontWeight: 500,
                fill: isDark ? '#E2E8F0' : '#2D3748',
                textAnchor: 'middle'
              }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Horizontal Reference Line - Threshold */}
          <ReferenceLine 
            y={threshold} 
            stroke={isDark ? '#60A5FA' : '#2563EB'}
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{
              value: 'Threshold',
              position: 'right',
              style: {
                fill: isDark ? '#60A5FA' : '#2563EB',
                fontSize: '12px',
                fontWeight: 500
              }
            }}
          />
          
          {/* Stacked bars: below threshold (darker blue) and above threshold (lighter blue) */}
          <Bar 
            dataKey="belowThreshold" 
            stackId="marketValue"
            radius={[0, 0, 0, 0]}
            name="Below Threshold"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-below-${index}`} fill={darkBlue} />
            ))}
          </Bar>
          
          <Bar 
            dataKey="aboveThreshold" 
            stackId="marketValue"
            radius={[0, 0, 0, 0]}
            name="Above Threshold"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-above-${index}`} fill={lightBlue} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
