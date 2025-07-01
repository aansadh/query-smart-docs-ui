
import { FileCard } from './FileCard';

interface FileInfo {
  file_id: string;
  file_name: string;
  session_id: string;
  created_at?: string;
  size?: string;
  type?: string;
}

interface FileListProps {
  files: FileInfo[];
  deletingFiles: Set<string>;
  onDeleteFile: (fileId: string, fileName: string) => void;
}

export const FileList = ({ files, deletingFiles, onDeleteFile }: FileListProps) => {
  return (
    <div className="space-y-3">
      {files.map((file) => (
        <FileCard
          key={file.file_id}
          file={file}
          isDeleting={deletingFiles.has(file.file_id)}
          onDelete={onDeleteFile}
        />
      ))}
    </div>
  );
};
