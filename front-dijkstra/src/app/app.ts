// src/app/app.ts
import { Component } from '@angular/core';
import { GrafoComponent } from './components/grafo/grafo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GrafoComponent],
  template: `
    <h1>Algoritmo de Busca - Dijkstra</h1>
    <app-grafo></app-grafo>
  `,
})
export class AppComponent {}
