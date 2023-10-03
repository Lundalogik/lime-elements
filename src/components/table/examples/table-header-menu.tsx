import { Component, h } from '@stencil/core';
import { Column } from '@limetech/lime-elements';
import { persons, Person } from './persons';

/**
 * Column header menu
 *
 * You can also add custom components to the header cell of a column. In
 * contrast to custom components used elsewhere in the table, custom components
 * used in the header do not replace the entire content of the cell. Instead,
 * they appear in a slot next to the column sorting icon.
 * @link persons.ts
 * @link header-menu.tsx
 */
@Component({
    tag: 'limel-example-table-header-menu',
    shadow: true,
    styleUrl: 'table.scss',
})
export class TableExampleHeadermenu {
    private tableData: Person[] = persons;
    private columns: Column[] = [
        {
            title: 'Name',
            field: 'name',
            headerComponent: {
                name: 'limel-example-header-menu',
                props: {
                    icon: 'menu',
                    items: [
                        { text: 'All' },
                        { text: 'Me' },
                        { text: 'Contains' },
                        { text: 'Equals' },
                        { text: 'Not equals' },
                    ],
                },
            },
        },
        {
            title: 'Age',
            field: 'age',
            horizontalAlign: 'right',
        },
        {
            title: 'Kind',
            field: 'kind',
        },
        {
            title: 'Height',
            field: 'height',
            horizontalAlign: 'right',
        },
        {
            title: 'Stamina',
            field: 'stamina',
        },
        {
            title: 'Place of Birth',
            field: 'placeOfBirth',
        },
        {
            title: 'Sign',
            field: 'sign',
        },
        {
            title: 'Date of Birth',
            field: 'dateOfBirth',
        },
        {
            title: 'Role',
            field: 'role',
        },
    ];

    public render() {
        return [<limel-table data={this.tableData} columns={this.columns} />];
    }
}
