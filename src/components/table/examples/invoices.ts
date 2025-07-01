export interface Invoice {
    id: number;
    invoiceNumber: number;
    invoiceDate: string;
    referencePerson: string;
    amount: number;
}

export const invoices: Invoice[] = [
    {
        id: 1,
        invoiceNumber: 15_467,
        invoiceDate: '02/10/2020',
        referencePerson: 'Fauji Sheladia',
        amount: 21.328,
    },
    {
        id: 2,
        invoiceNumber: 15_433,
        invoiceDate: '03/06/2020',
        referencePerson: 'Mäkelä Jehkinen',
        amount: 9.169,
    },
    {
        id: 3,
        invoiceNumber: 34_326,
        invoiceDate: '30/03/2021',
        referencePerson: 'Helrover Shgrover',
        amount: 1.295,
    },
    {
        id: 4,
        invoiceNumber: 12_357,
        invoiceDate: '14/09/2020',
        referencePerson: 'Goliham Gigantlle',
        amount: 11.468,
    },
    {
        id: 5,
        invoiceNumber: 12_467,
        invoiceDate: '07/08/2020',
        referencePerson: 'Eloise Sullivan',
        amount: 2.583,
    },
    {
        id: 6,
        invoiceNumber: 12_653,
        invoiceDate: '01/01/2021',
        referencePerson: 'Gladys Fyffe',
        amount: 5.201,
    },
    {
        id: 7,
        invoiceNumber: 12_655,
        invoiceDate: '01/01/2021',
        referencePerson: 'Cunninghamarms',
        amount: 5.181,
    },
    {
        id: 8,
        invoiceNumber: 12_622,
        invoiceDate: '23/12/2020',
        referencePerson: 'Agalle Cunningpower',
        amount: 18.257,
    },
];
