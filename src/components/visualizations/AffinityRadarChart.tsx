import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';

interface AffinityScores {
  [domain: string]: number;
}

interface Persona {
  name: string;
  affinity_scores?: AffinityScores;
}

type ChartTheme = "light" | "dark";

interface AffinityRadarChartProps {
  personas: Persona[];
  theme?: ChartTheme;
}

// Custom tooltip for radar chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="font-medium text-black">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.dataKey}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const getColors = () => [
  "#0ea5e9", // Vivid Blue
  "#f43f5e", // Vivid Pink/Red
  "#f59e42", // Bright Orange
  "#a21caf", // Deep Purple
  "#22d3ee", // Bright Teal
  "#fde047", // Vivid Yellow
];

const AffinityRadarChart: React.FC<AffinityRadarChartProps> = ({
  personas,
  theme = "light",
}) => {
  // Filter personas that have affinity scores
  const personasWithScores = personas.filter(
    (persona) =>
      persona.affinity_scores && Object.keys(persona.affinity_scores).length > 0
  );

  if (personasWithScores.length === 0) {
    return (
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-black flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Cultural Affinity Radar
          </CardTitle>
          <CardDescription className="text-gray-600">
            No affinity score data available for visualization
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Target className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600">
              Generate insights to see affinity visualizations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const colors = getColors();

  // Combine all affinity data for multi-persona comparison
  const allDomains = new Set<string>();
  personasWithScores.forEach((persona) => {
    if (persona.affinity_scores) {
      Object.keys(persona.affinity_scores).forEach((domain) =>
        allDomains.add(domain)
      );
    }
  });

  const combinedData = Array.from(allDomains).map((domain) => {
    const dataPoint: any = {
      subject: domain
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      fullMark: 100,
    };

    personasWithScores.forEach((persona, index) => {
      const score = persona.affinity_scores?.[domain] || 0;
      dataPoint[`persona${index}`] = Math.round(score * 100);
    });

    return dataPoint;
  });

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-black flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Cultural Affinity Radar
        </CardTitle>
        <CardDescription className="text-gray-600">
          Compare cultural affinities across audience personas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {personasWithScores.map((persona, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-700"
                style={{
                  borderLeft: `3px solid ${colors[index]}`,
                }}
              >
                {persona.name}
              </Badge>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <RadarChart
            data={combinedData}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: "#374151",
                fontSize: 12,
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{
                fill: "#6B7280",
                fontSize: 10,
              }}
              tickCount={6}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{ zIndex: 100 }}
            />
            {personasWithScores.map((persona, index) => (
              <Radar
                key={index}
                name={persona.name}
                dataKey={`persona${index}`}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            ))}
            <Legend
              wrapperStyle={{
                color: "#374151",
                fontSize: 12,
              }}
              iconType="line"
            />
          </RadarChart>
        </ResponsiveContainer>

        <div className="mt-4 text-xs text-gray-600">
          <p>
            Values represent affinity strength (0-100%). Higher values indicate
            stronger cultural alignment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AffinityRadarChart;