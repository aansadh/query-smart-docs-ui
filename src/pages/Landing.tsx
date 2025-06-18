
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Upload, MessageSquare, Globe, Shield, Zap, Code, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  const features = [
    {
      icon: Upload,
      title: "Smart Document Upload",
      description: "Upload PDFs, add text content, or scrape web pages. Our AI processes and indexes everything for instant searchability."
    },
    {
      icon: MessageSquare,
      title: "Intelligent Q&A",
      description: "Ask natural language questions about your documents. Get precise, contextual answers powered by advanced AI."
    },
    {
      icon: Bot,
      title: "Session-Based Organization",
      description: "Organize your documents in isolated sessions. Each session maintains its own context and conversation history."
    },
    {
      icon: Globe,
      title: "Web Content Scraping",
      description: "Import content directly from web URLs. Perfect for research, documentation, and knowledge gathering."
    },
    {
      icon: Code,
      title: "Developer API",
      description: "Integrate with your applications using our REST API. Generate tokens and access all features programmatically."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and isolated. Each session is completely private with enterprise-grade security."
    }
  ];

  const benefits = [
    "Process unlimited PDF documents",
    "Natural language querying",
    "Session-based organization",
    "Web content integration",
    "Developer-friendly API",
    "Enterprise security"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">CogniDoc</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Document Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/app">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/app">
                <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Document Intelligence
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Transform Your Documents into
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> Interactive Knowledge</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Upload PDFs, scrape web content, and ask intelligent questions about your documents. 
            Organize everything in sessions for perfect context management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/app">
              <Button size="lg" className="text-lg px-8 py-3 bg-primary hover:bg-primary/90">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/docs">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                <Code className="w-5 h-5 mr-2" />
                API Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need for Document Intelligence
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make your documents searchable, queryable, and actionable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Why Choose CogniDoc?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of users who trust CogniDoc for their document intelligence needs.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground/80">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link to="/app">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Get Started Today
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-card rounded-2xl shadow-xl p-8 border border-border/50">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">10,000+</p>
                    <p className="text-muted-foreground">Active Users</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Upload className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">1M+</p>
                    <p className="text-muted-foreground">Documents Processed</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">5M+</p>
                    <p className="text-muted-foreground">Questions Answered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Documents?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Start your free trial today and experience the power of AI-driven document intelligence.
          </p>
          <Link to="/app">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-foreground py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">CogniDoc</span>
              </div>
              <p className="text-muted-foreground">
                AI-powered document intelligence for the modern world.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/app" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link to="/docs" className="hover:text-foreground transition-colors">API Docs</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CogniDoc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
