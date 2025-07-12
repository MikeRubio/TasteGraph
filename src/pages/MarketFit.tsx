import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Users, 
  TrendingUp, 
  Lightbulb,
  Download,
  RefreshCw,
  Clock,
  DollarSign,
  BarChart3,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Globe,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface MarketSegment {
  name: string;
  match_percentage: number;
  engagement_potential: number;
  conversion_likelihood: number;
  market_maturity: 'Early' | 'Growing' | 'Mature' | 'Declining';
  cultural_alignment: number;
  size_estimate: string;
  key_characteristics: string[];
  recommended_approach: string;
}

interface MarketOpportunity {
  title: string;
  description: string;
  success_probability: number;
  investment_required: string;
  time_to_market: string;
  difficulty: 'Low' | 'Medium' | 'High';
}

interface Competitor {
  name: string;
  market_share: number;
  strengths: string[];
  weaknesses: string[];
  differentiation_opportunity: string;
}

interface LaunchPhase {
  phase: string;
  timeline: string;
  budget_range: string;
  key_activities: string[];
  success_metrics: string[];
  risk_factors: string[];
}

interface CulturalInsight {
  theme: string;
  relevance_score: number;
  description: string;
  timing_opportunity: string;
}

interface MarketFitResponse {
  overall_fit_score: number;
  segments: MarketSegment[];
  market_size_estimate: {
    total_addressable_market: string;
    serviceable_addressable_market: string;
    serviceable_obtainable_market: string;
    growth_rate: number;
    market_trends: string[];
  };
  competitive_landscape: {
    market_saturation: 'Low' | 'Medium' | 'High';
    key_competitors: Competitor[];
    market_gaps: string[];
    positioning_opportunities: string[];
  };
  market_opportunities: MarketOpportunity[];
  risk_assessment: {
    overall_risk: 'Low' | 'Medium' | 'High';
    market_risks: string[];
    competitive_risks: string[];
    execution_risks: string[];
    mitigation_strategies: string[];
  };
  launch_strategy: {
    recommended_phases: LaunchPhase[];
    go_to_market_approach: string;
    key_partnerships: string[];
    success_timeline: string;
  };
  cultural_insights: {
    trending_themes: CulturalInsight[];
    cultural_moments: string[];
    seasonal_opportunities: string[];
    demographic_shifts: string[];
  };
}

const MarketFit = () => {
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [businessModel, setBusinessModel] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MarketFitResponse | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Debounced analysis generation
  useEffect(() => {
    if (description.length > 30 && industry && targetMarket) {
      const timer = setTimeout(() => {
        generateMarketAnalysis();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [description, industry, targetMarket, businessModel]);

  const generateMarketAnalysis = async () => {
    if (!description.trim() || !industry || !targetMarket) return;

    setIsAnalyzing(true);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock comprehensive market analysis
      const mockAnalysis: MarketFitResponse = {
        overall_fit_score: 78,
        segments: [
          {
            name: 'Early Adopters',
            match_percentage: 85,
            engagement_potential: 92,
            conversion_likelihood: 78,
            market_maturity: 'Growing',
            cultural_alignment: 88,
            size_estimate: '2.5M users',
            key_characteristics: ['Tech-savvy', 'High disposable income', 'Innovation-focused'],
            recommended_approach: 'Direct digital marketing with emphasis on cutting-edge features'
          },
          {
            name: 'Mainstream Professionals',
            match_percentage: 72,
            engagement_potential: 76,
            conversion_likelihood: 82,
            market_maturity: 'Mature',
            cultural_alignment: 71,
            size_estimate: '15M users',
            key_characteristics: ['Efficiency-focused', 'ROI-driven', 'Brand-conscious'],
            recommended_approach: 'B2B partnerships and enterprise sales channels'
          },
          {
            name: 'Cost-Conscious Users',
            match_percentage: 58,
            engagement_potential: 64,
            conversion_likelihood: 71,
            market_maturity: 'Mature',
            cultural_alignment: 62,
            size_estimate: '8M users',
            key_characteristics: ['Price-sensitive', 'Value-focused', 'Comparison shoppers'],
            recommended_approach: 'Freemium model with clear value demonstration'
          }
        ],
        market_size_estimate: {
          total_addressable_market: '$45B',
          serviceable_addressable_market: '$12B',
          serviceable_obtainable_market: '$850M',
          growth_rate: 15.2,
          market_trends: ['AI adoption acceleration', 'Remote work normalization', 'Digital transformation']
        },
        competitive_landscape: {
          market_saturation: 'Medium',
          key_competitors: [
            {
              name: 'Market Leader A',
              market_share: 35,
              strengths: ['Brand recognition', 'Enterprise relationships', 'Feature completeness'],
              weaknesses: ['High pricing', 'Complex onboarding', 'Limited customization'],
              differentiation_opportunity: 'Simplified user experience with competitive pricing'
            },
            {
              name: 'Emerging Player B',
              market_share: 12,
              strengths: ['Modern UI', 'Fast implementation', 'Good customer support'],
              weaknesses: ['Limited integrations', 'Smaller feature set', 'New brand'],
              differentiation_opportunity: 'Comprehensive feature set with modern design'
            }
          ],
          market_gaps: ['Mid-market solutions', 'Industry-specific features', 'Mobile-first approach'],
          positioning_opportunities: ['Premium but accessible', 'Industry specialist', 'Innovation leader']
        },
        market_opportunities: [
          {
            title: 'International Expansion',
            description: 'European and Asian markets show high demand',
            success_probability: 75,
            investment_required: '$2-5M',
            time_to_market: '12-18 months',
            difficulty: 'Medium'
          },
          {
            title: 'Enterprise Partnerships',
            description: 'Strategic partnerships with consulting firms',
            success_probability: 82,
            investment_required: '$500K-1M',
            time_to_market: '6-9 months',
            difficulty: 'Low'
          },
          {
            title: 'Vertical Specialization',
            description: 'Industry-specific solutions for healthcare/finance',
            success_probability: 68,
            investment_required: '$1-3M',
            time_to_market: '9-15 months',
            difficulty: 'High'
          }
        ],
        risk_assessment: {
          overall_risk: 'Medium',
          market_risks: ['Economic downturn impact', 'Regulatory changes', 'Market saturation'],
          competitive_risks: ['New entrants', 'Price wars', 'Feature commoditization'],
          execution_risks: ['Talent acquisition', 'Technology scaling', 'Customer acquisition cost'],
          mitigation_strategies: ['Diversified revenue streams', 'Strong IP protection', 'Agile development']
        },
        launch_strategy: {
          recommended_phases: [
            {
              phase: 'Phase 1: MVP Launch',
              timeline: '0-6 months',
              budget_range: '$200K-500K',
              key_activities: ['Product development', 'Beta testing', 'Initial marketing'],
              success_metrics: ['100 beta users', '4.0+ app rating', '20% conversion rate'],
              risk_factors: ['Technical delays', 'User feedback integration', 'Market timing']
            },
            {
              phase: 'Phase 2: Market Expansion',
              timeline: '6-18 months',
              budget_range: '$1M-2.5M',
              key_activities: ['Sales team hiring', 'Marketing campaigns', 'Feature expansion'],
              success_metrics: ['1000+ customers', '$100K MRR', '15% market share'],
              risk_factors: ['Competition response', 'Scaling challenges', 'Customer retention']
            },
            {
              phase: 'Phase 3: Scale & Optimize',
              timeline: '18-36 months',
              budget_range: '$3M-8M',
              key_activities: ['International expansion', 'Enterprise sales', 'Platform optimization'],
              success_metrics: ['10K+ customers', '$1M+ MRR', 'Profitability'],
              risk_factors: ['Market maturity', 'Operational complexity', 'Competitive pressure']
            }
          ],
          go_to_market_approach: 'Product-led growth with enterprise sales overlay',
          key_partnerships: ['Technology integrators', 'Industry consultants', 'Channel partners'],
          success_timeline: '24-36 months to market leadership'
        },
        cultural_insights: {
          trending_themes: [
            {
              theme: 'AI Productivity Revolution',
              relevance_score: 94,
              description: 'Growing cultural acceptance of AI as productivity enhancer',
              timing_opportunity: 'Peak interest in Q2-Q3 2024'
            },
            {
              theme: 'Remote Work Optimization',
              relevance_score: 87,
              description: 'Continued focus on distributed team efficiency',
              timing_opportunity: 'Sustained demand through 2024-2025'
            },
            {
              theme: 'Data Privacy Consciousness',
              relevance_score: 79,
              description: 'Increasing awareness of data security and privacy',
              timing_opportunity: 'Regulatory compliance deadlines in 2024'
            }
          ],
          cultural_moments: ['Back-to-work season', 'Budget planning cycles', 'Technology conferences'],
          seasonal_opportunities: ['Q1 budget allocations', 'Q3 planning cycles', 'Year-end purchasing'],
          demographic_shifts: ['Gen Z entering workforce', 'Remote work normalization', 'AI literacy growth']
        }
      };

      setAnalysis(mockAnalysis);
      setLastUpdate(new Date());
      
    } catch (error) {
      toast.error('Failed to generate market analysis');
      console.error('Market analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportAnalysis = () => {
    if (!analysis) {
      toast.error('No analysis to export');
      return;
    }

    const blob = new Blob([JSON.stringify(analysis, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market_fit_analysis_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Market analysis exported successfully!');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Low': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'High': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Market Fit Analyzer</h2>
          <p className="text-gray-600 mt-1">
            Comprehensive market validation with AI-powered cultural intelligence
          </p>
        </div>
        {analysis && (
          <Button
            variant="outline"
            onClick={handleExportAnalysis}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Market Analysis Input
            </CardTitle>
            <CardDescription className="text-gray-600">
              Provide details for comprehensive market validation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-black">
                Product/Service Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your product, target problem, and unique value proposition..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white border-gray-300 text-black placeholder-gray-400 min-h-20"
              />
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
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-market" className="text-black">Target Market</Label>
              <Select value={targetMarket} onValueChange={setTargetMarket}>
                <SelectTrigger className="bg-white border-gray-300 text-black">
                  <SelectValue placeholder="Select target market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="b2b-enterprise">B2B Enterprise</SelectItem>
                  <SelectItem value="b2b-smb">B2B Small/Medium Business</SelectItem>
                  <SelectItem value="b2c-consumer">B2C Consumer</SelectItem>
                  <SelectItem value="b2c-prosumer">B2C Professional Consumer</SelectItem>
                  <SelectItem value="marketplace">Marketplace/Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-model" className="text-black">Business Model</Label>
              <Select value={businessModel} onValueChange={setBusinessModel}>
                <SelectTrigger className="bg-white border-gray-300 text-black">
                  <SelectValue placeholder="Select business model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">Subscription/SaaS</SelectItem>
                  <SelectItem value="one-time">One-time Purchase</SelectItem>
                  <SelectItem value="freemium">Freemium</SelectItem>
                  <SelectItem value="marketplace">Marketplace Commission</SelectItem>
                  <SelectItem value="advertising">Advertising</SelectItem>
                  <SelectItem value="hybrid">Hybrid Model</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {description.length > 0 && (
              <div className="flex items-center justify-between text-xs text-gray-600 pt-2">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {isAnalyzing ? 'Analyzing market...' : 'Real-time analysis active'}
                </div>
                <span>{description.length} characters</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {isAnalyzing ? (
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-3"></div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  Analyzing Market Fit...
                </h3>
                <p className="text-gray-600 mb-3">
                  Our AI is conducting comprehensive market analysis using Qloo's cultural intelligence and competitive data.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>This may take 30-60 seconds</span>
                </div>
              </CardContent>
            </Card>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Market Fit Analysis
                    </div>
                    {lastUpdate && (
                      <div className="text-xs text-gray-600">
                        Updated {lastUpdate.toLocaleTimeString()}
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-black mb-2">
                      {analysis.overall_fit_score}%
                    </div>
                    <div className="text-gray-600">Overall Market Fit Score</div>
                    <Progress value={analysis.overall_fit_score} className="mt-3" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {analysis.market_size_estimate.serviceable_obtainable_market}
                      </div>
                      <div className="text-xs text-gray-600">Obtainable Market</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {analysis.market_size_estimate.growth_rate}%
                      </div>
                      <div className="text-xs text-gray-600">Growth Rate</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className={`text-lg font-bold ${getRiskColor(analysis.risk_assessment.overall_risk)}`}>
                        {analysis.risk_assessment.overall_risk}
                      </div>
                      <div className="text-xs text-gray-600">Overall Risk</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Analysis Tabs */}
              <Tabs defaultValue="segments" className="space-y-4">
                <TabsList className="grid w-full grid-cols-6 bg-gray-100">
                  <TabsTrigger value="segments" className="data-[state=active]:bg-white">Segments</TabsTrigger>
                  <TabsTrigger value="sizing" className="data-[state=active]:bg-white">Sizing</TabsTrigger>
                  <TabsTrigger value="competition" className="data-[state=active]:bg-white">Competition</TabsTrigger>
                  <TabsTrigger value="opportunities" className="data-[state=active]:bg-white">Opportunities</TabsTrigger>
                  <TabsTrigger value="strategy" className="data-[state=active]:bg-white">Strategy</TabsTrigger>
                  <TabsTrigger value="cultural" className="data-[state=active]:bg-white">Cultural</TabsTrigger>
                </TabsList>

                <TabsContent value="segments">
                  <Card className="bg-white border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Market Segments</CardTitle>
                      <CardDescription className="text-gray-600">
                        Detailed analysis of target market segments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysis.segments.map((segment, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-black">{segment.name}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">{segment.size_estimate}</Badge>
                                <Badge className={`${segment.market_maturity === 'Growing' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                  {segment.market_maturity}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div className="text-center">
                                <div className="text-lg font-bold text-black">{segment.match_percentage}%</div>
                                <div className="text-xs text-gray-600">Match</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-blue-600">{segment.engagement_potential}%</div>
                                <div className="text-xs text-gray-600">Engagement</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-600">{segment.conversion_likelihood}%</div>
                                <div className="text-xs text-gray-600">Conversion</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-purple-600">{segment.cultural_alignment}%</div>
                                <div className="text-xs text-gray-600">Cultural Fit</div>
                              </div>
                            </div>

                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-gray-600 mb-2">Key Characteristics</h5>
                              <div className="flex flex-wrap gap-1">
                                {segment.key_characteristics.map((char, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {char}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium text-gray-600 mb-1">Recommended Approach</h5>
                              <p className="text-sm text-gray-600">{segment.recommended_approach}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sizing">
                  <Card className="bg-white border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Market Sizing</CardTitle>
                      <CardDescription className="text-gray-600">
                        Total addressable market and growth projections
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-black mb-1">
                            {analysis.market_size_estimate.total_addressable_market}
                          </div>
                          <div className="text-sm text-gray-600">Total Addressable Market</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {analysis.market_size_estimate.serviceable_addressable_market}
                          </div>
                          <div className="text-sm text-gray-600">Serviceable Addressable Market</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {analysis.market_size_estimate.serviceable_obtainable_market}
                          </div>
                          <div className="text-sm text-gray-600">Serviceable Obtainable Market</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-black mb-2">Market Trends</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysis.market_size_estimate.market_trends.map((trend, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {trend}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-black mb-2">Growth Rate</h4>
                          <div className="flex items-center space-x-3">
                            <Progress value={analysis.market_size_estimate.growth_rate} className="flex-1" />
                            <span className="text-lg font-bold text-green-600">
                              {analysis.market_size_estimate.growth_rate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="competition">
                  <Card className="bg-white border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Competitive Landscape</CardTitle>
                      <CardDescription className="text-gray-600">
                        Key competitors and market positioning opportunities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-black">Market Saturation</h4>
                          <Badge className={`${analysis.competitive_landscape.market_saturation === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                            {analysis.competitive_landscape.market_saturation}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <h4 className="font-semibold text-black">Key Competitors</h4>
                        {analysis.competitive_landscape.key_competitors.map((competitor, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-semibold text-black">{competitor.name}</h5>
                              <Badge variant="secondary">{competitor.market_share}% market share</Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <h6 className="text-sm font-medium text-gray-600 mb-2">Strengths</h6>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {competitor.strengths.map((strength, idx) => (
                                    <li key={idx} className="flex items-center">
                                      <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                                      {strength}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h6 className="text-sm font-medium text-gray-600 mb-2">Weaknesses</h6>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {competitor.weaknesses.map((weakness, idx) => (
                                    <li key={idx} className="flex items-center">
                                      <AlertTriangle className="w-3 h-3 mr-2 text-red-600" />
                                      {weakness}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div>
                              <h6 className="text-sm font-medium text-gray-600 mb-1">Differentiation Opportunity</h6>
                              <p className="text-sm text-gray-600">{competitor.differentiation_opportunity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-black mb-3">Market Gaps</h4>
                          <ul className="space-y-2">
                            {analysis.competitive_landscape.market_gaps.map((gap, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-600">
                                <Target className="w-3 h-3 mr-2 text-blue-600" />
                                {gap}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-black mb-3">Positioning Opportunities</h4>
                          <ul className="space-y-2">
                            {analysis.competitive_landscape.positioning_opportunities.map((opportunity, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-600">
                                <Lightbulb className="w-3 h-3 mr-2 text-yellow-600" />
                                {opportunity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="opportunities">
                  <Card className="bg-white border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Market Opportunities</CardTitle>
                      <CardDescription className="text-gray-600">
                        Expansion opportunities and investment requirements
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysis.market_opportunities.map((opportunity, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-black">{opportunity.title}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge className={getDifficultyColor(opportunity.difficulty)}>
                                  {opportunity.difficulty} Difficulty
                                </Badge>
                                <Badge variant="secondary">
                                  {opportunity.success_probability}% Success Rate
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-4">{opportunity.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center p-3 bg-white rounded border border-gray-200">
                                <DollarSign className="w-4 h-4 mx-auto mb-1 text-green-600" />
                                <div className="text-sm font-medium text-black">{opportunity.investment_required}</div>
                                <div className="text-xs text-gray-600">Investment Required</div>
                              </div>
                              <div className="text-center p-3 bg-white rounded border border-gray-200">
                                <Clock className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                                <div className="text-sm font-medium text-black">{opportunity.time_to_market}</div>
                                <div className="text-xs text-gray-600">Time to Market</div>
                              </div>
                              <div className="text-center p-3 bg-white rounded border border-gray-200">
                                <Target className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                                <div className="text-sm font-medium text-black">{opportunity.success_probability}%</div>
                                <div className="text-xs text-gray-600">Success Probability</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="strategy">
                  <Card className="bg-white border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Launch Strategy</CardTitle>
                      <CardDescription className="text-gray-600">
                        Phased go-to-market approach with timelines and budgets
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">Go-to-Market Approach</h4>
                        <p className="text-gray-600 mb-4">{analysis.launch_strategy.go_to_market_approach}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 mb-2">Key Partnerships</h5>
                            <ul className="space-y-1">
                              {analysis.launch_strategy.key_partnerships.map((partnership, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center">
                                  <Users className="w-3 h-3 mr-2 text-blue-600" />
                                  {partnership}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 mb-2">Success Timeline</h5>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Calendar className="w-3 h-3 mr-2 text-green-600" />
                              {analysis.launch_strategy.success_timeline}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-black">Recommended Phases</h4>
                        {analysis.launch_strategy.recommended_phases.map((phase, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-semibold text-black">{phase.phase}</h5>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">{phase.timeline}</Badge>
                                <Badge className="bg-green-100 text-green-700">{phase.budget_range}</Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h6 className="text-sm font-medium text-gray-600 mb-2">Key Activities</h6>
                                <ul className="space-y-1">
                                  {phase.key_activities.map((activity, idx) => (
                                    <li key={idx} className="text-xs text-gray-600 flex items-center">
                                      <Zap className="w-2 h-2 mr-2 text-blue-600" />
                                      {activity}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h6 className="text-sm font-medium text-gray-600 mb-2">Success Metrics</h6>
                                <ul className="space-y-1">
                                  {phase.success_metrics.map((metric, idx) => (
                                    <li key={idx} className="text-xs text-gray-600 flex items-center">
                                      <CheckCircle className="w-2 h-2 mr-2 text-green-600" />
                                      {metric}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h6 className="text-sm font-medium text-gray-600 mb-2">Risk Factors</h6>
                                <ul className="space-y-1">
                                  {phase.risk_factors.map((risk, idx) => (
                                    <li key={idx} className="text-xs text-gray-600 flex items-center">
                                      <AlertTriangle className="w-2 h-2 mr-2 text-red-600" />
                                      {risk}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cultural">
                  <Card className="bg-white border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-black">Cultural Insights</CardTitle>
                      <CardDescription className="text-gray-600">
                        Qloo-powered cultural intelligence and timing opportunities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-black mb-4">Trending Cultural Themes</h4>
                          <div className="space-y-3">
                            {analysis.cultural_insights.trending_themes.map((theme, index) => (
                              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-semibold text-black">{theme.theme}</h5>
                                  <Badge className="bg-purple-100 text-purple-700">
                                    {theme.relevance_score}% Relevance
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{theme.description}</p>
                                <div className="flex items-center text-xs text-gray-600">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {theme.timing_opportunity}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-black mb-3">Cultural Moments</h4>
                            <ul className="space-y-2">
                              {analysis.cultural_insights.cultural_moments.map((moment, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600">
                                  <Globe className="w-3 h-3 mr-2 text-blue-600" />
                                  {moment}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-black mb-3">Seasonal Opportunities</h4>
                            <ul className="space-y-2">
                              {analysis.cultural_insights.seasonal_opportunities.map((opportunity, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600">
                                  <Calendar className="w-3 h-3 mr-2 text-green-600" />
                                  {opportunity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-black mb-3">Demographic Shifts</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysis.cultural_insights.demographic_shifts.map((shift, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {shift}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-8 text-center">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">
                  Ready for Market Analysis
                </h3>
                <p className="text-gray-600">
                  Fill in the product details to start comprehensive market validation
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketFit;