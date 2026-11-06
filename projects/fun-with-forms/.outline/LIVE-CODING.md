# Live-coding outline — Reusable Signal Forms

> Branch flow: `s00---base` → `s01---field-wrapper` → `s02---rating` → `s03---min-words` → `s04---person-name` → `main`.
> Not everything is typed live — jump between branches to skip the boring parts.

## On branch `s00---base`
1. Go over the existing code and whine about how much HTML we need to write.
2. Create the `FieldWrapper` — manually type `field-wrapper.ts` and `field-wrapper.html`
   (in `src/app/components/field-wrapper/`).
3. Manually type the helper functions `rangeHint` and `buildHints` (in `field-wrapper.ts`, below the component).
4. Go to `talk-form.html` and start replacing the fields with field wrappers — manually type 2–3 of these.
5. Jump to branch `s01---field-wrapper`, where all the fields were replaced.

## On branch `s01---field-wrapper`
1. Start implementing the custom control — `app-rating` ts file (`src/app/components/rating/`, CSS is already there).
2. Write the HTML.
3. Add `disabled` support.
4. Demonstrate changing the `min` and `max` in the schema, and conditionally disabling it.
5. Move on to branch `s02---rating`, where the control is fully implemented.

## On branch `s02---rating`
1. Create the `minWords` validator with a strict number (`src/app/validators/min-words.ts`, `countWords` is ready in utils).
2. Demonstrate it on the abstract field.
3. Change it to accept a `LogicFn` and demonstrate how the minimum changes depending on the expertise.
4. Move on to branch `s03---min-words`, where this is implemented.

## On branch `s03---min-words`
1. Create the `personName` rule (`src/app/validators/person-name.ts`, regexes are ready in `utils/name-patterns.ts`).
   - Start with `LETTERS_ONLY`, let the Polish names fail, then switch to `UNICODE_LETTERS_AND_SEPARATORS`.
2. Incorporate it into the schema — for `firstName` and `lastName`, and then again for each co-speaker.
3. Move on to branch `s04---person-name`.

## On branch `s04---person-name`
1. Create the `speakerSchema` (`src/app/schemas/speaker.schema.ts`).
2. Replace it in the form schema — `apply` for the speaker, `applyEach` for the co-speakers.
3. Say that we should repeat the same idea for the entire talk submission.
4. Implement the `talkSchema` (`src/app/schemas/talk.schema.ts`).
5. Replace the main form to use it — making the form ts file tiny.
6. Now we have a reusable schema for the entire model, in case such objects appear in other places.
7. Move to branch `main`, which contains the whole code.
