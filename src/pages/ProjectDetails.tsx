import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProject, getInsights, generateInsights } from '@/lib/api';
import { 
  ArrowLeft, 
  Sparkles, 
  Users, 
  TrendingUp, 
  FileText, 
  Calendar,
  Building,
  MapPin,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id!),
    enabled: !!id,
  });

  const { data: insights = [], isLoading: insightsLoading } = useQuery({
    queryKey: ['insights', id],
    queryFn: () => getInsights(id!),
    enabled: !!id,
  });

  const generateInsightsMutation = useMutation({
    mutationFn: generateInsights,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights', id] });
      toast.success('Insights generated successfully!');
    },
    onError: (error: any) => {
      console.error('Insight generation error:', error);
      toast.error(error.message || 'Failed to generate insights. Please try again.');
    },
  });

  const handleGenerateInsights = async () => {
    if (!id) return;
    generateInsightsMutation.mutate(id);
  };

  const handleExportInsights = () => {
    const latestInsight = insights[0];
    if (!latestInsight) {
      toast.error('No insights to export');
      return;
    }

    const exportData = {
      project: project?.title,
      generated_at: latestInsight.created_at,
      audience_personas: latestInsight.audience_personas,
      cultural_trends: latestInsight.cultural_trends,
      content_suggestions: latestInsight.content_suggestions,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_insights.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Insights exported successfully!');
  };

  if (projectLoading || !project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-slate-300" disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const latestInsight = insights[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/projects')}
            className="text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          {latestInsight && (
            <Button 
              variant="outline" 
              onClick={handleExportInsights}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              disabled={generateInsightsMutation.isPending}
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          )}
          <Button 
            onClick={handleGenerateInsights}
            disabled={generateInsightsMutation.isPending}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {generateInsightsMutation.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {generateInsightsMutation.isPending ? 'Generating Insights...' : 'Generate Insights'}
          </Button>
        </div>
      </div>

      {/* Project Info */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-2xl">{project.title}</CardTitle>
          <CardDescription className="text-slate-300 text-lg">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Created {format(new Date(project.created_at), 'MMM d, yyyy')}
            </div>
            {project.industry && (
              <div className="flex items-center">
                <Building className="w-4 h-4 mr-2" />
                {project.industry}
              </div>
            )}
            {project.geographical_targets && project.geographical_targets.length > 0 && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {project.geographical_targets.join(', ')}
              </div>
            )}
          </div>

          {project.cultural_domains && project.cultural_domains.length > 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-2">Cultural Domains:</p>
              <div className="flex flex-wrap gap-2">
                {project.cultural_domains.map((domain, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {domain}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      {insightsLoading ? (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading insights...</p>
          </CardContent>
        </Card>
      ) : generateInsightsMutation.isPending ? (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Generating AI Insights...</h3>
            <p className="text-slate-300 mb-4">
              Our AI is analyzing your project with Qloo's Taste AI™ and generating personalized insights.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-slate-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>This may take 30-60 seconds</span>
            </div>
          </CardContent>
        </Card>
      ) : generateInsightsMutation.isError ? (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Generation Failed</h3>
            <p className="text-slate-300 mb-6">
              {generateInsightsMutation.error?.message || 'Failed to generate insights. Please try again.'}
            </p>
            <Button 
              onClick={handleGenerateInsights}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : latestInsight ? (
        <Tabs defaultValue="personas" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="personas" className="data-[state=active]:bg-blue-500/20">
              <Users className="w-4 h-4 mr-2" />
              Personas
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-blue-500/20">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-blue-500/20">
              <FileText className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personas" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Audience Personas</CardTitle>
                <CardDescription className="text-slate-300">
                  AI-generated personas based on Qloo's Taste AI™ analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {latestInsight.audience_personas?.length > 0 ? (
                  <div className="space-y-6">
                    {latestInsight.audience_personas.map((persona: any, index: number) => (
                      <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">
                          {persona.name || `Persona ${index + 1}`}
                        </h3>
                        <p className="text-slate-300 mb-3">
                          {persona.description || 'No description available'}
                        </p>
                        {persona.characteristics && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-slate-400">Key Characteristics:</h4>
                            <ul className="text-sm text-slate-300 space-y-1">
                              {persona.characteristics.map((char: string, charIndex: number) => (
                                <li key={charIndex} className="flex items-start">
                                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  {char}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {persona.demographics && (
                          <div className="mt-3 pt-3 border-t border-slate-600">
                            <h4 className="text-sm font-medium text-slate-400 mb-2">Demographics:</h4>
                            <div className="flex flex-wrap gap-2">
                              {persona.demographics.age_range && (
                                <Badge variant="secondary" className="text-xs">
                                  Age: {persona.demographics.age_range}
                                </Badge>
                              )}
                              {persona.demographics.platforms?.map((platform: string, platformIndex: number) => (
                                <Badge key={platformIndex} variant="outline" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-300 text-center py-8">
                    No personas generated yet. Click "Generate Insights" to create audience personas.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Cultural Trends</CardTitle>
                <CardDescription className="text-slate-300">
                  Emerging trends and cultural insights for your target audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                {latestInsight.cultural_trends?.length > 0 ? (
                  <div className="space-y-4">
                    {latestInsight.cultural_trends.map((trend: any, index: number) => (
                      <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-white">
                            {trend.title || `Trend ${index + 1}`}
                          </h3>
                          {trend.confidence && (
                            <Badge variant="secondary" className="text-xs">
                              {trend.confidence}% confidence
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-300 mb-3">
                          {trend.description || 'No description available'}
                        </p>
                        {trend.impact && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-400 mb-1">Impact:</h4>
                            <p className="text-sm text-slate-300">{trend.impact}</p>
                          </div>
                        )}
                        {trend.timeline && (
                          <div className="mt-2">
                            <h4 className="text-sm font-medium text-slate-400 mb-1">Timeline:</h4>
                            <p className="text-sm text-slate-300">{trend.timeline}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-300 text-center py-8">
                    No trends identified yet. Click "Generate Insights" to discover cultural trends.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Content Suggestions</CardTitle>
                <CardDescription className="text-slate-300">
                  AI-generated content ideas and campaign strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                {latestInsight.content_suggestions?.length > 0 ? (
                  <div className="space-y-4">
                    {latestInsight.content_suggestions.map((suggestion: any, index: number) => (
                      <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">
                          {suggestion.title || `Content Idea ${index + 1}`}
                        </h3>
                        <p className="text-slate-300 mb-3">
                          {suggestion.description || 'No description available'}
                        </p>
                        {suggestion.platforms && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-slate-400 mb-1">Best Platforms:</h4>
                            <div className="flex flex-wrap gap-1">
                              {suggestion.platforms.map((platform: string, platformIndex: number) => (
                                <Badge key={platformIndex} variant="outline" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {suggestion.content_type && (
                          <div className="mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {suggestion.content_type}
                            </Badge>
                            {suggestion.engagement_potential && (
                              <Badge variant="outline" className="text-xs ml-2">
                                {suggestion.engagement_potential} engagement
                              </Badge>
                            )}
                          </div>
                        )}
                        {suggestion.copy && (
                          <div className="p-3 bg-slate-800/50 rounded border border-slate-600">
                            <h4 className="text-sm font-medium text-slate-400 mb-1">Sample Copy:</h4>
                            <p className="text-sm text-slate-300 italic">"{suggestion.copy}"</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-300 text-center py-8">
                    No content suggestions yet. Click "Generate Insights" to create content ideas.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Sparkles className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No insights generated yet</h3>
            <p className="text-slate-300 mb-6">
              Click the "Generate Insights" button to create AI-powered audience personas, cultural trends, and content suggestions.
            </p>
            <Button 
              onClick={handleGenerateInsights}
              disabled={generateInsightsMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {generateInsightsMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {generateInsightsMutation.isPending ? 'Generating...' : 'Generate Insights'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectDetails;