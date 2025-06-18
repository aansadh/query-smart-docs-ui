
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Key, Book, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const ApiDocs = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/token/new-token',
      title: 'Generate API Token',
      description: 'Generate a new API token for programmatic access',
      auth: 'Bearer Token',
      requestBody: null,
      response: '{ "token": "sk-..." }'
    },
    {
      method: 'POST',
      path: '/session/new-session',
      title: 'Create Session',
      description: 'Create a new session for organizing documents',
      auth: 'Bearer Token',
      requestBody: null,
      response: '{ "session_id": "sess_..." }'
    },
    {
      method: 'DELETE',
      path: '/session/delete-session',
      title: 'Delete Session',
      description: 'Delete the current session and all its documents',
      auth: 'Bearer Token + Session-ID header',
      requestBody: null,
      response: '{ "message": "Session deleted" }'
    },
    {
      method: 'POST',
      path: '/ingest/uploadText',
      title: 'Upload Text',
      description: 'Add text content to your session',
      auth: 'Bearer Token + Session-ID header',
      requestBody: '{ "text": "...", "file_name": "..." }',
      response: '{ "message": "Text uploaded successfully" }'
    },
    {
      method: 'POST',
      path: '/ingest/uploadPdf',
      title: 'Upload PDF',
      description: 'Upload and process a PDF document',
      auth: 'Bearer Token + Session-ID header',
      requestBody: 'multipart/form-data with "file" field',
      response: '{ "message": "PDF uploaded successfully" }'
    },
    {
      method: 'POST',
      path: '/query/askQuery',
      title: 'Ask Question',
      description: 'Query your documents with natural language',
      auth: 'Bearer Token + Session-ID header',
      requestBody: '{ "query": "What is this document about?" }',
      response: '{ "answer": "...", "context": [...] }'
    },
    {
      method: 'POST',
      path: '/webscrape/',
      title: 'Scrape URL',
      description: 'Import content from a web URL',
      auth: 'Bearer Token + Session-ID header',
      requestBody: '{ "url": "https://example.com" }',
      response: '{ "message": "Content scraped successfully" }'
    },
    {
      method: 'DELETE',
      path: '/ingest/deleteFile/{file_id}',
      title: 'Delete File',
      description: 'Remove a specific file from your session',
      auth: 'Bearer Token + Session-ID header',
      requestBody: null,
      response: '{ "message": "File deleted" }'
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const codeExamples = {
    javascript: `// Install the fetch API or use axios
const API_BASE = 'http://localhost:8000';
const token = 'your-api-token';
const sessionId = 'your-session-id';

// Create a session
const response = await fetch(\`\${API_BASE}/session/new-session\`, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  }
});
const { session_id } = await response.json();

// Upload text
await fetch(\`\${API_BASE}/ingest/uploadText\`, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Session-ID': sessionId,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Your document content here',
    file_name: 'My Document'
  })
});

// Ask a question
const queryResponse = await fetch(\`\${API_BASE}/query/askQuery\`, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Session-ID': sessionId,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'What is this document about?'
  })
});
const { answer } = await queryResponse.json();`,

    python: `import requests

API_BASE = 'http://localhost:8000'
token = 'your-api-token'
session_id = 'your-session-id'

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# Create a session
response = requests.post(f'{API_BASE}/session/new-session', headers=headers)
session_data = response.json()
session_id = session_data['session_id']

# Upload text
headers['Session-ID'] = session_id
requests.post(f'{API_BASE}/ingest/uploadText', 
    headers=headers,
    json={
        'text': 'Your document content here',
        'file_name': 'My Document'
    }
)

# Ask a question
response = requests.post(f'{API_BASE}/query/askQuery',
    headers=headers,
    json={'query': 'What is this document about?'}
)
answer = response.json()['answer']`,

    curl: `# Create a session
curl -X POST "http://localhost:8000/session/new-session" \\
  -H "Authorization: Bearer your-api-token" \\
  -H "Content-Type: application/json"

# Upload text
curl -X POST "http://localhost:8000/ingest/uploadText" \\
  -H "Authorization: Bearer your-api-token" \\
  -H "Session-ID: your-session-id" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Your document content here",
    "file_name": "My Document"
  }'

# Ask a question
curl -X POST "http://localhost:8000/query/askQuery" \\
  -H "Authorization: Bearer your-api-token" \\
  -H "Session-ID: your-session-id" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "What is this document about?"
  }'`
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Book className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">API Documentation</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/app">
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart PDF QA API Documentation
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Integrate Smart PDF QA into your applications with our powerful REST API. 
            Manage sessions, upload documents, and query your content programmatically.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Key className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Getting Started</h3>
                <p className="text-blue-700 mb-4">
                  To use the API, you'll need to generate an API token from your dashboard. 
                  Tokens are session-scoped and can only be viewed once upon generation.
                </p>
                <Link to="/app">
                  <Button size="sm">
                    Generate API Token
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5" />
              <span>Quick Start</span>
            </CardTitle>
            <CardDescription>
              Get up and running with the Smart PDF QA API in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="javascript" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="curl">cURL</TabsTrigger>
              </TabsList>
              
              {Object.entries(codeExamples).map(([lang, code]) => (
                <TabsContent key={lang} value={lang}>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{code}</code>
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(code, lang)}
                    >
                      {copiedCode === lang ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* API Reference */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Reference</CardTitle>
            <CardDescription>
              Complete reference for all available endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {endpoints.map((endpoint, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-lg font-mono text-gray-900">
                        {endpoint.path}
                      </code>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {endpoint.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{endpoint.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Authentication:</span>
                      <p className="text-gray-600 mt-1">{endpoint.auth}</p>
                    </div>
                    
                    {endpoint.requestBody && (
                      <div>
                        <span className="font-medium text-gray-700">Request Body:</span>
                        <pre className="text-gray-600 mt-1 bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                          {endpoint.requestBody}
                        </pre>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium text-gray-700">Response:</span>
                      <pre className="text-gray-600 mt-1 bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                        {endpoint.response}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              How to authenticate your API requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Tokens</h3>
              <p className="text-gray-600 mb-4">
                API tokens are generated from your dashboard and provide programmatic access to your sessions. 
                Each token is unique and can only be viewed once upon generation for security.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Headers</h3>
              <p className="text-gray-600 mb-4">
                Most endpoints require both an Authorization header with your Bearer token and a Session-ID header 
                to specify which session you're working with.
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                <code>{`Authorization: Bearer your-api-token
Session-ID: your-session-id`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Rate Limits & Best Practices</CardTitle>
            <CardDescription>
              Guidelines for optimal API usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Rate Limits</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>100 requests per minute per API token</li>
                  <li>10 concurrent sessions per user</li>
                  <li>Maximum file size: 10MB per upload</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Practices</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Create separate sessions for different document collections</li>
                  <li>Use descriptive file names for better organization</li>
                  <li>Clean up unused sessions to maintain performance</li>
                  <li>Handle errors gracefully and implement retry logic</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiDocs;
