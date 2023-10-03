import { Component, h, State } from '@stencil/core';
import { Column } from '@limetech/lime-elements';
import { invoices, Invoice } from './invoices';

/**
 *
 *````tsx
 *layout="stretchColumns"
 *````
 *
 *With this layout, the table stretches columns so that all
 *fit perfectly in the table container, when extra space is available.
 *If all columns cannot fit within the available width,
 *then a horizontal scrollbar will appear.
 * @link invoices.ts
 */
@Component({
    tag: 'limel-example-table-layout-stretch-columns',
    styleUrl: 'table.scss',
    shadow: true,
})
export class TableExampleLayoutStretchColumns {
    @State()
    private tableData: Invoice[] = invoices;

    @State()
    public columns: Column[] = [
        { title: 'Invoice no.', field: 'invoiceNumber' },
        { title: 'Invoice Date', field: 'invoiceDate' },
        { title: 'Reference Person', field: 'referencePerson' },
        { title: 'Amount', field: 'amount', horizontalAlign: 'right' },
    ];

    render() {
        return (
            <limel-table
                data={this.tableData}
                columns={this.columns}
                layout="stretchColumns"
            />
        );
    }
}
