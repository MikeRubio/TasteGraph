import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProjects, getDashboardStats } from '@/lib/api';
import { Plus, FolderOpen, TrendingUp, Users, Zap, Calendar, Activity, Target, Brain } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  const recentProjects = projects.slice(0, 3);

  if (isLoading || statsLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-black">Welcome back</h2>
            <p className="text-gray-600 mt-1">Here's what's happening with your projects.</p>
          </div>
          <Button disabled className="bg-black text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-black">Welcome back</h2>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your projects.
          </p>
        </div>
        <Link to="/projects">
          <Button className="bg-black hover:bg-gray-800 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Projects
                </p>
                <p className="text-3xl font-bold text-black">
                  {stats?.total_projects || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Insights Generated
                </p>
                <p className="text-3xl font-bold text-black">
                  {stats?.total_insights || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Personas Created
                </p>
                <p className="text-3xl font-bold text-black">
                  {stats?.total_personas || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">AI Queries</p>
                <p className="text-3xl font-bold text-black">
                  {stats?.total_api_queries || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-black flex items-center">
              <FolderOpen className="w-5 h-5 mr-2" />
              Recent Projects
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your most recently created projects
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first project to get started
                </p>
                <Link to="/projects">
                  <Button className="bg-black hover:bg-gray-800 text-white">
                    Create Your First Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-black">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {project.description.substring(0, 80)}...
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(project.created_at), "MMM d, yyyy")}
                      </div>
                    </div>
                    <Link to={`/projects/${project.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
                <Link to="/projects">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    View All Projects
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-black flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-gray-600">
              Get started with these powerful tools
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col gap-3">
              <Link to="/projects">
                <Button className="w-full justify-start bg-black hover:bg-gray-800 text-white">
                  <Plus className="w-4 h-4 mr-3" />
                  Create New Project
                </Button>
              </Link>
              <Link to="/live-discovery">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Activity className="w-4 h-4 mr-3" />
                  Live Discovery Tool
                </Button>
              </Link>
              <Link to="/market-fit">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Target className="w-4 h-4 mr-3" />
                  Market Fit Analyzer
                </Button>
              </Link>
              <Link to="/api-access">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Zap className="w-4 h-4 mr-3" />
                  API Documentation
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      {projects.length === 0 && (
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">
              Welcome to Libitum!
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Start by creating your first project to discover audience insights
              and generate AI-powered content strategies using Qloo's cultural
              intelligence.
            </p>
            <Link to="/projects">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white"
              >
                Create Your First Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;