import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Copy, ExternalLink, Key, Zap } from 'lucide-react';
import { toast } from 'sonner';

const ApiAccess = () => {
  const [apiKey] = useState('tg_sk_1234567890abcdef1234567890abcdef');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const codeExamples = {
    javascript: `// Initialize TasteGraph.ai client
const tastegraph = new TasteGraph({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://api.tastegraph.ai'
});

// Generate insights for a project
const insights = await tastegraph.generateInsights({
  projectId: 'project-123',
  description: 'Eco-friendly fashion brand targeting Gen Z',
  culturalDomains: ['fashion', 'sustainability'],
  geographicalTargets: ['US', 'UK', 'Canada']
});

console.log(insights);`,
    python: `import tastegraph

# Initialize client
client = tastegraph.Client(
    api_key='your-api-key-here',
    base_url='https://api.tastegraph.ai'
)

# Generate insights
insights = client.generate_insights(
    project_id='project-123',
    description='Eco-friendly fashion brand targeting Gen Z',
    cultural_domains=['fashion', 'sustainability'],
    geographical_targets=['US', 'UK', 'Canada']
)

print(insights)`,
    curl: `curl -X POST https://api.tastegraph.ai/v1/insights/generate \\
  -H "Authorization: Bearer your-api-key-here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "project_id": "project-123",
    "description": "Eco-friendly fashion brand targeting Gen Z",
    "cultural_domains": ["fashion", "sustainability"],
    "geographical_targets": ["US", "UK", "Canada"]
  }'`
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">API Access</h2>
        <p className="text-slate-300 mt-1">Integrate TasteGraph.ai into your applications</p>
      </div>

      {/* API Key */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Key className="w-5 h-5 mr-2" />
            API Key
          </CardTitle>
          <CardDescription className="text-slate-300">
            Use this key to authenticate your API requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <div className="flex-1 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <code className="text-white font-mono text-sm">{apiKey}</code>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(apiKey)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Keep your API key secure and never expose it in client-side code
          </p>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">API Overview</CardTitle>
              <CardDescription className="text-slate-300">
                The TasteGraph.ai API provides programmatic access to our AI-powered audience insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Base URL</h4>
                  <code className="text-sm text-slate-300">https://api.tastegraph.ai/v1</code>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Authentication</h4>
                  <code className="text-sm text-slate-300">Bearer {apiKey}</code>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Features</h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start">
                    <Zap className="w-4 h-4 mt-0.5 mr-2 text-blue-400 flex-shrink-0" />
                    Generate audience personas using Qloo's Taste AI™
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-4 h-4 mt-0.5 mr-2 text-purple-400 flex-shrink-0" />
                    Discover cultural trends and emerging patterns
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-4 h-4 mt-0.5 mr-2 text-green-400 flex-shrink-0" />
                    Generate AI-powered content suggestions
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-4 h-4 mt-0.5 mr-2 text-yellow-400 flex-shrink-0" />
                    Export insights in structured JSON format
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">API Endpoints</CardTitle>
              <CardDescription className="text-slate-300">
                Available endpoints for the TasteGraph.ai API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-green-500">POST</Badge>
                    <code className="text-white">/insights/generate</code>
                  </div>
                  <p className="text-slate-300 text-sm">Generate AI insights for a project</p>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-blue-500">GET</Badge>
                    <code className="text-white">/insights/&#123;project_id&#125;</code>
                  </div>
                  <p className="text-slate-300 text-sm">Retrieve insights for a specific project</p>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-blue-500">GET</Badge>
                    <code className="text-white">/projects</code>
                  </div>
                  <p className="text-slate-300 text-sm">List all projects</p>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-green-500">POST</Badge>
                    <code className="text-white">/projects</code>
                  </div>
                  <p className="text-slate-300 text-sm">Create a new project</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Code Examples</CardTitle>
              <CardDescription className="text-slate-300">
                Implementation examples in different programming languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>

                {Object.entries(codeExamples).map(([lang, code]) => (
                  <TabsContent key={lang} value={lang}>
                    <div className="relative">
                      <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto">
                        <code className="text-slate-300 text-sm">{code}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(code)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Response Format</CardTitle>
              <CardDescription className="text-slate-300">
                Example response from the insights generation endpoint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto">
                  <code className="text-slate-300 text-sm">
{`{
  "success": true,
  "data": {
    "project_id": "project-123",
    "audience_personas": [
      {
        "name": "Eco-Conscious Millennials",
        "description": "Environmentally aware consumers aged 25-35",
        "characteristics": [
          "Values sustainability over price",
          "Active on social media",
          "Influences purchasing decisions through research"
        ]
      }
    ],
    "cultural_trends": [
      {
        "title": "Sustainable Fashion Movement",
        "description": "Growing demand for eco-friendly fashion",
        "confidence": 85,
        "impact": "High engagement with sustainable brands"
      }
    ],
    "content_suggestions": [
      {
        "title": "Behind-the-Scenes Sustainability Story",
        "description": "Show your eco-friendly production process",
        "platforms": ["Instagram", "TikTok", "YouTube"],
        "copy": "See how we turn recycled materials into fashion..."
      }
    ]
  }
}`}
                  </code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify({
                    success: true,
                    data: {
                      project_id: "project-123",
                      audience_personas: [
                        {
                          name: "Eco-Conscious Millennials",
                          description: "Environmentally aware consumers aged 25-35",
                          characteristics: [
                            "Values sustainability over price",
                            "Active on social media",
                            "Influences purchasing decisions through research"
                          ]
                        }
                      ],
                      cultural_trends: [
                        {
                          title: "Sustainable Fashion Movement",
                          description: "Growing demand for eco-friendly fashion",
                          confidence: 85,
                          impact: "High engagement with sustainable brands"
                        }
                      ],
                      content_suggestions: [
                        {
                          title: "Behind-the-Scenes Sustainability Story",
                          description: "Show your eco-friendly production process",
                          platforms: ["Instagram", "TikTok", "YouTube"],
                          copy: "See how we turn recycled materials into fashion..."
                        }
                      ]
                    }
                  }, null, 2))}
                  className="absolute top-2 right-2 text-slate-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Links */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Additional Resources</CardTitle>
          <CardDescription className="text-slate-300">
            Helpful links and documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => window.open('https://docs.qloo.com/docs/faqs', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Qloo Taste AI™ Documentation
            </Button>
            <Button
              variant="outline"
              className="justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => window.open('https://platform.openai.com/docs', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              OpenAI API Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiAccess;