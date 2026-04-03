import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeOptionalEmail(email: string | null | undefined) {
  const input = email?.trim();
  return input ? normalizeEmail(input) : null;
}

export function normalizeOptionalUrl(value: string | null | undefined) {
  const input = value?.trim();

  if (!input) {
    return null;
  }

  const withProtocol =
    input.startsWith("http://") || input.startsWith("https://")
      ? input
      : `https://${input}`;

  try {
    const url = new URL(withProtocol);
    return url.toString();
  } catch {
    return null;
  }
}

export function formatOptionalText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function normalizeComparableText(value: string | null | undefined) {
  return value?.trim().toLowerCase().replace(/\s+/g, " ") ?? "";
}

export function normalizePhone(value: string | null | undefined) {
  const digits = value?.replace(/\D+/g, "") ?? "";
  return digits.length >= 6 ? digits : null;
}

export function parseStringArray(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function stringifyStringArray(values: string[]) {
  return JSON.stringify(values);
}

export function truncate(value: string, length: number) {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}

export function countWords(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
