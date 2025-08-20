// src/app/components/grafo/grafo.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // para *ngIf, *ngFor
import { FormsModule } from '@angular/forms';   // para [(ngModel)]

@Component({
  selector: 'app-grafo',
  standalone: true,
  templateUrl: './grafo.html',
  styleUrls: ['./grafo.css'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class GrafoComponent {
  startNode = '';
  endNode = '';
  grafoData: any = null;
  caminhoResolvido: string[] = [];
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  isDragOver = false;
  errorMessage: string | null = null;
  caminhoPassoAPasso: { de: string, para: string, custo: number }[] = [];
  custoTotal: number | null = null;


  // Drag & Drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (file.type !== 'application/json') {
      this.errorMessage = 'Apenas arquivos JSON são permitidos!';
      return;
    }
    this.selectedFile = file;
    this.selectedFileName = file.name;
    this.errorMessage = null;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        this.grafoData = JSON.parse(reader.result as string);
        console.log('Grafo carregado:', this.grafoData);
      } catch (err) {
        this.errorMessage = 'Erro ao ler o arquivo JSON.';
        console.error(err);
      }
    };
    reader.readAsText(file);
  }

  removeFile() {
    this.selectedFile = null;
    this.selectedFileName = null;
    this.grafoData = null;
    this.caminhoResolvido = [];
    this.errorMessage = null;
  }

  // Algoritmo Dijkstra
  dijkstra(grafo: any, inicio: string, fim: string): string[] {
    const dist: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    const nodes = new Set<string>(Object.keys(grafo));

    for (const node of nodes) {
      dist[node] = Infinity;
      prev[node] = null;
    }
    dist[inicio] = 0;

    while (nodes.size > 0) {
      let minNode: string | null = null;
      for (const node of nodes) {
        if (minNode === null || dist[node] < dist[minNode]) {
          minNode = node;
        }
      }

      if (minNode === null || dist[minNode] === Infinity) break;
      nodes.delete(minNode);

      for (const [vizinho, peso] of Object.entries(grafo[minNode])) {
        const alt = dist[minNode] + (peso as number);
        if (alt < dist[vizinho]) {
          dist[vizinho] = alt;
          prev[vizinho] = minNode;
        }
      }
    }

    const path: string[] = [];
    let u: string | null = fim;
    while (u) {
      path.unshift(u);
      u = prev[u];
    }

    if (path[0] !== inicio) return [];
    return path;
  }

async resolverGrafo() {
  if (!this.grafoData || !this.startNode || !this.endNode) return;

  try {
    const response = await fetch('http://localhost:8080/labirinto/resolver-com-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grafo: this.grafoData,
        origem: this.startNode,   // <--- alterado
        destino: this.endNode     // <--- alterado
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    this.caminhoPassoAPasso = data.caminhoPassoAPasso;
    this.custoTotal = data.custoTotal;

  } catch (err) {
    console.error('Erro ao chamar o backend:', err);
    this.caminhoPassoAPasso = [];
    this.custoTotal = null;
  }
}




}
