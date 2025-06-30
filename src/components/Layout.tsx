
import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { FileText, MessageSquare, Upload, Globe, User, LogOut, Bot, BookOpen, Moon, Sun, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/ThemeProvider';
import { apiService } from '@/services/api';
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const AppSidebar = ({ currentView, onViewChange }: { currentView: string; onViewChange: (view: string) => void }) => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  const menuItems = [
    { id: 'dashboard', title: 'Dashboard', icon: Bot, description: 'Session overview' },
    { id: 'upload', title: 'Upload Documents', icon: Upload, description: 'Add PDFs and text' },
    { id: 'query', title: 'Ask Questions', icon: MessageSquare, description: 'Query your documents' },
    { id: 'scrape', title: 'Web Scraping', icon: Globe, description: 'Import from URLs' },
    { id: 'files', title: 'Manage Files', icon: FileText, description: 'View and delete files' },
    { id: 'token', title: 'Generate Token', icon: Key, description: 'API access token' },
  ];

  const handleLogout = async () => {
    try {
      await apiService.deleteSession();
      localStorage.clear();
      toast({
        title: "Session ended",
        description: "Your session has been terminated",
      });
      onViewChange('dashboard');
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Get current session info from localStorage
  const currentSessionId = localStorage.getItem('current_session_id') || 'No active session';

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-8 border-b border-border">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Bot className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              CogniDoc
            </h1>
            <p className="text-sm text-muted-foreground">AI Document Assistant</p>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-6 py-8">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6 px-2">
            Session Features
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    className={`w-full justify-start py-4 px-4 rounded-lg transition-colors ${
                      currentView === item.id 
                        ? 'bg-foreground text-background' 
                        : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <button onClick={() => onViewChange(item.id)} className="flex items-center space-x-3 text-left">
                      <item.icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className={`text-xs ${currentView === item.id ? 'text-background/70' : 'text-muted-foreground'}`}>
                          {item.description}
                        </div>
                      </div>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-10">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6 px-2">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className="w-full justify-start py-4 px-4 rounded-lg transition-colors text-foreground/70 hover:bg-accent hover:text-foreground"
                >
                  <button onClick={() => onViewChange('api-docs')} className="flex items-center space-x-3 text-left">
                    <BookOpen className="w-5 h-5" />
                    <div>
                      <div className="font-medium text-sm">API Documentation</div>
                      <div className="text-xs text-muted-foreground">Integration guide</div>
                    </div>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-6 border-t border-border">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 text-sm p-4 rounded-lg bg-accent/50">
            <User className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="font-medium text-foreground">{user?.fullName || user?.emailAddresses[0]?.emailAddress || 'User'}</div>
              <div className="text-xs text-muted-foreground truncate">Session: {currentSessionId.substring(0, 12)}...</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground focus-ring"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export const Layout = ({ children, currentView, onViewChange }: LayoutProps) => {
  const currentSessionId = localStorage.getItem('current_session_id');
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentView={currentView} onViewChange={onViewChange} />
        <main className="flex-1 flex flex-col">
          <header className="px-8 py-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors focus-ring" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground capitalize">
                    {currentView.replace(/([A-Z])/g, ' $1').trim().replace('Api', 'API')}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {currentView === 'dashboard' && 'Manage your document sessions'}
                    {currentView === 'upload' && 'Upload PDFs and text documents'}
                    {currentView === 'query' && 'Ask questions about your documents'}
                    {currentView === 'scrape' && 'Import content from web URLs'}
                    {currentView === 'files' && 'Manage your uploaded documents'}
                    {currentView === 'token' && 'Generate API access tokens'}
                    {currentView === 'api-docs' && 'API integration documentation'}
                  </p>
                </div>
              </div>
              {currentSessionId && (
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">Current Session</p>
                  <p className="text-xs text-muted-foreground">{currentSessionId.substring(0, 12)}...</p>
                </div>
              )}
            </div>
          </header>
          <div className="flex-1 p-8 animate-slide-in">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
