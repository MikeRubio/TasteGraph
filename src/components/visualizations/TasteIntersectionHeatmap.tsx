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

// Heatmap color based on overlap percentage
const getHeatmapColor = (percentage: number) => {
  if (percentage >= 80) return '#3c5570';   // Deep Brand Blue
  if (percentage >= 60) return '#6366f1';   // Brand Purple
  if (percentage >= 40) return '#22d3ee';   // Brand Teal
  if (percentage >= 20) return '#a3bffa';   // Pastel Blue
  return '#e0e7ef';                         // Light Gray-Blue
};

// Text color for readability
const getTextColor = (percentage: number) => {
  return percentage >= 60 ? '#ffffff' : '#1a1a1a';
};

const TasteIntersectionHeatmap: React.FC<TasteIntersectionHeatmapProps> = ({ intersections }) => {
  if (!intersections || intersections.length === 0) {
    return (
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-black flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Taste Intersection Heatmap
          </CardTitle>
          <CardDescription className="text-gray-600">
            No intersection data available for visualization
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Generate insights to see taste intersection analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-black flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Taste Intersection Analysis
        </CardTitle>
        <CardDescription className="text-gray-600">
          Overlap analysis between different audience segments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intersections.map((intersection, index) => (
            <div
              key={index}
              className="relative p-4 rounded-lg border border-gray-200 overflow-hidden"
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
                  className="text-xs font-bold bg-white/20 border-white/20"
                  style={{
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
                        className="text-xs px-2 py-1 rounded bg-white/15 border border-white/20"
                        style={{
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
                        className="text-xs px-2 py-1 rounded bg-white/10 border border-white/10"
                        style={{
                          color: getTextColor(intersection.overlap_percentage)
                        }}
                      >
                        {interest}
                      </span>
                    ))}
                    {intersection.common_interests.length > 4 && (
                      <span 
                        className="text-xs px-2 py-1 rounded bg-white/10 border border-white/10"
                        style={{
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
                className="absolute bottom-0 left-0 h-1 transition-all duration-300 bg-white/40"
                style={{
                  width: `${intersection.overlap_percentage}%`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-black mb-3">Overlap Intensity Scale</h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ background: '#e0e7ef' }}></div>
              <span className="text-xs text-gray-600">Very Low (0–19%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ background: '#a3bffa' }}></div>
              <span className="text-xs text-gray-600">Low (20–39%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ background: '#22d3ee' }}></div>
              <span className="text-xs text-gray-600">Medium (40–59%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ background: '#6366f1' }}></div>
              <span className="text-xs text-gray-600">High (60–79%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ background: '#3c5570' }}></div>
              <span className="text-xs text-gray-600">Very High (80–100%)</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Higher overlap percentages indicate stronger shared characteristics between audience segments.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TasteIntersectionHeatmap;