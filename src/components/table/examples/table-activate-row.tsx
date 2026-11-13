import { Column, LimelTableCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { persons, Person } from './persons';

/**
 * Activate a row
 *
 * Use this when clicking a row should do something, for example open the
 * record in a side panel.
 *
 * When the user clicks a row, it becomes the active row, and the table emits
 * `activate` with the data of that row. Clicking the active row again makes
 * no row active, and `activate` is emitted with `null`.
 *
 * Keep the active row in your own state and pass it back as `activeRow`, so
 * that the table shows which row is active. The table finds that row by its
 * `id`, so `activeRow` does not have to be the same object as the one in
 * `data`. A row without an `id` is only found when it is that same object.
 *
 * :::note
 * A click on a row's checkbox, or a click that a component inside a cell
 * cancels with `event.preventDefault()`, does not activate the row. Use this
 * for a button in a cell, which should do its own thing. Do not use it for a
 * link: `preventDefault()` also stops the link from opening.
 * :::
 *
 * :::tip
 * The `has-interactive-rows` class on `limel-table` makes the rows look
 * clickable. See _Visualizing clickable rows better_ below.
 * :::
 *
 * @sourceFile persons.ts
 */
@Component({
    tag: 'limel-example-table-activate-row',
    styleUrl: 'table-basic.scss',
    shadow: true,
})
export class TableExampleActivateRow {
    @State()
    private activeRow: Person;

    private tableData: Person[] = persons;
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

    public render() {
        return [
            <limel-table
                data={this.tableData}
                activeRow={this.activeRow}
                columns={this.columns}
                onActivate={this.onActivateRow}
                class="has-interactive-rows"
            />,
            <limel-example-value label="Active row" value={this.activeRow} />,
        ];
    }

    private onActivateRow = (event: LimelTableCustomEvent<Person>) => {
        this.activeRow = event.detail;
    };
}
