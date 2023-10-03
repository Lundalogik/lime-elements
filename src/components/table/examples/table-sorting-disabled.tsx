import { Component, h, State } from '@stencil/core';
import { Column } from '@limetech/lime-elements';
import { invoices, Invoice } from './invoices';

/**
 * Disable column sorting
 *
 * By default, all columns can be sorted by end-users, if they click on
 * a column header. An arrow icon on the header visualizes the
 * direction of sorting, when a column is sorted.
 *
 * However, you can disable the sorting possibility in individual columns,
 * by setting the `headerSort` to `false`.
 * @link invoices.ts
 */
@Component({
    tag: 'limel-example-table-sorting-disabled',
    styleUrl: 'table.scss',
    shadow: true,
})
export class TableExampleSortingDisabled {
    @State()
    private tableData: Invoice[] = invoices;

    @State()
    public columns: Column[] = [
        { title: 'Invoice no.', field: 'invoiceNumber' },
        { title: 'Invoice Date', field: 'invoiceDate' },
        {
            title: 'Reference Person',
            field: 'referencePerson',
            headerSort: false,
        },
        { title: 'Amount', field: 'amount', horizontalAlign: 'right' },
    ];

    render() {
        return <limel-table data={this.tableData} columns={this.columns} />;
    }
}
