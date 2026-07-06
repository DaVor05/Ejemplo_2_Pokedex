import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { IPokemon } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root',
})
export class SPokemon {
  
  private readonly URL_BASE = 'https://pokeapi.co/api/v2/pokemon';
  private nextUrl = `${this.URL_BASE}?limit=20&offset=0`;

  getPokemons() {
    if (this.nextUrl) {
        return CapacitorHttp.get({ url: this.nextUrl, params: {} })
            .then(async (response: HttpResponse) => {
                console.log("La respuesta es: ");
                console.log(response);

                const pokemons: IPokemon[] = [];

                if (response.data) {
                    const result: any[] = response.data.results;
                    this.nextUrl = response.data.next;
                    const promises: Promise<HttpResponse>[] = [];

                    result.forEach((result: any) => {
                        promises.push(CapacitorHttp.get({ url: result.url, params: {} }));
                    });

                    return Promise.all(promises).then((responses) => {
                        responses.forEach((res) => {
                            if (res.data) {
                                pokemons.push(this.processPokemon(res.data));
                            }
                        });
                        return pokemons;
                    });
                }
                return [];
            });
    }
    return null;
  }

  // NUEVA FUNCIÓN (Imagen 1): Obtiene un solo Pokémon por su ID o nombre
  getPokemon(id: string) {
    return CapacitorHttp.get({ url: `${this.URL_BASE}/${id}`, params: {} })
      .then((response: HttpResponse) => {
        if (response.data) {
          return this.processPokemon(response.data);
        }
        return null;
      })
      .catch((error) => {
        console.error('Error al obtener el pokémon individual:', error);
        return null;
      });
  }

  private processPokemon(pokemonData: any): IPokemon {
    const pokemon: IPokemon = {
        id: pokemonData.id,
        name: pokemonData.name,
        type1: pokemonData.types[0].type.name,
        idType1: pokemonData.types[0].type.url.split('/').filter(Boolean).pop(), 
        sprite: pokemonData.sprites.front_default,
        height: pokemonData.height,
        weight: pokemonData.weight,
        stats: pokemonData.stats.map((stat: any) => ({
            base_stat: stat.base_stat,
            name: stat.stat.name
        })),
        abilities: pokemonData.abilities
            .filter((ability: any) => !ability.is_hidden)
            .map((ability: any) => ability.ability.name)
    };

    if (pokemonData.types[1]) {
        pokemon.type2 = pokemonData.types[1].type.name;
        pokemon.idType2 = pokemonData.types[1].type.url.split('/').filter(Boolean).pop();
    }

    const hiddenAbility = pokemonData.abilities.find((ability: any) => ability.is_hidden);
    if (hiddenAbility) {
        pokemon.hiddenAbility = hiddenAbility.ability.name;
    }

    return pokemon;
  }
}