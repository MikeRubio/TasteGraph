import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProjects, createProject, deleteProject } from '@/lib/api';
import { Plus, Calendar, MapPin, Building, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Projects = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [culturalDomains, setCulturalDomains] = useState('');
  const [geographicalTargets, setGeographicalTargets] = useState('');
  
  const queryClient = useQueryClient();
  
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsCreateOpen(false);
      setTitle('');
      setDescription('');
      setIndustry('');
      setCulturalDomains('');
      setGeographicalTargets('');
      toast.success('Project created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create project');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete project');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const domains = culturalDomains.split(',').map(d => d.trim()).filter(Boolean);
    const targets = geographicalTargets.split(',').map(t => t.trim()).filter(Boolean);
    
    createMutation.mutate({
      title,
      description,
      industry: industry || undefined,
      cultural_domains: domains.length > 0 ? domains : undefined,
      geographical_targets: targets.length > 0 ? targets : undefined,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">Projects</h2>
          <Button disabled className="bg-blue-500">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Projects</h2>
          <p className="text-slate-300 mt-1">Manage your audience discovery projects</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription className="text-slate-300">
                Set up a new audience discovery project with AI-powered insights
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-slate-700/50 border-slate-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project goals and target audience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="bg-slate-700/50 border-slate-600 min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry (Optional)</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cultural-domains">Cultural Domains (Optional)</Label>
                <Input
                  id="cultural-domains"
                  placeholder="e.g., music, fashion, food (comma-separated)"
                  value={culturalDomains}
                  onChange={(e) => setCulturalDomains(e.target.value)}
                  className="bg-slate-700/50 border-slate-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="geographical-targets">Geographical Targets (Optional)</Label>
                <Input
                  id="geographical-targets"
                  placeholder="e.g., US, UK, Canada (comma-separated)"
                  value={geographicalTargets}
                  onChange={(e) => setGeographicalTargets(e.target.value)}
                  className="bg-slate-700/50 border-slate-600"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Plus className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
            <p className="text-slate-300 mb-6">
              Create your first project to start discovering audience insights with AI
            </p>
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                    <CardDescription className="text-slate-300 mt-1">
                      {project.description.substring(0, 100)}...
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-slate-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(project.created_at), 'MMM d, yyyy')}
                </div>
                
                {project.industry && (
                  <div className="flex items-center text-sm text-slate-400">
                    <Building className="w-4 h-4 mr-2" />
                    {project.industry}
                  </div>
                )}

                {project.geographical_targets && project.geographical_targets.length > 0 && (
                  <div className="flex items-center text-sm text-slate-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {project.geographical_targets.slice(0, 2).join(', ')}
                    {project.geographical_targets.length > 2 && ` +${project.geographical_targets.length - 2} more`}
                  </div>
                )}

                {project.cultural_domains && project.cultural_domains.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.cultural_domains.slice(0, 3).map((domain, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {domain}
                      </Badge>
                    ))}
                    {project.cultural_domains.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.cultural_domains.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <Link to={`/projects/${project.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;