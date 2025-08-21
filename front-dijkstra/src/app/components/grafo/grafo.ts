// src/app/components/grafo/grafo.ts
import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // para *ngIf, *ngFor
import { FormsModule } from '@angular/forms';   // para [(ngModel)]
import { GrafoRoutes } from './grafo.routes';

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
  private grafoViwe!: GraphVisualizer;
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;


  constructor(
    private grafoRoutes: GrafoRoutes,
        @Inject(PLATFORM_ID) private platformId: Object
  ){};

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

  resolverGrafo() {
    if (!this.grafoData || !this.startNode || !this.endNode) return;

    const payload = {
      grafo: this.grafoData,
      origem: this.startNode,
      destino: this.endNode
    };

    this.grafoRoutes.resolverComArquivo(payload).subscribe({
      next: (data) => {
        this.caminhoPassoAPasso = data.caminhoPassoAPasso;
        this.custoTotal = data.custoTotal;
      },
      error: (err) => {
        console.error('Erro ao chamar o backend:', err);
        this.caminhoPassoAPasso = [];
        this.custoTotal = null;
      }
    });
  }

  gerarLabirinto(){
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 800;
    document.body.appendChild(canvas);
    this.grafoRoutes.getLabirinto().subscribe({
      next: (data) => {
        console.log(data)
        this.grafoData = data
      this.grafoViwe = new GraphVisualizer(canvas, data);
      this.grafoViwe.render(); 

      }, error: (err) => {
        console.error("Deu errado os carais aí", err)
        this.caminhoPassoAPasso = [];
        this.custoTotal = null;
      }
    })
  }
}




