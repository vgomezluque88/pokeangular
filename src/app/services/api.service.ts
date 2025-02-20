import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://pokeapi.co/api/v2/'; // URL de la API
  private apiPokemons = 'https://pokeapi.co/api/v2/pokemon/'; // URL de la API
  private urlSource = new BehaviorSubject<string | null>(null);
  public data$: Observable<any>;

  constructor(private http: HttpClient) {
    // Cuando se actualiza la URL, automáticamente se hace la petición
    this.data$ = this.urlSource.pipe(
      switchMap(url => (url ? this.http.get(url) : []))
    );
  }
  
  updateUrl(url: string) {
    this.urlSource.next(url);
  }
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
