/**
 * Utility to sanitize user-facing text strings.
 * Replaces ampersands ('&' or '&amp;') with the proper word 'and'
 * to avoid ornate cursive glyphs in serif fonts.
 */
export function formatCleanText(text: string | null | undefined): string {
    if (!text) return '';
    return text
        .replace(/&amp;/gi, 'and')
        .replace(/\s*&\s*/g, ' and ')
        .replace(/\s{2,}/g, ' ')
        .trim();
}
