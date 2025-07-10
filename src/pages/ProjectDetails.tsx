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
  Zap,
  GitMerge,
  Layers,
  ArrowRight,
  Network,
  Link2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Rest of the code remains the same...

export default ProjectDetails;