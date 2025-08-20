// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import 'zone.js';


bootstrapApplication(AppComponent)
  .then(() => console.log('Aplicação iniciada!'))
  .catch(err => console.error(err));
