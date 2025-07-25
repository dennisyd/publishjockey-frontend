import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button,
  Card, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Paper,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FairUseNotice from '../components/FairUseNotice';

// Error boundary component to catch runtime errors
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
    console.error("Dashboard Error:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6">Something went wrong in the Dashboard</Typography>
            <Typography variant="body2">{this.state.error?.toString()}</Typography>
          </Alert>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

type Project = {
  id: string;
  _id?: string;
  title: string;
  // add other fields as needed
};
type ProjectsResponse = {
  projects: Project[];
};
type CreateProjectResponse = {
  project: Project;
};

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [booksRemaining, setBooksRemaining] = useState<number | null>(null);
  const [booksAllowed, setBooksAllowed] = useState<number | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch projects
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Projects API full response:', data);
        
        // Check user ID from token
        const userInfo = token ? JSON.parse(atob(token.split('.')[1])) : null;
        console.log('Current user from token:', userInfo);
        
        // Ensure projects is an array, handle different response structures
        const projectsArray = Array.isArray(data) ? data : 
                             data.projects ? data.projects : 
                             data.data ? data.data : [];
        
        console.log(`Found ${projectsArray.length} projects in response`);
        
        // Log each project's owner and ID for debugging
        projectsArray.forEach((project, index) => {
          console.log(`Project ${index + 1}: ${project.title} - Owner: ${project.owner}, UserId: ${project.userId}`);
        });
        
        // Filter projects to only those owned by the current user if needed
        // This is a backup in case the backend filter fails
        const currentUserId = userInfo?.userId || userInfo?.id;
        const filteredProjects = currentUserId ? 
          projectsArray.filter(p => 
            (p.owner === currentUserId || p.userId === currentUserId)
          ) : projectsArray;
        
        if (filteredProjects.length !== projectsArray.length) {
          console.log(`Filtered from ${projectsArray.length} to ${filteredProjects.length} projects for this user`);
        }
        
        // Ensure projects have a consistent id property
        const normalizedProjects = filteredProjects.map(project => {
          if (!project) return null;
          return {
            ...project,
            id: project.id || project._id, // Use id if available, otherwise use _id
            title: project.title || 'Untitled Book'
          };
        }).filter(Boolean); // Remove null entries
        
        console.log('Normalized projects:', normalizedProjects);
        setProjects(normalizedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load your books. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch subscription details
    const fetchSubscriptionDetails = async () => {
      setSubscriptionLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/users/me/subscription', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          console.error('Subscription API error:', response.status);
          throw new Error(`Subscription API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Subscription data:', data);
        
        if (data.success) {
          setBooksRemaining(data.booksRemaining);
          setBooksAllowed(data.booksAllowed);
          // Check all possible field names for subscription type
          setSubscriptionType(data.subscriptionType || data.type || data.subscription || null);
          console.log('Subscription type found:', data.subscriptionType || data.type || data.subscription || 'none');
        } else {
          // Try alternative response format
          const booksRemaining = data.booksRemaining ?? data.data?.booksRemaining ?? null;
          const booksAllowed = data.booksAllowed ?? data.data?.booksAllowed ?? null;
          // Check all possible field names, including 'subscription'
          const subType = data.subscriptionType || data.type || data.subscription || 
                          data.data?.subscriptionType || data.data?.type || data.data?.subscription || null;
          
          console.log('Subscription type from alternative format:', subType);
          
          if (booksRemaining !== null) setBooksRemaining(booksRemaining);
          if (booksAllowed !== null) setBooksAllowed(booksAllowed);
          if (subType !== null) setSubscriptionType(subType);
        }
      } catch (error) {
        console.error('Error fetching subscription details:', error);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    fetchProjects();
    fetchSubscriptionDetails();
  }, []);

  // Check if exportTiming is available on window
  useEffect(() => {
    // Wait a bit to ensure all components are mounted
    const timer = setTimeout(() => {
      if ((window as any).exportTiming) {
        console.log('ExportTiming is available on window object ✅');
      } else {
        console.error('⚠️ ExportTiming is NOT available on window object! Export dialogs will not work.');
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);



  // Handle dialog confirmation
  const handleCreateProjectConfirm = async () => {
    if (!newProjectName.trim()) return;
    
    try {
      // Check if user has books remaining
      if (booksRemaining !== null && booksRemaining <= 0) {
        alert("You've reached your book limit. Please upgrade your plan to create more books.");
        return;
      }
      
      console.log('Creating project with title:', newProjectName.trim());

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: newProjectName.trim() })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }
      
      const data = await response.json();
      console.log('Project creation response:', data);
      
      // Handle various response structures
      const newProject = data.project || data.data || data;
      
      // Add the project to the projects array
      setProjects([...projects, newProject]);
      setNewProjectName('');
      setNewProjectDialogOpen(false);
      
      // Explicitly call the book decrement API
      try {
        const decrementResponse = await fetch('http://localhost:3001/api/users/me/books/decrement', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (decrementResponse.ok) {
          const decrementData = await decrementResponse.json();
          console.log('Books remaining updated:', decrementData);
          
          // Update books remaining count after successful project creation
          if (decrementData.booksRemaining !== undefined) {
            setBooksRemaining(decrementData.booksRemaining);
          } else {
            setBooksRemaining(prevCount => prevCount !== null ? prevCount - 1 : null);
          }
        } else {
          console.error('Failed to update books remaining count');
          // Manual decrement if API fails
          setBooksRemaining(prevCount => prevCount !== null ? prevCount - 1 : null);
        }
      } catch (error) {
        console.error('Error updating books remaining:', error);
        // Manual decrement if API call fails
        setBooksRemaining(prevCount => prevCount !== null ? prevCount - 1 : null);
      }
      
      // Navigate to the newly created project
      const projectId = newProject.id || newProject._id;
      if (projectId) {
        console.log('Navigating to project:', projectId);
        navigate(`/projects/${encodeURIComponent(projectId)}`, { 
          state: { title: newProject.title || 'Untitled Book' } 
        });
      } else {
        console.error('Created project has no ID:', newProject);
        alert('Project created, but navigation failed. Please refresh the page.');
      }
      
    } catch (error) {
      console.error('Error creating project:', error);
      alert(error.message || 'An error occurred while creating your project');
    }
  };

  // Navigate to project workspace
  const handleOpenProject = (project: Project) => {
    try {
      if (!project) {
        console.error('Cannot open undefined project');
        return;
      }
      
      const projectId = project.id || project._id;
      if (!projectId) {
        console.error('Project has no ID:', project);
        return;
      }
      
      console.log('Opening project:', project);
      
      // Navigate to the project page
      navigate(`/projects/${encodeURIComponent(projectId)}`, { 
        state: { title: project.title || 'Untitled Book' } 
      });
    } catch (error) {
      console.error('Error opening project:', error);
    }
  };
  
  // Generate a random pastel color for book covers
  const generateBookColor = (seed: string) => {
    // Simple hash function to get consistent colors for the same project name
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate soft pastel hues
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 85%)`;
  };

  // Debug log for projects
  console.log('Projects:', projects);
  return (
    <ErrorBoundary>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Page header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>My Books</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => setNewProjectDialogOpen(true)}
            disabled={booksRemaining !== null && booksRemaining <= 0}
          >
            New Book
          </Button>
        </Box>
        
        {/* Fair Use Notice - only show for 'author' subscription type */}
        {subscriptionType && subscriptionType.toLowerCase() === 'author' && (
          <Box sx={{ mb: 3 }}>
            <FairUseNotice compact={true} />
          </Box>
        )}
        
        {/* Temporary debug info - remove after testing */}
        {process.env.NODE_ENV !== 'production' && (
          <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1, fontSize: '0.75rem' }}>
            <Typography variant="caption" component="div">
              Debug: Subscription Type = {subscriptionType || 'null'}
            </Typography>
          </Box>
        )}
        
        {/* Debugging info - remove in production */}
        {loading ? (
          <Alert severity="info" sx={{ mb: 3 }}>Loading projects...</Alert>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 3 }}>
            {projects.length === 0 ? 
              "You don't have any books yet. Create your first book to get started!" : 
              `Showing ${projects.length} book${projects.length > 1 ? 's' : ''}`
            }
            {booksRemaining !== null && (
              <> | {booksRemaining} of {booksAllowed} books remaining</>
            )}
          </Alert>
        )}
        
        {/* Subscription Status Banner */}
        <Paper
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper' 
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Book Allowance
              </Typography>
              {subscriptionLoading ? (
                <Typography variant="body1">Loading subscription information...</Typography>
              ) : (
                <Typography variant="body1">
                  {booksRemaining !== null && booksAllowed !== null ? (
                    <>You have <strong>{booksRemaining}</strong> out of <strong>{booksAllowed}</strong> books remaining</>
                  ) : (
                    'Unable to fetch your book allowance'
                  )}
                </Typography>
              )}
            </Box>
            {booksRemaining !== null && booksRemaining <= 0 && (
              <Button 
                variant="contained" 
                color="primary"
                href="/pricing"
              >
                Upgrade Plan
              </Button>
            )}
          </Box>
        </Paper>

        {projects.length === 0 ? (
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            textAlign: 'center',
            padding: 5,
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 500 }}>
              No books yet
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
              Welcome to Publish Jockey!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Create a new book to get started.
            </Typography>
            <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
              Happy writing!
            </Typography>
          </Card>
        ) : (
          <>
            {/* Recent Books Section */}
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>Recent Books</Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 4,
              position: 'relative',
              padding: '20px 10px 40px',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '15px',
                background: 'linear-gradient(to right, #d4d4d4, #e0e0e0, #d4d4d4)',
                borderRadius: '2px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                bottom: '15px',
                left: 0,
                width: '100%',
                height: '10px',
                background: 'rgba(0,0,0,0.03)'
              }
            }}>
              {projects.map((project) => {
                if (!project) return null; // Skip undefined projects
                const bookColor = generateBookColor(project?.title || 'Untitled Book');
                // Get the current year for display under the book
                const year = new Date().getFullYear();
                const projectId = project?.id || project?._id;
                if (!projectId) return null; // Skip projects without an ID
                
                return (
                  <Box 
                    key={projectId} 
                    onClick={() => handleOpenProject(project)}
                    sx={{ 
                      width: { xs: '150px', sm: '180px' },
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        transform: 'translateY(-5px)',
                        '& .book-cover': {
                          boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
                        }
                      }
                    }}
                  >
                    {/* Simplified Book Container */}
                    <Box 
                      className="book-cover"
                      sx={{ 
                        height: '220px',
                        background: bookColor,
                        borderRadius: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 2,
                        boxShadow: '0 5px 10px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '1.1rem', sm: '1.2rem' },
                          color: 'rgba(0,0,0,0.8)',
                          textAlign: 'center',
                          maxWidth: '100%',
                          wordBreak: 'break-word'
                        }}
                      >
                        {project.title || 'Untitled Book'}
                      </Typography>
                    </Box>
                    
                    {/* Year */}
                    <Typography
                      sx={{
                        mt: 2,
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      {year}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </>
        )}

        {/* New Project Dialog */}
        <Dialog open={newProjectDialogOpen} onClose={() => setNewProjectDialogOpen(false)}>
          <DialogTitle>Create New Book</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Enter a name for your new book project.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Book Title"
              type="text"
              fullWidth
              variant="outlined"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateProjectConfirm();
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewProjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProjectConfirm} color="primary" variant="contained">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ErrorBoundary>
  );
};

export default Dashboard; 