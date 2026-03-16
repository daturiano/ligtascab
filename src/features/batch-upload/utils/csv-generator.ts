/**
 * CSV Generator Utilities
 * Generates downloadable CSV files for credentials and templates
 */

export interface DriverCredential {
  first_name: string;
  last_name: string;
  phone_number: string;
  temp_password: string;
  license_number: string;
}

/**
 * Generate CSV content for driver credentials
 */
export function generateCredentialsCSV(drivers: DriverCredential[]): string {
  const headers = [
    "First Name",
    "Last Name",
    "Phone Number",
    "Temporary Password",
    "License Number",
  ];

  const rows = drivers.map((driver) => [
    escapeCSVField(driver.first_name),
    escapeCSVField(driver.last_name),
    escapeCSVField(driver.phone_number),
    escapeCSVField(driver.temp_password),
    escapeCSVField(driver.license_number),
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

/**
 * Escape a field for CSV format
 */
function escapeCSVField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Trigger browser download of CSV content
 */
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Format current date for filename
 */
export function getDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
