
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, MessageSquare, Shield, Zap, Code2, Palette, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                CogniDoc
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/docs">
                <Button variant="ghost">Documentation</Button>
              </Link>
              <Link to="/templates">
                <Button variant="ghost">Templates</Button>
              </Link>
              <Link to="/app">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            ✨ AI-Powered Document Intelligence
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Transform Your Documents Into Intelligent Conversations
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Upload documents, scrape websites, and create AI-powered chatbots that understand your content. 
            Build intelligent experiences with our plug-and-play templates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/templates">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                View Templates
                <Code2 className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From document ingestion to chatbot deployment, we provide all the tools you need to create intelligent AI experiences.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Document Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload PDFs, text files, and scrape websites. Our AI processes and understands your content automatically.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Smart Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create AI chatbots that can answer questions and provide insights based on your uploaded documents.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your documents are processed securely with session-based authentication and private API endpoints.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Ready-to-Use</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Deploy chatbots instantly with our customizable templates for React, Next.js, and vanilla JavaScript.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Plug-and-Play Templates</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our collection of production-ready chatbot templates. Customize themes, positions, and integrate in minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Code2 className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>React Component</CardTitle>
                    <Badge variant="secondary">TypeScript</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Modern React component with TypeScript support, customizable props, and responsive design.
                </CardDescription>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Props API</Badge>
                  <Badge variant="outline" className="text-xs">Modern Hooks</Badge>
                  <Badge variant="outline" className="text-xs">Responsive</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>Vanilla JavaScript</CardTitle>
                    <Badge variant="secondary">Zero Dependencies</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Pure JavaScript widget that works on any website without dependencies. Easy integration in minutes.
                </CardDescription>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">No Build</Badge>
                  <Badge variant="outline" className="text-xs">Lightweight</Badge>
                  <Badge variant="outline" className="text-xs">Universal</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Palette className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>Next.js Component</CardTitle>
                    <Badge variant="secondary">Tailwind CSS</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Advanced Next.js component with Tailwind CSS, animations, and server component support.
                </CardDescription>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">SSR Ready</Badge>
                  <Badge variant="outline" className="text-xs">Animations</Badge>
                  <Badge variant="outline" className="text-xs">Customizable</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Link to="/templates">
              <Button size="lg" variant="outline">
                Explore All Templates
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join developers who are already building intelligent document experiences with CogniDoc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 CogniDoc. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
