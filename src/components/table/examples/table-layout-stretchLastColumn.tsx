import { Component, h, State } from '@stencil/core';
import { Column } from '@limetech/lime-elements';
import { invoices, Invoice } from './invoices';

/**
 *
 *````tsx
 *layout="stretchLastColumn"
 *````
 *
 *Works just like `default`, but unlike the default layout
 *which resulted in having an empty last column, in this layout
 *the last existing column will stretch out to fill up the remaining table width.
 * @link invoices.ts
 */
@Component({
    tag: 'limel-example-table-layout-stretch-last-column',
    styleUrl: 'table.scss',
    shadow: true,
})
export class TableExampleLayoutStretchLastColumn {
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
                layout="stretchLastColumn"
            />
        );
    }
}
