import { Component, signal } from '@angular/core';
import {
  applyEach,
  email,
  form,
  FormField,
  max,
  maxLength,
  min,
  minLength,
  required,
} from '@angular/forms/signals';
import {
  emptySpeaker,
  emptyTalkSubmission,
} from '../../models/talk-submission.model';
import { FieldWrapper } from '../field-wrapper/field-wrapper';
import { Rating } from '../rating/rating';
import { minWords } from '../../validators/min-words';

@Component({
  selector: 'app-talk-form',
  imports: [FormField, FieldWrapper, Rating],
  templateUrl: './talk-form.html',
  styleUrl: './talk-form.css',
})
export class TalkForm {
  protected readonly model = signal(emptyTalkSubmission());

  protected readonly f = form(this.model, (p) => {
    required(p.title);
    minLength(p.title, 3);
    maxLength(p.title, 80);

    required(p.abstract);
    minWords(p.abstract, (ctx) => ctx.valueOf(p.expertise) >= 4 ? 20 : 10);

    min(p.expertise, 1);
    max(p.expertise, 5);

    required(p.speaker.firstName);
    minLength(p.speaker.firstName, 2);
    maxLength(p.speaker.firstName, 40);

    required(p.speaker.lastName);
    minLength(p.speaker.lastName, 2);
    maxLength(p.speaker.lastName, 40);

    required(p.speaker.email);
    email(p.speaker.email);

    maxLength(p.speaker.bio, 500);

    applyEach(p.coSpeakers, (s) => {
      required(s.firstName);
      minLength(s.firstName, 2);
      maxLength(s.firstName, 40);

      required(s.lastName);
      minLength(s.lastName, 2);
      maxLength(s.lastName, 40);

      required(s.email);
      email(s.email);

      maxLength(s.bio, 500);
    });
  });

  protected addCoSpeaker(): void {
    this.model.update((m) => ({
      ...m,
      coSpeakers: [...m.coSpeakers, emptySpeaker()],
    }));
  }

  protected removeCoSpeaker(index: number): void {
    this.model.update((m) => ({
      ...m,
      coSpeakers: m.coSpeakers.filter((_, i) => i !== index),
    }));
  }
}
