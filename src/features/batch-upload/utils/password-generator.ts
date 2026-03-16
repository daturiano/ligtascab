/**
 * Password Generator Utility
 * Generates temporary passwords for batch-created driver accounts
 */

// Exclude ambiguous characters: 0, O, l, 1, I
const ALPHANUMERIC_CHARS =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

/**
 * Generate a random temporary password
 * @param length Password length (default: 8)
 * @returns Random alphanumeric password
 */
export function generateTempPassword(length: number = 8): string {
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * ALPHANUMERIC_CHARS.length);
    password += ALPHANUMERIC_CHARS[randomIndex];
  }

  return password;
}

/**
 * Generate multiple unique passwords
 * @param count Number of passwords to generate
 * @param length Password length
 * @returns Array of unique passwords
 */
export function generateMultiplePasswords(
  count: number,
  length: number = 8
): string[] {
  const passwords = new Set<string>();

  while (passwords.size < count) {
    passwords.add(generateTempPassword(length));
  }

  return Array.from(passwords);
}
