import { Component, h, State } from '@stencil/core';
import { Column } from '@limetech/lime-elements';
import { invoices, Invoice } from './invoices';

/**
 *
 *````tsx
 *layout="lowDensity"
 *````
 *By using this layout option, you can easily convert the table into an airy list of items.
 *
 *This type of UI is suitable for generating minimalist lists of items with
 *only a few properties on each. Especially when the property values are not
 *self-explanatory (such as an email address) and require a bit of extra help
 *to know what they are.
 *
 *Using this UI, you can take advantage of the sticky header of the table which
 *explains what each cell is about, and also enjoy sorting possibilities it
 *offers.
 *
 *:::note usage notes
 *- In this low-density UI, all cells will get a fixed height, which may affect
 *the layout of custom components that you place inside them.
 *- This UI is not preferred for data intensive views, in which the user's main
 *task is processing the presented data and making sense of it. For such views,
 *use the table component with its normal density.
 *:::
 * @link invoices.ts
 */
@Component({
    tag: 'limel-example-table-layout-low-density',
    styleUrl: 'table.scss',
    shadow: true,
})
export class TableExampleLayoutLowDensity {
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
                layout="lowDensity"
            />
        );
    }
}
