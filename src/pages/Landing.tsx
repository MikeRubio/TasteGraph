import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Users, TrendingUp, Zap, Target, Globe } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">TasteGraph.ai</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            AI-Powered Audience
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Discovery Engine
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Combine Qloo's Taste AI™ with advanced language models to discover hidden audience insights, 
            predict cultural trends, and generate compelling content strategies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Powerful Features for Modern Marketers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <Users className="w-10 h-10 text-blue-400 mb-2" />
                <CardTitle className="text-white">Audience Discovery</CardTitle>
                <CardDescription className="text-slate-300">
                  Uncover hidden audience segments with AI-powered taste analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-purple-400 mb-2" />
                <CardTitle className="text-white">Cultural Trends</CardTitle>
                <CardDescription className="text-slate-300">
                  Predict emerging trends before they become mainstream
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <Zap className="w-10 h-10 text-yellow-400 mb-2" />
                <CardTitle className="text-white">Content Generation</CardTitle>
                <CardDescription className="text-slate-300">
                  AI-generated content strategies tailored to your audience
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <Target className="w-10 h-10 text-green-400 mb-2" />
                <CardTitle className="text-white">Precision Targeting</CardTitle>
                <CardDescription className="text-slate-300">
                  Laser-focused audience personas with behavioral insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <Globe className="w-10 h-10 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Global Insights</CardTitle>
                <CardDescription className="text-slate-300">
                  Cultural intelligence across different markets and regions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <Brain className="w-10 h-10 text-indigo-400 mb-2" />
                <CardTitle className="text-white">AI Integration</CardTitle>
                <CardDescription className="text-slate-300">
                  Seamless API access for developers and advanced users
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="pt-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Marketing?
              </h3>
              <p className="text-slate-300 mb-8 text-lg">
                Join hundreds of marketers using TasteGraph.ai to discover audiences and predict trends.
              </p>
              <Link to="/signup">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3">
                  Start Your Free Trial
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center space-x-2">
            <Brain className="w-6 h-6 text-blue-400" />
            <span className="text-slate-300">© 2024 TasteGraph.ai. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;