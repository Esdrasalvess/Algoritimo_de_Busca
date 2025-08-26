import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface payloadArquivo {
  grafo: any,
  origem: string,
  destino: string
}
@Injectable({
  providedIn: 'root'
})
export class GrafoRoutes {

  private apiUrl = 'https://algoritimodebusca-production.up.railway.app';
  
  constructor(private http: HttpClient) {}
  
  resolverComArquivo(payload: payloadArquivo): Observable<any>{
    return this.http.post(`${this.apiUrl}/labirinto/resolver-com-json`, payload);
  }
  
  getLabirinto(): Observable<any> {
    return this.http.get(`${this.apiUrl}/labirinto`);
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