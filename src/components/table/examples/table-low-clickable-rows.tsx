import { Component, h, State } from '@stencil/core';
import { Column } from '@limetech/lime-elements';

/**
 * Visualizing clickable rows better
 * By taking advantage of the `has-interactive-rows` class, hovering on a row
 * will display an elevated visual effect, giving it more affordance and a solid
 * feeling of interactivity.
 *
 * :::note usage notes
 * - Only use this class when clicking on an entire row triggers a reaction in
 * the system, for example a card or a modal is opened to show further details.
 *:::
 */
@Component({
    tag: 'limel-example-table-interactive-rows',
    styleUrl: 'table.scss',
    shadow: true,
})
export class TableExample {
    @State()
    public tableData: any[] = [
        {
            id: 1,
            invoiceNumber: '15467',
            clientNumber: '98457',
            vat: '5,325',
            amount: '21,300',
            invoiceDate: '02/10/2020',
            referencePerson: 'Fauji Sheladia',
        },
        {
            id: 2,
            invoiceNumber: '15433',
            clientNumber: '43256',
            vat: '2,292',
            amount: '9,169',
            invoiceDate: '03/06/2020',
            referencePerson: 'Mäkelä Jehkinen',
        },
        {
            id: 3,
            invoiceNumber: '34326',
            clientNumber: '12456',
            vat: '234',
            amount: '1,295',
            invoiceDate: '30/03/2021',
            referencePerson: 'Helrover Shgrover',
        },
        {
            id: 4,
            invoiceNumber: '12357',
            clientNumber: '22334',
            vat: '2,867',
            amount: '11,468',
            invoiceDate: '14/09/2020',
            referencePerson: 'Goliham Gigantlle',
        },
        {
            id: 5,
            invoiceNumber: '12467',
            clientNumber: '54555',
            vat: '625',
            amount: '2,500',
            invoiceDate: '07/08/2020',
            referencePerson: 'Eloise Sullivan',
        },
        {
            id: 6,
            invoiceNumber: '12653',
            clientNumber: '45365',
            vat: '1,300',
            amount: '5,201',
            invoiceDate: '01/01/2021',
            referencePerson: 'Gladys Fyffe',
        },
        {
            id: 7,
            invoiceNumber: '12655',
            clientNumber: '76476',
            vat: '1,295',
            amount: '5,180',
            invoiceDate: '01/01/2021',
            referencePerson: 'Cunninghamarms',
        },
        {
            id: 8,
            invoiceNumber: '12622',
            clientNumber: '65345',
            vat: '4,550',
            amount: '18,200',
            invoiceDate: '23/12/2020',
            referencePerson: 'Agalle Cunningpower',
        },
    ];
    @State()
    public columns: Column[] = [
        { title: 'Invoice no.', field: 'invoiceNumber' },
        { title: 'Client no.', field: 'clientNumber' },
        { title: 'VAT', field: 'vat', horizontalAlign: 'right' },
        { title: 'Amount', field: 'amount', horizontalAlign: 'right' },
        { title: 'Invoice Date', field: 'invoiceDate' },
        { title: 'Reference Person', field: 'referencePerson' },
    ] as any;

    render() {
        return (
            <limel-table
                data={this.tableData}
                columns={this.columns}
                class="has-interactive-rows"
            />
        );
    }
}
