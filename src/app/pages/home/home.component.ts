import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ListPokemonComponent } from './list-pokemon/list-pokemon.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, ListPokemonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
