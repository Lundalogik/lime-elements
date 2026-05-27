import { Action } from '../collapsible-section/action';
import { ActionPosition, ActionScrollBehavior } from '../picker/actions.types';
import { Chip } from '../chip-set/chip.types';
import { Languages } from '../date-picker/date.types';
import { ListItem } from '../list-item/list-item.types';
import { ListSeparator } from '../../global/shared-types/separator.types';
import { PickerItem } from '../picker/picker-item.types';
import { Searcher } from '../picker/searcher.types';
import translate from '../../global/translations';
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
import { DebouncedFunc, debounce } from 'lodash-es';
import { IconName } from '../../global/shared-types/icon.types';

const SEARCH_DEBOUNCE = 300;
const CHIP_SET_TAG_NAME = 'limel-chip-set';
const DEFAULT_SEARCHER_MAX_RESULTS = 20;

/**
 * @exampleComponent limel-example-picker-basic
 * @exampleComponent limel-example-picker-multiple
 * @exampleComponent limel-example-picker-non-removable
 * @exampleComponent limel-example-picker-icons
 * @exampleComponent limel-example-picker-pictures
 * @exampleComponent limel-example-picker-value-as-object
 * @exampleComponent limel-example-picker-value-as-object-with-actions
 * @exampleComponent limel-example-picker-empty-suggestions
 * @exampleComponent limel-example-picker-leading-icon
 * @exampleComponent limel-example-picker-static-actions
 * @exampleComponent limel-example-picker-sections
 * @exampleComponent limel-example-picker-composite
 */
@Component({
    tag: 'limel-picker',
    shadow: { delegatesFocus: true },
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
    public leadingIcon: IconName;

    /**
     * A message to display when the search returned an empty result
     */
    @Prop()
    public emptyResultMessage: string;

    /**
     * Defines the language for translations. Affects the labels
     * rendered by the picker itself, such as the "Results matching"
     * header shown above the suggestion list while the user is typing.
     */
    @Prop()
    public language: Languages = 'en';

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
    public value: PickerItem | PickerItem[];

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
    public allItems?: PickerItem[] = [];

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
    private change: EventEmitter<PickerItem | PickerItem[]>;

    /**
     * Fired when clicking on a selected value
     */
    @Event()
    private interact: EventEmitter<PickerItem>;

    /**
     * Emitted when the user selects an action.
     */
    @Event()
    private action: EventEmitter<Action>;

    @State()
    private items: Array<PickerItem | ListSeparator>;

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
        this.updateTabIndex();
    }

    public disconnectedCallback() {
        this.debouncedSearch.cancel();
    }

    @Watch('disabled')
    protected onDisabledChange() {
        this.updateTabIndex();
    }

    private updateTabIndex() {
        if (this.disabled || this.readonly) {
            this.host.setAttribute('tabindex', '-1');
            return;
        }

        this.host.setAttribute('tabindex', '0');
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
                language={this.language}
                onInput={this.handleTextInput}
                onKeyDown={this.handleInputKeyDown}
                onChange={this.handleChange}
                onInteract={this.handleInteract}
                onStartEdit={this.handleInputFieldFocus}
                onStopEdit={this.handleStopEditAndBlur}
                emptyInputOnBlur={false}
                emptyInputOnChange={false}
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

    private createChips = (value: PickerItem | PickerItem[]): Chip[] => {
        if (!value) {
            return [];
        }

        if (this.multiple) {
            const listItems: PickerItem[] = value as PickerItem[];

            return listItems.map(this.createChip);
        }

        const listItem: PickerItem = value as PickerItem;

        return [this.createChip(listItem)];
    };

    private createChip = (listItem: PickerItem): Chip => {
        const name = getIconName(listItem.icon);

        const color = getIconFillColor(listItem.icon, listItem.iconColor);
        const valueId = this.getValueId(listItem);

        return {
            id: `${valueId}`,
            text: listItem.text,
            removable: listItem.removable !== false,
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
            // Only show "no matching results" when the user actually has
            // a query in flight. Without this guard, the message would
            // also render right after Esc clears the input, leaving the
            // dropdown stuck in an "empty result" state.
            if (this.textValue !== '') {
                return this.renderEmptyMessage();
            }

            return;
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
        if (event.key === ESCAPE) {
            // Stop bubble; otherwise menu-surface also emits `dismiss`
            // and triggers a duplicate clear via handleCloseMenu.
            event.preventDefault();
            event.stopPropagation();
            this.handleEscape();
            this.chipSet.setFocus();

            return;
        }
        if ([TAB, ENTER].includes(event.key)) {
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
        const result = await searcher(this.textValue);

        // If the search function resolves immediately,
        // the loading spinner will not be shown.
        clearTimeout(timeoutId);

        this.handleSearchResult(query, result);
    };

    private defaultSearcher: Searcher = async (
        query: string
    ): Promise<PickerItem[]> => {
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
    private handleListChange(event: LimelListCustomEvent<PickerItem>) {
        event.stopPropagation();
        if (!this.value || this.value !== event.detail) {
            let newValue: PickerItem | PickerItem[] = event.detail;
            if (this.multiple) {
                const currentValue = (this.value as PickerItem[]) ?? [];
                newValue = [...currentValue, event.detail];
            }

            this.change.emit(newValue);
            if (this.multiple) {
                const remaining = this.items.filter(
                    (item) => item !== event.detail
                );
                this.items = this.hasPickableItems(remaining) ? remaining : [];
            } else {
                // Single-pick: the search session ends with the pick, so
                // wipe the input. (In multi-pick we deliberately keep the
                // typed query so the user can keep adding matches.)
                this.items = [];
                this.textValue = '';
                this.chipSet?.emptyInput();
            }
        }

        if (this.multiple) {
            this.chipSet?.setFocus();
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
        this.textValue = '';

        let newValue = null;
        if (this.multiple) {
            const chips = event.detail as Chip[];
            newValue = chips.map((chip) => {
                return (this.value as PickerItem[]).find((item) => {
                    const valueId = this.getValueId(item);

                    return `${valueId}` === chip.id;
                });
            });
        }

        this.change.emit(newValue as PickerItem | PickerItem[]);
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
        const isEscape = event.key === ESCAPE;

        if (isEscape) {
            event.preventDefault();
            event.stopPropagation();
            this.handleEscape();

            return;
        }

        if (!isForwardTab && !isUp && !isDown) {
            return;
        }

        const list = document.querySelector(` #${this.portalId} limel-list`);
        if (!list) {
            return;
        }

        if (isForwardTab || isDown) {
            // Match by class only (not `:first-child`) so a leading
            // `ListSeparator` doesn't shadow the first focusable item.
            const listElement: HTMLElement = list.shadowRoot.querySelector(
                '.mdc-deprecated-list-item'
            );
            if (!listElement) {
                return;
            }

            event.preventDefault();
            listElement.focus();

            return;
        }

        if (isUp) {
            const listItems = list.shadowRoot.querySelectorAll<HTMLElement>(
                '.mdc-deprecated-list-item'
            );
            const listElement = [...listItems].at(-1);
            if (!listElement) {
                return;
            }

            event.preventDefault();
            listElement.focus();
        }
    }

    private handleSearchResult(
        query: string,
        result: Array<PickerItem | ListSeparator>
    ) {
        if (query === this.textValue) {
            let nextItems = result;
            if (this.multiple) {
                const values = (this.value as PickerItem[]) ?? [];
                nextItems = result.filter((item) => {
                    if ('separator' in item) {
                        return true;
                    }

                    return !values.includes(item);
                });
            }

            this.items = this.prependSearchHeader(query, nextItems);
            this.loading = false;
        }
    }

    private hasPickableItems(
        items: Array<PickerItem | ListSeparator>
    ): boolean {
        return items.some((item) => !('separator' in item));
    }

    private prependSearchHeader(
        query: string,
        items: Array<PickerItem | ListSeparator>
    ): Array<PickerItem | ListSeparator> {
        if (query === '') {
            return items;
        }
        if (!this.hasPickableItems(items)) {
            return items;
        }
        const text = translate.get('picker.results-matching', this.language, {
            query: query,
        });

        return [{ separator: true, text: text }, ...items];
    }

    private handleCloseMenu() {
        this.clearInputField();
    }

    /**
     * Shared prelude for any flow that ends the current search session:
     * wipe the chip-set's visible text, reset the picker's `textValue`,
     * and cancel any in-flight debounced search.
     *
     * Used by `clearInputField` (which then drops the dropdown
     * entirely) and `resetSearchToDefault` (which re-runs the searcher
     * with an empty query to repopulate the dropdown with defaults).
     */
    private clearTextValue() {
        this.chipSet.emptyInput();
        this.textValue = '';
        this.debouncedSearch.cancel();
    }

    private clearInputField() {
        this.clearTextValue();
        this.handleSearchResult('', []);
    }

    private resetSearchToDefault() {
        this.clearTextValue();
        this.search('');
    }

    /**
     * Two-stage Esc: first press clears the typed query but keeps the
     * dropdown open showing the default suggestions; a second press
     * (with the query already empty) closes the dropdown.
     */
    private handleEscape() {
        if (this.textValue === '') {
            this.clearInputField();
        } else {
            this.resetSearchToDefault();
        }
    }
}
