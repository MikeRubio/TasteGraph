import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Configuration constants
const CACHE_DURATION_MINUTES = 30;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Type definitions for validation
interface AudiencePersona {
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
  affinity_scores?: { [domain: string]: number };
}

interface CulturalTrend {
  title: string;
  description: string;
  confidence: number; // Should be 0-100
  impact: string;
  timeline: string;
  qloo_connection?: string;
  affinity_score?: number;
}

interface ContentSuggestion {
  title: string;
  description: string;
  platforms: string[];
  content_type: string;
  copy: string;
  engagement_potential: string;
  cultural_timing?: string;
  affinity_score?: number;
}

interface TasteIntersection {
  intersection_name: string;
  description: string;
  shared_attributes: string[];
  overlap_percentage: number;
  personas_involved: string[];
  common_interests: string[];
  shared_brands?: string[];
  behavioral_overlaps?: string[];
  marketing_opportunities: string[];
}

interface CrossDomainRecommendation {
  source_domain: string;
  target_domain: string;
  recommendation_title: string;
  description: string;
  confidence_score: number;
  related_entities: string[];
  expansion_opportunities: string[];
  audience_fit: number;
  implementation_difficulty: 'Low' | 'Medium' | 'High';
  potential_reach?: string;
}

interface InsightsResponse {
  audience_personas: AudiencePersona[];
  cultural_trends: CulturalTrend[];
  content_suggestions: ContentSuggestion[];
  taste_intersections: TasteIntersection[];
  cross_domain_recommendations: CrossDomainRecommendation[];
}

interface QlooResponse {
  taste_profile?: any;
  related_entities?: any;
  cultural_context?: any;
  confidence_scores?: any;
  demographics?: any;
  preferences?: any;
  affinity_scores?: any;
}

interface CacheEntry {
  id: string;
  qloo_response: QlooResponse;
  created_at: string;
}

interface QlooTag {
  id: string;
  name: string;
  category?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Initialize Supabase clients
    const supabaseServiceRole = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const supabaseAnon = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Manually verify the user's JWT token
    const { data: { user }, error: userError } = await supabaseAnon.auth.getUser(token);
    if (userError || !user) {
      console.error("Invalid token or user verification failed:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("User verified successfully:", user.id);

    // Parse request body
    const { project_id } = await req.json();
    if (!project_id) {
      console.error("Missing project_id in request");
      return new Response(
        JSON.stringify({ error: "Missing project_id" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get project details using service role
    const { data: project, error: projectError } = await supabaseServiceRole
      .from("projects")
      .select("*")
      .eq("id", project_id)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      console.error("Project not found or access denied:", projectError);
      return new Response(
        JSON.stringify({ error: "Project not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Processing project:", project.title);

    // Check for cached Qloo data
    let qloo_data = await getCachedQlooData(supabaseServiceRole, project);
    
    if (!qloo_data) {
      console.log("No valid cache found, fetching fresh Qloo data");
      qloo_data = await getQlooInsightsWithRetry(project);
      
      // Cache the Qloo response
      if (qloo_data) {
        await cacheQlooData(supabaseServiceRole, project, qloo_data);
      }
    } else {
      console.log("Using cached Qloo data");
    }

    // Generate insights using OpenAI with retry logic
    const insights = await generateInsightsWithOpenAIRetry(project, qloo_data);
    console.log("OpenAI insights generated successfully");

    // Validate insights structure
    const validationResult = validateInsightsStructure(insights);
    if (!validationResult.isValid) {
      console.error("Insights validation failed:", validationResult.errors);
      return new Response(
        JSON.stringify({ 
          error: "Generated insights failed validation",
          details: validationResult.errors
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Store validated insights in database
    const { data: savedInsight, error: insertError } = await supabaseServiceRole
      .from("insights")
      .insert([
        {
          project_id: project_id,
          audience_personas: insights.audience_personas,
          cultural_trends: insights.cultural_trends,
          content_suggestions: insights.content_suggestions,
          taste_intersections: insights.taste_intersections,
          cross_domain_recommendations: insights.cross_domain_recommendations,
          qloo_data: qloo_data,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Error saving insights:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save insights" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Insights saved successfully");

    return new Response(
      JSON.stringify({
        success: true,
        data: savedInsight,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-insights function:", error);
    
    // Extract specific error messages for better debugging
    let errorMessage = "Internal server error";
    let statusCode = 500;
    
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Check for specific API-related errors
      if (error.message.includes("QLOO_API_KEY not configured")) {
        errorMessage = "Qloo API key not configured. Please set QLOO_API_KEY in Supabase Edge Function environment variables.";
        statusCode = 401;
      } else if (error.message.includes("OPENAI_API_KEY not configured")) {
        errorMessage = "OpenAI API key not configured. Please set OPENAI_API_KEY in Supabase Edge Function environment variables.";
        statusCode = 401;
      } else if (error.message.includes("Qloo API error: Invalid API key")) {
        errorMessage = "Invalid Qloo API key. Please verify your QLOO_API_KEY in Supabase Edge Function settings.";
        statusCode = 401;
      } else if (error.message.includes("OpenAI API error: Invalid API key")) {
        errorMessage = "Invalid OpenAI API key. Please verify your OPENAI_API_KEY in Supabase Edge Function settings.";
        statusCode = 401;
      } else if (error.message.includes("rate limited")) {
        errorMessage = "API rate limit exceeded. Please try again later.";
        statusCode = 429;
      } else if (error.message.includes("Qloo API")) {
        errorMessage = "Qloo API service error. Please try again later.";
        statusCode = 502;
      } else if (error.message.includes("OpenAI API")) {
        errorMessage = "OpenAI API service error. Please try again later.";
        statusCode = 502;
      } else if (error.message.includes("Missing") && error.message.includes("authorization")) {
        errorMessage = "Missing or invalid authorization header";
        statusCode = 401;
      } else if (error.message.includes("Project not found")) {
        errorMessage = "Project not found or access denied";
        statusCode = 404;
      } else if (error.message.includes("Missing project_id")) {
        errorMessage = "Missing project_id in request";
        statusCode = 400;
      } else {
        // For debugging purposes, include the actual error message
        errorMessage = `Service error: ${error.message}`;
        statusCode = 502;
      }
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        timestamp: new Date().toISOString()
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Function to resolve free-text tags to Qloo tag IDs
async function resolveTagsToIds(tags: string[], tagType: 'domain' | 'geography', qlooApiKey: string, qlooBaseUrl: string): Promise<string[]> {
  const tagIds: string[] = [];
  
  for (const tag of tags) {
    try {
      console.log(`Resolving ${tagType} tag: ${tag}`);
      
      const tagResponse = await fetch(
        `${qlooBaseUrl}/v2/tags?type=${tagType}&query=${encodeURIComponent(tag)}`,
        {
          headers: {
            "x-api-key": qlooApiKey,
            "Accept": "application/json",
          },
        }
      );

      if (tagResponse.ok) {
        const tagData = await tagResponse.json();
        if (tagData.items?.length > 0) {
          tagIds.push(tagData.items[0].id);
          console.log(`Resolved ${tagType} "${tag}" to ID: ${tagData.items[0].id}`);
        } else {
          console.warn(`No ${tagType} tag ID found for: ${tag}`);
        }
      } else {
        console.warn(`Failed to resolve ${tagType} tag "${tag}": ${tagResponse.status}`);
      }
    } catch (error) {
      console.warn(`Error resolving ${tagType} tag "${tag}":`, error);
    }
  }
  
  return tagIds;
}

// Enhanced function to get insights from Qloo's Taste AI™ v2 with retry logic
async function getQlooInsightsWithRetry(project: any): Promise<QlooResponse> {
  const qlooApiKey = Deno.env.get("QLOO_API_KEY");
  const qlooBaseUrl = Deno.env.get("QLOO_BASE_URL") || "https://hackathon.api.qloo.com";
  
  if (!qlooApiKey) {
    throw new Error("QLOO_API_KEY not configured. Please set the Qloo API key in Supabase Edge Function environment variables.");
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Qloo API attempt ${attempt}/${MAX_RETRIES} with base URL:`, qlooBaseUrl);
      
      // Resolve cultural domains and geographical targets to tag IDs
      const culturalDomainIds = project.cultural_domains && project.cultural_domains.length > 0 
        ? await resolveTagsToIds(project.cultural_domains, 'domain', qlooApiKey, qlooBaseUrl)
        : [];
      
      const geographicalTargetIds = project.geographical_targets && project.geographical_targets.length > 0
        ? await resolveTagsToIds(project.geographical_targets, 'geography', qlooApiKey, qlooBaseUrl)
        : [];

      console.log("Resolved cultural domain IDs:", culturalDomainIds);
      console.log("Resolved geographical target IDs:", geographicalTargetIds);

      // Enhanced payload with resolved tag IDs as per v2 API specification
      const qlooPayload = {
        input: {
          description: project.description,
          industry: project.industry || "general",
          language: "en",
        },
        // signal block is for interests - always include even if empty
        signal: {
          interests: {
            tags: culturalDomainIds  // [] or [<ids>]
          }
        },
        // filter block is for geography - always include even if empty
        filter: {
          geography: {
            tags: geographicalTargetIds  // [] or [<ids>]
          }
        },
        options: {
          include_demographics: true,
          include_preferences: true,
          include_related_entities: true,
          taste_types: ["domains", "preferences", "affinity_scores"],
          entity_types: ["brands", "influencers", "media"]
        }
      };

      console.log("Qloo v2 request payload:", JSON.stringify(qlooPayload, null, 2));

      // Make the API call to Qloo v2/insights endpoint
      const qlooResponse = await fetch(`${qlooBaseUrl}/v2/insights`, {
        method: "POST",
        headers: {
          "x-api-key": qlooApiKey,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(qlooPayload),
      });

      console.log("Qloo API response status:", qlooResponse.status);

      // Handle rate limiting specifically
      if (qlooResponse.status === 429) {
        const errorText = await qlooResponse.text();
        console.error("Qloo API rate limited:", errorText);
        
        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY_MS * Math.pow(2, attempt); // Exponential backoff
          console.log(`Rate limited, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else {
          throw new Error("Qloo API rate limited. Please try again later.");
        }
      }

      // Handle client errors (4xx) - don't retry, return specific error
      if (qlooResponse.status >= 400 && qlooResponse.status < 500) {
        const errorText = await qlooResponse.text();
        console.error("Qloo API client error:", qlooResponse.status, errorText);
        console.error("Request payload that caused error:", JSON.stringify(qlooPayload, null, 2));
        
        // Return specific error messages for different 4xx codes
        let errorMessage = "Qloo API client error";
        switch (qlooResponse.status) {
          case 400:
            errorMessage = `Qloo API error ${qlooResponse.status}: ${errorText}`;
            break;
          case 401:
            errorMessage = "Qloo API error: Invalid API key";
            break;
          case 403:
            errorMessage = "Qloo API access forbidden";
            break;
          case 404:
            errorMessage = "Qloo API endpoint not found";
            break;
          default:
            errorMessage = `Qloo API client error: ${qlooResponse.status}`;
        }
        
        throw new Error(errorMessage);
      }

      // Handle server errors (5xx) - retry
      if (qlooResponse.status >= 500) {
        const errorText = await qlooResponse.text();
        console.error(`Qloo API server error (attempt ${attempt}):`, qlooResponse.status, errorText);
        console.error("Request payload:", JSON.stringify(qlooPayload, null, 2));
        
        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1); // Exponential backoff
          console.log(`Server error, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else {
          throw new Error("Qloo API service unavailable after retries");
        }
      }

      // Success case
      if (qlooResponse.ok) {
        const qlooData = await qlooResponse.json();
        console.log("Qloo API response received successfully");
        console.log("Qloo response structure:", JSON.stringify(qlooData, null, 2));
        return qlooData;
      }

    } catch (error) {
      console.error(`Qloo API error (attempt ${attempt}):`, error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        attempt: attempt,
        maxRetries: MAX_RETRIES
      });
      
      // If it's a client error (4xx), don't retry and throw immediately
      if (error.message.includes("client error") || error.message.includes("API key") || error.message.includes("forbidden")) {
        throw error;
      }
      
      if (attempt < MAX_RETRIES && !error.message.includes("rate limited")) {
        const delay = RETRY_DELAY_MS * attempt;
        console.log(`Network error, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      } else {
        throw new Error(`Qloo API error: ${error.message}`);
      }
    }
  }

  // This should never be reached, but just in case
  throw new Error("Qloo API: Maximum retries exceeded");
}

// Enhanced function to generate insights using OpenAI GPT with retry logic
async function generateInsightsWithOpenAIRetry(project: any, qloo_data: any): Promise<InsightsResponse> {
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!openaiApiKey) {
    throw new Error("OPENAI_API_KEY not configured. Please set the OpenAI API key in Supabase Edge Function environment variables.");
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`OpenAI API attempt ${attempt}/${MAX_RETRIES}`);
      
      const prompt = `
Based on the following project and enhanced cultural intelligence data from Qloo's Taste AI™ v2, generate detailed audience insights:

PROJECT DETAILS:
- Title: ${project.title}
- Description: ${project.description}
- Industry: ${project.industry || "General"}
- Cultural Domains: ${project.cultural_domains?.join(", ") || "General"}
- Geographical Targets: ${project.geographical_targets?.join(", ") || "Global"}

ENHANCED QLOO CULTURAL INTELLIGENCE DATA:
${JSON.stringify(qloo_data, null, 2)}

Please generate comprehensive insights with the following structure. IMPORTANT: 
- Confidence scores must be whole numbers between 0-100 (e.g., 85, not 0.85 or 85%)
- Affinity scores must be decimal numbers between 0-1 (e.g., 0.85, not 85)
- Include affinity_scores for each persona with at least 5 cultural domains
- Include taste_intersections showing overlaps between personas
- Include cross_domain_recommendations for market expansion

Format the response as valid JSON with this exact structure:
{
  "audience_personas": [
    {
      "name": "string",
      "description": "string",
      "characteristics": ["string"],
      "demographics": {
        "age_range": "string",
        "interests": ["string"],
        "platforms": ["string"]
      },
      "cultural_affinities": ["string"],
      "behavioral_patterns": ["string"],
      "affinity_scores": {
        "domain1": 0.85,
        "domain2": 0.72
      }
    }
  ],
  "cultural_trends": [
    {
      "title": "string",
      "description": "string",
      "confidence": 85,
      "impact": "string",
      "timeline": "string",
      "qloo_connection": "string",
      "affinity_score": 0.85
    }
  ],
  "content_suggestions": [
    {
      "title": "string",
      "description": "string",
      "platforms": ["string"],
      "content_type": "string",
      "copy": "string",
      "engagement_potential": "string",
      "cultural_timing": "string",
      "affinity_score": 0.85
    }
  ],
  "taste_intersections": [
    {
      "intersection_name": "string",
      "description": "string",
      "shared_attributes": ["string"],
      "overlap_percentage": 75,
      "personas_involved": ["string"],
      "common_interests": ["string"],
      "marketing_opportunities": ["string"]
    }
  ],
  "cross_domain_recommendations": [
    {
      "source_domain": "string",
      "target_domain": "string",
      "recommendation_title": "string",
      "description": "string",
      "confidence_score": 85,
      "related_entities": ["string"],
      "expansion_opportunities": ["string"],
      "audience_fit": 0.85,
      "implementation_difficulty": "Medium"
    }
  ]
}

Generate 3-4 personas, 4-5 trends, 6-8 content suggestions, 2-3 taste intersections, and 3-4 cross-domain recommendations. Ensure all insights are specific, actionable, and directly leverage the Qloo cultural intelligence data provided.
`;

      const requestPayload = {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert marketing strategist and cultural analyst specializing in audience insights and content strategy. You have deep expertise in interpreting Qloo's Taste AI™ cultural intelligence data and translating it into actionable marketing insights. Generate detailed, culturally-aware insights that leverage the full depth of Qloo's taste profiles, demographics, preferences, and affinity scores. Always respond with valid JSON in the exact format requested. Confidence scores must be whole numbers between 0-100. Affinity scores must be decimal numbers between 0-1."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      };

      console.log("OpenAI request payload:", JSON.stringify(requestPayload, null, 2));

      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      console.log("OpenAI API response status:", openaiResponse.status);

      // Handle rate limiting
      if (openaiResponse.status === 429) {
        const errorText = await openaiResponse.text();
        console.error("OpenAI API rate limited:", errorText);
        
        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY_MS * Math.pow(2, attempt); // Exponential backoff
          console.log(`Rate limited, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else {
          throw new Error("OpenAI API rate limited. Please try again later.");
        }
      }

      // Handle client errors (4xx) - don't retry, return specific error
      if (openaiResponse.status >= 400 && openaiResponse.status < 500) {
        const errorText = await openaiResponse.text();
        console.error("OpenAI API client error:", openaiResponse.status, errorText);
        console.error("Request payload that caused error:", JSON.stringify(requestPayload, null, 2));
        
        let errorMessage = "OpenAI API client error";
        switch (openaiResponse.status) {
          case 400:
            errorMessage = "Invalid request payload sent to OpenAI API";
            break;
          case 401:
            errorMessage = "OpenAI API error: Invalid API key";
            break;
          case 403:
            errorMessage = "OpenAI API access forbidden";
            break;
          case 404:
            errorMessage = "OpenAI API endpoint not found";
            break;
          default:
            errorMessage = `OpenAI API client error: ${openaiResponse.status}`;
        }
        
        throw new Error(errorMessage);
      }

      // Handle server errors (5xx) - retry
      if (openaiResponse.status >= 500) {
        const errorText = await openaiResponse.text();
        console.error(`OpenAI API server error (attempt ${attempt}):`, openaiResponse.status, errorText);
        console.error("Request payload:", JSON.stringify(requestPayload, null, 2));
        
        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
          console.log(`Server error, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else {
          throw new Error("OpenAI API service unavailable after retries");
        }
      }

      if (openaiResponse.ok) {
        const openaiData = await openaiResponse.json();
        const content = openaiData.choices[0].message.content;
        
        console.log("Raw OpenAI response content:", content);
        
        try {
          // Clean the response to ensure it's valid JSON
          const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsedInsights = JSON.parse(cleanedContent);
          
          console.log("OpenAI insights parsed successfully");
          console.log("Parsed insights structure:", JSON.stringify(parsedInsights, null, 2));
          
          return parsedInsights;
        } catch (parseError) {
          console.error("Error parsing OpenAI response:", parseError);
          console.error("Raw OpenAI content that failed to parse:", content);
          console.error("Cleaned content that failed to parse:", content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
          
          if (attempt < MAX_RETRIES) {
            console.log("Retrying due to parse error...");
            continue;
          } else {
            throw new Error("OpenAI API returned invalid JSON format after retries");
          }
        }
      }

    } catch (error) {
      console.error(`OpenAI API error (attempt ${attempt}):`, error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        attempt: attempt,
        maxRetries: MAX_RETRIES
      });
      
      // If it's a client error (4xx), don't retry and throw immediately
      if (error.message.includes("client error") || error.message.includes("API key") || error.message.includes("forbidden")) {
        throw error;
      }
      
      if (attempt < MAX_RETRIES && !error.message.includes("rate limited")) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`Network error, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      } else {
        throw new Error(`OpenAI API error: ${error.message}`);
      }
    }
  }

  // This should never be reached, but just in case
  throw new Error("OpenAI API: Maximum retries exceeded");
}

// Function to generate a cache key based on project parameters
function generateCacheKey(project: any): string {
  const keyData = {
    description: project.description,
    industry: project.industry || "",
    cultural_domains: project.cultural_domains || [],
    geographical_targets: project.geographical_targets || []
  };
  
  // Create a simple hash of the key data
  const keyString = JSON.stringify(keyData);
  let hash = 0;
  for (let i = 0; i < keyString.length; i++) {
    const char = keyString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// Enhanced function to check for cached Qloo data using dedicated cache table
async function getCachedQlooData(supabase: any, project: any): Promise<QlooResponse | null> {
  try {
    const cacheThreshold = new Date(Date.now() - CACHE_DURATION_MINUTES * 60 * 1000).toISOString();
    const requestHash = generateCacheKey(project);
    
    console.log("Checking cache with hash:", requestHash, "threshold:", cacheThreshold);
    
    const { data, error } = await supabase
      .from("qloo_cache")
      .select("qloo_response, created_at")
      .eq("request_hash", requestHash)
      .gte("created_at", cacheThreshold)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error checking cache:", error);
      return null;
    }

    if (data && data.qloo_response) {
      console.log("Found cached Qloo data from:", data.created_at);
      return data.qloo_response;
    }

    console.log("No valid cache entry found");
    return null;
  } catch (error) {
    console.error("Error in getCachedQlooData:", error);
    return null;
  }
}

// Enhanced function to cache Qloo data in dedicated cache table
async function cacheQlooData(supabase: any, project: any, qlooData: QlooResponse): Promise<void> {
  try {
    const requestHash = generateCacheKey(project);
    
    console.log("Caching Qloo data with hash:", requestHash);
    
    const { error } = await supabase
      .from("qloo_cache")
      .upsert([
        {
          project_id: project.id,
          request_hash: requestHash,
          industry: project.industry,
          description: project.description,
          cultural_domains: project.cultural_domains,
          geographical_targets: project.geographical_targets,
          qloo_response: qlooData,
        }
      ], {
        onConflict: "request_hash"
      });

    if (error) {
      console.error("Error caching Qloo data:", error);
    } else {
      console.log("Qloo data cached successfully");
    }
  } catch (error) {
    console.error("Error in cacheQlooData:", error);
  }
}

// Function to validate insights structure
function validateInsightsStructure(insights: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!insights || typeof insights !== 'object') {
    errors.push("Insights must be an object");
    return { isValid: false, errors };
  }

  // Validate audience_personas
  if (!Array.isArray(insights.audience_personas)) {
    errors.push("audience_personas must be an array");
  } else {
    insights.audience_personas.forEach((persona: any, index: number) => {
      if (!persona.name || typeof persona.name !== 'string') {
        errors.push(`Persona ${index}: name is required and must be a string`);
      }
      if (!persona.description || typeof persona.description !== 'string') {
        errors.push(`Persona ${index}: description is required and must be a string`);
      }
      if (!Array.isArray(persona.characteristics)) {
        errors.push(`Persona ${index}: characteristics must be an array`);
      }
      if (!persona.demographics || typeof persona.demographics !== 'object') {
        errors.push(`Persona ${index}: demographics must be an object`);
      } else {
        if (!persona.demographics.age_range || typeof persona.demographics.age_range !== 'string') {
          errors.push(`Persona ${index}: demographics.age_range is required and must be a string`);
        }
        if (!Array.isArray(persona.demographics.interests)) {
          errors.push(`Persona ${index}: demographics.interests must be an array`);
        }
        if (!Array.isArray(persona.demographics.platforms)) {
          errors.push(`Persona ${index}: demographics.platforms must be an array`);
        }
      }
    });
  }

  // Validate cultural_trends
  if (!Array.isArray(insights.cultural_trends)) {
    errors.push("cultural_trends must be an array");
  } else {
    insights.cultural_trends.forEach((trend: any, index: number) => {
      if (!trend.title || typeof trend.title !== 'string') {
        errors.push(`Trend ${index}: title is required and must be a string`);
      }
      if (!trend.description || typeof trend.description !== 'string') {
        errors.push(`Trend ${index}: description is required and must be a string`);
      }
      if (typeof trend.confidence !== 'number' || trend.confidence < 0 || trend.confidence > 100) {
        errors.push(`Trend ${index}: confidence must be a number between 0-100`);
      }
      if (!trend.impact || typeof trend.impact !== 'string') {
        errors.push(`Trend ${index}: impact is required and must be a string`);
      }
      if (!trend.timeline || typeof trend.timeline !== 'string') {
        errors.push(`Trend ${index}: timeline is required and must be a string`);
      }
    });
  }

  // Validate content_suggestions
  if (!Array.isArray(insights.content_suggestions)) {
    errors.push("content_suggestions must be an array");
  } else {
    insights.content_suggestions.forEach((suggestion: any, index: number) => {
      if (!suggestion.title || typeof suggestion.title !== 'string') {
        errors.push(`Content ${index}: title is required and must be a string`);
      }
      if (!suggestion.description || typeof suggestion.description !== 'string') {
        errors.push(`Content ${index}: description is required and must be a string`);
      }
      if (!Array.isArray(suggestion.platforms)) {
        errors.push(`Content ${index}: platforms must be an array`);
      }
      if (!suggestion.content_type || typeof suggestion.content_type !== 'string') {
        errors.push(`Content ${index}: content_type is required and must be a string`);
      }
      if (!suggestion.copy || typeof suggestion.copy !== 'string') {
        errors.push(`Content ${index}: copy is required and must be a string`);
      }
      if (!suggestion.engagement_potential || typeof suggestion.engagement_potential !== 'string') {
        errors.push(`Content ${index}: engagement_potential is required and must be a string`);
      }
    });
  }

  return { isValid: errors.length === 0, errors };
}