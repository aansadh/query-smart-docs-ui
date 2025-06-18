
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Upload, Globe, Activity, Zap } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  onViewChange: (view: string) => void;
}

export const Dashboard = ({ onViewChange }: DashboardProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      await apiService.healthCheck();
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      console.error('Connection check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Upload Document',
      description: 'Add a new PDF or text document',
      icon: Upload,
      action: () => onViewChange('upload'),
      color: 'bg-blue-500',
    },
    {
      title: 'Ask Question',
      description: 'Query your uploaded documents',
      icon: MessageSquare,
      action: () => onViewChange('query'),
      color: 'bg-green-500',
    },
    {
      title: 'Web Scraping',
      description: 'Import content from URLs',
      icon: Globe,
      action: () => onViewChange('scrape'),
      color: 'bg-purple-500',
    },
    {
      title: 'Manage Files',
      description: 'View and organize documents',
      icon: FileText,
      action: () => onViewChange('files'),
      color: 'bg-orange-500',
    },
  ];

  const features = [
    {
      title: 'AI-Powered Q&A',
      description: 'Ask natural language questions about your documents and get intelligent answers.',
      icon: Zap,
    },
    {
      title: 'Multi-Format Support',
      description: 'Upload PDFs, text documents, or scrape content directly from web URLs.',
      icon: FileText,
    },
    {
      title: 'Session Management',
      description: 'Organize your work with persistent sessions that maintain context.',
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Status Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">System Status</CardTitle>
              <CardDescription>API connection and service health</CardDescription>
            </div>
            <Button variant="outline" onClick={checkConnection} disabled={isLoading}>
              {isLoading ? 'Checking...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
              {isConnected ? 'Connected to API' : 'API Connection Failed'}
            </span>
          </div>
          {!isConnected && (
            <p className="text-sm text-gray-600 mt-2">
              Please check your API URL in settings and ensure the backend is running.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900">Getting Started</CardTitle>
          <CardDescription className="text-blue-700">
            Follow these simple steps to start using Smart PDF QA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <span className="text-gray-700">Configure your API settings and create a session</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-gray-700">Upload your PDF documents or add text content</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <span className="text-gray-700">Start asking questions about your documents</span>
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={() => onViewChange('settings')} className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
