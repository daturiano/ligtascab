import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFormattedDate(): string {
  return new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateTime(timestamp: string): string {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options);
}

type variant = "long" | "short" | "narrow" | "numeric" | "2-digit" | undefined;

export function formatDate(dateString: string, variant?: variant): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: variant ? variant : "short",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}

export const convertImageToJPG = (
  file: File,
  quality = 0.9,
): Promise<File | null> => {
  return new Promise((resolve, reject) => {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Create an image element
    const img = new Image();

    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on canvas
      ctx.drawImage(img, 0, 0);

      // Convert to blob as JPG
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create a new File object with JPG extension
            const convertedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, ".jpg"),
              { type: "image/jpeg" },
            );
            resolve(convertedFile);
          } else {
            reject(new Error("Failed to convert image"));
          }
        },
        "image/jpeg",
        quality, // Quality from 0.0 to 1.0
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));

    // Load the image
    img.src = URL.createObjectURL(file);
  });
};

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Something went wrong";
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function isPastDue(date: Date): boolean {
  const targetDate = new Date(date);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  return targetDate < today;
}
