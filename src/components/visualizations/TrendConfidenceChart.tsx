import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface CulturalTrend {
  title: string;
  confidence: number;
  description?: string;
  impact?: string;
  timeline?: string;
}

interface TrendConfidenceChartProps {
  trends: CulturalTrend[];
}

// Custom tooltip for trend chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-lg max-w-xs">
        <p className="text-white font-medium mb-2">{label}</p>
        <p className="text-purple-400 font-semibold">
          Confidence: {payload[0].value}%
        </p>
        {data.description && (
          <p className="text-slate-300 text-sm mt-2 line-clamp-3">
            {data.description}
          </p>
        )}
        {data.impact && (
          <p className="text-slate-400 text-xs mt-1">
            Impact: {data.impact}
          </p>
        )}
      </div>
    );
  }
  return null;
};

// Function to get color based on confidence level
const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return '#10B981'; // Green for high confidence
  if (confidence >= 60) return '#F59E0B'; // Yellow for medium confidence
  return '#EF4444'; // Red for low confidence
};

const TrendConfidenceChart: React.FC<TrendConfidenceChartProps> = ({ trends }) => {
  if (!trends || trends.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Trend Confidence Analysis
          </CardTitle>
          <CardDescription className="text-slate-300">
            No trend data available for visualization
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Generate insights to see trend confidence analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform trends data for chart
  const chartData = trends.map((trend, index) => ({
    name: trend.title.length > 20 ? `${trend.title.substring(0, 20)}...` : trend.title,
    fullName: trend.title,
    confidence: trend.confidence || 0,
    description: trend.description,
    impact: trend.impact,
    timeline: trend.timeline,
    color: getConfidenceColor(trend.confidence || 0)
  }));

  // Sort by confidence for better visualization
  chartData.sort((a, b) => b.confidence - a.confidence);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Cultural Trend Confidence
        </CardTitle>
        <CardDescription className="text-slate-300">
          AI confidence levels for identified cultural trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis 
              type="number"
              domain={[0, 100]}
              tick={{ fill: '#CBD5E1', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              type="category"
              dataKey="name"
              tick={{ fill: '#CBD5E1', fontSize: 11 }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="confidence" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-slate-300">High Confidence (80%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-slate-300">Medium Confidence (60-79%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-slate-300">Low Confidence (Below 60%)</span>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-slate-400">
          <p>Confidence levels indicate AI certainty in trend predictions based on cultural data analysis.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendConfidenceChart;