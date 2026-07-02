import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SPokemon } from 'src/app/services/spokemon';
import { IPokemon } from 'src/app/interfaces/pokemon';
import { IonContent, IonHeader, IonTitle, IonToolbar, LoadingController, IonImg, IonGrid, IonCard, IonCardContent, IonRow, IonCol, IonText, IonBadge } from '@ionic/angular/standalone';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  standalone: true,
  // Agrégalos también aquí abajo para que el HTML los reconozca:
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, JsonPipe, IonImg, IonGrid, IonCard, IonCardContent, IonRow, IonCol, IonText, IonBadge
  ],
  providers: [LoadingController]
})

export class ListPokemonsPage {
    private pokemonService: SPokemon = inject(SPokemon);
    private loadingController = inject(LoadingController); 

    pokemons: IPokemon[] = [];

    // CAMBIO AQUÍ: Movemos el diccionario de traducción al TypeScript
    listaTipos: { [key: string]: string } = {
      grass: 'planta', poison: 'veneno', fire: 'fuego', water: 'agua',
      bug: 'bicho', normal: 'normal', electric: 'eléctrico', ground: 'tierra',
      fairy: 'hada', fighting: 'lucha', psychic: 'psíquico', rock: 'roca',
      ghost: 'fantasma', ice: 'hielo', dragon: 'dragón', dark: 'siniestro',
      steel: 'acero', flying: 'volador'
    };

    constructor() { }

    ionViewWillEnter() {
        this.getMorePokemons();
    }

    async getMorePokemons() {
        const promisePokemons = this.pokemonService.getPokemons();

        if (promisePokemons) { 
            // 4. PASO: Corregimos 'this.loadingCtroller' por 'this.loadingController' (con la "o" agregada)
            const loading = await this.loadingController.create({
                message: 'Cargando...',
            });
            await loading.present(); // Recuerda ponerle 'await' al present() para asegurar que renderice bien antes de la petición

            promisePokemons.then((pokemons: IPokemon[] | null) => {
                // Evaluamos que los pokemons no vengan como null antes de concatenar
                if (pokemons) {
                    this.pokemons = this.pokemons.concat(pokemons);
                }
            })
            .catch((error) => console.log(error)) 
            .finally(() => {
                loading.dismiss(); 
            });
        }
    }
}