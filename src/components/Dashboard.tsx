
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SessionManager } from './SessionManager';
import { Bot, FileText, MessageSquare, Globe, TrendingUp, Clock, Users, Activity } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

interface DashboardProps {
  onViewChange: (view: string) => void;
}

export const Dashboard = ({ onViewChange }: DashboardProps) => {
  const { makeRequest } = useApi();
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalFiles: 0,
    totalQueries: 0,
    isLoading: true,
  });

  const currentSession = localStorage.getItem('current_session_id');

  useEffect(() => {
    loadStats();
  }, [currentSession]);

  // Add event listeners for session changes and deletions
  useEffect(() => {
    const handleSessionChange = () => {
      loadStats();
    };

    const handleSessionDeleted = () => {
      loadStats();
    };

    window.addEventListener('sessionChanged', handleSessionChange);
    window.addEventListener('sessionDeleted', handleSessionDeleted);
    
    return () => {
      window.removeEventListener('sessionChanged', handleSessionChange);
      window.removeEventListener('sessionDeleted', handleSessionDeleted);
    };
  }, []);

  const loadStats = async () => {
    try {
      setStats(prev => ({ ...prev, isLoading: true }));
      
      // Load sessions
      const sessionsResponse = await makeRequest({
        method: 'GET',
        url: '/session/get-sessions',
      });
      
      // Load files for current session
      let files = [];
      if (currentSession) {
        const filesResponse = await makeRequest({
          method: 'GET',
          url: '/file/',
        });
        files = filesResponse.data;
      }
      
      setStats({
        totalSessions: sessionsResponse.data.length,
        totalFiles: files.length,
        totalQueries: 0, // This would need to be tracked in the backend
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  const features = [
    {
      title: 'Upload Documents',
      description: 'Add PDF files and text content to your knowledge base',
      icon: <FileText className="w-5 h-5" />,
      action: 'upload',
      color: 'text-blue-600',
    },
    {
      title: 'Ask Questions',
      description: 'Query your documents using natural language',
      icon: <MessageSquare className="w-5 h-5" />,
      action: 'query',
      color: 'text-green-600',
    },
    {
      title: 'Web Scraping',
      description: 'Import content directly from web URLs',
      icon: <Globe className="w-5 h-5" />,
      action: 'scrape',
      color: 'text-purple-600',
    },
    {
      title: 'Manage Files',
      description: 'View and organize your uploaded documents',
      icon: <Activity className="w-5 h-5" />,
      action: 'files',
      color: 'text-orange-600',
    },
  ];

  const handleSessionChange = (sessionId: string) => {
    localStorage.setItem('current_session_id', sessionId);
    // Dispatch custom event to notify dashboard of session change
    window.dispatchEvent(new CustomEvent('sessionChanged'));
    loadStats();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-foreground via-foreground/80 to-foreground/60 rounded-2xl flex items-center justify-center shadow-lg">
            <Bot className="w-9 h-9 text-background" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              CogniDoc
            </h1>
            <p className="text-lg text-muted-foreground">AI Document Assistant</p>
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
          Welcome to CogniDoc
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered document assistant. Upload documents, ask questions, and get intelligent insights.
        </p>
      </div>

      {/* Current Session Display */}
      {currentSession && (
        <Card className="bg-accent/20 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bot className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Active Session</h3>
                  <p className="text-sm text-muted-foreground">
                    Ready to process your documents
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.isLoading ? '...' : stats.totalSessions}
            </div>
            <p className="text-xs text-muted-foreground">
              Document processing sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files in Session</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.isLoading ? '...' : stats.totalFiles}
            </div>
            <p className="text-xs text-muted-foreground">
              Documents in current session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queries Processed</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.isLoading ? '...' : stats.totalQueries}
            </div>
            <p className="text-xs text-muted-foreground">
              Questions answered by AI
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>Session Management</span>
          </CardTitle>
          <CardDescription>
            Create and manage your document processing sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SessionManager 
            currentSessionId={currentSession} 
            onSessionChange={handleSessionChange}
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with these common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`${feature.color} flex-shrink-0`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm mb-1">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{feature.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-auto"
                    onClick={() => onViewChange(feature.action)}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">Getting Started</h3>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">1</span>
                  <span>Create or select a session to organize your documents</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">2</span>
                  <span>Upload PDFs, add text content, or scrape web pages</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">3</span>
                  <span>Ask questions about your documents using natural language</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium">4</span>
                  <span>Generate API tokens to integrate with your applications</span>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
