import { Component, h, Prop, EventEmitter, Event } from '@stencil/core';
import { FormComponent } from '@limetech/lime-elements';
import { ListItem } from 'src/components/list/list-item.types';

@Component({
    tag: 'limel-example-custom-picker',
    shadow: true,
})
export class CustomPickerExample implements FormComponent<number> {
    @Prop()
    public value: number;

    @Prop()
    public title: string;

    @Prop()
    public required: boolean;

    @Prop()
    public readonly: boolean;

    @Prop()
    public disabled: boolean;

    @Event()
    public change: EventEmitter<number>;

    private heroes: Array<ListItem<number>> = [
        {
            text: 'Superman',
            value: 1001,
            icon: 'superman',
            iconColor: 'var(--lime-deep-red)',
        },
        {
            text: 'Squirrel Girl',
            value: 1002,
            icon: 'squirrel',
            iconColor: 'var(--lime-orange)',
        },
        {
            text: 'Captain America',
            value: 1003,
            icon: 'captain_america',
            iconColor: 'var(--lime-blue)',
        },
        {
            text: 'Black Widow',
            value: 1004,
            icon: 'spider',
            iconColor: 'var(--lime-dark-grey)',
        },
    ];

    constructor() {
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
    }

    private handleChange(event: CustomEvent<ListItem<number>>) {
        event.stopPropagation();
        this.change.emit(event.detail?.value);
    }

    private async search(query: string): Promise<ListItem[]> {
        return this.heroes.filter((hero) => {
            return hero.text.toLowerCase().includes(query.toLowerCase());
        });
    }

    public render() {
        const value = this.heroes.find((hero) => hero.value === this.value);

        return (
            <limel-picker
                label={this.title}
                value={value}
                disabled={this.disabled}
                readonly={this.readonly}
                required={this.required}
                onChange={this.handleChange}
                searcher={this.search}
            />
        );
    }
}
