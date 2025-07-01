
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload } from 'lucide-react';

interface EmptyStateProps {
  searchTerm: string;
  onUploadRedirect: () => void;
}

export const EmptyState = ({ searchTerm, onUploadRedirect }: EmptyStateProps) => {
  return (
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
              <Button onClick={onUploadRedirect} className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Documents</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
