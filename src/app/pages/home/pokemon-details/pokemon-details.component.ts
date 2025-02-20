import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss'],
})
export class PokemonDetailsComponent implements OnInit {
  pokemon: any = null;
  offset: number = 0;
  limit: number = 20;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const pokemonId = this.route.snapshot.paramMap.get('id');

    // Recuperar offset y limit de la URL
    this.route.queryParams.subscribe(params => {
      this.offset = params['offset'] ? parseInt(params['offset'], 10) : 0;
      this.limit = params['limit'] ? parseInt(params['limit'], 10) : 20;
    });

    if (pokemonId) {
      this.apiService.getPokemonById(pokemonId).subscribe(
        (data) => {
          this.pokemon = data;
        },
        (error) => {
          console.error('Error al obtener los datos del Pokémon:', error);
        }
      );
    }

    
  }

  goBack(): void {
    this.router.navigate(['/'], { queryParams: { offset: this.offset, limit: this.limit } });
  }
}
