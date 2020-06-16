import { Component, h, Prop } from '@stencil/core';
import { TableComponent } from '@limetech/lime-elements';
import { Bird, Food } from './birds';
import { capitalize } from 'lodash-es';

@Component({
    tag: 'limel-example-table-food',
    styleUrl: 'table-food.scss',
    shadow: true,
})
export class TableFood implements TableComponent<Bird> {
    @Prop()
    public field: string;

    @Prop()
    public value: any;

    @Prop()
    public data: Bird;

    public render() {
        let value: string[] = this.value;
        if (!Array.isArray(value)) {
            value = [value];
        }

        return value.map(this.renderIcon);
    }

    private renderIcon(value: Food) {
        const nameMap: Record<Food, string> = {
            fruit: 'cherry',
            invertebrate: 'caterpillar',
            rodent: 'rabbit',
            seed: 'wheat',
            fish: 'fish',
        };

        return (
            <limel-icon
                title={capitalize(value)}
                badge={true}
                name={nameMap[value]}
                size="x-small"
            />
        );
    }
}
