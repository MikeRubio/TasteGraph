import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface LiveDiscoveryRequest {
  description: string;
  industry?: string;
  cultural_domains?: string[];
  geographic_targets?: string[];
  age_range?: [number, number];
}

interface LivePersona {
  name: string;
  description: string;
  affinity_score: number;
  key_traits: string[];
  platforms: string[];
  confidence: number;
}

interface LiveTrend {
  title: string;
  description: string;
  strength: number;
  timeline: string;
  confidence: number;
}

interface LiveContent {
  title: string;
  description: string;
  platforms: string[];
  engagement_potential: number;
  confidence: number;
}

interface LiveInsights {
  personas: LivePersona[];
  trends: LiveTrend[];
  content: LiveContent[];
  market_fit_score: number;
  cultural_relevance: number;
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
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Initialize Supabase client
    const supabaseAnon = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Verify the user's JWT token
    const {
      data: { user },
      error: userError,
    } = await supabaseAnon.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const requestData: LiveDiscoveryRequest = await req.json();
    if (!requestData.description) {
      return new Response(
        JSON.stringify({ error: "Missing description" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Generating live insights for:", requestData.description);

    // Get Qloo insights for live discovery
    const qlooData = await getQlooLiveData(requestData);
    
    // Generate live insights using OpenAI
    const liveInsights = await generateLiveInsights(requestData, qlooData);

    return new Response(
      JSON.stringify({
        success: true,
        data: liveInsights,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in live-discovery function:", error);
    
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function getQlooLiveData(request: LiveDiscoveryRequest): Promise<any> {
  const qlooApiKey = Deno.env.get("QLOO_API_KEY");
  const qlooBaseUrl = Deno.env.get("QLOO_BASE_URL") || "https://hackathon.api.qloo.com";
  
  if (!qlooApiKey) {
    console.warn("QLOO_API_KEY not configured, using mock data");
    return { mock: true };
  }

  try {
    // Resolve cultural domain tags if provided
    const culturalDomainIds = request.cultural_domains?.length
      ? await resolveTagsToIds(request.cultural_domains, 'domain', qlooApiKey, qlooBaseUrl)
      : [];

    // Resolve geographical target tags if provided
    const geographicalTargetIds = request.geographic_targets?.length
      ? await resolveTagsToIds(request.geographic_targets, 'geography', qlooApiKey, qlooBaseUrl)
      : [];

    const payload: any = {
      input: {
        description: request.description,
        industry: request.industry || "general",
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

    // Only include signal if we have cultural domain tags
    if (culturalDomainIds.length > 0) {
      payload.signal = {
        type: "interests",
        tags: culturalDomainIds.map(id => ({ tag: id })),
      };
    }

    // Only include filter if we have geography tags
    if (geographicalTargetIds.length > 0) {
      payload.filter = {
        type: "geography",
        tags: geographicalTargetIds.map(id => ({ tag: id })),
      };
    }

    const response = await fetch(`${qlooBaseUrl}/v2/insights`, {
      method: "POST",
      headers: {
        "x-api-key": qlooApiKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(`Qloo API error: ${response.status}, using mock data`);
      return { mock: true };
    }

    return await response.json();
  } catch (error) {
    console.warn("Qloo API call failed, using mock data:", error);
    return { mock: true };
  }
}

async function resolveTagsToIds(
  tags: string[],
  tagType: 'domain' | 'geography',
  qlooApiKey: string,
  qlooBaseUrl: string
): Promise<string[]> {
  const tagIds: string[] = [];
  
  for (const tag of tags) {
    try {
      const response = await fetch(
        `${qlooBaseUrl}/v2/tags?type=${tagType}&query=${encodeURIComponent(tag)}`,
        {
          headers: {
            'x-api-key': qlooApiKey,
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        console.warn(`Failed to resolve ${tagType} tag "${tag}": ${response.status}`);
        continue;
      }
      
      const { items } = await response.json();
      if (items?.length) {
        tagIds.push(items[0].id);
      } else {
        console.warn(`No ${tagType} tag found for "${tag}"`);
      }
    } catch (error) {
      console.warn(`Error resolving ${tagType} tag "${tag}":`, error);
    }
  }
  
  return tagIds;
}

async function generateLiveInsights(
  request: LiveDiscoveryRequest,
  qlooData: any
): Promise<LiveInsights> {
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!openaiApiKey) {
    console.warn("OPENAI_API_KEY not configured, using mock insights");
    return generateMockLiveInsights(request);
  }

  try {
    const prompt = `
Based on the following input and Qloo cultural intelligence data, generate live audience insights:

INPUT DETAILS:
- Description: ${request.description}
- Industry: ${request.industry || "General"}
- Cultural Domains: ${request.cultural_domains?.join(", ") || "None specified"}
- Geographic Targets: ${request.geographic_targets?.join(", ") || "Global"}
- Age Range: ${request.age_range ? `${request.age_range[0]}-${request.age_range[1]}` : "All ages"}

QLOO CULTURAL DATA:
${JSON.stringify(qlooData, null, 2)}

Generate live insights optimized for speed and immediate actionability:

{
  "personas": [
    {
      "name": "string",
      "description": "string",
      "affinity_score": number (0-1),
      "key_traits": ["string"],
      "platforms": ["string"],
      "confidence": number (0-100)
    }
  ],
  "trends": [
    {
      "title": "string",
      "description": "string",
      "strength": number (0-100),
      "timeline": "string",
      "confidence": number (0-100)
    }
  ],
  "content": [
    {
      "title": "string",
      "description": "string",
      "platforms": ["string"],
      "engagement_potential": number (0-100),
      "confidence": number (0-100)
    }
  ],
  "market_fit_score": number (0-100),
  "cultural_relevance": number (0-100)
}

Generate 3 personas, 3 trends, and 4 content ideas. Focus on immediate actionability and high confidence scores.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert real-time audience analyst. Generate quick, actionable insights for live discovery. Always respond with valid JSON optimized for immediate use.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1536,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      console.warn(`OpenAI API error: ${response.status}, using mock insights`);
      return generateMockLiveInsights(request);
    }

    const openaiData = await response.json();
    const content = openaiData.choices[0].message.content;
    
    try {
      const cleanedContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      return JSON.parse(cleanedContent);
    } catch (parseError) {
      console.warn("Failed to parse OpenAI response, using mock insights");
      return generateMockLiveInsights(request);
    }
  } catch (error) {
    console.warn("OpenAI API call failed, using mock insights:", error);
    return generateMockLiveInsights(request);
  }
}

function generateMockLiveInsights(request: LiveDiscoveryRequest): LiveInsights {
  return {
    personas: [
      {
        name: "Digital Natives",
        description: "Tech-savvy millennials who embrace digital solutions",
        affinity_score: 0.89,
        key_traits: ["Early adopters", "Social media active", "Value convenience"],
        platforms: ["Instagram", "TikTok", "LinkedIn"],
        confidence: 92
      },
      {
        name: "Conscious Consumers",
        description: "Environmentally aware users seeking sustainable options",
        affinity_score: 0.76,
        key_traits: ["Sustainability-focused", "Research-driven", "Brand loyal"],
        platforms: ["Pinterest", "YouTube", "Twitter"],
        confidence: 84
      },
      {
        name: "Efficiency Seekers",
        description: "Busy professionals looking for time-saving solutions",
        affinity_score: 0.82,
        key_traits: ["Time-conscious", "ROI-focused", "Mobile-first"],
        platforms: ["LinkedIn", "Email", "Podcasts"],
        confidence: 88
      }
    ],
    trends: [
      {
        title: "AI-First Mindset",
        description: "Growing acceptance of AI-powered solutions in daily workflows",
        strength: 85,
        timeline: "Next 6-12 months",
        confidence: 91
      },
      {
        title: "Privacy-Conscious Adoption",
        description: "Increased demand for transparent data handling",
        strength: 78,
        timeline: "Current trend",
        confidence: 86
      },
      {
        title: "No-Code Movement",
        description: "Rising preference for solutions requiring minimal technical setup",
        strength: 72,
        timeline: "Next 12-18 months",
        confidence: 79
      }
    ],
    content: [
      {
        title: "Behind-the-Scenes AI Training",
        description: "Show how your AI learns from documents",
        platforms: ["YouTube", "TikTok"],
        engagement_potential: 87,
        confidence: 89
      },
      {
        title: "Customer Success Stories",
        description: "Real testimonials showing time savings",
        platforms: ["LinkedIn", "Website"],
        engagement_potential: 92,
        confidence: 94
      },
      {
        title: "Setup Speed Challenge",
        description: "Time-lapse video of complete setup process",
        platforms: ["Instagram", "Twitter"],
        engagement_potential: 78,
        confidence: 82
      },
      {
        title: "AI vs Human Response Comparison",
        description: "Side-by-side comparison of response quality",
        platforms: ["LinkedIn", "Blog"],
        engagement_potential: 85,
        confidence: 88
      }
    ],
    market_fit_score: 84,
    cultural_relevance: 79
  };
}