import { Routes } from '@angular/router';
import { GrafoComponent } from './components/grafo/grafo.component'; 

export const routes: Routes = [
  { path: 'grafo', component: GrafoComponent },
  { path: '', redirectTo: '/grafo', pathMatch: 'full' } // rota padrão para redirecionar ao Grafo
];
