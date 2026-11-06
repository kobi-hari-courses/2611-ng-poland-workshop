import { maxLength, minLength, pattern, required, SchemaPath } from '@angular/forms/signals';
import {
  NO_CONSECUTIVE_SEPARATORS,
  STARTS_AND_ENDS_WITH_LETTER,
  UNICODE_LETTERS_AND_SEPARATORS,
} from '../utils/name-patterns';

export function personName(path: SchemaPath<string>) {
  required(path, { message: 'Name is required' });
  minLength(path, 2, { message: 'Name is too short' });
  maxLength(path, 40, { message: 'Name is too long' });

  pattern(path, UNICODE_LETTERS_AND_SEPARATORS,
    { message: "Only letters, spaces, hyphens (-) and apostrophes (') are allowed" });
  pattern(path, STARTS_AND_ENDS_WITH_LETTER,
    { message: 'Name must start and end with a letter' });
  pattern(path, NO_CONSECUTIVE_SEPARATORS,
    { message: "Separators (space, - or ') cannot appear next to each other" });
}
