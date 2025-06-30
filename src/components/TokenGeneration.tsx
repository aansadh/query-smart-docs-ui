
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, Key, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

export const TokenGeneration = () => {
  const { toast } = useToast();
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTokenVisible, setIsTokenVisible] = useState(false);

  const currentSessionId = localStorage.getItem('current_session_id');

  const generateToken = async () => {
    setIsGenerating(true);
    try {
      const response = await apiService.createToken();
      setGeneratedToken(response.token);
      setIsTokenVisible(true);
      
      toast({
        title: "Token Generated",
        description: "Your API token has been generated successfully. This is the only time it will be shown.",
      });
    } catch (error) {
      console.error('Token generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate token. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedToken) {
      await navigator.clipboard.writeText(generatedToken);
      toast({
        title: "Copied",
        description: "Token copied to clipboard",
      });
    }
  };

  const toggleTokenVisibility = () => {
    setIsTokenVisible(!isTokenVisible);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Generate API Token
        </h1>
        <p className="text-muted-foreground">
          Create a secure token to access CogniDoc API programmatically
        </p>
      </div>

      {currentSessionId && (
        <Card className="bg-accent/20 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-3 py-1">
                Current Session: {currentSessionId.substring(0, 12)}...
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/20">
        <CardHeader className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>API Access Token</CardTitle>
              <CardDescription>
                Generate a token for your current session to access the API
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!generatedToken ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the button below to generate a new API token for your current session.
              </p>
              <Button 
                onClick={generateToken} 
                disabled={isGenerating}
                className="bg-foreground text-background hover:bg-foreground/90"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Generate Token
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="token">Your API Token</Label>
                <Badge variant="destructive" className="text-xs">
                  One-time view only
                </Badge>
              </div>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    id="token"
                    type={isTokenVisible ? "text" : "password"}
                    value={generatedToken}
                    readOnly
                    className="pr-10 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={toggleTokenVisibility}
                  >
                    {isTokenVisible ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <Button onClick={copyToClipboard} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border border-destructive/20">
                <p className="text-sm text-destructive font-medium mb-2">
                  ⚠️ Important Security Notice
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• This token will only be shown once</li>
                  <li>• Copy and store it securely</li>
                  <li>• The token is tied to your current session</li>
                  <li>• It will be invalidated when the session ends</li>
                </ul>
              </div>
              <Button 
                onClick={() => {
                  setGeneratedToken(null);
                  setIsTokenVisible(false);
                }} 
                variant="outline" 
                className="w-full"
              >
                Generate New Token
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p>Use your token in API requests by including it in the Authorization header:</p>
            <div className="bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto">
              curl -H "Authorization: Bearer YOUR_TOKEN" \<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-H "Session-ID: YOUR_SESSION_ID" \<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;http://localhost:8000/query/askQuery
            </div>
            <p className="text-muted-foreground">
              For complete API documentation and examples, visit the{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary"
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-api-docs'))}
              >
                API Documentation
              </Button>{' '}
              section.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
