import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { ListItem, Searcher } from '../../interface';
import { isDescendant } from '../../util/dom';
import {
    ARROW_DOWN,
    ARROW_DOWN_KEY_CODE,
    ARROW_UP,
    ARROW_UP_KEY_CODE,
    TAB,
    TAB_KEY_CODE,
} from '../../util/keycodes';
import { Chip } from '../chip-set/chip.types';

const SEARCH_DEBOUNCE = 500;
const CHIP_SET_TAG_NAME = 'limel-chip-set';

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
     * Text to display for the input field of the picker
     */
    @Prop()
    public label: string;

    /**
     * Search label to display in the input field when searching
     */
    @Prop()
    public searchLabel: string;

    /**
     * True if the control requires a value
     */
    @Prop()
    public required: boolean = false;

    /**
     * Currently selected value or values
     */
    @Prop()
    public value: ListItem<number | string> | Array<ListItem<number | string>>;

    /**
     * A search function that takes a search-string as an argument,
     * and returns a promise that will eventually be resolved with
     * an array of `ListItem`:s.
     */
    @Prop()
    public searcher: Searcher;

    /**
     * True if multiple values are allowed
     */
    @Prop()
    public multiple: boolean = false;

    /**
     * Fired when a new value has been selected from the picker
     */
    @Event()
    private change: EventEmitter<
        ListItem<number | string> | Array<ListItem<number | string>>
    >;

    /**
     * Fired when clicking on a selected value
     */
    @Event()
    private interact: EventEmitter<Chip>;

    @State()
    private items: Array<ListItem<number | string>>;

    @State()
    private textValue: string;

    @State()
    private loading: boolean = false;

    @State()
    private chips: Chip[] = [];

    @Element()
    private element: HTMLElement;

    // Should NOT be decorated with State(), since this
    // should not trigger a re-render by itself.
    private chipSetEditMode = false;

    private debouncedSearch;
    private chipSet;

    constructor() {
        this.handleElementBlur = this.handleElementBlur.bind(this);
        this.handleElementFocus = this.handleElementFocus.bind(this);
        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleInputFieldFocus = this.handleInputFieldFocus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInteract = this.handleInteract.bind(this);
        this.handleListChange = this.handleListChange.bind(this);
        this.handleStopEdit = this.handleStopEdit.bind(this);
    }

    @Watch('value')
    public onChangeValue(newValue, oldValue) {
        this.chips = this.createChips(this.value);
        if (!this.multiple) {
            return;
        }

        if (newValue.length <= oldValue.length) {
            return;
        }

        this.chipSet.setFocus();
    }

    public componentDidLoad() {
        this.debouncedSearch = AwesomeDebouncePromise(
            this.searcher,
            SEARCH_DEBOUNCE
        );
        this.element.addEventListener('blur', this.handleElementBlur);
        this.element.addEventListener('focus', this.handleElementFocus);
        this.chipSet = this.element.shadowRoot.querySelector(CHIP_SET_TAG_NAME);
        this.chips = this.createChips(this.value);
    }

    public componentDidUnload() {
        this.element.removeEventListener('blur', this.handleElementBlur);
        this.element.removeEventListener('focus', this.handleElementFocus);
    }

    public async componentWillUpdate() {
        this.chipSetEditMode = !this.chipSet
            ? false
            : await this.chipSet.getEditMode();
    }

    public render() {
        const iconColors = this.chips.some((chip: Chip) => {
            return 'iconColor' in chip && !!chip.iconColor;
        });
        const style = {};

        if (iconColors) {
            style['--icon-color'] = 'white';
        }

        return [
            <limel-chip-set
                style={style}
                tabindex="0"
                type="input"
                label={this.label}
                value={this.chips}
                disabled={this.disabled}
                required={this.required}
                searchLabel={this.searchLabel}
                onInput={this.handleTextInput}
                onKeyDown={this.handleKeyDown}
                onFocus={this.handleInputFieldFocus}
                onChange={this.handleChange}
                onInteract={this.handleInteract}
                onStartEdit={this.handleInputFieldFocus}
                onStopEdit={this.handleStopEdit}
            />,
            <div class="mdc-menu-surface--anchor">{this.renderDropdown()}</div>,
        ];
    }

    private createChips(value: ListItem | ListItem[]): Chip[] {
        if (!value) {
            return [];
        }

        if (this.multiple) {
            const listItems: ListItem[] = value as ListItem[];

            return listItems.map(this.createChip);
        }

        const listItem: ListItem = value as ListItem;

        return [this.createChip(listItem)];
    }

    private createChip(listItem: ListItem): Chip {
        return {
            id: `${listItem.value}`,
            text: listItem.text,
            removable: true,
            icon: listItem.icon,
            iconColor: listItem.iconColor,
        };
    }

    /**
     * Renders the dropdown with the items to pick from, or a spinner if the picker
     * is waiting for items to be received
     *
     * @returns {HTMLElement} picker dropdown
     */
    private renderDropdown() {
        if (!this.multiple && this.value) {
            // Don't render the dropdown if the picker is already "full".
            return;
        }
        if (!this.chipSetEditMode) {
            // Don't render the dropdown if the picker is not in edit mode.
            return;
        }

        const boundingRect = this.element.getBoundingClientRect();

        if (this.loading) {
            return (
                <div
                    style={{
                        width: `${boundingRect.width}px`,
                    }}
                    class="dropdown--spinner mdc-elevation-transition mdc-elevation--z4 mdc-menu-surface mdc-menu-surface--open"
                    tabindex="-1"
                >
                    <limel-spinner />
                </div>
            );
        }

        if (!this.items || !this.items.length) {
            return;
        }

        const hasIcons = this.items.some(item => {
            return 'icon' in item && !!item.icon;
        });

        return (
            <div
                style={{
                    width: `${boundingRect.width}px`,
                }}
                class="dropdown--list mdc-elevation-transition mdc-elevation--z4 mdc-menu-surface mdc-menu-surface--open"
                tabindex="-1"
            >
                <limel-list
                    badgeIcons={hasIcons}
                    iconSize="small"
                    onChange={this.handleListChange}
                    type="selectable"
                    items={this.items}
                />
            </div>
        );
    }

    /**
     * Check if a descendant still has focus, if not reset text value and search result
     *
     * @returns {void}
     */
    private handleStopEdit() {
        // In browsers where shadow DOM is not supported activeElement on shadowRoot will return null
        // However, document.activeElement will return the actual focused element instead of the outermost shadow host
        const element =
            this.element.shadowRoot.activeElement || document.activeElement;
        if (isDescendant(element as HTMLElement, this.element)) {
            return;
        }

        this.handleElementBlur();
    }

    /**
     * Reset the value of the input field when the control loses focus
     *
     * @returns {void}
     */
    private handleElementBlur() {
        this.textValue = '';
        this.handleSearchResult('', []);
    }

    /**
     * Set focus to the input field when this control receives focus
     *
     * @returns {void}
     */
    private handleElementFocus() {
        this.chipSet.setFocus();
    }

    /**
     * Input handler for the input field
     *
     * @param {InputEvent} event event
     *
     * @returns {void}
     */
    private async handleTextInput(event) {
        event.stopPropagation();

        const query = event.detail;
        this.textValue = query;
        this.loading = true;

        // If the search-query is an empty string, bypass debouncing.
        const searchFn = query === '' ? this.searcher : this.debouncedSearch;
        const result = await searchFn(query);
        this.handleSearchResult(query, result);
    }

    /**
     * Change handler for the list
     *
     * @param {CustomEvent} event event
     *
     * @returns {void}
     */
    private handleListChange(event: CustomEvent<ListItem>) {
        event.stopPropagation();
        if (!this.value || this.value !== event.detail) {
            let newValue: ListItem | ListItem[] = event.detail;
            if (this.multiple) {
                newValue = [...(this.value as ListItem[]), event.detail];
            }

            this.change.emit(newValue);
            this.items = [];
        }
    }

    /**
     * Focus handler for the chip set
     * Prevent focus if the picker has a value and does not support multiple values
     * @param {CustomEvent} event event
     * @returns {void}
     */
    private async handleInputFieldFocus(event) {
        if (this.value && !this.multiple) {
            event.stopPropagation();
            this.chipSet.blur();

            return;
        }

        this.textValue = '';
        this.loading = true;
        const result = await this.searcher('');
        this.handleSearchResult('', result);
    }

    private handleChange(event: CustomEvent<Chip | Chip[]>) {
        event.stopPropagation();

        let newValue = null;
        if (this.multiple) {
            const chips = event.detail as Chip[];
            newValue = chips.map(chip => {
                return (this.value as ListItem[]).find(item => {
                    return `${item.value}` === chip.id;
                });
            });
        }

        this.change.emit(newValue);
    }

    private handleInteract(event: CustomEvent<Chip>) {
        event.stopPropagation();
        this.interact.emit(event.detail);
    }

    /**
     * Key handler for the input field
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
            if (this.multiple) {
                const values = this.value as ListItem[];
                this.items = result.filter(item => {
                    return !values.includes(item);
                });
            }
            this.loading = false;
        }
    }
}
