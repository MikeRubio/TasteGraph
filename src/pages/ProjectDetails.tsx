import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  BarChart3,
  Target,
  Lightbulb,
  Brain,
  Globe,
  Zap
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
      qloo_data: latestInsight.qloo_data,
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

  // Debug: Log the insights data structure
  console.log('Insights data structure:', insights);

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

      {/* Report Overview */}
      {latestInsight && (
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Insights Report Overview
            </CardTitle>
            <CardDescription className="text-slate-300">
              AI-powered analysis generated on {format(new Date(latestInsight.created_at), 'MMM d, yyyy \'at\' h:mm a')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {latestInsight.audience_personas?.length || 0}
                </div>
                <div className="text-sm text-slate-300">Audience Personas</div>
              </div>
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {latestInsight.cultural_trends?.length || 0}
                </div>
                <div className="text-sm text-slate-300">Cultural Trends</div>
              </div>
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <Lightbulb className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {latestInsight.content_suggestions?.length || 0}
                </div>
                <div className="text-sm text-slate-300">Content Ideas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              Personas ({latestInsight.audience_personas?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-blue-500/20">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trends ({latestInsight.cultural_trends?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-blue-500/20">
              <FileText className="w-4 h-4 mr-2" />
              Content ({latestInsight.content_suggestions?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personas" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Audience Personas
                </CardTitle>
                <CardDescription className="text-slate-300">
                  AI-generated personas based on Qloo's Taste AI™ cultural intelligence
                </CardDescription>
              </CardHeader>
              <CardContent>
                {latestInsight.audience_personas?.length > 0 ? (
                  <div className="space-y-6">
                    {latestInsight.audience_personas.map((persona: any, index: number) => (
                      <PersonaCard key={index} persona={persona} index={index} />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    icon={Users}
                    title="No personas generated yet"
                    description="Click 'Generate Insights' to create audience personas."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Cultural Trends
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Emerging trends and cultural insights for your target audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                {latestInsight.cultural_trends?.length > 0 ? (
                  <div className="space-y-4">
                    {latestInsight.cultural_trends.map((trend: any, index: number) => (
                      <TrendCard key={index} trend={trend} index={index} />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    icon={TrendingUp}
                    title="No trends identified yet"
                    description="Click 'Generate Insights' to discover cultural trends."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Content Suggestions
                </CardTitle>
                <CardDescription className="text-slate-300">
                  AI-generated content ideas and campaign strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                {latestInsight.content_suggestions?.length > 0 ? (
                  <div className="space-y-4">
                    {latestInsight.content_suggestions.map((suggestion: any, index: number) => (
                      <ContentCard key={index} suggestion={suggestion} index={index} />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    icon={FileText}
                    title="No content suggestions yet"
                    description="Click 'Generate Insights' to create content ideas."
                  />
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

// Persona Card Component
const PersonaCard = ({ persona, index }: { persona: any; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-6 bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-lg border border-slate-600/30">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-400" />
            {persona.name || `Persona ${index + 1}`}
          </h3>
          <p className="text-slate-300 leading-relaxed">
            {persona.description || 'No description available'}
          </p>
        </div>
      </div>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between text-slate-300 hover:text-white p-0 h-auto">
            <span className="text-sm font-medium">
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Characteristics */}
          {persona.characteristics && persona.characteristics.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                Key Characteristics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {persona.characteristics.map((char: string, charIndex: number) => (
                  <div key={charIndex} className="flex items-start p-3 bg-slate-800/50 rounded-lg">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm text-slate-300">{char}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demographics */}
          {persona.demographics && (
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Demographics & Platforms
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {persona.demographics.age_range && (
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">Age Range</div>
                    <div className="text-sm font-medium text-white">{persona.demographics.age_range}</div>
                  </div>
                )}
                {persona.demographics.interests && (
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">Top Interests</div>
                    <div className="flex flex-wrap gap-1">
                      {persona.demographics.interests.slice(0, 3).map((interest: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {persona.demographics.platforms && (
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">Platforms</div>
                    <div className="flex flex-wrap gap-1">
                      {persona.demographics.platforms.slice(0, 3).map((platform: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cultural Affinities */}
          {persona.affinity_scores && Object.keys(persona.affinity_scores).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Cultural Affinities
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(persona.affinity_scores).map(([domain, score]: [string, any]) => (
                  <div key={domain} className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300 capitalize font-medium">
                        {domain.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {Math.round(score * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(score * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Behavioral Patterns */}
          {persona.behavioral_patterns && persona.behavioral_patterns.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Behavioral Patterns
              </h4>
              <div className="flex flex-wrap gap-2">
                {persona.behavioral_patterns.map((pattern: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {pattern.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

// Trend Card Component
const TrendCard = ({ trend, index }: { trend: any; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-6 bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-lg border border-slate-600/30">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
              {trend.title || `Trend ${index + 1}`}
            </h3>
            {trend.confidence && (
              <Badge variant="secondary" className="text-xs">
                {trend.confidence}% confidence
              </Badge>
            )}
          </div>
          <p className="text-slate-300 leading-relaxed">
            {trend.description || 'No description available'}
          </p>
        </div>
      </div>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between text-slate-300 hover:text-white p-0 h-auto">
            <span className="text-sm font-medium">
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trend.impact && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Impact
                </h4>
                <p className="text-sm text-slate-300">{trend.impact}</p>
              </div>
            )}
            
            {trend.timeline && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Timeline
                </h4>
                <p className="text-sm text-slate-300">{trend.timeline}</p>
              </div>
            )}
          </div>

          {trend.qloo_connection && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                Qloo Intelligence
              </h4>
              <p className="text-sm text-slate-300">{trend.qloo_connection}</p>
            </div>
          )}

          {trend.affinity_score && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400 mb-2">Cultural Relevance</h4>
              <div className="flex items-center space-x-3">
                <div className="flex-1 h-3 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round(trend.affinity_score * 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-white min-w-[3rem]">
                  {Math.round(trend.affinity_score * 100)}%
                </span>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

// Content Card Component
const ContentCard = ({ suggestion, index }: { suggestion: any; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-6 bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-lg border border-slate-600/30">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
            {suggestion.title || `Content Idea ${index + 1}`}
          </h3>
          <p className="text-slate-300 leading-relaxed">
            {suggestion.description || 'No description available'}
          </p>
        </div>
      </div>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between text-slate-300 hover:text-white p-0 h-auto">
            <span className="text-sm font-medium">
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestion.platforms && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-sm font-medium text-slate-400 mb-2">Best Platforms</h4>
                <div className="flex flex-wrap gap-1">
                  {suggestion.platforms.map((platform: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {suggestion.content_type && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-sm font-medium text-slate-400 mb-2">Content Type</h4>
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
          </div>

          {suggestion.copy && (
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Sample Copy
              </h4>
              <p className="text-sm text-slate-300 italic leading-relaxed">"{suggestion.copy}"</p>
            </div>
          )}

          {suggestion.cultural_timing && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Cultural Timing
              </h4>
              <p className="text-sm text-slate-300">{suggestion.cultural_timing}</p>
            </div>
          )}

          {suggestion.affinity_score && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400 mb-2">Audience Match</h4>
              <div className="flex items-center space-x-3">
                <div className="flex-1 h-3 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round(suggestion.affinity_score * 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-white min-w-[3rem]">
                  {Math.round(suggestion.affinity_score * 100)}%
                </span>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

// Taste Intersection Card Component
const TasteIntersectionCard = ({ intersection, index }: { intersection: any; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <GitMerge className="w-5 h-5 mr-2 text-green-400" />
              {intersection.intersection_name || `Intersection ${index + 1}`}
            </h3>
            {intersection.overlap_percentage && (
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-300">
                {intersection.overlap_percentage}% overlap
              </Badge>
            )}
          </div>
          <p className="text-slate-300 leading-relaxed">
            {intersection.description || 'No description available'}
          </p>
        </div>
      </div>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between text-slate-300 hover:text-white p-0 h-auto">
            <span className="text-sm font-medium">
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Personas Involved */}
          {intersection.personas_involved && intersection.personas_involved.length > 0 && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Personas Involved
              </h4>
              <div className="flex flex-wrap gap-2">
                {intersection.personas_involved.map((persona: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {persona}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Shared Attributes */}
          {intersection.shared_attributes && intersection.shared_attributes.length > 0 && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                Shared Attributes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {intersection.shared_attributes.map((attribute: string, idx: number) => (
                  <div key={idx} className="flex items-start p-2 bg-slate-700/30 rounded">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm text-slate-300">{attribute.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Interests & Brands */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intersection.common_interests && intersection.common_interests.length > 0 && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-sm font-medium text-slate-400 mb-2">Common Interests</h4>
                <div className="flex flex-wrap gap-1">
                  {intersection.common_interests.map((interest: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {interest.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {intersection.shared_brands && intersection.shared_brands.length > 0 && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-sm font-medium text-slate-400 mb-2">Shared Brands</h4>
                <div className="flex flex-wrap gap-1">
                  {intersection.shared_brands.map((brand: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Marketing Opportunities */}
          {intersection.marketing_opportunities && intersection.marketing_opportunities.length > 0 && (
            <div className="p-4 bg-slate-800/50 rounded-lg border border-green-500/20">
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Marketing Opportunities
              </h4>
              <div className="space-y-2">
                {intersection.marketing_opportunities.map((opportunity: string, idx: number) => (
                  <div key={idx} className="flex items-start p-3 bg-green-500/10 rounded-lg">
                    <ArrowRight className="w-4 h-4 mt-0.5 mr-3 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{opportunity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

// Cross-Domain Recommendation Card Component
const CrossDomainCard = ({ recommendation, index }: { recommendation: any; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <Network className="w-5 h-5 mr-2 text-cyan-400" />
              {recommendation.recommendation_title || `Recommendation ${index + 1}`}
            </h3>
            <div className="flex items-center space-x-2">
              {recommendation.confidence_score && (
                <Badge variant="secondary" className="text-xs">
                  {recommendation.confidence_score}% confidence
                </Badge>
              )}
              {recommendation.implementation_difficulty && (
                <Badge className={`text-xs ${getDifficultyColor(recommendation.implementation_difficulty)}`}>
                  {recommendation.implementation_difficulty} difficulty
                </Badge>
              )}
            </div>
          </div>
          
          {/* Source to Target Domain */}
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="outline" className="text-xs">
              {recommendation.source_domain}
            </Badge>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <Badge variant="outline" className="text-xs">
              {recommendation.target_domain}
            </Badge>
          </div>
          
          <p className="text-slate-300 leading-relaxed">
            {recommendation.description || 'No description available'}
          </p>
        </div>
      </div>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between text-slate-300 hover:text-white p-0 h-auto">
            <span className="text-sm font-medium">
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Audience Fit Score */}
          {recommendation.audience_fit && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400 mb-2">Audience Fit</h4>
              <div className="flex items-center space-x-3">
                <div className="flex-1 h-3 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round(recommendation.audience_fit * 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-white min-w-[3rem]">
                  {Math.round(recommendation.audience_fit * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Related Entities */}
          {recommendation.related_entities && recommendation.related_entities.length > 0 && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center">
                <Link2 className="w-4 h-4 mr-2" />
                Related Entities
              </h4>
              <div className="flex flex-wrap gap-2">
                {recommendation.related_entities.map((entity: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {entity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Expansion Opportunities */}
          {recommendation.expansion_opportunities && recommendation.expansion_opportunities.length > 0 && (
            <div className="p-4 bg-slate-800/50 rounded-lg border border-cyan-500/20">
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Expansion Opportunities
              </h4>
              <div className="space-y-2">
                {recommendation.expansion_opportunities.map((opportunity: string, idx: number) => (
                  <div key={idx} className="flex items-start p-3 bg-cyan-500/10 rounded-lg">
                    <ArrowRight className="w-4 h-4 mt-0.5 mr-3 text-cyan-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{opportunity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Potential Reach */}
          {recommendation.potential_reach && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Market Potential
              </h4>
              <p className="text-sm text-slate-300">{recommendation.potential_reach}</p>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ icon: Icon, title, description }: { 
  icon: any; 
  title: string; 
  description: string; 
}) => (
  <div className="text-center py-12">
    <Icon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-300">{description}</p>
  </div>
);

export default ProjectDetails;