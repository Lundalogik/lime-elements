import { Component, h, State } from '@stencil/core';
import { Column } from '@limetech/lime-elements';
import { Person, persons } from './persons';

/**
 *
 * @link persons.ts
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
