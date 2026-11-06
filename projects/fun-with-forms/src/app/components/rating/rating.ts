import { Component, computed, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.html',
  styleUrl: './rating.css',
})
export class Rating implements FormValueControl<number> {
  readonly value = model(0);
  readonly min = input<number>();
  readonly max = input<number>();
  readonly disabled = input(false);

  readonly effectiveMin = computed(() => this.min() ?? 1);
  readonly effectiveMax = computed(() => this.max() ?? 5);

  readonly stars = computed(() =>
    Array.from({ length: this.effectiveMax() }, (_, i) => i + 1));
}
