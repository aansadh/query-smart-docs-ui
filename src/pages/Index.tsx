
import { useState } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { UploadDocuments } from '@/components/UploadDocuments';
import { QueryInterface } from '@/components/QueryInterface';
import { WebScraping } from '@/components/WebScraping';
import { FileManagement } from '@/components/FileManagement';
import { TokenGeneration } from '@/components/TokenGeneration';
import ApiDocs from '@/pages/ApiDocs';

export default function Index() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'upload':
        return <UploadDocuments />;
      case 'query':
        return <QueryInterface onViewChange={setCurrentView} />;
      case 'scrape':
        return <WebScraping />;
      case 'files':
        return <FileManagement onViewChange={setCurrentView} />;
      case 'token':
        return <TokenGeneration />;
      case 'api-docs':
        return <ApiDocs />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <>
      <SignedIn>
        <Layout currentView={currentView} onViewChange={setCurrentView}>
          {renderContent()}
        </Layout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
