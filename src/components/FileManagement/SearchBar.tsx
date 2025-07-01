
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalFiles: number;
  filteredCount: number;
}

export const SearchBar = ({ searchTerm, onSearchChange, totalFiles, filteredCount }: SearchBarProps) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1 relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="text-sm text-muted-foreground">
        {filteredCount} of {totalFiles} files
      </div>
    </div>
  );
};
