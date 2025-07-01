
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/useApi';
import { SearchBar } from './SearchBar';
import { FileList } from './FileList';
import { EmptyState } from './EmptyState';
import { FileManagementNotes } from './FileManagementNotes';

interface FileInfo {
  file_id: string;
  file_name: string;
  session_id: string;
  created_at?: string;
  size?: string;
  type?: string;
}

interface FileManagementProps {
  onViewChange?: (view: string) => void;
}

export const FileManagement = ({ onViewChange }: FileManagementProps) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { makeRequest } = useApi();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const response = await makeRequest({
        method: 'GET',
        url: '/file/',
      });
      console.log('Files response:', response.data);
      setFiles(response.data || []);
    } catch (error) {
      console.error('Failed to load files:', error);
      toast({
        title: "Error",
        description: "Failed to load files. Please try again.",
        variant: "destructive",
      });
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    setDeletingFiles(prev => new Set(prev).add(fileId));
    
    try {
      await makeRequest({
        method: 'DELETE',
        url: `/file/delete-file/${fileId}`,
      });
      setFiles(prev => prev.filter(file => file.file_id !== fileId));
      toast({
        title: "File deleted",
        description: `"${fileName}" has been removed from your knowledge base`,
      });
    } catch (error) {
      console.error('Delete file error:', error);
      toast({
        title: "Delete failed",
        description: `Failed to delete "${fileName}". Please try again.`,
        variant: "destructive",
      });
    } finally {
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleUploadRedirect = () => {
    if (onViewChange) {
      onViewChange('upload');
    }
  };

  const filteredFiles = files.filter(file => {
    const fileName = file.file_name || '';
    return fileName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>File Management</span>
            </CardTitle>
            <CardDescription>
              View, search, and manage your uploaded documents and content
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading files...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>File Management</span>
          </CardTitle>
          <CardDescription>
            View, search, and manage your uploaded documents and content
          </CardDescription>
        </CardHeader>
      </Card>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalFiles={files.length}
        filteredCount={filteredFiles.length}
      />

      {filteredFiles.length === 0 ? (
        <EmptyState
          searchTerm={searchTerm}
          onUploadRedirect={handleUploadRedirect}
        />
      ) : (
        <FileList
          files={filteredFiles}
          deletingFiles={deletingFiles}
          onDeleteFile={handleDeleteFile}
        />
      )}

      <FileManagementNotes />
    </div>
  );
};
