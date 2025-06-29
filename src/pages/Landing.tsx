
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, FileText, MessageSquare, Globe, Users, BookOpen, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      icon: FileText,
      title: 'Document Upload',
      description: 'Upload PDFs and text documents for AI-powered analysis and querying.'
    },
    {
      icon: MessageSquare,
      title: 'Intelligent Q&A',
      description: 'Ask natural language questions about your documents and get accurate answers.'
    },
    {
      icon: Globe,
      title: 'Web Scraping',
      description: 'Import content directly from web URLs for comprehensive document analysis.'
    },
    {
      icon: Users,
      title: 'Session Management',
      description: 'Organize your documents in isolated sessions for better project management.'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Documents Processed', value: '1M+' },
    { label: 'Questions Answered', value: '5M+' },
    { label: 'API Calls', value: '50M+' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg animate-glow">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-gradient">CogniDoc</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/docs">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <BookOpen className="w-4 h-4 mr-2" />
                Documentation
              </Button>
            </Link>
            <Link to="/app">
              <Button className="gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20">
            AI-Powered Document Intelligence
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient leading-tight">
            Transform Your Documents
            <br />
            Into Conversations
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Upload PDFs, add text content, scrape web pages, and ask intelligent questions about your documents. 
            CogniDoc makes document analysis effortless with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/app">
              <Button size="lg" className="gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4">
                Start Analyzing Documents
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button size="lg" variant="outline" className="px-8 py-4 border-primary/20 hover:bg-primary/10">
                View API Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gradient">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to unlock the potential of your documents with AI-powered analysis.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:animate-glow transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
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
      <section className="px-6 py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gradient">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join thousands of users who are already transforming their document workflows with CogniDoc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/app">
              <Button size="lg" className="gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4">
                Start Your First Session
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Star className="w-4 h-4 fill-current text-primary" />
              <Star className="w-4 h-4 fill-current text-primary" />
              <Star className="w-4 h-4 fill-current text-primary" />
              <Star className="w-4 h-4 fill-current text-primary" />
              <Star className="w-4 h-4 fill-current text-primary" />
              <span className="ml-2">Trusted by developers worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-bold text-gradient">CogniDoc</h3>
          </div>
          <p className="text-muted-foreground mb-6">
            AI-Powered Document Assistant for the Modern Workflow
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/docs" className="hover:text-primary transition-colors">Documentation</Link>
            <Link to="/app" className="hover:text-primary transition-colors">Application</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
