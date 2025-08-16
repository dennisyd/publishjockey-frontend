import { ExportSettings } from "../components/ExportModal"

import { MarkdownFormatter } from "./MarkdownFormatter"
import { FormatAdapter } from "./FormatAdapter"
import { ValidationService } from "./ValidationService"
import tokenManager from "../utils/tokenManager"

import axios from "axios"

// Define API URL for the export backend

// Use empty string for relative URLs to work with proxy
const API_URL = ''

interface Section {
  id: string
  title: string
  content: string
  level: number
  matter?: string
}

interface Project {
  id: string
  title: string
  /** Optional author for the project */
  author?: string
  /** Optional subtitle for the project */
  subtitle?: string
  sections: Section[]
}

interface ExportFormat {
  format: string
}





/**
 * Service for handling document exports with different formats
 */
export class ExportService {
  /**
   * Escape LaTeX-reserved characters that break section headings.
   * Keep conservative: only escape ampersand per current requirement.
   * Do NOT touch body content to preserve plain text citations.
   */
  private static sanitizeLatexHeading(title?: string): string | undefined {
    if (!title) return title;
    return title.replace(/&/g, "\\&");
  }

  /**
   * Escape ampersands only on markdown heading lines for LaTeX PDF builds.
   */
  private static sanitizeAmpersandInMarkdownHeadings(markdown: string): string {
    const lines = markdown.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      if (/^\s{0,3}#{1,6}\s/.test(lines[i])) {
        lines[i] = lines[i].replace(/&/g, "\\&");
      }
    }
    return lines.join("\n");
  }
  /**
   * Exports a project to the specified format using the provided export settings
   * @param project The project to export
   * @param settings Export settings from the ExportModal
   * @returns Promise resolving to the export result (URL, file data, etc.)
   */
  public static async exportProject(
    project: Project,
    settings: ExportSettings,
  ): Promise<string> {
    console.log("ExportProject called with settings:", settings)

    // Start timing the export process
    const exportFormat = settings.format === "docx" ? "word" : settings.format
    if ((window as any).exportTiming) {
      ;(window as any).exportTiming.startExport(exportFormat, project.title)
    }

    try {
      // Validate that project is not null and has required fields
      if (!project || !project.title) {
        console.error("Invalid project provided to exportProject")
        throw new Error(
          "Invalid project data. Please ensure the project has a title.",
        )
      }

      // Validate that project has sections
      if (
        !project.sections ||
        !Array.isArray(project.sections) ||
        project.sections.length === 0
      ) {
        console.error("Project has no sections to export")
        throw new Error(
          "No content to export. Please add content to at least one section.",
        )
      }

      // Ensure each section has a matter property
      const sectionsWithMatter = project.sections.map((s) => {
        // Determine matter from section ID prefix
        let matter = "main" // Default to main matter
        if (s.id.startsWith("front:")) {
          matter = "front"
        } else if (s.id.startsWith("main:")) {
          matter = "main"
        } else if (s.id.startsWith("back:")) {
          matter = "back"
        }

        return {
          ...s,
          matter,
        }
      })

      console.log(`Processing ${sectionsWithMatter.length} sections for export`)

      if (sectionsWithMatter.length === 0) {
        console.error("No sections to export")
        throw new Error(
          "No content to export. Please add content to at least one section.",
        )
      }

      // Format sections using the centralized MarkdownFormatter
      // This is now the ONLY place where chapter formatting should happen
      const formattedSections = MarkdownFormatter.formatSectionsForExport(
        sectionsWithMatter,
        {
          useChapterPrefix: settings.useChapterPrefix !== false,
          chapterLabelFormat: settings.chapterLabelFormat || "number",
        },
      )

      // Ensure all sections have the required 'level' property
      const sectionsWithLevel = formattedSections.map((s) => ({
        ...s,
        level: 0, // Default level to 0 since this property doesn't exist in the original objects
      }))

      // Validate formatted sections before export
      this.validateSectionsBeforeExport(sectionsWithLevel)

      // Adapt content for the specific export format
      const adaptedSections = sectionsWithLevel.map((section) => ({
        ...section,
        content: FormatAdapter.adaptForExport(section.content, settings.format),
      }))

      // Find the title page section if it exists
      const titlePageSection = this.findTitlePageSection(adaptedSections)

      console.log("Title page found?", titlePageSection ? "YES" : "NO")
      if (titlePageSection) {
        console.log(
          "Using title page content from frontend:",
          titlePageSection.id,
        )
      } else {
        console.log(
          "No title page section found. A simple title page will be used if needed.",
        )
      }

      // Create a simple title page content as fallback if needed - ONLY if no title page exists in frontend
      let fallbackTitlePage: string | undefined = undefined
      if (settings.includeTitlePage && !titlePageSection) {
        fallbackTitlePage = `# ${project.title}\n\n`
        if (project.subtitle) {
          fallbackTitlePage += `## ${project.subtitle}\n\n`
        }
        if (project.author) {
          fallbackTitlePage += `By ${project.author}\n\n`
        }
        console.log("Created fallback title page content")
      }

      // Prepare the new payload with explicit TOC settings
      const exportPayload = {
        sections: adaptedSections.map((s) => {
          // Ensure matter is valid (debug validation)
          if (
            s.matter !== "front" &&
            s.matter !== "main" &&
            s.matter !== "back"
          ) {
            console.warn(
              `Invalid matter type for section ${s.id}, defaulting to 'main'`,
            )
            s.matter = "main"
          }

          // Ensure content exists and is string
          let content = s.content || ""
          if (exportFormat === "pdf") {
            content = ExportService.sanitizeAmpersandInMarkdownHeadings(content)
          }
          if (!content || typeof content !== "string") {
            console.warn(`Empty or invalid content for section ${s.id}`)
          }

          // Only escape special characters in headings for PDF builds
          const sanitizedTitle = exportFormat === "pdf"
            ? ExportService.sanitizeLatexHeading(s.title)
            : s.title;

          return {
            id: s.id,
            title: sanitizedTitle,
            content: content,
            matter: s.matter, // Explicitly set matter property
            isTitlePage:
              s.id === "front:Title Page" ||
              s.title?.toLowerCase() === "title page",
          }
        }),
        exportOptions: {
          ...settings,
          fontFamily: settings.fontFamily, // Ensure fontFamily is always included
          // Turn OFF chapter formatting in the backend since we've already done it here
          useChapterPrefix: false,
          // No automatically generated title page if one exists in the frontend
          includeTitlePage: titlePageSection
            ? true
            : fallbackTitlePage
              ? true
              : false,
          generateTitlePage: false, // NEVER generate a title page in the backend
          forceTitleFirst: titlePageSection ? true : false, // Only force title first if we have a title page
          metadata: {
            title: project.title,
            author: project.author || "Anonymous",
            subtitle: project.subtitle || "", // Ensure subtitle is properly passed
            date: new Date().toISOString().split("T")[0],
          },
          // If title page exists, use its content directly, otherwise use fallback
          titlePageContent: titlePageSection
            ? titlePageSection.content
            : fallbackTitlePage,
          // Use the user's selected TOC level
          includeToc: settings.includeToc,
          tocEnabled: settings.includeToc, // Add this for backend compatibility
          tocDepth: settings.tocDepth ?? 2, // Use the user's selected TOC depth if present
          // Ensure front matter sections flow correctly
          frontMatterContinuous: settings.frontMatterContinuous !== false, // Default to true if not explicitly set
        },
        title: project.title,
        author: project.author || "Anonymous", // Include author in top-level payload
        subtitle: project.subtitle || "", // Include subtitle in top-level payload
      }

      console.log(
        "Sending payload to export backend with TOC depth:",
        exportPayload.exportOptions.tocDepth,
      )

      console.log(
        "Export sections summary:",
        JSON.stringify(
          {
            sectionCount: exportPayload.sections.length,
            sectionSummary: exportPayload.sections.map((s) => ({
              id: s.id,
              title: s.title,
              matter: s.matter,
              contentLength: s.content.length,
            })),
            titlePage: titlePageSection
              ? {
                  exists: true,
                  id: titlePageSection.id,
                  contentLength: titlePageSection.content.length,
                }
              : "none",
          },
          null,
          2,
        ),
      )

      // Choose endpoint based on format
      let endpoint = ""
      switch (settings.format) {
        case "pdf":
          endpoint = "/export/pdf"
          break
        case "epub":
          endpoint = "/export/epub"
          break
        case "html":
          endpoint = "/export/html"
          break
        case "docx":
          endpoint = "/export/docx"
          break
        default:
          throw new Error(`Unsupported export format: ${settings.format}`)
      }

      try {
        console.log(`Making API call to ${API_URL}${endpoint}`)
        const token = tokenManager.getAccessToken()
        
        // Simple debug logs
        console.log('🔍 TOKEN DEBUG - hasToken:', !!token);
        console.log('🔍 TOKEN DEBUG - tokenLength:', token ? token.length : 0);
        console.log('🔍 TOKEN DEBUG - isExpired:', tokenManager.isAccessTokenExpired());
        console.log('🔍 TOKEN DEBUG - tokenPreview:', token ? `${token.substring(0, 20)}...` : 'null');
        
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          "Accept": "application/json"
        };
        
        if (token && !tokenManager.isAccessTokenExpired()) {
          headers["Authorization"] = `Bearer ${token}`;
          console.log('🔍 AUTH HEADER SET:', `Bearer ${token.substring(0, 20)}...`);
        } else {
          console.log('🔍 AUTH HEADER NOT SET - Token missing or expired');
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: "POST",
          headers,
          body: JSON.stringify(exportPayload),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(
            `Export server returned error ${response.status}:`,
            errorText,
          )
          throw new Error(
            `Export server returned error ${response.status}: ${errorText}`,
          )
        }

        console.log("Export server returned success response")

        // Check for the X-No-Download header
        const noDownload = response.headers.get('x-no-download') === 'true';

        // If noDownload flag is set, do not create any URLs
        if (noDownload) {
          console.log('X-No-Download header detected - preventing automatic download');
          // Return an empty string to signal no download should happen
          return '';
        }


        
        // Read the response once as text
        const responseText = await response.text();
        console.log("Response received as text, attempting to parse as JSON");
        
        // Handle the response data regardless of content type
        try {
          // Try to parse as JSON
          const responseData = JSON.parse(responseText);
          
          console.log("Successfully parsed response data", responseData);
          
          // Handle new file ID format (without base64)
          if (responseData.fileId && responseData.mimeType) {
            console.log(
              `Received fileId response for ${exportFormat} (${responseData.mimeType}), fileId: ${responseData.fileId}`,
            )

            // No need to create a placeholder blob - just use the fileId
            if ((window as any).exportTiming) {
              // Create export data package with fileId
              const exportData = {
                blob: null, // No blob needed, we'll use fileId directly
                format: exportFormat,
                fileName: responseData.fileName || `${project.title.replace(/\s+/g, "_").replace(/[^\w-]/g, "")}.${exportFormat === "word" ? "docx" : exportFormat}`,
                fileId: responseData.fileId,
              }

              console.log('Calling finishExportWithBlob with fileId:', responseData.fileId);
              // Pass the data with fileId directly
              ;(window as any).exportTiming.finishExportWithBlob(exportData)
            } else {
              console.error('exportTiming not available on window object');
            }

            // Return empty string to prevent automatic download
            return ""
          }
          
          // Legacy handling for base64Data format (for backward compatibility)
          else if (responseData.base64Data && responseData.mimeType) {
            console.log(
              `Received base64 data response for ${exportFormat} (${responseData.mimeType})`,
            )

            // Convert base64 string to blob
            const binaryString = atob(responseData.base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], {
              type: responseData.mimeType,
            })

            // Generate a unique file ID for server cleanup tracking
            const fileId =
              responseData.fileId || `${project.id || "export"}_${Date.now()}`

            // Finish timing the export process and show the completion dialog with blob
            if ((window as any).exportTiming) {
              // Create export data package
              const exportData = {
                blob,
                format: exportFormat,
                fileName: `${project.title.replace(/\s+/g, "_").replace(/[^\w-]/g, "")}.${exportFormat === "word" ? "docx" : exportFormat}`,
                fileId,
              }

              console.log('Calling finishExportWithBlob with blob and data');
              // Pass the blob and metadata directly
              ;(window as any).exportTiming.finishExportWithBlob(exportData)
            } else {
              console.error('exportTiming not available on window object');
            }

            // Return empty string to prevent automatic download
            return ""
          }
        } catch (jsonError) {
          console.error("Error parsing JSON response:", jsonError);
          
          // Try to treat the responseText as binary data instead
          console.log("Attempting to handle response as binary data");
          
          try {
            // Create a Blob from the responseText as a fallback
            const blob = new Blob([responseText], { type: 'application/octet-stream' });
            
            // Generate a unique file ID for server cleanup tracking
            const fileId = `${project.id || "export"}_${Date.now()}`;
            
            if ((window as any).exportTiming) {
              // Store the blob in memory instead of creating a dataURL
              const exportData = {
                blob,
                format: exportFormat,
                fileName: `${project.title.replace(/\s+/g, "_").replace(/[^\w-]/g, "")}.${exportFormat === "word" ? "docx" : exportFormat}`,
                fileId,
              };
              
              // Pass the blob and metadata directly instead of a dataURL
              (window as any).exportTiming.finishExportWithBlob(exportData);
            }
            
            return "";
          } catch (blobError) {
            console.error("Failed to create blob from response text:", blobError);
            return "";
          }
        }

        // If content type is not JSON or JSON parsing failed, handle as binary
        console.log("Handling response as binary data")

        // We can't read the response body again with response.blob() since we've already read it with response.text()
        // Instead, log an error message and return an empty string
        console.error("Error: Response body already consumed, cannot read as blob");
        return "";
      } catch (error) {
        console.error("Error during API call to export backend:", error)
        throw new Error(
          `Failed to communicate with export server: ${(error as Error).message}`,
        )
      }
    } catch (error) {
      console.error("Error in exportProject method:", error)
      throw error
    }
  }

  /**
   * Validates sections before export to ensure they meet expected formats
   * @param sections The sections to validate
   * @throws Error if validation fails critically
   */
  private static validateSectionsBeforeExport(
    sections: Array<{
      id: string
      title: string
      content: string
      matter: string
    }>,
  ): void {
    // Validate each section
    let criticalError = false
    let validationMessages = []

    sections.forEach((section) => {
      const validation = ValidationService.validateSection(section)
      if (!validation.valid) {
        // Only treat empty content as a critical error
        const criticalIssues = validation.issues.filter(
          (issue) => issue.code === "EMPTY_SECTION",
        )

        if (criticalIssues.length > 0) {
          criticalError = true
        }

        // Collect all validation messages
        validationMessages.push(
          `Section ${section.id}: ${validation.issues.map((i) => i.message).join(", ")}`,
        )
      }
    })

    // Log validation messages
    if (validationMessages.length > 0) {
      console.warn("Validation warnings before export:", validationMessages)
    }

    // Throw error if critical validation failed
    if (criticalError) {
      throw new Error(
        "Export validation failed. Some sections have empty content.",
      )
    }
  }

  /**
   * Prepares document sections from project data
   * @param project The project to convert
   * @returns Array of document sections ready for assembly
   */
  private static prepareDocumentSections(project: Project) {
    // Find existing title page if present
    const existingTitlePage = project.sections.find(
      (s) =>
        s.id === "front:Title Page" || s.title?.toLowerCase() === "title page",
    )

    // Use existing title page if found, otherwise generate one
    const titlePage = existingTitlePage || {
      id: "title-page",
      title: project.title,
      content: MarkdownFormatter.generateTitlePage(
        project.title,
        project.author || "Anonymous",
        project.subtitle,
      ),
      level: 0,
      matter: "front",
    }

    // Ensure we don't duplicate the title page
    const otherSections = existingTitlePage
      ? project.sections.filter((s) => s.id !== existingTitlePage.id)
      : project.sections

    // Convert other sections
    const mainSections = otherSections.map((section) => ({
      id: section.id,
      title: section.title,
      content: section.content,
      type: "mainContent" as const,
      level: section.level,
    }))

    // Return with title page as the first section
    return [
      {
        id: titlePage.id,
        title: titlePage.title,
        content: titlePage.content,
        type: "titlePage" as const,
        level: titlePage.level || 0,
      },
      ...mainSections,
    ]
  }

  /**
   * Find the title page section from the project sections
   * @param sections The project sections
   * @returns The title page section if found, or null
   */
  private static findTitlePageSection(sections: Section[]): Section | null {
    console.log(
      "Searching for title page section among",
      sections.length,
      "sections",
    )

    // Check if sections is empty or not an array
    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      console.warn("No sections provided to findTitlePageSection")
      return null
    }

    // First, try to find section by ID and title in front matter
    const frontTitlePageSection = sections.find(
      (section) =>
        (section.id === "front:Title Page" ||
          section.id.toLowerCase().includes("title page")) &&
        section.matter === "front",
    )

    if (frontTitlePageSection) {
      console.log(
        "Found title page in front matter by ID:",
        frontTitlePageSection.id,
      )
      return frontTitlePageSection
    }

    // If not found by ID, look for any section whose title contains "title page"
    const titlePageByTitle = sections.find(
      (section) =>
        section.title?.toLowerCase() === "title page" ||
        section.title?.toLowerCase().includes("title page"),
    )

    if (titlePageByTitle) {
      console.log("Found title page by title:", titlePageByTitle.id)
      return titlePageByTitle
    }

    // Lastly, check if any content includes a title page heading
    const titlePageByContent = sections.find(
      (section) =>
        section.content?.toLowerCase().includes("# title page") ||
        section.content?.toLowerCase().includes("\\begin{titlepage}"),
    )

    if (titlePageByContent) {
      console.log("Found title page by content:", titlePageByContent.id)
      return titlePageByContent
    }

    console.log("No title page section found")
    return null
  }

  /**
   * Get the file extension for the export format
   * @param format The export format
   * @returns The file extension
   */
  private static getFileExtension(format: ExportFormat): string {
    switch (format.format) {
      case "pdf":
        return "pdf"
      case "epub":
        return "epub"
      case "html":
        return "html"
      default:
        return "txt"
    }
  }

  /**
   * Generates a PDF document
   * @param content Assembled document content
   * @param title Document title
   * @param settings Export settings
   * @returns Promise resolving to the PDF file URL
   */
  private static async generatePdf(
    content: string,
    title: string,
    settings: ExportSettings,
  ): Promise<string> {
    try {
      console.log("Starting PDF export process with settings:", settings)

      // First verify the export backend is accessible
      try {
        const pingResponse = await fetch(`${API_URL}/ping`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!pingResponse.ok) {
          throw new Error(
            `Server responded with status: ${pingResponse.status}`,
          )
        }

        const pingData = await pingResponse.json()
        console.log("Export backend ping response:", pingData)
      } catch (error) {
        console.error("Export backend not accessible:", error)
        throw new Error(
          `Export service is not available. Make sure the export backend is running on port 3002. Error: ${(error as Error).message}`,
        )
      }

      // Prepare the request payload for the export backend
      const exportPayload = {
        content: content,
        title: title,
        format: "pdf",
        bookSize: settings.bookSize || "6x9",
        marginSize: settings.marginSize || "normal",
        customMargins: settings.customMargins || false,
        bleed: settings.bleed || false,
        binding: settings.bindingType || "perfect",
        includeTitlePage: settings.includeTitlePage !== false, // Default to true
        useChapterPrefix: settings.useChapterPrefix !== false, // Default to true
        chapterLabelFormat: settings.chapterLabelFormat || "Chapter %d",
        noSeparatorPages: settings.noSeparatorPages || false,
        frontMatterContinuous: settings.frontMatterContinuous !== false, // Ensure front matter flows continuously
        tocEnabled: settings.includeToc !== false, // Default to true
        tocDepth: 2, // Always use depth 2 for TOC
        numberSections: settings.numberedHeadings || false,
        forceTitleFirst: settings.forceTitleFirst !== false, // Default to true
      }

      console.log("Sending export request to backend:", exportPayload)

      // Make the actual API call to the export backend
      const response = await fetch(`${API_URL}/export/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exportPayload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Export backend error:", response.status, errorText)
        throw new Error(
          `Export server returned error ${response.status}: ${errorText}`,
        )
      }

      // Parse the response which should contain the PDF as base64 data
      const result = await response.json()

      if (!result.dataUrl) {
        throw new Error("Export server did not return expected data format")
      }

      console.log("PDF export completed successfully")

      // Return the data URL from the backend
      return result.dataUrl
    } catch (error) {
      console.error("PDF generation failed:", error)

      // Provide clearer error message for connection issues
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to export service. Please ensure the export backend server is running on port 3002.",
        )
      }

      throw new Error("Failed to generate PDF: " + (error as Error).message)
    }
  }

  /**
   * Applies PDF-specific formatting
   * @param content Document content
   * @param settings Export settings
   * @returns Formatted content ready for PDF generation
   */
  private static applyPdfFormatting(
    content: string,
    settings: ExportSettings,
  ): string {
    // Apply book size settings
    const bookSize = settings.bookSize || "6x9"
    bookSize.split("x").map((dim) => parseFloat(dim))



    // This is a simplified implementation
    // In a real app, these values would be used with a PDF generation library

    return content
  }

  /**
   * Generates an EPUB document
   * @param content Assembled document content
   * @param title Document title
   * @param settings Export settings
   * @returns Promise resolving to the EPUB file URL
   */
  private static async generateEpub(
    content: string,
    title: string,
    settings: ExportSettings,
  ): Promise<string> {
    try {
      console.log("Starting EPUB export process with settings:", settings)

      // First verify the export backend is accessible
      try {
        const pingResponse = await fetch(`${API_URL}/ping`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!pingResponse.ok) {
          throw new Error(
            `Server responded with status: ${pingResponse.status}`,
          )
        }

        const pingData = await pingResponse.json()
        console.log("Export backend ping response:", pingData)
      } catch (error) {
        console.error("Export backend not accessible:", error)
        throw new Error(
          `Export service is not available. Make sure the export backend is running on port 3002. Error: ${(error as Error).message}`,
        )
      }

      // Prepare the request payload for the export backend
      const exportPayload = {
        content: content,
        title: title,
        format: "epub",
        includeTitlePage: settings.includeTitlePage !== false, // Default to true
        useChapterPrefix: settings.useChapterPrefix !== false, // Default to true
        chapterLabelFormat: settings.chapterLabelFormat || "Chapter %d",
        noSeparatorPages: settings.noSeparatorPages || false,
        frontMatterContinuous: settings.frontMatterContinuous !== false, // Ensure front matter flows continuously
        tocEnabled: settings.includeToc !== false, // Default to true
        tocDepth: 2, // Always use depth 2 for TOC
        numberSections: settings.numberedHeadings || false,
        author: settings.author || "Anonymous",
        coverImage: settings.coverImage || null,
      }

      console.log("Sending export request to backend:", exportPayload)

      // Make the actual API call to the export backend
      const response = await fetch(`${API_URL}/export/epub`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exportPayload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Export backend error:", response.status, errorText)
        throw new Error(
          `Export server returned error ${response.status}: ${errorText}`,
        )
      }

      // Parse the response which should contain the EPUB as base64 data
      const result = await response.json()

      if (!result.dataUrl) {
        throw new Error("Export server did not return expected data format")
      }

      console.log("EPUB export completed successfully")

      // Return the data URL from the backend
      return result.dataUrl
    } catch (error) {
      console.error("EPUB generation failed:", error)

      // Provide clearer error message for connection issues
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to export service. Please ensure the export backend server is running on port 3002.",
        )
      }

      throw new Error("Failed to generate EPUB: " + (error as Error).message)
    }
  }

  /**
   * Generates a DOCX document
   * @param content Assembled document content
   * @param title Document title
   * @param settings Export settings
   * @returns Promise resolving to the DOCX file URL
   */
  private static async generateDocx(
    content: string,
    title: string,
    settings: ExportSettings,
  ): Promise<string> {
    try {
      console.log("Starting DOCX export process with settings:", settings)

      // First verify the export backend is accessible
      try {
        const pingResponse = await fetch(`${API_URL}/ping`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!pingResponse.ok) {
          throw new Error(
            `Server responded with status: ${pingResponse.status}`,
          )
        }

        const pingData = await pingResponse.json()
        console.log("Export backend ping response:", pingData)
      } catch (error) {
        console.error("Export backend not accessible:", error)
        throw new Error(
          `Export service is not available. Make sure the export backend is running on port 3002. Error: ${(error as Error).message}`,
        )
      }

      // Prepare the request payload for the export backend
      const exportPayload = {
        content: content,
        title: title,
        format: "docx",
        includeTitlePage: settings.includeTitlePage !== false, // Default to true
        useChapterPrefix: settings.useChapterPrefix !== false, // Default to true
        chapterLabelFormat: settings.chapterLabelFormat || "Chapter %d",
        noSeparatorPages: settings.noSeparatorPages || false,
        tocEnabled: settings.includeToc !== false, // Default to true
        tocDepth: 2, // Always use depth 2 for TOC
        numberSections: settings.numberedHeadings || false,
        forceTitleFirst: settings.forceTitleFirst !== false, // Default to true
      }

      console.log("Sending export request to backend:", exportPayload)

      // Make the actual API call to the export backend
      const response = await fetch(`${API_URL}/export/docx`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exportPayload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Export backend error:", response.status, errorText)
        throw new Error(
          `Export server returned error ${response.status}: ${errorText}`,
        )
      }

      // Parse the response which should contain the DOCX as base64 data
      const result = await response.json()

      if (!result.dataUrl) {
        throw new Error("Export server did not return expected data format")
      }

      console.log("DOCX export completed successfully")

      // Return the data URL from the backend
      return result.dataUrl
    } catch (error) {
      console.error("DOCX generation failed:", error)

      // Provide clearer error message for connection issues
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to export service. Please ensure the export backend server is running on port 3002.",
        )
      }

      throw new Error("Failed to generate DOCX: " + (error as Error).message)
    }
  }

  /**
   * Generates an HTML document
   * @param content Assembled document content
   * @param title Document title
   * @param settings Export settings
   * @returns Promise resolving to the HTML file URL
   */
  private static async generateHtml(
    content: string,
    title: string,
    settings: ExportSettings,
  ): Promise<string> {
    try {
      console.log("Starting HTML export process with settings:", settings)

      // First verify the export backend is accessible
      try {
        const pingResponse = await fetch(`${API_URL}/ping`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!pingResponse.ok) {
          throw new Error(
            `Server responded with status: ${pingResponse.status}`,
          )
        }

        const pingData = await pingResponse.json()
        console.log("Export backend ping response:", pingData)
      } catch (error) {
        console.error("Export backend not accessible:", error)
        throw new Error(
          `Export service is not available. Make sure the export backend is running on port 3002. Error: ${(error as Error).message}`,
        )
      }

      // Prepare the request payload for the export backend
      const exportPayload = {
        content: content,
        title: title,
        format: "html",
        includeTitlePage: settings.includeTitlePage !== false, // Default to true
        useChapterPrefix: settings.useChapterPrefix !== false, // Default to true
        chapterLabelFormat: settings.chapterLabelFormat || "Chapter %d",
        noSeparatorPages: settings.noSeparatorPages || false,
        frontMatterContinuous: settings.frontMatterContinuous !== false, // Ensure front matter flows continuously
        tocEnabled: settings.includeToc !== false, // Default to true
        tocDepth: 2, // Always use depth 2 for TOC
        numberSections: settings.numberedHeadings || false,
        forceTitleFirst: settings.forceTitleFirst !== false, // Default to true
        stylesheet: settings.htmlStylesheet || "default",
      }

      console.log("Sending export request to backend:", exportPayload)

      // Make the actual API call to the export backend
      const response = await fetch(`${API_URL}/export/html`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exportPayload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Export backend error:", response.status, errorText)
        throw new Error(
          `Export server returned error ${response.status}: ${errorText}`,
        )
      }

      // Parse the response which should contain the HTML as text or base64 data
      const result = await response.json()

      if (!result.dataUrl) {
        throw new Error("Export server did not return expected data format")
      }

      console.log("HTML export completed successfully")

      // Return the data URL from the backend
      return result.dataUrl
    } catch (error) {
      console.error("HTML generation failed:", error)

      // Provide clearer error message for connection issues
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to export service. Please ensure the export backend server is running on port 3002.",
        )
      }

      throw new Error("Failed to generate HTML: " + (error as Error).message)
    }
  }

  /**
   * Updates the content of a project by ID (for debugging/manual save)
   * @param projectId The project ID
   * @param content The content object to save
   * @param token The authentication token
   * @returns Promise resolving to the updated project
   */
  public static async updateProjectContent(
    projectId: string,
    content: Record<string, string>,
    token?: string,
  ): Promise<any> {
    console.log("Manual content update:", {
      projectId,
      contentKeys: Object.keys(content),
      contentSize: Object.keys(content).length,
    })

    // Use provided token or fallback to localStorage as a last resort
    const authToken = token || localStorage.getItem("token")
    if (!authToken) {
      console.error("No auth token provided or found in localStorage!")
      return { error: "No auth token" }
    }

    try {
      const res = await axios.put(
        `${API_URL}/api/projects/${projectId}`,
        { content },
        { headers: { Authorization: `Bearer ${authToken}` } },
      )
      console.log("Manual update successful:", res.data)
      return res.data
    } catch (err) {
      console.error("Manual update failed:", err)
      return { error: err }
    }
  }

  /**
   * Test method to manually save a sample content object
   * @param projectId The project ID to update
   * @param token The authentication token
   */
  public static async testContentSave(
    projectId: string,
    token?: string,
  ): Promise<any> {
    const testContent = {
      "front:Title Page": "# Test Title\n\nBy Test Author",
      "main:Chapter 1":
        "## This is a test chapter\n\nJust testing content saving.",
    }

    return this.updateProjectContent(projectId, testContent, token)
  }
}
