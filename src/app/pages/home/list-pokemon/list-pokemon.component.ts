import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Pokemon } from '../../../models/pokemon.model';

@Component({
  selector: 'app-list-pokemon',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './list-pokemon.component.html',
  styleUrl: './list-pokemon.component.scss'
})

export class ListPokemonComponent implements OnInit {
  pokemons: Pokemon[] = [];
  next: string | null = null;
  prev: string | null = null;
  countPokemons: number = 0;
  offset: number = 0;
  limit: number = 20;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Leer `offset` y `limit` de la URL
    this.route.queryParams.subscribe(params => {
      this.offset = params['offset'] ? parseInt(params['offset'], 10) : 0;
      this.limit = params['limit'] ? parseInt(params['limit'], 10) : 20;
      this.loadPokemons();
    });
  }
  fetchData(url: string) {
    this.apiService.updateUrl(url);
  }
  getPokemonId(url: string): string {
    return url.split('/').filter(part => part).pop() || '1';
  }

  loadPokemons(): void {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${this.offset}&limit=${this.limit}`;

    this.apiService.getPokemons(url).subscribe(
      (data) => {
        this.pokemons = data.results.map((pokemon: any) => ({
          name: pokemon.name,
          url: pokemon.url,
          image: ''
        }));

        this.next = data.next;
        this.prev = data.previous;

        this.pokemons.forEach((pokemon) => {
          this.apiService.getPokemonById(pokemon.name).subscribe(
            (details) => {
              pokemon.image = details.sprites.front_default;
            },
            (error) => {
              console.error(`Error al obtener detalles de ${pokemon.name}:`, error);
            }
          );
        });
      },
      (error) => {
        console.error('Error al obtener la lista de Pokémon:', error);
      }
    );
  }

  nextPage(): void {
    if (this.next) {
      this.offset += this.limit;
      this.router.navigate(['/'], { queryParams: { offset: this.offset, limit: this.limit } });
    }
  }

  prevPage(): void {
    if (this.prev) {
      this.offset = Math.max(this.offset - this.limit, 0);
      this.router.navigate(['/'], { queryParams: { offset: this.offset, limit: this.limit } });
    }
  }
}
