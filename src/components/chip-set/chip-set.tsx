import { Chip, Languages } from '../../interface';
import {
    MDCChipInteractionEvent,
    MDCChipSelectionEvent,
    MDCChipSet,
} from '@material/chips/deprecated';
import { MDCTextField } from '@material/textfield';
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
import translate from '../../global/translations';
import { getHref, getTarget } from '../../util/link-helper';
import { isEqual } from 'lodash-es';

const SELECTED_CHIP_CLASS = 'mdc-chip--selected';
const INPUT_FIELD_TABINDEX = 1;

/**
 * @exampleComponent limel-example-chip-set
 * @exampleComponent limel-example-chip-set-choice
 * @exampleComponent limel-example-chip-set-filter
 * @exampleComponent limel-example-chip-set-filter-badge
 * @exampleComponent limel-example-chip-set-input
 * @exampleComponent limel-example-chip-set-input-type-text
 * @exampleComponent limel-example-chip-set-input-type-search
 * @exampleComponent limel-example-chip-icon-color
 * @exampleComponent limel-example-chip-set-composite
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
     * Label for the chip-set
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Optional helper text to display below the chipset.
     * When type is `input`, the helper text is displayed below the
     * input field when it has focus.
     * When type is not `input`, the helper text is always displayed
     * if the device is touch screen; otherwise it is shown when chip-set
     * is hovered or focused using keyboard navigation.
     */
    @Prop({ reflect: true })
    public helperText: string;

    /**
     * True if the chip set should be disabled
     */
    @Prop({ reflect: true })
    public disabled: boolean = false;

    /**
     * For chip-sets of type `input`, set to `true` to disable adding and
     * removing chips, but allow interaction with existing chips in the set.
     * For any other types, setting either `readonly` or `disabled` disables
     * the chip-set.
     */
    @Prop({ reflect: true })
    public readonly: boolean = false;

    /**
     * For chip-sets of type `input`. Value to use for the `type` attribute on the
     * input field inside the chip-set.
     */
    @Prop({ reflect: true })
    public inputType: 'search' | 'text' = 'text';

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
     * Whether the "Clear all" buttons should be shown
     */
    @Prop()
    public clearAllButton: boolean = true;

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
     * Defines the language for translations.
     * Will translate the translatable strings on the components. For example, the clear all chips label.
     */
    @Prop()
    public language: Languages = 'en';

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

    constructor() {
        this.renderChip = this.renderChip.bind(this);
        this.renderInputChip = this.renderInputChip.bind(this);
        this.isFull = this.isFull.bind(this);
        this.handleInteractionEvent = this.handleInteractionEvent.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleTextFieldFocus = this.handleTextFieldFocus.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleTextInput = this.handleTextInput.bind(this);
        this.inputFieldOnChange = this.inputFieldOnChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.inputHidden = this.inputHidden.bind(this);
        this.handleDeleteAllIconClick =
            this.handleDeleteAllIconClick.bind(this);
        this.renderDelimiter = this.renderDelimiter.bind(this);
    }

    /**
     * Used to find out whether the chip-set is in edit mode.
     * @returns {Promise<boolean>} `true` if the chip-set is in edit mode, `false` otherwise.
     */
    @Method()
    public async getEditMode(): Promise<boolean> {
        return this.editMode;
    }

    /**
     * Used to set focus to the chip-set input field.
     * @param {boolean} emptyInput if `true`, any text in the input is discarded
     * @returns {Promise<void>} does not return anything, but methods have to be async
     */
    @Method()
    public async setFocus(emptyInput: boolean = false) {
        if (this.disabled || this.readonly) {
            return;
        }

        this.editMode = true;
        if (emptyInput) {
            this.textValue = '';
        }

        this.host.shadowRoot.querySelector('input').focus();
        this.startEdit.emit();
    }

    /**
     * Used to empty the input field. Used in conjunction with `emptyInputOnBlur` to let the
     * consumer control when the input is emptied.
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
            disabled: this.disabled || this.readonly,
            'mdc-text-field--with-trailing-icon': true,
        };
        if (this.type) {
            classes[`mdc-chip-set--${this.type}`] = true;
        }

        const chipSetLabel = this.renderChipSetLabel();
        if (chipSetLabel) {
            classes['chip-set--with-label'] = true;
        }

        return (
            <div class={classes} role="grid">
                {chipSetLabel}
                {this.value.map(this.renderChip)}
                {this.renderHelperLine()}
            </div>
        );
    }

    @Watch('value')
    protected handleChangeChips(newValue: Chip[], oldValue: Chip[]) {
        if (isEqual(newValue, oldValue)) {
            return;
        }

        this.syncEmptyInput();
    }

    private createMDCChipSet() {
        this.mdcChipSet = new MDCChipSet(
            this.host.shadowRoot.querySelector('.mdc-chip-set')
        );

        if (!this.type || this.type === 'input') {
            this.mdcChipSet.listen(
                'MDCChip:interaction',
                this.handleInteractionEvent
            );
        }

        if (this.type === 'choice' || this.type === 'filter') {
            this.mdcChipSet.listen('MDCChip:selection', this.handleSelection);
        }
    }

    private destroyMDCChipSet() {
        if (this.mdcChipSet) {
            this.mdcChipSet.unlisten(
                'MDCChip:interaction',
                this.handleInteractionEvent
            );
            this.mdcChipSet.unlisten('MDCChip:selection', this.handleSelection);

            this.mdcChipSet.destroy();
        }
    }

    private renderChipSetLabel() {
        if (!this.label) {
            return;
        }

        return (
            <label class="chip-set__label mdc-floating-label mdc-floating-label--float-above">
                {this.label}
            </label>
        );
    }

    private renderInputChips() {
        return [
            <div
                class={{
                    'mdc-text-field mdc-text-field--outlined': true,
                    'mdc-chip-set mdc-chip-set--input': true,
                    'force-invalid': this.isInvalid(),
                    'mdc-text-field--disabled': this.readonly || this.disabled,
                    'lime-text-field--readonly': this.readonly,
                    'has-chips mdc-text-field--label-floating':
                        this.value.length !== 0,
                    'has-leading-icon': this.leadingIcon !== null,
                    'has-clear-all-button': this.clearAllButton,
                }}
                onClick={this.handleTextFieldFocus}
            >
                {this.value.map(this.renderInputChip)}
                <input
                    tabIndex={INPUT_FIELD_TABINDEX}
                    type={this.inputType}
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
                        'mdc-notched-outline--upgraded': true,
                        'mdc-text-field--required': this.required,
                        'lime-notched-outline--notched': this.floatLabelAbove(),
                    }}
                    dropzone-tip={this.dropZoneTip()}
                >
                    <div class="mdc-notched-outline__leading" />
                    {this.renderLabel()}
                    <div class="mdc-notched-outline__trailing" />
                </div>
                {this.renderLeadingIcon()}
                {this.renderEmptyValueForReadonly()}
                {this.renderClearAllChipsButton()}
            </div>,
            this.renderHelperLine(),
        ];
    }

    private renderEmptyValueForReadonly = () => {
        if (this.readonly && this.value.length === 0) {
            return (
                <span class="lime-empty-value-for-readonly lime-looks-like-input-value">
                    –
                </span>
            );
        }
    };

    private renderLabel() {
        const labelClassList = {
            'mdc-floating-label': true,
            'mdc-text-field--disabled': this.readonly || this.disabled,
            'mdc-floating-label--required': this.required,
            'lime-floating-label--float-above': this.floatLabelAbove(),
        };

        if (!this.label) {
            return;
        }

        return (
            <div class="mdc-notched-outline__notch">
                <label class={labelClassList} htmlFor="input-element">
                    {this.label}
                </label>
            </div>
        );
    }

    private floatLabelAbove = () => {
        if (!!this.value.length || this.editMode || this.readonly) {
            return true;
        }
    };

    private dropZoneTip = (): string => {
        return translate.get('file.drag-and-drop-tips', this.language);
    };

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
     * @returns {void}
     */
    private handleTextFieldFocus() {
        if (this.disabled || this.readonly) {
            return;
        }

        if (this.editMode) {
            return;
        }

        this.editMode = true;
        this.startEdit.emit();
    }

    /**
     * Exit edit mode when the input element loses focus. This makes sure the input element does not take up any
     * additional space when the user it not typing anything
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
                {chip.icon ? this.renderChipIcon(chip) : null}
                {chip.text ? this.renderChipLabel(chip) : null}
            </div>
        );
    }

    private renderChipLabel(chip: Chip<any>) {
        const attributes: any = {};
        if (chip.href) {
            attributes.href = getHref(chip.href);
            attributes.target = getTarget(chip.href);
        }

        return (
            <span role="gridcell">
                <a
                    role="button"
                    tabindex={this.disabled ? '-1' : '0'}
                    class="mdc-chip__text"
                    {...attributes}
                >
                    {chip.text}
                </a>
            </span>
        );
    }

    private hasHelperText = () => {
        return this.helperText !== null && this.helperText !== undefined;
    };

    private renderHelperLine = () => {
        if (!this.maxItems && !this.hasHelperText()) {
            return;
        }

        return (
            <limel-helper-line
                length={this.value.length}
                maxLength={this.maxItems}
                helperText={this.helperText}
                invalid={this.isInvalid()}
            />
        );
    };

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
                            stroke="currentColor"
                            d="M1.73,12.91 8.1,19.28 22.79,4.59"
                        />
                    </svg>
                </span>
                <span role="gridcell">
                    <span
                        role="checkbox"
                        tabindex={this.disabled ? '-1' : '0'}
                        aria-checked="false"
                        class="mdc-chip__text"
                    >
                        {chip.text}
                    </span>
                </span>
                {this.renderBadge(chip)}
            </div>
        );
    }

    private renderInputChip(chip: Chip, index: number) {
        return [
            <div
                class={{
                    'mdc-chip': true,
                    'mdc-chip--selected': this.inputChipIndexSelected === index,
                    disabled: this.disabled,
                }}
                role="row"
                id={`${chip.id}`}
                onClick={this.catchInputChipClicks}
            >
                {chip.icon ? this.renderChipIcon(chip) : null}
                {this.renderChipLabel(chip)}
                {this.renderChipRemoveButton(chip)}
            </div>,
            this.renderDelimiter(),
        ];
    }

    private catchInputChipClicks(event) {
        event.stopPropagation();
    }

    private renderChipIcon(chip: Chip) {
        const style = {};
        if (chip.iconFillColor) {
            style['--icon-color'] = chip.iconFillColor;
        }

        if (chip.iconBackgroundColor) {
            style['--icon-background-color'] = chip.iconBackgroundColor;
        }

        return (
            <limel-icon
                class="mdc-chip__icon mdc-chip__icon--leading"
                name={chip.icon}
                style={style}
                size="small"
                badge={true}
                title={chip.iconTitle}
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

    private renderChipRemoveButton(chip: Chip) {
        if (!chip.removable || this.readonly || this.disabled) {
            return;
        }

        const svgData = `<svg style="height:100%;width:100%;" width="32" height="32" x="0px" y="0px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
    <line fill="none" id="svg_1" stroke="currentColor" stroke-width="2" x1="8" x2="24" y1="8" y2="24"/>
    <line fill="none" id="svg_2" stroke="currentColor" stroke-width="2" x1="24" x2="8" y1="8" y2="24"/>
</svg>`;

        const removeFunc = (event: MouseEvent) => {
            event.stopPropagation();
            this.removeChip(chip.id);
        };

        return (
            <button
                class="mdc-chip__icon mdc-chip__icon--trailing mdc-deprecated-chip-trailing-action"
                aria-label={this.removeChipLabel}
                tabindex="-1"
                innerHTML={svgData}
                onClick={removeFunc}
            />
        );
    }

    private renderClearAllChipsButton() {
        if (this.disabled || this.readonly || !this.clearAllButton) {
            return;
        }

        return (
            <a
                href=""
                onClick={this.handleDeleteAllIconClick}
                class="mdc-text-field__icon clear-all-button"
                tabindex="0"
                role="button"
                title={this.clearAllChipsLabel()}
                aria-label={this.clearAllChipsLabel()}
            />
        );
    }

    private clearAllChipsLabel = (): string => {
        return translate.get('chip-set.clear-all', this.language);
    };

    private removeChipLabel = (): string => {
        return translate.get('chip-set.remove-chip', this.language);
    };

    private handleDeleteAllIconClick(event: Event) {
        event.preventDefault();
        this.change.emit([]);
    }

    private renderDelimiter() {
        if (!this.delimiter) {
            return;
        }

        return <div class="delimiter">{this.delimiter}</div>;
    }

    private renderBadge(chip: Chip) {
        if (!chip.badge) {
            return;
        }

        return <limel-badge label={chip.badge} />;
    }
}
