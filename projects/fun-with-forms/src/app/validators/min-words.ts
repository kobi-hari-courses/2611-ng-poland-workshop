import { LogicFn, SchemaPath, validate } from '@angular/forms/signals';
import { countWords } from '../utils/count-words';

export function minWords(
  path: SchemaPath<string>,
  min: number | LogicFn<string, number>,
  options?: { message?: string },
) {
  validate(path, (ctx) => {
    const minValue = typeof min === 'number' ? min : min(ctx);
    return countWords(ctx.value()) < minValue
      ? { kind: 'minWords', message: options?.message ?? `Please write at least ${minValue} words` }
      : undefined;
  });
}
