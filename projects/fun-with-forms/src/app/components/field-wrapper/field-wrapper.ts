import { Component, computed, contentChild, input } from '@angular/core';
import { FieldState, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-field',
  host: { class: 'field' },
  templateUrl: './field-wrapper.html',
  styleUrl: './field-wrapper.css',
})
export class FieldWrapper {
  readonly label = input.required<string>();

  readonly formField = contentChild.required(FormField);
  readonly state = computed(() => this.formField().state());

  readonly required = computed(() => this.state().required());
  readonly touched = computed(() => this.state().touched());
  readonly errors = computed(() => this.state().errors());
  readonly hints = computed(() => buildHints(this.state()));
}

function rangeHint(min?: number, max?: number, unit = ''): string {
  if (min != null && max != null) return `Between ${min} and ${max}${unit}`;
  if (min != null) return `At least ${min}${unit}`;
  if (max != null) return `At most ${max}${unit}`;
  return '';
}

function buildHints(state: FieldState<any>): string[] {
  return [
    rangeHint(state.minLength?.(), state.maxLength?.(), ' characters'),
    rangeHint(state.min?.(), state.max?.()),
  ].filter(hint => hint !== '');
}
