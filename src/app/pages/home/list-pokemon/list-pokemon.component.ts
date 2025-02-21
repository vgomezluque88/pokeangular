import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Pokemon } from '../../../models/pokemon.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-list-pokemon',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './list-pokemon.component.html',
  styleUrl: './list-pokemon.component.scss'
})

export class ListPokemonComponent implements OnInit, OnDestroy {
  pokemons: Pokemon[] = [];
  next: string | null = null;
  prev: string | null = null;
  countPokemons: number = 0;
  offset: number = 0;
  limit: number = 20;

  currentIndex = 0;
  subscription!: Subscription;

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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Detiene el intervalo cuando el componente se destruye
    }
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

        // Inicia el proceso de actualización solo si hay Pokémon cargados
        if (this.pokemons.length > 0) {
          this.startUpdatingPokemons();
        }
      },
      (error) => {
        console.error('Error al obtener la lista de Pokémon:', error);
      }
    );
  }

  startUpdatingPokemons(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Detiene cualquier intervalo anterior
    }

    if (this.pokemons.length > 0) {
      this.subscription = interval(3000).subscribe(() => {
        const pokemon = this.pokemons[this.currentIndex];
        this.apiService.updateUrl(pokemon.url);
        console.log(`Updated: ${pokemon.url}`);
        this.currentIndex = (this.currentIndex + 1) % this.pokemons.length;
      });
    }
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
