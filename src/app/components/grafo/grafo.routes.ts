import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface payloadArquivo {
  grafo: any,
  origem: string,
  destino: string,
  algoritmo: string
}
@Injectable({
  providedIn: 'root'
})
export class GrafoRoutes {
  private apiUrl = 'https://back-production-c368.up.railway.app';

  constructor(private http: HttpClient) {}

  resolverComArquivo(payload: payloadArquivo): Observable<any>{
    return this.http.post(`${this.apiUrl}/labirinto/resolver`, payload);
  }

  getLabirinto(): Observable<any> {
    return this.http.get(`${this.apiUrl}/labirinto`);
  }
}