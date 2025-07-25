import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProjects, createProject, deleteProject } from "@/lib/api";
import { Plus, Calendar, MapPin, Building, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const CULTURAL_DOMAIN_TAGS = [
  { id: "music", name: "Music" },
  { id: "fashion", name: "Fashion" },
  { id: "gaming", name: "Gaming" },
  { id: "sports", name: "Sports" },
  { id: "technology", name: "Technology" },
  { id: "food", name: "Food" },
  { id: "film", name: "Film" },
  { id: "art", name: "Art" },
];

const GEOGRAPHY_TAGS = [
  { id: "us", name: "United States" },
  { id: "uk", name: "United Kingdom" },
  { id: "fr", name: "France" },
  { id: "de", name: "Germany" },
  { id: "jp", name: "Japan" },
  { id: "ca", name: "Canada" },
];

const Projects = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [culturalDomainTags, setCulturalDomainTags] = useState<string[]>([]);
  const [geoTargetTags, setGeoTargetTags] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsCreateOpen(false);
      setTitle("");
      setDescription("");
      setIndustry("");
      setCulturalDomainTags([]);
      setGeoTargetTags([]);
      toast.success("Project created successfully!");
    },
    onError: (error: unknown) => {
      const message =
        error && typeof error === "object" && "message" in error
          ? (error as { message?: string }).message
          : "Failed to create project";
      toast.error(message || "Failed to create project");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete project");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      description,
      industry: industry || undefined,
      cultural_domains:
        culturalDomainTags.length > 0 ? culturalDomainTags : undefined,
      geographical_targets:
        geoTargetTags.length > 0 ? geoTargetTags : undefined,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-black">Projects</h2>
            <p className="text-gray-600 mt-1">Manage your audience discovery projects</p>
          </div>
          <Button disabled className="bg-black text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white border border-gray-200">
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardHeader>
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
          <h2 className="text-3xl font-bold text-black">Projects</h2>
          <p className="text-gray-600 mt-1">
            Manage your audience discovery projects
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border border-gray-200 text-black max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-black">
                Create New Project
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Set up a new audience discovery project with AI-powered insights
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-black font-medium">
                  Project Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-black font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project goals and target audience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="border-gray-300 focus:border-black focus:ring-black min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-black font-medium">
                  Industry (Optional)
                </Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="food-beverage">
                      Food & Beverage
                    </SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-black font-medium">
                  Cultural Domains
                </Label>
                <div className="flex flex-wrap gap-2">
                  {CULTURAL_DOMAIN_TAGS.map((tag) => (
                    <Badge
                      key={tag.id}
                      className={`cursor-pointer px-3 py-1 rounded-lg transition-all ${
                        culturalDomainTags.includes(tag.id)
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => {
                        setCulturalDomainTags((prev) =>
                          prev.includes(tag.id)
                            ? prev.filter((id) => id !== tag.id)
                            : [...prev, tag.id]
                        );
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-black font-medium">
                  Geographical Targets
                </Label>
                <div className="flex flex-wrap gap-2">
                  {GEOGRAPHY_TAGS.map((tag) => (
                    <Badge
                      key={tag.id}
                      className={`cursor-pointer px-3 py-1 rounded-lg transition-all ${
                        geoTargetTags.includes(tag.id)
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => {
                        setGeoTargetTags((prev) =>
                          prev.includes(tag.id)
                            ? prev.filter((id) => id !== tag.id)
                            : [...prev, tag.id]
                        );
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {createMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first project to start discovering audience insights
              with AI
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-black text-lg">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      {project.description.substring(0, 100)}...
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(project.created_at), "MMM d, yyyy")}
                </div>

                {project.industry && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Building className="w-4 h-4 mr-2" />
                    {project.industry}
                  </div>
                )}

                {project.geographical_targets &&
                  project.geographical_targets.length > 0 && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {project.geographical_targets.slice(0, 2).join(", ")}
                      {project.geographical_targets.length > 2 &&
                        ` +${project.geographical_targets.length - 2} more`}
                    </div>
                  )}

                {project.cultural_domains &&
                  project.cultural_domains.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.cultural_domains
                        .slice(0, 3)
                        .map((domain: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700"
                          >
                            {domain}
                          </Badge>
                        ))}
                      {project.cultural_domains.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-700"
                        >
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
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
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