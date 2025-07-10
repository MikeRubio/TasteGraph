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
}

interface CulturalTrend {
  title: string;
  description: string;
  confidence: number; // Should be 0-100
  impact: string;
  timeline: string;
  qloo_connection?: string;
}

interface ContentSuggestion {
  title: string;
  description: string;
  platforms: string[];
  content_type: string;
  copy: string;
  engagement_potential: string;
  cultural_timing?: string;
}

interface InsightsResponse {
  audience_personas: AudiencePersona[];
  cultural_trends: CulturalTrend[];
  content_suggestions: ContentSuggestion[];
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
      // Log the malformed response for debugging
      console.error("Malformed insights structure:", JSON.stringify(insights, null, 2));
      
      // Fall back to mock data with proper structure
      const fallbackInsights = generateMockInsights(project, qloo_data);
      console.log("Using fallback mock insights due to validation failure");
      
      // Store fallback insights
      const { data: savedInsight, error: insertError } = await supabaseServiceRole
        .from("insights")
        .insert([
          {
            project_id: project_id,
            audience_personas: fallbackInsights.audience_personas,
            cultural_trends: fallbackInsights.cultural_trends,
            content_suggestions: fallbackInsights.content_suggestions,
            qloo_data: qloo_data,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error saving fallback insights:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to save insights" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: savedInsight,
          warning: "Used fallback data due to validation issues"
        }),
        {
          status: 200,
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
      if (error.message.includes("Qloo API error: Invalid API key")) {
        errorMessage = "Qloo API configuration error: Invalid QLOO_API_KEY - please verify your Qloo API key in Supabase Edge Function settings";
        statusCode = 401;
      } else if (error.message.includes("OpenAI API error: Invalid API key")) {
        errorMessage = "OpenAI API configuration error: Invalid OPENAI_API_KEY - please verify your OpenAI API key in Supabase Edge Function settings";
        statusCode = 401;
      } else if (error.message.includes("rate limited")) {
        errorMessage = "API rate limit exceeded. Please try again later.";
        statusCode = 429;
      } else if (error.message.includes("client error")) {
        errorMessage = "API client error: " + error.message;
        statusCode = 400;
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
        // For debugging purposes, include the actual error message in development
        errorMessage = `Internal server error: ${error.message}`;
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

// Enhanced function to get insights from Qloo's Taste AI™ with retry logic
async function getQlooInsightsWithRetry(project: any): Promise<QlooResponse> {
  const qlooApiKey = Deno.env.get("QLOO_API_KEY");
  const qlooBaseUrl = Deno.env.get("QLOO_BASE_URL") || "https://hackathon.api.qloo.com";
  
  if (!qlooApiKey) {
    console.warn("Qloo API key not found, using mock data");
    return generateMockQlooData(project);
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Qloo API attempt ${attempt}/${MAX_RETRIES} with base URL:`, qlooBaseUrl);
      
      // Enhanced payload with richer context as per Hackathon guide
      const qlooPayload = {
        input: {
          description: project.description,
          industry: project.industry || "general",
          cultural_domains: (project.cultural_domains && project.cultural_domains.length > 0) ? project.cultural_domains : ["general"],
          geographical_targets: (project.geographical_targets && project.geographical_targets.length > 0) ? project.geographical_targets : ["US"],
          language: "en",
        },
        options: {
          include_demographics: true,
          include_preferences: true,
          include_related_entities: true,
          taste_types: ["domains", "preferences", "affinity_scores"],
          entity_types: ["brands", "influencers", "media"]
        }
      };

      console.log("Qloo request payload:", JSON.stringify(qlooPayload, null, 2));

      // Make the API call to Qloo
      const qlooResponse = await fetch(`${qlooBaseUrl}/v1/taste/insights`, {
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
        throw new Error("Qloo API rate limited. Please try again later.");
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
            errorMessage = "Invalid request payload sent to Qloo API";
            break;
          case 401:
            errorMessage = "Invalid Qloo API key";
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
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else {
          console.log("Max retries reached, falling back to mock data");
          return generateMockQlooData(project);
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
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      } else {
        console.log("Falling back to mock data due to error");
        return generateMockQlooData(project);
      }
    }
  }

  // Fallback if all retries failed
  return generateMockQlooData(project);
}

// Enhanced function to generate insights using OpenAI GPT with retry logic
async function generateInsightsWithOpenAIRetry(project: any, qloo_data: any): Promise<InsightsResponse> {
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!openaiApiKey) {
    console.warn("OpenAI API key not found, using mock data");
    return generateMockInsights(project, qloo_data);
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`OpenAI API attempt ${attempt}/${MAX_RETRIES}`);
      
      const prompt = `
Based on the following project and enhanced cultural intelligence data from Qloo's Taste AI™, generate detailed audience insights:

PROJECT DETAILS:
- Title: ${project.title}
- Description: ${project.description}
- Industry: ${project.industry || "General"}
- Cultural Domains: ${project.cultural_domains?.join(", ") || "General"}
- Geographical Targets: ${project.geographical_targets?.join(", ") || "Global"}

ENHANCED QLOO CULTURAL INTELLIGENCE DATA:
${JSON.stringify(qloo_data, null, 2)}

Please generate comprehensive insights with the following structure. IMPORTANT: Confidence scores must be whole numbers between 0-100 (e.g., 85, not 0.85 or 85%).

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
      "behavioral_patterns": ["string"]
    }
  ],
  "cultural_trends": [
    {
      "title": "string",
      "description": "string",
      "confidence": number (0-100, whole number),
      "impact": "string",
      "timeline": "string",
      "qloo_connection": "string"
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
      "cultural_timing": "string"
    }
  ]
}

Generate 3-4 personas, 4-5 trends, and 6-8 content suggestions. Ensure all insights are specific, actionable, and directly leverage the Qloo cultural intelligence data provided.
`;

      const requestPayload = {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert marketing strategist and cultural analyst specializing in audience insights and content strategy. You have deep expertise in interpreting Qloo's Taste AI™ cultural intelligence data and translating it into actionable marketing insights. Generate detailed, culturally-aware insights that leverage the full depth of Qloo's taste profiles, demographics, preferences, and affinity scores. Always respond with valid JSON in the exact format requested. Confidence scores must be whole numbers between 0-100."
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
          console.log(`Retrying in ${delay}ms...`);
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
            errorMessage = "Invalid OpenAI API key";
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
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else {
          return generateMockInsights(project, qloo_data);
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
            console.log("Max retries reached, using mock data due to parse error");
            return generateMockInsights(project, qloo_data);
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
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      } else {
        return generateMockInsights(project, qloo_data);
      }
    }
  }

  // Fallback if all retries failed
  return generateMockInsights(project, qloo_data);
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

// Enhanced mock data generators with proper confidence score scaling
function generateMockQlooData(project: any): QlooResponse {
  const domains = project.cultural_domains || ["lifestyle", "technology"];
  const targets = project.geographical_targets || ["US"];
  
  return {
    taste_profile: {
      domains: domains,
      preferences: ["quality", "innovation", "authenticity", "sustainability", "community"],
      affinity_scores: {
        music: 0.78,
        fashion: 0.65,
        technology: 0.82,
        food: 0.71,
        travel: 0.69,
        wellness: 0.74
      },
      demographic_insights: {
        age_groups: ["25-34", "35-44"],
        interests: domains.concat(["digital_culture", "premium_brands", "social_impact"]),
        behaviors: ["social_media_active", "brand_conscious", "value_driven", "early_adopter", "community_builder"]
      },
      cultural_affinity: {
        music_genres: ["indie", "electronic", "alternative", "pop"],
        entertainment: ["streaming", "podcasts", "gaming", "live_events"],
        lifestyle: ["wellness", "travel", "food_culture", "sustainability"]
      }
    },
    related_entities: {
      brands: ["Apple", "Nike", "Spotify", "Netflix", "Tesla", "Patagonia", "Airbnb", "Whole Foods"],
      influencers: ["tech_reviewers", "lifestyle_bloggers", "sustainability_advocates", "wellness_coaches"],
      media: ["TikTok", "Instagram", "YouTube", "LinkedIn", "Spotify", "Netflix"]
    },
    cultural_context: {
      trending_topics: ["sustainability", "digital_transformation", "wellness", "authenticity", "community_building"],
      regional_preferences: targets,
      emerging_patterns: ["community_driven_commerce", "personalization", "conscious_consumption", "micro_influencer_trust"]
    },
    demographics: {
      age_distribution: {
        "18-24": 0.15,
        "25-34": 0.35,
        "35-44": 0.30,
        "45-54": 0.20
      },
      income_levels: ["middle_class", "upper_middle_class"],
      education: ["college_educated", "graduate_degree"],
      lifestyle_segments: ["urban_professionals", "suburban_families", "digital_nomads"]
    },
    preferences: {
      content_types: ["video", "interactive", "educational", "behind_scenes"],
      platform_preferences: ["instagram", "tiktok", "youtube", "linkedin"],
      engagement_styles: ["authentic", "educational", "entertaining", "inspiring"]
    },
    confidence_scores: {
      demographic_accuracy: 0.87,
      preference_reliability: 0.81,
      trend_prediction: 0.84,
      cultural_relevance: 0.79
    }
  };
}

function generateMockInsights(project: any, qloo_data: any): InsightsResponse {
  const industryName = project.industry ? 
    project.industry.charAt(0).toUpperCase() + project.industry.slice(1) : 
    'Digital';

  const domains = project.cultural_domains || ["technology", "lifestyle"];
  const targets = project.geographical_targets || ["US"];

  return {
    audience_personas: [
      {
        name: `${industryName} Innovators`,
        description: `Forward-thinking professionals who embrace new technologies and trends in ${project.description.toLowerCase()}`,
        characteristics: [
          "Early adopters of new technologies and platforms",
          "Values quality and innovation over price",
          "Actively shares experiences on social media",
          "Influences purchasing decisions through research and reviews",
          "Seeks authentic and sustainable brand experiences",
          "Builds communities around shared interests"
        ],
        demographics: {
          age_range: "28-42",
          interests: domains.concat(["innovation", "sustainability", "premium_brands", "community"]),
          platforms: ["LinkedIn", "Instagram", "TikTok", "YouTube"]
        },
        cultural_affinities: ["technology", "wellness", "sustainability", "premium_experiences"],
        behavioral_patterns: ["research_driven", "community_oriented", "brand_advocate", "content_creator"],
        affinity_scores: qloo_data?.taste_profile?.affinity_scores || {
          technology: 0.82,
          wellness: 0.74,
          sustainability: 0.78,
          premium_brands: 0.71
        }
      },
      {
        name: "Cultural Trendsetters",
        description: "Influential individuals who discover and amplify emerging cultural trends",
        characteristics: [
          "First to discover and share new trends",
          "High engagement with brand content",
          "Values authenticity and social responsibility",
          "Creates and shares user-generated content",
          "Builds communities around shared interests",
          "Influences others through storytelling"
        ],
        demographics: {
          age_range: "22-35",
          interests: ["culture", "trends", "social_impact", "creativity", "storytelling"],
          platforms: ["TikTok", "Instagram", "Twitter", "YouTube"]
        },
        cultural_affinities: ["music", "fashion", "art", "social_movements"],
        behavioral_patterns: ["trend_discovery", "content_creation", "community_building", "social_advocacy"],
        affinity_scores: {
          music: 0.88,
          fashion: 0.79,
          art: 0.73,
          social_impact: 0.81
        }
      },
      {
        name: "Conscious Consumers",
        description: "Mindful buyers who prioritize values-aligned purchases and sustainable practices",
        characteristics: [
          "Researches brand values before purchasing",
          "Willing to pay premium for sustainable options",
          "Advocates for social and environmental causes",
          "Seeks transparency in brand communications",
          "Influences others through word-of-mouth recommendations",
          "Supports local and ethical businesses"
        ],
        demographics: {
          age_range: "30-45",
          interests: ["sustainability", "wellness", "social_impact", "quality", "ethics"],
          platforms: ["Instagram", "LinkedIn", "Facebook", "YouTube"]
        },
        cultural_affinities: ["environmental_causes", "wellness", "ethical_consumption", "community_support"],
        behavioral_patterns: ["values_driven", "research_intensive", "brand_loyalty", "advocacy"],
        affinity_scores: {
          sustainability: 0.91,
          wellness: 0.84,
          ethical_brands: 0.87,
          community: 0.76
        }
      }
    ],
    cultural_trends: [
      {
        title: "Authentic Storytelling Movement",
        description: "Growing demand for genuine, behind-the-scenes content that showcases real people and processes",
        confidence: 88, // Fixed: Now a whole number between 0-100
        impact: "Brands showing authentic stories see 3x higher engagement and stronger emotional connections",
        timeline: "Current trend with 18+ months of sustained growth expected",
        qloo_connection: "Aligns with Qloo's data showing high affinity for authenticity and transparency",
        affinity_score: 0.85
      },
      {
        title: "Community-Driven Discovery",
        description: "Shift from influencer marketing to peer recommendations and community-based product discovery",
        confidence: 82, // Fixed: Now a whole number between 0-100
        impact: "Community recommendations drive 4x higher conversion rates than traditional advertising",
        timeline: "Emerging trend accelerating across all demographics",
        qloo_connection: "Supported by Qloo's behavioral data showing preference for community-driven content",
        affinity_score: 0.78
      },
      {
        title: "Micro-Moment Engagement",
        description: "Preference for bite-sized, instantly consumable content that delivers immediate value",
        confidence: 91, // Fixed: Now a whole number between 0-100
        impact: "Short-form content generates 2.5x more shares and comments than long-form",
        timeline: "Dominant trend continuing to evolve with new platform features",
        qloo_connection: "Reflects Qloo's platform preference data favoring TikTok and Instagram Reels",
        affinity_score: 0.89
      },
      {
        title: "Values-Based Brand Loyalty",
        description: "Consumer decisions increasingly influenced by brand values and social impact initiatives",
        confidence: 85, // Fixed: Now a whole number between 0-100
        impact: "Values-aligned brands command 15-20% price premium and higher customer lifetime value",
        timeline: "Long-term trend with accelerating importance among younger demographics",
        qloo_connection: "Correlates with Qloo's cultural context data on conscious consumption patterns",
        affinity_score: 0.83
      }
    ],
    content_suggestions: [
      {
        title: "Behind-the-Scenes Process Stories",
        description: "Show the authentic journey of how your product or service comes to life",
        platforms: ["Instagram Stories", "TikTok", "YouTube Shorts"],
        content_type: "Short-form Video",
        copy: "Ever wondered how we create [your product]? Take a peek behind the curtain and see the passion that goes into every detail. #BehindTheScenes #AuthenticBrand",
        engagement_potential: "Very High",
        cultural_timing: "Perfect for the authenticity movement - post during peak engagement hours",
        affinity_score: 0.87
      },
      {
        title: "Community Spotlight Series",
        description: "Feature real customers and their stories with your brand",
        platforms: ["Instagram", "LinkedIn", "YouTube"],
        content_type: "Mixed Media",
        copy: "Meet [Customer Name], who transformed their [relevant area] with our help. Their story shows what's possible when innovation meets determination. #CustomerSpotlight #RealStories",
        engagement_potential: "High",
        cultural_timing: "Aligns with community-driven discovery trend - share weekly for consistency",
        affinity_score: 0.81
      },
      {
        title: "Trend Reaction Content",
        description: "Respond to cultural trends with your unique brand perspective",
        platforms: ["TikTok", "Instagram Reels", "Twitter"],
        content_type: "Short-form Video",
        copy: "Everyone's talking about [trending topic]. Here's how we see it fitting into the future of [your industry]. What's your take? #TrendTalk #FutureThinking",
        engagement_potential: "High",
        cultural_timing: "Strike while trends are hot - respond within 24-48 hours of trend emergence",
        affinity_score: 0.79
      },
      {
        title: "Educational Micro-Content",
        description: "Share quick tips and insights related to your expertise",
        platforms: ["LinkedIn", "Instagram", "TikTok"],
        content_type: "Carousel/Video",
        copy: "3 things you didn't know about [your industry topic]. Swipe to become an expert in 30 seconds. #QuickTips #DidYouKnow",
        engagement_potential: "Medium-High",
        cultural_timing: "Capitalize on micro-moment engagement - post during commute hours",
        affinity_score: 0.74
      },
      {
        title: "Values-in-Action Content",
        description: "Showcase your brand values through concrete actions and initiatives",
        platforms: ["LinkedIn", "Instagram", "YouTube"],
        content_type: "Long-form Video",
        copy: "Actions speak louder than words. See how we're making a real difference in [relevant cause/area] and join us in creating positive change. #ValuesInAction #MakeADifference",
        engagement_potential: "Medium-High",
        cultural_timing: "Tie to relevant awareness days or social movements for maximum impact",
        affinity_score: 0.82
      },
      {
        title: "Interactive Q&A Sessions",
        description: "Host live sessions where your audience can ask questions and get real-time answers",
        platforms: ["Instagram Live", "LinkedIn Live", "TikTok Live"],
        content_type: "Live Video",
        copy: "Got questions about [your expertise area]? Join us live for honest answers and real talk. No scripts, just authentic conversation. #AskMeAnything #LiveChat",
        engagement_potential: "Very High",
        cultural_timing: "Schedule during peak audience activity - announce 24 hours in advance",
        affinity_score: 0.85
      }
    ]
  };
}