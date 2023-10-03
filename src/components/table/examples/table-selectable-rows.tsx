import {
    Column,
    ColumnAggregate,
    LimelTableCustomEvent,
} from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import { persons, Person } from './persons';

/**
 * Selectable rows with updating aggregates
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
    @State()
    private aggregates: ColumnAggregate[];

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
        },
        { title: 'Kind', field: 'kind' },
        {
            title: 'Height',
            field: 'height',
            horizontalAlign: 'right',
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
        this.updateAggregates();
    }

    public render() {
        return [
            <limel-table
                data={this.tableData}
                activeRow={this.activeRow}
                selectable={true}
                selection={this.selection}
                aggregates={this.aggregates}
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
            <limel-example-controls
                style={{ '--example-controls-max-columns-width': '10rem' }}
            >
                <limel-button label="Select all" onClick={this.selectAll} />
                <limel-button
                    label="Clear selection"
                    onClick={this.clearSelection}
                />
                <limel-button label="Reset" onClick={this.resetSelection} />
            </limel-example-controls>,
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

    private onActivateRow = (event: LimelTableCustomEvent<Person>) => {
        this.activeRow = event.detail;
        this.eventPrinter.writeEvent(event);
    };

    private onSelect = (event: LimelTableCustomEvent<Person[]>) => {
        this.selection = event.detail;
        this.updateAggregates();
        this.eventPrinter.writeEvent(event);
    };

    private onSelectAll = (event: CustomEvent<boolean>) => {
        this.eventPrinter.writeEvent(event);
    };

    private selectAll = () => {
        this.selection = [...this.tableData];
        this.updateAggregates();
    };

    private clearSelection = () => {
        this.selection = [];
        this.updateAggregates();
    };

    private resetSelection = () => {
        this.selection = [...this.defaultSelection];
        this.updateAggregates();
    };

    private updateAggregates = () => {
        this.aggregates = [
            this.getNameAggregate(),
            this.getHeightAggregate(),
            this.getAgeAggregate(),
            this.getStaminaAggregate(),
        ];
    };

    private getNameAggregate = () => {
        const selected = this.selection.length;
        const count = this.tableData.length;
        const value = selected ? `Selected: ${selected}` : `Count: ${count}`;

        return {
            field: 'name',
            value: value,
        };
    };

    private getStaminaAggregate = () => {
        const items = this.selection.length ? this.selection : this.tableData;
        const stamina = items.map((d) => Number.parseInt(d.stamina, 10));
        const minStamina = Math.min(...stamina);
        const maxStamina = Math.max(...stamina);
        let value = `${minStamina}%`;
        if (minStamina !== maxStamina) {
            value = `${minStamina}% - ${maxStamina}%`;
        }

        return {
            field: 'stamina',
            value: value,
        };
    };

    private sumProperty = (
        items: Person[],
        valueProvider: (person: Person) => number
    ) => {
        return items.reduce((s, person) => s + valueProvider(person), 0);
    };

    private getAgeAggregate = () => {
        const items = this.selection.length ? this.selection : this.tableData;
        const sum = this.sumProperty(items, (p) => p.age);
        const avg = sum / items.length || 0;

        return {
            field: 'age',
            value: `Avg: ${Math.round(avg * 100) / 100}`,
        };
    };

    private getHeightAggregate = () => {
        const items = this.selection.length ? this.selection : this.tableData;
        const sum = this.sumProperty(items, (p) => p.height);

        return {
            field: 'height',
            value: `${sum} cm`,
        };
    };
}
