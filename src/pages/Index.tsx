
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { UploadDocuments } from '@/components/UploadDocuments';
import { QueryInterface } from '@/components/QueryInterface';
import { WebScraping } from '@/components/WebScraping';
import { FileManagement } from '@/components/FileManagement';
import { Settings } from '@/components/Settings';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'upload':
        return <UploadDocuments />;
      case 'query':
        return <QueryInterface />;
      case 'scrape':
        return <WebScraping />;
      case 'files':
        return <FileManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderCurrentView()}
    </Layout>
  );
};

export default Index;
