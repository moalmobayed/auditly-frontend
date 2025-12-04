// Client-safe validation functions
// This file can be imported by both client and server components

// Validate contract text
export function validateContractText(text: string): {
  valid: boolean;
  error?: string;
} {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: "Contract text cannot be empty" };
  }

  if (text.trim().length < 100) {
    return {
      valid: false,
      error: "Contract text is too short. Please provide a complete contract.",
    };
  }

  if (text.length > 500000) {
    return {
      valid: false,
      error:
        "Contract text is too long. Please provide a contract under 500,000 characters.",
    };
  }

  return { valid: true };
}

