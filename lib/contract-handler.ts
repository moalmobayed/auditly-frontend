import pdfParse from "pdf-parse";
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
  const hasValidExtension = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  return hasValidType || hasValidExtension;
}

// Validate file size
export function validateFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

// Extract text from PDF
async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  try {
    const data = await pdfParse(Buffer.from(buffer));
    return data.text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

// Extract text from DOCX
async function extractDocxText(buffer: ArrayBuffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value;
  } catch (error) {
    console.error("DOCX extraction error:", error);
    throw new Error("Failed to extract text from DOCX");
  }
}

// Extract text from TXT
async function extractTxtText(buffer: ArrayBuffer): Promise<string> {
  try {
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(buffer);
  } catch (error) {
    console.error("TXT extraction error:", error);
    throw new Error("Failed to extract text from TXT");
  }
}

// Main extraction function
export async function extractTextFromFile(file: File): Promise<FileExtractionResult> {
  const result: FileExtractionResult = {
    success: false,
    fileName: file.name,
    fileSize: file.size,
  };

  // Validate file type
  if (!validateFileType(file)) {
    result.error = "Invalid file type. Please upload PDF, DOCX, or TXT files.";
    return result;
  }

  // Validate file size
  if (!validateFileSize(file)) {
    result.error = `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB.`;
    return result;
  }

  try {
    const buffer = await file.arrayBuffer();
    let text: string;

    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      text = await extractPdfText(buffer);
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx")
    ) {
      text = await extractDocxText(buffer);
    } else if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
      text = await extractTxtText(buffer);
    } else {
      result.error = "Unsupported file format";
      return result;
    }

    // Validate extracted text
    if (!text || text.trim().length === 0) {
      result.error = "No text content found in the file";
      return result;
    }

    result.success = true;
    result.text = text.trim();
    return result;
  } catch (error) {
    console.error("File extraction error:", error);
    result.error = error instanceof Error ? error.message : "Failed to extract text from file";
    return result;
  }
}

// Validate contract text
export function validateContractText(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: "Contract text cannot be empty" };
  }

  if (text.trim().length < 100) {
    return { valid: false, error: "Contract text is too short. Please provide a complete contract." };
  }

  if (text.length > 500000) {
    return { valid: false, error: "Contract text is too long. Please provide a contract under 500,000 characters." };
  }

  return { valid: true };
}
