import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  Paper,
  Tab,
  Tabs,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const TestimonialApproval = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  const [editedTestimonial, setEditedTestimonial] = useState({ name: '', email: '', text: '', avatarUrl: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Load testimonials from API
  useEffect(() => {
    const loadTestimonials = async () => {
      setLoading(true);
      try {
      const { ENV } = await import('../../config/env');
      const token = localStorage.getItem('token');
                const response = await axios.get(`${ENV.API_URL}/testimonials`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
        // Transform the data to match our UI needs
        const transformedTestimonials = response.data.map(testimonial => ({
          id: testimonial._id,
          name: testimonial.name,
          email: testimonial.email,
          text: testimonial.text,
          avatarUrl: testimonial.avatarUrl,
          dateSubmitted: testimonial.createdAt,
          status: testimonial.approved ? 'approved' : 'pending'
        }));
        setTestimonials(transformedTestimonials);
      } catch (error) {
        console.error('Error loading testimonials:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load testimonials',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadTestimonials();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const openEditDialog = (testimonial) => {
    setCurrentTestimonial(testimonial);
    setEditedTestimonial({
      name: testimonial.name,
      email: testimonial.email,
      text: testimonial.text,
      avatarUrl: testimonial.avatarUrl
    });
    setEditDialogOpen(true);
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTestimonial(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditSave = async () => {
    try {
      const { ENV } = await import('../../config/env');
      const token = localStorage.getItem('token');
      await axios.patch(`${ENV.API_URL}/testimonials/${currentTestimonial.id}`, editedTestimonial, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      
      // Update local state
      setTestimonials(prev => 
        prev.map(item => 
          item.id === currentTestimonial.id 
            ? { ...item, ...editedTestimonial } 
            : item
        )
      );
      
      setSnackbar({
        open: true,
        message: 'Testimonial updated successfully',
        severity: 'success'
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update testimonial',
        severity: 'error'
      });
    }
  };
  
  const openDeleteDialog = (testimonial) => {
    setCurrentTestimonial(testimonial);
    setDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    try {
      const { ENV } = await import('../../config/env');
      const token = localStorage.getItem('token');
      await axios.delete(`${ENV.API_URL}/testimonials/${currentTestimonial.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      
      // Update local state
      setTestimonials(prev => prev.filter(item => item.id !== currentTestimonial.id));
      
      setSnackbar({
        open: true,
        message: 'Testimonial deleted successfully',
        severity: 'success'
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete testimonial',
        severity: 'error'
      });
    }
  };
  
  const handleStatusChange = async (testimonial, newStatus) => {
    try {
      const { ENV } = await import('../../config/env');
      const token = localStorage.getItem('token');
      if (newStatus === 'approved') {
        await axios.patch(`${ENV.API_URL}/testimonials/${testimonial.id}/approve`, {}, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
      }
      
      // Update local state
      setTestimonials(prev => 
        prev.map(item => 
          item.id === testimonial.id 
            ? { ...item, status: newStatus } 
            : item
        )
      );
      
      const statusMessage = {
        approved: 'Testimonial approved and published',
        rejected: 'Testimonial rejected',
        pending: 'Testimonial marked as pending'
      };
      
      setSnackbar({
        open: true,
        message: statusMessage[newStatus] || 'Status updated',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update testimonial status',
        severity: 'error'
      });
    }
  };
  
  const filteredTestimonials = testimonials.filter(
    testimonial => testimonial.status === activeTab
  );
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="testimonial status tabs"
          variant="fullWidth"
        >
          <Tab label={`Pending (${testimonials.filter(t => t.status === 'pending').length})`} value="pending" />
          <Tab label={`Approved (${testimonials.filter(t => t.status === 'approved').length})`} value="approved" />
          <Tab label={`Rejected (${testimonials.filter(t => t.status === 'rejected').length})`} value="rejected" />
        </Tabs>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          {filteredTestimonials.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              No testimonials found in this category.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {filteredTestimonials.map(testimonial => (
                <Grid item xs={12} key={testimonial.id}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">{testimonial.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Submitted on {new Date(testimonial.dateSubmitted).toLocaleDateString()}
                        </Typography>
                      </Box>
                      
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {testimonial.email}
                      </Typography>
                      
                      <Typography variant="body1" paragraph sx={{ mt: 2, fontStyle: 'italic' }}>
                        "{testimonial.text}"
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Chip 
                            label={testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)} 
                            color={
                              testimonial.status === 'approved' ? 'success' : 
                              testimonial.status === 'rejected' ? 'error' : 'default'
                            }
                            size="small"
                          />
                        </Box>
                        
                        <Box>
                          {activeTab === 'pending' && (
                            <>
                              <Button 
                                startIcon={<CheckCircleIcon />} 
                                color="success"
                                onClick={() => handleStatusChange(testimonial, 'approved')}
                                sx={{ mr: 1 }}
                              >
                                Approve
                              </Button>
                              <Button 
                                startIcon={<DeleteIcon />} 
                                color="error"
                                onClick={() => handleStatusChange(testimonial, 'rejected')}
                                sx={{ mr: 1 }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          
                          <Button 
                            startIcon={<EditIcon />} 
                            color="primary"
                            onClick={() => openEditDialog(testimonial)}
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </Button>
                          
                          <Button 
                            startIcon={<DeleteIcon />} 
                            color="error"
                            onClick={() => openDeleteDialog(testimonial)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Testimonial</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Name"
            fullWidth
            name="name"
            value={editedTestimonial.name}
            onChange={handleEditChange}
          />
          <TextField
            margin="normal"
            label="Email"
            fullWidth
            name="email"
            value={editedTestimonial.email}
            onChange={handleEditChange}
          />
          <TextField
            margin="normal"
            label="Testimonial"
            multiline
            rows={4}
            fullWidth
            name="text"
            value={editedTestimonial.text}
            onChange={handleEditChange}
          />
          <TextField
            margin="normal"
            label="Avatar URL"
            fullWidth
            name="avatarUrl"
            value={editedTestimonial.avatarUrl}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this testimonial from {currentTestimonial?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Status notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TestimonialApproval; 