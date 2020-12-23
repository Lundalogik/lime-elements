import { Chip } from '@limetech/lime-elements';
import {
    MDCChipInteractionEvent,
    MDCChipSelectionEvent,
    MDCChipSet,
} from '@limetech/mdc-chips';
import { MDCTextField } from '@limetech/mdc-textfield';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Method,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import { handleKeyboardEvent } from './chip-set-input-helpers';

const SELECTED_CHIP_CLASS = 'mdc-chip--selected';

/**
 * @exampleComponent limel-example-chip-set
 * @exampleComponent limel-example-chip-set-choice
 * @exampleComponent limel-example-chip-set-filter
 * @exampleComponent limel-example-chip-set-input
 */
@Component({
    tag: 'limel-chip-set',
    shadow: true,
    styleUrl: 'chip-set.scss',
})
export class ChipSet {
    /**
     * List of chips for the set
     */
    @Prop()
    public value: Chip[] = [];

    /**
     * Type of chip set
     *
     * - `choice` renders a set of selectable chips where only one is selectable. The `removable` property is ignored
     * - `filter` renders a set of selectable chips where all are selectable. The `icon` property is ignored
     * - `input` renders a set of chips that can be used in conjunction with an input field
     *
     * If no type is set, a basic set of chips without additional functionality will be rendered
     */
    @Prop({ reflect: true })
    public type?: 'choice' | 'filter' | 'input';

    /**
     * Label to display for the input field when type is `input`
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * True if the chip set should be disabled
     */
    @Prop({ reflect: true })
    public disabled: boolean = false;

    /**
     * For chip-sets of type `input`. Set to `true` to disable adding and removing chips,
     * but allow interaction with existing chips in the set.
     */
    @Prop({ reflect: true })
    public readonly: boolean = false;

    /**
     * For chip-sets of type `input`. Limits the maximum number of chips.
     * When the value is `0` or not set, no limit is applied.
     */
    @Prop({ reflect: true })
    public maxItems: number;

    /**
     * True if the control requires a value
     */
    @Prop({ reflect: true })
    public required: boolean = false;

    /**
     * Search label to display when type is `input` and component is in search mode
     */
    @Prop({ reflect: true })
    public searchLabel: string;

    /**
     * Whether the input field should be emptied when the chip-set loses focus.
     */
    @Prop({ reflect: true })
    public emptyInputOnBlur: boolean = true;

    /**
     * For chip-sets of type `input`. When the value is null, no leading icon is used.
     * Leading icon to show to the far left in the text field
     */
    @Prop({ reflect: true })
    public leadingIcon: string = null;

    /**
     * For chip-set of type `input`. Sets delimiters between chips.
     */
    @Prop({ reflect: true })
    public delimiter: string = null;

    /**
     * Dispatched when a chip is interacted with
     */
    @Event()
    private interact: EventEmitter<Chip>;

    /**
     * Dispatched when a chip is selected/deselected
     */
    @Event()
    private change: EventEmitter<Chip | Chip[]>;

    /**
     * Emitted when an input chip set has received focus and editing in the text field has started
     */
    @Event()
    private startEdit: EventEmitter<void>;

    /**
     * Emitted when an input chip set has lost focus and editing in the text field has ended
     */
    @Event()
    private stopEdit: EventEmitter<void>;

    /**
     * Dispatched when the input is changed for type `input`
     */
    @Event()
    private input: EventEmitter<string>;

    @Element()
    private host: HTMLLimelChipSetElement;

    @State()
    private editMode: boolean = false;

    @State()
    private textValue: string = '';

    @State()
    private blurred: boolean = false;

    @State()
    private inputChipIndexSelected: number = null;

    private mdcChipSet: MDCChipSet;
    private mdcTextField: MDCTextField;
    private handleKeyDown = handleKeyboardEvent;
    private clearAllLabel = 'Clear chips';

    constructor() {
        this.renderChip = this.renderChip.bind(this);
        this.renderInputChip = this.renderInputChip.bind(this);
        this.isFull = this.isFull.bind(this);
        this.handleInteractionEvent = this.handleInteractionEvent.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleRemoveEvent = this.handleRemoveEvent.bind(this);
        this.handleTextFieldFocus = this.handleTextFieldFocus.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleTextInput = this.handleTextInput.bind(this);
        this.inputFieldOnChange = this.inputFieldOnChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.inputHidden = this.inputHidden.bind(this);
        this.handleDeleteAllIconClick = this.handleDeleteAllIconClick.bind(
            this
        );
        this.renderDelimiter = this.renderDelimiter.bind(this);
    }

    /**
     * Used to find out whether the chip-set is in edit mode.
     *
     * @returns {Promise<boolean>} `true` if the chip-set is in edit mode, `false` otherwise.
     */
    @Method()
    public async getEditMode(): Promise<boolean> {
        return this.editMode;
    }

    /**
     * Used to set focus to the chip-set input field.
     *
     * @param {boolean} emptyInput if `true`, any text in the input is discarded
     *
     * @returns {Promise<void>} does not return anything, but methods have to be async
     */
    @Method()
    public async setFocus(emptyInput: boolean = false) {
        this.editMode = true;
        if (emptyInput) {
            this.textValue = '';
        }

        this.host.shadowRoot.querySelector('input').focus();
    }

    /**
     * Used to empty the input field. Used in conjunction with `emptyInputOnBlur` to let the
     * consumer control when the input is emptied.
     *
     * @returns {Promise<void>} does not return anything, but methods have to be async
     */
    @Method()
    public async emptyInput() {
        this.syncEmptyInput();
    }

    public componentDidLoad() {
        if (this.type === 'input') {
            this.mdcTextField = new MDCTextField(
                this.host.shadowRoot.querySelector('.mdc-text-field')
            );
        }

        this.createMDCChipSet();
    }

    public componentWillUpdate() {
        this.destroyMDCChipSet();
    }

    public componentDidUpdate() {
        this.createMDCChipSet();
        const input = this.host.shadowRoot.querySelector('input');
        if (input && this.editMode) {
            input.focus();
        }
    }

    public disconnectedCallback() {
        this.destroyMDCChipSet();

        if (this.mdcTextField) {
            this.mdcTextField.destroy();
        }
    }

    public render() {
        if (this.type === 'input') {
            return this.renderInputChips();
        }

        const classes = {
            'mdc-chip-set': true,
            disabled: this.disabled,
            'mdc-text-field--with-trailing-icon': true,
        };
        if (this.type) {
            classes[`mdc-chip-set--${this.type}`] = true;
        }

        return (
            <div class={classes} role="grid">
                {this.value.map(this.renderChip)}
            </div>
        );
    }

    @Watch('value')
    protected handleChangeChips() {
        this.syncEmptyInput();
    }

    private createMDCChipSet() {
        this.mdcChipSet = new MDCChipSet(
            this.host.shadowRoot.querySelector('.mdc-chip-set')
        );
        this.mdcChipSet.chips.forEach((chip) => {
            chip.shouldRemoveOnTrailingIconClick = false;
        });

        if (!this.type || this.type === 'input') {
            this.mdcChipSet.listen(
                'MDCChip:interaction',
                this.handleInteractionEvent
            );
        }

        if (this.type === 'choice' || this.type === 'filter') {
            this.mdcChipSet.listen('MDCChip:selection', this.handleSelection);
        }

        this.mdcChipSet.listen(
            'MDCChip:trailingIconInteraction',
            this.handleRemoveEvent
        );
    }

    private destroyMDCChipSet() {
        if (this.mdcChipSet) {
            this.mdcChipSet.unlisten(
                'MDCChip:interaction',
                this.handleInteractionEvent
            );
            this.mdcChipSet.unlisten('MDCChip:selection', this.handleSelection);
            this.mdcChipSet.unlisten(
                'MDCChip:trailingIconInteraction',
                this.handleRemoveEvent
            );

            this.mdcChipSet.destroy();
        }
    }

    private renderInputChips() {
        return (
            <div
                class={{
                    'mdc-text-field mdc-text-field--outlined': true,
                    'mdc-chip-set mdc-chip-set--input': true,
                    'force-invalid': this.isInvalid(),
                    'mdc-text-field--disabled': this.readonly || this.disabled,
                    'has-chips': this.value.length !== 0,
                    'has-leading-icon': this.leadingIcon !== null,
                }}
                onClick={this.handleTextFieldFocus}
            >
                {this.value.map(this.renderInputChip)}
                <input
                    type="text"
                    id="input-element"
                    disabled={this.readonly || this.disabled}
                    class={{
                        'mdc-text-field__input': true,
                        hidden: this.inputHidden(),
                    }}
                    value={this.textValue}
                    onBlur={this.handleInputBlur}
                    onFocus={this.handleTextFieldFocus}
                    onKeyDown={this.handleKeyDown}
                    onInput={this.handleTextInput}
                    // Some browsers emit a change event on input elements, we need to stop
                    // that event from propagating since we are emitting our own change event
                    onChange={this.inputFieldOnChange}
                    placeholder={this.isFull() ? '' : this.searchLabel}
                    readonly={this.isFull()}
                />
                <div
                    class={{
                        'mdc-notched-outline': true,
                        'lime-notched-outline--notched': !!this.value.length,
                    }}
                >
                    <div class="mdc-notched-outline__leading"></div>
                    <div class="mdc-notched-outline__notch">
                        <label
                            class={{
                                'mdc-floating-label': true,
                                'mdc-text-field--disabled':
                                    this.readonly || this.disabled,
                                'mdc-text-field--required': this.required,
                                'lime-floating-label--float-above': !!(
                                    this.value.length || this.editMode
                                ),
                            }}
                            htmlFor="input-element"
                        >
                            {this.label}
                        </label>
                    </div>
                    <div class="mdc-notched-outline__trailing"></div>
                </div>
                {this.renderLeadingIcon()}
                {this.renderClearAllChipsButton()}
            </div>
        );
    }

    private isFull(): boolean {
        return !!this.maxItems && this.value.length >= this.maxItems;
    }

    private isInvalid() {
        if (!this.required) {
            return false;
        }

        if (!this.blurred) {
            return false;
        }

        return !this.value || !this.value.length;
    }

    private inputFieldOnChange(event) {
        event.stopPropagation();
    }

    /**
     * Enter edit mode when the text field receives focus. When editMode is true, the input element will be visible
     *
     * @returns {void}
     */
    private handleTextFieldFocus() {
        if (this.editMode) {
            return;
        }

        this.editMode = true;
        this.startEdit.emit();
    }

    /**
     * Exit edit mode when the input element loses focus. This makes sure the input element does not take up any
     * additional space when the user it not typing anything
     *
     * @returns {void}
     */
    private handleInputBlur() {
        if (this.emptyInputOnBlur) {
            this.syncEmptyInput();
        }

        this.editMode = false;
        this.blurred = true;
        this.inputChipIndexSelected = null;

        // This timeout is needed in order to let a new element receive focus
        setTimeout(() => {
            this.stopEdit.emit();
        }, 0);
    }

    private syncEmptyInput() {
        this.textValue = '';
    }

    private inputHidden() {
        if (this.editMode) {
            return this.isFull();
        }

        // If there are chips in the picker, hide the input to avoid the input
        // being placed on a new line and adding ugly space beneath the chips.
        // If there are no chips, show the input, or the picker will look weird.
        return !!(this.value && this.value.length);
    }

    private handleTextInput(event) {
        event.stopPropagation();
        this.inputChipIndexSelected = null;
        this.textValue = event.target.value;
        this.input.emit(event.target.value && event.target.value.trim());
    }

    private handleInteractionEvent(event: MDCChipInteractionEvent) {
        const chip = this.value.find((item) => {
            return `${item.id}` === event.detail.chipId;
        });
        this.emitInteraction(chip);
    }

    private emitInteraction(chip: Chip) {
        this.interact.emit(chip);
    }

    private handleSelection(event: MDCChipSelectionEvent) {
        let chip = this.value.find((item) => {
            return `${item.id}` === event.detail.chipId;
        });
        chip = { ...chip, selected: event.detail.selected };
        this.change.emit(chip);
    }

    private handleRemoveEvent(event: MDCChipInteractionEvent) {
        this.removeChip(event.detail.chipId);
    }

    private removeChip(id: string | number) {
        const newValue = this.value.filter((chip) => {
            return `${chip.id}` !== `${id}`;
        });
        this.change.emit(newValue);
    }

    private renderChip(chip: Chip) {
        if (this.type === 'filter') {
            return this.renderFilterChip(chip);
        }

        return this.renderDefaultChip(chip);
    }

    private renderDefaultChip(chip: Chip) {
        return (
            <div
                class={`mdc-chip ${chip.selected ? SELECTED_CHIP_CLASS : ''}`}
                role="row"
                id={`${chip.id}`}
            >
                {chip.icon ? this.renderIcon(chip) : null}
                {chip.text ? this.renderLabel(chip) : null}
            </div>
        );
    }

    private renderLabel(chip: Chip<any>) {
        return (
            <span role="gridcell">
                <span role="button" tabindex="0" class="mdc-chip__text">
                    {chip.text}
                </span>
            </span>
        );
    }

    private renderFilterChip(chip: Chip) {
        return (
            <div
                class={`mdc-chip ${chip.selected ? SELECTED_CHIP_CLASS : ''}`}
                role="row"
                id={`${chip.id}`}
            >
                <span class="mdc-chip__checkmark">
                    <svg class="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30">
                        <path
                            class="mdc-chip__checkmark-path"
                            fill="none"
                            stroke="black"
                            d="M1.73,12.91 8.1,19.28 22.79,4.59"
                        />
                    </svg>
                </span>
                <span role="gridcell">
                    <span
                        role="checkbox"
                        tabindex="0"
                        aria-checked="false"
                        class="mdc-chip__text"
                    >
                        {chip.text}
                    </span>
                </span>
            </div>
        );
    }

    private renderInputChip(chip: Chip, index: number) {
        const attributes: { tabindex?: number } = {};
        if (this.readonly && !this.disabled) {
            attributes.tabindex = 0;
        }

        return [
            this.renderDelimiter(index),
            <div
                class={{
                    'mdc-chip': true,
                    'mdc-chip--selected': this.inputChipIndexSelected === index,
                    disabled: this.disabled,
                }}
                role="row"
                id={`${chip.id}`}
                onClick={this.catchInputChipClicks}
                {...attributes}
            >
                {chip.icon ? this.renderIcon(chip) : null}
                {this.renderLabel(chip)}
                {chip.removable && !this.readonly && !this.disabled
                    ? this.renderChipRemoveButton()
                    : null}
            </div>,
        ];
    }

    private catchInputChipClicks(event) {
        event.stopPropagation();
    }

    private renderIcon(chip: Chip) {
        const style = {};
        if (chip.iconFillColor) {
            style['--icon-color'] = chip.iconFillColor;
        }

        if (chip.iconBackgroundColor) {
            style['--icon-background-color'] = chip.iconBackgroundColor;
        }

        if (chip.iconColor) {
            // eslint-disable-next-line no-console
            console.warn(
                '`Chip.iconColor` is deprecated. Use `Chip.iconBackgroundColor` to set the background color of the icon.'
            );
            style['--icon-background-color'] = chip.iconColor;
        }

        return (
            <limel-icon
                class="mdc-chip__icon mdc-chip__icon--leading"
                name={chip.icon}
                style={style}
                size="small"
                badge={true}
            />
        );
    }

    private renderLeadingIcon() {
        if (!this.leadingIcon) {
            return;
        }

        return (
            <i class="mdc-text-field__icon search-icon">
                <limel-icon name={this.leadingIcon} />
            </i>
        );
    }

    private renderChipRemoveButton() {
        const svgData = `<svg style="height:100%;width:100%;" width="32" height="32" x="0px" y="0px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
    <line fill="none" id="svg_1" stroke="currentColor" stroke-width="2" x1="8" x2="24" y1="8" y2="24"/>
    <line fill="none" id="svg_2" stroke="currentColor" stroke-width="2" x1="24" x2="8" y1="8" y2="24"/>
</svg>`;

        return (
            <div
                class="mdc-chip__icon mdc-chip__icon--trailing"
                role="button"
                innerHTML={svgData}
            />
        );
    }

    private renderClearAllChipsButton() {
        return (
            <a
                href=""
                onClick={this.handleDeleteAllIconClick}
                class="mdc-text-field__icon clear-all-button"
                tabindex="0"
                role="button"
                title={this.clearAllLabel}
                aria-label={this.clearAllLabel}
            />
        );
    }
    private handleDeleteAllIconClick(event: Event) {
        event.preventDefault();
        this.change.emit([]);
    }

    private renderDelimiter(index: Number) {
        if (index === 0 || !this.delimiter) {
            return;
        }

        return <div class="delimiter">{this.delimiter}</div>;
    }
}
