export interface Person {
    id: number;
    name: string;
    age: number;
    kind: string;
    height: number;
    placeOfBirth: string;
    stamina: string;
    sign: string;
    dateOfBirth: string;
    role: string;
}

export const persons: Person[] = [
    {
        id: 1,
        name: 'Fauji Sheladia',
        age: 29,
        kind: 'Angel',
        height: 95,
        placeOfBirth: 'Palight',
        stamina: '40%',
        sign: '🧚‍♂️',
        dateOfBirth: '14/05/1991',
        role: 'The Big Boss',
    },
    {
        id: 2,
        name: 'Mäkelä Jehkinen',
        age: 42,
        kind: 'Dragon',
        height: 1800,
        stamina: '96%',
        placeOfBirth: 'Ekudshire',
        sign: '🐉',
        dateOfBirth: '30/07/1987',
        role: 'Head of Guardians',
    },
    {
        id: 3,
        name: 'Helrover Shgrover Ohmslmer',
        age: 723,
        kind: 'Elf',
        height: 186,
        stamina: '84%',
        placeOfBirth: 'Blarc',
        sign: '🧝‍♂️',
        dateOfBirth: '29/10/1297',
        role: 'Head of External Politics',
    },
    {
        id: 4,
        name: 'Goliham Gigantlle',
        age: 350,
        kind: 'Yeti',
        height: 325,
        stamina: '95%',
        placeOfBirth: 'Kamond',
        sign: '❄️',
        dateOfBirth: '23/07/1670',
        role: 'Chief Cool Stuff Officer',
    },
    {
        id: 5,
        name: 'Eloise Sullivan',
        age: 35,
        kind: 'Vampire',
        height: 170,
        stamina: '47%',
        placeOfBirth: 'Blodholm',
        sign: '🧛‍♀️',
        dateOfBirth: '10/11/1985',
        role: 'Bloodline Quality Controller',
    },
    {
        id: 6,
        name: 'Gladys E. Fyffe',
        age: 36,
        kind: 'Werewolf',
        height: 176,
        stamina: '83%',
        placeOfBirth: 'Wuacross',
        sign: '🐺',
        dateOfBirth: '06/06/1984',
        role: 'Head Hunter',
    },
    {
        id: 7,
        name: 'Cunninghamarms',
        age: 44,
        kind: 'Ork',
        height: 176,
        stamina: '74%',
        placeOfBirth: 'Bruhgnathal',
        sign: '🐗',
        dateOfBirth: '26/01/1976',
        role: 'Head of Security',
    },
    {
        id: 8,
        name: 'Agalle Cunningpower',
        age: 75,
        kind: 'Wizard',
        height: 176,
        stamina: '40%',
        placeOfBirth: 'Orasas',
        sign: '🔮',
        dateOfBirth: '05/10/1945',
        role: 'Chief Entertainment Officer',
    },
];
