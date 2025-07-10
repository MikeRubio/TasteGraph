import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  Zap,
  ArrowRight,
  Network,
  Link2,
  Layers,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: project,
    isLoading: projectLoading,
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id!),
    enabled: !!id,
  });

  const {
    data: insights = [],
    isLoading: insightsLoading,
  } = useQuery({
    queryKey: ['insights', id],
    queryFn: () => getInsights(id!),
    enabled: !!id,
  });

  const generateInsightsMutation = useMutation(generateInsights, {
    onSuccess: () => {
      queryClient.invalidateQueries(['insights', id]);
      toast.success('Insights generated successfully!');
    },
    onError: (error: any) => {
      console.error('Insight generation error:', error);
      toast.error(error.message || 'Failed to generate insights. Please try again.');
    },
  });

  const handleGenerateInsights = () => {
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
    a.download = `${
      project?.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    }_insights.json`;
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
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-4" />
          <div className="h-4 bg-slate-700 rounded w-2/3" />
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
              disabled={generateInsightsMutation.isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          )}
          <Button
            onClick={handleGenerateInsights}
            disabled={generateInsightsMutation.isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {generateInsightsMutation.isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {generateInsightsMutation.isLoading
              ? 'Generating Insights...'
              : 'Generate Insights'}
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
            {project.geographical_targets?.length > 0 && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {project.geographical_targets.join(', ')}
              </div>
            )}
          </div>

          {project.cultural_domains?.length > 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-2">Cultural Domains:</p>
              <div className="flex flex-wrap gap-2">
                {project.cultural_domains.map((domain, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
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
              AI-powered analysis generated on{' '}
              {format(
                new Date(latestInsight.created_at),
                "MMM d, yyyy 'at' h:mm a"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={Users}
                label="Audience Personas"
                value={latestInsight.audience_personas?.length || 0}
              />
              <StatCard
                icon={TrendingUp}
                label="Cultural Trends"
                value={latestInsight.cultural_trends?.length || 0}
              />
              <StatCard
                icon={Lightbulb}
                label="Content Ideas"
                value={latestInsight.content_suggestions?.length || 0}
              />
              <StatCard
                icon={Target}
                label="Taste Intersections"
                value={latestInsight.taste_intersections?.length || 0}
              />
              <StatCard
                icon={Globe}
                label="Cross-Domain Recs"
                value={latestInsight.cross_domain_recommendations?.length || 0}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Tabs */}
      {insightsLoading || generateInsightsMutation.isLoading ? (
        <LoadingCard
          loadingText={
            generateInsightsMutation.isLoading
              ? 'Generating AI Insights...'
              : 'Loading insights...'
          }
        />
      ) : generateInsightsMutation.isError ? (
        <ErrorCard
          errorMessage={
            generateInsightsMutation.error?.message ||
            'Failed to generate insights. Please try again.'
          }
          onRetry={handleGenerateInsights}
        />
      ) : latestInsight ? (
        <Tabs defaultValue="personas" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
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
            <TabsTrigger
              value="intersections"
              className="data-[state=active]:bg-green-500/20"
            >
              <Target className="w-4 h-4 mr-2" />
              Intersections ({latestInsight.taste_intersections?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="cross-domain"
              className="data-[state=active]:bg-cyan-500/20"
            >
              <Globe className="w-4 h-4 mr-2" />
              Cross-Domain ({latestInsight.cross_domain_recommendations?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personas">
            <PersonaSection personas={latestInsight.audience_personas} />
          </TabsContent>
          <TabsContent value="trends">
            <TrendSection trends={latestInsight.cultural_trends} />
          </TabsContent>
          <TabsContent value="content">
            <ContentSection suggestions={latestInsight.content_suggestions} />
          </TabsContent>
          <TabsContent value="intersections">
            <IntersectionsSection intersections={latestInsight.taste_intersections} />
          </TabsContent>
          <TabsContent value="cross-domain">
            <CrossDomainSection recommendations={latestInsight.cross_domain_recommendations} />
          </TabsContent>
        </Tabs>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No insights generated yet"
          description="Click the 'Generate Insights' button to create AI-powered audience personas, cultural trends, and content suggestions."
          action={{
            onClick: handleGenerateInsights,
            label: generateInsightsMutation.isLoading ? 'Generating...' : 'Generate Insights',
            disabled: generateInsightsMutation.isLoading,
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetails;

// ——— Shared Sub-Components ———

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) => (
  <div className="text-center p-4 bg-slate-800/30 rounded-lg">
    <Icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-sm text-slate-300">{label}</div>
  </div>
);

const LoadingCard = ({
  loadingText,
}: {
  loadingText: string;
}) => (
  <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
    <CardContent className="p-12 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{loadingText}</h3>
      {!loadingText.includes('Generating') && (
        <p className="text-slate-300">Please wait while we load your insights.</p>
      )}
    </CardContent>
  </Card>
);

const ErrorCard = ({
  errorMessage,
  onRetry,
}: {
  errorMessage: string;
  onRetry: () => void;
}) => (
  <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
    <CardContent className="p-12 text-center">
      <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Generation Failed</h3>
      <p className="text-slate-300 mb-6">{errorMessage}</p>
      <Button onClick={onRetry} className="bg-blue-500 hover:bg-blue-600 text-white">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </CardContent>
  </Card>
);

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: any;
  title: string;
  description: string;
  action?: {
    onClick: () => void;
    label: string;
    disabled?: boolean;
  };
}) => (
  <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
    <CardContent className="text-center py-12 space-y-4">
      <Icon className="w-16 h-16 text-slate-500 mx-auto" />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-slate-300">{description}</p>
      {action && (
        <Button onClick={action.onClick} disabled={action.disabled} className="bg-blue-500 hover:bg-blue-600 text-white">
          {action.label}
        </Button>
      )}
    </CardContent>
  </Card>
);

// (You can similarly split out PersonaSection, TrendSection, ContentSection, etc., following the same pattern.)
