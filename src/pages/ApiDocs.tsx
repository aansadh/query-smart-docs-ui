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
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6 text-background" />
              </div>
              <h1 className="text-xl font-bold text-foreground">CogniDoc</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" className="text-foreground hover:text-foreground/80 focus-ring">
                  Home
                </Button>
              </Link>
              <Link to="/app">
                <Button className="bg-foreground text-background hover:bg-foreground/90 focus-ring">
                  Try CogniDoc
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-32">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-6 px-6 py-2">
            API Documentation
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-foreground">CogniDoc API</h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Integrate CogniDoc's AI-powered document analysis into your applications with our simple, powerful REST API.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="overview" className="data-[state=active]:bg-foreground data-[state=active]:text-background">Overview</TabsTrigger>
            <TabsTrigger value="authentication" className="data-[state=active]:bg-foreground data-[state=active]:text-background">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints" className="data-[state=active]:bg-foreground data-[state=active]:text-background">Endpoints</TabsTrigger>
            <TabsTrigger value="examples" className="data-[state=active]:bg-foreground data-[state=active]:text-background">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <Card className="border border-border hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-foreground text-2xl">
                  <Code className="w-6 h-6" />
                  <span>Getting Started</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Learn how to integrate with the CogniDoc API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-foreground">
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Base URL</h3>
                  <code className="bg-muted px-4 py-2 rounded-lg text-sm">https://api.cognidoc.com</code>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Content Type</h3>
                  <p className="text-muted-foreground">All requests should include the header: <code className="bg-muted px-3 py-1 rounded text-sm">Content-Type: application/json</code></p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Response Format</h3>
                  <p className="text-muted-foreground">All responses are returned in JSON format.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border hover-lift">
              <CardHeader>
                <CardTitle className="text-foreground text-2xl">Available Endpoints</CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Overview of all available API endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {endpoints.map((endpoint, index) => (
                    <div key={index} className="flex items-center space-x-4 p-6 rounded-xl bg-accent hover:bg-accent/80 transition-colors">
                      <endpoint.icon className="w-6 h-6 text-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Badge variant={endpoint.method === 'POST' ? 'default' : 'destructive'} className="text-xs">
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{endpoint.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authentication" className="space-y-8">
            <Card className="border border-border hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-foreground text-2xl">
                  <Key className="w-6 h-6" />
                  <span>API Authentication</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  How to authenticate your API requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="text-foreground">
                  <h3 className="font-semibold mb-4 text-xl">Bearer Token Authentication</h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    CogniDoc uses Bearer token authentication. Your API token contains session information, so you only need to include it in the Authorization header.
                  </p>
                  
                  <div className="bg-accent p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground">Authorization Header</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_TOKEN')}
                        className="text-muted-foreground hover:text-foreground focus-ring"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <code className="text-sm text-foreground">Authorization: Bearer YOUR_API_TOKEN</code>
                  </div>
                  
                  <div className="mt-6 p-6 bg-muted rounded-xl border">
                    <p className="text-sm text-foreground">
                      <strong>Note:</strong> No Session-ID header is required when using API tokens. The token automatically identifies your session.
                    </p>
                  </div>
                </div>

                <div className="text-foreground">
                  <h3 className="font-semibold mb-4 text-xl">Getting Your API Token</h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Generate your API token from the CogniDoc application. Each token is tied to a specific session.
                  </p>
                  <Link to="/app">
                    <Button className="bg-foreground text-background hover:bg-foreground/90 focus-ring">
                      <Key className="w-4 h-4 mr-2" />
                      Generate Token
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-8">
            <Card className="border border-border hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-foreground text-2xl">
                  <Code className="w-6 h-6" />
                  <span>Available Endpoints</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Explore the list of available API endpoints
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="bg-accent rounded-xl p-6 hover:bg-accent/80 transition-colors">
                    <div className="flex items-center space-x-4">
                      <endpoint.icon className="w-6 h-6 text-foreground" />
                      <div>
                        <h4 className="font-semibold text-foreground text-lg">{endpoint.method} {endpoint.path}</h4>
                        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-8">
            <Card className="border border-border hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-foreground text-2xl">
                  <Code className="w-6 h-6" />
                  <span>Code Examples</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Explore code examples for different programming languages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="font-semibold text-foreground text-xl mb-4">Python</h3>
                    <div className="bg-accent p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
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
                          className="text-muted-foreground hover:text-foreground focus-ring"
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
                    <h3 className="font-semibold text-foreground text-xl mb-4">JavaScript</h3>
                    <div className="bg-accent p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
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
                          className="text-muted-foreground hover:text-foreground focus-ring"
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
