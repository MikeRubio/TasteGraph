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
  business_model?: string;
  target_audience?: string;
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
  engagement_potential: number;
  conversion_likelihood: number;
  market_maturity: 'Early' | 'Growing' | 'Mature' | 'Declining';
  cultural_alignment: number;
}

interface CompetitorAnalysis {
  name: string;
  market_share: number;
  strengths: string[];
  weaknesses: string[];
  pricing_strategy: string;
  target_segments: string[];
  differentiation_opportunity: string;
}

interface MarketOpportunity {
  title: string;
  description: string;
  market_size: string;
  difficulty: 'Low' | 'Medium' | 'High';
  time_to_market: string;
  investment_required: string;
  success_probability: number;
}

interface LaunchStrategy {
  phase: string;
  timeline: string;
  key_activities: string[];
  success_metrics: string[];
  budget_allocation: string;
  risk_factors: string[];
}

interface MarketFitResponse {
  segments: MarketSegment[];
  market_size_estimate: {
    tam: string;
    sam: string;
    som: string;
    growth_rate: string;
    market_trends: string[];
  };
  competitive_landscape: {
    similar_products: string[];
    market_gaps: string[];
    positioning_opportunities: string[];
    competitive_analysis: CompetitorAnalysis[];
  };
  recommendations: {
    primary_target: string;
    launch_strategy: LaunchStrategy[];
    pricing_insights: string;
    content_strategy: string[];
    go_to_market_timeline: string;
  };
  market_opportunities: MarketOpportunity[];
  risk_assessment: {
    high_risk: string[];
    medium_risk: string[];
    low_risk: string[];
    mitigation_strategies: string[];
  };
  cultural_insights: {
    trending_themes: string[];
    cultural_moments: string[];
    seasonal_opportunities: string[];
    demographic_shifts: string[];
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
    // Resolve cultural domain tags if provided
    const culturalDomainIds = request.category
      ? await resolveTagsToIds([request.category], 'domain', qlooApiKey, qlooBaseUrl)
      : [];

    // Resolve geographical target tags if provided
    const geographicalTargetIds = request.target_regions?.length
      ? await resolveTagsToIds(request.target_regions, 'geography', qlooApiKey, qlooBaseUrl)
      : [];

    const payload: any = {
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
- Business Model: ${request.business_model || "Not specified"}
- Target Audience: ${request.target_audience || "Not specified"}

QLOO CULTURAL DATA:
${JSON.stringify(qlooData, null, 2)}

Generate a detailed market fit analysis with enhanced insights including cultural intelligence, competitive analysis, and strategic recommendations. Format as valid JSON with this structure:

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
      "competition_level": "Low|Medium|High",
      "engagement_potential": number (0-100),
      "conversion_likelihood": number (0-100),
      "market_maturity": "Early|Growing|Mature|Declining",
      "cultural_alignment": number (0-100)
    }
  ],
  "market_size_estimate": {
    "tam": "string",
    "sam": "string", 
    "som": "string",
    "growth_rate": "string",
    "market_trends": ["string"]
  },
  "competitive_landscape": {
    "similar_products": ["string"],
    "market_gaps": ["string"],
    "positioning_opportunities": ["string"],
    "competitive_analysis": [
      {
        "name": "string",
        "market_share": number,
        "strengths": ["string"],
        "weaknesses": ["string"],
        "pricing_strategy": "string",
        "target_segments": ["string"],
        "differentiation_opportunity": "string"
      }
    ]
  },
  "recommendations": {
    "primary_target": "string",
    "launch_strategy": [
      {
        "phase": "string",
        "timeline": "string",
        "key_activities": ["string"],
        "success_metrics": ["string"],
        "budget_allocation": "string",
        "risk_factors": ["string"]
      }
    ],
    "pricing_insights": "string",
    "content_strategy": ["string"],
    "go_to_market_timeline": "string"
  },
  "market_opportunities": [
    {
      "title": "string",
      "description": "string",
      "market_size": "string",
      "difficulty": "Low|Medium|High",
      "time_to_market": "string",
      "investment_required": "string",
      "success_probability": number (0-100)
    }
  ],
  "risk_assessment": {
    "high_risk": ["string"],
    "medium_risk": ["string"],
    "low_risk": ["string"],
    "mitigation_strategies": ["string"]
  },
  "cultural_insights": {
    "trending_themes": ["string"],
    "cultural_moments": ["string"],
    "seasonal_opportunities": ["string"],
    "demographic_shifts": ["string"]
  }
}

Generate 3-4 market segments, detailed competitive analysis, comprehensive launch strategy, and cultural insights based on Qloo data.
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
            content: "You are an expert market analyst and business strategist specializing in product-market fit analysis. Generate comprehensive, actionable market insights based on cultural intelligence data. Always respond with valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 3072,
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
        match_percentage: 92,
        description: "Technology enthusiasts who embrace AI solutions and are willing to pay premium for cutting-edge tools",
        audience_size: "2.5M potential users",
        key_characteristics: [
          "High disposable income ($75K+ annually)",
          "Active on professional networks",
          "Values innovation and efficiency",
          "Influences purchasing decisions in organizations",
          "Early adopters of SaaS tools"
        ],
        recommended_channels: ["LinkedIn", "Product Hunt", "Tech blogs", "Developer communities"],
        price_sensitivity: "Low",
        competition_level: "Medium",
        engagement_potential: 89,
        conversion_likelihood: 76,
        market_maturity: "Growing",
        cultural_alignment: 94
      },
      {
        name: "Small Business Owners",
        match_percentage: 78,
        description: "Entrepreneurs and SMB owners seeking cost-effective automation solutions",
        audience_size: "1.8M potential users",
        key_characteristics: [
          "Budget-conscious decision makers",
          "Time-constrained operations",
          "ROI-focused purchasing",
          "Values customer support and training",
          "Prefers proven solutions"
        ],
        recommended_channels: ["Google Ads", "Business forums", "Email marketing", "Webinars"],
        price_sensitivity: "High",
        competition_level: "High",
        engagement_potential: 72,
        conversion_likelihood: 68,
        market_maturity: "Mature",
        cultural_alignment: 81
      },
      {
        name: "Enterprise Decision Makers",
        match_percentage: 85,
        description: "Corporate leaders evaluating scalable AI solutions for customer service",
        audience_size: "500K potential users",
        key_characteristics: [
          "Risk-averse evaluation process",
          "Compliance and security focused",
          "Long sales cycles (6-12 months)",
          "Values vendor reliability and support",
          "Requires integration capabilities"
        ],
        recommended_channels: ["Industry events", "Sales outreach", "Case studies", "Analyst reports"],
        price_sensitivity: "Low",
        competition_level: "Low",
        engagement_potential: 94,
        conversion_likelihood: 82,
        market_maturity: "Early",
        cultural_alignment: 88
      }
    ],
    market_size_estimate: {
      tam: "$12.5B",
      sam: "$2.1B",
      som: "$180M",
      growth_rate: "23% CAGR",
      market_trends: [
        "AI adoption accelerating across industries",
        "Customer service automation demand rising",
        "No-code/low-code solutions gaining traction",
        "Privacy-first AI becoming requirement"
      ]
    },
    competitive_landscape: {
      similar_products: ["Intercom", "Zendesk Chat", "Drift", "Crisp", "Freshchat"],
      market_gaps: [
        "AI-powered document training without technical setup",
        "Industry-specific customization out-of-the-box",
        "Privacy-first AI with transparent data handling",
        "Seamless integration with existing documentation"
      ],
      positioning_opportunities: [
        "Focus on zero-setup AI training",
        "Emphasize privacy-first approach",
        "Target specific industries with tailored solutions",
        "Highlight superior AI accuracy and context understanding"
      ],
      competitive_analysis: [
        {
          name: "Intercom",
          market_share: 25,
          strengths: ["Brand recognition", "Feature completeness", "Enterprise sales"],
          weaknesses: ["Complex setup", "High pricing", "Limited AI customization"],
          pricing_strategy: "Premium enterprise pricing",
          target_segments: ["Enterprise", "Mid-market SaaS"],
          differentiation_opportunity: "Simpler setup and better AI training"
        },
        {
          name: "Zendesk Chat",
          market_share: 20,
          strengths: ["Market presence", "Integration ecosystem", "Support infrastructure"],
          weaknesses: ["Legacy architecture", "Limited AI capabilities", "User experience"],
          pricing_strategy: "Tiered subscription model",
          target_segments: ["Enterprise", "Traditional businesses"],
          differentiation_opportunity: "Modern AI-first approach"
        }
      ]
    },
    recommendations: {
      primary_target: "Tech-Savvy Early Adopters",
      launch_strategy: [
        {
          phase: "Phase 1: Product Hunt Launch",
          timeline: "Month 1-2",
          key_activities: [
            "Product Hunt launch campaign",
            "Tech community engagement",
            "Influencer outreach",
            "Content marketing launch"
          ],
          success_metrics: ["500+ Product Hunt votes", "1000+ signups", "50+ beta users"],
          budget_allocation: "$15K marketing spend",
          risk_factors: ["Competition timing", "Feature readiness"]
        },
        {
          phase: "Phase 2: Enterprise Validation",
          timeline: "Month 3-6",
          key_activities: [
            "Enterprise pilot programs",
            "Case study development",
            "Sales team hiring",
            "Partnership development"
          ],
          success_metrics: ["5+ enterprise pilots", "2+ case studies", "$50K ARR"],
          budget_allocation: "$50K sales & marketing",
          risk_factors: ["Sales cycle length", "Feature gaps"]
        }
      ],
      pricing_insights: "Freemium model with $29/month starter tier, $99/month professional, $299/month enterprise",
      content_strategy: [
        "Technical blog posts about AI implementation",
        "Customer success stories and ROI case studies",
        "Video demos showing setup process",
        "Comparison guides vs competitors",
        "Industry-specific use case content"
      ],
      go_to_market_timeline: "6-month aggressive launch with enterprise focus by month 4"
    },
    market_opportunities: [
      {
        title: "Healthcare Documentation AI",
        description: "Specialized AI for medical documentation and patient communication",
        market_size: "$2.3B addressable market",
        difficulty: "High",
        time_to_market: "12-18 months",
        investment_required: "$500K-1M",
        success_probability: 75
      },
      {
        title: "E-commerce Support Automation",
        description: "AI trained on product catalogs for shopping assistance",
        market_size: "$1.8B addressable market",
        difficulty: "Medium",
        time_to_market: "6-9 months",
        investment_required: "$200K-400K",
        success_probability: 85
      },
      {
        title: "Legal Document AI Assistant",
        description: "AI for legal document analysis and client communication",
        market_size: "$3.1B addressable market",
        difficulty: "High",
        time_to_market: "18-24 months",
        investment_required: "$1M-2M",
        success_probability: 65
      }
    ],
    risk_assessment: {
      high_risk: [
        "Large competitors launching similar AI features",
        "Regulatory changes affecting AI in customer service",
        "Economic downturn reducing SaaS spending"
      ],
      medium_risk: [
        "Technical challenges with AI accuracy",
        "Customer acquisition cost higher than expected",
        "Integration complexity with existing systems"
      ],
      low_risk: [
        "Market demand for AI solutions",
        "Team technical capabilities",
        "Initial product-market fit validation"
      ],
      mitigation_strategies: [
        "Build strong IP and technical moats",
        "Diversify across multiple market segments",
        "Maintain lean operations and flexible pricing",
        "Focus on customer success and retention"
      ]
    },
    cultural_insights: {
      trending_themes: [
        "AI transparency and explainability",
        "Privacy-first technology adoption",
        "Remote work communication tools",
        "Automation without job displacement"
      ],
      cultural_moments: [
        "AI regulation discussions increasing awareness",
        "Customer service quality becoming differentiator",
        "Small business digital transformation acceleration"
      ],
      seasonal_opportunities: [
        "Q4: Budget planning season for enterprise",
        "Q1: New year digital transformation initiatives",
        "Back-to-school: Educational institution adoption"
      ],
      demographic_shifts: [
        "Gen Z entering workforce with AI expectations",
        "Remote-first companies needing better tools",
        "SMBs becoming more tech-savvy"
      ]
    }
  };
}