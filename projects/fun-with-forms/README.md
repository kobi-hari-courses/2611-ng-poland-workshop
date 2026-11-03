# Fun with Forms: Reusable Signal Forms

This is a recap of the **Reusable Signal Forms** part of the ng-poland workshop. In the workshop we took one form and made it reusable in four ways:

1. A **field wrapper** that removes repeated markup around every field
2. A **custom form control** that plugs into Signal Forms like a native input
3. A **custom validator**
4. **Reusable validation rules and schemas**

> Built with Angular **22.2.4**. To run it: `npm install`, then `npm start`, then open `http://localhost:4200`.

---

## The data model

Every demo used the same form: a **Call for Papers** submission for a conference talk.

```ts
interface TalkSubmission {
  title: string;
  abstract: string;      // custom validator: minWords
  expertise: number;     // custom control: <app-rating>
  speaker: Speaker;      // reusable schema: apply(...)
  coSpeakers: Speaker[]; // reusable schema: applyEach(...)
}

interface Speaker {
  firstName: string;     // personName rules
  lastName: string;      // personName rules
  email: string;
  bio: string;
}
```

---

## 1. The field wrapper – `<app-field>`

### The problem
We started with a form where every field repeated the same markup: a label, a required asterisk, a hint such as "at least 3 characters", and a list of error messages shown after the field is touched. Most of the template was this repetition rather than the actual form.

### The solution
`<app-field>` wraps an input and **reads everything it needs from the field it contains**. It looks up the projected `FormField` directive with `contentChild`, and its `state()` already holds all the information we were typing by hand:

| What we show | Where it comes from |
|---|---|
| Required asterisk `*` | `state().required()` |
| Hints ("min 3 / max 40 characters") | `state().minLength?.()`, `state().maxLength?.()` |
| Error messages | `state().errors()` |
| When to show the errors | `state().touched()` |

```ts
@Component({
  selector: 'app-field',
  template: `
    <label>
      {{ label() }} @if (state().required()) { <span class="required">*</span> }
      <ng-content />
    </label>

    @if (state().minLength?.(); as min) { <small>At least {{ min }} characters</small> }
    @if (state().maxLength?.(); as max) { <small>Up to {{ max }} characters</small> }

    <ul class="errors" aria-live="polite">
      @if (state().touched()) {
        @for (error of state().errors(); track $index) {
          <li>{{ error.message ?? error.kind }}</li>
        }
      }
    </ul>
  `,
})
export class FieldWrapper {
  readonly label = input.required<string>();
  readonly formField = contentChild.required(FormField);
  readonly state = computed(() => this.formField().state());
}
```

Usage:

```html
<app-field label="Title">
  <input [formField]="f.title" />
</app-field>
```

### Points to remember
- **The schema is the single source of truth.** Adding `required(p.title)` or `maxLength(p.title, 40)` to the schema updates the asterisk, the hints and the errors with no template changes.
- **Accessibility.** `aria-live="polite"` on the error list makes screen readers announce errors as they appear. It costs one attribute, and only the wrapper needs it.

---

## 2. The custom control – `<app-rating>`

A star rating control that works with `[formField]` exactly like a native `<input>`.

### The contract
A component becomes a Signal Forms control by implementing **`FormValueControl<T>`**:

- **Required:** `value = model<T>()`. This keeps the control in sync with the field's value in both directions.
- **Optional:** inputs with names from the contract, such as `min`, `max`, `disabled`, `required` and `errors`. When the control declares them, **`[formField]` fills them in from the schema automatically.**

```ts
@Component({
  selector: 'app-rating',
  template: `
    @for (star of stars(); track star) {
      <button type="button"
        [disabled]="disabled() || star < (min() ?? 1)"
        (click)="value.set(star)">
        {{ star <= value() ? '★' : '☆' }}
      </button>
    }
  `,
})
export class Rating implements FormValueControl<number> {
  readonly value = model(0);
  readonly min = input<number>();
  readonly max = input<number>();
  readonly disabled = input(false);

  readonly stars = computed(() =>
    Array.from({ length: this.max() ?? 5 }, (_, i) => i + 1));
}
```

Usage. Note that the template never passes `min` or `max`:

```html
<app-field label="Expertise level">
  <app-rating [formField]="f.expertise" />
</app-field>
```

```ts
min(p.expertise, 1);
max(p.expertise, 5);
```

### What the schema controls

| Schema rule | Effect on the control |
|---|---|
| `max(p.expertise, 5)` | **The number of stars drawn.** Change it to 10 and ten stars appear. |
| `min(p.expertise, 2)` | Stars below the minimum are disabled. The `min` validator still runs, so an unrated value of `0` shows an error through `<app-field>`. |
| `disabled(p.expertise, ...)` | All stars are locked. |

The control contains **no validation code and no error display**. The schema decides the rules, and the wrapper shows the errors.

---

## 3. The custom validator – `minWords`

`minLength` counts characters, but an abstract should be measured in **words**. A custom validator is just a function that takes a schema path and calls `validate()` on it:

```ts
export function minWords(path: SchemaPath<string>, min: number, options?: { message?: string }) {
  validate(path, ({ value }) => {
    const words = value().trim().split(/\s+/).filter(Boolean).length;
    return words < min
      ? { kind: 'minWords', message: options?.message ?? `Please write at least ${min} words` }
      : undefined;
  });
}
```

Usage: it reads exactly like a built-in validator.

```ts
required(p.abstract);
minWords(p.abstract, 30);
```

### Points to remember
- **Returning `undefined`** means the value is valid.
- **The returned error** has a `kind`, which you can check in code, and a `message`, which `<app-field>` shows automatically.
- **Same shape as the built-ins.** Following the `(path, ..., options)` signature makes custom validators feel like part of the framework.

> **To be continued at the conference.** Built-in validators such as `minLength` also *publish* their limit, which is why `<app-field>` can show "at least 3 characters" before anything is typed. Our `minWords` doesn't do this yet, so the wrapper can't show "at least 30 words". We'll cover how to do it, along with several other features, in the conference talk.

---

## 4. Reusable rules and schemas

Some fields share the same rules. A name should follow the same rules whether it's a first name, a last name, the main speaker's or a co-speaker's. We looked at two levels of reuse.

### 4a. A rule function – `personName`

A plain function that applies **several validators to one field**. Each pattern checks **one kind of mistake**, so each mistake gets its own error message:

```ts
export function personName(path: SchemaPath<string>) {
  required(path, { message: 'Name is required' });
  minLength(path, 2, { message: 'Name is too short' });
  maxLength(path, 40, { message: 'Name is too long' });

  pattern(path, /^[\p{L} '-]*$/u,
    { message: "Only letters, spaces, hyphens (-) and apostrophes (') are allowed" });
  pattern(path, /^\p{L}(.*\p{L})?$/u,
    { message: 'Name must start and end with a letter' });
  pattern(path, /^(?!.*[ '-]{2})/u,
    { message: "Separators (space, - or ') cannot appear next to each other" });
}
```

| Input | Result |
|---|---|
| `Łukasz`, `O'Brien`, `Nowak-Kowalska`, `Mary Ann` | ✅ valid |
| `J0hn` | ❌ illegal characters |
| `-Anna`, `Anna-`, `O'` | ❌ must start and end with a letter |
| `Jan--Kowal`, `Mary  Ann` | ❌ separators next to each other |
| `-J0hn` | ❌ **two** errors: illegal characters, and must start and end with a letter |

### Points to remember
- **`\p{L}` with the `u` flag** matches a letter from any alphabet. A naive `[a-zA-Z]` would reject *Łukasz*.
- **`(?!...)` is a negative lookahead.** The third pattern means "the value does *not* contain two separators in a row".
- **One rule per mistake.** Because every rule checks a single thing, users get a precise message, and one value can show several errors at once, as with `-J0hn`.

### 4b. A reusable schema - `speakerSchema`

A rule function covers **one field**. A `schema<T>()` covers **a whole object**, and can be reused wherever that object type appears in the model:

```ts
export const speakerSchema = schema<Speaker>((s) => {
  personName(s.firstName);
  personName(s.lastName);
  required(s.email);
  email(s.email);
  maxLength(s.bio, 500);
});
```

Reusing it in the talk form:

```ts
export const talkSchema = schema<TalkSubmission>((p) => {
  required(p.title);
  maxLength(p.title, 80);

  required(p.abstract);
  minWords(p.abstract, 30);

  min(p.expertise, 1);
  max(p.expertise, 5);

  apply(p.speaker, speakerSchema);         // a single nested object
  applyEach(p.coSpeakers, speakerSchema);  // every item in an array
});

readonly f = form(this.model, talkSchema);
```

### Rule function or schema?

| | Rule function (`personName`) | Schema (`speakerSchema`) |
|---|---|---|
| Applies to | One field | A whole object |
| Written as | A plain function `(path) => { ... }` | `schema<T>((p) => { ... })` |
| Used with | A direct call: `personName(p.x)` | `apply(...)` or `applyEach(...)` |
| Typical use | "Every name follows these rules" | "Every speaker follows these rules" |

---

## Summary

| We built | It reads from the schema | So that... |
|---|---|---|
| `<app-field>` | `required`, `minLength`, `maxLength`, `errors`, `touched` | form templates don't repeat labels, hints and errors |
| `<app-rating>` | `min`, `max`, `disabled` | the control has no validation logic of its own |
| `minWords` | – | custom rules look and work like built-in validators |
| `personName` / `speakerSchema` | – | rules are written once and reused on many fields and objects |

**Next, at the conference:** making custom validators as smart as the built-in ones, plus more features.
