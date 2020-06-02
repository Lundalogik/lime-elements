import { Component, Host, h, Prop, Element, State } from '@stencil/core';
import { Column } from '../table';

@Component({
    tag: 'limel-example-table',
    styleUrl: 'table.scss',
    shadow: true,
})
export class TableExample {
    @State()
    public tableData: any[] = [
        {
            id: 1,
            name: 'Billy Bob',
            age: 12,
            gender: 'male',
            height: 95,
            color: 'red',
            dateOfBirth: '14/05/2010',
        },
        {
            id: 2,
            name: 'Jenny Jane',
            age: 42,
            gender: 'female',
            height: 142,
            color: 'blue',
            dateOfBirth: '30/07/1954',
        },
        {
            id: 3,
            name: 'Steve McAlistaire',
            age: 35,
            gender: 'male',
            height: 176,
            color: 'green',
            dateOfBirth: '04/11/1982',
        },
    ];
    @State()
    public columns: Column[] = [
        { title: 'Name', field: 'name' },
        { title: 'Age', field: 'age' },
        { title: 'Gender', field: 'gender' },
        { title: 'Height', field: 'height' },
        { title: 'Favourite Color', field: 'color' },
        { title: 'Date Of Birth', field: 'dateOfBirth' },
    ] as any;

    render() {
        return <limel-table data={this.tableData} columns={this.columns} />;
    }
}
