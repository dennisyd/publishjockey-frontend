import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const Privacy = () => (
  <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', py: 8 }}>
    <Container maxWidth="md">
      <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
          Privacy Policy
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          This Privacy Policy explains how PublishJockey collects, uses, and protects your information when you use our platform.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Information We Collect</Typography>
        <Typography variant="body1" paragraph>
          We collect only the information necessary to provide our services, such as your name, email address, and manuscript files. We do not collect unnecessary personal data.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>How We Use Your Data</Typography>
        <Typography variant="body1" paragraph>
          Your data is used solely to deliver, improve, and support our publishing services. We do not sell or share your personal information with third parties for marketing purposes.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Data Storage and Security</Typography>
        <Typography variant="body1" paragraph>
          We store your original Markdown input and uploaded images while your account is active. Complete manuscript files are not retained. All data is encrypted in transit and at rest.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Cookies and Tracking</Typography>
        <Typography variant="body1" paragraph>
          We use cookies and similar technologies to enhance your experience and analyze site usage. You can control cookie preferences in your browser settings.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Third-Party Services</Typography>
        <Typography variant="body1" paragraph>
          Some features may rely on trusted third-party services (such as payment processors). These providers have their own privacy policies, and we recommend reviewing them.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Your Rights and Choices</Typography>
        <Typography variant="body1" paragraph>
          You may request access to, correction of, or deletion of your personal data at any time. Account deletion will remove your data from our systems.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Children's Privacy</Typography>
        <Typography variant="body1" paragraph>
          PublishJockey is not intended for children under 13. We do not knowingly collect personal information from children.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Policy Updates</Typography>
        <Typography variant="body1" paragraph>
          We may update this Privacy Policy from time to time. Significant changes will be communicated via the website or email.
        </Typography>

        <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Contact Us</Typography>
        <Typography variant="body1" paragraph>
          If you have questions about this Privacy Policy or your data, please contact us at support@publishjockey.com.
        </Typography>
      </Paper>
    </Container>
  </Box>
);

export default Privacy; 