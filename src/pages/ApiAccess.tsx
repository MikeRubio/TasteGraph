import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, ExternalLink, Key, Zap } from "lucide-react";
import { toast } from 'sonner';

const ApiAccess = () => {
  const [apiKey] = useState('tg_sk_1234567890abcdef1234567890abcdef');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const codeExamples = {
    javascript: `// Initialize Libitum client
const tastegraph = new TasteGraph({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://api.Libitum'
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
    base_url='https://api.Libitum'
)

# Generate insights
insights = client.generate_insights(
    project_id='project-123',
    description='Eco-friendly fashion brand targeting Gen Z',
    cultural_domains=['fashion', 'sustainability'],
    geographical_targets=['US', 'UK', 'Canada']
)

print(insights)`,
    curl: `curl -X POST https://api.Libitum/v1/insights/generate \\
  -H "Authorization: Bearer your-api-key-here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "project_id": "project-123",
    "description": "Eco-friendly fashion brand targeting Gen Z",
    "cultural_domains": ["fashion", "sustainability"],
    "geographical_targets": ["US", "UK", "Canada"]
  }'`,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-black">API Access</h2>
        <p className="text-gray-600 mt-1">
          Integrate Libitum into your applications
        </p>
      </div>

      {/* API Key */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-black flex items-center">
            <Key className="w-5 h-5 mr-2" />
            API Key
          </CardTitle>
          <CardDescription className="text-gray-600">
            Use this key to authenticate your API requests
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <code className="text-black font-mono text-sm">{apiKey}</code>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(apiKey)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Keep your API key secure and never expose it in client-side code
          </p>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-black">API Overview</CardTitle>
              <CardDescription className="text-gray-600">
                The Libitum API provides programmatic access to our AI-powered
                audience insights
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-black mb-2">Base URL</h4>
                  <code className="text-sm text-gray-700">
                    https://api.Libitum/v1
                  </code>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-black mb-2">
                    Authentication
                  </h4>
                  <code className="text-sm text-gray-700">Bearer {apiKey}</code>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-black">Features</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <Zap className="w-4 h-4 mt-0.5 mr-3 text-blue-600 flex-shrink-0" />
                    Generate audience personas using Qloo's Taste AI™
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-4 h-4 mt-0.5 mr-3 text-purple-600 flex-shrink-0" />
                    Discover cultural trends and emerging patterns
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-4 h-4 mt-0.5 mr-3 text-green-600 flex-shrink-0" />
                    Generate AI-powered content suggestions
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-4 h-4 mt-0.5 mr-3 text-yellow-600 flex-shrink-0" />
                    Export insights in structured JSON format
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-black">API Endpoints</CardTitle>
              <CardDescription className="text-gray-600">
                Available endpoints for the Libitum API
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-green-600 text-white">POST</Badge>
                    <code className="text-black">/insights/generate</code>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Generate AI insights for a project
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-blue-600 text-white">GET</Badge>
                    <code className="text-black">
                      /insights/&#123;project_id&#125;
                    </code>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Retrieve insights for a specific project
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-blue-600 text-white">GET</Badge>
                    <code className="text-black">/projects</code>
                  </div>
                  <p className="text-gray-600 text-sm">List all projects</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-green-600 text-white">POST</Badge>
                    <code className="text-black">/projects</code>
                  </div>
                  <p className="text-gray-600 text-sm">Create a new project</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-black">Code Examples</CardTitle>
              <CardDescription className="text-gray-600">
                Implementation examples in different programming languages
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="javascript" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                  <TabsTrigger
                    value="javascript"
                    className="data-[state=active]:bg-white"
                  >
                    JavaScript
                  </TabsTrigger>
                  <TabsTrigger
                    value="python"
                    className="data-[state=active]:bg-white"
                  >
                    Python
                  </TabsTrigger>
                  <TabsTrigger
                    value="curl"
                    className="data-[state=active]:bg-white"
                  >
                    cURL
                  </TabsTrigger>
                </TabsList>

                {Object.entries(codeExamples).map(([lang, code]) => (
                  <TabsContent key={lang} value={lang}>
                    <div className="relative">
                      <pre className="bg-gray-900 border border-gray-200 rounded-lg p-4 overflow-x-auto">
                        <code className="text-gray-100 text-sm">{code}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(code)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
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
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-black">Response Format</CardTitle>
              <CardDescription className="text-gray-600">
                Example response from the insights generation endpoint
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative">
                <pre className="bg-gray-900 border border-gray-200 rounded-lg p-4 overflow-x-auto">
                  <code className="text-gray-100 text-sm">
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
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(
                        {
                          success: true,
                          data: {
                            project_id: "project-123",
                            audience_personas: [
                              {
                                name: "Eco-Conscious Millennials",
                                description:
                                  "Environmentally aware consumers aged 25-35",
                                characteristics: [
                                  "Values sustainability over price",
                                  "Active on social media",
                                  "Influences purchasing decisions through research",
                                ],
                              },
                            ],
                            cultural_trends: [
                              {
                                title: "Sustainable Fashion Movement",
                                description:
                                  "Growing demand for eco-friendly fashion",
                                confidence: 85,
                                impact:
                                  "High engagement with sustainable brands",
                              },
                            ],
                            content_suggestions: [
                              {
                                title: "Behind-the-Scenes Sustainability Story",
                                description:
                                  "Show your eco-friendly production process",
                                platforms: ["Instagram", "TikTok", "YouTube"],
                                copy: "See how we turn recycled materials into fashion...",
                              },
                            ],
                          },
                        },
                        null,
                        2
                      )
                    )
                  }
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Links */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-black">Additional Resources</CardTitle>
          <CardDescription className="text-gray-600">
            Helpful links and documentation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() =>
                window.open("https://docs.qloo.com/docs/faqs", "_blank")
              }
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Qloo Taste AI™ Documentation
            </Button>
            <Button
              variant="outline"
              className="justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() =>
                window.open("https://platform.openai.com/docs", "_blank")
              }
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