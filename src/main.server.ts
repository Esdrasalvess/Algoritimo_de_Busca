import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app'; // ⬅ use AppComponent
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config); // ⬅ também aqui

export default bootstrap;
