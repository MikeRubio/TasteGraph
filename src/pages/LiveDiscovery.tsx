import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Users, 
  TrendingUp, 
  Lightbulb,
  Save,
  RefreshCw,
  Clock,
  Target,
  Globe,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

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

const LiveDiscovery = () => {
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [culturalDomains, setCulturalDomains] = useState<string[]>([]);
  const [geographicTargets, setGeographicTargets] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState([25, 45]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<LiveInsights | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const CULTURAL_DOMAINS = [
    'Music', 'Fashion', 'Gaming', 'Sports', 'Technology', 'Food', 
    'Film', 'Art', 'Travel', 'Fitness', 'Beauty', 'Books'
  ];

  const GEOGRAPHIC_TARGETS = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 
    'Germany', 'France', 'Japan', 'Brazil', 'India', 'Global'
  ];

  // Debounced live generation
  useEffect(() => {
    if (description.length > 20) {
      const timer = setTimeout(() => {
        generateLiveInsights();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [description, industry, culturalDomains, geographicTargets, ageRange]);

  const generateLiveInsights = async () => {
    if (!description.trim()) return;

    setIsGenerating(true);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock live insights - replace with actual API call
      const mockInsights: LiveInsights = {
        personas: [
          {
            name: 'Digital Natives',
            description: 'Tech-savvy millennials who embrace digital solutions',
            affinity_score: 0.89,
            key_traits: ['Early adopters', 'Social media active', 'Value convenience'],
            platforms: ['Instagram', 'TikTok', 'LinkedIn'],
            confidence: 92
          },
          {
            name: 'Conscious Consumers',
            description: 'Environmentally aware users seeking sustainable options',
            affinity_score: 0.76,
            key_traits: ['Sustainability-focused', 'Research-driven', 'Brand loyal'],
            platforms: ['Pinterest', 'YouTube', 'Twitter'],
            confidence: 84
          },
          {
            name: 'Efficiency Seekers',
            description: 'Busy professionals looking for time-saving solutions',
            affinity_score: 0.82,
            key_traits: ['Time-conscious', 'ROI-focused', 'Mobile-first'],
            platforms: ['LinkedIn', 'Email', 'Podcasts'],
            confidence: 88
          }
        ],
        trends: [
          {
            title: 'AI-First Mindset',
            description: 'Growing acceptance of AI-powered solutions in daily workflows',
            strength: 85,
            timeline: 'Next 6-12 months',
            confidence: 91
          },
          {
            title: 'Privacy-Conscious Adoption',
            description: 'Increased demand for transparent data handling',
            strength: 78,
            timeline: 'Current trend',
            confidence: 86
          },
          {
            title: 'No-Code Movement',
            description: 'Rising preference for solutions requiring minimal technical setup',
            strength: 72,
            timeline: 'Next 12-18 months',
            confidence: 79
          }
        ],
        content: [
          {
            title: 'Behind-the-Scenes AI Training',
            description: 'Show how your AI learns from documents',
            platforms: ['YouTube', 'TikTok'],
            engagement_potential: 87,
            confidence: 89
          },
          {
            title: 'Customer Success Stories',
            description: 'Real testimonials showing time savings',
            platforms: ['LinkedIn', 'Website'],
            engagement_potential: 92,
            confidence: 94
          },
          {
            title: 'Setup Speed Challenge',
            description: 'Time-lapse video of complete setup process',
            platforms: ['Instagram', 'Twitter'],
            engagement_potential: 78,
            confidence: 82
          },
          {
            title: 'AI vs Human Response Comparison',
            description: 'Side-by-side comparison of response quality',
            platforms: ['LinkedIn', 'Blog'],
            engagement_potential: 85,
            confidence: 88
          }
        ],
        market_fit_score: 84,
        cultural_relevance: 79
      };

      setInsights(mockInsights);
      setLastUpdate(new Date());
      
    } catch (error) {
      toast.error('Failed to generate live insights');
      console.error('Live insights error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAsProject = () => {
    if (!insights) return;
    
    // This would navigate to create project with pre-filled data
    toast.success('Insights saved as new project!');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'bg-green-500';
    if (strength >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-black">Live Discovery Tool</h2>
        <p className="text-gray-600 mt-1">
          Real-time audience exploration with instant AI-powered insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Live Input Panel
            </CardTitle>
            <CardDescription className="text-gray-600">
              Adjust parameters to see real-time insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-black">
                Product/Service Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your product or service..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white border-gray-300 text-black placeholder-gray-400 min-h-20"
              />
              {description.length > 0 && (
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {isGenerating ? 'Generating insights...' : 'Live analysis active'}
                  </div>
                  <span>{description.length} characters</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="text-black">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="bg-white border-gray-300 text-black">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-black">Cultural Domains</Label>
              <div className="flex flex-wrap gap-2">
                {CULTURAL_DOMAINS.map((domain) => (
                  <Badge
                    key={domain}
                    className={`cursor-pointer px-3 py-1 rounded-lg transition-all ${
                      culturalDomains.includes(domain)
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      setCulturalDomains(prev =>
                        prev.includes(domain)
                          ? prev.filter(d => d !== domain)
                          : [...prev, domain]
                      );
                    }}
                  >
                    {domain}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-black">Geographic Targets</Label>
              <div className="flex flex-wrap gap-2">
                {GEOGRAPHIC_TARGETS.map((target) => (
                  <Badge
                    key={target}
                    className={`cursor-pointer px-3 py-1 rounded-lg transition-all ${
                      geographicTargets.includes(target)
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      setGeographicTargets(prev =>
                        prev.includes(target)
                          ? prev.filter(t => t !== target)
                          : [...prev, target]
                      );
                    }}
                  >
                    {target}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-black">
                Target Age Range: {ageRange[0]} - {ageRange[1]} years
              </Label>
              <Slider
                value={ageRange}
                onValueChange={setAgeRange}
                max={70}
                min={18}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={generateLiveInsights}
                disabled={isGenerating || !description.trim()}
                className="flex-1 bg-black hover:bg-gray-800 text-white"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Insights'}
              </Button>
              
              {insights && (
                <Button
                  onClick={handleSaveAsProject}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save as Project
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Live Results
              </div>
              {lastUpdate && (
                <div className="text-xs text-gray-600">
                  Updated {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </CardTitle>
            <CardDescription className="text-gray-600">
              Real-time insights powered by Qloo's cultural intelligence
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="text-center text-gray-600">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                  Analyzing cultural patterns...
                </div>
              </div>
            ) : insights ? (
              <div className="space-y-6">
                {/* Overall Scores */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {insights.market_fit_score}%
                    </div>
                    <div className="text-xs text-gray-600">Market Fit Score</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {insights.cultural_relevance}%
                    </div>
                    <div className="text-xs text-gray-600">Cultural Relevance</div>
                  </div>
                </div>

                {/* Live Personas */}
                <div>
                  <h4 className="text-lg font-semibold text-black mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Live Personas ({insights.personas.length})
                  </h4>
                  <div className="space-y-3">
                    {insights.personas.map((persona, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-black">{persona.name}</h5>
                          <div className="flex items-center space-x-2">
                            <div className={`text-sm font-bold ${getConfidenceColor(persona.confidence)}`}>
                              {persona.confidence}%
                            </div>
                            <div className="text-xs text-gray-600">confidence</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{persona.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {persona.key_traits.slice(0, 2).map((trait, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {trait}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-blue-600">
                              {Math.round(persona.affinity_score * 100)}%
                            </div>
                            <div className="text-xs text-gray-600">affinity</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Trends */}
                <div>
                  <h4 className="text-lg font-semibold text-black mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Live Trends ({insights.trends.length})
                  </h4>
                  <div className="space-y-3">
                    {insights.trends.map((trend, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-black">{trend.title}</h5>
                          <div className={`text-sm font-bold ${getConfidenceColor(trend.confidence)}`}>
                            {trend.confidence}%
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{trend.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">{trend.timeline}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getStrengthColor(trend.strength)} transition-all duration-500`}
                                style={{ width: `${trend.strength}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{trend.strength}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Content */}
                <div>
                  <h4 className="text-lg font-semibold text-black mb-3 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Live Content Ideas ({insights.content.length})
                  </h4>
                  <div className="space-y-3">
                    {insights.content.map((content, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-black">{content.title}</h5>
                          <div className={`text-sm font-bold ${getConfidenceColor(content.confidence)}`}>
                            {content.confidence}%
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{content.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {content.platforms.slice(0, 2).map((platform, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-yellow-600">
                              {content.engagement_potential}%
                            </div>
                            <div className="text-xs text-gray-600">engagement</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">
                  Ready for Live Discovery
                </h3>
                <p className="text-gray-600">
                  Enter a product description to start generating real-time insights
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveDiscovery;