import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkImageUrl = (imageUrl: string | undefined | null): string => {
  const placeholder = "/images/white-image.png";
  if (!imageUrl) {
    return placeholder;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }
  
  return placeholder;
}