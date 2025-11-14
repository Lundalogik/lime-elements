import { Component, h, State } from '@stencil/core';
import { Column } from '@limetech/lime-elements';
import { Person, persons } from './persons';

/**
 * Basic example
 *
 * :::note
 * Each object is recommended to expose a stable `id` (string or number).
 * The table relies on that identifier to update rows in place so that
 * scroll position, focus, and selections remain intact across renders.
 *
 * Rows without an `id` are treated as new data on every update.
 * Therefore if the user clicks on a row at the bottom of the table,
 * it will be treated as new data and will force a full redraw,
 * resulting in the table to scroll to the top again.
 * :::
 *
 * @sourceFile persons.ts
 */
@Component({
    tag: 'limel-example-table',
    styleUrl: 'table.scss',
    shadow: true,
})
export class TableExample {
    @State()
    private tableData: Person[] = persons;

    @State()
    private columns: Column[] = [
        { title: 'Name', field: 'name' },
        { title: 'Age', field: 'age', horizontalAlign: 'right' },
        { title: 'Kind', field: 'kind' },
        { title: 'Height', field: 'height', horizontalAlign: 'right' },
        { title: 'Stamina', field: 'stamina' },
        { title: 'Place of Birth', field: 'placeOfBirth' },
        { title: 'Sign', field: 'sign' },
        { title: 'Date of Birth', field: 'dateOfBirth' },
        { title: 'Role', field: 'role' },
    ];

    render() {
        return <limel-table data={this.tableData} columns={this.columns} />;
    }
}
