import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserProfile, updateUserProfile } from "@/lib/api";
import { User, Mail, Briefcase, Building } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [jobRole, setJobRole] = useState("");
  const [industry, setIndustry] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });

  // Set jobRole and industry when profile data is loaded
  useEffect(() => {
    if (profile) {
      setJobRole(profile.job_role || "");
      setIndustry(profile.industry || "");
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: unknown) => {
      const message =
        error && typeof error === "object" && "message" in error
          ? (error as { message?: string }).message
          : undefined;
      toast.error(message || "Failed to update profile");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      job_role: jobRole,
      industry: industry,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-black">Profile</h2>
          <p className="text-gray-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-black">Profile</h2>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-black flex items-center">
              <User className="w-5 h-5 mr-2" />
              Account Information
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your basic account details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Email</p>
                <p className="text-black">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Job Role</p>
                <p className="text-black">
                  {profile?.job_role || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Industry</p>
                <p className="text-black">
                  {profile?.industry || "Not specified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-white border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-black">Update Profile</CardTitle>
            <CardDescription className="text-gray-600">
              Update your professional information to get better insights
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-50 border-gray-300 text-gray-500"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-role" className="text-black font-medium">
                  Job Role
                </Label>
                <Select value={jobRole} onValueChange={setJobRole}>
                  <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing-manager">
                      Marketing Manager
                    </SelectItem>
                    <SelectItem value="product-manager">
                      Product Manager
                    </SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="data-analyst">Data Analyst</SelectItem>
                    <SelectItem value="business-owner">
                      Business Owner
                    </SelectItem>
                    <SelectItem value="consultant">Consultant</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-black font-medium">
                  Industry
                </Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Select your industry" />
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

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
