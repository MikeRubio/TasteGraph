import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg max-w-xs">
        <p className="text-black font-medium mb-2">{data.fullName || label}</p>
        <p className="text-black font-semibold">
          Confidence: {payload[0].value}%
        </p>
        {data.description && (
          <p className="text-gray-600 text-sm mt-2">
            {data.description}
          </p>
        )}
        {data.impact && (
          <p className="text-gray-500 text-xs mt-1">
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
  if (confidence >= 80) return "#6366f1"; // Brand Purple for high confidence
  if (confidence >= 60) return "#22d3ee"; // Brand Teal for medium confidence
  return "#f59e42"; // Orange for low confidence
};

const TrendConfidenceChart: React.FC<TrendConfidenceChartProps> = ({
  trends,
}) => {
  if (!trends || trends.length === 0) {
    return (
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-black flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Cultural Trend Confidence
          </CardTitle>
          <CardDescription className="text-gray-600">
            No trend data available for visualization
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              Generate insights to see trend confidence analysis
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform trends data for chart
  const chartData = trends.map((trend, index) => ({
    name:
      trend.title.length > 25
        ? `${trend.title.substring(0, 25)}...`
        : trend.title,
    fullName: trend.title,
    confidence: Math.max(trend.confidence || 0, 5),
    description: trend.description,
    impact: trend.impact,
    timeline: trend.timeline,
    color: getConfidenceColor(trend.confidence || 0),
  }));

  // Sort by confidence for better visualization
  chartData.sort((a, b) => b.confidence - a.confidence);

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-black flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Cultural Trend Confidence
        </CardTitle>
        <CardDescription className="text-gray-600">
          AI confidence levels for identified cultural trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer
          width="100%"
          height={Math.max(400, chartData.length * 60)}
        >
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#6B7280", fontSize: 11 }}
              width={150}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="confidence"
              radius={[0, 4, 4, 0]}
              stroke="#E5E7EB"
              strokeWidth={1}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded"
              style={{ background: "#6366f1" }}
            ></div>
            <span className="text-gray-600">High Confidence (80%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded"
              style={{ background: "#22d3ee" }}
            ></div>
            <span className="text-gray-600">Medium Confidence (60-79%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded"
              style={{ background: "#f59e42" }}
            ></div>
            <span className="text-gray-600">Low Confidence (Below 60%)</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>
            Confidence levels indicate AI certainty in trend predictions based
            on cultural data analysis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendConfidenceChart;