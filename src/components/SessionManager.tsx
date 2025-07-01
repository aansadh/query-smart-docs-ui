
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Eye, AlertTriangle, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, Session } from '@/services/api';

interface SessionManagerProps {
  currentSessionId: string | null;
  onSessionChange: (sessionId: string) => void;
}

export const SessionManager = ({ currentSessionId, onSessionChange }: SessionManagerProps) => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [newSessionName, setNewSessionName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const fetchedSessions = await apiService.getSessions();
      setSessions(fetchedSessions);
      
      // If no current session, set the first one as current
      if (!currentSessionId && fetchedSessions.length > 0) {
        const firstSession = fetchedSessions[0];
        onSessionChange(firstSession._id);
        apiService.setSessionId(firstSession._id);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load sessions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!newSessionName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a session name",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiService.createSession({ session_name: newSessionName.trim() });
      console.log('New session created:', response);
      
      // Reload sessions to get the updated list
      await loadSessions();
      
      setNewSessionName('');
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Session Created",
        description: `Session "${newSessionName}" has been created successfully.`,
      });
    } catch (error) {
      console.error('Failed to create session:', error);
      toast({
        title: "Error",
        description: "Failed to create session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      
      // Set the session to delete as current before deleting
      apiService.setSessionId(sessionId);
      await apiService.deleteSession();
      
      // Reload sessions
      await loadSessions();
      
      // If we deleted the current session, clear it
      if (currentSessionId === sessionId) {
        const remainingSessions = sessions.filter(s => s._id !== sessionId);
        if (remainingSessions.length > 0) {
          onSessionChange(remainingSessions[0]._id);
          apiService.setSessionId(remainingSessions[0]._id);
        } else {
          onSessionChange('');
          apiService.clearSession();
        }
      }
      
      toast({
        title: "Session Deleted",
        description: "Session has been permanently deleted.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionSwitch = (session: Session) => {
    onSessionChange(session._id);
    apiService.setSessionId(session._id);
    setIsViewDialogOpen(false);
    
    const displayName = session.session_name || session._id.substring(0, 12) + '...';
    toast({
      title: "Session Switched",
      description: `Switched to session: ${displayName}`,
    });
  };

  const currentSession = sessions.find(s => s._id === currentSessionId);
  const filteredSessions = sessions.filter(session => 
    session._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (session.session_name && session.session_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getSessionDisplayName = (session: Session) => {
    return session.session_name || `Session ${session._id.substring(0, 12)}...`;
  };

  if (isLoading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading sessions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Session Info */}
      {currentSession && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-foreground">{getSessionDisplayName(currentSession)}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  ID: {currentSession._id.substring(0, 12)}... • Created: {formatDate(currentSession.created_at)}
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
            <Button disabled={isLoading} className="bg-foreground text-background hover:bg-foreground/90">
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
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-border text-foreground">
                Cancel
              </Button>
              <Button onClick={handleCreateSession} disabled={isLoading} className="bg-foreground text-background">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Session"}
              </Button>
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
                <Card key={session._id} className={`transition-all duration-200 border-border ${session._id === currentSessionId ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{getSessionDisplayName(session)}</h4>
                        <p className="text-sm text-muted-foreground">
                          ID: {session._id.substring(0, 12)}... • Created: {formatDate(session.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {session._id !== currentSessionId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSessionSwitch(session)}
                            className="border-border text-foreground hover:bg-accent"
                            disabled={isLoading}
                          >
                            Switch
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="destructive" disabled={isLoading}>
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
                                Are you sure you want to delete "{getSessionDisplayName(session)}"? This action cannot be undone and all documents and data in this session will be permanently lost.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" className="border-border text-foreground">Cancel</Button>
                              <Button variant="destructive" onClick={() => handleDeleteSession(session._id)} disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Session"}
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
                  {sessions.length === 0 ? "No sessions found. Create your first session to get started." : "No sessions found matching your search."}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
