import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  LoadingController,
  IonFab,          
  IonFabButton,    
  IonIcon,
  IonImg,             
  IonCard,            
  IonCardHeader,      
  IonCardTitle,       
  IonCardContent,     
  IonList,            
  IonItem,            
  IonLabel,           
  IonBadge,
  IonText,
  IonProgressBar // <- Agregado para renderizar las barras de estadísticas
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; 
import { arrowBackOutline, starOutline } from 'ionicons/icons'; 
import { SPokemon } from 'src/app/services/spokemon';
import { IPokemon } from 'src/app/interfaces/pokemon';

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule,
    IonFab,          
    IonFabButton, 
    IonIcon,
    IonImg,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonText,
    IonProgressBar // <- Agregado aquí también
  ],
  providers: [LoadingController]
})
export class DetailPokemonPage implements OnInit {

  @Input() id: string = '';
  
  private pokemonService = inject(SPokemon);
  private loadingController = inject(LoadingController); 
  private router = inject(Router); 

  pokemon: IPokemon | null = null;

  listaTipos: { [key: string]: string } = {
    grass: 'planta', poison: 'veneno', fire: 'fuego', water: 'agua',
    bug: 'bicho', normal: 'normal', electric: 'eléctrico', ground: 'tierra',
    fairy: 'hada', fighting: 'lucha', psychic: 'psíquico', rock: 'roca',
    ghost: 'fantasma', ice: 'hielo', dragon: 'dragón', dark: 'siniestro',
    steel: 'acero', flying: 'volador'
  };

  listaStats: { [key: string]: string } = {
    hp: 'PS',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'At. Especial',
    'special-defense': 'Def. Especial',
    speed: 'Velocidad'
  };

  constructor() {
    addIcons({ arrowBackOutline, starOutline });
  }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/list-pokemons']);
  }

  async ionViewWillEnter() {
    const loading = await this.loadingController.create({
      message: 'Cargando detalles...',
    });
    await loading.present();

    this.pokemonService.getPokemon(this.id)
      .then((pokemon: IPokemon | null) => {
        this.pokemon = pokemon;
      })
      .catch((error) => {
        console.error('Error al cargar los detalles:', error);
      })
      .finally(() => {
        loading.dismiss();
      });
  }
}