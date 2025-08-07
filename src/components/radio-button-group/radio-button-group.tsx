import {
    Component,
    Event,
    EventEmitter,
    h,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import { ListItem } from '../list/list-item.types';
import { LimelListCustomEvent } from '@limetech/lime-elements';

/**
 * Radio Button Group
 *
 * The Radio Button component provides a convenient way to create a group of radio buttons
 * from an array of options. Radio buttons allow users to select a single option from
 * multiple choices, making them ideal for exclusive selections.
 *
 * :::note
 * A single radio button is never useful in a UI. Radio buttons should always come in groups
 * of at least 2 options where only one can be selected at a time.
 * :::
 *
 * @exampleComponent limel-example-radio-button-group-basic
 * @exampleComponent limel-example-radio-button-group-icons
 * @exampleComponent limel-example-radio-button-group-multiple-lines
 * @beta
 */
@Component({
    tag: 'limel-radio-button-group',
    shadow: true,
})
export class RadioButtonGroup {
    /**
     * Array of radio button options to display
     */
    @Prop()
    public options: Array<ListItem> = [];

    /**
     * The currently selected value
     */
    @Prop()
    public value: any;

    /**
     * Disables all radio buttons when `true`
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Set to `true` if the radio button group should display larger icons with a background
     */
    @Prop({ reflect: true })
    public badgeIcons: boolean;

    /**
     * By default, lists will display 3 lines of text, and then truncate the rest.
     * Consumers can increase or decrease this number by specifying
     * `maxLinesSecondaryText`. If consumer enters zero or negative
     * numbers we default to 1; and if they type decimals we round up.
     */
    @Prop({ reflect: true })
    public maxLinesSecondaryText: number = 3;

    /**
     * Emitted when the selected value changes
     */
    @Event()
    private change: EventEmitter<any>;

    @State()
    private internalOptions: Array<ListItem> = [];

    public componentWillLoad() {
        this.updateInternalOptions();
    }

    @Watch('options')
    @Watch('value')
    @Watch('disabled')
    @Watch('maxLinesSecondaryText')
    protected handlePropsChange() {
        this.updateInternalOptions();
    }

    public render() {
        return (
            <limel-list
                items={this.internalOptions}
                type="radio"
                badgeIcons={this.badgeIcons}
                maxLinesSecondaryText={this.maxLinesSecondaryText}
                onChange={this.handleChange}
            />
        );
    }

    private updateInternalOptions = () => {
        this.internalOptions = this.options.map((option) => ({
            ...option,
            selected: option.value === this.value,
            disabled: this.disabled || option.disabled,
        }));
    };

    private handleChange = (event: LimelListCustomEvent<ListItem>) => {
        event.stopPropagation();

        if (this.disabled) {
            return;
        }

        const selectedOption = event.detail;
        this.change.emit(selectedOption.value);
    };
}
