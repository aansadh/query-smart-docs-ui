
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Eye, AlertTriangle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Session {
  id: string;
  name: string;
  createdAt: string;
  documentsCount: number;
}

interface SessionManagerProps {
  currentSessionId: string | null;
  onSessionChange: (sessionId: string) => void;
}

export const SessionManager = ({ currentSessionId, onSessionChange }: SessionManagerProps) => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 'session-1',
      name: 'Research Papers',
      createdAt: '2024-01-15',
      documentsCount: 5
    },
    {
      id: 'session-2',
      name: 'Legal Documents',
      createdAt: '2024-01-16',
      documentsCount: 3
    }
  ]);
  const [newSessionName, setNewSessionName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateSession = () => {
    if (!newSessionName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a session name",
        variant: "destructive",
      });
      return;
    }

    const newSession: Session = {
      id: `session-${Date.now()}`,
      name: newSessionName.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      documentsCount: 0
    };

    setSessions(prev => [newSession, ...prev]);
    onSessionChange(newSession.id);
    
    // Store in localStorage
    localStorage.setItem('currentSessionId', newSession.id);
    localStorage.setItem('currentSessionName', newSession.name);
    
    setNewSessionName('');
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Session Created",
      description: `New session "${newSession.name}" has been created.`,
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    setDeleteSessionId(null);
    
    if (currentSessionId === sessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      if (remainingSessions.length > 0) {
        onSessionChange(remainingSessions[0].id);
        localStorage.setItem('currentSessionId', remainingSessions[0].id);
        localStorage.setItem('currentSessionName', remainingSessions[0].name);
      }
    }
    
    toast({
      title: "Session Deleted",
      description: "Session and all associated data have been permanently deleted.",
      variant: "destructive",
    });
  };

  const handleSessionSwitch = (session: Session) => {
    onSessionChange(session.id);
    localStorage.setItem('currentSessionId', session.id);
    localStorage.setItem('currentSessionName', session.name);
    setIsViewDialogOpen(false);
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const filteredSessions = sessions.filter(session => 
    session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Current Session Info */}
      {currentSession && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-foreground">{currentSession.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Session ID: {currentSession.id} • {currentSession.documentsCount} documents
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Active
              </Badge>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Session Actions */}
      <div className="flex flex-wrap gap-3">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Session</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Create a new isolated session for your documents and queries.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sessionName" className="text-foreground">Session Name</Label>
                <Input
                  id="sessionName"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="Enter session name..."
                  className="mt-1 bg-background border-border text-foreground"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-border text-foreground">
                Cancel
              </Button>
              <Button onClick={handleCreateSession} className="gradient-primary text-primary-foreground">Create Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-border text-foreground hover:bg-accent">
              <Eye className="w-4 h-4 mr-2" />
              View All Sessions
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">All Sessions</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Manage your document sessions
              </DialogDescription>
            </DialogHeader>
            
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background border-border text-foreground"
              />
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSessions.map((session) => (
                <Card key={session.id} className={`transition-all duration-200 border-border ${session.id === currentSessionId ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{session.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Created: {session.createdAt} • {session.documentsCount} documents
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {session.id !== currentSessionId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSessionSwitch(session)}
                            className="border-border text-foreground hover:bg-accent"
                          >
                            Switch
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-border">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2 text-foreground">
                                <AlertTriangle className="w-5 h-5 text-destructive" />
                                Delete Session
                              </DialogTitle>
                              <DialogDescription className="text-muted-foreground">
                                Are you sure you want to delete "{session.name}"? This action cannot be undone and all documents and data in this session will be permanently lost.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" className="border-border text-foreground">Cancel</Button>
                              <Button variant="destructive" onClick={() => handleDeleteSession(session.id)}>
                                Delete Session
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredSessions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No sessions found matching your search.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
