import React from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Link as MuiLink,
  Chip,
  Grid
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  AutoStories as AutoStoriesIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  AttachMoney as AttachMoneyIcon,
  ImportExport as ImportExportIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  Public as PublicIcon,
  Copyright as CopyrightIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  Preview as PreviewIcon,
  CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [expanded, setExpanded] = React.useState('panel1');
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // Category icon mapping
  const categoryIcons = {
    'General': <AutoStoriesIcon />,
    'Getting Started': <AutoStoriesIcon />,
    'Product Comparison': <TimelineIcon />,
    'Quality & Validation': <CheckCircleOutlineIcon />,
    'Features': <SettingsIcon />,
    'Customization & Features': <SettingsIcon />,
    'Technical': <CodeIcon />,
    'Integration & Technical': <CodeIcon />,
    'Pricing': <AttachMoneyIcon />,
    'Pricing & Plans': <AttachMoneyIcon />,
    'Process': <ImportExportIcon />,
    'Publishing & Exporting': <ImportExportIcon />,
    'Common Issues': <SecurityIcon />,
    'Support': <EmailIcon />,
    'Support & Resources': <EmailIcon />
  };

  const faqCategories = [
    {
      category: "Getting Started",
      icon: <AutoStoriesIcon />,
      questions: [
        {
          id: "panel1",
          question: "What makes Publish Jockey different from other publishing tools?",
          answer: "Publish Jockey gives you the simplicity of easy, distraction-free writing, with professional book formatting that matches the standards of major publishers like those on Amazon or in bookstores. Your manuscript is instantly turned into a polished, print-ready book—no complicated setup required."
        },
        {
          id: "competitor-comparison",
          question: "How does PublishJockey compare to other publishing platforms?",
          answer: "We've created a detailed comparison showing how PublishJockey outperforms the competition in features, pricing, and speed:<br><br><div style='text-align: center; margin: 20px 0;'><img src='/publishing_platform_comparison.svg' alt='PublishJockey vs Competitors Comparison Table' style='max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);' /></div><br>Key advantages that set us apart:<br><br><ul style='padding-left: 20px;'><li><strong>80+ Languages:</strong> We support Hindi, Tamil, Bengali, African languages, and more—while other platforms typically support only 1-10 languages.</li><li><strong>Unbeatable Value:</strong> All 3 formats (PDF, EPUB, Word) for $63 promo vs other services charging $147-$349.</li><li><strong>Lightning Speed:</strong> EPUB and Word exports in 5 seconds, PDF in ~30 seconds vs other platforms taking minutes to days.</li><li><strong>Complete Toolkit:</strong> Built-in editor, CSV table import, Word import, and cover generation—features competitors charge extra for or don't offer.</li><li><strong>Bookstore-Quality Formatting:</strong> Professional formatting technology that makes your book look like it belongs on the shelves at Barnes & Noble or any major bookstore.</li></ul>"
        },
        {
          id: "panel2",
          question: "Do I need to know any special formatting or coding?",
          answer: "Not at all! Just write your book using simple, familiar tools. Publish Jockey handles all the advanced typesetting and layout automatically, so your final book always looks clean, consistent, and professionally published."
        },
        {
          id: "panel3",
          question: "Can I import my existing manuscript?",
          answer: "Yes! Publish Jockey supports importing from Word documents (.docx), Markdown files, and Google Docs. Our smart conversion maintains your document structure while adapting it to our publishing format."
        },
        {
          id: "word-import",
          question: "What if I've already written my book in Microsoft Word?",
          answer: "No problem—just use <span style='color: #4F46E5;'>SplitDoctor</span> (<strong>available for registered users</strong>). Follow these steps:<br><br><ol style='padding-left: 20px;'><li style='margin-bottom: 12px;'><strong>Upload your Word document</strong> from your <span style='color: #4F46E5;'>desktop</span>.</li><li style='margin-bottom: 12px;'>Ensure your <span style='color: #4F46E5;'>chapters are marked using</span> <strong>Heading 1 (H1)</strong> styles. These are used to split the document into chapters.</li><li style='margin-bottom: 12px;'>Click \"<strong>Process File.</strong>\"</li><li style='margin-bottom: 12px;'>If processing is successful, you'll be able to download a <span style='color: #4F46E5;'>ZIP</span> file containing each chapter in Markdown format.</li><li style='margin-bottom: 12px;'><strong>Unzip the file</strong>, then import each chapter one by one into the app.</li><li style='margin-bottom: 12px;'><strong>Tables are fully supported</strong> and will be converted automatically.</li><li style='margin-bottom: 12px;'><strong>Image placeholders</strong> will be inserted automatically. You'll need to:<ul style='padding-left: 20px; margin-top: 8px;'><li style='margin-bottom: 8px;'>Upload each image manually using the toolbar.</li><li style='margin-bottom: 8px;'>Delete the placeholder once the image is uploaded.</li></ul></li><li style='margin-bottom: 12px;'><strong>Centering and right-aligned content</strong> may not transfer correctly. To fix this:<ul style='padding-left: 20px; margin-top: 8px;'><li style='margin-bottom: 8px;'>Select the content in the app.</li><li style='margin-bottom: 8px;'>Use the toolbar to re-center or right justify it as needed.</li></ul></li></ol>"
        },
        {
          id: "unused-sections",
          question: "Do I need to delete unused sections of my book?",
          answer: "No, there's no need to delete them. However, you're free to delete unused sections, repurpose (rename) existing ones, and add custom sections to fit your book's structure. The application is designed to be flexible—any sections you don't use will simply be ignored in the final output."
        },
        {
          id: "language-selection",
          question: "Should I select my native language before creating my book?",
          answer: "Yes, we <strong>highly recommend</strong> selecting your native language before creating your book project. Here's why:<br><br><ul style='padding-left: 20px;'><li><strong>Book Structure:</strong> Your book outline (chapters, copyright page, etc.) will appear in your native language from the start.</li><li><strong>Copyright Generation:</strong> The copyright notice will be automatically generated in your language with proper legal terminology.</li><li><strong>Better Experience:</strong> All book sections and templates will be localized for your language.</li></ul><br><strong>What if I forgot to select my language?</strong><br>Don't worry! The service still works perfectly, but:<br><br><ul style='padding-left: 20px;'><li>Your book outline will show in English initially</li><li>You'll need to manually select your copyright language</li><li>You can change your language anytime in settings, and the system will automatically correct the structure and copyright</li></ul><br>We support <strong>60+ languages</strong> including regional variants like Northern/Southern Sotho and African Portuguese, so you can always find the perfect match for your book!"
        }
      ]
    },
    {
      category: "Publishing & Exporting",
      icon: <ImportExportIcon />,
      questions: [
        {
          id: "panel-imagemagic",
          question: "What can I do if my AI-generated book cover is too low resolution for KDP?",
          answer: "This is a common problem with AI image generators. While they create beautiful cover designs, they often produce images at resolutions too low for professional publishing. That's exactly why we built ImageMagic! This tool automatically upscales your .png or .jpg files to meet the high-resolution requirements for Amazon KDP (and other publishing platforms). Simply upload your low-resolution AI-generated image, select a book size (or let it auto-detect), and ImageMagic will increase the resolution to 300 DPI - making your cover print-ready without any visible quality loss."
        },
        {
          id: "panel16",
          question: "How long does it take to generate my professional manuscript?",
          answer: "After you make your final edits in the PublishJockey system, your manuscript is generated almost instantly. PDF files typically take less than 60 seconds, while EPUB and Word documents are usually ready in under 5 seconds. Unlike other services, PublishJockey lets you immediately view your polished manuscript—so you know exactly what you're getting before you publish."
        },
        {
          id: "panel15",
          question: "Do you offer real-time previews of my book?",
          answer: "Yes! PublishJockey lets you preview your processed Markdown content in real time—either side-by-side with the editor or in a full standalone preview mode. This allows you to quickly see how your writing flows as you work.<br><br>Please note: certain formatting elements like tables, images, centered text, and right-justified content won't appear exactly as they will in the final export. However, rest assured—they'll display correctly in your finalized PDF, EPUB, or Word document."
        },
        {
          id: "panel4",
          question: "Is Publish Jockey compatible with Kindle Direct Publishing (KDP)?",
          answer: "Absolutely. Our export formats are specifically designed to meet KDP requirements. The PDF export is optimized for print publishing, and our EPUB option works seamlessly with KDP's digital publishing platform."
        },
        {
          id: "panel5",
          question: "What export formats are available?",
          answer: "Publish Jockey supports exporting to PDF (print-ready with proper bleed and trim settings), EPUB (for e-readers), and Microsoft Word (.docx) formats. All exports are optimized for their intended platforms and meet industry standards."
        },
        {
          id: "panel14",
          question: "Are there any limitations when exporting to Microsoft Word?",
          answer: "Yes, there are a few minor limitations to keep in mind:<br><br><ul style='padding-left: 20px;'><li>Images and tables will need to be manually centered.</li><li>An extra title page may appear and should be removed.</li><li>The table of contents won't update automatically—you'll need to refresh it within Word.</li><li>You can customize the heading levels as desired to control what appears in the table of contents.</li></ul><br>Keep in mind that Word export is offered as a convenience. Most publishers primarily require a PDF for print and an EPUB for digital distribution, which are the preferred professional formats."
        },
        {
          id: "panel11",
          question: "Why does my finished book look so professional?",
          answer: "Behind the scenes, we use advanced publishing technology—the same approach used by large publishing houses—to ensure your book is formatted to the highest industry standards. You get beautiful results without worrying about the technical side."
        },
        {
          id: "panel12",
          question: "How does Publish Jockey compare to Microsoft Word for book publishing?",
          answer: "While Word is great for writing, it wasn't designed for professional book publishing. Publish Jockey uses advanced typesetting technology that ensures consistent formatting, proper page layouts, and print-ready quality. Our system handles the complex formatting automatically, so you can focus on your content while getting results that match industry standards.<br><br><table style='width:100%; border-collapse: collapse; margin: 15px 0;'><tr style='background-color: #f5f5f5; font-weight: bold;'><th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Feature</th><th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Publish Jockey</th><th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Microsoft Word</th></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Book Formatting</td><td style='border: 1px solid #ddd; padding: 8px;'>Professional, consistent</td><td style='border: 1px solid #ddd; padding: 8px;'>Manual, can be inconsistent</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Print-Ready Output</td><td style='border: 1px solid #ddd; padding: 8px;'>Automatic, optimized</td><td style='border: 1px solid #ddd; padding: 8px;'>Requires manual setup</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Large Document Handling</td><td style='border: 1px solid #ddd; padding: 8px;'>Excellent performance</td><td style='border: 1px solid #ddd; padding: 8px;'>Can slow down or crash</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>KDP Compatibility</td><td style='border: 1px solid #ddd; padding: 8px;'>Built-in optimization</td><td style='border: 1px solid #ddd; padding: 8px;'>Requires conversion</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Consistency</td><td style='border: 1px solid #ddd; padding: 8px;'>Automatic across chapters</td><td style='border: 1px solid #ddd; padding: 8px;'>Manual style management</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Learning Curve</td><td style='border: 1px solid #ddd; padding: 8px;'>Simple, focused on writing</td><td style='border: 1px solid #ddd; padding: 8px;'>Familiar but complex for books</td></tr></table>"
        },
        {
          id: "panel8",
          question: "How are images handled when importing documents?",
          answer: "When importing documents (like Word files), image placeholders will be inserted automatically, but you'll need to manually upload each image using the toolbar. This approach ensures proper image formatting and optimal file size management."
        },
        {
          id: "panel9",
          question: "What if my Word document includes tables?",
          answer: "Tables will be automatically converted to Markdown during the import process. However, we recommend keeping tables relatively small to ensure they display well within the limited space available in book layouts."
        },
        {
          id: "panel10",
          question: "What if I need to create tables from scratch?",
          answer: "You can easily create tables by importing a CSV file into the application. It will be automatically converted into a Markdown-formatted table. For best results, keep your tables compact due to the limited real estate in printed books."
        },
        {
          id: "equation-support",
          question: "Does PublishJockey support mathematical equations?",
          answer: "Yes! PublishJockey offers perfect equation rendering in PDF exports through Word import. Simply write your equations using Microsoft Word's built-in equation editor, then import your document using SplitDoctor. PublishJockey preserves and renders all mathematical notation with professional LaTeX-quality typesetting in your final PDF—no LaTeX coding required.<br><br><strong>Perfect For:</strong><br><ul style='padding-left: 20px;'><li><strong>STEM Textbooks:</strong> Math, physics, chemistry, engineering</li><li><strong>Academic Papers:</strong> Research papers and journal submissions</li><li><strong>Course Materials:</strong> Lecture notes, problem sets, study guides</li><li><strong>Thesis & Dissertations:</strong> Graduate-level academic work</li></ul><br><strong>Note:</strong> Perfect equation rendering is guaranteed in PDF exports. EPUB and DOCX formats may have limited equation support depending on the reader's device."
        },
        {
          id: "panel13",
          question: "Can I use PublishJockey to publish textbooks or academic materials?",
          answer: "Absolutely! PublishJockey already supports key academic features including perfect equation rendering from Word, professional table formatting, image placement, and multi-language support. We're also actively developing enhanced academic publishing features including advanced footnoting, bibliography management, and academic citation styles. Stay tuned for these exciting new capabilities!"
        },
        {
          id: "image-caption",
          question: "How can I insert an image without displaying a caption?",
          answer: "To add an image without a visible caption, simply enter a single space in the caption field when uploading or inserting your image. This will ensure that no caption text appears below the image in your exported book."
        },
        {
          id: "image-resize",
          question: "How do I resize an image in my book?",
          answer: "To resize an image, set the scale factor to a value less than 1 (for example, 0.7 to make it 70% of the original size). The default scale is 1, but this may be too large for some books. You can adjust the scale factor at any time—there's no need to re-import your image. We recommend exporting and reviewing your book to ensure images appear as intended, and adjusting the scale as needed for best print results."
        },
        {
          id: "fancy-title-styles",
          question: "What are the fancy title style options for my book?",
          answer: "Publish Jockey offers 12 publisher-inspired title styles to give your chapters a professional, elegant appearance:<br><br><ul style='padding-left: 20px;'><li><strong>Standard:</strong> Clean, simple chapter headers</li><li><strong>Classic Literature:</strong> Traditional book styling inspired by literary classics</li><li><strong>Modern Minimalist:</strong> Contemporary, clean design</li><li><strong>Academic Press:</strong> Professional academic formatting</li><li><strong>Classical Ornate:</strong> Elegant decorative styling</li><li><strong>Technical Programming:</strong> Clean, code-friendly formatting</li><li><strong>Magazine Style:</strong> Modern publication design</li><li><strong>Luxury Fashion:</strong> Sophisticated, high-end styling</li><li><strong>Small Caps Elegance:</strong> Refined small capitals design</li><li><strong>Decorative Script:</strong> Artistic script-style headers</li><li><strong>Thriller/Noir:</strong> Dark, dramatic styling with bold contrast</li><li><strong>Romance/Soft Literary:</strong> Elegant, flowing design with ornamental details</li></ul><br>These styles automatically format your chapter titles with professional typography, spacing, and design elements that match the aesthetic of major publishing houses."
        },
        {
          id: "drop-caps",
          question: "What are drop caps and which languages support them?",
          answer: "Drop caps are large decorative letters that begin the first paragraph of a chapter, creating an elegant, traditional book appearance. Publish Jockey offers 10 drop cap styles:<br><br><ul style='padding-left: 20px;'><li><strong>None:</strong> Standard paragraph opening</li><li><strong>Traditional:</strong> Classic 3-line large letter design</li><li><strong>Raised:</strong> 2-line elevated letter above the baseline</li><li><strong>Large:</strong> 4-line dramatic bold letter</li><li><strong>Elegant:</strong> 3-line gray letter with small caps</li><li><strong>Bold:</strong> 3-line heavy sans-serif letter</li><li><strong>Decorated:</strong> 3-line bold with border and background</li><li><strong>Ornament:</strong> Illuminated manuscript style with decorative background</li><li><strong>Colorized:</strong> Two-tone blue colored initial</li><li><strong>Boxed:</strong> Magazine style with black rectangle background</li><li><strong>Old-Style:</strong> Vintage baseline-aligned 19th-century style</li></ul><br><strong>Supported Languages:</strong> Drop caps are currently available for English books only. This ensures perfect rendering and compatibility with our advanced publishing system.<br><br>Drop caps add a sophisticated, professional touch that's commonly seen in high-quality published books and literary works."
        }
      ]
    },
    {
      category: "Pricing & Plans",
      icon: <AttachMoneyIcon />,
      questions: [
        {
          id: "pricing-trial",
          question: "What happens after my free trial or free book is complete?",
          answer: "You can choose to upgrade to a paid plan for unlimited exports, or keep your account and work on new projects with limited features. We'll never charge you automatically—upgrade only if you're ready!"
        },
        {
          id: "pricing-flexible",
          question: "Can I pay per book, or do I have to subscribe?",
          answer: "We offer both flexible single-book licenses and subscription options for frequent authors or small publishers. You can purchase individual books as needed, or choose our annual subscription for multiple projects."
        },
        {
          id: "panel7",
          question: "Can I try before I buy?",
          answer: "Yes! Our Free plan lets you try most of Publish Jockey's core features. You can create one book project and export with a watermark to see the quality of our system before upgrading to a paid plan."
        },
        {
          id: "ebook-word-limit",
          question: "Are there any content limits for ebook subscriptions?",
          answer: "Yes, ebook subscription plans have a 10,000-word limit per book to ensure optimal quality and performance. This gives you approximately 40 pages of content—perfect for most ebooks! If you exceed this limit, the export will be disabled until you reduce your content. Print subscription plans have no word limits."
        }
      ]
    },
    {
      category: "Book Ownership & Rights",
      icon: <CopyrightIcon />,
      questions: [
        {
          id: "ownership-rights",
          question: "Who owns the books I create with Publish Jockey?",
          answer: "You always retain 100% rights and ownership of your books and content. We never claim any publishing rights or royalties—everything you create belongs to you."
        }
      ]
    },
    {
      category: "Publishing on Amazon KDP",
      icon: <ShoppingCartIcon />,
      questions: [
        {
          id: "kdp-help",
          question: "Can you help me publish directly to Amazon KDP?",
          answer: "While we provide KDP-ready files, you will need to upload your manuscript and cover to Amazon KDP yourself. We include step-by-step instructions and resources to make the process easy, and our support team is happy to answer questions."
        },
        {
          id: "panel4-kdp",
          question: "Is Publish Jockey compatible with Kindle Direct Publishing (KDP)?",
          answer: "Absolutely. Our export formats are specifically designed to meet KDP requirements. The PDF export is optimized for print publishing, and our EPUB option works seamlessly with KDP's digital publishing platform."
        }
      ]
    },
    {
      category: "Support & Community",
      icon: <PeopleIcon />,
      questions: [
        {
          id: "community-forum",
          question: "Is there a community or forum where I can connect with other authors?",
          answer: "We're building a community of self-publishers and indie authors—watch for links to our Discord/Facebook group soon!"
        }
      ]
    },
    {
      category: "Future Features & Roadmap",
      icon: <TimelineIcon />,
      questions: [
        {
          id: "future-features",
          question: "Are you planning to add more features (e.g., audiobook support, advanced templates, more import/export formats)?",
          answer: "Yes! We're constantly improving based on user feedback. Currently in development: enhanced support for thesis and dissertation formatting with advanced academic features including bibliography management, citation styles, and complex document structures. Share your suggestions with us—your vote matters!"
        }
      ]
    },
    {
      category: "Real Output Samples",
      icon: <PreviewIcon />,
      questions: [
        {
          id: "sample-output",
          question: "Can I see a real book created with Publish Jockey before I sign up?",
          answer: "Absolutely! We have public sample links—see our Amazon book listing or download a free epub sample to check the real output quality."
        }
      ]
    },
    {
      category: "Data & Privacy",
      icon: <SecurityIcon />,
      questions: [
        {
          id: "data-retention",
          question: "How long do you keep my manuscript files?",
          answer: "Your projects are stored as long as your account is active. You can export or delete your content at any time, and request complete data removal for privacy."
        },
        {
          id: "panel6",
          question: "How secure is my manuscript data?",
          answer: "Your manuscript security is our priority. All data is encrypted both in transit and at rest. You maintain complete ownership of your content, and we never share your manuscripts with third parties. The Annual Subscription plan also includes additional backup options."
        }
      ]
    },
    {
      category: "Accessibility & International",
      icon: <PublicIcon />,
      questions: [
        {
          id: "international-use",
          question: "Can I use Publish Jockey if I'm outside the US?",
          answer: "Yes, our platform is global! We support multiple currencies and common book formats accepted by major platforms worldwide."
        },
        {
          id: "language-support",
          question: "What languages does Publish Jockey support?",
          answer: "Publish Jockey supports multiple languages for both the user interface and document export. Here's our current language support:<br><br><strong>Interface Languages (UI):</strong><br>• English (en) - Primary language<br>• Spanish (es) - Español<br>• German (de) - Deutsch<br>• French (fr) - Français<br>• Italian (it) - Italiano<br>• Russian (ru) - Русский<br>• Arabic (ar) - العربية<br>• Hebrew (he) - עברית<br>• Yiddish (yi) - יידיש<br>• Indonesian (id) - Bahasa Indonesia<br>• Hindi (hi) - हिन्दी<br>• Tamil (ta) - தமிழ்<br><br><strong>Document Export Languages:</strong><br>• <strong>Latin-based languages:</strong> English, Spanish, German, French, Italian, Indonesian<br>• <strong>Cyrillic languages:</strong> Russian<br>• <strong>Right-to-Left (RTL) languages:</strong> Arabic, Hebrew, Yiddish<br>• <strong>Devanagari script:</strong> Hindi<br>• <strong>Tamil script:</strong> Tamil<br><br>Each language has optimized font support and proper text direction handling for professional publishing."
        },
        {
          id: "rtl-language-limitations",
          question: "Are there any limitations with Arabic, Hebrew, or Yiddish?",
          answer: "Yes, there are important limitations for Right-to-Left (RTL) languages:<br><br><strong>Pure Language Content:</strong> For best results with Arabic, Hebrew, and Yiddish, we recommend using pure language content only. Mixed content (English text, URLs, email addresses) may not display correctly in the exported PDF.<br><br><strong>Font Selection:</strong> RTL languages use automatically selected fonts optimized for each language. Font selection is limited to ensure proper rendering.<br><br><strong>Text Direction:</strong> These languages are automatically set to right-to-left text direction in exports.<br><br><strong>Recommendation:</strong> If your content includes mixed languages, consider creating separate documents or using Latin-based languages for mixed content."
        },
        {
          id: "font-support",
          question: "What fonts are available for different languages?",
          answer: "Font availability varies by language group. <strong>Note:</strong> Our platform uses professional Linux-based fonts rather than Windows/Mac fonts you might be familiar with. These fonts are specifically chosen for their quality and cross-platform compatibility.<br><br><strong>Latin-based languages (English, Spanish, German, French, Italian, Indonesian):</strong><br>• <strong>Professional Book Fonts:</strong> Latin Modern Roman (high-quality academic typography), Nimbus Roman (similar to Times New Roman)<br>• <strong>Standard Fonts:</strong> Liberation Serif (Linux equivalent of Times New Roman), Liberation Sans (Linux equivalent of Arial), DejaVu Serif, DejaVu Sans<br>• <strong>TeX Fonts:</strong> TeX Gyre Termes, TeX Gyre Pagella, Linux Libertine<br><br><strong>Russian (Cyrillic):</strong><br>• Liberation Serif (Cyrillic), Times New Roman (Cyrillic), DejaVu Serif (Cyrillic)<br><br><strong>Arabic:</strong><br>• Noto Sans Arabic (automatically selected)<br><br><strong>Hebrew:</strong><br>• Noto Sans Hebrew, Noto Serif Hebrew, Noto Rashi Hebrew (automatically selected)<br><br><strong>Yiddish:</strong><br>• Noto Sans Hebrew, Noto Serif Hebrew (automatically selected)<br><br><strong>Hindi (Devanagari):</strong><br>• Noto Sans Devanagari (automatically selected)<br><br><strong>Tamil:</strong><br>• Noto Sans Tamil, Noto Serif Tamil (automatically selected)<br><br><strong>Why Linux Fonts?</strong> Our platform uses professional Linux fonts because they offer excellent quality, are free and open-source, and provide consistent rendering across all devices and platforms. Latin Modern Roman and Nimbus Roman are particularly excellent for book publishing and academic work."
        },
        {
          id: "language-switching",
          question: "How do I change the interface language?",
          answer: "You can change the interface language in two ways:<br><br><strong>From the Navigation Bar:</strong> Look for the language selector in the top navigation bar. Click on it to see all available languages and select your preferred language.<br><br><strong>From Settings:</strong> Go to your account Settings page and find the 'Language & Font Settings' section. Select your preferred interface language from the dropdown menu.<br><br>The language change takes effect immediately and will be remembered for future visits. Note that changing the interface language does not affect the language of your document content."
        },
        {
          id: "book-structure-localization",
          question: "How does language switching affect my book's chapter structure?",
          answer: "Here's how language switching works with your book's chapter structure:<br><br><strong>New Projects:</strong> When you create a new book, the default chapter names (like 'Chapter 1', 'Title Page', etc.) will automatically appear in your selected interface language.<br><br><strong>Existing Projects:</strong> For existing books, the chapter structure is loaded based on the language you had selected when you first accessed the project. If you want the default chapter names to appear in a different language, you should:<br><br>1. <strong>Select your preferred language first</strong> (from the navigation bar or Settings)<br>2. <strong>Then load or create your project</strong><br><br><strong>Language Switching After Loading:</strong> Changing the interface language after a project is loaded will not automatically update existing chapter names. This is by design to preserve any custom chapter names you may have added.<br><br><strong>Custom Chapters:</strong> Any chapters you've added or renamed yourself will always remain unchanged, regardless of language switching. Only the default system chapter names are affected by language selection."
        }
      ]
    },
    {
      category: "IPA Support",
      icon: <CodeIcon />,
      questions: [
        {
          id: "what-is-ipa",
          question: "What is the International Phonetic Alphabet (IPA)?",
          answer: "The International Phonetic Alphabet is a standardized system of phonetic notation that represents the sounds of spoken language. IPA uses specific symbols to transcribe exactly how words are pronounced, regardless of their spelling in any particular language. For example, the English word \"thought\" is transcribed as /θɔːt/, while the German word \"ich\" is /ɪç/."
        },
        {
          id: "who-needs-ipa",
          question: "Who needs IPA support in their publications?",
          answer: "IPA is essential for:<br><br><ul style='padding-left: 20px;'><li><strong>Linguistics researchers</strong> publishing phonetic and phonological studies</li><li><strong>Language teachers and textbook authors</strong> creating pronunciation guides</li><li><strong>Speech-language pathologists</strong> documenting speech patterns and disorders</li><li><strong>Dictionary publishers</strong> providing accurate pronunciation information</li><li><strong>Anthropologists</strong> documenting indigenous languages</li><li><strong>Language learning material creators</strong> developing pronunciation resources</li></ul>"
        },
        {
          id: "ipa-challenges",
          question: "Why is IPA support challenging in digital publishing?",
          answer: "Most publishing platforms struggle with IPA because:<br><br><ul style='padding-left: 20px;'><li>Standard fonts often lack IPA symbols</li><li>Complex diacritics and combining characters render incorrectly</li><li>Export engines can't handle Unicode properly</li><li>Symbols break or display as boxes in final documents</li><li>Font substitution creates inconsistent appearance</li></ul>"
        },
        {
          id: "ipa-pdf-support",
          question: "How does PublishJockey handle IPA in PDF exports?",
          answer: "PublishJockey's PDF engine provides professional-grade IPA support that:<br><br><ul style='padding-left: 20px;'><li><strong>Renders all IPA symbols correctly</strong> with embedded fonts</li><li><strong>Supports complex diacritics</strong> and combining characters</li><li><strong>Maintains consistent appearance</strong> across all devices</li><li><strong>Handles font fallbacks intelligently</strong> when symbols are missing</li><li><strong>Delivers print-ready quality</strong> matching professional linguistic publications</li></ul>"
        },
        {
          id: "ipa-other-formats",
          question: "What about EPUB and DOCX formats?",
          answer: "For EPUB and DOCX exports, IPA symbol display depends on the reader's device and available fonts:<br><br><ul style='padding-left: 20px;'><li><strong>EPUB files</strong> may not display IPA correctly on all e-readers, as device font support varies</li><li><strong>DOCX documents</strong> require recipients to have IPA-compatible fonts installed</li><li><strong>For critical linguistic work</strong> requiring guaranteed IPA display, we recommend PDF export</li></ul><br>PDF remains the gold standard for academic and professional linguistic publishing where precise notation is essential."
        },
        {
          id: "ipa-mixed-scripts",
          question: "Can I mix IPA with other scripts and languages?",
          answer: "Yes, in PDF exports. PublishJockey's multi-script support allows you to seamlessly combine:<br><br><ul style='padding-left: 20px;'><li>IPA notation with standard text</li><li>Multiple writing systems in the same document</li><li>Complex linguistic examples with proper formatting</li><li>Citations and references in various languages</li></ul><br>This is particularly valuable for comparative linguistics research and multilingual language documentation."
        },
        {
          id: "ipa-symbols-supported",
          question: "What IPA symbols and features are supported?",
          answer: "PublishJockey supports the complete IPA character set in PDF exports, including:<br><br><ul style='padding-left: 20px;'><li><strong>All consonant and vowel symbols</strong> (pulmonic and non-pulmonic)</li><li><strong>Diacritics and combining marks</strong> (aspiration, nasalization, tone marks, etc.)</li><li><strong>Suprasegmental notation</strong> (stress marks, length markers, tone letters)</li><li><strong>Special symbols</strong> (word boundaries, syllable breaks, etc.)</li><li><strong>Extensions</strong> for disordered speech and other specialized notation</li></ul>"
        },
        {
          id: "ipa-fonts-required",
          question: "Do I need special fonts or software?",
          answer: "No additional setup required for PDF publishing. PublishJockey:<br><br><ul style='padding-left: 20px;'><li><strong>Includes multiple IPA-compatible fonts</strong> for professional linguistics</li><li><strong>Handles font management automatically</strong></li><li><strong>Works with any device or browser</strong> - no special software needed</li><li><strong>Embeds fonts in PDFs</strong> so symbols display correctly everywhere</li></ul>"
        },
        {
          id: "ipa-fonts-list",
          question: "Which fonts support IPA?",
          answer: "For complete IPA support, we recommend:<br><br><strong>Full IPA Support:</strong><br><ul style='padding-left: 20px;'><li><strong>Charis SIL</strong> - Comprehensive IPA coverage, designed specifically for linguistics</li><li><strong>Linux Libertine O</strong> - Excellent IPA support with professional appearance</li><li><strong>Gentium Plus</strong> - Another SIL font with full IPA character set</li></ul><br><strong>Limited or No IPA Support:</strong><br><ul style='padding-left: 20px;'><li><strong>Latin Modern Roman</strong> - Traditional academic font but lacks many IPA symbols</li><li><strong>TeX Gyre fonts</strong> (Pagella, Termes) - Limited IPA coverage</li><li><strong>Nimbus Roman</strong> - Basic font with minimal IPA support</li></ul><br>Always preview your document to ensure your chosen font displays all required IPA symbols correctly."
        },
        {
          id: "ipa-display-guarantee",
          question: "Will my IPA symbols display correctly for readers?",
          answer: "For PDF exports, yes - guaranteed. When you export to PDF:<br><br><ul style='padding-left: 20px;'><li><strong>Fonts are embedded</strong> so symbols display on any device</li><li><strong>Print quality</strong> matches professional linguistic publications</li><li><strong>Symbols remain sharp</strong> at any zoom level</li><li><strong>Compatible with all PDF readers</strong> and printing systems</li></ul><br>For other formats, display quality depends on the reader's device capabilities."
        },
        {
          id: "ipa-import-documents",
          question: "Can I import existing documents with IPA symbols?",
          answer: "Yes. PublishJockey's BookBuilder AI can:<br><br><ul style='padding-left: 20px;'><li><strong>Import documents</strong> containing IPA notation</li><li><strong>Preserve existing formatting</strong> and symbols during import</li><li><strong>Organize linguistic content</strong> intelligently</li><li><strong>Convert to our system</strong> while maintaining symbol integrity</li></ul><br>This makes it easy to migrate existing research or update previous publications."
        },
        {
          id: "ipa-learning-curve",
          question: "Is there a learning curve for using IPA in PublishJockey?",
          answer: "The platform is designed for linguists by people who understand linguistics:<br><br><ul style='padding-left: 20px;'><li><strong>Familiar workflow</strong> - type IPA as you normally would</li><li><strong>Real-time preview</strong> shows exactly how symbols will appear in the final PDF</li><li><strong>No special codes</strong> or markup required</li><li><strong>Standard keyboard shortcuts</strong> work as expected</li><li><strong>Professional results</strong> without technical complexity</li></ul>"
        },
        {
          id: "ipa-vs-latex",
          question: "How does this compare to LaTeX for linguistic publishing?",
          answer: "While LaTeX offers excellent IPA support, PublishJockey provides:<br><br><ul style='padding-left: 20px;'><li><strong>Faster publishing workflow</strong> - no compilation needed</li><li><strong>Immediate visual feedback</strong> instead of code-compile-preview cycle</li><li><strong>Multi-format output</strong> from single source (with PDF being IPA-optimized)</li><li><strong>Collaborative editing</strong> capabilities</li><li><strong>No technical setup</strong> or package management</li></ul><br>Perfect for researchers who want LaTeX-quality PDF output without the complexity."
        },
        {
          id: "ipa-all-languages",
          question: "Can I use IPA with all 80+ supported languages?",
          answer: "Yes, in PDF exports. IPA notation works seamlessly with all supported languages, allowing you to:<br><br><ul style='padding-left: 20px;'><li><strong>Document pronunciations</strong> in any of the 80+ languages</li><li><strong>Create comparative studies</strong> across language families</li><li><strong>Publish field linguistics</strong> research in indigenous languages</li><li><strong>Maintain consistency</strong> in multilingual publications</li></ul><br>This is particularly valuable for researchers working with understudied or endangered languages."
        },
        {
          id: "ipa-best-format",
          question: "What's the best format for sharing IPA-heavy research?",
          answer: "For professional and academic work requiring precise IPA display, PDF is the recommended format because:<br><br><ul style='padding-left: 20px;'><li><strong>Guaranteed symbol rendering</strong> on all devices</li><li><strong>Print-ready quality</strong> for journal submissions</li><li><strong>Universal compatibility</strong> with academic workflows</li><li><strong>Professional appearance</strong> meeting publication standards</li></ul><br>Other formats can be useful for drafts or broader distribution, but PDF ensures your phonetic notation appears exactly as intended."
        }
      ]
    },
    {
      category: "Account & Security",
      icon: <SettingsIcon />,
      questions: [
        {
          id: "terms-faq",
          question: "What are the Terms and Agreement?",
          answer: "By creating an account with PublishJockey, you agree to the following terms:<br><br><strong>Usage Rights</strong><br>PublishJockey grants you a limited, non-transferable license to use the platform for the purpose of creating, editing, and exporting manuscripts for personal or commercial use, subject to the terms outlined herein.<br><br><strong>Intellectual Property</strong><br>You retain all rights to the content you create or upload. However, by using the platform, you grant PublishJockey the right to process, display, and temporarily store your content for the sole purpose of providing the publishing service.<br><br><strong>Fair Use Policy</strong><br>The platform is designed to support a fair number of manuscript creations and exports per user, particularly for individual authors or small publishers. Users on free or basic plans are expected to operate within reasonable publishing limits.<br><br>Abuse of the system—such as attempting to bypass plan restrictions by repeatedly editing and republishing the same project to create multiple unique books—may result in limitations, account suspension, or removal from the platform.<br><br>We reserve the right to implement automatic and manual safeguards to protect the integrity of our service.<br><br><strong>Account Responsibility</strong><br>You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. If you suspect unauthorized access, you must notify us immediately.<br><br><strong>Service Changes and Availability</strong><br>We reserve the right to modify, pause, or discontinue any part of the platform with or without notice. We will do our best to notify users in advance of any major changes that affect core functionality.<br><br><strong>Data Storage and Privacy</strong><br>We do not store your complete manuscript files. Only your original Markdown input and any uploaded images are retained while your account is active. You may request account deletion and data removal at any time.<br><br><strong>Agreement to Terms</strong><br>By registering or creating an account, you acknowledge that you have read, understood, and agree to be bound by these terms."
        },
        {
          id: "fair-use-notice",
          question: "What is the Fair Use Protection notice?",
          answer: "The Fair Use Protection notice is a system that helps maintain the integrity of our platform. Here's what it means:<br><br><strong>Purpose:</strong> Our AI-powered system monitors book content to ensure compliance with our fair use policy. Each license purchase entitles you to create and publish a single book.<br><br><strong>Book Changes:</strong> Making substantial changes to transform a project into a completely different book will require an additional purchase. This ensures fair usage of the platform across all users.<br><br><strong>Manual Downloads:</strong> For security reasons, files must be manually downloaded by clicking the download button after export.<br><br>You'll see a compact version of this notice in your dashboard to remind you of these policies. This helps us maintain a sustainable platform while protecting the rights of all users."
        },
        {
          id: "language-disclaimer",
          question: "What is the Language Support Disclaimer?",
          answer: "Publish Jockey provides comprehensive language support, but users have important responsibilities:<br><br><strong>Content Responsibility:</strong> You are responsible for ensuring your content is appropriate, accurate, and compliant with all applicable laws and regulations in your target markets.<br><br><strong>RTL Language Limitations:</strong> For Arabic, Hebrew, and Yiddish, we recommend using pure language content only. Mixed content may not render correctly. This limitation is clearly communicated in the export interface.<br><br><strong>Font and Rendering:</strong> While we optimize fonts for each language, final rendering may vary depending on the viewing platform and device. Test your exports thoroughly before publishing.<br><br><strong>Cultural Sensitivity:</strong> Ensure your content respects cultural norms and sensitivities of your target audience. We provide tools but cannot guarantee cultural appropriateness.<br><br><strong>Professional Review:</strong> For important publications, we recommend having your content reviewed by native speakers or professional translators.<br><br><strong>Platform Compatibility:</strong> Different publishing platforms may have varying support for certain languages and fonts. Verify compatibility with your chosen publishing platform.<br><br>By using our language features, you acknowledge these limitations and accept responsibility for your content's appropriateness and accuracy."
        }
      ]
    }
  ];

  // Filter questions based on search term
  const filteredFaqs = searchTerm 
    ? faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqCategories;

  // Count total questions
  const totalQuestions = faqCategories.reduce((sum, cat) => sum + cat.questions.length, 0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.95,
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              Everything you need to know about PublishJockey
            </Typography>
            <Chip
              label={`${totalQuestions} Questions Answered`}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)'
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Breadcrumb */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            <MuiLink component={Link} to="/" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Home
            </MuiLink>
            {' / '}
            <span>FAQ</span>
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 6 }}>
          <TextField
            fullWidth
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
              },
            }}
          />
        </Box>

        {/* FAQ Categories */}
        <Box>
          {filteredFaqs.map((category, catIndex) => (
            <Box key={catIndex} sx={{ mb: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                  gap: 2
                }}
              >
                <Box sx={{ color: 'primary.main' }}>
                  {category.icon}
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#1a1a1a'
                  }}
                >
                  {category.category}
                </Typography>
                <Chip
                  label={category.questions.length}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              {category.questions.map((faq) => (
                <Accordion
                  key={faq.id}
                  expanded={expanded === faq.id}
                  onChange={handleChange(faq.id)}
                  sx={{
                    mb: 2,
                    borderRadius: '12px !important',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      '& .MuiAccordionSummary-content': {
                        my: 2
                      }
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        color: '#2d3748'
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      component="div"
                      sx={{
                        color: '#4a5568',
                        lineHeight: 1.8,
                        '& strong': { fontWeight: 600 },
                        '& ul': { mt: 1, mb: 1 },
                        '& li': { mb: 0.5 }
                      }}
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ))}

          {filteredFaqs.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No questions found matching "{searchTerm}"
              </Typography>
            </Box>
          )}
        </Box>

        {/* Contact Section */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            bgcolor: 'white',
            borderRadius: 3,
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}
        >
          <EmailIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Still Have Questions?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Can't find the answer you're looking for? Please reach out to our support team.
          </Typography>
          <MuiLink
            href="mailto:support@publishjockey.com"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '1.1rem',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            support@publishjockey.com
          </MuiLink>
        </Box>

        {/* About the Author Section */}
        <Box
          sx={{
            mt: 6,
            p: 4,
            bgcolor: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 3,
            border: '1px solid #e0e0e0'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            About the Author
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            Dr. Yancy Dennis is the creator of <strong>PublishJockey.com</strong>, a design-driven publishing platform helping indie authors achieve Big Five quality without Big Five budgets. After spending two years writing a book only to realize Word-to-PDF made it look amateur, he built the tool he wished existed.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;

