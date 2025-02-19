import { Routes } from '@angular/router';
import { PokemonDetailsComponent } from './pages/home/pokemon-details/pokemon-details.component';
import { HomeComponent } from './pages/home/home.component';
import { ListPokemonComponent } from './pages/home/list-pokemon/list-pokemon.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: '', component: ListPokemonComponent }, // Muestra la lista por defecto
            { path: 'pokemon/:id', component: PokemonDetailsComponent } // Muestra detalles cuando se selecciona un Pokémon
        ]
    }

];
