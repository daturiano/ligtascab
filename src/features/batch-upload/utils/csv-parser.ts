/**
 * CSV Parser Utilities
 * Handles parsing CSV text into typed objects with validation
 */

export type ParsedRow = Record<string, string>;

export interface CSVParseResult {
  headers: string[];
  rows: ParsedRow[];
  errors: string[];
}

/**
 * Parse CSV text into array of objects
 * Handles quoted fields, commas within quotes, BOM, and various line endings
 */
export function parseCSV(text: string): CSVParseResult {
  const errors: string[] = [];

  // Remove BOM (Byte Order Mark) if present - common in Excel exports
  const cleanedText = text.replace(/^\uFEFF/, "");

  const lines = cleanedText.split(/\r?\n/).filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return { headers: [], rows: [], errors: ["CSV file is empty"] };
  }

  // Normalize headers: lowercase, remove quotes, replace spaces/hyphens with underscores
  const headers = parseCSVLine(lines[0]).map((h) =>
    h
      .trim()
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[\s-]+/g, "_")
  );

  if (headers.length === 0) {
    return { headers: [], rows: [], errors: ["No headers found in CSV"] };
  }

  const rows: ParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    if (values.length !== headers.length) {
      errors.push(
        `Row ${i + 1}: Expected ${headers.length} columns, got ${values.length}`
      );
      continue;
    }

    const row: ParsedRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index].trim();
    });
    rows.push(row);
  }

  return { headers, rows, errors };
}

/**
 * Parse a single CSV line, handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && !inQuotes) {
      inQuotes = true;
    } else if (char === '"' && inQuotes) {
      if (nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = false;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Parse date string in various formats to Date object
 * Supports: YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString || dateString.trim() === "") {
    return null;
  }

  const trimmed = dateString.trim();

  // Try YYYY-MM-DD format (ISO)
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const date = new Date(
      parseInt(isoMatch[1]),
      parseInt(isoMatch[2]) - 1,
      parseInt(isoMatch[3])
    );
    if (!isNaN(date.getTime())) return date;
  }

  // Try MM/DD/YYYY format
  const mdyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdyMatch) {
    const date = new Date(
      parseInt(mdyMatch[3]),
      parseInt(mdyMatch[1]) - 1,
      parseInt(mdyMatch[2])
    );
    if (!isNaN(date.getTime())) return date;
  }

  // Try to parse as generic date string
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  return null;
}

/**
 * Normalize phone number to +63 format
 */
export function normalizePhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  // If starts with 63 and is 12 digits, add +
  if (cleaned.startsWith("63") && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  // If starts with 0 and is 11 digits (PH format), convert to +63
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return `+63${cleaned.substring(1)}`;
  }

  // If 10 digits (without leading 0), add +63
  if (cleaned.length === 10 && !cleaned.startsWith("0")) {
    return `+63${cleaned}`;
  }

  // Return as-is if already formatted
  if (phone.startsWith("+63") && phone.length === 13) {
    return phone;
  }

  return phone;
}
