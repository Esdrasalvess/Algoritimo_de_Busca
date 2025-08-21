interface Graph {
  [key: string]: { [key: string]: number };
}

interface GraphNode {
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Edge {
  from: string;
  to: string;
  distance: number;
}

class GraphVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private nodes: GraphNode[] = [];
  private edges: Edge[] = [];
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement, graph: Graph) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.width = canvas.width;
    this.height = canvas.height;

    this.nodes = Object.keys(graph).map(name => ({
      name,
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: 0,
      vy: 0,
    }));

    this.edges = Object.entries(graph).flatMap(([from, targets]) =>
      Object.keys(targets).map(to => ({ from, to, distance: targets[to] }))
    );
  }

  public layout(iterations = 500) {
    const k = 100; // força de repulsão
    const damping = 0.85;

    for (let i = 0; i < iterations; i++) {
      // Reset forças
      this.nodes.forEach(n => {
        n.vx = 0;
        n.vy = 0;
      });

      // Repulsão entre nós
      for (let j = 0; j < this.nodes.length; j++) {
        for (let k2 = j + 1; k2 < this.nodes.length; k2++) {
          const a = this.nodes[j];
          const b = this.nodes[k2];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
          const force = k * k / dist;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          a.vx -= fx;
          a.vy -= fy;
          b.vx += fx;
          b.vy += fy;
        }
      }

      // Atração pelas arestas
      this.edges.forEach(edge => {
        const a = this.nodes.find(n => n.name === edge.from)!;
        const b = this.nodes.find(n => n.name === edge.to)!;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
        const force = (dist - edge.distance) * 0.01;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      });

      // Atualiza posições
      this.nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        n.vx *= damping;
        n.vy *= damping;
      });
    }
  }

  public draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Desenha arestas
    this.edges.forEach(e => {
      const a = this.nodes.find(n => n.name === e.from)!;
      const b = this.nodes.find(n => n.name === e.to)!;
      this.ctx.beginPath();
      this.ctx.moveTo(a.x, a.y);
      this.ctx.lineTo(b.x, b.y);
      this.ctx.strokeStyle = "#aaa";
      this.ctx.stroke();
    });

    // Desenha nós
    this.nodes.forEach(n => {
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, 15, 0, 2 * Math.PI);
      this.ctx.fillStyle = "#4CAF50";
      this.ctx.fill();
      this.ctx.strokeStyle = "#333";
      this.ctx.stroke();

      this.ctx.fillStyle = "#fff";
      this.ctx.font = "12px Arial";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(n.name, n.x, n.y);
    });
  }

  public render() {
    this.layout();
    this.draw();
  }
}
