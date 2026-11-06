import {
  apply,
  applyEach,
  max,
  maxLength,
  min,
  minLength,
  required,
  schema,
} from '@angular/forms/signals';
import { TalkSubmission } from '../models/talk-submission.model';
import { minWords } from '../validators/min-words';
import { speakerSchema } from './speaker.schema';

export const talkSchema = schema<TalkSubmission>((p) => {
  required(p.title);
  minLength(p.title, 3);
  maxLength(p.title, 80);

  required(p.abstract);
  minWords(p.abstract, (ctx) => ctx.valueOf(p.expertise) >= 4 ? 20 : 10);

  min(p.expertise, 1);
  max(p.expertise, 5);

  apply(p.speaker, speakerSchema);
  applyEach(p.coSpeakers, speakerSchema);
});
