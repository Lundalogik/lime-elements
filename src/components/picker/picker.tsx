import { Action } from '../collapsible-section/action';
import { ActionPosition, ActionScrollBehavior } from '../picker/actions.types';
import { Chip } from '../chip-set/chip.types';
import { ListItem } from '../list/list-item.types';
import { Searcher } from '../picker/searcher.types';
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
import { isDescendant } from '../../util/dom';
import { ARROW_DOWN, ARROW_UP, ENTER, ESCAPE, TAB } from '../../util/keycodes';
import { createRandomString } from '../../util/random-string';
import {
    LimelChipSetCustomEvent,
    LimelListCustomEvent,
} from '../../components';
import { getIconFillColor, getIconName } from '../icon/get-icon-props';
import { PickerValue } from './value.types';
import { DebouncedFunc, debounce } from 'lodash-es';

const SEARCH_DEBOUNCE = 300;
const CHIP_SET_TAG_NAME = 'limel-chip-set';
const DEFAULT_SEARCHER_MAX_RESULTS = 20;

/**
 * @exampleComponent limel-example-picker-basic
 * @exampleComponent limel-example-picker-multiple
 * @exampleComponent limel-example-picker-icons
 * @exampleComponent limel-example-picker-pictures
 * @exampleComponent limel-example-picker-value-as-object
 * @exampleComponent limel-example-picker-value-as-object-with-actions
 * @exampleComponent limel-example-picker-empty-suggestions
 * @exampleComponent limel-example-picker-leading-icon
 * @exampleComponent limel-example-picker-static-actions
 * @exampleComponent limel-example-picker-composite
 */
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
    @Prop({ reflect: true })
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
     * Optional helper text to display below the input field when it has focus
     */
    @Prop({ reflect: true })
    public helperText: string;

    /**
     * Leading icon to show to the far left in the text field
     */
    @Prop()
    public leadingIcon: string;

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
     * Set to `true` to indicate that the current value of the input field is
     * invalid.
     */
    @Prop({ reflect: true })
    public invalid = false;

    /**
     * Currently selected value or values. Where the value can be an object.
     */
    @Prop()
    public value: ListItem<PickerValue> | Array<ListItem<PickerValue>>;

    /**
     * A search function that takes a search-string as an argument,
     * and returns a promise that will eventually be resolved with
     * an array of `ListItem`:s.
     *
     * See the docs for the type `Searcher` for type information on
     * the searcher function itself.
     */
    @Prop()
    public searcher?: Searcher;

    /**
     * Only used if no `searcher` is provided. The picker will then use a
     * default search function that filters the `allItems` based on the
     * `text` and `secondaryText` properties of the items.
     * This way, custom search functions are typically only needed when the
     * search is done on the server.
     * For performance reasons, the default searcher will never return more
     * than 20 items, but if there are more than 20 items, the rest can be
     * found by typing more characters in the search field.
     */
    @Prop()
    public allItems?: Array<ListItem<PickerValue>> = [];

    /**
     * True if multiple values are allowed
     */
    @Prop()
    public multiple: boolean = false;

    /**
     * Sets delimiters between chips. Works only when `multiple` is `true`.
     */
    @Prop({ reflect: true })
    public delimiter: string = null;

    /**
     * Static actions that can be clicked by the user.
     */
    @Prop()
    public actions: Array<ListItem<Action>> = [];

    /**
     * Position of the custom static actions in the picker's results dropdown.
     * Can be set to `'top'` or `'bottom'`.
     */
    @Prop()
    public actionPosition: ActionPosition = 'bottom';

    /**
     * Scroll behavior of the custom static actions, when user scrolls
     * in the picker's results dropdown. Can be set to `'scroll'` which means
     * the action items will scroll together with the list, or `'sticky'` which
     * retains their position at the top or bottom of the drop down while
     * scrolling.
     */
    @Prop()
    public actionScrollBehavior: ActionScrollBehavior = 'sticky';

    /**
     * Whether badge icons should be used in the result list or not
     */
    @Prop({ reflect: true })
    public badgeIcons: boolean = false;

    /**
     * Fired when a new value has been selected from the picker
     */
    @Event()
    private change: EventEmitter<
        ListItem<PickerValue> | Array<ListItem<PickerValue>>
    >;

    /**
     * Fired when clicking on a selected value
     */
    @Event()
    private interact: EventEmitter<ListItem<PickerValue>>;

    /**
     * Emitted when the user selects an action.
     */
    @Event()
    private action: EventEmitter<Action>;

    @State()
    private items: Array<ListItem<number | string>>;

    @State()
    private textValue: string = '';

    @State()
    private loading: boolean = false;

    @State()
    private chips: Chip[] = [];

    @Element()
    private host: HTMLLimelPickerElement;

    // Should NOT be decorated with State(), since this
    // should not trigger a re-render by itself.
    private chipSetEditMode = false;

    private debouncedSearch: DebouncedFunc<(query: string) => Promise<void>>;
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
        this.handleActionListChange = this.handleActionListChange.bind(this);
        this.handleStopEditAndBlur = this.handleStopEditAndBlur.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this);
        this.onListKeyDown = this.onListKeyDown.bind(this);

        this.portalId = createRandomString();
        this.debouncedSearch = debounce(this.search, SEARCH_DEBOUNCE);
    }

    public componentWillLoad() {
        this.chips = this.createChips(this.value);
    }

    public componentDidLoad() {
        this.chipSet = this.host.shadowRoot.querySelector(CHIP_SET_TAG_NAME);
    }

    public disconnectedCallback() {
        this.debouncedSearch.cancel();
    }

    public async componentWillUpdate() {
        this.chipSetEditMode = false;
        if (this.chipSet) {
            this.chipSetEditMode = await this.chipSet.getEditMode();
        }
    }

    public render() {
        const props: {
            maxItems?: number;
        } = {};

        if (!this.multiple) {
            props.maxItems = 1;
        }

        return [
            <limel-chip-set
                type="input"
                inputType="search"
                label={this.label}
                helperText={this.helperText}
                leadingIcon={this.leadingIcon}
                value={this.chips}
                disabled={this.disabled}
                invalid={this.invalid}
                delimiter={this.renderDelimiter()}
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
                clearAllButton={this.multiple && !this.chipSetEditMode}
                {...props}
            />,
            this.renderDropdown(),
        ];
    }

    @Watch('value')
    protected onChangeValue() {
        this.chips = this.createChips(this.value);
    }

    private renderDelimiter() {
        if (this.multiple) {
            return this.delimiter;
        }

        return null;
    }

    private getValueId = (item: ListItem) => {
        const value = item.value;
        if (!!value && typeof value === 'object') {
            return value.id;
        }

        return value;
    };

    private createChips = (value: ListItem | ListItem[]): Chip[] => {
        if (!value) {
            return [];
        }

        if (this.multiple) {
            const listItems: ListItem[] = value as ListItem[];

            return listItems.map(this.createChip);
        }

        const listItem: ListItem = value as ListItem;

        return [this.createChip(listItem)];
    };

    private createChip = (listItem: ListItem): Chip => {
        const name = getIconName(listItem.icon);

        const color = getIconFillColor(listItem.icon, listItem.iconColor);
        const valueId = this.getValueId(listItem);

        return {
            id: `${valueId}`,
            text: listItem.text,
            removable: true,
            icon: name ? { name: name, color: color } : undefined,
            image: listItem.image,
            value: listItem,
            menuItems: listItem.actions,
        };
    };

    /**
     * Renders the dropdown with the items to pick from, or a spinner if the picker
     * is waiting for items to be received
     *
     * @returns picker dropdown
     */
    private renderDropdown() {
        const dropDownContent = this.getDropdownContent();

        const content = [];

        if (this.shouldShowDropDownContent()) {
            const actionContent = this.getActionContent();
            if (this.actionPosition === 'top') {
                content.push(actionContent);
            }

            if (dropDownContent) {
                content.push(dropDownContent);
            }

            if (this.actionPosition === 'bottom') {
                content.push(actionContent);
            }
        }

        return this.renderPortal(content);
    }

    private getActionContent() {
        const actionCount = this.actions?.length ?? 0;
        if (actionCount === 0) {
            return null;
        }

        return [
            <limel-list
                class={{
                    'static-actions-list': true,
                    'is-on-top': this.actionPosition === 'top',
                    'is-at-bottom': this.actionPosition === 'bottom',
                    'has-position-sticky':
                        this.actionScrollBehavior === 'sticky',
                }}
                badgeIcons={true}
                type={'selectable'}
                onChange={this.handleActionListChange}
                items={this.actions.map(this.removeUnusedPropertiesOnAction)}
            />,
        ];
    }

    private removeUnusedPropertiesOnAction(
        action: ListItem<Action>
    ): ListItem<Action> {
        return {
            ...action,
            actions: [],
        };
    }

    private shouldShowDropDownContent() {
        if (this.isFull()) {
            return false;
        }

        return !!this.chipSetEditMode;
    }

    private getDropdownContent() {
        if (!this.shouldShowDropDownContent()) {
            return;
        }

        if (this.loading) {
            return this.renderSpinner();
        }

        if (!this.items?.length) {
            return this.renderEmptyMessage();
        }

        return this.renderListResult();
    }

    /**
     * Returns true if the picker is "full"
     * The picker is considered to be full if it has a value and only one is allowed
     *
     * @returns true if the picker is full
     */
    private isFull(): boolean {
        return !this.multiple && !!this.value;
    }

    private renderSpinner() {
        return (
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    padding: '1rem 0',
                }}
            >
                <limel-spinner limeBranded={false} />
            </div>
        );
    }

    private renderEmptyMessage() {
        if (!this.emptyResultMessage) {
            return;
        }

        const style = {
            color: 'rgb(var(--contrast-1100))',
            'text-align': 'center',
            margin: '0.5rem 1rem',
        };

        return <p style={style}>{this.emptyResultMessage}</p>;
    }

    private renderListResult() {
        return (
            <limel-list
                badgeIcons={this.badgeIcons}
                onChange={this.handleListChange}
                onKeyDown={this.onListKeyDown}
                type="selectable"
                items={this.items}
            />
        );
    }

    private onListKeyDown(event: KeyboardEvent) {
        const keyFound = [TAB, ESCAPE, ENTER].includes(event.key);
        if (keyFound) {
            this.chipSet.setFocus();
        }
    }

    private renderPortal(content: any[] = []) {
        const dropdownZIndex = getComputedStyle(this.host).getPropertyValue(
            '--dropdown-z-index'
        );

        return (
            <limel-portal
                visible={content.length > 0}
                containerId={this.portalId}
                inheritParentWidth={true}
                containerStyle={{ 'z-index': dropdownZIndex }}
            >
                <limel-menu-surface
                    open={content.length > 0}
                    allowClicksElement={this.host}
                    style={{
                        '--menu-surface-width': '100%',
                        'max-height': 'inherit',
                        display: 'flex',
                    }}
                    onDismiss={this.handleCloseMenu}
                >
                    {content}
                </limel-menu-surface>
            </limel-portal>
        );
    }

    /**
     * Check if a descendant still has focus. If not, reset text value and search result.
     */
    private handleStopEditAndBlur() {
        // In browsers where shadow DOM is not supported activeElement on shadowRoot will return null
        // However, document.activeElement will return the actual focused element instead of the outermost shadow host
        const element =
            this.host.shadowRoot.activeElement || document.activeElement;
        const portalElement = document.querySelector(`#${this.portalId}`);
        if (
            isDescendant(element as HTMLElement, this.host) ||
            isDescendant(element as HTMLElement, portalElement as HTMLElement)
        ) {
            return;
        }

        this.clearInputField();
    }

    /**
     * Input handler for the input field
     *
     * @param event - event
     */
    private async handleTextInput(event) {
        event.stopPropagation();

        const query = event.detail;
        this.textValue = query;

        this.debouncedSearch(query);
        // If the search-query is an empty string, bypass debouncing.
        if (query === '') {
            this.debouncedSearch.flush();
        }
    }

    private search = async (query: string) => {
        const timeoutId = setTimeout(() => {
            this.loading = true;
        });
        const searcher = this.searcher || this.defaultSearcher;
        const result = (await searcher(this.textValue)) as Array<
            ListItem<PickerValue>
        >;

        // If the search function resolves immediately,
        // the loading spinner will not be shown.
        clearTimeout(timeoutId);

        this.handleSearchResult(query, result);
    };

    private defaultSearcher: Searcher = async (
        query: string
    ): Promise<ListItem[]> => {
        if (query === '') {
            return this.allItems.slice(0, DEFAULT_SEARCHER_MAX_RESULTS);
        }

        const filteredItems = this.allItems.filter((item) => {
            let searchText = item.text.toLowerCase();
            if (item.secondaryText) {
                searchText =
                    searchText + ' ' + item.secondaryText.toLowerCase();
            }

            return searchText.includes(query.toLowerCase());
        });

        return filteredItems.slice(0, DEFAULT_SEARCHER_MAX_RESULTS);
    };

    /**
     * Change handler for the list
     *
     * @param event - event
     */
    private handleListChange(
        event: LimelListCustomEvent<ListItem<PickerValue>>
    ) {
        event.stopPropagation();
        if (!this.value || this.value !== event.detail) {
            let newValue: ListItem<PickerValue> | Array<ListItem<PickerValue>> =
                event.detail;
            if (this.multiple) {
                newValue = [
                    ...(this.value as Array<ListItem<PickerValue>>),
                    event.detail,
                ];
            }

            this.change.emit(newValue);
            this.items = [];
        }

        if (this.multiple) {
            this.textValue = '';
            this.chipSet?.setFocus(true);
        }
    }

    /**
     * Change handler for the list
     *
     * @param event - event
     */
    private handleActionListChange(
        event: LimelListCustomEvent<ListItem<Action>>
    ) {
        event.stopPropagation();
        if (!event.detail) {
            return;
        }

        this.action.emit(event.detail.value);
        this.items = [];
    }

    /**
     * Focus handler for the chip set
     * Prevent focus if the picker has a value and does not support multiple values
     */
    private handleInputFieldFocus() {
        const query = this.textValue;
        this.debouncedSearch(query);
    }

    private handleChange(event: LimelChipSetCustomEvent<Chip | Chip[]>) {
        event.stopPropagation();

        let newValue = null;
        if (this.multiple) {
            const chips = event.detail as Chip[];
            newValue = chips.map((chip) => {
                return (this.value as ListItem[]).find((item) => {
                    const valueId = this.getValueId(item);

                    return `${valueId}` === chip.id;
                });
            });
        }

        this.change.emit(newValue);
    }

    private handleInteract(event: LimelChipSetCustomEvent<Chip>) {
        event.stopPropagation();
        this.interact.emit(event.detail ? event.detail.value : event.detail);
    }

    /**
     * Key handler for the input field
     * Will change focus to the first/last item in the dropdown list to enable selection with the keyboard
     *
     * @param event - event
     */
    private handleInputKeyDown(event: KeyboardEvent) {
        const isForwardTab =
            event.key === TAB &&
            !event.altKey &&
            !event.metaKey &&
            !event.shiftKey;
        const isUp = event.key === ARROW_UP;
        const isDown = event.key === ARROW_DOWN;

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
                '.mdc-deprecated-list-item:first-child'
            );
            listElement.focus();

            return;
        }

        if (isUp) {
            const listElement: HTMLElement = list.shadowRoot.querySelector(
                '.mdc-deprecated-list-item:last-child'
            );
            listElement.focus();
        }
    }

    /**
     * Key handler for the dropdown
     *
     * @param event - event
     */
    private handleDropdownKeyDown(event: KeyboardEvent) {
        const isEscape = event.key === ESCAPE;

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

    private handleCloseMenu() {
        if (this.items.length > 0) {
            return;
        }

        this.clearInputField();
    }

    private clearInputField() {
        this.chipSet.emptyInput();
        this.textValue = '';
        this.handleSearchResult('', []);
        this.debouncedSearch.cancel();
    }
}
