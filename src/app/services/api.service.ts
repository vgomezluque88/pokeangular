import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://pokeapi.co/api/v2/'; // URL de la API
  private apiPokemons = 'https://pokeapi.co/api/v2/pokemon/'; // URL de la API

  constructor(private http: HttpClient) { }

  // Método para obtener datos
  getEndpoints(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getPokemons(url: string = this.apiPokemons): Observable<any> {
    return this.http.get<any>(url);
  }
  getPokemonById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiPokemons}/${id}`);
  }
}
