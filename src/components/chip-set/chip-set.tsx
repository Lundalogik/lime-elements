import { MDCChipSet } from '@lime-material/chips';
import { MDCTextField } from '@lime-material/textfield';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Method,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import { Chip } from './chip';

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
    @Prop()
    public type?: 'choice' | 'filter' | 'input';

    /**
     * Label to display for the input field when type is `input`
     */
    @Prop()
    public label: string;

    /**
     * True if the chip set should be disabled
     */
    @Prop({ reflectToAttr: true })
    public disabled: boolean = false;

    /**
     * True if the control requires a value
     */
    @Prop()
    public required: boolean = false;

    /**
     * Dispatched when a chip is interacted with
     */
    @Event()
    private interact: EventEmitter;

    /**
     * Dispatched when a chip is selected/deselected
     */
    @Event()
    private change: EventEmitter;

    /**
     * Dispatched when the input is changed for type `input`
     */
    @Event()
    private input: EventEmitter;

    @Element()
    private host: HTMLElement;

    @State()
    private editMode: boolean = false;

    @State()
    private textValue: string = '';

    private mdcChipSet: MDCChipSet;
    private mdcTextField: MDCTextField;

    constructor() {
        this.renderChip = this.renderChip.bind(this);
        this.handleInteraction = this.handleInteraction.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleTextFieldFocus = this.handleTextFieldFocus.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleTextInput = this.handleTextInput.bind(this);
    }

    /**
     * Used to find out whether the chip-set is in edit mode.
     *
     * @returns {boolean} `true` if the chip-set is in edit mode, `false` otherwise.
     */
    @Method()
    public getEditMode() {
        return this.editMode;
    }

    /**
     * Used to set focus to the chip-set input field.
     *
     * @returns {void}
     */
    @Method()
    public setFocus() {
        this.editMode = true;
        this.host.shadowRoot.querySelector('input').focus();
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

    public componentDidUnload() {
        this.destroyMDCChipSet();

        if (this.mdcTextField) {
            this.mdcTextField.destroy();
        }
    }

    public render() {
        if (this.type === 'input') {
            return this.renderInputChips();
        }

        let typeClass = '';
        if (this.type) {
            typeClass = `mdc-chip-set--${this.type}`;
        }

        return (
            <div class={`mdc-chip-set ${typeClass}`}>
                {this.value.map(this.renderChip)}
            </div>
        );
    }

    @Watch('value')
    protected handleChangeChips() {
        this.textValue = ' ';
    }

    private createMDCChipSet() {
        this.mdcChipSet = new MDCChipSet(
            this.host.shadowRoot.querySelector('.mdc-chip-set')
        );
        this.mdcChipSet.chips.forEach(chip => {
            chip.shouldRemoveOnTrailingIconClick = false;
        });

        if (!this.type || this.type === 'input') {
            this.mdcChipSet.listen(
                'MDCChip:interaction',
                this.handleInteraction
            );
        }

        if (this.type === 'choice' || this.type === 'filter') {
            this.mdcChipSet.listen('MDCChip:selection', this.handleSelection);
        }

        this.mdcChipSet.listen(
            'MDCChip:trailingIconInteraction',
            this.handleRemove
        );
    }

    private destroyMDCChipSet() {
        if (this.mdcChipSet) {
            this.mdcChipSet.unlisten(
                'MDCChip:interaction',
                this.handleInteraction
            );
            this.mdcChipSet.unlisten('MDCChip:selection', this.handleSelection);
            this.mdcChipSet.unlisten(
                'MDCChip:trailingIconInteraction',
                this.handleRemove
            );

            this.mdcChipSet.destroy();
        }
    }

    private renderInputChips() {
        // Hide the input field while we are not editing and there are chips in the set
        let hiddenInput = true;
        if (this.editMode || !this.value.length) {
            hiddenInput = false;
        }

        // Make sure the floating label is displayed correctly by setting the value of
        // the input to an empty/not empty value
        let textValue = this.textValue;
        if (!textValue && this.value.length > 0) {
            textValue = ' ';
        } else if (!this.value.length && !textValue.trim()) {
            textValue = '';
        }

        return (
            <div
                class="mdc-text-field"
                onFocus={this.handleTextFieldFocus}
                tabindex="0"
            >
                <div class="mdc-chip-set mdc-chip-set--input">
                    {this.value.map(this.renderChip)}
                    <input
                        type="text"
                        id="my-text-field"
                        required={this.required}
                        disabled={this.disabled}
                        class={`mdc-text-field__input ${
                            hiddenInput ? 'hidden' : ''
                        }`}
                        value={textValue}
                        onBlur={this.handleInputBlur}
                        onFocus={() => {
                            this.editMode = true;
                        }}
                        onInput={this.handleTextInput}
                    />
                </div>
                <label
                    class={`mdc-floating-label
                        ${textValue ? 'mdc-floating-label--float-above' : ''}
                        ${this.disabled ? 'mdc-text-field--disabled' : ''}
                        ${this.required ? 'mdc-text-field--required' : ''}
                        `}
                    htmlFor="my-text-field"
                >
                    {this.label}
                </label>
                <div class="mdc-line-ripple" />
            </div>
        );
    }

    /**
     * Enter edit mode when the text field receives focus. When editMode is true, the input element will be visible
     * @returns {void}
     */
    private handleTextFieldFocus() {
        this.editMode = true;
    }

    /**
     * Exit edit mode when the input element loses focus. This makes sure the input element does not take up any
     * additional space when the user it not typing anything
     * @returns {void}
     */
    private handleInputBlur() {
        this.editMode = false;
        this.textValue = ' ';
    }

    private handleTextInput(event) {
        event.stopPropagation();
        this.textValue = event.target.value;
        this.input.emit(event.target.value && event.target.value.trim());
    }

    private handleInteraction(event) {
        const chip = this.value.find(item => {
            return item.id === event.detail.chipId;
        });
        this.interact.emit(chip);
    }

    private handleSelection(event) {
        let chip = this.value.find(item => {
            return item.id === event.detail.chipId;
        });
        chip = { ...chip, selected: event.detail.selected };
        this.change.emit(chip);
    }

    private handleRemove(event) {
        const newValue = this.value.filter(chip => {
            return chip.id !== event.detail.chipId;
        });
        this.change.emit(newValue);
    }

    private renderChip(chip: Chip) {
        switch (this.type) {
            case 'choice':
                return this.renderChoiceChip(chip);

            case 'filter':
                return this.renderFilterChip(chip);

            case 'input':
            default:
                return this.renderDefaultChip(chip);
        }
    }

    private renderChoiceChip(chip: Chip) {
        return (
            <div
                class={`mdc-chip ${chip.selected ? 'mdc-chip--selected' : ''}`}
                tabindex="0"
                id={chip.id}
            >
                {chip.icon ? this.renderIcon(chip) : null}
                <div class="mdc-chip__text">{chip.text}</div>
            </div>
        );
    }

    private renderFilterChip(chip: Chip) {
        return (
            <div
                class={`mdc-chip ${chip.selected ? 'mdc-chip--selected' : ''}`}
                tabindex="0"
                id={chip.id}
            >
                <div class="mdc-chip__checkmark">
                    <svg class="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30">
                        <path
                            class="mdc-chip__checkmark-path"
                            fill="none"
                            stroke="black"
                            d="M1.73,12.91 8.1,19.28 22.79,4.59"
                        />
                    </svg>
                </div>
                <div class="mdc-chip__text">{chip.text}</div>
            </div>
        );
    }

    private renderDefaultChip(chip: Chip) {
        return (
            <div class="mdc-chip" tabindex="0" id={chip.id}>
                {chip.icon ? this.renderIcon(chip) : null}
                <div class="mdc-chip__text">{chip.text}</div>
                {chip.removable ? this.renderTrailingIcon() : null}
            </div>
        );
    }

    private renderIcon(chip: Chip) {
        const style = {};
        if (chip.iconColor) {
            style['--icon-background-color'] = chip.iconColor;
        }

        return (
            <limel-icon
                class="mdc-chip__icon mdc-chip__icon--leading"
                name={chip.icon}
                style={style}
            />
        );
    }

    private renderTrailingIcon() {
        return (
            <limel-icon
                class="mdc-chip__icon mdc-chip__icon--trailing"
                tabindex="0"
                role="button"
                name="multiply"
            />
        );
    }
}
