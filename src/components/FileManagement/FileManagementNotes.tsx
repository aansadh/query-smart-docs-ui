
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const FileManagementNotes = () => {
  return (
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
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
