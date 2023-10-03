import { Column, LimelTableCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { persons, Person } from './persons';

/**
 * Activate a row
 * @link persons.ts
 */
@Component({
    tag: 'limel-example-table-activate-row',
    styleUrl: 'table.scss',
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
