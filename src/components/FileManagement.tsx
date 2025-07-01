import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Trash2, Search, Calendar, Loader2, AlertCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/useApi';
import { FileInfo } from '@/services/api';

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

  const currentSessionId = localStorage.getItem('current_session_id');

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
      setFiles(response.data);
    } catch (error) {
      console.error('Failed to load files:', error);
      toast({
        title: "Error",
        description: "Failed to load files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    setDeletingFiles(prev => new Set(prev).add(fileId));
    
    try {
      await makeRequest({
        method: 'DELETE',
        url: `/ingest/delete-file/${fileId}`,
      });
      setFiles(prev => prev.filter(file => file.id !== fileId));
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

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'text':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'web':
        return <FileText className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'PDF Document';
      case 'text':
        return 'Text Content';
      case 'web':
        return 'Web Content';
      default:
        return 'Unknown';
    }
  };

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
        
        {currentSessionId && (
          <Card className="bg-accent/20 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="px-3 py-1">
                  Current Session: {currentSessionId.substring(0, 12)}...
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

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

      {currentSessionId && (
        <Card className="bg-accent/20 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-3 py-1">
                Current Session: {currentSessionId.substring(0, 12)}...
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredFiles.length} of {files.length} files
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm ? 'No files found' : 'No files uploaded'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? `No files match "${searchTerm}". Try a different search term.`
                  : 'Upload some documents or add text content to get started.'
                }
              </p>
              {!searchTerm && (
                <div className="flex justify-center">
                  <Button onClick={handleUploadRedirect} className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Documents</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-foreground truncate">{file.name}</h4>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <span>{getTypeLabel(file.type)}</span>
                        {file.size && <span>{file.size}</span>}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(file.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFile(file.id, file.name)}
                      disabled={deletingFiles.has(file.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 dark:text-red-400"
                    >
                      {deletingFiles.has(file.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-orange-900 dark:text-orange-100">File Management Notes</h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 mt-1 space-y-1">
                <li>• Deleting files will remove them from your knowledge base permanently</li>
                <li>• File search looks through file names and types</li>
                <li>• All files are associated with your current session</li>
                <li>• Switch sessions to view files from other sessions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
