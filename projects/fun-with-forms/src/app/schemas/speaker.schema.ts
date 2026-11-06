import { email, maxLength, required, schema } from '@angular/forms/signals';
import { Speaker } from '../models/talk-submission.model';
import { personName } from '../validators/person-name';

export const speakerSchema = schema<Speaker>((s) => {
  personName(s.firstName);
  personName(s.lastName);

  required(s.email);
  email(s.email);

  maxLength(s.bio, 500);
});
