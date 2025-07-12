import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Download, 
  MessageCircle, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Lightbulb,
  Brain,
  Target,
  Calendar,
  BarChart3,
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: {
    type?: 'audience_analysis' | 'content_plan' | 'trend_insight' | 'general';
    data?: any;
  };
}

interface ConversationalPlanningProps {
  chatSessionId?: string;
}

const ConversationalPlanning: React.FC<ConversationalPlanningProps> = ({ 
  chatSessionId 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI audience discovery assistant powered by Qloo's cultural intelligence. I can help you discover audience segments, create content plans, analyze trends, and develop marketing strategies. What would you like to explore today?",
      timestamp: new Date(),
      metadata: { type: 'general' }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExportButton, setShowExportButton] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse = generateAIResponse(inputValue);
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Show export button if it's a content plan
      if (aiResponse.metadata?.type === 'content_plan') {
        setShowExportButton(true);
      }
      
    } catch (error) {
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    if (input.includes('audience') || input.includes('segment')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `Based on Qloo's cultural intelligence, I've identified several emerging audience segments in your target market:

**🎯 Digital Natives (25-35)**
- High affinity for sustainable brands (89%)
- Active on Instagram, TikTok, LinkedIn
- Values authenticity and transparency
- Influenced by peer recommendations

**🌱 Conscious Consumers (28-42)**
- Prioritizes environmental impact (92%)
- Research-driven purchasing decisions
- Prefers brands with clear values
- Active on Pinterest, YouTube

**⚡ Efficiency Seekers (30-45)**
- Time-conscious professionals (85%)
- Mobile-first interactions
- Values convenience and ROI
- Engages via LinkedIn, Email, Podcasts

These segments show 78% cultural alignment with current market trends. Would you like me to create a content strategy for any specific segment?`,
        timestamp: new Date(),
        metadata: { 
          type: 'audience_analysis',
          data: {
            segments: ['Digital Natives', 'Conscious Consumers', 'Efficiency Seekers'],
            confidence: 78
          }
        }
      };
    }
    
    if (input.includes('content plan') || input.includes('content strategy')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `Here's a comprehensive content plan for Gen Z music lovers based on Qloo's taste data:

**📱 Content Strategy Overview**

**Phase 1: Discovery (Weeks 1-2)**
- Behind-the-scenes artist collaborations
- Music discovery playlists with emerging artists
- Interactive polls about music preferences
- Platform: TikTok, Instagram Stories

**Phase 2: Engagement (Weeks 3-4)**
- User-generated content challenges
- Live music sessions and Q&As
- Trend-based music content
- Platform: TikTok, Instagram Reels, YouTube Shorts

**Phase 3: Community (Weeks 5-6)**
- Music festival coverage and reviews
- Artist interview series
- Fan community spotlights
- Platform: YouTube, Instagram, Twitter

**🎵 Content Themes:**
- Emerging genres (Hyperpop, Bedroom Pop)
- Music production tutorials
- Artist lifestyle content
- Festival and concert experiences

**📊 Expected Performance:**
- 85% engagement rate with music content
- 92% affinity with Gen Z music culture
- Peak posting: 6-9 PM weekdays, 2-5 PM weekends

Would you like me to detail specific content pieces or posting schedules?`,
        timestamp: new Date(),
        metadata: { 
          type: 'content_plan',
          data: {
            phases: 3,
            platforms: ['TikTok', 'Instagram', 'YouTube'],
            duration: '6 weeks'
          }
        }
      };
    }
    
    if (input.includes('trend') || input.includes('emerging')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `🔮 **Emerging Cultural Trends (Qloo Intelligence)**

**1. AI-First Mindset** (Confidence: 91%)
- Growing acceptance of AI in daily workflows
- 67% increase in AI tool adoption
- Timeline: Next 6-12 months

**2. Privacy-Conscious Adoption** (Confidence: 86%)
- Increased demand for transparent data handling
- 54% prefer brands with clear privacy policies
- Timeline: Current trend

**3. Micro-Community Culture** (Confidence: 82%)
- Shift from mass social to niche communities
- 43% growth in specialized interest groups
- Timeline: Next 12-18 months

**4. Sustainable Tech Integration** (Confidence: 79%)
- Eco-friendly technology preferences
- 38% willing to pay premium for sustainable tech
- Timeline: Next 18-24 months

These trends show strong correlation with your target demographics. Would you like me to analyze how these trends could impact your marketing strategy?`,
        timestamp: new Date(),
        metadata: { 
          type: 'trend_insight',
          data: {
            trends: 4,
            avgConfidence: 84.5
          }
        }
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: `I can help you with various audience discovery and planning tasks:

**🎯 Audience Analysis**
- Discover emerging segments
- Analyze cultural affinities
- Map demographic patterns

**📝 Content Planning**
- Create content strategies
- Generate campaign ideas
- Optimize posting schedules

**📈 Trend Insights**
- Identify emerging trends
- Predict cultural shifts
- Analyze market opportunities

**🚀 Strategy Development**
- Market fit analysis
- Competitive positioning
- Growth recommendations

What specific area would you like to explore? You can ask me questions like:
- "What audience segments are emerging in eco-fashion?"
- "Help me create a content plan for Gen Z music lovers"
- "What trends should I watch in the tech industry?"`,
      timestamp: new Date(),
      metadata: { type: 'general' }
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExportPlan = () => {
    const contentMessages = messages.filter(m => 
      m.metadata?.type === 'content_plan' || m.metadata?.type === 'audience_analysis'
    );
    
    const exportData = {
      session_id: chatSessionId,
      generated_at: new Date().toISOString(),
      messages: contentMessages,
      summary: "AI-generated audience insights and content strategy"
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversational_plan_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Plan exported successfully!');
  };

  const copyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'audience_analysis': return <Users className="w-4 h-4" />;
      case 'content_plan': return <Lightbulb className="w-4 h-4" />;
      case 'trend_insight': return <TrendingUp className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getMessageBadge = (type?: string) => {
    switch (type) {
      case 'audience_analysis': return 'Audience Analysis';
      case 'content_plan': return 'Content Strategy';
      case 'trend_insight': return 'Trend Insight';
      default: return 'AI Assistant';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-black">
                Conversational Discovery & Planning
              </h1>
              <p className="text-sm text-gray-600">
                AI-powered audience insights with Qloo's cultural intelligence
              </p>
            </div>
          </div>
          
          {showExportButton && (
            <Button
              onClick={handleExportPlan}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Plan
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`max-w-3xl ${message.type === 'user' ? 'ml-12' : 'mr-12'}`}>
              {message.type === 'ai' && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    {getMessageIcon(message.metadata?.type)}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {getMessageBadge(message.metadata?.type)}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              )}
              
              <Card className={`${
                message.type === 'user' 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white border-gray-200'
              } relative group`}>
                <CardContent className="p-4">
                  {message.type === 'user' && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-300">You</span>
                      <span className="text-xs text-gray-300">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="prose prose-sm max-w-none">
                    <div className={`whitespace-pre-wrap ${
                      message.type === 'user' ? 'text-white' : 'text-black'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                  
                  {message.type === 'ai' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyMessage(message.id, message.content)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-in slide-in-from-bottom-2">
            <div className="max-w-3xl mr-12">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  AI Assistant
                </Badge>
              </div>
              
              <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about audience segments, content strategies, trends..."
              className="min-h-[44px] resize-none border-gray-300 focus:border-black focus:ring-black"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-black hover:bg-gray-800 text-white h-[44px] px-4"
          >
            {isLoading ? (
              <Sparkles className="w-4 h-4 animate-pulse" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            "What audience segments are emerging in eco-fashion?",
            "Help me create a content plan for Gen Z music lovers",
            "What trends should I watch in the tech industry?",
            "Analyze the gaming audience for my app"
          ].map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setInputValue(suggestion)}
              className="text-xs border-gray-300 text-gray-600 hover:bg-gray-50"
              disabled={isLoading}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationalPlanning;