
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trash2, Calendar, Loader2 } from 'lucide-react';

interface FileInfo {
  file_id: string;
  file_name: string;
  session_id: string;
  created_at?: string;
  size?: string;
  type?: string;
}

interface FileCardProps {
  file: FileInfo;
  isDeleting: boolean;
  onDelete: (fileId: string, fileName: string) => void;
}

export const FileCard = ({ file, isDeleting, onDelete }: FileCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (type?: string) => {
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

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'pdf':
        return 'PDF Document';
      case 'text':
        return 'Text Content';
      case 'web':
        return 'Web Content';
      default:
        return 'Document';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {getFileIcon(file.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-foreground truncate">{file.file_name || 'Unnamed file'}</h4>
              </div>
              <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                <span>{getTypeLabel(file.type)}</span>
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
              onClick={() => onDelete(file.file_id, file.file_name || 'Unnamed file')}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 dark:text-red-400"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
