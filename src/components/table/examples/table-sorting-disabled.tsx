import { Component, h, Host, State } from '@stencil/core';
import { Column } from '@limetech/lime-elements';
import { invoices, Invoice } from './invoices';

/**
 * Disable column sorting
 *
 * By default, all columns can be sorted by end-users, if they click on
 * a column header. An arrow icon on the header visualizes the
 * direction of sorting, when a column is sorted.
 *
 * To prevent sorting altogether, set the `sortableColumns` property on
 * `limel-table` to `false`. If you only want to disable sorting for a
 * specific column, set the column's `headerSort` property to `false`.
 *
 * The "Reference Person" column below has sorting disabled on the
 * column definition, while the control lets you disable sorting for
 * the whole table.
 *
 * @sourceFile invoices.ts
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
    private disableAllSorting: boolean = false;

    @State()
    private columns: Column[] = [
        { title: 'Invoice no.', field: 'invoiceNumber' },
        { title: 'Invoice Date', field: 'invoiceDate' },
        {
            title: 'Reference Person (no sorting)',
            field: 'referencePerson',
            headerSort: false,
        },
        { title: 'Amount', field: 'amount', horizontalAlign: 'right' },
    ];

    render() {
        return (
            <Host>
                <limel-table
                    data={this.tableData}
                    columns={this.columns}
                    sortableColumns={!this.disableAllSorting}
                />
                <limel-example-controls>
                    <limel-checkbox
                        checked={this.disableAllSorting}
                        label="Disable sorting on all columns"
                        onChange={this.setDisableAllSorting}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private setDisableAllSorting = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disableAllSorting = event.detail;
    };
}
