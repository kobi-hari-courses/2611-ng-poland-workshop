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
import { personName } from '../../validators/person-name';

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

    personName(p.speaker.firstName);
    personName(p.speaker.lastName);

    required(p.speaker.email);
    email(p.speaker.email);

    maxLength(p.speaker.bio, 500);

    applyEach(p.coSpeakers, (s) => {
      personName(s.firstName);
      personName(s.lastName);

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
