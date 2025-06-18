
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Key, Database, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

export const Settings = () => {
  const [apiToken, setApiToken] = useState('');
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [sessionId, setSessionId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isCreatingToken, setIsCreatingToken] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings
    const savedToken = localStorage.getItem('api_token');
    const savedUrl = localStorage.getItem('api_url');
    const savedSessionId = localStorage.getItem('session_id');
    
    if (savedToken) setApiToken(savedToken);
    if (savedUrl) setApiUrl(savedUrl);
    if (savedSessionId) setSessionId(savedSessionId);
    
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsTestingConnection(true);
    try {
      await apiService.healthCheck();
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      console.error('Connection check failed:', error);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('api_url', apiUrl);
    if (apiToken) {
      localStorage.setItem('api_token', apiToken);
      apiService.setToken(apiToken);
    }
    
    toast({
      title: "Settings saved",
      description: "API configuration has been updated",
    });
    
    checkConnection();
  };

  const handleCreateToken = async () => {
    setIsCreatingToken(true);
    try {
      const response = await apiService.createToken();
      console.log('Token creation response:', response);
      
      if (response.token) {
        setApiToken(response.token);
        apiService.setToken(response.token);
        localStorage.setItem('api_token', response.token);
        toast({
          title: "Token created",
          description: "New API token has been generated and saved",
        });
      } else {
        toast({
          title: "Token creation completed",
          description: "Check the response for your token details",
        });
      }
    } catch (error) {
      console.error('Token creation error:', error);
      toast({
        title: "Token creation failed",
        description: "Failed to create API token. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingToken(false);
    }
  };

  const handleCreateSession = async () => {
    setIsCreatingSession(true);
    try {
      const response = await apiService.createSession();
      console.log('Session creation response:', response);
      
      if (response.session_id) {
        setSessionId(response.session_id);
        apiService.setSessionId(response.session_id);
        toast({
          title: "Session created",
          description: `New session created: ${response.session_id}`,
        });
      } else {
        // Generate a temporary session ID if not provided
        const tempSessionId = `session_${Date.now()}`;
        setSessionId(tempSessionId);
        apiService.setSessionId(tempSessionId);
        toast({
          title: "Session initialized",
          description: "Session has been set up for this browser",
        });
      }
    } catch (error) {
      console.error('Session creation error:', error);
      toast({
        title: "Session creation failed",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleDeleteSession = async () => {
    try {
      await apiService.deleteSession();
      setSessionId('');
      toast({
        title: "Session deleted",
        description: "Current session has been terminated",
      });
    } catch (error) {
      console.error('Session deletion error:', error);
      toast({
        title: "Session deletion failed",
        description: "Failed to delete session. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </CardTitle>
          <CardDescription>
            Configure API settings and manage your session
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="connection" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connection">API Connection</TabsTrigger>
          <TabsTrigger value="session">Session Management</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="connection">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Configure your connection to the Smart PDF QA backend
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiUrl">API Base URL</Label>
                <Input
                  id="apiUrl"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                />
                <p className="text-sm text-gray-500">
                  The base URL of your Smart PDF QA API server
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiToken">API Token</Label>
                <div className="flex space-x-2">
                  <Input
                    id="apiToken"
                    type="password"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    placeholder="Enter your API token"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCreateToken}
                    disabled={isCreatingToken}
                    variant="outline"
                  >
                    {isCreatingToken ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Key className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Your authentication token for API access
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-medium">Connected</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-700 font-medium">Not Connected</span>
                    </>
                  )}
                </div>
                <div className="space-x-2">
                  <Button
                    onClick={checkConnection}
                    disabled={isTestingConnection}
                    variant="outline"
                  >
                    {isTestingConnection ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Test Connection
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    Save Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session">
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>
                Manage your current session for document uploads and queries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionId">Current Session ID</Label>
                <Input
                  id="sessionId"
                  value={sessionId}
                  readOnly
                  placeholder="No active session"
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500">
                  Sessions help organize your documents and maintain context
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleCreateSession}
                  disabled={isCreatingSession}
                  className="flex-1"
                >
                  {isCreatingSession ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Session...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Create New Session
                    </>
                  )}
                </Button>
                
                {sessionId && (
                  <Button
                    onClick={handleDeleteSession}
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete Session
                  </Button>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Session Benefits</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Keep your documents organized and separate from other users</li>
                  <li>• Maintain context across multiple queries and uploads</li>
                  <li>• Enable session-specific file management</li>
                  <li>• Improved security and data isolation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Smart PDF QA</CardTitle>
              <CardDescription>
                Information about this application and its capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Upload and process PDF documents</li>
                  <li>• Add text content directly</li>
                  <li>• Scrape content from web URLs</li>
                  <li>• Ask natural language questions about your content</li>
                  <li>• Session-based document management</li>
                  <li>• RESTful API integration</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">API Endpoints</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• <code className="bg-gray-100 px-1 rounded">POST /session/new-session</code> - Create new session</div>
                  <div>• <code className="bg-gray-100 px-1 rounded">POST /ingest/uploadPdf</code> - Upload PDF files</div>
                  <div>• <code className="bg-gray-100 px-1 rounded">POST /ingest/uploadText</code> - Upload text content</div>
                  <div>• <code className="bg-gray-100 px-1 rounded">POST /query/askQuery</code> - Query documents</div>
                  <div>• <code className="bg-gray-100 px-1 rounded">POST /webscrape/</code> - Scrape web content</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Version Information</h4>
                <div className="text-gray-700 space-y-1">
                  <div>Interface Version: 1.0.0</div>
                  <div>API Version: OpenAPI 3.1.0</div>
                  <div>Built with: React, TypeScript, Tailwind CSS</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
