import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    State,
} from '@stencil/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { ListItem, Searcher } from '../../interface';
import {
    ARROW_DOWN,
    ARROW_DOWN_KEY_CODE,
    ARROW_UP,
    ARROW_UP_KEY_CODE,
    TAB,
    TAB_KEY_CODE,
} from '../../util/keycodes';

const SEARCH_DEBOUNCE = 500;

@Component({
    tag: 'limel-picker',
    shadow: true,
    styleUrl: 'picker.scss',
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
     * Currently selected value
     */
    @Prop()
    public value: ListItem;

    /**
     * A search function that takes a search-string as an argument,
     * and returns a promise that will eventually be resolved with
     * an array of `ListItem`:s.
     */
    @Prop()
    public searcher: Searcher;

    /**
     * Fired when a new value has been selected from the picker
     */
    @Event()
    private change: EventEmitter;

    @State()
    private items: ListItem[];

    @State()
    private textValue: string;

    @State()
    private loading: boolean = false;

    @Element()
    private element: HTMLElement;

    private debouncedSearch;

    public componentDidLoad() {
        this.debouncedSearch = AwesomeDebouncePromise(
            this.searcher,
            SEARCH_DEBOUNCE
        );
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
     * Reset the value of the text field when the control loses focus
     *
     * @returns {void}
     */
    private handleElementBlur = () => {
        this.textValue = '';
        this.searcher(this.textValue).then(
            this.handleSearchResult.bind(this, '')
        );
    };

    /**
     * Change handler for the text field
     *
     * @param {CustomEvent} event event
     *
     * @returns {void}
     */
    private handleTextChange(event: CustomEvent) {
        event.stopPropagation();
        const query = event.detail;
        this.textValue = query;
        this.loading = true;

        // If the search-query is an empty string, bypass debouncing.
        const searchFn = query === '' ? this.searcher : this.debouncedSearch;
        searchFn(query).then(this.handleSearchResult.bind(this, query));
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
        const isTab = event.key === TAB || event.keyCode === TAB_KEY_CODE;
        const isUp =
            event.key === ARROW_UP || event.keyCode === ARROW_UP_KEY_CODE;
        const isDown =
            event.key === ARROW_DOWN || event.keyCode === ARROW_DOWN_KEY_CODE;

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

    private handleSearchResult(query: string, result: ListItem[]) {
        if (query === this.textValue) {
            this.items = result;
            this.loading = false;
        }
    }
}
