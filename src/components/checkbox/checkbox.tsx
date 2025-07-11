import { MDCCheckbox, cssClasses } from '@material/checkbox';
import { MDCFormField } from '@material/form-field';
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
import { createRandomString } from '../../util/random-string';
import { CheckboxTemplate } from './checkbox.template';
import { Label } from '../dynamic-label/label.types';

/**
 * The Checkbox component is a classic and essential element in UI design that allows
 * users to make multiple selections from a predefined list of options. The Checkbox component is commonly used in forms and settings interfaces to enable users to
 * select one or more items from a list of choices.
 *
 * ## States of a Checkbox
 * When a user clicks or taps on the box, it toggles between two states:
 * Checked and Unchecked.
 *
 * However, a Checkbox can visualize a third state called the "Indeterminate" state.
 * In this state, the checkbox appears as a filled box with a horizontal line or dash inside it.
 *
 * The Indeterminate state is typically used when dealing with checkbox groups
 * that have hierarchical relationships or when the group contains sub-items.
 * This state is used to indicate that that some, but not all, of the items in a group are selected.
 *
 * :::important
 * Checkboxes are sometimes used interchangeably with switches in user interfaces.
 * But there is an important difference between the two! Please read our guidelines about
 * [Switch vs. Checkbox](/#/DesignGuidelines/switch-vs-checkbox.md/).
 *
 * @exampleComponent limel-example-checkbox
 * @exampleComponent limel-example-checkbox-helper-text
 * @exampleComponent limel-example-checkbox-readonly
 */
@Component({
    tag: 'limel-checkbox',
    shadow: true,
    styleUrl: 'checkbox.scss',
})
export class Checkbox {
    /**
     * Disables the checkbox when `true`. Works exactly the same as `readonly`.
     * If either property is `true`, the checkbox will be disabled.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Disables the checkbox when `true`. This visualizes the checkbox slightly differently.
     * But shows no visual sign indicating that the checkbox is disabled
     * or can ever become interactable.
     */
    @Prop({ reflect: true })
    public readonly = false;

    /**
     * Set to `true` to indicate that the current value is invalid.
     */
    @Prop({ reflect: true })
    public invalid: boolean;

    /**
     * The checkbox label.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Optional helper text to display below the checkbox
     */
    @Prop({ reflect: true })
    public helperText: string;

    /**
     * The value of the checkbox. Set to `true` to make the checkbox checked.
     */
    @Prop({ reflect: true })
    public checked = false;

    /**
     * Enables indeterminate state. Set to `true` to signal indeterminate check.
     */
    @Prop({ reflect: true })
    public indeterminate = false;

    /**
     * Set to `true` to indicate that the checkbox must be checked.
     */
    @Prop({ reflect: true })
    public required: boolean = false;

    /**
     * The labels to use to clarify what kind of data is being visualized,
     * when the component is `readonly`.
     * @beta
     */
    @Prop()
    public readonlyLabels?: Array<Label<boolean>> = [];

    @State()
    private modified = false;
    private shouldReinitialize = false;

    /**
     * Emitted when the input value is changed.
     */
    @Event()
    private change: EventEmitter<boolean>;

    @Element()
    private limelCheckbox: HTMLLimelCheckboxElement;

    private formField: MDCFormField;
    private mdcCheckbox: MDCCheckbox;
    private id: string = createRandomString();
    private helperTextId: string = createRandomString();

    @Watch('checked')
    protected handleCheckedChange(newValue: boolean) {
        if (!this.mdcCheckbox) {
            return;
        }

        this.mdcCheckbox.checked = newValue;
    }

    @Watch('indeterminate')
    protected handleIndeterminateChange(newValue: boolean) {
        this.mdcCheckbox.checked = this.checked;
        this.mdcCheckbox.indeterminate = newValue;
    }

    @Watch('readonly')
    protected handleReadonlyChange() {
        this.destroyMDCInstances();
        this.shouldReinitialize = true;
    }

    componentDidRender() {
        if (this.shouldReinitialize) {
            this.initialize();
            this.shouldReinitialize = false;
        }
    }

    public connectedCallback() {
        this.initialize();
    }

    public componentDidLoad() {
        this.initialize();
    }

    private destroyMDCInstances = () => {
        this.mdcCheckbox?.destroy();
        this.formField?.destroy();

        const checkboxElement = this.getCheckboxElement();
        if (checkboxElement) {
            checkboxElement.classList.remove(
                cssClasses.ANIM_CHECKED_INDETERMINATE,
                cssClasses.ANIM_CHECKED_UNCHECKED,
                cssClasses.ANIM_INDETERMINATE_CHECKED,
                cssClasses.ANIM_INDETERMINATE_UNCHECKED,
                cssClasses.ANIM_UNCHECKED_CHECKED,
                cssClasses.ANIM_UNCHECKED_INDETERMINATE
            );
        }
    };

    public disconnectedCallback() {
        this.destroyMDCInstances();
    }

    public render() {
        return (
            <CheckboxTemplate
                disabled={this.disabled || this.readonly}
                label={this.label}
                readonlyLabels={this.readonlyLabels}
                helperText={this.helperText}
                helperTextId={this.helperTextId}
                checked={this.checked || this.indeterminate}
                indeterminate={this.indeterminate}
                required={this.required}
                readonly={this.readonly}
                invalid={this.isInvalid()}
                onChange={this.onChange}
                id={this.id}
            />
        );
    }

    private isInvalid = () => {
        if (this.invalid) {
            return true;
        }

        if (this.required && this.modified && !this.checked) {
            return true;
        }
    };

    private initialize = () => {
        const element =
            this.limelCheckbox.shadowRoot.querySelector('.mdc-form-field');
        if (!element) {
            return;
        }

        this.formField = new MDCFormField(element);
        this.mdcCheckbox = new MDCCheckbox(this.getCheckboxElement());
        this.formField.input = this.mdcCheckbox;
    };

    private getCheckboxElement = () => {
        return this.limelCheckbox.shadowRoot.querySelector('.mdc-checkbox');
    };

    private onChange = (event: Event) => {
        event.stopPropagation();
        this.change.emit(this.mdcCheckbox.checked);
        this.modified = true;
    };
}
