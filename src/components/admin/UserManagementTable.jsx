import React, { useEffect, useState } from 'react';
import { ENV } from '../../config/env';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  IconButton, Tooltip, Chip, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Box, Typography, Snackbar, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import LockResetIcon from '@mui/icons-material/LockReset';

const API_BASE = `${ENV.API_URL}/auth`;

const fetchUsers = async () => {
  const res = await fetch(`${API_BASE}/users`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch users');
  const data = await res.json();
  return data.users || data.users || data; // adjust if needed
};

const suspendUser = async (id, suspend) => {
  const res = await fetch(`${API_BASE}/users/${id}/suspend`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ suspend })
  });
  if (!res.ok) throw new Error('Failed to update user status');
  return res.json();
};

const deleteUser = async (id) => {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
};

const changeUserRole = async (id, role) => {
  const res = await fetch(`${API_BASE}/users/${id}/role`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ role })
  });
  if (!res.ok) throw new Error('Failed to change user role');
  return res.json();
};

const resetUserPassword = async (id) => {
  const res = await fetch(`${API_BASE}/users/${id}/reset-password`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to send password reset email');
  return res.json();
};

const UserManagementTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialog, setDialog] = useState({ open: false, type: '', user: null });
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDialogOpen = (type, user) => setDialog({ open: true, type, user });
  const handleDialogClose = () => setDialog({ open: false, type: '', user: null });

  const handleSuspend = async (user) => {
    try {
      await suspendUser(user.id, !user.suspended);
      setSnackbar({ open: true, message: `User ${user.suspended ? 'unsuspended' : 'suspended'} successfully`, severity: 'success' });
      loadUsers();
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: 'error' });
    }
    handleDialogClose();
  };

  const handleDelete = async (user) => {
    try {
      await deleteUser(user.id);
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
      loadUsers();
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: 'error' });
    }
    handleDialogClose();
  };

  const handlePromote = async (user) => {
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      await changeUserRole(user.id, newRole);
      setSnackbar({ open: true, message: `User role changed to ${newRole}`, severity: 'success' });
      loadUsers();
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: 'error' });
    }
    handleDialogClose();
  };

  const handleResetPassword = async (user) => {
    try {
      await resetUserPassword(user.id);
      setSnackbar({ open: true, message: 'Password reset email sent', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: 'error' });
    }
    handleDialogClose();
  };

  // Filter users by search
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          label="Search users"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ width: 300 }}
        />
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.role} color={user.role === 'admin' ? 'primary' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={user.suspended ? 'Suspended' : 'Active'} color={user.suspended ? 'error' : 'success'} size="small" />
                  </TableCell>
                  <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={user.suspended ? 'Unsuspend' : 'Suspend'}>
                      <IconButton onClick={() => handleDialogOpen('suspend', user)}>
                        {user.suspended ? <CheckCircleIcon color="success" /> : <BlockIcon color="warning" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDialogOpen('delete', user)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Promote/Demote">
                      <IconButton onClick={() => handleDialogOpen('promote', user)}>
                        <SecurityIcon color="info" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reset Password">
                      <IconButton onClick={() => handleDialogOpen('reset', user)}>
                        <LockResetIcon color="secondary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Details">
                      <IconButton onClick={() => setSelectedUser(user)}>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Dialogs for actions */}
      <Dialog open={dialog.open} onClose={handleDialogClose}>
        <DialogTitle>
          {dialog.type === 'suspend' && (dialog.user?.suspended ? 'Unsuspend User' : 'Suspend User')}
          {dialog.type === 'delete' && 'Delete User'}
          {dialog.type === 'promote' && 'Promote/Demote User'}
          {dialog.type === 'reset' && 'Reset Password'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {dialog.type === 'suspend' && `Are you sure you want to ${dialog.user?.suspended ? 'unsuspend' : 'suspend'} ${dialog.user?.name}?`}
            {dialog.type === 'delete' && `Are you sure you want to delete ${dialog.user?.name}? This action cannot be undone.`}
            {dialog.type === 'promote' && `Change role for ${dialog.user?.name}?`}
            {dialog.type === 'reset' && `Send a password reset email to ${dialog.user?.email}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          {dialog.type === 'suspend' && <Button onClick={() => handleSuspend(dialog.user)} color="warning">{dialog.user?.suspended ? 'Unsuspend' : 'Suspend'}</Button>}
          {dialog.type === 'delete' && <Button onClick={() => handleDelete(dialog.user)} color="error">Delete</Button>}
          {dialog.type === 'promote' && <Button onClick={() => handlePromote(dialog.user)} color="info">Change Role</Button>}
          {dialog.type === 'reset' && <Button onClick={() => handleResetPassword(dialog.user)} color="secondary">Send Reset</Button>}
        </DialogActions>
      </Dialog>
      {/* User details dialog */}
      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} maxWidth="xs" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography><b>Name:</b> {selectedUser.name}</Typography>
              <Typography><b>Email:</b> {selectedUser.email}</Typography>
              <Typography><b>Role:</b> {selectedUser.role}</Typography>
              <Typography><b>Status:</b> {selectedUser.suspended ? 'Suspended' : 'Active'}</Typography>
              <Typography><b>Created:</b> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : ''}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default UserManagementTable; 