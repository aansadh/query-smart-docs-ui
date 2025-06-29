import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Key, FileText, MessageSquare, Globe, Copy, ExternalLink, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const ApiDocs = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Code snippet has been copied to your clipboard.",
    });
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/ingest/uploadPdf',
      description: 'Upload a PDF file for processing',
      icon: FileText
    },
    {
      method: 'POST',
      path: '/ingest/uploadText',
      description: 'Upload text content for processing',
      icon: FileText
    },
    {
      method: 'POST',
      path: '/query/askQuery',
      description: 'Ask questions about uploaded documents',
      icon: MessageSquare
    },
    {
      method: 'POST',
      path: '/webscrape/',
      description: 'Scrape content from web URLs',
      icon: Globe
    },
    {
      method: 'DELETE',
      path: '/ingest/deleteFile/{file_id}',
      description: 'Delete a specific file from the session',
      icon: FileText
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg animate-glow">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-gradient">CogniDoc</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Home
              </Button>
            </Link>
            <Link to="/app">
              <Button className="gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
                Try CogniDoc
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
            API Documentation
          </Badge>
          <h1 className="text-4xl font-bold mb-4 text-gradient">CogniDoc API</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Integrate CogniDoc's AI-powered document analysis into your applications with our simple REST API.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
            <TabsTrigger value="authentication" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Endpoints</TabsTrigger>
            <TabsTrigger value="examples" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Code className="w-5 h-5" />
                  <span>Getting Started</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Learn how to integrate with the CogniDoc API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground">
                <div>
                  <h3 className="font-semibold mb-2">Base URL</h3>
                  <code className="bg-muted px-3 py-1 rounded text-sm">https://api.cognidoc.com</code>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Content Type</h3>
                  <p className="text-muted-foreground">All requests should include the header: <code className="bg-muted px-2 py-1 rounded text-sm">Content-Type: application/json</code></p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Response Format</h3>
                  <p className="text-muted-foreground">All responses are returned in JSON format.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Available Endpoints</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Overview of all available API endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {endpoints.map((endpoint, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                      <endpoint.icon className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={endpoint.method === 'POST' ? 'default' : 'destructive'} className="text-xs">
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authentication" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Key className="w-5 h-5" />
                  <span>API Authentication</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  How to authenticate your API requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-foreground">
                  <h3 className="font-semibold mb-3">Bearer Token Authentication</h3>
                  <p className="text-muted-foreground mb-4">
                    CogniDoc uses Bearer token authentication. Your API token contains session information, so you only need to include it in the Authorization header.
                  </p>
                  
                  <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Authorization Header</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_TOKEN')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <code className="text-sm text-foreground">Authorization: Bearer YOUR_API_TOKEN</code>
                  </div>
                  
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-foreground">
                      <strong>Note:</strong> No Session-ID header is required when using API tokens. The token automatically identifies your session.
                    </p>
                  </div>
                </div>

                <div className="text-foreground">
                  <h3 className="font-semibold mb-3">Getting Your API Token</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate your API token from the CogniDoc application. Each token is tied to a specific session.
                  </p>
                  <Link to="/app">
                    <Button className="gradient-primary text-primary-foreground">
                      <Key className="w-4 h-4 mr-2" />
                      Generate Token
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
             <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Code className="w-5 h-5" />
                  <span>Available Endpoints</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Explore the list of available API endpoints
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="border border-border/50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <endpoint.icon className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-semibold text-foreground">{endpoint.method} {endpoint.path}</h4>
                        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
             <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Code className="w-5 h-5" />
                  <span>Code Examples</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Explore code examples for different programming languages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Python</h3>
                    <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Example Code</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(
                            `import requests

url = "https://api.cognidoc.com/query/askQuery"

payload = {
    "query": "What is the main topic of this document?"
}
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_TOKEN"
}

response = requests.post(url, json=payload, headers=headers)

print(response.json())`
                          )}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <code className="text-sm text-foreground block whitespace-pre-wrap">
                        {`import requests

url = "https://api.cognidoc.com/query/askQuery"

payload = {
    "query": "What is the main topic of this document?"
}
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_TOKEN"
}

response = requests.post(url, json=payload, headers=headers)

print(response.json())`}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground">JavaScript</h3>
                    <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Example Code</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(
                            `const axios = require('axios');

const url = "https://api.cognidoc.com/query/askQuery";

const payload = {
    query: "What is the main topic of this document?"
};
const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_TOKEN"
};

axios.post(url, payload, { headers: headers })
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error(error);
});`
                          )}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <code className="text-sm text-foreground block whitespace-pre-wrap">
                        {`const axios = require('axios');

const url = "https://api.cognidoc.com/query/askQuery";

const payload = {
    query: "What is the main topic of this document?"
};
const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_TOKEN"
};

axios.post(url, payload, { headers: headers })
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error(error);
});`}
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApiDocs;
