import { Component, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';

export interface GraphData {
  nodes: { id: string }[];
  links: { source: string; target: string; distance: number }[];
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnChanges {
  @Input() adjacencyData: any;
  @Input() pathData: any;
  @ViewChild('graphContainer', { static: true }) private graphContainer!: ElementRef;
  @Output() graphReady = new EventEmitter<boolean>();
  @Output() nodeClicked = new EventEmitter<string>();

  private svg: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adjacencyData'] && this.adjacencyData) {
      this.createGraph();
    }
  }

  private transformData(data: any): GraphData {
    const nodes: { id: string }[] = [];
    const links: { source: string; target: string; distance: number }[] = [];
    const nodeSet = new Set<string>();

    for (const source in data) {
      nodeSet.add(source);
      
      if (data[source].arestas) {
        for (const target in data[source].arestas) {
          nodeSet.add(target);
          
          if (source < target) {
            links.push({
              source: source,
              target: target,
              distance: data[source].arestas[target]
            });
          }
        }
      } else {
        for (const target in data[source]) {
          nodeSet.add(target);
          
          if (source < target) {
            links.push({
              source: source,
              target: target,
              distance: data[source][target]
            });
          }
        }
      }
    }
    
    nodeSet.forEach(id => nodes.push({ id }));
    return { nodes, links };
  }

  private createGraph(): void {
    const graphData = this.transformData(this.adjacencyData);
    const element = this.graphContainer.nativeElement;
    const nodeRadius = 20; // Raio visual dos nós

    d3.select(element).selectAll("*").remove();

    const width = element.offsetWidth || 800;
    const height = element.offsetHeight || 600;

    this.svg = d3.select(element)
      .attr('width', width)
      .attr('height', height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const simulation = d3.forceSimulation(graphData.nodes as any)
      .force("link", d3.forceLink(graphData.links).id((d: any) => d.id)
        .distance(90) 
        .strength(0.5) 
      )
      .force("charge", d3.forceManyBody().strength(-450)) 
      .force("collide", d3.forceCollide().radius(nodeRadius + 5).strength(1))
      .force("x", d3.forceX(width / 2).strength(0.1)) 
      .force("y", d3.forceY(height / 2).strength(0.1)); 


    const link = this.svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graphData.links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6);

    const edgeLabels = this.svg.append("g")
      .attr("class", "edge-labels")
      .selectAll("text")
      .data(graphData.links)
      .enter().append("text")
      .text((d: any) => d.distance);

    const nodeGroup = this.svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graphData.nodes)
      .enter().append("g")
      .call(this.drag(simulation) as any)
      .on('click', (event:any, d: any) => {
    
      
      this.nodeClicked.emit(d.id); 
    });

    nodeGroup.append("circle")
      .attr("r", nodeRadius)
      .attr("fill", "#1f77b4")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    nodeGroup.append("text")
      .text((d: any) => d.id)
      .attr('x', 0) 
      .attr('y', 4) 
      .attr('text-anchor', 'middle') 
      .attr('class', 'node-label'); 

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      edgeLabels
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
      setTimeout(() => {
      this.graphReady.emit(true);
    }, 100);
    });

    
  }
  
  private drag(simulation: d3.Simulation<any, any>) {
    const dragstarted = (event: any, d: any) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    const dragged = (event: any, d: any) => {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    const dragended = (event: any, d: any) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }

   public async animatePath(caminho: { de: string, para: string }[], noInicio: string, noFim: string) {
      if (!this.svg) { console.log("SVG não encontrado"); return; }
      this.resetAnimation();
      const delay = 1000;
      const allNodes = this.svg.selectAll('.nodes g');
      const allLinks = this.svg.selectAll('.links line');
      const startNodeSelection = allNodes.filter((d: any) => d.id === noInicio);
      startNodeSelection.select('circle').classed('start-node', true).classed('path-node', true);

      await new Promise(resolve => setTimeout(resolve, delay));
      
      for (const step of caminho) {
        const { de, para } = step;

        const linkSelection = allLinks.filter((d: any) => 
          (d.source.id === de && d.target.id === para) || 
          (d.source.id === para && d.target.id === de)
        );
        const targetNodeSelection = allNodes.filter((d: any) => d.id === para);

        linkSelection.classed('path-link', true);
        await new Promise(resolve => setTimeout(resolve, delay / 2));
        targetNodeSelection.select('circle').classed('path-node', true);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      const endNodeSelection = allNodes.filter((d: any) => d.id === noFim);
      console.log(`Nó final '${noFim}' encontrado:`, endNodeSelection.size());
      endNodeSelection.select('circle').classed('end-node', true);
  }

  public resetAnimation() {
    if (!this.svg) return;
    this.svg.selectAll('.path-node, .start-node, .end-node').classed('path-node start-node end-node', false);
    this.svg.selectAll('.path-link').classed('path-link', false);
  }
  
}