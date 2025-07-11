import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Users, 
  TrendingUp, 
  Zap, 
  Target, 
  Globe, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Eye,
  FileText,
  Download,
  Shield,
  Clock,
  Lightbulb,
  Activity
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-black" />
              <span className="text-2xl font-semibold text-black">TasteGraph.ai</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-black">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-black hover:bg-gray-800 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-gray-100 text-gray-700 border-0">
              Powered by Qloo's Taste AI™ + OpenAI
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 tracking-tight">
              AI-Powered Audience
              <span className="block text-gray-600">Discovery Engine</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Combine Qloo's cultural intelligence with advanced language models to discover hidden audience insights, 
              predict trends, and generate compelling content strategies in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/signup">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg">
                View Demo
                <Eye className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Privacy-First
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Real-Time Analysis
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Production Ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Qloo + OpenAI = Unprecedented Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines Qloo's cross-domain cultural intelligence with OpenAI's language understanding 
              to deliver insights that neither technology could achieve alone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-black">Qloo's Cultural Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Access cross-domain taste data spanning music, fashion, food, entertainment, and more.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• 1B+ cultural data points</li>
                  <li>• Cross-domain affinities</li>
                  <li>• Privacy-first approach</li>
                  <li>• Real-time trend detection</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-black">OpenAI Integration</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Advanced language models interpret and contextualize cultural data into actionable insights.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Natural language processing</li>
                  <li>• Context-aware analysis</li>
                  <li>• Strategic recommendations</li>
                  <li>• Content generation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-black">Actionable Results</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Get comprehensive audience personas, trend predictions, and content strategies.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Detailed audience personas</li>
                  <li>• Cultural trend analysis</li>
                  <li>• Content recommendations</li>
                  <li>• Market fit scoring</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Complete Audience Intelligence Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From real-time discovery to comprehensive market analysis, everything you need to understand and reach your audience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Management */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="w-10 h-10 text-black mb-3" />
                <CardTitle className="text-black">Project Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Organize and track your audience discovery projects with comprehensive insights and analytics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Project organization</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Progress tracking</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Team collaboration</li>
                </ul>
              </CardContent>
            </Card>

            {/* Live Discovery */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Activity className="w-10 h-10 text-black mb-3" />
                <CardTitle className="text-black">Live Discovery Tool</CardTitle>
                <CardDescription className="text-gray-600">
                  Real-time audience exploration with instant AI-powered insights as you type and adjust parameters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Real-time analysis</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Interactive parameters</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Instant feedback</li>
                </ul>
              </CardContent>
            </Card>

            {/* Market Fit Analyzer */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="w-10 h-10 text-black mb-3" />
                <CardTitle className="text-black">Market Fit Analyzer</CardTitle>
                <CardDescription className="text-gray-600">
                  Comprehensive market validation with competitive analysis, sizing, and strategic recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Market validation</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Competitive analysis</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Strategic planning</li>
                </ul>
              </CardContent>
            </Card>

            {/* Audience Personas */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-10 h-10 text-black mb-3" />
                <CardTitle className="text-black">AI-Generated Personas</CardTitle>
                <CardDescription className="text-gray-600">
                  Detailed audience personas with cultural affinities, behavioral patterns, and platform preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Cultural affinities</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Behavioral insights</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Platform mapping</li>
                </ul>
              </CardContent>
            </Card>

            {/* Cultural Trends */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-black mb-3" />
                <CardTitle className="text-black">Cultural Trend Analysis</CardTitle>
                <CardDescription className="text-gray-600">
                  Predict emerging trends with confidence scoring and timeline analysis powered by Qloo's data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Trend prediction</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Confidence scoring</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Timeline analysis</li>
                </ul>
              </CardContent>
            </Card>

            {/* Interactive Visualizations */}
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="w-10 h-10 text-black mb-3" />
                <CardTitle className="text-black">Interactive Visualizations</CardTitle>
                <CardDescription className="text-gray-600">
                  Comprehensive charts and heatmaps to visualize cultural affinities, trends, and audience intersections.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Affinity radar charts</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Trend confidence bars</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Intersection heatmaps</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Content Generation */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 bg-gray-200 text-gray-700 border-0">
                AI-Powered Content Strategy
              </Badge>
              <h2 className="text-4xl font-bold text-black mb-6">
                From Insights to Action
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Don't just understand your audience—know exactly how to reach them. Our AI generates specific content 
                strategies, platform recommendations, and campaign ideas tailored to your audience's cultural preferences.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Lightbulb className="w-6 h-6 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-black">Content Suggestions</h3>
                    <p className="text-gray-600">AI-generated content ideas with sample copy and platform targeting</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-black">Cultural Timing</h3>
                    <p className="text-gray-600">Optimal timing recommendations based on cultural moments and trends</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-black">Platform Strategy</h3>
                    <p className="text-gray-600">Specific platform recommendations with engagement potential scoring</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="font-semibold text-black mb-4">Sample Content Strategy</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-black">Behind-the-Scenes AI Training</h4>
                    <Badge variant="secondary" className="text-xs">92% match</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Show how your AI learns from documents</p>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="text-xs">YouTube</Badge>
                    <Badge variant="outline" className="text-xs">TikTok</Badge>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-black">Customer Success Stories</h4>
                    <Badge variant="secondary" className="text-xs">89% match</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Real testimonials showing time savings</p>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="text-xs">LinkedIn</Badge>
                    <Badge variant="outline" className="text-xs">Website</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Export & API */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Built for Developers & Marketers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Export insights, integrate with your workflow, or build custom solutions with our comprehensive API.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border border-gray-200 p-8">
              <Download className="w-12 h-12 text-black mb-4" />
              <h3 className="text-2xl font-semibold text-black mb-4">Export & Share</h3>
              <p className="text-gray-600 mb-6">
                Export comprehensive reports as PDF or JSON. Share insights with your team or integrate with existing workflows.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> PDF reports with charts</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> JSON data export</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Team collaboration</li>
              </ul>
            </Card>

            <Card className="border border-gray-200 p-8">
              <Brain className="w-12 h-12 text-black mb-4" />
              <h3 className="text-2xl font-semibold text-black mb-4">Developer API</h3>
              <p className="text-gray-600 mb-6">
                Integrate TasteGraph.ai into your applications with our RESTful API. Full documentation and code examples included.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> RESTful API</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Complete documentation</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Code examples</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Marketing?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of marketers using TasteGraph.ai to discover audiences, predict trends, and create winning content strategies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-black px-8 py-4 text-lg">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center space-x-2">
            <Brain className="w-6 h-6 text-black" />
            <span className="text-gray-600">© 2024 TasteGraph.ai. Powered by Qloo's Taste AI™ + OpenAI.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;