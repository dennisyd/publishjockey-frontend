import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const Terms = () => (
  <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', py: 8 }}>
    <Container maxWidth="md">
      <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
          Terms and Agreement
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          By creating an account with PublishJockey, you agree to the following terms:
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Usage Rights</Typography>
        <Typography variant="body1" paragraph>
          PublishJockey grants you a limited, non-transferable license to use the platform for the purpose of creating, editing, and exporting manuscripts for personal or commercial use, subject to the terms outlined herein.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Intellectual Property</Typography>
        <Typography variant="body1" paragraph>
          You retain all rights to the content you create or upload. However, by using the platform, you grant PublishJockey the right to process, display, and temporarily store your content for the sole purpose of providing the publishing service.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Fair Use Policy</Typography>
        <Typography variant="body1" paragraph>
          The platform is designed to support a fair number of manuscript creations and exports per user, particularly for individual authors or small publishers. Users on free or basic plans are expected to operate within reasonable publishing limits.
        </Typography>
        <Typography variant="body1" paragraph>
          Abuse of the system—such as attempting to bypass plan restrictions by repeatedly editing and republishing the same project to create multiple unique books—may result in limitations, account suspension, or removal from the platform.
        </Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to implement automatic and manual safeguards to protect the integrity of our service.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Account Responsibility</Typography>
        <Typography variant="body1" paragraph>
          You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. If you suspect unauthorized access, you must notify us immediately.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Service Changes and Availability</Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to modify, pause, or discontinue any part of the platform with or without notice. We will do our best to notify users in advance of any major changes that affect core functionality.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Data Storage and Privacy</Typography>
        <Typography variant="body1" paragraph>
          We do not store your complete manuscript files. Only your original Markdown input and any uploaded images are retained while your account is active. You may request account deletion and data removal at any time.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Agreement to Terms</Typography>
        <Typography variant="body1" paragraph>
          By clicking "Register" or creating an account, you acknowledge that you have read, understood, and agree to be bound by these terms.
        </Typography>
      </Paper>
    </Container>
  </Box>
);

export default Terms; 