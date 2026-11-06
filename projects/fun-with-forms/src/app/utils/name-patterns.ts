/**
 * Patterns for validating person names.
 */

/** Only letters are allowed. */
export const LETTERS_ONLY = /^[a-zA-Z]*$/;

/** Only letters (from any language), spaces, hyphens (-) and apostrophes (') are allowed. */
export const UNICODE_LETTERS_AND_SEPARATORS = /^[\p{L} '-]*$/u;

/** The name must start and end with a letter. */
export const STARTS_AND_ENDS_WITH_LETTER = /^\p{L}(.*\p{L})?$/u;

/** Separators (space, - or ') must not appear next to each other. */
export const NO_CONSECUTIVE_SEPARATORS = /^(?!.*[ '-]{2})/u;
