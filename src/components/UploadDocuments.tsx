
import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Type, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

export const UploadDocuments = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handlePdfUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const result = await apiService.uploadPdf(selectedFile);
      console.log('PDF upload result:', result);
      toast({
        title: "Success",
        description: `PDF "${selectedFile.name}" uploaded successfully`,
      });
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('PDF upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextUpload = async () => {
    if (!textContent.trim() || !fileName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both text content and a file name",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const document = {
        text: textContent,
        file_name: fileName,
        created_at: new Date().toISOString(),
      };
      const result = await apiService.uploadText(document);
      console.log('Text upload result:', result);
      toast({
        title: "Success",
        description: `Text document "${fileName}" uploaded successfully`,
      });
      setTextContent('');
      setFileName('');
    } catch (error) {
      console.error('Text upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload text document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Documents</span>
          </CardTitle>
          <CardDescription>
            Add PDF files or text content to your knowledge base for AI-powered querying
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="pdf" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pdf" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>PDF Upload</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center space-x-2">
            <Type className="w-4 h-4" />
            <span>Text Content</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pdf">
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF Document</CardTitle>
              <CardDescription>
                Upload PDF files to extract and index their content for intelligent querying
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700">
                    Drop your PDF file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Maximum file size: 10MB
                  </p>
                </div>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="mt-4 w-full max-w-xs mx-auto"
                />
              </div>

              {selectedFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">{selectedFile.name}</p>
                        <p className="text-sm text-blue-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setSelectedFile(null)}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              <Button
                onClick={handlePdfUpload}
                disabled={!selectedFile || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading PDF...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload PDF
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Add Text Content</CardTitle>
              <CardDescription>
                Directly input text content to be indexed and made searchable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fileName">Document Name</Label>
                <Input
                  id="fileName"
                  placeholder="Enter a descriptive name for this text content"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textContent">Text Content</Label>
                <Textarea
                  id="textContent"
                  placeholder="Paste or type your text content here..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="min-h-[300px] resize-y"
                />
                <p className="text-sm text-gray-500">
                  {textContent.length} characters
                </p>
              </div>

              <Button
                onClick={handleTextUpload}
                disabled={!textContent.trim() || !fileName.trim() || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding Text Content...
                  </>
                ) : (
                  <>
                    <Type className="w-4 h-4 mr-2" />
                    Add Text Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-xs font-bold text-white">!</span>
            </div>
            <div>
              <h4 className="font-medium text-yellow-800">Tips for better results</h4>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• Upload clear, text-based PDFs for optimal extraction</li>
                <li>• Use descriptive file names to help organize your content</li>
                <li>• Break large documents into sections for more precise querying</li>
                <li>• Ensure you have an active session before uploading</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
