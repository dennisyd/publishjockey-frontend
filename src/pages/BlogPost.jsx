import React, { useEffect } from 'react';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Breadcrumbs,
  Link,
  Avatar,
  Button,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import PublishJockeyLogo from '../publishjockey_logo.png';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';

// Blog post content data
const blogPostsData = {
  'manuscript-to-print-ready': {
    title: 'How to Turn Your Manuscript Into a Print-Ready Book in Minutes',
    excerpt: 'A step-by-step guide to transforming your raw manuscript into a professionally formatted book using PublishJockey.',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    date: 'May 9, 2025',
    author: 'The PublishJockey Team',
    authorAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
    category: 'Publishing Tips',
    readTime: '5 min read',
    content: [
      {
        type: 'paragraph',
        text: "If you've ever dreamed of publishing your book but found yourself intimidated by formatting requirements and design challenges, you're not alone. Many authors spend hundreds of dollars and countless hours trying to transform their manuscripts into professional, print-ready books. At PublishJockey, we've simplified this process down to minutes, not days or weeks."
      },
      {
        type: 'heading',
        text: 'The Traditional Publishing Struggle'
      },
      {
        type: 'paragraph',
        text: "Traditionally, preparing a manuscript for publishing involves multiple complex steps: formatting in Word (which often breaks), hiring a designer for layout, converting to PDF with proper margins, creating a table of contents, and ensuring proper page numbering. This cumbersome process can cost $300-500 or require learning specialized tools like InDesign or professional typesetting software."
      },
      {
        type: 'paragraph',
        text: "PublishJockey was born when our founder faced exactly this problem – paying $500 for manuscript formatting seemed excessive, especially for authors who might need to make revisions."
      },
      {
        type: 'heading',
        text: 'The PublishJockey Solution: Your Book in Minutes'
      },
      {
        type: 'paragraph',
        text: 'Our platform transforms this entire process into four simple steps that take minutes, not days. Here is how it works:'
      },
      {
        type: 'steps',
        items: [
          {
            title: 'Import Your Manuscript',
            content: 'Upload your manuscript directly from Word, Google Docs, or Markdown files. Our SplitDoctor tool automatically extracts chapters and sections, preserving your document structure.',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'
          },
          {
            title: 'Edit and Format',
            content: 'Use our intuitive Markdown editor to make any necessary changes. Do not worry – Markdown is incredibly simple to learn. Add formatting, headings, lists, tables, and images with easy-to-use buttons. Our real-time preview shows you exactly how your content will appear.',
            image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80'
          },
          {
            title: 'Customize Your Book',
            content: 'Select your preferred book size (like 6x9 for KDP), choose fonts and styles, add front matter like title pages, and configure your table of contents. Our system handles all the complex typesetting rules behind the scenes.',
            image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80'
          },
          {
            title: 'Export and Publish',
            content: 'With a single click, export your manuscript as a professionally formatted PDF ready for print publishing, or as an EPUB for e-readers. Unlike other tools that make you wait, our system generates professional PDFs in about 15 seconds and EPUBs in under 2 seconds.',
            image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80'
          }
        ]
      },
      {
        type: 'heading',
        text: 'The Technical Magic Behind PublishJockey'
      },
      {
        type: 'paragraph',
        text: 'What makes PublishJockey different is our use of professional typesetting technology behind the scenes. While you work with a simple, intuitive Markdown editor, our system leverages publisher-grade formatting to handle:'
      },
      {
        type: 'list',
        items: [
          'Proper page breaks that avoid widows and orphans',
          'Consistent typography across your entire book',
          'Professional handling of headings, paragraphs, and spacing',
          'Automatic generation of front matter and table of contents',
          'Precise margins, headers, and footers for print publishing'
        ]
      },
      {
        type: 'paragraph',
        text: 'This is the same technology used by academic publishers and professionals, but without requiring you to learn any complex syntax or commands.'
      },
      {
        type: 'heading',
        text: 'Real Author Success Stories'
      },
      {
        type: 'quote',
        text: 'I saved over $400 and two weeks of back-and-forth with a designer. My book went from Word document to KDP-ready PDF in less than an hour with PublishJockey.',
        author: 'Sarah J., Fantasy Author'
      },
      {
        type: 'heading',
        text: 'Ready to Transform Your Manuscript?'
      },
      {
        type: 'paragraph',
        text: 'Getting started with PublishJockey takes just minutes. Our Free plan lets you explore the core features and preview the first 12 pages of your book. For single-book publishing, our Single Book plan at $63 gives you everything you need. Add additional books for $37 each, or choose our 10-Book Pack for $199 (valid for 3 years). During launch, grab 25 books for $144 (limited time).'
      },
      {
        type: 'cta',
        text: 'Try PublishJockey Today',
        buttonText: 'Get Started',
        link: '/register'
      }
    ],
    relatedPosts: []
  },
  'book-formatting-truth': {
    title: 'The Truth About Book Formatting: What Self-Publishers Need to Know',
    excerpt: 'Discover the hidden challenges of book formatting and why modern tools are transforming the self-publishing landscape.',
    imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    date: 'January 28, 2025',
    author: 'Emma Richardson',
    authorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
    category: 'Publishing Insights',
    readTime: '8 min read',
    content: [
      {
        type: 'paragraph',
        text: 'When most authors finish writing their manuscript, they are often unprepared for what comes next: the seemingly simple but deceptively complex process of formatting their book. This critical step stands between your raw manuscript and a professional publication that readers will take seriously.'
      },
      {
        type: 'heading',
        text: 'The Traditional Formatting Nightmare'
      },
      {
        type: 'paragraph',
        text: 'Traditional book formatting approaches fall into three categories, each with significant drawbacks:'
      },
      {
        type: 'list',
        items: [
          'Word processors (like Microsoft Word): Prone to formatting inconsistencies and "page gremlins" that mysteriously break your layout',
          'Professional formatters: Cost $300-800 per book, with additional fees for revisions',
          'Design software (like InDesign): Requires a steep learning curve and expensive subscription fees'
        ]
      },
      {
        type: 'paragraph',
        text: 'These challenges leave many self-publishers frustrated, over budget, or settling for less-than-professional results that readers notice immediately.'
      },
      {
        type: 'heading',
        text: 'What Traditional Formatting Solutions Do Not Tell You'
      },
      {
        type: 'paragraph',
        text: 'The book formatting industry has several "inconvenient truths" that most service providers will not mention upfront:'
      },
      {
        type: 'list',
        items: [
          'Formatting is an iterative process – your first draft is almost never your final version',
          'Small text edits often require complete reformatting and re-pagination',
          'Different publishing platforms (KDP, IngramSpark, etc.) have different requirements',
          'Many formatting issues only become visible in the final PDF or printed copy',
          'Standard word processors were not designed for book publishing'
        ]
      },
      {
        type: 'quote',
        text: 'I spent over $500 on professional formatting, only to discover a typo on page one after submitting to the printer. The formatter charged me another $150 for what was literally a two-minute fix.',
        author: 'Michael T., First-time Author'
      },
      {
        type: 'heading',
        text: 'The Technical Reality of Book Formatting'
      },
      {
        type: 'paragraph',
        text: 'Professional-quality book formatting requires handling several technical elements invisible to most authors:'
      },
      {
        type: 'list',
        items: [
          'Widows and orphans control (preventing single lines at tops/bottoms of pages)',
          'Proper kerning and leading (letter and line spacing)',
          'Section and page break management',
          'Embedded fonts and proper PDF compression',
          'Consistent heading hierarchy and styling',
          'Specialized front and back matter formatting',
          'Proper handling of images and tables'
        ]
      },
      {
        type: 'heading',
        text: 'Why Modern Tools Are Changing the Game'
      },
      {
        type: 'paragraph',
        text: 'The publishing industry is experiencing a technological transformation that is making high-quality formatting accessible to everyone. Modern publishing platforms like PublishJockey leverage sophisticated typesetting technology behind simple interfaces.'
      },
      {
        type: 'paragraph',
        text: 'Here is how this approach solves the traditional formatting challenges:'
      },
      {
        type: 'steps',
        items: [
          {
            title: 'Focus on Content, Not Formatting',
            content: 'By separating content from presentation using Markdown, authors can focus on writing while the system handles typesetting rules automatically. This prevents formatting "whack-a-mole" where fixing one issue creates another.',
            image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
          },
          {
            title: 'Instant Updates and Previews',
            content: 'When you make changes, the system regenerates your entire book in seconds, showing exactly how the final product will look. This eliminates the wait time and expense of traditional revision cycles.',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
          },
          {
            title: 'Professional Typesetting',
            content: 'Behind the scenes, modern platforms like PublishJockey use professional typesetting technology—the same systems preferred by publishers worldwide—to produce consistently excellent results without requiring technical knowledge.',
            image: 'https://images.unsplash.com/photo-1476081718509-d5d0b661a376?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
          },
          {
            title: 'Multi-format Export',
            content: 'Generate PDF for print, EPUB for e-readers, and Word formats from a single source document—ensuring consistency across all formats while meeting the requirements of different publishing platforms.',
            image: 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
          }
        ]
      },
      {
        type: 'heading',
        text: 'Cost-Benefit Analysis: Traditional vs. Modern Formatting'
      },
      {
        type: 'paragraph',
        text: 'Let us compare the true costs of different formatting approaches for a 300-page book:'
      },
      {
        type: 'paragraph',
        text: '1. Traditional Formatter ($350-800):\n- Initial formatting: $400 average\n- Two rounds of revisions: $200\n- Additional format conversions: $150\n- Total time: 2-4 weeks\n- Total cost: $750+'
      },
      {
        type: 'paragraph',
        text: '2. Learning Professional Software ($0-600):\n- Software subscription: $20-50/month\n- Learning curve: 40+ hours of time\n- Template purchase: $30-100\n- Total time: 1-3 months\n- Total cost: Your time plus $200-600/year'
      },
      {
        type: 'paragraph',
        text: '3. Modern Publishing Platform like PublishJockey ($0-399):\n- Free Plan: $0 (limited to first 12 pages with watermark)\n- Single Book Plan: $63 for one book (one-time payment)\n- Additional Books: $37 per additional book\n- 10-Book Pack: $199 (valid for 3 years)\n- Launch Offer: 25-Book Pack $144 (limited time)\n- Learning curve: 1-2 hours\n- Revisions: Unlimited, instant\n- Total time: Minutes, not weeks\n- Total cost: As low as $5.76 per book during launch'
      },
      {
        type: 'heading',
        text: 'The Future of Self-Publishing'
      },
      {
        type: 'paragraph',
        text: 'The democratization of publishing tools like PublishJockey means self-publishers can now produce books with the same quality as traditional publishers. This shift is empowering a new generation of authors to bypass traditional gatekeepers while maintaining professional standards.'
      },
      {
        type: 'quote',
        text: 'I have published with traditional formatters and tried doing it myself in Word. Using PublishJockey cut my production time by 90% and actually improved the quality of my finished book.',
        author: 'Rebecca M., Mystery Series Author'
      },
      {
        type: 'heading',
        text: 'Making the Right Choice for Your Book'
      },
      {
        type: 'paragraph',
        text: 'When deciding how to format your book, consider these factors:'
      },
      {
        type: 'list',
        items: [
          'Budget: What is your all-in formatting budget, including revisions?',
          'Timeline: How quickly do you need to publish?',
          'Complexity: Does your book have special elements like tables, images, or complex layouts?',
          'Future plans: Will you publish multiple books or editions?',
          'Technical comfort: How comfortable are you with learning new tools?'
        ]
      },
      {
        type: 'paragraph',
        text: 'For most self-publishers today, modern platforms offer the optimal balance of quality, cost, and convenience—especially when you factor in the hidden costs of traditional approaches.'
      },
      {
        type: 'cta',
        text: 'Ready to Transform Your Formatting Experience?',
        buttonText: 'Try PublishJockey',
        link: '/register'
      }
    ],
    relatedPosts: []
  },
  'ai-covers-for-kdp': {
    title: 'Creating KDP-Ready Book Covers with AI: No Designer Needed',
    excerpt: 'Learn how to create professional book covers using AI tools like ChatGPT and upscale them for Amazon KDP using PublishJockey ImageMagic utility.',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    date: 'June 15, 2024',
    author: 'The PublishJockey Team',
    authorAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
    category: 'Cover Design',
    readTime: '6 min read',
    content: [
      {
        type: 'paragraph',
        text: "The days of paying hundreds of dollars for book cover designs are coming to an end. With the rise of AI image generation tools like those in ChatGPT, authors can now create stunning cover images by simply describing what they want. But there is a catch – these AI-generated images often lack the high resolution required for Amazon KDP. That is where PublishJockey ImageMagic utility comes in."
      },
      {
        type: 'heading',
        text: 'The New Era of DIY Book Covers'
      },
      {
        type: 'paragraph',
        text: "Professional book cover design has traditionally been a significant expense for self-published authors, with costs ranging from $100 to $1,000 for a single design. Many authors felt forced to make this investment, believing it was the only way to create a cover that would stand out in the marketplace."
      },
      {
        type: 'paragraph',
        text: "However, AI image generation has changed the game completely. Tools like DALL-E (available in ChatGPT) and Midjourney now allow anyone to create visually striking images simply by typing a detailed description. Want a mysterious forest with magical elements for your fantasy novel? Just describe it, and the AI will generate multiple options for you to choose from."
      },
      {
        type: 'quote',
        text: "I described exactly what I wanted for my thriller novel cover – a silhouette on a bridge with fog and a distinctive red element for contrast. ChatGPT created something better than what I had imagined, and it took less than 5 minutes.",
        author: "Rebecca K., Thriller Author"
      },
      {
        type: 'heading',
        text: 'The Resolution Challenge for KDP Publishing'
      },
      {
        type: 'paragraph',
        text: "While AI tools excel at creating visually appealing images, they typically generate them at resolutions too low for professional publishing. Amazon KDP requires cover images at 300 DPI (dots per inch) with specific pixel dimensions based on your book size. For example, a standard 6x9 book cover requires an image that is 1800×2700 pixels."
      },
      {
        type: 'paragraph',
        text: "ChatGPT-generated images usually come in at around 1024×1024 pixels – sufficient for web use but not for high-quality print publishing. This resolution gap has been the main obstacle preventing authors from using AI-generated covers for their published books."
      },
      {
        type: 'heading',
        text: 'Introducing ImageMagic: The Missing Link'
      },
      {
        type: 'paragraph',
        text: "PublishJockey ImageMagic utility bridges this gap by intelligently upscaling AI-generated images to meet KDP's requirements. Unlike simple image resizing (which results in blurry, pixelated images), ImageMagic uses advanced algorithms to enhance details and maintain sharpness while increasing resolution."
      },
      {
        type: 'paragraph',
        text: "The process is remarkably simple:"
      },
      {
        type: 'steps',
        items: [
          {
            title: 'Generate Your Cover with AI',
            content: 'Use ChatGPT or another AI image tool to create a cover design based on your description. Be specific about style, mood, colors, and elements you want to include. Save the generated image to your computer.',
            image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            title: 'Upscale with ImageMagic',
            content: 'Visit PublishJockey ImageMagic tool and upload your AI-generated image. Select your book size (or use auto-detect), and let the system process your image. The tool will upscale your image to the exact dimensions needed for your KDP book cover at 300 DPI.',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            title: 'Download and Use',
            content: 'Once processing is complete (usually within seconds), download your high-resolution image. It is now ready to upload directly to KDP as your book cover. Remember to download it promptly as ImageMagic automatically deletes processed files after 15 minutes to protect your privacy.',
            image: 'https://images.unsplash.com/photo-1555421689-3f034debb7a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          }
        ]
      },
      {
        type: 'heading',
        text: 'Tips for Better AI Cover Generation'
      },
      {
        type: 'paragraph',
        text: "To get the best results from AI image generators and ImageMagic, keep these tips in mind:"
      },
      {
        type: 'list',
        items: [
          'Be specific in your prompts – mention styles, colors, mood, composition, and lighting',
          'Request vertical/portrait orientation to match book cover dimensions',
          'Include text requirements directly in your prompt – ChatGPT does a great job adding titles and author names',
          'Generate multiple variations and select the best one',
          'Ensure your source image is at least 1000×1500 pixels (200KB+) for optimal upscaling',
          'For best results, double-check that any text in your AI-generated image is spelled correctly'
        ]
      },
      {
        type: 'heading',
        text: 'The Limitations of AI Cover Creation'
      },
      {
        type: 'paragraph',
        text: "While this approach works wonderfully for many authors, it's important to understand some limitations:"
      },
      {
        type: 'list',
        items: [
          'Very small source images (under 100KB) may lack sufficient detail for quality upscaling',
          'AI may struggle with very specific character details or complex scene arrangements',
          'While ChatGPT generally does a good job with text, you might occasionally need to make text adjustments using simple design tools',
          'Some genres with established visual conventions may benefit from professional design input'
        ]
      },
      {
        type: 'heading',
        text: 'A Complete Publishing Solution'
      },
      {
        type: 'paragraph',
        text: "ImageMagic is just one component of PublishJockey comprehensive self-publishing toolkit. While you are creating your cover, do not forget that our platform also helps with manuscript formatting, export to multiple formats, and other essential publishing tasks – all designed to make self-publishing accessible, affordable, and professional."
      },
      {
        type: 'cta',
        text: 'Ready to create your KDP cover with AI?',
        buttonText: 'Try ImageMagic Now',
        link: '/image-magic'
      }
    ],
    relatedPosts: ['manuscript-to-print-ready', 'book-formatting-truth']
  },
  'markdown-for-authors': {
    title: 'Markdown for Authors: Why It Is Simpler Than You Think',
    excerpt: 'Demystifying Markdown for non-technical writers and showing why it is the perfect tool for modern book creation.',
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1170&q=80',
    date: 'May 1, 2025',
    author: 'The PublishJockey Team',
    authorAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
    category: 'Writing Tools',
    readTime: '6 min read',
    content: [
      {
        type: 'paragraph',
        text: "If you are an author, you have probably heard the word 'Markdown' tossed around by tech-savvy writers and publishing platforms. But what is Markdown, and why should you care? The good news: Markdown is not just for programmers—it is a simple, intuitive way to format your writing, and it is perfect for authors who want to focus on words, not software."
      },
      {
        type: 'heading',
        text: 'What Is Markdown?'
      },
      {
        type: 'paragraph',
        text: "Markdown is a lightweight formatting language that lets you add structure—like headings, bold, italics, and lists—to your text using plain, easy-to-remember symbols. It was created so writers could format documents without clicking through endless menus or learning complicated tools."
      },
      {
        type: 'paragraph',
        text: "Worried about remembering Markdown codes? With PublishJockey, you do not have to! Our editor includes a simple toolbar—just like Word or Google Docs—so you can click to add headings, bold, italics, lists, and more. You get the power and portability of Markdown, with the ease of a familiar writing tool."
      },
      {
        type: 'list',
        items: [
          "Use # for headings (e.g., # Chapter 1)",
          "Use *asterisks* or _underscores_ for italics",
          "Use **double asterisks** or __double underscores__ for bold",
          "Start lines with - or * for bullet lists",
          "Add [links](https://publishjockey.com) with simple brackets"
        ]
      },
      {
        type: 'heading',
        text: 'Why Authors Love Markdown'
      },
      {
        type: 'paragraph',
        text: "Unlike word processors, Markdown keeps your writing distraction-free. You do not have to worry about weird formatting, broken styles, or copy-paste headaches. Your words stay clean and portable, ready for any publishing platform."
      },
      {
        type: 'quote',
        text: "I was intimidated at first, but Markdown is actually easier than Word once you get the hang of it. Now I can focus on my story, not the software.",
        author: "Lisa M., Self-Published Author"
      },
      {
        type: 'heading',
        text: 'How Markdown Makes Book Publishing Easier'
      },
      {
        type: 'steps',
        items: [
          {
            title: 'Write Without Distractions',
            content: "No more fiddling with fonts or spacing. Just write, and let Markdown handle the structure.",
            image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80'
          },
          {
            title: 'Instant Formatting',
            content: "See your headings, lists, and emphasis as you type. No more guessing how your book will look.",
            image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80'
          },
          {
            title: 'Easy Export to Any Format',
            content: "Markdown is the perfect starting point for professional typesetting. With PublishJockey, your Markdown becomes a beautiful, print-ready book—no extra work required.",
            image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80'
          }
        ]
      },
      {
        type: 'heading',
        text: 'Why PublishJockey Uses Markdown'
      },
      {
        type: 'paragraph',
        text: "We chose Markdown because it is the best of both worlds: simple for beginners, powerful for pros. It keeps your writing future-proof and makes collaboration, editing, and publishing seamless. Plus, it is open—no vendor lock-in, no hidden formatting issues."
      },
      {
        type: 'list',
        items: [
          "No software to install—write anywhere, even on your phone",
          "Your files are always yours—easy to back up and share",
          "Perfect for both short stories and full-length books"
        ]
      },
      {
        type: 'quote',
        text: "Markdown lets me write my way, then PublishJockey turns it into a professional book. I will never go back to Word!",
        author: "James T., Indie Author"
      },
      {
        type: 'cta',
        text: "Ready to try Markdown? Start your next book with PublishJockey and see how easy writing and publishing can be.",
        buttonText: "Get Started",
        link: "/register"
      }
    ],
    relatedPosts: []
  },
  'pdf-epub-docx-formats': {
    title: 'PDF, EPUB, DOCX: Which Format Do You Really Need?',
    excerpt: 'A clear guide to the most common publishing formats—what they are, when to use them, and how to choose the right one for your book.',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    date: 'May 8, 2025',
    author: 'The PublishJockey Team',
    authorAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
    category: 'Publishing Formats',
    readTime: '7 min read',
    content: [
      {
        type: 'paragraph',
        text: "If you are new to self-publishing, the world of file formats can feel overwhelming. PDF, EPUB, DOCX—what do they all mean, and which one is right for your book? In this guide, we will break down the strengths of each format and help you choose the best option for your publishing goals."
      },
      {
        type: 'heading',
        text: 'PDF: The Print-Ready Standard'
      },
      {
        type: 'paragraph',
        text: "PDF (Portable Document Format) is the gold standard for print publishing. It preserves your book's layout, fonts, and images exactly as you designed them—no matter where or how it's opened. This makes PDF perfect for sending to printers or uploading to platforms like Amazon KDP for paperback and hardcover books."
      },
      {
        type: 'list',
        items: [
          'Best for print books and proofs',
          'Ensures your layout looks the same everywhere',
          'Not easily editable after export',
          'Required by most print-on-demand services'
        ]
      },
      {
        type: 'heading',
        text: 'EPUB: The E-Book Essential'
      },
      {
        type: 'paragraph',
        text: "EPUB is the universal format for e-books. Unlike PDF, EPUB files are 'reflowable'—meaning the text adapts to any screen size, font preference, or device. This makes EPUB ideal for Kindle, Apple Books, Kobo, and other e-readers."
      },
      {
        type: 'list',
        items: [
          'Best for digital books and e-readers',
          'Lets readers adjust font size and style',
          'Supports interactive features like links and images',
          'Required by most e-book retailers'
        ]
      },
      {
        type: 'heading',
        text: 'DOCX: The Editing Workhorse'
      },
      {
        type: 'paragraph',
        text: "DOCX is the standard file format for Microsoft Word. It's perfect for editing, collaboration, and sharing drafts with editors or beta readers. While not ideal for final publishing, DOCX is a great way to keep your manuscript flexible during the writing and revision process."
      },
      {
        type: 'list',
        items: [
          'Best for editing and collaboration',
          'Easy to track changes and add comments',
          'Not suitable for professional print or e-book publishing',
          'Can be converted to PDF or EPUB when ready'
        ]
      },
      {
        type: 'heading',
        text: 'Quick Comparison Table'
      },
      {
        type: 'paragraph',
        text: `<table style='width:100%; border-collapse: collapse; margin: 15px 0;'><tr style='background-color: #f5f5f5; font-weight: bold;'><th style='border: 1px solid #ddd; padding: 8px;'>Format</th><th style='border: 1px solid #ddd; padding: 8px;'>Best For</th><th style='border: 1px solid #ddd; padding: 8px;'>Key Strength</th><th style='border: 1px solid #ddd; padding: 8px;'>When to Use</th></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>PDF</td><td style='border: 1px solid #ddd; padding: 8px;'>Print books</td><td style='border: 1px solid #ddd; padding: 8px;'>Fixed layout, print-ready</td><td style='border: 1px solid #ddd; padding: 8px;'>Final files for printers or KDP</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>EPUB</td><td style='border: 1px solid #ddd; padding: 8px;'>E-books</td><td style='border: 1px solid #ddd; padding: 8px;'>Reflowable, device-friendly</td><td style='border: 1px solid #ddd; padding: 8px;'>Digital publishing (Kindle, Apple Books, etc.)</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>DOCX</td><td style='border: 1px solid #ddd; padding: 8px;'>Editing</td><td style='border: 1px solid #ddd; padding: 8px;'>Easy collaboration</td><td style='border: 1px solid #ddd; padding: 8px;'>Drafts, revisions, sharing with editors</td></tr></table>`
      },
      {
        type: 'heading',
        text: 'Which Format Should You Choose?'
      },
      {
        type: 'paragraph',
        text: "For most authors, the answer is: all three! Use DOCX for writing and editing, PDF for print, and EPUB for e-books. With PublishJockey, you can export your manuscript to any of these formats in seconds—no technical skills required."
      },
      {
        type: 'cta',
        text: "Ready to publish? Try PublishJockey and get professional-quality PDF, EPUB, and DOCX files with a single click.",
        buttonText: "Get Started",
        link: "/register"
      }
    ],
    relatedPosts: []
  }
};

const BlogPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = blogPostsData[postId];
  
  useEffect(() => {
    // Scroll to top when post loads
    window.scrollTo(0, 0);
    
    // Redirect to blog page if post not found
    if (!post) {
      navigate('/blog');
    }
  }, [postId, post, navigate]);
  
  if (!post) return null;

  return (
    <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh' }}>
      {/* Back to Blog */}
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Button 
          component={RouterLink} 
          to="/blog" 
          startIcon={<ArrowBackIcon />}
          sx={{ 
            mb: 2, 
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.05)'
            }
          }}
        >
          Back to Blog
        </Button>
        
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
          <Link component={RouterLink} to="/" sx={{ color: 'text.secondary', textDecoration: 'none' }}>
            Home
          </Link>
          <Link component={RouterLink} to="/blog" sx={{ color: 'text.secondary', textDecoration: 'none' }}>
            Blog
          </Link>
          <Typography color="text.primary">{post.title}</Typography>
        </Breadcrumbs>
      </Container>

      {/* Featured Image */}
      <Container maxWidth="md">
        <Box 
          component="img"
          src={post.imageUrl}
          alt={post.title}
          sx={{
            width: '100%',
            borderRadius: '12px',
            maxHeight: '400px',
            objectFit: 'cover',
            mb: 4
          }}
        />

        {/* Post Header */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600 }}>
            {post.category}
          </Typography>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 800, my: 2 }}>
            {post.title}
          </Typography>
          
          {/* Author and Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={post.authorAvatar} sx={{ width: 50, height: 50, mr: 2 }} />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {post.author}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.date} · {post.readTime}
              </Typography>
            </Box>
          </Box>
          
          {/* Share/Save Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<ShareIcon />}
              sx={{ 
                borderRadius: '50px', 
                textTransform: 'none',
                px: 2
              }}
            >
              Share
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<BookmarkIcon />}
              sx={{ 
                borderRadius: '50px', 
                textTransform: 'none',
                px: 2
              }}
            >
              Save
            </Button>
          </Box>
        </Box>

        {/* Post Content */}
        <Box sx={{ 
          bgcolor: 'white', 
          p: { xs: 3, md: 5 }, 
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          mb: 5
        }}>
          {post.content.map((section, index) => {
            if (section.type === 'paragraph') {
              // If the text contains a table, render as HTML
              if (section.text.includes('<table')) {
                return (
                  <Box
                    key={index}
                    sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.text) }}
                  />
                );
              }
              // Otherwise, render as plain text
              return (
                <Typography 
                  key={index} 
                  variant="body1" 
                  paragraph 
                  sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.7 }}
                >
                  {section.text}
                </Typography>
              );
            }
            if (section.type === 'heading') {
              return (
                <Typography 
                  key={index} 
                  variant="h4" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 700, 
                    mt: 5, 
                    mb: 3,
                    color: 'text.primary'
                  }}
                >
                  {section.text}
                </Typography>
              );
            }
            if (section.type === 'steps') {
              return (
                <Box key={index} sx={{ my: 4 }}>
                  {section.items.map((step, stepIndex) => (
                    <Card 
                      key={stepIndex} 
                      elevation={0}
                      sx={{ 
                        mb: 4, 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                        overflow: 'hidden'
                      }}
                    >
                      <Grid container>
                        <Grid item xs={12} md={4}>
                          <Box 
                            component="img"
                            src={step.image}
                            alt={step.title}
                            sx={{ 
                              width: '100%', 
                              height: '100%', 
                              minHeight: { xs: '200px', md: 'auto' },
                              objectFit: 'cover'
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <CardContent sx={{ p: 3 }}>
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                mb: 2,
                                fontWeight: 700
                              }}
                            >
                              <Box 
                                sx={{ 
                                  mr: 2, 
                                  bgcolor: 'primary.main', 
                                  color: 'white',
                                  width: 32, 
                                  height: 32, 
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700
                                }}
                              >
                                {stepIndex + 1}
                              </Box>
                              {step.title}
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                              {step.content}
                            </Typography>
                          </CardContent>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                </Box>
              );
            }
            if (section.type === 'list') {
              return (
                <List key={index} sx={{ mb: 4, pl: 2 }}>
                  {section.items.map((item, itemIndex) => (
                    <ListItem key={itemIndex} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item} 
                        primaryTypographyProps={{ 
                          fontSize: '1.1rem',
                          lineHeight: 1.5
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>
              );
            }
            if (section.type === 'quote') {
              return (
                <Box 
                  key={index} 
                  sx={{ 
                    borderLeft: 4, 
                    borderColor: 'primary.main',
                    pl: 3, 
                    py: 2,
                    my: 4,
                    bgcolor: 'rgba(99, 102, 241, 0.05)',
                    borderRadius: '0 8px 8px 0'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    component="blockquote" 
                    sx={{ 
                      fontStyle: 'italic',
                      fontWeight: 500,
                      mb: 1
                    }}
                  >
                    "{section.text}"
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    — {section.author}
                  </Typography>
                </Box>
              );
            }
            if (section.type === 'cta') {
              return (
                <Box 
                  key={index} 
                  sx={{ 
                    textAlign: 'center', 
                    my: 5,
                    py: 4,
                    borderTop: '1px solid',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 3 
                    }}
                  >
                    {section.text}
                  </Typography>
                  <Button 
                    component={RouterLink} 
                    to={section.link} 
                    variant="contained" 
                    color="primary"
                    size="large"
                    sx={{ 
                      borderRadius: '50px',
                      px: 5,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(99, 102, 241, 0.23)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s'
                      }
                    }}
                  >
                    {section.buttonText}
                  </Button>
                </Box>
              );
            }
            return null;
          })}
        </Box>

        {/* Related Posts (commented out for now since there are no related posts yet) 
          Related posts would be inserted here when available. The structure would be:
          - Box container
          - Typography heading
          - Grid of Cards containing related posts
        */}
      </Container>
      
      {/* Newsletter */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Box sx={{ 
          bgcolor: 'primary.main', 
          backgroundImage: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          color: 'white', 
          borderRadius: '12px', 
          p: { xs: 3, md: 5 }, 
          textAlign: 'center' 
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Want More Publishing Tips?
          </Typography>
          <Typography sx={{ mb: 3, maxWidth: '600px', mx: 'auto', opacity: 0.9 }}>
            Subscribe to our newsletter for the latest publishing tips, tutorials, and industry news
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              maxWidth: '500px', 
              mx: 'auto',
              gap: 1
            }}
          >
            <Box 
              component="input"
              placeholder="Your email address"
              sx={{ 
                flex: 1,
                p: 2,
                borderRadius: '50px',
                border: 'none',
                fontSize: '1rem',
                mb: { xs: 2, sm: 0 },
                '&:focus': {
                  outline: 'none'
                }
              }}
            />
            <Button 
              variant="contained" 
              color="secondary"
              sx={{ 
                borderRadius: '50px',
                px: 3,
                py: { xs: 1.5, sm: 'auto' },
                fontWeight: 600,
                textTransform: 'none',
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)'
                }
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1f2937', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box component="img" src={PublishJockeyLogo} alt="Publish Jockey Logo" sx={{ height: '50px', mb: 2 }} />
              <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: '300px' }}>
                From manuscript to masterpiece—with clarity, simplicity, and freedom.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Product
                  </Typography>
                  <Box component="nav">
                    <Typography component={RouterLink} to="/#features" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      Features
                    </Typography>
                    <Typography component={RouterLink} to="/pricing" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      Pricing
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Company
                  </Typography>
                  <Box component="nav">
                    <Typography component={RouterLink} to="/about" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      About
                    </Typography>
                    <Typography component={RouterLink} to="/blog" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      Blog
                    </Typography>
                    <Typography component={RouterLink} to="/contact" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      Contact
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Resources
                  </Typography>
                  <Box component="nav">
                    <Typography component="a" href="#" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      Help Center
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Legal
                  </Typography>
                  <Box component="nav">
                    <Typography component="a" href="/privacy" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      Privacy
                    </Typography>
                    <Typography component="a" href="/terms" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      Terms
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center' }}>
            © {new Date().getFullYear()} PublishJockey. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default BlogPost; 