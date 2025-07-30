export function sanitizeFilename(filename: string): string {
  return filename
    .normalize('NFKD') // decompose unicode
    .replace(/[^\w.\-() ]+/g, '') // remove unsafe characters
    .replace(/\s+/g, '_'); // replace whitespace with underscores
}
