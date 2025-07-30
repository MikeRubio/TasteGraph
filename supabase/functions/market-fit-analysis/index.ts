import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface MarketFitRequest {
  description: string
  industry: string
  targetMarket: string
  businessModel: string
}

interface MarketSegment {
  name: string
  match_percentage: number
  engagement_potential: number
  conversion_likelihood: number
  market_maturity: 'Early' | 'Growing' | 'Mature' | 'Declining'
  cultural_alignment: number
  size_estimate: string
  key_characteristics: string[]
  recommended_approach: string
}

interface MarketOpportunity {
  title: string
  description: string
  success_probability: number
  investment_required: string
  time_to_market: string
  difficulty: 'Low' | 'Medium' | 'High'
}

interface Competitor {
  name: string
  market_share: number
  strengths: string[]
  weaknesses: string[]
  differentiation_opportunity: string
}

interface LaunchPhase {
  phase: string
  timeline: string
  budget_range: string
  key_activities: string[]
  success_metrics: string[]
  risk_factors: string[]
}

interface CulturalInsight {
  theme: string
  relevance_score: number
  description: string
  timing_opportunity: string
}

interface MarketFitResponse {
  overall_fit_score: number
  segments: MarketSegment[]
  market_size_estimate: {
    total_addressable_market: string
    serviceable_addressable_market: string
    serviceable_obtainable_market: string
    growth_rate: number
    market_trends: string[]
  }
  competitive_landscape: {
    market_saturation: 'Low' | 'Medium' | 'High'
    key_competitors: Competitor[]
    market_gaps: string[]
    positioning_opportunities: string[]
  }
  market_opportunities: MarketOpportunity[]
  risk_assessment: {
    overall_risk: 'Low' | 'Medium' | 'High'
    market_risks: string[]
    competitive_risks: string[]
    execution_risks: string[]
    mitigation_strategies: string[]
  }
  launch_strategy: {
    recommended_phases: LaunchPhase[]
    go_to_market_approach: string
    key_partnerships: string[]
    success_timeline: string
  }
  cultural_insights: {
    trending_themes: CulturalInsight[]
    cultural_moments: string[]
    seasonal_opportunities: string[]
    demographic_shifts: string[]
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { description, industry, targetMarket, businessModel }: MarketFitRequest = await req.json()

    if (!description || !industry || !targetMarket) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: description, industry, targetMarket' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create OpenAI client
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Construct the AI prompt for comprehensive market analysis
    const prompt = `You are an expert market analyst with deep knowledge of cultural trends, consumer behavior, and business strategy. Analyze the following product/service for market fit and provide a comprehensive assessment.

Product/Service Details:
- Description: ${description}
- Industry: ${industry}
- Target Market: ${targetMarket}
- Business Model: ${businessModel}

Please provide a detailed market fit analysis in the following JSON format. Be specific, realistic, and data-driven in your analysis:

{
  "overall_fit_score": [number between 0-100],
  "segments": [
    {
      "name": "segment name",
      "match_percentage": [0-100],
      "engagement_potential": [0-100],
      "conversion_likelihood": [0-100],
      "market_maturity": "Early|Growing|Mature|Declining",
      "cultural_alignment": [0-100],
      "size_estimate": "estimated size",
      "key_characteristics": ["characteristic1", "characteristic2"],
      "recommended_approach": "specific approach"
    }
  ],
  "market_size_estimate": {
    "total_addressable_market": "$X billion",
    "serviceable_addressable_market": "$X billion",
    "serviceable_obtainable_market": "$X million",
    "growth_rate": [percentage],
    "market_trends": ["trend1", "trend2"]
  },
  "competitive_landscape": {
    "market_saturation": "Low|Medium|High",
    "key_competitors": [
      {
        "name": "competitor name",
        "market_share": [percentage],
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "differentiation_opportunity": "opportunity description"
      }
    ],
    "market_gaps": ["gap1", "gap2"],
    "positioning_opportunities": ["opportunity1", "opportunity2"]
  },
  "market_opportunities": [
    {
      "title": "opportunity title",
      "description": "detailed description",
      "success_probability": [0-100],
      "investment_required": "$X-Y",
      "time_to_market": "X-Y months",
      "difficulty": "Low|Medium|High"
    }
  ],
  "risk_assessment": {
    "overall_risk": "Low|Medium|High",
    "market_risks": ["risk1", "risk2"],
    "competitive_risks": ["risk1", "risk2"],
    "execution_risks": ["risk1", "risk2"],
    "mitigation_strategies": ["strategy1", "strategy2"]
  },
  "launch_strategy": {
    "recommended_phases": [
      {
        "phase": "Phase X: Name",
        "timeline": "X-Y months",
        "budget_range": "$X-Y",
        "key_activities": ["activity1", "activity2"],
        "success_metrics": ["metric1", "metric2"],
        "risk_factors": ["risk1", "risk2"]
      }
    ],
    "go_to_market_approach": "approach description",
    "key_partnerships": ["partner1", "partner2"],
    "success_timeline": "timeline description"
  },
  "cultural_insights": {
    "trending_themes": [
      {
        "theme": "theme name",
        "relevance_score": [0-100],
        "description": "theme description",
        "timing_opportunity": "timing description"
      }
    ],
    "cultural_moments": ["moment1", "moment2"],
    "seasonal_opportunities": ["opportunity1", "opportunity2"],
    "demographic_shifts": ["shift1", "shift2"]
  }
}

Provide realistic, industry-specific insights. Consider current market conditions, cultural trends, and consumer behavior patterns. Make sure all numerical values are realistic and all arrays contain relevant, specific items.`

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert market analyst. Always respond with valid JSON that matches the requested format exactly.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const openaiData = await openaiResponse.json()
    const aiContent = openaiData.choices[0]?.message?.content

    if (!aiContent) {
      throw new Error('No content received from OpenAI')
    }

    // Parse the AI response
    let marketAnalysis: MarketFitResponse
    try {
      marketAnalysis = JSON.parse(aiContent)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent)
      throw new Error('Invalid JSON response from AI')
    }

    // Validate the response structure
    if (!marketAnalysis.overall_fit_score || !marketAnalysis.segments) {
      throw new Error('Invalid market analysis structure')
    }

    return new Response(
      JSON.stringify(marketAnalysis),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Market fit analysis error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate market analysis',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})