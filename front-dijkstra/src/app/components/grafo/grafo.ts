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
  algoritmoBusca: string = ''; // Valor padrão
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
  grafoBase: any = null; 
  comHeuristica: boolean = false; 
  nosDisponiveis: string[] = [];

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
    if (!this.grafoData || !this.startNode || !this.endNode || !this.algoritmoBusca) {
      this.errorMessage = 'Preencha todos os campos: origem, destino e algoritmo!';
      return;
    }

    const payload = {
      grafo: this.grafoData,
      origem: this.startNode,
      destino: this.endNode,
      algoritmo: this.algoritmoBusca
    };

    console.log('Payload enviado para o backend:', payload);

    this.errorMessage = null;
    this.carregando = true;

    this.grafoRoutes.resolverComArquivo(payload).subscribe({
      next: (data) => {
        this.caminhoPassoAPasso = data.caminhoPassoAPasso;
        this.custoTotal = data.custoTotal;
        this.carregando = false;
        console.log(data)
      },
      error: (err) => {
        console.error('Erro ao chamar o backend:', err);
        this.caminhoPassoAPasso = [];
        this.custoTotal = null;
        this.carregando = false;
        this.errorMessage = 'Erro ao resolver o grafo. Verifique os dados e tente novamente.';
      }
    });
  }

 
  gerarLabirinto(heuristica: boolean = false) {
    this.carregando = true;
    this.comHeuristica = heuristica;
    
    this.grafoBase = this.gerarGrafoAleatorio(10, heuristica);
    
    if (!heuristica) {
      this.grafoData = this.grafoBase;
    } else {
      this.grafoData = this.grafoBase; 
    }
    
    this.nosDisponiveis = Object.keys(this.grafoBase);
    
    this.startNode = '';
    this.endNode = '';
    this.caminhoPassoAPasso = [];
    this.custoTotal = null;
    this.updateUIState();
    
    this.carregando = false;
  }

  private gerarGrafoAleatorio(n: number = 10, heuristica: boolean = false): any {
    const grafo: any = {};
    const nodes = Array.from({length: n}, (_, i) => `N${i+1}`);
    
    const coordenadas: {[key: string]: {x: number, y: number}} = {};
    if (heuristica) {
      nodes.forEach(node => {
        coordenadas[node] = {
          x: Math.floor(Math.random() * 500), // 0 a 500
          y: Math.floor(Math.random() * 500)  // 0 a 500
        };
      });
    }

    nodes.forEach(node => {
      if (heuristica) {
        grafo[node] = {
          arestas: {},
          coordenadas: coordenadas[node] 
        };
      } else {
        grafo[node] = {};
      }
    });

    for (let i = 0; i < nodes.length - 1; i++) {
      const peso = Math.floor(Math.random() * 50) + 10;
      
      if (heuristica) {
        grafo[nodes[i]].arestas[nodes[i+1]] = peso;
        grafo[nodes[i+1]].arestas[nodes[i]] = peso;
      } else {
        grafo[nodes[i]][nodes[i+1]] = peso;
        grafo[nodes[i+1]][nodes[i]] = peso;
      }
    }

    nodes.forEach(node => {
      nodes.forEach(target => {
        if (node !== target && Math.random() > 0.6) { // 40% de chance
          let jaExiste = false;
          
          if (heuristica) {
            jaExiste = grafo[node].arestas[target] !== undefined;
          } else {
            jaExiste = grafo[node][target] !== undefined;
          }
          
          if (!jaExiste) {
            const peso = Math.floor(Math.random() * 50) + 10;
            
            if (heuristica) {
              grafo[node].arestas[target] = peso;
              grafo[target].arestas[node] = peso;
            } else {
              grafo[node][target] = peso;
              grafo[target][node] = peso;
            }
          }
        }
      });
    });

    return grafo;
  }

  public calcularHeuristica(grafo: any, destino: string): any {
    const grafoComHeuristica = JSON.parse(JSON.stringify(grafo)); // Deep copy
    
    Object.keys(grafoComHeuristica).forEach(node => {
      if (node === destino) {
        grafoComHeuristica[node].heuristica = { [destino]: 0 };
      } else {
        const coordNode = grafoComHeuristica[node].coordenadas;
        const coordDestino = grafoComHeuristica[destino].coordenadas;
        
        const distanciaEuclidiana = Math.sqrt(
          Math.pow(coordNode.x - coordDestino.x, 2) + 
          Math.pow(coordNode.y - coordDestino.y, 2)
        );
        
        const heuristicaAdmissivel = Math.floor(distanciaEuclidiana * 0.7);
        
        grafoComHeuristica[node].heuristica = { [destino]: heuristicaAdmissivel };
      }
    });
    
    return grafoComHeuristica;
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
      if (this.comHeuristica && this.grafoBase) {
        this.grafoData = this.grafoBase;
      }
    } 
    else if (!this.endNode) {
      if (nodeId !== this.startNode) {
        this.endNode = nodeId;
        
        if (this.comHeuristica && this.grafoBase) {
          this.grafoData = this.calcularHeuristica(this.grafoBase, this.endNode);
        }
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

  getInfoHeuristica(): string {
    if (!this.comHeuristica) return '';
    if (!this.endNode) return 'Selecione o destino para aplicar a heurística';
    return `Heurística aplicada para destino: ${this.endNode}`;
  }

  resetarSelecao(): void {
    this.startNode = '';
    this.endNode = '';
    this.caminhoPassoAPasso = [];
    this.custoTotal = null;
    this.errorMessage = null;
    
    if (this.comHeuristica && this.grafoBase) {
      this.grafoData = this.grafoBase;
    }
    
    this.updateUIState();
  }
}