import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3, 
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Zap,
  Star,
  TrendingDown,
  Shield,
  Award,
  Rocket,
  Brain,
  Eye,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

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

interface MarketAnalysis {
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

const MarketFit = () => {
  const [productDescription, setProductDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [targetRegions, setTargetRegions] = useState<string[]>([]);
  const [businessModel, setBusinessModel] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [debouncedDescription, setDebouncedDescription] = useState('');

  // Debounce the product description for real-time analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDescription(productDescription);
    }, 1000);

    return () => clearTimeout(timer);
  }, [productDescription]);

  // Real-time analysis when description changes
  useEffect(() => {
    if (debouncedDescription.length > 20) {
      handleAnalyze();
    }
  }, [debouncedDescription]);

  const handleAnalyze = async () => {
    if (!productDescription.trim()) {
      toast.error('Please enter a product description');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate API call - in real implementation, this would call your Edge Function
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Enhanced mock analysis data
      const mockAnalysis: MarketAnalysis = {
        segments: [
          {
            name: 'Tech-Savvy Early Adopters',
            match_percentage: 92,
            description: 'Technology enthusiasts who embrace AI solutions and are willing to pay premium for cutting-edge tools',
            audience_size: '2.5M potential users',
            key_characteristics: [
              'High disposable income ($75K+ annually)',
              'Active on professional networks',
              'Values innovation and efficiency',
              'Influences purchasing decisions in organizations',
              'Early adopters of SaaS tools'
            ],
            recommended_channels: ['LinkedIn', 'Product Hunt', 'Tech blogs', 'Developer communities'],
            price_sensitivity: 'Low',
            competition_level: 'Medium',
            engagement_potential: 89,
            conversion_likelihood: 76,
            market_maturity: 'Growing',
            cultural_alignment: 94
          },
          {
            name: 'Small Business Owners',
            match_percentage: 78,
            description: 'Entrepreneurs and SMB owners seeking cost-effective automation solutions',
            audience_size: '1.8M potential users',
            key_characteristics: [
              'Budget-conscious decision makers',
              'Time-constrained operations',
              'ROI-focused purchasing',
              'Values customer support and training',
              'Prefers proven solutions'
            ],
            recommended_channels: ['Google Ads', 'Business forums', 'Email marketing', 'Webinars'],
            price_sensitivity: 'High',
            competition_level: 'High',
            engagement_potential: 72,
            conversion_likelihood: 68,
            market_maturity: 'Mature',
            cultural_alignment: 81
          },
          {
            name: 'Enterprise Decision Makers',
            match_percentage: 85,
            description: 'Corporate leaders evaluating scalable AI solutions for customer service',
            audience_size: '500K potential users',
            key_characteristics: [
              'Risk-averse evaluation process',
              'Compliance and security focused',
              'Long sales cycles (6-12 months)',
              'Values vendor reliability and support',
              'Requires integration capabilities'
            ],
            recommended_channels: ['Industry events', 'Sales outreach', 'Case studies', 'Analyst reports'],
            price_sensitivity: 'Low',
            competition_level: 'Low',
            engagement_potential: 94,
            conversion_likelihood: 82,
            market_maturity: 'Early',
            cultural_alignment: 88
          }
        ],
        market_size_estimate: {
          tam: '$12.5B',
          sam: '$2.1B',
          som: '$180M',
          growth_rate: '23% CAGR',
          market_trends: [
            'AI adoption accelerating across industries',
            'Customer service automation demand rising',
            'No-code/low-code solutions gaining traction',
            'Privacy-first AI becoming requirement'
          ]
        },
        competitive_landscape: {
          similar_products: ['Intercom', 'Zendesk Chat', 'Drift', 'Crisp', 'Freshchat'],
          market_gaps: [
            'AI-powered document training without technical setup',
            'Industry-specific customization out-of-the-box',
            'Privacy-first AI with transparent data handling',
            'Seamless integration with existing documentation'
          ],
          positioning_opportunities: [
            'Focus on zero-setup AI training',
            'Emphasize privacy-first approach',
            'Target specific industries with tailored solutions',
            'Highlight superior AI accuracy and context understanding'
          ],
          competitive_analysis: [
            {
              name: 'Intercom',
              market_share: 25,
              strengths: ['Brand recognition', 'Feature completeness', 'Enterprise sales'],
              weaknesses: ['Complex setup', 'High pricing', 'Limited AI customization'],
              pricing_strategy: 'Premium enterprise pricing',
              target_segments: ['Enterprise', 'Mid-market SaaS'],
              differentiation_opportunity: 'Simpler setup and better AI training'
            },
            {
              name: 'Zendesk Chat',
              market_share: 20,
              strengths: ['Market presence', 'Integration ecosystem', 'Support infrastructure'],
              weaknesses: ['Legacy architecture', 'Limited AI capabilities', 'User experience'],
              pricing_strategy: 'Tiered subscription model',
              target_segments: ['Enterprise', 'Traditional businesses'],
              differentiation_opportunity: 'Modern AI-first approach'
            }
          ]
        },
        recommendations: {
          primary_target: 'Tech-Savvy Early Adopters',
          launch_strategy: [
            {
              phase: 'Phase 1: Product Hunt Launch',
              timeline: 'Month 1-2',
              key_activities: [
                'Product Hunt launch campaign',
                'Tech community engagement',
                'Influencer outreach',
                'Content marketing launch'
              ],
              success_metrics: ['500+ Product Hunt votes', '1000+ signups', '50+ beta users'],
              budget_allocation: '$15K marketing spend',
              risk_factors: ['Competition timing', 'Feature readiness']
            },
            {
              phase: 'Phase 2: Enterprise Validation',
              timeline: 'Month 3-6',
              key_activities: [
                'Enterprise pilot programs',
                'Case study development',
                'Sales team hiring',
                'Partnership development'
              ],
              success_metrics: ['5+ enterprise pilots', '2+ case studies', '$50K ARR'],
              budget_allocation: '$50K sales & marketing',
              risk_factors: ['Sales cycle length', 'Feature gaps']
            }
          ],
          pricing_insights: 'Freemium model with $29/month starter tier, $99/month professional, $299/month enterprise',
          content_strategy: [
            'Technical blog posts about AI implementation',
            'Customer success stories and ROI case studies',
            'Video demos showing setup process',
            'Comparison guides vs competitors',
            'Industry-specific use case content'
          ],
          go_to_market_timeline: '6-month aggressive launch with enterprise focus by month 4'
        },
        market_opportunities: [
          {
            title: 'Healthcare Documentation AI',
            description: 'Specialized AI for medical documentation and patient communication',
            market_size: '$2.3B addressable market',
            difficulty: 'High',
            time_to_market: '12-18 months',
            investment_required: '$500K-1M',
            success_probability: 75
          },
          {
            title: 'E-commerce Support Automation',
            description: 'AI trained on product catalogs for shopping assistance',
            market_size: '$1.8B addressable market',
            difficulty: 'Medium',
            time_to_market: '6-9 months',
            investment_required: '$200K-400K',
            success_probability: 85
          },
          {
            title: 'Legal Document AI Assistant',
            description: 'AI for legal document analysis and client communication',
            market_size: '$3.1B addressable market',
            difficulty: 'High',
            time_to_market: '18-24 months',
            investment_required: '$1M-2M',
            success_probability: 65
          }
        ],
        risk_assessment: {
          high_risk: [
            'Large competitors launching similar AI features',
            'Regulatory changes affecting AI in customer service',
            'Economic downturn reducing SaaS spending'
          ],
          medium_risk: [
            'Technical challenges with AI accuracy',
            'Customer acquisition cost higher than expected',
            'Integration complexity with existing systems'
          ],
          low_risk: [
            'Market demand for AI solutions',
            'Team technical capabilities',
            'Initial product-market fit validation'
          ],
          mitigation_strategies: [
            'Build strong IP and technical moats',
            'Diversify across multiple market segments',
            'Maintain lean operations and flexible pricing',
            'Focus on customer success and retention'
          ]
        },
        cultural_insights: {
          trending_themes: [
            'AI transparency and explainability',
            'Privacy-first technology adoption',
            'Remote work communication tools',
            'Automation without job displacement'
          ],
          cultural_moments: [
            'AI regulation discussions increasing awareness',
            'Customer service quality becoming differentiator',
            'Small business digital transformation acceleration'
          ],
          seasonal_opportunities: [
            'Q4: Budget planning season for enterprise',
            'Q1: New year digital transformation initiatives',
            'Back-to-school: Educational institution adoption'
          ],
          demographic_shifts: [
            'Gen Z entering workforce with AI expectations',
            'Remote-first companies needing better tools',
            'SMBs becoming more tech-savvy'
          ]
        }
      };

      setAnalysis(mockAnalysis);
      toast.success('Market analysis completed!');
    } catch (error) {
      toast.error('Failed to analyze market fit');
      console.error('Market analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportReport = () => {
    if (!analysis) return;
    
    const reportData = {
      product_description: productDescription,
      analysis_date: new Date().toISOString(),
      ...analysis
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market_analysis_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Market analysis report exported!');
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMatchIcon = (percentage: number) => {
    if (percentage >= 80) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (percentage >= 60) return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    return <AlertCircle className="w-5 h-5 text-red-400" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Low': return 'bg-green-500/20 text-green-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'High': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low_risk': return 'border-green-500/30 bg-green-500/10';
      case 'medium_risk': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'high_risk': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-slate-600/30 bg-slate-700/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Market Fit Analyzer</h2>
        <p className="text-slate-300 mt-1">
          AI-powered product-to-market matching using Qloo's cultural intelligence
        </p>
      </div>

      {/* Input Section */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Product Analysis
          </CardTitle>
          <CardDescription className="text-slate-300">
            Describe your product to get comprehensive market fit analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-description" className="text-slate-300">
              Product Description
            </Label>
            <Textarea
              id="product-description"
              placeholder="e.g., AI-powered customer support chatbot that learns from your documentation..."
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 min-h-20"
            />
            {productDescription.length > 0 && (
              <div className="flex items-center text-xs text-slate-400">
                <Clock className="w-3 h-3 mr-1" />
                {isAnalyzing ? 'Analyzing...' : 'Analysis will update automatically'}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-300">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="mobile-app">Mobile App</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price-range" className="text-slate-300">Price Range</Label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="under-50">Under $50</SelectItem>
                  <SelectItem value="50-200">$50 - $200</SelectItem>
                  <SelectItem value="200-1000">$200 - $1,000</SelectItem>
                  <SelectItem value="over-1000">Over $1,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-model" className="text-slate-300">Business Model</Label>
              <Select value={businessModel} onValueChange={setBusinessModel}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="one-time">One-time Purchase</SelectItem>
                  <SelectItem value="freemium">Freemium</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="advertising">Advertising</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-audience" className="text-slate-300">Target Audience</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="b2b">B2B</SelectItem>
                  <SelectItem value="b2c">B2C</SelectItem>
                  <SelectItem value="b2b2c">B2B2C</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="smb">Small Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Target Regions</Label>
            <div className="flex flex-wrap gap-2">
              {['US', 'EU', 'APAC', 'LATAM', 'Global'].map((region) => (
                <Badge
                  key={region}
                  className={`cursor-pointer px-3 py-1 rounded-lg transition-all ${
                    targetRegions.includes(region)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-blue-800/70'
                  }`}
                  onClick={() => {
                    setTargetRegions(prev =>
                      prev.includes(region)
                        ? prev.filter(r => r !== region)
                        : [...prev, region]
                    );
                  }}
                >
                  {region}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !productDescription.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing Market Fit...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analyze Market Fit
                </>
              )}
            </Button>
            
            {analysis && (
              <Button
                onClick={handleExportReport}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysis && (
        <Tabs defaultValue="segments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
            <TabsTrigger value="segments">Market Segments</TabsTrigger>
            <TabsTrigger value="sizing">Market Sizing</TabsTrigger>
            <TabsTrigger value="competition">Competition</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="insights">Cultural Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="segments" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Market Segment Analysis
                </CardTitle>
                <CardDescription className="text-slate-300">
                  AI-identified audience segments ranked by market fit and cultural alignment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analysis.segments.map((segment, index) => (
                    <div
                      key={index}
                      className="p-6 bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-lg border border-slate-600/30"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getMatchIcon(segment.match_percentage)}
                          <h3 className="text-xl font-semibold text-white">
                            {segment.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {segment.market_maturity} Market
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getMatchColor(segment.match_percentage)}`}>
                            {segment.match_percentage}%
                          </div>
                          <div className="text-xs text-slate-400">Match Score</div>
                        </div>
                      </div>

                      <p className="text-slate-300 mb-4">{segment.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                          <div className="text-lg font-bold text-blue-400">{segment.audience_size}</div>
                          <div className="text-xs text-slate-400">Audience Size</div>
                        </div>
                        <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                          <div className="text-lg font-bold text-green-400">{segment.engagement_potential}%</div>
                          <div className="text-xs text-slate-400">Engagement Potential</div>
                        </div>
                        <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                          <div className="text-lg font-bold text-purple-400">{segment.conversion_likelihood}%</div>
                          <div className="text-xs text-slate-400">Conversion Likelihood</div>
                        </div>
                        <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                          <div className="text-lg font-bold text-yellow-400">{segment.cultural_alignment}%</div>
                          <div className="text-xs text-slate-400">Cultural Alignment</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-400 mb-2">Key Characteristics</h4>
                          <ul className="space-y-1">
                            {segment.key_characteristics.slice(0, 4).map((char, idx) => (
                              <li key={idx} className="text-sm text-slate-300 flex items-start">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {char}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-400 mb-2">Recommended Channels</h4>
                          <div className="flex flex-wrap gap-1">
                            {segment.recommended_channels.map((channel, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Price Sensitivity</span>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              segment.price_sensitivity === 'Low' ? 'bg-green-500/20 text-green-400' :
                              segment.price_sensitivity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {segment.price_sensitivity}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Competition</span>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              segment.competition_level === 'Low' ? 'bg-green-500/20 text-green-400' :
                              segment.competition_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {segment.competition_level}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Market Stage</span>
                          <Badge variant="secondary" className="text-xs">
                            {segment.market_maturity}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Overall Market Fit</span>
                          <span className={`text-sm font-semibold ${getMatchColor(segment.match_percentage)}`}>
                            {segment.match_percentage}%
                          </span>
                        </div>
                        <Progress 
                          value={segment.match_percentage} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sizing" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Market Size & Growth Analysis
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Total addressable market with growth projections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-6 bg-slate-700/30 rounded-lg">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {analysis.market_size_estimate.tam}
                    </div>
                    <div className="text-sm font-medium text-white mb-1">TAM</div>
                    <div className="text-xs text-slate-400">Total Addressable Market</div>
                  </div>
                  <div className="text-center p-6 bg-slate-700/30 rounded-lg">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {analysis.market_size_estimate.sam}
                    </div>
                    <div className="text-sm font-medium text-white mb-1">SAM</div>
                    <div className="text-xs text-slate-400">Serviceable Addressable Market</div>
                  </div>
                  <div className="text-center p-6 bg-slate-700/30 rounded-lg">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {analysis.market_size_estimate.som}
                    </div>
                    <div className="text-sm font-medium text-white mb-1">SOM</div>
                    <div className="text-xs text-slate-400">Serviceable Obtainable Market</div>
                  </div>
                  <div className="text-center p-6 bg-slate-700/30 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      {analysis.market_size_estimate.growth_rate}
                    </div>
                    <div className="text-sm font-medium text-white mb-1">Growth Rate</div>
                    <div className="text-xs text-slate-400">Compound Annual Growth</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Market Trends</h4>
                  <ul className="space-y-2">
                    {analysis.market_size_estimate.market_trends.map((trend, index) => (
                      <li key={index} className="text-slate-300 flex items-start">
                        <TrendingUp className="w-4 h-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        {trend}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competition" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Competitive Landscape Analysis
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Detailed competitor analysis and positioning opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Similar Products</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.competitive_landscape.similar_products.map((product, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Detailed Competitor Analysis</h4>
                  <div className="space-y-4">
                    {analysis.competitive_landscape.competitive_analysis.map((competitor, index) => (
                      <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-lg font-semibold text-white">{competitor.name}</h5>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-400">{competitor.market_share}%</div>
                            <div className="text-xs text-slate-400">Market Share</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <h6 className="text-sm font-medium text-green-400 mb-2">Strengths</h6>
                            <ul className="space-y-1">
                              {competitor.strengths.map((strength, idx) => (
                                <li key={idx} className="text-sm text-slate-300 flex items-start">
                                  <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="text-sm font-medium text-red-400 mb-2">Weaknesses</h6>
                            <ul className="space-y-1">
                              {competitor.weaknesses.map((weakness, idx) => (
                                <li key={idx} className="text-sm text-slate-300 flex items-start">
                                  <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                                  {weakness}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <h6 className="text-sm font-medium text-yellow-400 mb-1">Differentiation Opportunity</h6>
                          <p className="text-sm text-slate-300">{competitor.differentiation_opportunity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Market Gaps</h4>
                  <ul className="space-y-2">
                    {analysis.competitive_landscape.market_gaps.map((gap, index) => (
                      <li key={index} className="text-slate-300 flex items-start">
                        <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Positioning Opportunities</h4>
                  <ul className="space-y-2">
                    {analysis.competitive_landscape.positioning_opportunities.map((opportunity, index) => (
                      <li key={index} className="text-slate-300 flex items-start">
                        <Target className="w-4 h-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  Market Opportunities & Risk Assessment
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Expansion opportunities and risk mitigation strategies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Market Expansion Opportunities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analysis.market_opportunities.map((opportunity, index) => (
                      <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-white">{opportunity.title}</h5>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-400">{opportunity.success_probability}%</div>
                            <div className="text-xs text-slate-400">Success Rate</div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-300 mb-3">{opportunity.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Market Size</span>
                            <span className="text-xs text-white font-medium">{opportunity.market_size}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Time to Market</span>
                            <span className="text-xs text-white font-medium">{opportunity.time_to_market}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Investment</span>
                            <span className="text-xs text-white font-medium">{opportunity.investment_required}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Difficulty</span>
                            <Badge className={`text-xs ${getDifficultyColor(opportunity.difficulty)}`}>
                              {opportunity.difficulty}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <Progress value={opportunity.success_probability} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Risk Assessment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(analysis.risk_assessment).slice(0, 3).map(([riskLevel, risks]) => (
                      <div key={riskLevel} className={`p-4 rounded-lg border ${getRiskColor(riskLevel)}`}>
                        <h5 className="font-semibold text-white mb-3 capitalize">
                          {riskLevel.replace('_', ' ')}
                        </h5>
                        <ul className="space-y-2">
                          {(risks as string[]).map((risk, idx) => (
                            <li key={idx} className="text-sm text-slate-300 flex items-start">
                              <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
                    <h5 className="font-semibold text-white mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Mitigation Strategies
                    </h5>
                    <ul className="space-y-2">
                      {analysis.risk_assessment.mitigation_strategies.map((strategy, index) => (
                        <li key={index} className="text-sm text-slate-300 flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Go-to-Market Strategy
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Comprehensive launch strategy and execution plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Primary Target</h4>
                    <p className="text-white font-semibold">{analysis.recommendations.primary_target}</p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Timeline</h4>
                    <p className="text-white">{analysis.recommendations.go_to_market_timeline}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Launch Strategy Phases</h4>
                  <div className="space-y-4">
                    {analysis.recommendations.launch_strategy.map((phase, index) => (
                      <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-lg font-semibold text-white">{phase.phase}</h5>
                          <Badge variant="secondary" className="text-xs">
                            {phase.timeline}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <h6 className="text-sm font-medium text-blue-400 mb-2">Key Activities</h6>
                            <ul className="space-y-1">
                              {phase.key_activities.map((activity, idx) => (
                                <li key={idx} className="text-sm text-slate-300 flex items-start">
                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="text-sm font-medium text-green-400 mb-2">Success Metrics</h6>
                            <ul className="space-y-1">
                              {phase.success_metrics.map((metric, idx) => (
                                <li key={idx} className="text-sm text-slate-300 flex items-start">
                                  <Star className="w-3 h-3 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                  {metric}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-slate-800/50 rounded-lg">
                            <h6 className="text-sm font-medium text-yellow-400 mb-1">Budget</h6>
                            <p className="text-sm text-slate-300">{phase.budget_allocation}</p>
                          </div>
                          <div className="p-3 bg-slate-800/50 rounded-lg">
                            <h6 className="text-sm font-medium text-red-400 mb-1">Risk Factors</h6>
                            <ul className="space-y-1">
                              {phase.risk_factors.map((risk, idx) => (
                                <li key={idx} className="text-xs text-slate-300">• {risk}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Pricing Strategy</h4>
                  <p className="text-white">{analysis.recommendations.pricing_insights}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Content Strategy</h4>
                  <ul className="space-y-2">
                    {analysis.recommendations.content_strategy.map((strategy, index) => (
                      <li key={index} className="text-slate-300 flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Cultural Intelligence Insights
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Qloo-powered cultural trends and demographic insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Trending Cultural Themes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysis.cultural_insights.trending_themes.map((theme, index) => (
                      <div key={index} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                          <span className="text-slate-300">{theme}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Cultural Moments
                  </h4>
                  <ul className="space-y-2">
                    {analysis.cultural_insights.cultural_moments.map((moment, index) => (
                      <li key={index} className="text-slate-300 flex items-start">
                        <Eye className="w-4 h-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                        {moment}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Seasonal Opportunities
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {analysis.cultural_insights.seasonal_opportunities.map((opportunity, index) => (
                      <div key={index} className="p-3 bg-slate-700/30 rounded-lg text-center">
                        <div className="text-sm text-slate-300">{opportunity}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Demographic Shifts
                  </h4>
                  <ul className="space-y-2">
                    {analysis.cultural_insights.demographic_shifts.map((shift, index) => (
                      <li key={index} className="text-slate-300 flex items-start">
                        <Award className="w-4 h-4 text-purple-400 mt-0.5 mr-2 flex-shrink-0" />
                        {shift}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Empty State */}
      {!analysis && !isAnalyzing && (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Ready for Market Analysis
            </h3>
            <p className="text-slate-300">
              Enter your product description above to get comprehensive market fit analysis powered by Qloo's cultural intelligence
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketFit;