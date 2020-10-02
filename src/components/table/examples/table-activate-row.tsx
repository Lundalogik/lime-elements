import { Component, h, State } from '@stencil/core';
import { Column } from '../table.types';
import { persons, Person } from './persons';

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
        { title: 'Age', field: 'age' },
        { title: 'Kind', field: 'kind' },
        { title: 'Height', field: 'height' },
        { title: 'Stamina', field: 'stamina' },
        { title: 'Place of Birth', field: 'placeOfBirth' },
        { title: 'Sign', field: 'sign' },
        { title: 'Date of Birth', field: 'dateOfBirth' },
        { title: 'Role', field: 'role' },
    ];

    constructor() {
        this.onActivateRow = this.onActivateRow.bind(this);
    }

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

    private onActivateRow(event: CustomEvent<Person>) {
        this.activeRow = event.detail;
    }
}
