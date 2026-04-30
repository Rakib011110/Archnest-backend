/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOCALIZATION (i18n) TYPES - CADDCORE E-commerce
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Production-ready i18n configuration for Bangladesh market.
 * Supports: English (en) and Bengali (bn)
 */

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORTED LOCALES
// ─────────────────────────────────────────────────────────────────────────────

export const SUPPORTED_LOCALES = ['en', 'bn'] as const;
export type TLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: TLocale = 'en';
export const FALLBACK_LOCALE: TLocale = 'en';

// ─────────────────────────────────────────────────────────────────────────────
// LOCALIZED STRING TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Localized string - English required, Bengali optional
 * @example { en: "Electronics", bn: "ইলেকট্রনিক্স" }
 */
export interface TLocalizedString {
  en: string;    // English (required)
  bn?: string;   // বাংলা (optional)
}

/**
 * Optional localized string - both optional
 * Used for fields like description, metaTitle where both can be empty
 */
export interface TLocalizedStringOptional {
  en?: string;
  bn?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MONGOOSE SCHEMA HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Schema for required localized string (name, title)
 */
export const LocalizedStringSchema = {
  en: { type: String, required: true, trim: true },
  bn: { type: String, trim: true },
};

/**
 * Schema for optional localized string (description, meta)
 */
export const LocalizedStringOptionalSchema = {
  en: { type: String, trim: true },
  bn: { type: String, trim: true },
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get localized value with fallback to English
 * @param obj - Localized string object
 * @param locale - Target locale ('en' | 'bn')
 * @returns The localized string or empty string
 */
export const getLocalizedValue = (
  obj: TLocalizedString | TLocalizedStringOptional | undefined | null,
  locale: TLocale = DEFAULT_LOCALE
): string => {
  if (!obj) return '';
  return obj[locale] || obj[FALLBACK_LOCALE] || '';
};

/**
 * Check if locale is supported
 */
export const isValidLocale = (locale: string): locale is TLocale => {
  return SUPPORTED_LOCALES.includes(locale as TLocale);
};

/**
 * Get locale from header or default
 */
export const getLocaleFromHeader = (acceptLanguage?: string): TLocale => {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  
  const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
  return isValidLocale(preferred || '') ? preferred as TLocale : DEFAULT_LOCALE;
};
