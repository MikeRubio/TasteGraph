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
const CustomTooltip = ({ active, payload, label, theme }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`rounded-lg p-3 shadow-lg border`}
        style={{
          background: theme === "dark" ? "#1e293b" : "#fff",
          borderColor: theme === "dark" ? "#334155" : "#ddd",
          color: theme === "dark" ? "#fff" : "#111",
        }}
      >
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.dataKey}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const getColors = (theme: ChartTheme = "dark") =>
  theme === "dark"
    ? ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"]
    : ["#2563eb", "#a21caf", "#059669", "#b45309", "#b91c1c", "#0e7490"];

const AffinityRadarChart: React.FC<AffinityRadarChartProps> = ({
  personas,
  theme = "dark",
}) => {
  // Filter personas that have affinity scores
  const personasWithScores = personas.filter(
    (persona) =>
      persona.affinity_scores && Object.keys(persona.affinity_scores).length > 0
  );

  if (personasWithScores.length === 0) {
    return (
      <Card
        className={
          theme === "dark"
            ? "bg-slate-800/50 border-slate-700/50"
            : "bg-white border-gray-200"
        }
      >
        <CardHeader>
          <CardTitle
            className={theme === "dark" ? "text-white" : "text-slate-900"}
          >
            <Target className="w-5 h-5 mr-2" />
            Affinity Radar Chart
          </CardTitle>
          <CardDescription
            className={theme === "dark" ? "text-slate-300" : "text-gray-500"}
          >
            No affinity score data available for visualization
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Target
              className="w-12 h-12 mx-auto mb-3"
              style={{ color: theme === "dark" ? "#64748b" : "#cbd5e1" }}
            />
            <p
              className={theme === "dark" ? "text-slate-400" : "text-gray-500"}
            >
              Generate insights to see affinity visualizations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Theme-aware colors
  const colors = getColors(theme);

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
    <Card
      className={
        theme === "dark"
          ? "bg-slate-800/50 border-slate-700/50"
          : "bg-white border-gray-200"
      }
    >
      <CardHeader>
        <CardTitle
          className={
            theme === "dark"
              ? "text-white flex items-center"
              : "text-slate-900 flex items-center"
          }
        >
          <Target className="w-5 h-5 mr-2" />
          Cultural Affinity Radar
        </CardTitle>
        <CardDescription
          className={theme === "dark" ? "text-slate-300" : "text-gray-500"}
        >
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
                className="text-xs"
                style={{
                  backgroundColor:
                    theme === "dark"
                      ? `${colors[index]}20`
                      : `${colors[index]}15`,
                  color: colors[index],
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
            <PolarGrid stroke={theme === "dark" ? "#475569" : "#e5e7eb"} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: theme === "dark" ? "#CBD5E1" : "#222",
                fontSize: 12,
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{
                fill: theme === "dark" ? "#94A3B8" : "#555",
                fontSize: 10,
              }}
              tickCount={6}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip theme={theme} />}
              wrapperStyle={{ zIndex: 100 }}
            />
            {personasWithScores.map((persona, index) => (
              <Radar
                key={index}
                name={persona.name}
                dataKey={`persona${index}`}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={0.13}
                strokeWidth={2}
              />
            ))}
            <Legend
              wrapperStyle={{
                color: theme === "dark" ? "#CBD5E1" : "#555",
                fontSize: 12,
              }}
              iconType="line"
            />
          </RadarChart>
        </ResponsiveContainer>

        <div
          className="mt-4 text-xs"
          style={{ color: theme === "dark" ? "#94a3b8" : "#666" }}
        >
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
