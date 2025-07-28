import { supabase } from './supabase';

export interface Project {
  id: string;
  title: string;
  description: string;
  cultural_domains?: string[];
  geographical_targets?: string[];
  industry?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Conversational Planning API
export interface ConversationalMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: {
    type?: 'general' | 'audience_analysis' | 'content_plan' | 'trend_insight';
    confidence?: number;
    sources?: string[];
  };
}

export interface Insight {
  id: string;
  project_id: string;
  audience_personas: any[];
  cultural_trends: any[];
  content_suggestions: any[];
  qloo_data: any;
  created_at: string;
}

// Enhanced interfaces for affinity scores
export interface AffinityScores {
  [domain: string]: number; // 0-1 scale from Qloo
}

export interface AudiencePersona {
  name: string;
  description: string;
  characteristics: string[];
  demographics: {
    age_range: string;
    interests: string[];
    platforms: string[];
  };
  cultural_affinities?: string[];
  behavioral_patterns?: string[];
  affinity_scores?: AffinityScores;
}

export interface CulturalTrend {
  title: string;
  description: string;
  confidence: number;
  impact: string;
  timeline: string;
  qloo_connection?: string;
  affinity_score?: number; // 0-1 scale
}

export interface ContentSuggestion {
  title: string;
  description: string;
  platforms: string[];
  content_type: string;
  copy: string;
  engagement_potential: string;
  cultural_timing?: string;
  affinity_score?: number; // 0-1 scale
}

export interface TasteIntersection {
  intersection_name: string;
  description: string;
  shared_attributes: string[];
  overlap_percentage: number; // 0-100
  personas_involved: string[];
  common_interests: string[];
  shared_brands?: string[];
  behavioral_overlaps?: string[];
  marketing_opportunities: string[];
}

export interface CrossDomainRecommendation {
  source_domain: string;
  target_domain: string;
  recommendation_title: string;
  description: string;
  confidence_score: number; // 0-100
  related_entities: string[];
  expansion_opportunities: string[];
  audience_fit: number; // 0-1 scale
  implementation_difficulty: 'Low' | 'Medium' | 'High';
  potential_reach?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  job_role?: string;
  industry?: string;
  created_at: string;
  updated_at: string;
}

// Projects API
export const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .insert([{ ...project, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProjects = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getProject = async (id: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Insights API
export const generateInsights = async (projectId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-insights`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
export const sendConversationalQuery = async (
  message: string,
  chatHistory: ConversationalMessage[] = [],
  projectId?: string
): Promise<ConversationalMessage> => {
  const { data, error } = await supabase.functions.invoke('conversational-planning', {
    body: {
      message,
      chatHistory: chatHistory.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      })),
      projectId
    }
  });

  if (error) throw error;
  
  // Convert timestamp back to Date object
  return {
    ...data,
    timestamp: new Date(data.timestamp)
  };
};
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ project_id: projectId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate insights: ${response.status}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to generate insights');
  }
  
  return result.data;
};

export const getInsights = async (projectId: string) => {
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// User Profile API
export const getUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (updates: Partial<UserProfile>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert([{ 
      id: user.id, 
      email: user.email || '', 
      ...updates, 
      updated_at: new Date().toISOString() 
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Dashboard Statistics API
export interface DashboardStats {
  total_projects: number;
  total_insights: number;
  total_personas: number;
  total_trends: number;
  total_content_suggestions: number;
  total_taste_intersections: number;
  total_cross_domain_recommendations: number;
  total_api_queries: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get total projects count
  const { count: projectsCount, error: projectsError } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (projectsError) throw projectsError;

  // Get all insights for the user's projects
  const { data: insights, error: insightsError } = await supabase
    .from('insights')
    .select(`
      id,
      audience_personas,
      cultural_trends,
      content_suggestions,
      projects!inner(user_id)
    `)
    .eq('projects.user_id', user.id);

  if (insightsError) throw insightsError;

  // Calculate detailed counts from actual data
  let totalPersonas = 0;
  let totalTrends = 0;
  let totalContentSuggestions = 0;
  let totalTasteIntersections = 0;
  let totalCrossDomainRecommendations = 0;

  insights?.forEach(insight => {
    totalPersonas += insight.audience_personas?.length || 0;
    totalTrends += insight.cultural_trends?.length || 0;
    totalContentSuggestions += insight.content_suggestions?.length || 0;
    
    // Note: These fields might not exist in older insights, so we handle gracefully
    if (insight.taste_intersections) {
      totalTasteIntersections += insight.taste_intersections.length || 0;
    }
    if (insight.cross_domain_recommendations) {
      totalCrossDomainRecommendations += insight.cross_domain_recommendations.length || 0;
    }
  });

  return {
    total_projects: projectsCount || 0,
    total_insights: insights?.length || 0,
    total_personas: totalPersonas,
    total_trends: totalTrends,
    total_content_suggestions: totalContentSuggestions,
    total_taste_intersections: totalTasteIntersections,
    total_cross_domain_recommendations: totalCrossDomainRecommendations,
    // API queries could be tracked separately in the future
    total_api_queries: (insights?.length || 0) * 2, // Rough estimate: 1 Qloo + 1 OpenAI call per insight
  };
}