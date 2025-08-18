import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrafoService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getGrafo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/grafo`);
  }

  getGrafoFromArchieve(archieve: JSON): Observable<any> {
    return this.http.post(`${this.apiUrl}/grafo/from-archieve`, archieve);
  }

  getTrajetos(grafoId: string, origem: string, destino: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/grafo/${grafoId}/trajetos`, {
      params: { origem, destino }
    }); 
  }
}