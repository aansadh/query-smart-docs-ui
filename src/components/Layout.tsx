
import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { FileText, MessageSquare, Settings, Upload, Globe, User, LogOut, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const AppSidebar = ({ currentView, onViewChange }: { currentView: string; onViewChange: (view: string) => void }) => {
  const { toast } = useToast();

  const menuItems = [
    { id: 'dashboard', title: 'Dashboard', icon: Bot, description: 'Overview and quick access' },
    { id: 'upload', title: 'Upload Documents', icon: Upload, description: 'Add PDFs and text' },
    { id: 'query', title: 'Ask Questions', icon: MessageSquare, description: 'Query your documents' },
    { id: 'scrape', title: 'Web Scraping', icon: Globe, description: 'Import from URLs' },
    { id: 'files', title: 'Manage Files', icon: FileText, description: 'View and delete files' },
    { id: 'settings', title: 'Settings', icon: Settings, description: 'API and session config' },
  ];

  const handleLogout = async () => {
    try {
      await apiService.deleteSession();
      localStorage.clear();
      toast({
        title: "Logged out",
        description: "Session ended successfully",
      });
      onViewChange('settings');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to end session properly",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Smart PDF QA</h1>
            <p className="text-sm text-gray-500">AI-Powered Document Assistant</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Main Features
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    className={`w-full justify-start p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 ${
                      currentView === item.id ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-700'
                    }`}
                  >
                    <button onClick={() => onViewChange(item.id)} className="flex items-center space-x-3 text-left">
                      <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Session Active</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export const Layout = ({ children, currentView, onViewChange }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar currentView={currentView} onViewChange={onViewChange} />
        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 capitalize">
                    {currentView.replace(/([A-Z])/g, ' $1').trim()}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {currentView === 'dashboard' && 'Welcome to your AI document assistant'}
                    {currentView === 'upload' && 'Upload PDFs and text documents'}
                    {currentView === 'query' && 'Ask questions about your documents'}
                    {currentView === 'scrape' && 'Import content from web URLs'}
                    {currentView === 'files' && 'Manage your uploaded documents'}
                    {currentView === 'settings' && 'Configure API settings and sessions'}
                  </p>
                </div>
              </div>
            </div>
          </header>
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
