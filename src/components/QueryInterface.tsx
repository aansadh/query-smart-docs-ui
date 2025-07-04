
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/useApi';

interface QueryResponse {
  response: string;
  sources: string[];
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: Date;
}

export const QueryInterface = () => {
  const { toast } = useToast();
  const { makeRequest } = useApi();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentSessionId = localStorage.getItem('current_session_id');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    if (!currentSessionId) {
      toast({
        title: "No Session",
        description: "Please create or select a session first",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await makeRequest({
        method: 'POST',
        url: '/query/askQuery',
        data: { query },
      });

      // Handle the response format properly
      const queryResponse: QueryResponse = response.data;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: queryResponse.response,
        sources: queryResponse.sources,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setQuery('');
      
      toast({
        title: "Query Processed",
        description: "Your question has been answered",
      });
    } catch (error) {
      console.error('Query error:', error);
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Ask Questions
        </h1>
        <p className="text-muted-foreground">
          Query your documents using natural language
        </p>
      </div>

      {currentSessionId && (
        <Card className="bg-accent/20 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-3 py-1">
                Active Session
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      <Card className="min-h-[400px] max-h-[600px] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Conversation</span>
          </CardTitle>
          <CardDescription>
            Your questions and AI responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Start by asking a question about your documents</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 mt-1 flex-shrink-0" />
                    ) : (
                      <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="text-xs font-medium mb-2 opacity-80">Sources:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.sources.map((source, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <FileText className="w-3 h-3 mr-1" />
                                {source}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-xs opacity-50 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-4 rounded-lg bg-muted">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing your question...</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Query Input */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="query" className="text-sm font-medium">
                Ask a question about your documents
              </label>
              <Textarea
                id="query"
                placeholder="What is the main topic discussed in my documents?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {query.length}/1000 characters
              </p>
              <Button 
                type="submit" 
                disabled={!query.trim() || isLoading || !currentSessionId}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Ask Question
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-3">💡 Tips for better results</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Be specific in your questions</li>
            <li>• Ask about concepts, summaries, or specific details</li>
            <li>• Use natural language - no need for complex syntax</li>
            <li>• Reference specific documents or sections if needed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
