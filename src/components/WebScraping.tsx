
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

export const WebScraping = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastScrapedUrl, setLastScrapedUrl] = useState('');
  const { toast } = useToast();

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleScrape = async () => {
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a URL to scrape",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (including http:// or https://)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiService.scrapeUrl({ url });
      console.log('Scraping result:', result);
      setLastScrapedUrl(url);
      toast({
        title: "Success",
        description: `Content from ${url} has been scraped and added to your knowledge base`,
      });
      setUrl('');
    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: "Scraping failed",
        description: "Failed to scrape the URL. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScrape();
    }
  };

  const exampleUrls = [
    'https://en.wikipedia.org/wiki/Artificial_intelligence',
    'https://docs.python.org/3/tutorial/',
    'https://reactjs.org/docs/getting-started.html',
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Web Scraping</span>
          </CardTitle>
          <CardDescription>
            Import content directly from web URLs into your knowledge base
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scrape URL Content</CardTitle>
          <CardDescription>
            Enter a URL to extract and index its text content for AI querying
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <div className="flex space-x-3">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleScrape}
                disabled={!url.trim() || isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Scrape
                  </>
                )}
              </Button>
            </div>
          </div>

          {lastScrapedUrl && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-white">✓</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-green-900">Content scraped successfully</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-green-700">From:</span>
                    <a
                      href={lastScrapedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:text-green-800 underline flex items-center space-x-1"
                    >
                      <span className="truncate max-w-md">{lastScrapedUrl}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example URLs</CardTitle>
          <CardDescription>
            Try these example URLs to test the scraping functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exampleUrls.map((exampleUrl, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left h-auto p-3 justify-start"
                onClick={() => setUrl(exampleUrl)}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{exampleUrl}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900">Scraping Guidelines</h4>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Ensure the URL is publicly accessible and not behind authentication</li>
                <li>• The scraper extracts text content from HTML pages</li>
                <li>• Large pages may take longer to process</li>
                <li>• Respect website terms of service and robots.txt</li>
                <li>• Some sites may block automated scraping attempts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
