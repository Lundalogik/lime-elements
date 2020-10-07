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
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * The checkbox label.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * The value of the checkbox. Set to `true` to make the checkbox checked.
     */
    @Prop({ reflect: true })
    public checked = false;

    /**
     * Set to `true` to indicate that the checkbox must be checked.
     * Defaults to `false`.
     */
    @Prop({ reflect: true })
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

    public connectedCallback() {
        this.initialize();
    }

    public componentDidLoad() {
        this.initialize();
    }

    private initialize() {
        const element = this.limelCheckbox.shadowRoot.querySelector(
            '.mdc-form-field'
        );
        if (!element) {
            return;
        }

        this.formField = new MDCFormField(element);
        this.mdcCheckbox = new MDCCheckbox(
            this.limelCheckbox.shadowRoot.querySelector('.mdc-checkbox')
        );
        this.formField.input = this.mdcCheckbox;
    }

    public disconnectedCallback() {
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
