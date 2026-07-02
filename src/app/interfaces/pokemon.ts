import { Istats } from './istats';

export interface IPokemon {
    id: string;
    name: string;
    type1: string;
    idType1?: string;
    type2?: string;
    idType2?: string;
    height: string;
    sprite: string;
    weight: string;
    abilities: string[];
    hiddenAbility?: string;
    stats: Istats[];
}