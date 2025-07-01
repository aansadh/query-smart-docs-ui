import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings as SettingsIcon, Key, Database, Loader2, CheckCircle, XCircle, Eye, EyeOff, Copy, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

export const Settings = () => {
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [sessionId, setSessionId] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isCreatingToken, setIsCreatingToken] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings
    const savedUrl = localStorage.getItem('api_url');
    const savedSessionId = localStorage.getItem('session_id');
    
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
        setGeneratedToken(response.token);
        setShowToken(true);
        toast({
          title: "API Token Generated",
          description: "Your new API token has been created. Copy it now - it won't be shown again!",
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
    if (!sessionName.trim()) {
      toast({
        title: "Session name required",
        description: "Please enter a session name before creating a session.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingSession(true);
    try {
      const response = await apiService.createSession(sessionName.trim());
      console.log('Session creation response:', response);
      
      if (response.session_id) {
        setSessionId(response.session_id);
        apiService.setSessionId(response.session_id);
        
        // Dispatch event to notify dashboard
        window.dispatchEvent(new CustomEvent('sessionChanged'));
        
        toast({
          title: "Session created",
          description: `New session created: ${sessionName}`,
        });
        setSessionName(''); // Clear the input after successful creation
      } else {
        // Generate a temporary session ID if not provided
        const tempSessionId = `session_${Date.now()}`;
        setSessionId(tempSessionId);
        apiService.setSessionId(tempSessionId);
        
        // Dispatch event to notify dashboard
        window.dispatchEvent(new CustomEvent('sessionChanged'));
        
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

  const copyToken = () => {
    navigator.clipboard.writeText(generatedToken);
    toast({
      title: "Token copied",
      description: "API token has been copied to clipboard",
    });
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
            Configure API settings, manage sessions, and generate API tokens
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="connection" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connection">API Connection</TabsTrigger>
          <TabsTrigger value="session">Session Management</TabsTrigger>
          <TabsTrigger value="tokens">API Tokens</TabsTrigger>
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
                  Sessions isolate your documents like separate conversations in ChatGPT
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionName">Session Name</Label>
                <Input
                  id="sessionName"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Enter session name"
                />
                <p className="text-sm text-gray-500">
                  Give your session a descriptive name
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleCreateSession}
                  disabled={isCreatingSession || !sessionName.trim()}
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
                  <li>• Isolate documents by project or topic</li>
                  <li>• Maintain separate conversation contexts</li>
                  <li>• Generate session-specific API tokens</li>
                  <li>• Organize your knowledge base efficiently</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens">
          <Card>
            <CardHeader>
              <CardTitle>API Tokens</CardTitle>
              <CardDescription>
                Generate API tokens for programmatic access to your sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {generatedToken && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <div className="space-y-3">
                      <p className="font-medium">Your API Token (Save this now - it won't be shown again!)</p>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={generatedToken}
                          readOnly
                          type={showToken ? 'text' : 'password'}
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowToken(!showToken)}
                        >
                          {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyToken}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Generate New Token</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Create a new API token for the current session. Each token is unique and provides 
                    programmatic access to upload documents and query your knowledge base.
                  </p>
                  
                  <Button
                    onClick={handleCreateToken}
                    disabled={isCreatingToken || !sessionId}
                  >
                    {isCreatingToken ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Token...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Generate API Token
                      </>
                    )}
                  </Button>
                  
                  {!sessionId && (
                    <p className="text-sm text-red-600 mt-2">
                      Please create a session first before generating tokens.
                    </p>
                  )}
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">Security Notice</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Tokens are shown only once upon generation</li>
                    <li>• Store tokens securely in your application</li>
                    <li>• Tokens are scoped to the session they were created in</li>
                    <li>• Regenerate tokens if compromised</li>
                  </ul>
                </div>
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
                  <li>• Session-based document organization</li>
                  <li>• Upload and process PDF documents</li>
                  <li>• Add text content directly</li>
                  <li>• Scrape content from web URLs</li>
                  <li>• Ask natural language questions</li>
                  <li>• Generate API tokens for integration</li>
                  <li>• RESTful API for developers</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">API Endpoints</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• <code className="bg-gray-100 px-1 rounded">POST /token/new-token</code> - Generate API tokens</div>
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
                  <div>Interface Version: 2.0.0</div>
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
