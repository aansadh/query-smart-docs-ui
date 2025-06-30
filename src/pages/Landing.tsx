
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, FileText, MessageSquare, Globe, Users, BookOpen, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      icon: FileText,
      title: 'Document Upload',
      description: 'Upload PDFs and text documents for AI-powered analysis and querying with advanced processing.'
    },
    {
      icon: MessageSquare,
      title: 'Intelligent Q&A',
      description: 'Ask natural language questions about your documents and get accurate, contextual answers instantly.'
    },
    {
      icon: Globe,
      title: 'Web Scraping',
      description: 'Import content directly from web URLs for comprehensive document analysis and data extraction.'
    },
    {
      icon: Users,
      title: 'Session Management',
      description: 'Organize your documents in isolated sessions for better project management and collaboration.'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Documents Processed', value: '1M+', icon: FileText },
    { label: 'Questions Answered', value: '5M+', icon: MessageSquare },
    { label: 'API Calls', value: '50M+', icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <Bot className="w-6 h-6 text-background" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">CogniDoc</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/docs">
                <Button variant="ghost" className="text-foreground hover:text-foreground/80 focus-ring">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
              </Link>
              <Link to="/app">
                <Button className="bg-foreground text-background hover:bg-foreground/90 focus-ring">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center animate-fade-in">
          <Badge variant="secondary" className="mb-8 px-6 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Document Intelligence
          </Badge>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-foreground leading-tight">
            Transform Your Documents
            <br />
            Into Conversations
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Upload PDFs, add text content, scrape web pages, and ask intelligent questions about your documents. 
            CogniDoc makes document analysis effortless with cutting-edge AI technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/app">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 px-10 py-6 text-lg focus-ring">
                Start Analyzing Documents
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button size="lg" variant="outline" className="px-10 py-6 text-lg border-foreground/20 hover:bg-accent focus-ring">
                View API Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover-lift border border-border">
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-background" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-5xl font-bold mb-6 text-foreground">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to unlock the potential of your documents with state-of-the-art AI analysis.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover-lift border border-border hover:border-foreground/20 transition-colors">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-foreground rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <feature.icon className="w-7 h-7 text-background" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Card className="border border-border hover-lift">
            <CardContent className="p-16 text-center">
              <h2 className="text-5xl font-bold mb-8 text-foreground">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
                Join thousands of users who are already transforming their document workflows with CogniDoc's intelligent AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/app">
                  <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 px-10 py-6 text-lg focus-ring">
                    Start Your First Session
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </Link>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-foreground text-foreground" />
                  ))}
                  <span className="ml-3 text-lg">Trusted by developers worldwide</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-background" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">CogniDoc</h3>
          </div>
          <p className="text-muted-foreground mb-8 text-lg">
            AI-Powered Document Assistant for the Modern Workflow
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
            <Link to="/docs" className="hover:text-foreground transition-colors text-lg focus-ring">Documentation</Link>
            <Link to="/app" className="hover:text-foreground transition-colors text-lg focus-ring">Application</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
