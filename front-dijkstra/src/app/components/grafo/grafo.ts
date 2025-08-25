import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // para *ngIf, *ngFor
import { FormsModule } from '@angular/forms';   // para [(ngModel)]
import { GrafoRoutes } from './grafo.routes';
import { GraphComponent } from '../../graph/graph.component';

@Component({
  selector: 'app-grafo',
  standalone: true,
  templateUrl: './grafo.html',
  styleUrls: ['./grafo.css'],
  imports: [
    CommonModule,
    FormsModule,
    GraphComponent
  ]
})
export class GrafoComponent {
  startNode = '';
  endNode = '';
  grafoData: any = null;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  isDragOver = false;
  errorMessage: string | null = null;
  caminhoPassoAPasso: { de: string, para: string, custo: number }[] = [];
  custoTotal: number | null = null; 
  public carregando: boolean = false;
  public isGraphReady = false;
  @ViewChild(GraphComponent) private graphComponent!: GraphComponent; 

  startNodePlaceholder = 'Clique em um nó no mapa para definir o início';
  endNodePlaceholder = 'Aguardando seleção do nó inicial...';


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
    this.caminhoPassoAPasso = [];
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

  // grafo.ts
gerarLabirinto() {
  this.carregando = true;

  
  this.grafoData = this.gerarGrafoAleatorio(10); 
  this.carregando = false;
}

private gerarGrafoAleatorio(n: number = 10): any {
  const grafo: any = {};
  const nodes = Array.from({length: n}, (_, i) => `N${i+1}`);

  nodes.forEach(node => {
    grafo[node] = {};
    nodes.forEach(target => {
      if (node !== target && Math.random() > 0.5) {
        grafo[node][target] = Math.floor(Math.random() * 10) + 1; // custo 1-10
      }
    });
  });

  return grafo;
}


  onGraphReady(): void {
    this.isGraphReady = true;
  }
  
  animarCaminho() {
    if (this.graphComponent && this.caminhoPassoAPasso.length > 0) {
      
      this.graphComponent.animatePath(
        this.caminhoPassoAPasso,
        this.startNode,
        this.endNode
      );
    } else {
      console.error("Não foi possível iniciar a animação. Verifique os dados do caminho e se o grafo foi renderizado.");
      this.errorMessage = "Não há um caminho para animar. Por favor, calcule a rota primeiro.";
    }
  }
  resetar() {
    if (this.graphComponent) {
      this.graphComponent.resetAnimation();
    }
  }

   onNodeSelected(nodeId: string): void {
    if (!this.startNode || this.endNode) {
      this.startNode = nodeId;
      this.endNode = '';
    } 
    else if (!this.endNode) {
      if (nodeId !== this.startNode) {
        this.endNode = nodeId;
      }
    }
    
    this.updateUIState();
  }

  updateUIState(): void {
    if (!this.startNode) {
      this.startNodePlaceholder = 'Clique no 1º nó (Início)';
      this.endNodePlaceholder = 'Aguardando seleção do nó inicial...';
    } 
    // Se apenas o nó inicial foi selecionado
    else if (this.startNode && !this.endNode) {
      this.startNodePlaceholder = ''; 
      this.endNodePlaceholder = 'Clique no 2º nó (Fim)';
    } 
    else {
      this.startNodePlaceholder = '';
      this.endNodePlaceholder = '';
    }
  }

  resetarSelecao(): void {
    this.startNode = '';
    this.endNode = '';
    this.updateUIState(); 
  }
}