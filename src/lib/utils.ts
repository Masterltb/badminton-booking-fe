import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Hàm tiện ích để gộp các class Tailwind lại với nhau, 
 * giải quyết xung đột class và hỗ trợ điều kiện (conditional classes).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
