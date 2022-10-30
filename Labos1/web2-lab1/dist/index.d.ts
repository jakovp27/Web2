import { Utakmica } from './Utakmica';
import { Tim } from './Tim';
export declare function getTeams(): Promise<Tim[]>;
export declare function getGames(): Promise<Utakmica[]>;
export declare function updateTimovi(n1: string, n2: string, rez: number, stari_rez: number): Promise<void>;
export declare function getRez(n1: string, n2: string): Promise<number>;
export declare function updateUtakmica(n1: string, n2: string, v1: number, v2: number): Promise<void>;
