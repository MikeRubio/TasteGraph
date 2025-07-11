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

interface AffinityRadarChartProps {
  personas: Persona[];
}

// Transform affinity scores to radar chart data format
const transformAffinityData = (affinityScores: AffinityScores) => {
  return Object.entries(affinityScores).map(([domain, score]) => ({
    subject: domain.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: Math.round(score * 100), // Convert to percentage
    fullMark: 100
  }));
};

// Custom tooltip for radar chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
        <p className="text-white font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-slate-300">
            <span style={{ color: entry.color }}>{entry.dataKey}: </span>
            {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AffinityRadarChart: React.FC<AffinityRadarChartProps> = ({ personas }) => {
  // Filter personas that have affinity scores
  const personasWithScores = personas.filter(persona => 
    persona.affinity_scores && Object.keys(persona.affinity_scores).length > 0
  );

  if (personasWithScores.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Affinity Radar Chart
          </CardTitle>
          <CardDescription className="text-slate-300">
            No affinity score data available for visualization
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Target className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Generate insights to see affinity visualizations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Colors for different personas
  const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

  // Combine all affinity data for multi-persona comparison
  const allDomains = new Set<string>();
  personasWithScores.forEach(persona => {
    if (persona.affinity_scores) {
      Object.keys(persona.affinity_scores).forEach(domain => allDomains.add(domain));
    }
  });

  const combinedData = Array.from(allDomains).map(domain => {
    const dataPoint: any = {
      subject: domain.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      fullMark: 100
    };
    
    personasWithScores.forEach((persona, index) => {
      const score = persona.affinity_scores?.[domain] || 0;
      dataPoint[`persona${index}`] = Math.round(score * 100);
    });
    
    return dataPoint;
  });

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Cultural Affinity Radar
        </CardTitle>
        <CardDescription className="text-slate-300">
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
                style={{ backgroundColor: `${colors[index]}20`, color: colors[index] }}
              >
                {persona.name}
              </Badge>
            ))}
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={combinedData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid stroke="#475569" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#CBD5E1', fontSize: 12 }}
              className="text-slate-300"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#94A3B8', fontSize: 10 }}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
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
              wrapperStyle={{ color: '#CBD5E1' }}
              iconType="line"
            />
          </RadarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 text-xs text-slate-400">
          <p>Values represent affinity strength (0-100%). Higher values indicate stronger cultural alignment.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AffinityRadarChart;