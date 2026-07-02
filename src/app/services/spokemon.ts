import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core'; // <- Importaciones necesarias
import { IPokemon } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root',
  })
export class SPokemon {
  
  private readonly URL_BASE = 'https://pokeapi.co/api/v2/pokemon';
  private nextUrl = `${this.URL_BASE}?limit=20&offset=0`; // Nota: corregido 'limit=20' (le faltaba el '=')

  // Envolvemos el fragmento suelto dentro del método que invoca tu página
getPokemons() {
    if (this.nextUrl) {

        return CapacitorHttp.get({ url: this.nextUrl, params: {} })
            .then(async (response: HttpResponse) => {
                console.log("La respuesta es: ");
                console.log(response);

                // declaración del tipo de dato a retornar
                const pokemons: IPokemon[] = [];

                // Confirma si tiene el atributo data
                if (response.data) {
                    const result: any[] = response.data.results; // <- Cambiado de [] a any[] para evitar errores de tipo
                    this.nextUrl = response.data.next; // almacena el url para el siguiente grupo
                    const promises: Promise<HttpResponse>[] = []; // Se crea un arreglo de promesas

                    result.forEach((result: any) => { // se itera sobre cada elemento
                        const urlPokemon = result.url; // se almacena la url de inf. del pokemon
                        // Se crea una promesa para cada elemento y se almacena en el arreglo de promesas
                        promises.push(CapacitorHttp.get({ url: urlPokemon, params: {} }));
                    });

                    await Promise.all(promises).then((responses: any) => {
                        const arrayResponses: any[] = responses; // <- Cambiado de [] a any[]

                        // Se itera sobre cada pokemon obtenido
                        arrayResponses.forEach((respoPokemon: any) => {
                            // se llama a la función
                            const pokemon = this.processPokemon(respoPokemon.data);
                            pokemons.push(pokemon);
                        });
                    });

                    return pokemons; // Ruta 1: Si hay data, regresa la lista
                }

                return []; // <- SOLUCIÓN: Ruta 2: Si por alguna razón no hay response.data, regresa un arreglo vacío
            });
    }
    return null;
}

private processPokemon(pokemonData: any): IPokemon {
    const pokemon: IPokemon = {
        id: pokemonData.id,
        name: pokemonData.name,
        type1: pokemonData.types[0].type.name,
        // Agregamos esta línea para extraer el ID numérico del Tipo 1:
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

    // Si existe un segundo tipo
    if (pokemonData.types[1]) {
        pokemon.type2 = pokemonData.types[1].type.name;
        // Agregamos esta línea para extraer el ID numérico del Tipo 2:
        pokemon.idType2 = pokemonData.types[1].type.url.split('/').filter(Boolean).pop();
    }

    // Buscar habilidad oculta
    const hiddenAbility = pokemonData.abilities.find(
        (ability: any) => ability.is_hidden
    );
    
    if (hiddenAbility) {
        pokemon.hiddenAbility = hiddenAbility.ability.name;
    }

    return pokemon;
    }
}