/**
 * Utility functions for handling image URLs
 */

/**
 * Get the base URL from environment variables
 */
export const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://brihub.progesio.my.id';
};

/**
 * Format image URL to ensure it has the correct base URL
 * @param imagePath - The image path that may or may not include the full URL
 * @returns Formatted image URL with proper base URL
 */
export const formatImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // If the image path already starts with http:// or https://, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const baseUrl = getBaseUrl();
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // If the path doesn't start with 'storage/', add it
  const storagePath = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;
  
  return `${baseUrl}/${storagePath}`;
};

/**
 * Format multiple image URLs
 * @param imagePaths - Array of image paths
 * @returns Array of formatted image URLs
 */
export const formatImageUrls = (imagePaths: string[]): string[] => {
  return imagePaths.map(formatImageUrl);
};

/**
 * Parse JSON string of image paths and format them
 * @param imageListJson - JSON string containing array of image paths
 * @returns Array of formatted image URLs
 */
export const parseAndFormatImageList = (imageListJson: string): string[] => {
  try {
    const imagePaths = JSON.parse(imageListJson);
    if (Array.isArray(imagePaths)) {
      return formatImageUrls(imagePaths);
    }
    return [];
  } catch (error) {
    console.error('Error parsing image list JSON:', error);
    return [];
  }
};
