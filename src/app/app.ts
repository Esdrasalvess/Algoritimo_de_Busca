// src/app/app.ts
import { Component } from '@angular/core';
import { GrafoComponent } from './components/grafo/grafo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GrafoComponent],
  template: `
    <h1 style="text-align: center; margin-top: 1rem;">Algoritmo de Busca - Dijkstra</h1>
    <app-grafo></app-grafo>
  `,
})
export class AppComponent {}
