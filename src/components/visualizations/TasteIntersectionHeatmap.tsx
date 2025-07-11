import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target } from 'lucide-react';

interface TasteIntersection {
  intersection_name: string;
  description: string;
  overlap_percentage: number;
  personas_involved: string[];
  common_interests: string[];
  marketing_opportunities: string[];
}

interface TasteIntersectionHeatmapProps {
  intersections: TasteIntersection[];
}

// Function to get color intensity based on overlap percentage
const getHeatmapColor = (percentage: number) => {
  const intensity = percentage / 100;
  const red = Math.round(59 + (255 - 59) * intensity); // From slate-600 to bright
  const green = Math.round(130 + (125) * intensity);
  const blue = Math.round(246 + (9) * intensity);
  return `rgb(${red}, ${green}, ${blue})`;
};

// Function to get text color based on background intensity
const getTextColor = (percentage: number) => {
  return percentage > 50 ? '#FFFFFF' : '#1E293B';
};

const TasteIntersectionHeatmap: React.FC<TasteIntersectionHeatmapProps> = ({ intersections }) => {
  if (!intersections || intersections.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Taste Intersection Heatmap
          </CardTitle>
          <CardDescription className="text-slate-300">
            No intersection data available for visualization
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Generate insights to see taste intersection analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Taste Intersection Analysis
        </CardTitle>
        <CardDescription className="text-slate-300">
          Overlap analysis between different audience segments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intersections.map((intersection, index) => (
            <div
              key={index}
              className="relative p-4 rounded-lg border border-slate-600/30 overflow-hidden"
              style={{
                backgroundColor: getHeatmapColor(intersection.overlap_percentage),
                color: getTextColor(intersection.overlap_percentage)
              }}
            >
              {/* Intersection Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  {intersection.intersection_name}
                </h3>
                <Badge 
                  variant="secondary" 
                  className="text-xs font-bold"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: getTextColor(intersection.overlap_percentage)
                  }}
                >
                  {intersection.overlap_percentage}%
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm mb-3 opacity-90">
                {intersection.description}
              </p>

              {/* Personas Involved */}
              {intersection.personas_involved && intersection.personas_involved.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-medium mb-1 opacity-75">PERSONAS INVOLVED</h4>
                  <div className="flex flex-wrap gap-1">
                    {intersection.personas_involved.map((persona, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          color: getTextColor(intersection.overlap_percentage)
                        }}
                      >
                        {persona}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Interests */}
              {intersection.common_interests && intersection.common_interests.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-medium mb-1 opacity-75">SHARED INTERESTS</h4>
                  <div className="flex flex-wrap gap-1">
                    {intersection.common_interests.slice(0, 4).map((interest, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: getTextColor(intersection.overlap_percentage)
                        }}
                      >
                        {interest}
                      </span>
                    ))}
                    {intersection.common_interests.length > 4 && (
                      <span 
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: getTextColor(intersection.overlap_percentage)
                        }}
                      >
                        +{intersection.common_interests.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Marketing Opportunities */}
              {intersection.marketing_opportunities && intersection.marketing_opportunities.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium mb-1 opacity-75">TOP OPPORTUNITY</h4>
                  <p className="text-xs opacity-90">
                    {intersection.marketing_opportunities[0]}
                  </p>
                </div>
              )}

              {/* Overlap Percentage Indicator */}
              <div 
                className="absolute bottom-0 left-0 h-1 transition-all duration-300"
                style={{
                  width: `${intersection.overlap_percentage}%`,
                  backgroundColor: 'rgba(255, 255, 255, 0.4)'
                }}
              />
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-3">Overlap Intensity Scale</h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getHeatmapColor(20) }}></div>
              <span className="text-xs text-slate-300">Low (0-30%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getHeatmapColor(50) }}></div>
              <span className="text-xs text-slate-300">Medium (30-70%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getHeatmapColor(80) }}></div>
              <span className="text-xs text-slate-300">High (70%+)</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Higher overlap percentages indicate stronger shared characteristics between audience segments.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TasteIntersectionHeatmap;