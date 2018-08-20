import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import { ARROW_DOWN, ARROW_UP, TAB } from '../../util/keycodes';
import { ListItem } from '../list/list-item';

@Component({
    tag: 'limel-picker',
    styleUrl: 'picker.scss',
    shadow: true,
})
export class Picker {
    /**
     * True if the picker should be disabled
     */
    @Prop()
    public disabled: boolean = false;

    /**
     * Text to display for the text field of the picker
     */
    @Prop()
    public label: string;

    /**
     * True if the control requires a value
     */
    @Prop()
    public required: boolean = false;

    /**
     * Current selected value
     */
    @Prop()
    public value: ListItem;

    /**
     * List of items to display in the dropdown
     */
    @Prop()
    public items: ListItem[];

    /**
     * Fired when a new value has been selected from the picker
     */
    @Event()
    private change: EventEmitter;

    /**
     * Fired when the input value in the text field has changed
     */
    @Event()
    private input: EventEmitter;

    @State()
    private textValue: string;

    @State()
    private loading: boolean = false;

    @Element()
    private element: HTMLElement;

    public componentDidLoad() {
        this.element.addEventListener('blur', this.handleElementBlur);
    }

    public componentDidUnload() {
        this.element.removeEventListener('blur', this.handleElementBlur);
    }

    public render() {
        let value = this.textValue;
        if (this.value) {
            value = this.value.text;
        }
        const icon = this.value ? '\u2715' : null;

        return [
            <limel-text-field
                label={this.label}
                value={value}
                disabled={this.disabled}
                required={this.required}
                onChange={this.handleTextChange.bind(this)}
                onInput={this.handleTextInput.bind(this)}
                onKeyDown={this.handleKeyDown.bind(this)}
                onFocus={this.handleTextFieldFocus.bind(this)}
                onAction={this.handleAction.bind(this)}
                trailingIcon={icon}
            />,
            this.renderDropdown(),
        ];
    }

    /**
     * When new items have been received, remove the loading indicator
     *
     * @returns {void}
     */
    @Watch('items')
    protected onItemsChange() {
        this.loading = false;
    }

    /**
     * Reset the value of the text field when the control loses focus
     *
     * @returns {void}
     */
    private handleElementBlur = () => {
        this.textValue = '';
        this.input.emit();
    };

    /**
     * Renders the dropdown with the items to pick from, or a spinner if the picker
     * is waiting for items to be received
     *
     * @returns {HTMLElement} picker dropdown
     */
    private renderDropdown() {
        if (this.value) {
            return;
        }

        const boundingRect = this.element.getBoundingClientRect();

        if (this.loading) {
            return (
                <div
                    style={{
                        width: `${boundingRect.width}px`,
                    }}
                    class="dropdown--spinner mdc-elevation-transition mdc-elevation--z4"
                >
                    <limel-spinner />
                </div>
            );
        }

        if (!this.items || !this.items.length) {
            return;
        }

        return (
            <div
                style={{
                    width: `${boundingRect.width}px`,
                }}
                class="dropdown--list mdc-elevation-transition mdc-elevation--z4"
            >
                <limel-list
                    onChange={this.handleListChange.bind(this)}
                    selectable={true}
                    items={this.items}
                />
            </div>
        );
    }

    /**
     * Change handler for the text field
     *
     * @param {CustomEvent} event event
     *
     * @returns {void}
     */
    private handleTextChange(event: CustomEvent) {
        event.stopPropagation();
        this.textValue = event.detail;
        this.input.emit(event.detail);
        if (event.detail) {
            this.loading = true;
        }
    }

    /**
     * Input handler for the text field
     *
     * @param {InputEvent} event event
     *
     * @returns {void}
     */
    private handleTextInput(event) {
        event.stopPropagation();
    }

    /**
     * Change handler for the list
     *
     * @param {CustomEvent} event event
     *
     * @returns {void}
     */
    private handleListChange(event: CustomEvent) {
        event.stopPropagation();
        if (!this.value || this.value !== event.detail) {
            this.change.emit(event.detail);
        }
    }

    /**
     * Listen for the icon action in the text field to clear the value
     * Emits a change event with an empty value
     *
     * @returns {void}
     */
    private handleAction() {
        this.change.emit();
    }

    /**
     * Focus handler for the text field
     * Prevent focus if the picker has a value
     *
     * @returns {void}
     */
    private handleTextFieldFocus() {
        if (this.value) {
            const textField = this.element.shadowRoot.querySelector(
                'limel-text-field'
            );
            textField.blur();
        }
    }

    /**
     * Key handler for the text field
     * Will change focus to the first/last item in the dropdown list to enable selection with the keyboard
     *
     * @param {KeyboardEvent} event event
     *
     * @returns {void}
     */
    private handleKeyDown(event: KeyboardEvent) {
        const isTab = event.key === 'Tab' || event.keyCode === TAB;
        const isUp = event.key === 'ArrowUp' || event.keyCode === ARROW_UP;
        const isDown =
            event.key === 'ArrowDown' || event.keyCode === ARROW_DOWN;

        if (!isTab && !isUp && !isDown) {
            return;
        }

        const list = this.element.shadowRoot.querySelector('limel-list');
        if (!list) {
            return;
        }

        event.preventDefault();

        if (isTab || isDown) {
            const listElement: HTMLElement = list.shadowRoot.querySelector(
                '.mdc-list-item:first-child'
            );
            listElement.focus();
            return;
        }

        if (isUp) {
            const listElement: HTMLElement = list.shadowRoot.querySelector(
                '.mdc-list-item:last-child'
            );
            listElement.focus();
            return;
        }
    }
}
