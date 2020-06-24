import { Chip, ListItem, Searcher } from '@limetech/lime-elements';
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
import { isDescendant } from '../../util/dom';
import {
    ARROW_DOWN,
    ARROW_DOWN_KEY_CODE,
    ARROW_UP,
    ARROW_UP_KEY_CODE,
    ESCAPE,
    ESCAPE_KEY_CODE,
    TAB,
    TAB_KEY_CODE,
} from '../../util/keycodes';
import { createRandomString } from '../../util/random-string';

const SEARCH_DEBOUNCE = 500;
const CHIP_SET_TAG_NAME = 'limel-chip-set';
const ITEM_LIMIT_NO_SCROLL = 5;

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
     * Set to `true` to disable adding and removing items,
     * but allow interaction with existing items.
     */
    @Prop({ reflectToAttr: true })
    public readonly: boolean = false;

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
     * A message to display when the search returned an empty result
     */
    @Prop()
    public emptyResultMessage: string;

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
     * True if the dropdown list should be displayed without cutting the content
     */
    @Prop()
    public displayFullList: boolean = false;

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
    private interact: EventEmitter<ListItem<number | string>>;

    @State()
    private items: Array<ListItem<number | string>>;

    @State()
    private textValue: string = '';

    @State()
    private loading: boolean = false;

    @State()
    private chips: Chip[] = [];

    @Element()
    private element: HTMLElement;

    // Should NOT be decorated with State(), since this
    // should not trigger a re-render by itself.
    private chipSetEditMode = false;

    private debouncedSearch: Searcher;
    private chipSet: HTMLLimelChipSetElement;
    private portalId: string;

    constructor() {
        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
        this.handleDropdownKeyDown = this.handleDropdownKeyDown.bind(this);
        this.handleInputFieldFocus = this.handleInputFieldFocus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInteract = this.handleInteract.bind(this);
        this.handleListChange = this.handleListChange.bind(this);
        this.handleStopEditAndBlur = this.handleStopEditAndBlur.bind(this);
        this.createDebouncedSearcher = this.createDebouncedSearcher.bind(this);

        this.portalId = createRandomString();
    }

    public componentDidLoad() {
        this.createDebouncedSearcher(this.searcher);
        this.chipSet = this.element.shadowRoot.querySelector(CHIP_SET_TAG_NAME);
        this.chips = this.createChips(this.value);
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

        const props: {
            maxItems?: number;
        } = {};

        if (!this.multiple) {
            props.maxItems = 1;
        }

        return [
            <limel-chip-set
                style={style}
                type="input"
                label={this.label}
                value={this.chips}
                disabled={this.disabled}
                readonly={this.readonly}
                required={this.required}
                searchLabel={this.searchLabel}
                onInput={this.handleTextInput}
                onKeyDown={this.handleInputKeyDown}
                onChange={this.handleChange}
                onInteract={this.handleInteract}
                onStartEdit={this.handleInputFieldFocus}
                onStopEdit={this.handleStopEditAndBlur}
                emptyInputOnBlur={false}
                {...props}
            />,
            <div class="mdc-menu-surface--anchor">{this.renderDropdown()}</div>,
        ];
    }

    @Watch('value')
    protected onChangeValue() {
        this.chips = this.createChips(this.value);
    }

    @Watch('searcher')
    protected createDebouncedSearcher(newValue: Searcher) {
        if (typeof newValue !== 'function') {
            return;
        }
        this.debouncedSearch = AwesomeDebouncePromise(
            newValue,
            SEARCH_DEBOUNCE
        );
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
            value: listItem,
        };
    }

    /**
     * Renders the dropdown with the items to pick from, or a spinner if the picker
     * is waiting for items to be received
     *
     * @returns {HTMLElement} picker dropdown
     */
    private renderDropdown() {
        const content = this.getDropdownContent();
        const styling = {};

        if (this.isScrollableDropdown()) {
            styling['max-height'] = '250px';
        }

        return this.renderPortal(content, styling);
    }

    private getDropdownContent() {
        if (this.isFull()) {
            return;
        }

        if (!this.chipSetEditMode) {
            return;
        }

        if (this.loading) {
            return this.renderSpinner();
        }

        if (!this.items || !this.items.length) {
            return this.renderEmptyMessage();
        }

        return this.renderListResult();
    }

    /**
     * Returns true if the picker is "full"
     * The picker is considered to be full if it has a value and only one is allowed
     *
     * @returns {boolean} true if the picker is full
     */
    private isFull(): boolean {
        return !this.multiple && !!this.value;
    }

    private renderSpinner() {
        return (
            <div style={{ 'padding-top': '6px', 'text-align': 'center' }}>
                <limel-spinner class={'dropdown--spinner'} />
            </div>
        );
    }

    private renderEmptyMessage() {
        if (!this.emptyResultMessage) {
            return;
        }

        const style = {
            color: 'var(--lime-light-grey, #{$lime-light-grey})',
            'text-align': 'center',
        };

        return <p style={style}>{this.emptyResultMessage}</p>;
    }

    private renderListResult() {
        const hasIcons = this.items.some((item) => {
            return 'icon' in item && !!item.icon;
        });

        return (
            <limel-list
                badgeIcons={hasIcons}
                onChange={this.handleListChange}
                type="selectable"
                items={this.items}
            />
        );
    }

    private isScrollableDropdown() {
        if (this.displayFullList) {
            return false;
        }

        if (!this.items || !this.items.length) {
            return false;
        }

        return this.items.length > ITEM_LIMIT_NO_SCROLL;
    }

    private renderPortal(content = null, styling = {}) {
        return (
            <limel-portal
                visible={!!content}
                containerId={this.portalId}
                containerStyle={styling}
                inheritParentWidth={true}
            >
                <limel-menu-surface
                    open={!!content}
                    style={{ '--menu-surface-width': '100%' }}
                >
                    {content}
                </limel-menu-surface>
            </limel-portal>
        );
    }

    /**
     * Check if a descendant still has focus. If not, reset text value and search result.
     *
     * @returns {void}
     */
    private handleStopEditAndBlur() {
        // In browsers where shadow DOM is not supported activeElement on shadowRoot will return null
        // However, document.activeElement will return the actual focused element instead of the outermost shadow host
        const element =
            this.element.shadowRoot.activeElement || document.activeElement;
        const portalElement = document.querySelector(`#${this.portalId}`);
        if (
            isDescendant(element as HTMLElement, this.element) ||
            isDescendant(element as HTMLElement, portalElement as HTMLElement)
        ) {
            return;
        }

        this.chipSet.emptyInput();
        this.textValue = '';
        this.handleSearchResult('', []);
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

        if (this.multiple) {
            this.chipSet?.setFocus(true);
        }
    }

    /**
     * Focus handler for the chip set
     * Prevent focus if the picker has a value and does not support multiple values
     * @param {CustomEvent} event event
     * @returns {void}
     */
    private async handleInputFieldFocus() {
        this.loading = true;
        const query = this.textValue;
        const result = await this.searcher(query);
        this.handleSearchResult(query, result);
    }

    private handleChange(event: CustomEvent<Chip | Chip[]>) {
        event.stopPropagation();

        let newValue = null;
        if (this.multiple) {
            const chips = event.detail as Chip[];
            newValue = chips.map((chip) => {
                return (this.value as ListItem[]).find((item) => {
                    return `${item.value}` === chip.id;
                });
            });
        }

        if (!this.multiple && !newValue) {
            this.chipSet?.setFocus(true);
        }

        this.change.emit(newValue);
    }

    private handleInteract(event: CustomEvent<Chip>) {
        event.stopPropagation();
        this.interact.emit(event.detail ? event.detail.value : event.detail);
    }

    /**
     * Key handler for the input field
     * Will change focus to the first/last item in the dropdown list to enable selection with the keyboard
     *
     * @param {KeyboardEvent} event event
     *
     * @returns {void}
     */
    private handleInputKeyDown(event: KeyboardEvent) {
        const isForwardTab =
            (event.key === TAB || event.keyCode === TAB_KEY_CODE) &&
            !event.altKey &&
            !event.metaKey &&
            !event.shiftKey;
        const isUp =
            event.key === ARROW_UP || event.keyCode === ARROW_UP_KEY_CODE;
        const isDown =
            event.key === ARROW_DOWN || event.keyCode === ARROW_DOWN_KEY_CODE;

        if (!isForwardTab && !isUp && !isDown) {
            return;
        }
        const list = document.querySelector(` #${this.portalId} limel-list`);
        if (!list) {
            return;
        }

        event.preventDefault();

        if (isForwardTab || isDown) {
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

    /**
     * Key handler for the dropdown
     *
     * @param {KeyboardEvent} event event
     *
     * @returns {void}
     */
    private handleDropdownKeyDown(event: KeyboardEvent) {
        const isEscape =
            event.key === ESCAPE || event.keyCode === ESCAPE_KEY_CODE;

        if (isEscape) {
            event.preventDefault();
            this.textValue = '';
            this.chipSet.setFocus(true);
        }
    }

    private handleSearchResult(query: string, result: ListItem[]) {
        if (query === this.textValue) {
            this.items = result;
            if (this.multiple) {
                const values = this.value as ListItem[];
                this.items = result.filter((item) => {
                    return !values.includes(item);
                });
            }
            this.loading = false;
        }
    }
}
