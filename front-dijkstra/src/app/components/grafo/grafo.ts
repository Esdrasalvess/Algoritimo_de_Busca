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

resolverGrafo() {
  if (!this.grafoData || !this.startNode || !this.endNode) return;

  const graph = this.grafoData;
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const nodes = new Set(Object.keys(graph));

  // Inicialização
  nodes.forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[this.startNode] = 0;

  while (nodes.size > 0) {
    // Escolher o nó com menor distância
    const currentNode = Array.from(nodes).reduce((minNode, node) =>
      distances[node] < distances[minNode] ? node : minNode
    , Array.from(nodes)[0]);

    nodes.delete(currentNode);

    if (currentNode === this.endNode) break;

    // Atualizar distâncias dos vizinhos
    for (const [neighbor, weight] of Object.entries(graph[currentNode])) {
      const alt = distances[currentNode] + (weight as number);
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = currentNode;
      }
    }
  }

  // Reconstruir caminho
  const path: string[] = [];
  let current = this.endNode;
  while (current) {
    path.unshift(current);
    current = previous[current]!;
  }

  this.caminhoResolvido = path;
  console.log('Caminho mínimo:', this.caminhoResolvido);
}

}
