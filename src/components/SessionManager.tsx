
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Eye, AlertTriangle } from 'lucide-react';
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
      }
    }
    
    toast({
      title: "Session Deleted",
      description: "Session and all associated data have been permanently deleted.",
      variant: "destructive",
    });
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="space-y-6">
      {/* Current Session Info */}
      {currentSession && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{currentSession.name}</CardTitle>
                <CardDescription>
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
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Session</DialogTitle>
              <DialogDescription>
                Create a new isolated session for your documents and queries.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sessionName">Session Name</Label>
                <Input
                  id="sessionName"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="Enter session name..."
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSession}>Create Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View All Sessions
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>All Sessions</DialogTitle>
              <DialogDescription>
                Manage your document sessions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sessions.map((session) => (
                <Card key={session.id} className={`transition-all duration-200 ${session.id === currentSessionId ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{session.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Created: {session.createdAt} • {session.documentsCount} documents
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {session.id !== currentSessionId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              onSessionChange(session.id);
                              setIsViewDialogOpen(false);
                            }}
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
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-destructive" />
                                Delete Session
                              </DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete "{session.name}"? This action cannot be undone and all documents and data in this session will be permanently lost.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
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
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
