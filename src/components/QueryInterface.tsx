
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, FileText, Loader2, Upload, Globe } from 'lucide-react';
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

interface QueryInterfaceProps {
  onViewChange?: (view: string) => void;
}

export const QueryInterface = ({ onViewChange }: QueryInterfaceProps) => {
  const { toast } = useToast();
  const { makeRequest } = useApi();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentSessionId = localStorage.getItem('current_session_id');

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_history_${currentSessionId}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
  }, [currentSessionId]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0 && currentSessionId) {
      localStorage.setItem(`chat_history_${currentSessionId}`, JSON.stringify(messages));
    }
  }, [messages, currentSessionId]);

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

  const handleUpload = () => {
    if (onViewChange) {
      onViewChange('upload');
    }
  };

  const handleScrape = () => {
    if (onViewChange) {
      onViewChange('scrape');
    }
  };

  const handleExampleQuestion = (question: string) => {
    setQuery(question);
  };

  const exampleQuestions = [
    "What are the main topics covered in the uploaded documents?",
    "Can you summarize the key findings from the research?",
    "What are the most important points mentioned?",
    "How does this relate to current industry trends?",
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-6 h-6" />
          <h1 className="text-2xl font-semibold">Ask Questions</h1>
        </div>
        {currentSessionId && (
          <Badge variant="outline" className="px-3 py-1">
            Active Session
          </Badge>
        )}
      </div>

      {/* Messages Container - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <Bot className="w-16 h-16 text-muted-foreground/50" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-muted-foreground">
                Start a conversation
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Ask questions about your documents and get AI-powered answers with source citations
              </p>
            </div>
            
            {/* Example Questions */}
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm font-medium text-muted-foreground">Try these example questions:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleQuestion(question)}
                    className="p-3 text-left text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors border border-border/50 hover:border-border"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-12'
                      : 'bg-muted mr-12'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {message.type === 'user' ? (
                      <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Bot className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 space-y-2">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                      {message.sources && message.sources.length > 0 && (
                        <div className="pt-2 border-t border-border/50">
                          <p className="text-xs font-medium mb-2 opacity-80">Sources:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.sources.map((source, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <FileText className="w-3 h-3 mr-1" />
                                {source}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-xs opacity-50">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-4 rounded-lg bg-muted mr-12">
                  <div className="flex items-center space-x-3">
                    <Bot className="w-5 h-5" />
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Processing your question...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Textarea
              placeholder="Ask a question about your documents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[60px] max-h-[120px] resize-none pr-4 pb-12"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            {/* Action Buttons */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleUpload}
                  disabled={isLoading}
                  className="h-8 px-3"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleScrape}
                  disabled={isLoading}
                  className="h-8 px-3"
                >
                  <Globe className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                type="submit"
                size="sm"
                disabled={!query.trim() || isLoading || !currentSessionId}
                className="h-8 px-4"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
            <span>{query.length}/1000</span>
          </div>
        </form>
      </div>
    </div>
  );
};
