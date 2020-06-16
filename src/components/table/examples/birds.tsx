export interface Bird {
    name: string;
    binominalName: string;
    wingspan: number;
    habitat: Habitat | Habitat[];
    food: Food | Food[];
    nest: Nest;
    eggs: number;
    origin: string | string[];
}

export type Habitat = 'forest' | 'grassland' | 'wetland';
export type Food = 'invertebrate' | 'seed' | 'fruit' | 'fish' | 'rodent';
export type Nest = 'bowl' | 'cavity' | 'ground' | 'platform';

export const data: Bird[] = [
    {
        name: 'Greater Roadrunner',
        binominalName: 'Geococcyx californianus',
        wingspan: 56,
        habitat: 'grassland',
        food: ['invertebrate', 'rodent'],
        nest: 'platform',
        eggs: 6,
        origin: 'North America',
    },
    {
        name: 'American Bittern',
        binominalName: 'Botaurus lentiginosus',
        wingspan: 107,
        habitat: 'wetland',
        food: ['invertebrate', 'fish', 'rodent'],
        nest: 'platform',
        eggs: 6,
        origin: 'North America',
    },
    {
        name: 'Bobolink',
        binominalName: 'Dolichonyx oryzivorus',
        wingspan: 30,
        habitat: 'grassland',
        food: ['invertebrate', 'seed'],
        nest: 'ground',
        eggs: 6,
        origin: 'America',
    },
    {
        name: 'Northern Cardinal',
        binominalName: 'Cardinalis cardinalis',
        wingspan: 30,
        habitat: 'forest',
        food: ['seed', 'fruit'],
        nest: 'bowl',
        eggs: 4,
        origin: 'North America',
    },
    {
        name: 'Ruddy Duck',
        binominalName: 'Oxyura jamaicensis',
        wingspan: 48,
        habitat: 'wetland',
        food: ['invertebrate', 'seed'],
        nest: 'platform',
        eggs: 15,
        origin: 'America',
    },
    {
        name: 'White Wagtail',
        binominalName: 'Motacilla alba',
        wingspan: 28,
        habitat: ['grassland', 'wetland'],
        food: 'invertebrate',
        nest: 'bowl',
        eggs: 8,
        origin: ['Europe', 'Asia', 'Africa'],
    },
    {
        name: 'Short-toed Treecreeper',
        binominalName: 'Certhia brachydactyla',
        wingspan: 20,
        habitat: 'forest',
        food: ['invertebrate', 'seed'],
        nest: 'cavity',
        eggs: 7,
        origin: 'Europe',
    },
    {
        name: 'Ruff',
        binominalName: 'Calidris pugnax',
        wingspan: 56,
        habitat: ['wetland', 'grassland'],
        food: ['invertebrate', 'fruit', 'fish', 'rodent', 'seed'],
        nest: 'ground',
        eggs: 4,
        origin: ['Europe', 'Asia', 'Africa'],
    },
    {
        name: 'Common Chiffchaff',
        binominalName: 'Phylloscopus collybita',
        wingspan: 20,
        habitat: ['wetland', 'forest'],
        food: ['invertebrate', 'fruit', 'seed'],
        nest: 'ground',
        eggs: 6,
        origin: ['Europe', 'Africa'],
    },
    {
        name: 'Common Little Bittern',
        binominalName: 'Ixobrychus minutus',
        wingspan: 49,
        habitat: 'wetland',
        food: ['invertebrate', 'fish'],
        nest: 'platform',
        eggs: 6,
        origin: ['Europe', 'Asia', 'Africa'],
    },
    {
        name: 'Willet',
        binominalName: 'Tringa semipalmata',
        wingspan: 66,
        habitat: 'wetland',
        food: ['invertebrate', 'fish'],
        nest: 'ground',
        eggs: 4,
        origin: 'America',
    },
    {
        name: 'Yellow-Rumped Warbler',
        binominalName: 'Setophaga coronata',
        wingspan: 23,
        habitat: 'forest',
        food: ['invertebrate', 'seed', 'fruit'],
        nest: 'bowl',
        eggs: 5,
        origin: 'North America',
    },
    {
        name: 'Eurasian Magpie',
        binominalName: 'Pica pica',
        wingspan: 56,
        habitat: 'grassland',
        food: ['invertebrate', 'fruit', 'seed', 'fish', 'rodent'],
        nest: 'platform',
        eggs: 6,
        origin: ['Europe', 'Asia'],
    },
    {
        name: 'Dunnock',
        binominalName: 'Prunella modularis',
        wingspan: 20,
        habitat: 'forest',
        food: ['invertebrate', 'seed'],
        nest: 'bowl',
        eggs: 5,
        origin: ['Europe', 'Asia'],
    },
    {
        name: "Wilson's Snipe",
        binominalName: 'Gallinago delicata',
        wingspan: 41,
        habitat: 'wetland',
        food: 'invertebrate',
        nest: 'ground',
        eggs: 3,
        origin: 'America',
    },
    {
        name: 'Little Bustard',
        binominalName: 'Tetrax tetrax',
        wingspan: 110,
        habitat: 'grassland',
        food: ['invertebrate', 'seed'],
        nest: 'ground',
        eggs: 5,
        origin: ['Europe', 'Asia'],
    },
    {
        name: 'Dickcissel',
        binominalName: 'Spiza americana',
        wingspan: 25,
        habitat: 'grassland',
        food: ['invertebrate', 'seed'],
        nest: 'ground',
        eggs: 4,
        origin: 'America',
    },
    {
        name: 'Prothonotary Warbler',
        binominalName: 'Protonotaria citrea',
        wingspan: 23,
        habitat: ['forest', 'wetland'],
        food: ['invertebrate', 'seed'],
        nest: 'cavity',
        eggs: 7,
        origin: 'North America',
    },
    {
        name: 'Killdeer',
        binominalName: 'Charadrius vociferus',
        wingspan: 46,
        habitat: ['wetland', 'grassland'],
        food: ['invertebrate', 'seed'],
        nest: 'ground',
        eggs: 6,
        origin: 'America',
    },
    {
        name: 'Tufted Titmouse',
        binominalName: 'Baeolophus bicolor',
        wingspan: 25,
        habitat: 'forest',
        food: ['invertebrate', 'seed', 'fruit'],
        nest: 'cavity',
        eggs: 7,
        origin: 'North America',
    },
    {
        name: 'Black-Tailed Godwit',
        binominalName: 'Limosa limosa',
        wingspan: 76,
        habitat: 'wetland',
        food: ['invertebrate', 'seed'],
        nest: 'ground',
        eggs: 6,
        origin: ['Europe', 'Asia', 'Africa', 'Australia'],
    },
    {
        name: 'Yellow-Breasted Chat',
        binominalName: 'Icteria virens',
        wingspan: 25,
        habitat: ['wetland', 'grassland', 'forest'],
        food: ['invertebrate', 'fruit'],
        nest: 'bowl',
        eggs: 5,
        origin: 'North America',
    },
    {
        name: 'Purple Martin',
        binominalName: 'Progne subis',
        wingspan: 46,
        habitat: ['wetland', 'grassland'],
        food: 'invertebrate',
        nest: 'cavity',
        eggs: 6,
        origin: 'America',
    },
    {
        name: 'Goldcrest',
        binominalName: 'Regulus regulus',
        wingspan: 15,
        habitat: 'forest',
        food: 'invertebrate',
        nest: 'bowl',
        eggs: 11,
        origin: ['Europe', 'Asia'],
    },
    {
        name: 'King Rail',
        binominalName: 'Rallus elegans',
        wingspan: 51,
        habitat: 'wetland',
        food: ['invertebrate', 'fish', 'fruit', 'seed', 'rodent'],
        nest: 'platform',
        eggs: 14,
        origin: 'North America',
    },
];
