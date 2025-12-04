// Server-side only file for PDF/DOCX processing
import PDFParser from "pdf2json";
import mammoth from "mammoth";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface FileExtractionResult {
  success: boolean;
  text?: string;
  error?: string;
  fileName: string;
  fileSize: number;
}

// Validate file type
export function validateFileType(file: File): boolean {
  const validTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  const validExtensions = [".pdf", ".docx", ".txt"];

  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );

  return hasValidType || hasValidExtension;
}

// Validate file size
export function validateFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

// Extract text from PDF using pdf2json
async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      console.log("=== PDF EXTRACTION START ===");
      console.log("Buffer size:", buffer.byteLength);
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("❌ PDF parsing error:", errData.parserError);
        reject(new Error("Failed to extract text from PDF"));
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        try {
          console.log("✅ PDF parsed successfully");
          console.log("Number of pages:", pdfData.Pages?.length || 0);

          // Extract text from all pages
          let text = "";
          if (pdfData.Pages) {
            for (let i = 0; i < pdfData.Pages.length; i++) {
              const page = pdfData.Pages[i];
              console.log(`Processing page ${i + 1}...`);
              if (page.Texts) {
                for (const textItem of page.Texts) {
                  if (textItem.R) {
                    for (const r of textItem.R) {
                      if (r.T) {
                        text += decodeURIComponent(r.T) + " ";
                      }
                    }
                  }
                }
              }
              text += "\n";
            }
          }

          console.log("=== PDF EXTRACTION COMPLETE ===");
          console.log("Total text length:", text.length);
          console.log("Text preview:", text.substring(0, 500));
          console.log("Full extracted text:", text.trim());
          console.log("===============================");

          resolve(text.trim());
        } catch (error) {
          console.error("❌ PDF text extraction error:", error);
          reject(new Error("Failed to process PDF content"));
        }
      });

      // Parse the buffer
      console.log("Parsing PDF buffer...");
      const uint8Array = new Uint8Array(buffer);
      pdfParser.parseBuffer(Buffer.from(uint8Array));
    } catch (error) {
      console.error("❌ PDF extraction error:", error);
      reject(new Error("Failed to extract text from PDF"));
    }
  });
}

// Extract text from DOCX
async function extractDocxText(buffer: ArrayBuffer): Promise<string> {
  try {
    console.log("=== DOCX EXTRACTION START ===");
    console.log("Buffer size:", buffer.byteLength);

    const result = await mammoth.extractRawText({ arrayBuffer: buffer });

    console.log("=== DOCX EXTRACTION COMPLETE ===");
    console.log("Text length:", result.value.length);
    console.log("Text preview:", result.value.substring(0, 500));
    console.log("Full extracted text:", result.value);
    console.log("================================");

    return result.value;
  } catch (error) {
    console.error("❌ DOCX extraction error:", error);
    throw new Error("Failed to extract text from DOCX");
  }
}

// Extract text from TXT
async function extractTxtText(buffer: ArrayBuffer): Promise<string> {
  try {
    console.log("=== TXT EXTRACTION START ===");
    console.log("Buffer size:", buffer.byteLength);

    const decoder = new TextDecoder("utf-8");
    const text = decoder.decode(buffer);

    console.log("=== TXT EXTRACTION COMPLETE ===");
    console.log("Text length:", text.length);
    console.log("Text preview:", text.substring(0, 500));
    console.log("Full extracted text:", text);
    console.log("===============================");

    return text;
  } catch (error) {
    console.error("❌ TXT extraction error:", error);
    throw new Error("Failed to extract text from TXT");
  }
}

// Main extraction function
export async function extractTextFromFile(
  file: File
): Promise<FileExtractionResult> {
  console.log("=== extractTextFromFile() CALLED ===");
  console.log("File name:", file.name);
  console.log("File size:", file.size);
  console.log("File type:", file.type);
  console.log("===================================");

  const result: FileExtractionResult = {
    success: false,
    fileName: file.name,
    fileSize: file.size,
  };

  // Validate file type
  console.log("Validating file type...");
  if (!validateFileType(file)) {
    console.error("❌ Invalid file type");
    result.error = "Invalid file type. Please upload PDF, DOCX, or TXT files.";
    return result;
  }
  console.log("✅ File type valid");

  // Validate file size
  console.log("Validating file size...");
  if (!validateFileSize(file)) {
    console.error("❌ File size too large");
    result.error = `File size exceeds maximum limit of ${
      MAX_FILE_SIZE / 1024 / 1024
    }MB.`;
    return result;
  }
  console.log("✅ File size valid");

  try {
    console.log("Reading file buffer...");
    const buffer = await file.arrayBuffer();
    console.log("✅ Buffer read successfully, size:", buffer.byteLength);

    let text: string;

    if (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    ) {
      console.log("📄 Detected PDF file, extracting...");
      text = await extractPdfText(buffer);
    } else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx")
    ) {
      console.log("📝 Detected DOCX file, extracting...");
      text = await extractDocxText(buffer);
    } else if (
      file.type === "text/plain" ||
      file.name.toLowerCase().endsWith(".txt")
    ) {
      console.log("📃 Detected TXT file, extracting...");
      text = await extractTxtText(buffer);
    } else {
      console.error("❌ Unsupported file format");
      result.error = "Unsupported file format";
      return result;
    }

    // Validate extracted text
    console.log("Validating extracted text...");
    if (!text || text.trim().length === 0) {
      console.error("❌ No text content found");
      result.error = "No text content found in the file";
      return result;
    }
    console.log("✅ Text extracted successfully, length:", text.trim().length);

    result.success = true;
    result.text = text.trim();

    console.log("=== EXTRACTION RESULT ===");
    console.log("Success:", result.success);
    console.log("Text length:", result.text.length);
    console.log("========================");

    return result;
  } catch (error) {
    console.error("=== FILE EXTRACTION ERROR ===");
    console.error("Error:", error);
    console.error(
      "Error type:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error("=============================");

    result.error =
      error instanceof Error
        ? error.message
        : "Failed to extract text from file";
    return result;
  }
}
