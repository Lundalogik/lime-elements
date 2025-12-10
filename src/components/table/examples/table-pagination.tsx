import { Component, h, Host, State } from '@stencil/core';
import {
    Column,
    Option,
    LimelSelectCustomEvent,
} from '@limetech/lime-elements';
import { data, Bird } from './birds';
import { capitalize } from 'lodash-es';

/**
 * Pagination
 * By specifying a `pageSize`, you can enable pagination for the table.
 *
 * Additionally, you can control the location of the pagination controls
 * by setting the `paginationLocation` property to either `top` or `bottom`.
 *
 * @sourceFile birds.ts
 */
@Component({
    tag: 'limel-example-table-pagination',
    styleUrl: 'table.scss',
    shadow: true,
})
export class TablePaginationExample {
    @State()
    private columns: Array<Column<Bird>> = [
        { title: 'Name', field: 'name' },
        { title: 'Binominal name', field: 'binominalName' },
        { title: 'Nest type', field: 'nest', formatter: capitalize },
        { title: 'Eggs per clutch', field: 'eggs', horizontalAlign: 'right' },
        { title: 'Origin', field: 'origin' },
    ];

    @State()
    private paginationLocation: 'top' | 'bottom' = 'bottom';

    private readonly paginationLocationOptions: Option[] = [
        { text: 'Top', value: 'top' },
        { text: 'Bottom', value: 'bottom' },
    ];

    private readonly pageSize = 5;

    render() {
        return (
            <Host>
                <limel-table
                    data={data}
                    columns={this.columns}
                    pageSize={this.pageSize}
                    paginationLocation={this.paginationLocation}
                />
                <limel-example-controls>
                    <limel-select
                        label="Pagination location"
                        value={this.getSelectedPaginationLocation()}
                        options={this.paginationLocationOptions}
                        onChange={this.handlePaginationLocationChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private readonly getSelectedPaginationLocation = (): Option => {
        return this.paginationLocationOptions.find(
            (option) => option.value === this.paginationLocation
        );
    };

    private readonly handlePaginationLocationChange = (
        event: LimelSelectCustomEvent<Option>
    ) => {
        this.paginationLocation = event.detail.value as 'top' | 'bottom';
    };
}
