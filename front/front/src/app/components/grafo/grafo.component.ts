import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-grafo',
  templateUrl: './grafo.component.html',
  styleUrls: ['./grafo.component.css'],
  imports:[
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class GrafoComponent {
  startNode: string = '';
  endNode: string = '';
  grafoData: any;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          this.grafoData = JSON.parse(reader.result as string);
          console.log('Grafo carregado:', this.grafoData);
          this.desenharGrafo();
        } catch (err) {
          console.error('Arquivo JSON inválido', err);
        }
      };
      reader.readAsText(file);
    }
  }

  desenharGrafo() {
    if (!this.grafoData) return;
    console.log('Desenhar grafo com dados:', this.grafoData);
  }

  resolverGrafo() {
    console.log('Resolver de', this.startNode, 'até', this.endNode);
  }
}
