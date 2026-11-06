import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { provideSignalFormsConfig } from '@angular/forms/signals';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideSignalFormsConfig({
      classes: {
        'invalid': c => c.state().touched() && c.state().invalid()
      }
    })
  ]
};
