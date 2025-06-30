
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, Loader2, Upload, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const QueryInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Empty query",
        description: "Please enter a question to ask",
        variant: "destructive",
      });
      return;
    }

    if (query.length < 2) {
      toast({
        title: "Query too short",
        description: "Please enter at least 2 characters",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: query,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await apiService.askQuery({ query });
      console.log('Query response:', response);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer || JSON.stringify(response, null, 2),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Query error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error while processing your question. Please make sure you have uploaded documents and try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Query failed",
        description: "Failed to process your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed",
    });
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const exampleQueries = [
    "What is the main topic of the uploaded documents?",
    "Can you summarize the key points?",
    "What are the important dates mentioned?",
    "Who are the main people or organizations discussed?",
  ];

  const currentSessionId = localStorage.getItem('current_session_id');

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-180px)] flex flex-col">
      {/* Header with Session Info - Fixed */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-background" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Ask Questions</h2>
            <p className="text-muted-foreground">Query your uploaded documents using natural language</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {currentSessionId && (
            <Badge variant="outline" className="px-3 py-1">
              Session: {currentSessionId.substring(0, 12)}...
            </Badge>
          )}
          {messages.length > 0 && (
            <Button variant="outline" onClick={clearChat} className="border-border text-foreground">
              Clear Chat
            </Button>
          )}
        </div>
      </div>

      {/* Chat Area - Flexible */}
      <div className="flex-1 flex flex-col bg-card/30 rounded-2xl border border-border/50 backdrop-blur-sm">
        <ScrollArea className="flex-1 p-6">
          {messages.length === 0 ? (
            <div className="space-y-8 h-full flex flex-col justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Bot className="w-10 h-10 text-background" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Start a conversation
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Ask questions about your uploaded documents and I'll provide intelligent answers based on the content.
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto w-full">
                <h4 className="font-medium text-foreground mb-4 text-center">Example questions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exampleQueries.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left h-auto p-4 whitespace-normal border-border text-foreground hover:bg-accent hover:border-foreground/50 transition-all duration-300"
                      onClick={() => setQuery(example)}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-foreground text-background shadow-lg'
                        : 'bg-muted/50 text-foreground border border-border/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.sender === 'bot' && (
                        <Bot className="w-5 h-5 text-foreground mt-0.5 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="w-5 h-5 text-background/80 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                        <p
                          className={`text-xs mt-3 ${
                            message.sender === 'user' ? 'text-background/70' : 'text-muted-foreground'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 p-4 rounded-2xl border border-border/50">
                    <div className="flex items-center space-x-3">
                      <Bot className="w-5 h-5 text-foreground" />
                      <Loader2 className="w-4 h-4 animate-spin text-foreground" />
                      <span className="text-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        {/* Input Area - Fixed at bottom with consistent sizing */}
        <div className="border-t border-border/50 p-6 bg-background/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-3 items-end">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about your documents..."
                  className="min-h-[60px] max-h-[120px] resize-none bg-background border-border text-foreground pr-24"
                  disabled={isLoading}
                />
                <div className="absolute right-2 top-2 flex space-x-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    title="Upload files"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    title="Add URL"
                  >
                    <Globe className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="bg-foreground text-background shadow-lg hover:bg-foreground/90 transition-all duration-300 h-[60px] px-6"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
