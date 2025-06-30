import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Upload, MessageSquare, Globe, FileText, Key, BookOpen, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Landing = () => {
  const features = [
    {
      icon: Upload,
      title: "Document Upload",
      description: "Upload PDFs and text documents for AI analysis"
    },
    {
      icon: MessageSquare,
      title: "Smart Querying",
      description: "Ask natural language questions about your documents"
    },
    {
      icon: Globe,
      title: "Web Scraping",
      description: "Import content directly from web URLs"
    },
    {
      icon: FileText,
      title: "File Management",
      description: "Organize and manage your document library"
    },
    {
      icon: Key,
      title: "API Access",
      description: "Generate tokens for programmatic access"
    },
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Complete API documentation and guides"
    }
  ];

  const benefits = [
    "Session-based document organization",
    "AI-powered document analysis",
    "RESTful API for developers",
    "Secure token-based authentication",
    "Real-time web content scraping",
    "Comprehensive file management"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-background" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CogniDoc</h1>
                <p className="text-xs text-muted-foreground">AI Document Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <SignedOut>
                <Link to="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/sign-up">
                  <Button>Get Started</Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/app">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            AI-Powered Document Intelligence
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              Transform Your Documents with
            </span>
            <span className="block bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/40 bg-clip-text text-transparent">
              Intelligent AI
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Upload, analyze, and query your documents using advanced AI. 
            Create sessions, scrape web content, and access everything through our powerful API.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <Link to="/sign-up">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/docs">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  View Documentation
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/app">
                <Button size="lg" className="text-lg px-8 py-6">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to work with documents intelligently
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-border bg-card">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Why Choose CogniDoc?
            </h2>
            <p className="text-xl text-muted-foreground">
              Built for developers and teams who need intelligent document processing
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who trust CogniDoc for their document intelligence needs
          </p>
          <SignedOut>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/sign-up">
                <Button size="lg" className="text-lg px-8 py-6">
                  Create Free Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/docs">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Read Documentation
                </Button>
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <Link to="/app">
              <Button size="lg" className="text-lg px-8 py-6">
                Continue to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-background" />
            </div>
            <span className="text-lg font-bold text-foreground">CogniDoc</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 CogniDoc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
