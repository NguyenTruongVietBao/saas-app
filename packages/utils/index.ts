export const formatDate = (date: Date) => date.toISOString();

/**
 * Converts a string to a URL-friendly slug.
 * Handles Vietnamese characters and special symbols.
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Separate base characters from accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '') // Remove non-alphanumeric
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Remove consecutive -
    .trim();
};
