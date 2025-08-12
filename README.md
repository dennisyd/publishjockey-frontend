## Environment Variables

Create a `.env` file with:

```
REACT_APP_API_URL=https://publishjockey-backend.onrender.com/api
REACT_APP_EXPORT_API_URL=https://publishjockey-export.onrender.com
REACT_APP_EXPORT_PLATFORM=server
```
# PublishJockey Frontend

This is the frontend React application for PublishJockey, a book publishing platform. It provides a modern, interactive UI for creating, editing, importing, and exporting book projects.

## Features

- **Project Workspace**: Organize your book into front, main, and back matter sections.
- **Rich Markdown Editor**: Write and format content with live preview, split view, and formatting toolbar.
- **Import/Export**:
  - Import `.md`, `.docx`, `.txt`, or Google Docs files.
  - Export to PDF, EPUB, DOCX, or HTML (via export-backend).
- **Metadata Management**: Edit and autosave book title, author, subtitle, and ISBN.
- **Section Management**: Add, rename, delete, and reorder sections.
- **Autosave**: All content and metadata are autosaved to the backend.
- **Image Upload**: Upload and insert images into your book.
- **Notifications**: User-friendly feedback for all actions.
- **Responsive UI**: Built with Material-UI for a clean, modern look.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Frontend

```bash
npm start
```

The app will run on http://localhost:3000 by default.

### 3. Backend Requirements

The frontend expects two backend services:
- **Main backend**: (API, auth, project management) on http://localhost:3001
- **Export backend**: (import/export, PDF/EPUB/DOCX) on http://localhost:3002

Make sure both are running for full functionality.

## Environment Variables

You can configure API endpoints using environment variables:
- `REACT_APP_API_URL` – Main backend (default: http://localhost:3001)
- `REACT_APP_EXPORT_API_URL` – Export backend (default: http://localhost:3002)

Create a `.env` file in apps/frontend if you want to override defaults.

## Project Structure

- `src/components/ProjectWorkspace.tsx` – Main workspace UI and logic
- `src/components/ImportModal.tsx` – Import dialog and logic
- `src/components/ExportModal.tsx` – Export dialog and logic
- `src/services/ExportService.ts` – Handles export requests
- `src/auth/AuthContext.tsx` – Authentication context
- `src/pages/` – Top-level pages (Dashboard, Project, etc.)

## Key Scripts

- `npm start` – Start the development server
- `npm run build` – Build for production
- `npm test` – Run tests

## Development Notes

### Import/Export:
- Import requests go to http://localhost:3002/import.
- Export requests go to http://localhost:3002/export/pdf, /export/epub, etc.

### Autosave:
- All content and metadata changes are autosaved to the backend.

### Image Upload:
- Images are uploaded to the export backend (`/api/uploads` on port 3002).

## Troubleshooting

### Import/Export Fails:
- Ensure the export backend is running on port 3002.
- Check CORS settings if accessing from a different host.

### Metadata Not Saving:
- Make sure the backend project schema includes author, subtitle, and isbn.

### Session Issues:
- If you see 401 errors, log in again to refresh your session.

## FAQ

### Images & Media

**Q: How can I insert an image without displaying a caption?**  
**A:** To add an image without a visible caption, simply enter a single space in the caption field when uploading or inserting your image. This will ensure that no caption text appears below the image in your exported book.

## License

MIT

## Contact

For support or questions, open an issue or contact the maintainer.