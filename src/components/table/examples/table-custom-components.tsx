import { Component, h } from '@stencil/core';
import { Column } from '@limetech/lime-elements';
import { data, Bird } from './birds';
import { capitalize } from 'lodash-es';

/**
 * Custom components
 *
 * You can specify a custom component to use for any column in your table. This
 * is done under the `component` key in the schema, following the
 * [TableComponentDefinition](#/type/TableComponentDefinition/) specification,
 * for example:
 *
 * ```ts
 * const columns = [
 * {
 * title: 'Food',
 * field: 'food',
 * component: { name: 'my-fancy-food-displayer' },
 * },
 * ];
 * ```
 *
 * While you can, in principle, use any component in a table, your custom table
 * components should implement the [TableComponent](#/type/TableComponent/)
 * interface.
 * @link birds.ts
 * @link table-food.tsx
 */
@Component({
    tag: 'limel-example-table-custom-components',
    styleUrl: 'table.scss',
    shadow: true,
})
export class TableExampleCustomComponents {
    private columns: Array<Column<Bird>> = [];

    public componentWillLoad() {
        this.columns = [
            { title: 'Name', field: 'name' },
            { title: 'Binominal name', field: 'binominalName' },
            {
                title: 'Wingspan',
                field: 'wingspan',
                formatter: this.addUnit('cm'),
            },
            {
                title: 'Food',
                field: 'food',
                component: { name: 'limel-example-table-food' },
            },
            {
                title: 'Habitat',
                field: 'habitat',
                formatter: this.capitalizeStrings,
            },
            { title: 'Nest type', field: 'nest', formatter: capitalize },
            {
                title: 'Eggs per clutch',
                field: 'eggs',
                horizontalAlign: 'right',
            },
            { title: 'Origin', field: 'origin' },
        ];
    }

    private addUnit = (unit: string) => (value: any) => {
        return `${value} ${unit}`;
    };

    private capitalizeStrings(value: string | string[]) {
        if (typeof value === 'string') {
            return capitalize(value);
        }

        if (Array.isArray(value)) {
            return value.map((v) => capitalize(v)).join(', ');
        }

        return value;
    }

    public render() {
        return <limel-table data={data} columns={this.columns} />;
    }
}
