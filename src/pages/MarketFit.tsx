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
  Zap
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
}

interface MarketAnalysis {
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

const MarketFit = () => {
  const [productDescription, setProductDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [targetRegions, setTargetRegions] = useState<string[]>([]);
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis data - replace with actual API call
      const mockAnalysis: MarketAnalysis = {
        segments: [
          {
            name: 'Tech-Savvy Early Adopters',
            match_percentage: 92,
            description: 'Technology enthusiasts who embrace new solutions quickly',
            audience_size: '2.5M potential users',
            key_characteristics: [
              'High disposable income',
              'Active on social media',
              'Values innovation and efficiency',
              'Willing to pay premium for quality'
            ],
            recommended_channels: ['LinkedIn', 'Product Hunt', 'Tech blogs'],
            price_sensitivity: 'Low',
            competition_level: 'Medium'
          },
          {
            name: 'Small Business Owners',
            match_percentage: 78,
            description: 'Entrepreneurs seeking cost-effective business solutions',
            audience_size: '1.8M potential users',
            key_characteristics: [
              'Budget-conscious',
              'Time-constrained',
              'ROI-focused',
              'Values customer support'
            ],
            recommended_channels: ['Google Ads', 'Business forums', 'Email marketing'],
            price_sensitivity: 'High',
            competition_level: 'High'
          },
          {
            name: 'Enterprise Decision Makers',
            match_percentage: 65,
            description: 'Corporate leaders evaluating scalable solutions',
            audience_size: '500K potential users',
            key_characteristics: [
              'Risk-averse',
              'Compliance-focused',
              'Long sales cycles',
              'Values security and reliability'
            ],
            recommended_channels: ['Industry events', 'Sales outreach', 'Case studies'],
            price_sensitivity: 'Low',
            competition_level: 'Low'
          }
        ],
        market_size_estimate: {
          tam: '$12.5B',
          sam: '$2.1B',
          som: '$180M'
        },
        competitive_landscape: {
          similar_products: ['Intercom', 'Zendesk Chat', 'Drift', 'Crisp'],
          market_gaps: [
            'AI-powered document training',
            'No-code setup for non-technical users',
            'Industry-specific customization'
          ],
          positioning_opportunities: [
            'Focus on ease of implementation',
            'Emphasize AI accuracy',
            'Target specific industries'
          ]
        },
        recommendations: {
          primary_target: 'Tech-Savvy Early Adopters',
          launch_strategy: 'Product Hunt launch followed by tech community engagement',
          pricing_insights: 'Freemium model with premium AI features',
          content_strategy: [
            'Technical blog posts about AI implementation',
            'Case studies showing ROI',
            'Video demos of setup process',
            'Comparison guides vs competitors'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Market Fit Analyzer</h2>
        <p className="text-slate-300 mt-1">
          Real-time product-to-market matching using Qloo's cultural intelligence
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
            Describe your product to get instant market fit analysis
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label className="text-slate-300">Target Regions</Label>
              <div className="flex flex-wrap gap-2">
                {['US', 'EU', 'APAC', 'Global'].map((region) => (
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
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !productDescription.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
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
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysis && (
        <Tabs defaultValue="segments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="segments">Market Segments</TabsTrigger>
            <TabsTrigger value="sizing">Market Sizing</TabsTrigger>
            <TabsTrigger value="competition">Competition</TabsTrigger>
            <TabsTrigger value="recommendations">Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="segments" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Market Segment Analysis
                </CardTitle>
                <CardDescription className="text-slate-300">
                  AI-identified audience segments ranked by market fit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analysis.segments.map((segment, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-lg border border-slate-600/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getMatchIcon(segment.match_percentage)}
                          <h3 className="text-xl font-semibold text-white">
                            {segment.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getMatchColor(segment.match_percentage)}`}>
                            {segment.match_percentage}%
                          </div>
                          <div className="text-xs text-slate-400">Match Score</div>
                        </div>
                      </div>

                      <p className="text-slate-300 mb-4">{segment.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-400 mb-2">Audience Size</h4>
                          <p className="text-white font-semibold">{segment.audience_size}</p>
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-400 mb-2">Key Characteristics</h4>
                          <ul className="space-y-1">
                            {segment.key_characteristics.slice(0, 3).map((char, idx) => (
                              <li key={idx} className="text-sm text-slate-300 flex items-start">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {char}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
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
                            <span className="text-sm text-slate-400">Competition Level</span>
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
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Market Fit Score</span>
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
                  Market Size Estimation
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Total addressable market analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competition" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Competitive Landscape
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Market positioning and opportunity analysis
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

          <TabsContent value="recommendations" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Strategic Recommendations
                </CardTitle>
                <CardDescription className="text-slate-300">
                  AI-powered go-to-market strategy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Primary Target</h4>
                    <p className="text-white font-semibold">{analysis.recommendations.primary_target}</p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Launch Strategy</h4>
                    <p className="text-white">{analysis.recommendations.launch_strategy}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Pricing Insights</h4>
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
              Enter your product description above to get instant market fit analysis powered by Qloo's cultural intelligence
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketFit;