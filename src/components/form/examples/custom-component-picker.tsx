import { Component, h, Prop, EventEmitter, Event } from '@stencil/core';
import {
    FormComponent,
    LimelPickerCustomEvent,
    ListItem,
} from '@limetech/lime-elements';

@Component({
    tag: 'limel-example-custom-picker',
    shadow: true,
})
export class CustomPickerExample implements FormComponent<number> {
    /**
     * @inheritdoc
     */
    @Prop({ reflect: true })
    public value: number;

    /**
     * @inheritdoc
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * @inheritdoc
     */
    @Prop({ reflect: true })
    public required: boolean;

    /**
     * @inheritdoc
     */
    @Prop({ reflect: true })
    public readonly: boolean;

    /**
     * @inheritdoc
     */
    @Prop({ reflect: true })
    public disabled: boolean;

    /**
     * @inheritdoc
     */
    @Prop({ reflect: true })
    public helperText?: string;

    /**
     * Emitted when the value is changed
     */
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

    private handleChange = (
        event: LimelPickerCustomEvent<ListItem<number>>
    ) => {
        event.stopPropagation();
        this.change.emit(event.detail?.value);
    };

    private search = async (query: string): Promise<ListItem[]> => {
        return this.heroes.filter((hero) => {
            return hero.text.toLowerCase().includes(query.toLowerCase());
        });
    };

    public render() {
        const value = this.heroes.find((hero) => hero.value === this.value);

        return (
            <limel-picker
                label={this.label}
                value={value}
                disabled={this.disabled}
                readonly={this.readonly}
                required={this.required}
                onChange={this.handleChange}
                searcher={this.search}
                helperText={this.helperText}
            />
        );
    }
}
