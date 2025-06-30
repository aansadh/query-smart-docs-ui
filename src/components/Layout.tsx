
import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { FileText, MessageSquare, Upload, Globe, User, LogOut, Bot, BookOpen, Moon, Sun, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/ThemeProvider';
import { apiService } from '@/services/api';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const AppSidebar = ({ currentView, onViewChange }: { currentView: string; onViewChange: (view: string) => void }) => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

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
        title: "Logged out",
        description: "Session ended successfully",
      });
      onViewChange('dashboard');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to end session properly",
        variant: "destructive",
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Get current session info from localStorage
  const currentSessionId = localStorage.getItem('currentSessionId') || 'session-1';
  const currentSessionName = localStorage.getItem('currentSessionName') || 'Research Papers';

  return (
    <Sidebar className="glass-effect border-r border-border/30 shadow-soft">
      <SidebarHeader className="p-6 border-b border-border/30">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-medium animate-glow group-hover:scale-110 transition-all duration-300">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">
              CogniDoc
            </h1>
            <p className="text-sm text-muted-foreground">AI Document Assistant</p>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6 space-professional">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            Session Features
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    className={`w-full justify-start py-4 px-4 rounded-xl transition-all duration-300 hover:shadow-soft group ${
                      currentView === item.id 
                        ? 'gradient-primary text-white shadow-medium' 
                        : 'text-foreground/80 hover:bg-accent/50'
                    }`}
                  >
                    <button onClick={() => onViewChange(item.id)} className="flex items-center space-x-3 text-left">
                      <item.icon className={`w-5 h-5 transition-colors ${
                        currentView === item.id ? 'text-white' : 'text-muted-foreground group-hover:text-primary'
                      }`} />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className={`text-xs ${currentView === item.id ? 'text-white/80' : 'text-muted-foreground'}`}>
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

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className="w-full justify-start py-4 px-4 rounded-xl transition-all duration-300 hover:bg-accent/50 hover:shadow-soft text-foreground/80 group"
                >
                  <button onClick={() => onViewChange('api-docs')} className="flex items-center space-x-3 text-left">
                    <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div>
                      <div className="font-medium">API Documentation</div>
                      <div className="text-xs text-muted-foreground">Integration guide</div>
                    </div>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-border/30">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-sm p-3 rounded-xl glass-effect">
            <User className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium text-foreground">{currentSessionName}</div>
              <div className="text-xs text-muted-foreground">ID: {currentSessionId}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground focus-ring rounded-lg"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive focus-ring rounded-lg"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export const Layout = ({ children, currentView, onViewChange }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentView={currentView} onViewChange={onViewChange} />
        <main className="flex-1 flex flex-col">
          <header className="glass-effect px-6 py-4 sticky top-0 z-40 shadow-soft">
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
            </div>
          </header>
          <div className="flex-1 p-6 animate-slide-in">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
