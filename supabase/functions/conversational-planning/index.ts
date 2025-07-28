import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  metadata?: {
    type?: 'audience_analysis' | 'content_plan' | 'trend_insight' | 'general';
    data?: any;
  };
}

interface ConversationalRequest {
  message: string;
  chatHistory: Message[];
  projectId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, chatHistory, projectId }: ConversationalRequest = await req.json()

    if (!message?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Analyze message intent and determine response type
    const messageIntent = analyzeMessageIntent(message)
    
    // Build context from chat history
    const conversationContext = buildConversationContext(chatHistory)
    
    // Create system prompt based on intent
    const systemPrompt = createSystemPrompt(messageIntent, conversationContext)
    
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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text()
      console.error('OpenAI API error:', error)
      throw new Error('Failed to generate AI response')
    }

    const openaiData = await openaiResponse.json()
    const aiContent = openaiData.choices[0]?.message?.content

    if (!aiContent) {
      throw new Error('No response generated from AI')
    }

    // Create response with metadata
    const response = {
      id: crypto.randomUUID(),
      type: 'ai' as const,
      content: aiContent,
      timestamp: new Date().toISOString(),
      metadata: {
        type: messageIntent,
        data: extractMetadata(aiContent, messageIntent)
      }
    }

    // Store conversation in database if projectId provided
    if (projectId) {
      await supabaseClient
        .from('conversations')
        .insert({
          project_id: projectId,
          message_type: 'ai',
          content: aiContent,
          metadata: response.metadata
        })
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Conversational planning error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function analyzeMessageIntent(message: string): 'audience_analysis' | 'content_plan' | 'trend_insight' | 'general' {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('audience') || lowerMessage.includes('segment') || lowerMessage.includes('persona')) {
    return 'audience_analysis'
  }
  
  if (lowerMessage.includes('content') || lowerMessage.includes('campaign') || lowerMessage.includes('strategy') || lowerMessage.includes('plan')) {
    return 'content_plan'
  }
  
  if (lowerMessage.includes('trend') || lowerMessage.includes('emerging') || lowerMessage.includes('future') || lowerMessage.includes('prediction')) {
    return 'trend_insight'
  }
  
  return 'general'
}

function buildConversationContext(chatHistory: Message[]): string {
  if (!chatHistory || chatHistory.length === 0) {
    return 'This is the start of a new conversation.'
  }
  
  const recentMessages = chatHistory.slice(-5) // Last 5 messages for context
  const context = recentMessages
    .map(msg => `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`)
    .join('\n')
  
  return `Previous conversation context:\n${context}\n\nCurrent query:`
}

function createSystemPrompt(intent: string, context: string): string {
  const basePrompt = `You are an AI assistant specialized in audience discovery and marketing strategy, powered by Qloo's cultural intelligence platform. You help marketers understand their audiences, create content strategies, and identify cultural trends.

${context}

Your responses should be:
- Professional and actionable
- Based on cultural intelligence and data-driven insights
- Specific and detailed with concrete examples
- Formatted with clear structure using markdown
- Include confidence percentages and specific recommendations when relevant

`

  switch (intent) {
    case 'audience_analysis':
      return basePrompt + `Focus on providing detailed audience segment analysis including:
- Demographic and psychographic profiles
- Cultural affinities and interests
- Platform preferences and behaviors
- Engagement patterns and preferences
- Specific targeting recommendations`

    case 'content_plan':
      return basePrompt + `Focus on creating comprehensive content strategies including:
- Multi-phase content plans with timelines
- Platform-specific recommendations
- Content themes and formats
- Engagement optimization tactics
- Cultural timing and seasonal opportunities
- Sample content ideas with copy suggestions`

    case 'trend_insight':
      return basePrompt + `Focus on cultural trend analysis including:
- Emerging cultural movements and shifts
- Confidence levels and timeline predictions
- Impact on target audiences
- Marketing opportunities and timing
- Cross-domain cultural connections`

    default:
      return basePrompt + `Provide helpful guidance on audience discovery, content planning, or trend analysis. Ask clarifying questions if needed to better assist the user.`
  }
}

function extractMetadata(content: string, intent: string): any {
  // Extract structured data from AI response for frontend use
  const metadata: any = {}
  
  switch (intent) {
    case 'audience_analysis':
      // Count segments mentioned
      const segmentMatches = content.match(/\*\*(.*?)\*\*/g) || []
      metadata.segments = segmentMatches.slice(0, 5).map(match => match.replace(/\*\*/g, ''))
      metadata.confidence = extractConfidenceScore(content)
      break
      
    case 'content_plan':
      // Extract phases and platforms
      const phaseMatches = content.match(/Phase \d+/g) || []
      metadata.phases = phaseMatches.length
      metadata.platforms = extractPlatforms(content)
      metadata.duration = extractDuration(content)
      break
      
    case 'trend_insight':
      // Extract trends and confidence
      const trendMatches = content.match(/\d+\.\s\*\*(.*?)\*\*/g) || []
      metadata.trends = trendMatches.length
      metadata.avgConfidence = extractConfidenceScore(content)
      break
  }
  
  return metadata
}

function extractConfidenceScore(content: string): number {
  const confidenceMatch = content.match(/(\d+)%\s*(confidence|match|alignment)/i)
  return confidenceMatch ? parseInt(confidenceMatch[1]) : 75
}

function extractPlatforms(content: string): string[] {
  const platforms = ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter', 'Facebook', 'Pinterest']
  return platforms.filter(platform => content.includes(platform))
}

function extractDuration(content: string): string {
  const durationMatch = content.match(/(\d+[-–]\d+\s*(weeks?|months?))/i)
  return durationMatch ? durationMatch[1] : '6-8 weeks'
}