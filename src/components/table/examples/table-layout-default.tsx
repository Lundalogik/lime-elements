import { Component, h, State } from '@stencil/core';
import { Column } from '@limetech/lime-elements';
import { invoices, Invoice } from './invoices';

/**
 * Layout
 * Columns and their content can be decisive factors in how a table is
 * preferred to rendered in the user interface. To set your preferred
 * rendering, choose one of the available `layout` properties.
 *
 *
 * ````tsx
 * layout="default"
 * ````
 * The default layout resizes the table's columns,
 * in a way that each column becomes as wide as the data it holds.
 *
 * :::important
 * Note that be default, table columns have a maximum width of `40rem`.
 * This means, they can never grow wider than that, unless you specify
 * another size using the `--table-max-column-width` CSS variable.
 *
 * This applies to all other layouts presented further down as well!
 * :::
 *
 * If there is additional space available on the right side of the last column,
 * rows will stretch to fill the space and look visually as wide as the table.
 *
 * :::note
 * While scrolling, new rows get lazy-loaded. Since the new data may have wider
 * length, it might affect rendering of the layout in real-time.
 * This means columns can get resized while user is scrolling down.
 * :::
 *
 * :::tip
 * It is also possible to affect internal layout of each column, by specifying
 * `horizontalAlign` on the column headers, to `left` (default), `center`,
 * or `right`. This basically defines the text-alignment for all the cells in that column.
 * :::
 * @link invoices.ts
 */
@Component({
    tag: 'limel-example-table-layout-default',
    styleUrl: 'table.scss',
    shadow: true,
})
export class TableExampleLayoutDefault {
    @State()
    private tableData: Invoice[] = invoices;

    @State()
    public columns: Column[] = [
        { title: 'Invoice no.', field: 'invoiceNumber' },
        { title: 'Invoice Date', field: 'invoiceDate' },
        { title: 'Reference Person', field: 'referencePerson' },
        {
            title: 'Amount',
            field: 'amount',
            horizontalAlign: 'right',
        },
    ];

    render() {
        return (
            <limel-table
                data={this.tableData}
                columns={this.columns}
                layout="default"
            />
        );
    }
}
