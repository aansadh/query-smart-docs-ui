
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Globe, Key, FileText, MessageSquare, Trash2, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const ApiDocs = () => {
  const endpoints = [
    {
      method: 'POST',
      path: '/session/new-session',
      description: 'Create a new session',
      icon: <Key className="w-4 h-4" />,
    },
    {
      method: 'GET',
      path: '/session/get-sessions',
      description: 'Get all user sessions',
      icon: <Key className="w-4 h-4" />,
    },
    {
      method: 'DELETE',
      path: '/session/delete-session',
      description: 'Delete current session',
      icon: <Trash2 className="w-4 h-4" />,
    },
    {
      method: 'POST',
      path: '/ingest/upload-text',
      description: 'Upload text content',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      method: 'POST',
      path: '/ingest/upload-pdf',
      description: 'Upload PDF file',
      icon: <Upload className="w-4 h-4" />,
    },
    {
      method: 'POST',
      path: '/query/askQuery',
      description: 'Ask questions about your documents',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      method: 'POST',
      path: '/webscrape/',
      description: 'Scrape content from URLs',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      method: 'GET',
      path: '/file/',
      description: 'Get all files in session',
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'POST':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            CogniDoc API Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Integrate CogniDoc's AI-powered document processing into your applications
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Key className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Authentication</h3>
              <p className="text-sm text-muted-foreground mb-4">Generate API tokens for secure access</p>
              <Link to="/app">
                <Button variant="outline" size="sm">Generate Token</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Code className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Base URL</h3>
              <p className="text-sm text-muted-foreground mb-4">All API requests use this endpoint</p>
              <code className="bg-muted px-2 py-1 rounded text-xs">http://localhost:8000</code>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Headers</h3>
              <p className="text-sm text-muted-foreground mb-4">Required headers for all requests</p>
              <div className="text-xs space-y-1">
                <div>Authorization: Bearer TOKEN</div>
                <div>Session-ID: SESSION_ID</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
            <CardDescription>
              Complete list of available endpoints and their functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {endpoints.map((endpoint, index) => (
                <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <Badge className={`${getMethodColor(endpoint.method)} font-mono text-xs`}>
                      {endpoint.method}
                    </Badge>
                    <code className="font-mono text-sm text-foreground">{endpoint.path}</code>
                    <div className="flex items-center space-x-2">
                      {endpoint.icon}
                      <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Authentication Example */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Authentication Example</CardTitle>
            <CardDescription>
              How to authenticate your requests using Bearer tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm text-foreground overflow-x-auto">
{`curl -X POST "http://localhost:8000/query/askQuery" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Session-ID: YOUR_SESSION_ID" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "What is the main topic of my documents?"}'`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Request/Response Examples */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Text Example</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Request:</h4>
                  <div className="bg-muted p-3 rounded text-xs">
                    <pre className="text-foreground">
{`POST /ingest/upload-text
{
  "text": "Your content here...",
  "file_name": "Document Title"
}`}
                    </pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Response:</h4>
                  <div className="bg-muted p-3 rounded text-xs">
                    <pre className="text-foreground">
{`{
  "file_id": "abc123",
  "session_id": "xyz789",
  "status": "processed"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Query Example</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Request:</h4>
                  <div className="bg-muted p-3 rounded text-xs">
                    <pre className="text-foreground">
{`POST /query/askQuery
{
  "query": "Summarize the key points"
}`}
                    </pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Response:</h4>
                  <div className="bg-muted p-3 rounded text-xs">
                    <pre className="text-foreground">
{`{
  "answer": "Based on your documents...",
  "sources": ["doc1", "doc2"],
  "confidence": 0.95
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t">
          <p className="text-muted-foreground">
            Need help? Check out our{' '}
            <Link to="/app" className="text-primary hover:underline">
              interactive dashboard
            </Link>{' '}
            or generate your first API token to get started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
