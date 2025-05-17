import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Tooltip,
  Grid,
  Tabs,
  Tab,
  Select,
  FormControl,
  InputLabel,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  Checkbox,
  ListItemText
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  VpnKey as VpnKeyIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Security as SecurityIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  PersonOff as PersonOffIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../auth/AuthContext';
import * as adminService from '../../services/adminService';
import { AdminUser, PaginatedUsers, AuditLogEntry } from '../../services/adminService';

// Helper function to format dates without using date-fns
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'Never';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
};

// Helper function for time formatting
const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// User Details Dialog Content
const UserDetailsDialog = ({ 
  user, 
  loginHistory, 
  recentActivity,
  onClose 
}: { 
  user: AdminUser | null;
  loginHistory: AuditLogEntry[];
  recentActivity: AuditLogEntry[];
  onClose: () => void;
}) => {
  const [tabValue, setTabValue] = useState(0);
  
  if (!user) return null;
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  return (
    <Dialog open={!!user} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <PersonIcon sx={{ mr: 1 }} />
          User Details: {user.name}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Profile" />
          <Tab label="Login History" />
          <Tab label="Recent Activity" />
        </Tabs>
        
        {/* Profile Tab */}
        {tabValue === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Name</Typography>
              <Typography>{user.name}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Email</Typography>
              <Typography>{user.email}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Role</Typography>
              <Typography>
                <Chip 
                  label={user.role} 
                  color={user.role === 'admin' ? 'primary' : user.role === 'editor' ? 'secondary' : 'default'} 
                  size="small" 
                />
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Status</Typography>
              <Typography>
                <Chip 
                  label={user.isSuspended ? 'Suspended' : 'Active'} 
                  color={user.isSuspended ? 'error' : 'success'} 
                  size="small" 
                />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Subscription Details</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Subscription Plan</Typography>
              <Typography>{user.subscription}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Expires</Typography>
              <Typography>
                {user.subscriptionExpires 
                  ? formatDate(user.subscriptionExpires) 
                  : 'Never'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Account Details</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Account Created</Typography>
              <Typography>{formatDate(user.createdAt)}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Last Login</Typography>
              <Typography>
                {user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}
              </Typography>
            </Grid>
          </Grid>
        )}
        
        {/* Login History Tab */}
        {tabValue === 1 && (
          <>
            <Typography variant="h6" gutterBottom>Login History</Typography>
            {loginHistory.length === 0 ? (
              <Typography color="textSecondary">No login history available</Typography>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Device</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loginHistory.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                        <TableCell>{log.ipAddress || 'Unknown'}</TableCell>
                        <TableCell>{log.userAgent || 'Unknown'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
        
        {/* Recent Activity Tab */}
        {tabValue === 2 && (
          <>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            {recentActivity.length === 0 ? (
              <Typography color="textSecondary">No recent activity</Typography>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivity.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                        <TableCell>{log.action.replace(/_/g, ' ')}</TableCell>
                        <TableCell>
                          {log.details ? JSON.stringify(log.details) : 'No details'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Edit User Dialog
const EditUserDialog = ({ 
  user, 
  open, 
  onClose, 
  onSave 
}: { 
  user: AdminUser | null;
  open: boolean;
  onClose: () => void;
  onSave: (userId: string, userData: Partial<AdminUser>) => void;
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [subscription, setSubscription] = useState('');
  
  // Initialize form when user changes
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setSubscription(user.subscription);
    }
  }, [user]);
  
  if (!user) return null;
  
  const handleSave = () => {
    if (user) {
      onSave(user.id, { name, email, role, subscription });
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Subscription</InputLabel>
              <Select
                value={subscription}
                label="Subscription"
                onChange={(e) => setSubscription(e.target.value)}
              >
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Send Notification Dialog
const SendNotificationDialog = ({ 
  user, 
  open, 
  onClose, 
  onSend 
}: { 
  user: AdminUser | null;
  open: boolean;
  onClose: () => void;
  onSend: (userId: string, subject: string, message: string, sendEmail: boolean) => void;
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  
  if (!user) return null;
  
  const handleSend = () => {
    if (user && subject && message) {
      onSend(user.id, subject, message, sendEmail);
      setSubject('');
      setMessage('');
      setSendEmail(false);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Send Notification to {user.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Subject"
              fullWidth
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Checkbox
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
              />
              <Typography component="span">
                Also send as email to {user.email}
              </Typography>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSend} 
          variant="contained" 
          color="primary"
          disabled={!subject || !message}
        >
          Send Notification
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Bulk Action Dialog
const BulkActionDialog = ({ 
  open, 
  selectedUsers, 
  onClose, 
  onAction 
}: { 
  open: boolean;
  selectedUsers: string[];
  onClose: () => void;
  onAction: (userIds: string[], action: string, reason?: string, role?: string) => void;
}) => {
  const [action, setAction] = useState('');
  const [reason, setReason] = useState('');
  const [role, setRole] = useState('');
  
  const handleAction = () => {
    onAction(selectedUsers, action, reason, role);
    setAction('');
    setReason('');
    setRole('');
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Bulk Action ({selectedUsers.length} users)</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Action</InputLabel>
              <Select
                value={action}
                label="Action"
                onChange={(e) => setAction(e.target.value)}
              >
                <MenuItem value="suspend">Suspend Users</MenuItem>
                <MenuItem value="unsuspend">Activate Users</MenuItem>
                <MenuItem value="changeRole">Change Role</MenuItem>
                <MenuItem value="delete">Delete Users</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {action === 'suspend' && (
            <Grid item xs={12}>
              <TextField
                label="Suspension Reason"
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Grid>
          )}
          
          {action === 'changeRole' && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>New Role</InputLabel>
                <Select
                  value={role}
                  label="New Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="editor">Editor</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          
          {action === 'delete' && (
            <Grid item xs={12}>
              <Alert severity="warning">
                This action cannot be undone. All selected user accounts will be permanently deleted.
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleAction} 
          variant="contained" 
          color="primary"
          disabled={!action || (action === 'changeRole' && !role)}
        >
          Apply to {selectedUsers.length} Users
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Component
const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Selected users for bulk actions
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Dialogs
  const [userDetailsDialogOpen, setUserDetailsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [userLoginHistory, setUserLoginHistory] = useState<AuditLogEntry[]>([]);
  const [userRecentActivity, setUserRecentActivity] = useState<AuditLogEntry[]>([]);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [sendNotificationDialogOpen, setSendNotificationDialogOpen] = useState(false);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  
  // Success and error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Suspension reasons
  const SUSPEND_REASONS = [
    'Account Misuse',
    'Spam',
    'Inappropriate Content',
    'Payment Issues',
    'Violation of Terms',
    'Other'
  ];
  const [suspensionReason, setSuspensionReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  
  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.getUsers(
        page + 1, 
        rowsPerPage, 
        searchQuery, 
        roleFilter, 
        statusFilter,
        sortField,
        sortOrder
      );
      
      setUsers(response.users.map(u => ({ ...u, id: u.id || u._id })));
      setTotalUsers(response.pagination.totalUsers);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      console.error('Error loading users:', err);
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  
  // Load user details
  const loadUserDetails = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.getUserDetails(userId);
      setCurrentUser(response.user);
      setUserLoginHistory(response.loginHistory || []);
      setUserRecentActivity(response.recentActivity || []);
      setUserDetailsDialogOpen(true);
    } catch (err: any) {
      console.error('Error loading user details:', err);
      setError(err.response?.data?.message || 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage, searchQuery, roleFilter, statusFilter, sortField, sortOrder]);
  
  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };
  
  // Handle user selection for bulk actions
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };
  
  // Handle select all users
  const handleSelectAllUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };
  
  // Handle edit user
  const handleEditUser = (user: AdminUser) => {
    setCurrentUser(user);
    setEditUserDialogOpen(true);
  };
  
  // Handle save user edits
  const handleSaveUserEdit = async (userId: string, userData: Partial<AdminUser>) => {
    try {
      setLoading(true);
      
      await adminService.updateUserInfo(userId, userData);
      
      // Close dialog and reload users
      setEditUserDialogOpen(false);
      await loadUsers();
      
      setSuccessMessage('User updated successfully');
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle reset password
  const handleResetPassword = async (userId: string) => {
    try {
      setLoading(true);
      
      await adminService.resetUserPassword(userId);
      
      // Close dialog
      setResetPasswordDialogOpen(false);
      
      setSuccessMessage('Password reset email sent to user');
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle suspend/unsuspend user
  const handleToggleUserSuspension = async (user: AdminUser) => {
    try {
      setLoading(true);
      
      if (user.isSuspended) {
        await adminService.unsuspendUser(user.id);
        setSuccessMessage('User activated successfully');
      } else {
        let reasonToSend = suspensionReason === 'Other' ? customReason : suspensionReason;
        if (!reasonToSend) {
          setCurrentUser(user);
          setSuspendDialogOpen(true);
          setLoading(false);
          return;
        }
        await adminService.suspendUser(user.id, reasonToSend);
        setSuspensionReason('');
        setCustomReason('');
        setSuspendDialogOpen(false);
        setSuccessMessage('User suspended successfully');
      }
      
      // Reload users
      await loadUsers();
    } catch (err: any) {
      console.error('Error toggling user suspension:', err);
      setError(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      
      await adminService.deleteUser(userId);
      
      // Close dialog and reload users
      setDeleteConfirmDialogOpen(false);
      await loadUsers();
      
      setSuccessMessage('User deleted successfully');
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle send notification
  const handleSendNotification = async (userId: string, subject: string, message: string, sendEmail: boolean) => {
    try {
      setLoading(true);
      
      await adminService.sendNotification(userId, subject, message, sendEmail);
      
      // Close dialog
      setSendNotificationDialogOpen(false);
      
      setSuccessMessage('Notification sent successfully');
    } catch (err: any) {
      console.error('Error sending notification:', err);
      setError(err.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle bulk action
  const handleBulkAction = async (userIds: string[], action: string, reason?: string, role?: string) => {
    try {
      setLoading(true);
      
      await adminService.bulkUserAction(userIds, action, reason, role);
      
      // Close dialog and reload users
      setBulkActionDialogOpen(false);
      setSelectedUsers([]);
      await loadUsers();
      
      setSuccessMessage(`Bulk action (${action}) completed successfully`);
    } catch (err: any) {
      console.error('Error performing bulk action:', err);
      setError(err.response?.data?.message || 'Failed to perform bulk action');
    } finally {
      setLoading(false);
    }
  };
  
  // Render role chip
  const renderRoleChip = (role: string) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    
    switch (role) {
      case 'admin':
        color = 'primary';
        break;
      case 'editor':
        color = 'secondary';
        break;
      default:
        color = 'default';
    }
    
    return <Chip label={role} color={color} size="small" />;
  };
  
  // Render subscription chip
  const renderSubscriptionChip = (subscription: string) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    
    switch (subscription) {
      case 'premium':
        color = 'success';
        break;
      case 'basic':
        color = 'info';
        break;
      default:
        color = 'default';
    }
    
    return <Chip label={subscription} color={color} size="small" />;
  };
  
  // Open suspend dialog and clear reason
  const openSuspendDialog = (user: AdminUser) => {
    console.log('Opening suspend dialog for user:', user);
    if (!user || !user.id) {
      alert('Invalid user selected for suspension.');
      return;
    }
    setCurrentUser(user);
    setSuspensionReason('');
    setCustomReason('');
    setSuspendDialogOpen(true);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <AdminPanelSettingsIcon sx={{ mr: 1 }} />
        User Management
      </Typography>
      
      {/* Filters and Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
          {/* Search */}
          <Grid item xs={12} sm={4}>
            <form onSubmit={handleSearch}>
              <TextField
                label="Search users"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton type="submit" edge="end">
                      <SearchIcon />
                    </IconButton>
                  )
                }}
              />
            </form>
          </Grid>
          
          {/* Role Filter */}
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Status Filter */}
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Refresh Button */}
          <Grid item xs={12} sm={1}>
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={() => loadUsers()}
              fullWidth
            >
              Refresh
            </Button>
          </Grid>
          
          {/* Bulk Actions */}
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              disabled={selectedUsers.length === 0}
              onClick={() => setBulkActionDialogOpen(true)}
              fullWidth
            >
              Bulk Actions ({selectedUsers.length})
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Success and Error Messages */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      {/* Users Table */}
      <Paper>
        <TableContainer>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          )}
          
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                    checked={users.length > 0 && selectedUsers.length === users.length}
                    onChange={handleSelectAllUsers}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Subscription</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{renderRoleChip(user.role)}</TableCell>
                  <TableCell>{renderSubscriptionChip(user.subscription)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.isSuspended ? 'Suspended' : 'Active'} 
                      color={user.isSuspended ? 'error' : 'success'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title="View Details">
                        <IconButton onClick={() => loadUserDetails(user.id)}>
                          <PersonIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User">
                        <IconButton onClick={() => handleEditUser(user)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reset Password">
                        <IconButton 
                          onClick={() => {
                            setCurrentUser(user);
                            setResetPasswordDialogOpen(true);
                          }}
                        >
                          <VpnKeyIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.isSuspended ? 'Activate User' : 'Suspend User'}>
                        <IconButton 
                          onClick={() => {
                            console.log('Suspend/unsuspend icon clicked for user:', user);
                            if (!user.id) {
                              alert('Invalid user selected.');
                              return;
                            }
                            setCurrentUser(user);
                            if (!user.isSuspended) {
                              openSuspendDialog(user);
                            } else {
                              handleToggleUserSuspension(user);
                            }
                          }}
                        >
                          {user.isSuspended ? <LockOpenIcon /> : <LockIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send Notification">
                        <IconButton 
                          onClick={() => {
                            setCurrentUser(user);
                            setSendNotificationDialogOpen(true);
                          }}
                        >
                          <EmailIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton 
                          onClick={() => {
                            setCurrentUser(user);
                            setDeleteConfirmDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalUsers}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* User Details Dialog */}
      <UserDetailsDialog
        user={currentUser}
        loginHistory={userLoginHistory}
        recentActivity={userRecentActivity}
        onClose={() => {
          setUserDetailsDialogOpen(false);
          setCurrentUser(null);
        }}
      />
      
      {/* Edit User Dialog */}
      <EditUserDialog
        user={currentUser}
        open={editUserDialogOpen}
        onClose={() => setEditUserDialogOpen(false)}
        onSave={handleSaveUserEdit}
      />
      
      {/* Reset Password Confirmation Dialog */}
      <Dialog
        open={resetPasswordDialogOpen}
        onClose={() => setResetPasswordDialogOpen(false)}
      >
        <DialogTitle>Reset User Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will send a password reset email to the user. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetPasswordDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => currentUser && handleResetPassword(currentUser.id)}
          >
            Send Reset Email
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Suspend User Dialog */}
      <Dialog
        open={suspendDialogOpen}
        onClose={() => setSuspendDialogOpen(false)}
      >
        <DialogTitle>Suspend User Account</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please select a reason for suspending this user account.
          </DialogContentText>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Suspension Reason</InputLabel>
            <Select
              value={suspensionReason}
              label="Suspension Reason"
              onChange={(e) => setSuspensionReason(e.target.value)}
              autoFocus
            >
              {SUSPEND_REASONS.map((reason) => (
                <MenuItem key={reason} value={reason}>{reason}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {suspensionReason === 'Other' && (
            <TextField
              label="Custom Reason"
              fullWidth
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              autoFocus
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuspendDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => currentUser && handleToggleUserSuspension(currentUser)}
            disabled={
              !suspensionReason ||
              (suspensionReason === 'Other' && !customReason)
            }
          >
            Suspend Account
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialogOpen}
        onClose={() => setDeleteConfirmDialogOpen(false)}
      >
        <DialogTitle>Delete User Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => currentUser && handleDeleteUser(currentUser.id)}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Send Notification Dialog */}
      <SendNotificationDialog
        user={currentUser}
        open={sendNotificationDialogOpen}
        onClose={() => setSendNotificationDialogOpen(false)}
        onSend={handleSendNotification}
      />
      
      {/* Bulk Action Dialog */}
      <BulkActionDialog
        open={bulkActionDialogOpen}
        selectedUsers={selectedUsers}
        onClose={() => setBulkActionDialogOpen(false)}
        onAction={handleBulkAction}
      />
    </Box>
  );
};

export default UserManagement; 