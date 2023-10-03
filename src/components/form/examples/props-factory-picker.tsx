import { Component, h, Prop, EventEmitter, Event } from '@stencil/core';
import {
    FormComponent,
    LimelPickerCustomEvent,
    ListItem,
} from '@limetech/lime-elements';

@Component({
    tag: 'limel-example-props-factory-picker',
    shadow: true,
})
export class PropsFactoryPickerExample implements FormComponent<number> {
    /**
     * An object injected using `propsFactory`
     */
    @Prop()
    public injectedObject: { someProp: string };

    /**
     * A string injected using `propsFactory`
     */
    @Prop()
    public injectedString: string;

    /**
     * The value of the property
     */
    @Prop()
    public value: number;

    /**
     * Label to display next to the input field
     */
    @Prop()
    public label: string;

    /**
     * Set to `true` if a value is required
     */
    @Prop()
    public required: boolean;

    /**
     * Set to `true` if the value is readonly
     */
    @Prop()
    public readonly: boolean;

    /**
     * Set to `true` if input should be disabled
     */
    @Prop()
    public disabled: boolean;

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

    public componentWillLoad() {
        console.log(
            'propsFactory-picker - this.injectedObject.someProp:',
            this.injectedObject.someProp
        );
        console.log(
            'propsFactory-picker - this.injectedString:',
            this.injectedString
        );
    }

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
            />
        );
    }
}
