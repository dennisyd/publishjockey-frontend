import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  const projects = [
    { id: 'my-first-book', name: 'My First Book' },
    { id: 'sample-project', name: 'Sample Project' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Projects
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <Typography variant="h6" component="h2">
                {project.name}
              </Typography>
              <Typography color="text.secondary">
                Click to open workspace
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Projects; 