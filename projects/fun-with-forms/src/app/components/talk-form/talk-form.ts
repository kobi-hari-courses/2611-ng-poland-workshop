import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import {
  emptySpeaker,
  emptyTalkSubmission,
} from '../../models/talk-submission.model';
import { talkSchema } from '../../schemas/talk.schema';
import { FieldWrapper } from '../field-wrapper/field-wrapper';
import { Rating } from '../rating/rating';

@Component({
  selector: 'app-talk-form',
  imports: [FormField, FieldWrapper, Rating],
  templateUrl: './talk-form.html',
  styleUrl: './talk-form.css',
})
export class TalkForm {
  protected readonly model = signal(emptyTalkSubmission());

  protected readonly f = form(this.model, talkSchema);

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
