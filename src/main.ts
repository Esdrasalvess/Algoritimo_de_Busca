// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import 'zone.js';
import { appConfig } from './app/app.config';


bootstrapApplication(AppComponent, appConfig)
  .then(() => console.log('Aplicação iniciada!'))
  .catch(err => console.error(err));
