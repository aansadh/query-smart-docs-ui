
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Trash2, Search, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'text' | 'web';
  size?: string;
  created_at: string;
  status: 'active' | 'processing' | 'error';
}

export const FileManagement = () => {
  const [files, setFiles] = useState<FileItem[]>([
    // Mock data - in a real app, this would be fetched from the API
    {
      id: '1',
      name: 'Research Paper.pdf',
      type: 'pdf',
      size: '2.3 MB',
      created_at: '2024-01-15T10:30:00Z',
      status: 'active',
    },
    {
      id: '2',
      name: 'Meeting Notes',
      type: 'text',
      created_at: '2024-01-14T15:45:00Z',
      status: 'active',
    },
    {
      id: '3',
      name: 'Wikipedia Article',
      type: 'web',
      created_at: '2024-01-13T09:20:00Z',
      status: 'active',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    setDeletingFiles(prev => new Set(prev).add(fileId));
    
    try {
      await apiService.deleteFile(fileId);
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
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>;
      case 'processing':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Processing</span>;
      case 'error':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Error</span>;
      default:
        return null;
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

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredFiles.length} of {files.length} files
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No files found' : 'No files uploaded'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? `No files match "${searchTerm}". Try a different search term.`
                  : 'Upload some documents or add text content to get started.'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-upload'))}>
                  Upload Documents
                </Button>
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
                        <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                        {getStatusBadge(file.status)}
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
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
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-orange-900">File Management Notes</h4>
              <ul className="text-sm text-orange-700 mt-1 space-y-1">
                <li>• Deleting files will remove them from your knowledge base permanently</li>
                <li>• File search looks through file names and types</li>
                <li>• Processing status indicates files are being indexed</li>
                <li>• Error status may require re-uploading the file</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
