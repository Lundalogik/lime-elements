import { Component, h, State } from '@stencil/core';
import { Column, ColumnAggregatorType } from '../table.types';
import { persons, Person } from './persons';

/**
 * Select rows
 *
 * @link persons.ts
 */
@Component({
    tag: 'limel-example-table-selectable-rows',
    styleUrl: 'table-selectable-rows.scss',
    shadow: true,
})
export class TableExampleSelectableRows {
    @State()
    private activeRow: Person;
    @State()
    private selection: Person[];

    private tableData: Person[] = persons;
    private defaultSelection = [persons[0], persons[2]];

    private columns: Column[] = [
        {
            title: 'Name',
            field: 'name',
        },
        {
            title: 'Age',
            field: 'age',
            horizontalAlign: 'right',
            aggregator: ColumnAggregatorType.Average,
        },
        { title: 'Kind', field: 'kind' },
        {
            title: 'Height',
            field: 'height',
            horizontalAlign: 'right',
            aggregator: ColumnAggregatorType.Sum,
        },
        { title: 'Stamina', field: 'stamina' },
        { title: 'Place of Birth', field: 'placeOfBirth' },
        { title: 'Sign', field: 'sign' },
        { title: 'Date of Birth', field: 'dateOfBirth' },
        { title: 'Role', field: 'role' },
    ];

    private eventPrinter: HTMLLimelExampleEventPrinterElement;

    constructor() {
        this.selection = [...this.defaultSelection];
    }

    public render() {
        return [
            <limel-button label="Select all" onClick={this.selectAll} />,
            <limel-button
                label="Clear selection"
                onClick={this.clearSelection}
            />,
            <limel-button label="Reset" onClick={this.resetSelection} />,
            <limel-table
                data={this.tableData}
                activeRow={this.activeRow}
                selectable={true}
                selection={this.selection}
                columns={this.columns}
                onActivate={this.onActivateRow}
                onSelect={this.onSelect}
                onSelectAll={this.onSelectAll}
                pageSize={5}
                mode="local"
                totalRows={persons.length}
                movableColumns={true}
                class="has-interactive-rows"
            />,
            <limel-example-value label="Active row" value={this.activeRow} />,
            <limel-example-value
                label={`Selected rows: (${this.selection?.length || 0})`}
                value={this.selection}
            />,
            <limel-example-event-printer
                ref={(el) => (this.eventPrinter = el)}
            />,
        ];
    }

    private onActivateRow = (event: CustomEvent<Person>) => {
        this.activeRow = event.detail;
        this.eventPrinter.writeEvent(event);
    };

    private onSelect = (event: CustomEvent<Person[]>) => {
        this.selection = event.detail;
        this.eventPrinter.writeEvent(event);
    };

    private onSelectAll = (event: CustomEvent<boolean>) => {
        this.eventPrinter.writeEvent(event);
    };

    private selectAll = () => {
        this.selection = [...this.tableData];
    };

    private clearSelection = () => {
        this.selection = [];
    };

    private resetSelection = () => {
        this.selection = [...this.defaultSelection];
    };
}
