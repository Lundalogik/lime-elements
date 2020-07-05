import { MDCCheckbox } from '@limetech/mdc-checkbox';
import { MDCFormField } from '@limetech/mdc-form-field';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
    State,
} from '@stencil/core';
import { createRandomString } from '../../util/random-string';
import { CheckboxTemplate } from './checkbox.template';

/**
 * @exampleComponent limel-example-checkbox
 */
@Component({
    tag: 'limel-checkbox',
    shadow: true,
    styleUrl: 'checkbox.scss',
})
export class Checkbox {
    /**
     * Disables the input field when `true`.
     */
    @Prop({ reflectToAttr: true })
    public disabled = false;

    /**
     * The checkbox label.
     */
    @Prop({ reflectToAttr: true })
    public label: string;

    /**
     * The value of the checkbox. Set to `true` to make the checkbox checked.
     */
    @Prop({ reflectToAttr: true })
    public checked = false;

    /**
     * Set to `true` to indicate that the checkbox must be checked.
     * Defaults to `false`.
     */
    @Prop({ reflectToAttr: true })
    public required: boolean = false;

    @State()
    private modified = false;

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

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public componentDidLoad() {
        this.formField = new MDCFormField(
            this.limelCheckbox.shadowRoot.querySelector('.mdc-form-field')
        );
        this.mdcCheckbox = new MDCCheckbox(
            this.limelCheckbox.shadowRoot.querySelector('.mdc-checkbox')
        );
        this.formField.input = this.mdcCheckbox;
    }

    // eslint-disable-next-line @stencil/own-methods-must-be-private
    public componentDidUnload() {
        this.mdcCheckbox?.destroy();
        this.formField?.destroy();
    }

    public render() {
        return (
            <CheckboxTemplate
                disabled={this.disabled}
                label={this.label}
                checked={this.checked}
                required={this.required}
                invalid={this.required && this.modified && !this.checked}
                onChange={this.onChange}
                id={this.id}
            />
        );
    }

    private onChange(event: Event) {
        event.stopPropagation();
        this.change.emit(this.mdcCheckbox.checked);
        this.modified = true;
    }
}
