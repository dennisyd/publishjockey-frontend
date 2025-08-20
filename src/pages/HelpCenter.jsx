import React, { useState } from 'react'; // Yancy Dennis - Language Support FAQ
import {
  Box,
  Container,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider
} from '@mui/material';

// Example help topics (expand as needed)
const helpTopics = [
  {
    question: 'What is ImageMagic and how does it help with AI-generated images?',
    answer: 'AI has evolved and is a great tool for generating colorful images, however, they tend to be too low in resolution for publishing. ImageMagic attempts to upscale your .png or .jpg files to meet the requirements for Amazon KDP. While it may be used for other publishing platforms, it has been specifically tested with Amazon KDP requirements. Simply upload your image, select a book size (or let it auto-detect), and ImageMagic will upscale it to 300 DPI resolution suitable for publishing.'
  },
  {
    question: 'Title Changes & Reviews — How does it work?',
    answer: `Single-book plans: Unlimited title edits in the first 3 days after creating a book. After 3 days, very large changes (about 25% different) may be flagged for admin review. Multi-book plans are exempt.

If flagged, an admin approves or denies your request. Approved: your new title goes live. Denied: your last approved title remains. You’ll receive an email in either case.

We show a short 'Heads up' message only to Single-book plans after the 3-day window as a deterrent to misuse.`
  },
  {
    question: 'How do I import my manuscript?',
    answer: 'Go to your dashboard, click "Import Manuscript," and select your file from Word, Google Docs, or Markdown.'
  },
  {
    question: 'What formats can I export?',
    answer: 'You can export your book as PDF (for print), EPUB (for e-readers), and DOCX (for editing and collaboration).'
  },
  {
    question: 'How do I use the Markdown editor?',
    answer: 'The Markdown editor provides a toolbar similar to Word. Use the buttons to add headings, lists, images, and more. Real-time preview is included.'
  },
  {
    question: 'How do I contact support?',
    answer: 'Use the Contact page or email support@publishjockey.com for assistance.'
  },
  {
    question: 'Is there a free plan?',
    answer: 'Yes! You can try PublishJockey for free with limited features. Upgrade for more books and advanced options.'
  },
  {
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page and follow the instructions to reset your password via email.'
  },
  {
    question: 'How do I upgrade or change my subscription?',
    answer: 'Go to your account settings and select the "Billing" tab to view, upgrade, or change your subscription plan.'
  },
  {
    question: 'Can I collaborate with others on my book?',
    answer: 'Currently, collaboration is limited to sharing exported files. We are working on real-time collaboration features for future updates.'
  },
  {
    question: 'How do I add images or tables to my book?',
    answer: 'Use the Markdown editor toolbar to insert images or tables. You can also paste Markdown code directly if you prefer.'
  },
  {
    question: 'Why does my exported PDF look different from the editor?',
    answer: 'The editor provides a close preview, but final typesetting (fonts, margins, page breaks) is handled by our professional typesetting engine for publisher-quality results.'
  },
  {
    question: 'How do I publish to Amazon KDP?',
    answer: 'Export your book as a PDF for print or EPUB for Kindle. Then upload the file to your KDP dashboard following Amazon\'s instructions.'
  },
  {
    question: 'Can I use PublishJockey for both print and e-books?',
    answer: 'Yes! You can export your manuscript in both PDF (for print) and EPUB (for e-books) formats from the same project.'
  },
  {
    question: 'What if I find a bug or have a feature request?',
    answer: 'Please contact support@publishjockey.com or use the feedback form on the Contact page. We value your input!'
  },
  {
    question: 'How do I delete my account?',
    answer: 'Go to your account settings and scroll to the bottom. Click "Delete Account" and follow the confirmation steps.'
  },
  {
    question: 'Is my data secure?',
    answer: 'We use industry-standard encryption and never share your data with third parties. See our Privacy Policy for details.'
  },
  {
    question: 'Can I import chapters automatically?',
    answer: 'Yes! Our SplitDoctor tool detects chapters and sections automatically when you import your manuscript.'
  },
  {
    question: 'How do I change my email address?',
    answer: 'Go to your account settings, update your email, and confirm the change via the verification email sent to your new address.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept major credit cards and PayPal for paid plans.'
  },
  {
    question: 'How do I get an invoice for my subscription?',
    answer: 'Invoices are available in your account billing section. You can download or print them for your records.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel anytime from your account settings. Your plan will remain active until the end of the billing period.'
  },
  {
    question: 'What languages does PublishJockey support?',
    answer: 'PublishJockey supports multiple languages for both interface and document export. We support English, Spanish, German, French, Italian, Russian, Arabic, Hebrew, Yiddish, Indonesian, and Hindi. Each language has optimized font support and proper text direction handling. For Arabic, Hebrew, and Yiddish, we recommend using pure language content only for best results.'
  },
  {
    question: 'Are there any language limitations I should know about?',
    answer: 'Yes, there are important limitations for Right-to-Left (RTL) languages (Arabic, Hebrew, Yiddish). For best results, use pure language content only. Mixed content (English text, URLs, email addresses) may not display correctly in exported PDFs. Font selection is automatically optimized for each language to ensure proper rendering. Always test your exports thoroughly before publishing.'
  }
];

const HelpCenter = () => {
  const [search, setSearch] = useState('');

  // Filter help topics based on search input (case-insensitive)
  const filteredTopics = helpTopics.filter(
    topic =>
      topic.question.toLowerCase().includes(search.toLowerCase()) ||
      topic.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
          Help Center
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
          Find answers to common questions about PublishJockey. Type your question below or browse the topics.
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for help..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 4, bgcolor: 'white', borderRadius: 2 }}
        />
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
          <List>
            {filteredTopics.length === 0 ? (
              <ListItem>
                <ListItemText primary="No results found. Try a different keyword or contact support." />
              </ListItem>
            ) : (
              filteredTopics.map((topic, idx) => (
                <React.Fragment key={idx}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{topic.question}</Typography>}
                      secondary={<Typography variant="body1" sx={{ color: 'text.secondary' }}>{topic.answer}</Typography>}
                    />
                  </ListItem>
                  {idx < filteredTopics.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))
            )}
          </List>
        </Paper>
      </Container>
    </Box>
  );
};

export default HelpCenter; 