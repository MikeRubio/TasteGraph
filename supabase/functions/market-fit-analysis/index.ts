import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface MarketFitRequest {
  product_description: string;
  category?: string;
  price_range?: string;
  target_regions?: string[];
}

interface MarketSegment {
  name: string;
  match_percentage: number;
  description: string;
  audience_size: string;
  key_characteristics: string[];
  recommended_channels: string[];
  price_sensitivity: 'Low' | 'Medium' | 'High';
  competition_level: 'Low' | 'Medium' | 'High';
}

interface MarketFitResponse {
  segments: MarketSegment[];
  market_size_estimate: {
    tam: string;
    sam: string;
    som: string;
  };
  competitive_landscape: {
    similar_products: string[];
    market_gaps: string[];
    positioning_opportunities: string[];
  };
  recommendations: {
    primary_target: string;
    launch_strategy: string;
    pricing_insights: string;
    content_strategy: string[];
  };
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
    const requestData: MarketFitRequest = await req.json();
    if (!requestData.product_description) {
      return new Response(
        JSON.stringify({ error: "Missing product_description" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Analyzing market fit for:", requestData.product_description);

    // Get Qloo insights for market analysis
    const qlooData = await getQlooMarketData(requestData);
    
    // Generate market analysis using OpenAI
    const marketAnalysis = await generateMarketAnalysis(requestData, qlooData);

    return new Response(
      JSON.stringify({
        success: true,
        data: marketAnalysis,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in market-fit-analysis function:", error);
    
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

async function getQlooMarketData(request: MarketFitRequest): Promise<any> {
  const qlooApiKey = Deno.env.get("QLOO_API_KEY");
  const qlooBaseUrl = Deno.env.get("QLOO_BASE_URL") || "https://hackathon.api.qloo.com";
  
  if (!qlooApiKey) {
    console.warn("QLOO_API_KEY not configured, using mock data");
    return { mock: true };
  }

  try {
    const payload = {
      input: {
        description: request.product_description,
        industry: request.category || "general",
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

async function generateMarketAnalysis(
  request: MarketFitRequest,
  qlooData: any
): Promise<MarketFitResponse> {
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!openaiApiKey) {
    console.warn("OPENAI_API_KEY not configured, using mock analysis");
    return generateMockMarketAnalysis(request);
  }

  try {
    const prompt = `
Based on the following product and Qloo cultural intelligence data, generate a comprehensive market fit analysis:

PRODUCT DETAILS:
- Description: ${request.product_description}
- Category: ${request.category || "General"}
- Price Range: ${request.price_range || "Not specified"}
- Target Regions: ${request.target_regions?.join(", ") || "Global"}

QLOO CULTURAL DATA:
${JSON.stringify(qlooData, null, 2)}

Generate a detailed market fit analysis with the following structure:

{
  "segments": [
    {
      "name": "string",
      "match_percentage": number (0-100),
      "description": "string",
      "audience_size": "string",
      "key_characteristics": ["string"],
      "recommended_channels": ["string"],
      "price_sensitivity": "Low|Medium|High",
      "competition_level": "Low|Medium|High"
    }
  ],
  "market_size_estimate": {
    "tam": "string (e.g., $10B)",
    "sam": "string (e.g., $2B)",
    "som": "string (e.g., $100M)"
  },
  "competitive_landscape": {
    "similar_products": ["string"],
    "market_gaps": ["string"],
    "positioning_opportunities": ["string"]
  },
  "recommendations": {
    "primary_target": "string",
    "launch_strategy": "string",
    "pricing_insights": "string",
    "content_strategy": ["string"]
  }
}

Generate 3-4 market segments, realistic market sizing, and actionable recommendations.
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
            content: "You are an expert market analyst specializing in product-market fit analysis. Generate detailed, realistic market insights based on cultural intelligence data. Always respond with valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.warn(`OpenAI API error: ${response.status}, using mock analysis`);
      return generateMockMarketAnalysis(request);
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
      console.warn("Failed to parse OpenAI response, using mock analysis");
      return generateMockMarketAnalysis(request);
    }
  } catch (error) {
    console.warn("OpenAI API call failed, using mock analysis:", error);
    return generateMockMarketAnalysis(request);
  }
}

function generateMockMarketAnalysis(request: MarketFitRequest): MarketFitResponse {
  return {
    segments: [
      {
        name: "Tech-Savvy Early Adopters",
        match_percentage: 85,
        description: "Technology enthusiasts who embrace new solutions quickly",
        audience_size: "2.5M potential users",
        key_characteristics: [
          "High disposable income",
          "Active on social media",
          "Values innovation and efficiency",
          "Willing to pay premium for quality"
        ],
        recommended_channels: ["LinkedIn", "Product Hunt", "Tech blogs"],
        price_sensitivity: "Low",
        competition_level: "Medium"
      },
      {
        name: "Small Business Owners",
        match_percentage: 72,
        description: "Entrepreneurs seeking cost-effective business solutions",
        audience_size: "1.8M potential users",
        key_characteristics: [
          "Budget-conscious",
          "Time-constrained",
          "ROI-focused",
          "Values customer support"
        ],
        recommended_channels: ["Google Ads", "Business forums", "Email marketing"],
        price_sensitivity: "High",
        competition_level: "High"
      },
      {
        name: "Enterprise Decision Makers",
        match_percentage: 68,
        description: "Corporate leaders evaluating scalable solutions",
        audience_size: "500K potential users",
        key_characteristics: [
          "Risk-averse",
          "Compliance-focused",
          "Long sales cycles",
          "Values security and reliability"
        ],
        recommended_channels: ["Industry events", "Sales outreach", "Case studies"],
        price_sensitivity: "Low",
        competition_level: "Low"
      }
    ],
    market_size_estimate: {
      tam: "$12.5B",
      sam: "$2.1B",
      som: "$180M"
    },
    competitive_landscape: {
      similar_products: ["Intercom", "Zendesk Chat", "Drift", "Crisp"],
      market_gaps: [
        "AI-powered document training",
        "No-code setup for non-technical users",
        "Industry-specific customization"
      ],
      positioning_opportunities: [
        "Focus on ease of implementation",
        "Emphasize AI accuracy",
        "Target specific industries"
      ]
    },
    recommendations: {
      primary_target: "Tech-Savvy Early Adopters",
      launch_strategy: "Product Hunt launch followed by tech community engagement",
      pricing_insights: "Freemium model with premium AI features",
      content_strategy: [
        "Technical blog posts about AI implementation",
        "Case studies showing ROI",
        "Video demos of setup process",
        "Comparison guides vs competitors"
      ]
    }
  };
}