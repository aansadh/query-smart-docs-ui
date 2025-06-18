
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Upload, Globe, Key, BarChart3, Clock, Database } from 'lucide-react';
import { SessionManager } from '@/components/SessionManager';
import { useState } from 'react';

interface DashboardProps {
  onViewChange: (view: string) => void;
}

export const Dashboard = ({ onViewChange }: DashboardProps) => {
  const [currentSessionId, setCurrentSessionId] = useState<string>('session-1');

  const quickActions = [
    {
      title: "Upload Documents",
      description: "Add PDFs or text to your session",
      icon: Upload,
      action: "upload",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Ask Questions",
      description: "Query your documents with AI",
      icon: MessageSquare,
      action: "query",
      color: "from-violet-500 to-violet-600"
    },
    {
      title: "Web Scraping",
      description: "Import content from URLs",
      icon: Globe,
      action: "scrape",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Generate Token",
      description: "Create API access token",
      icon: Key,
      action: "token",
      color: "from-rose-500 to-rose-600"
    }
  ];

  const sessionStats = [
    { label: "Documents", value: "12", icon: FileText },
    { label: "Queries", value: "47", icon: MessageSquare },
    { label: "Sessions", value: "3", icon: Database },
    { label: "Uptime", value: "99.9%", icon: Clock }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Welcome to CogniDoc
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered document assistant. Upload documents, ask questions, and extract insights with advanced AI technology.
        </p>
      </div>

      {/* Session Management */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Session Management
          </CardTitle>
          <CardDescription>
            Manage your document sessions. Each session isolates your documents and conversation history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SessionManager 
            currentSessionId={currentSessionId}
            onSessionChange={setCurrentSessionId}
          />
        </CardContent>
      </Card>

      {/* Session Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sessionStats.map((stat, index) => (
          <Card key={index} className="border-border/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border/50 cursor-pointer" onClick={() => onViewChange(action.action)}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {action.description}
                    </p>
                    <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Get Started
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardHeader>
          <CardTitle>Platform Features</CardTitle>
          <CardDescription>
            Discover what makes CogniDoc powerful for document intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Smart Document Processing</h4>
              <p className="text-sm text-muted-foreground">
                Advanced AI extracts and indexes content from PDFs and text documents for instant searchability.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Natural Language Queries</h4>
              <p className="text-sm text-muted-foreground">
                Ask questions in plain English and get precise, contextual answers from your documents.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Session Isolation</h4>
              <p className="text-sm text-muted-foreground">
                Organize documents in separate sessions with independent contexts and conversation histories.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
