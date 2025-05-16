import React, { useEffect, useState } from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProjectWorkspace from '../components/ProjectWorkspace';

type ProjectType = {
  id: string;
  title: string;
  // add other fields as needed
};

// Define the API response structure
interface ProjectResponse {
  project: {
    _id: string;
    title: string;
    // add other API response fields as needed
  }
}

const Project: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get<ProjectResponse>(`http://localhost:3001/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProject({ id: res.data.project._id, title: res.data.project.title });
      } catch (err) {
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!project) return <div>Project not found</div>;

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
      gap: 2
    }}>
      <Box>
        <Paper>
          <ProjectWorkspace projectId={project.id} />
        </Paper>
      </Box>
    </Box>
  );
};

export default Project; 