import { JsonPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SPokemon } from 'src/app/services/spokemon';
import { IPokemon } from 'src/app/interfaces/pokemon';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  LoadingController, 
  IonImg, 
  IonGrid, 
  IonCard, 
  IonCardContent, 
  IonRow, 
  IonCol, 
  IonText,
  IonBadge,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule, 
    JsonPipe, 
    IonImg, 
    IonGrid, 
    IonCard, 
    IonCardContent, 
    IonRow, 
    IonCol, 
    IonText,
    IonBadge,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  ],
  providers: [LoadingController]
})
export class ListPokemonsPage {
    private pokemonService: SPokemon = inject(SPokemon);
    private loadingController = inject(LoadingController); 
    private router = inject(Router);

    pokemons: IPokemon[] = [];
    listaTipos: { [key: string]: string } = {
      grass: 'planta', poison: 'veneno', fire: 'fuego', water: 'agua',
      bug: 'bicho', normal: 'normal', electric: 'eléctrico', ground: 'tierra',
      fairy: 'hada', fighting: 'lucha', psychic: 'psíquico', rock: 'roca',
      ghost: 'fantasma', ice: 'hielo', dragon: 'dragón', dark: 'siniestro',
      steel: 'acero', flying: 'volador'
    };

    constructor() { }

    ionViewWillEnter() {
        if (this.pokemons.length === 0) {
            this.getMorePokemons();
        }
    }

    // CORRECCIÓN AQUÍ: Cambiamos 'id: number' a 'id: string' para coincidir con tu interfaz
    goToPage(id: string) {
      this.router.navigate(['/detail-pokemon', id]);
    }

    async getMorePokemons(event?: any) {
        const promisePokemons = this.pokemonService.getPokemons();

        if (promisePokemons) { 
            let loading: any = null;

            if (!event) {
                loading = await this.loadingController.create({
                    message: 'Cargando...',
                });
                await loading.present();
            }

            promisePokemons.then((pokemons: IPokemon[] | null) => {
                if (pokemons) {
                    this.pokemons = this.pokemons.concat(pokemons);
                }
            })
            .catch((error) => console.log(error)) 
            .finally(() => {
                if (loading) {
                    loading.dismiss(); 
                }
                if (event) {
                    event.target.complete();
                }
            });
        }
    }
}