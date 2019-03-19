import { MDCCheckbox } from '@lime-material-16px/checkbox';
import { MDCFormField } from '@lime-material-16px/form-field';
import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';
import { createRandomString } from '../../util/random-string';

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
     * Emitted when the input value is changed.
     */
    @Event()
    private change: EventEmitter<boolean>;

    @Element()
    private limelCheckbox: HTMLElement;

    private formField;
    private mdcCheckbox;
    private id = createRandomString();

    public componentDidLoad() {
        this.formField = new MDCFormField(
            this.limelCheckbox.shadowRoot.querySelector('.mdc-form-field')
        );
        this.mdcCheckbox = new MDCCheckbox(
            this.limelCheckbox.shadowRoot.querySelector('.mdc-checkbox')
        );
        this.formField.input = this.mdcCheckbox;
    }

    public componentDidUnload() {
        this.mdcCheckbox.destroy();
        this.formField.destroy();
    }

    public render() {
        return (
            <div class="mdc-form-field ">
                <div
                    class={`
                        mdc-checkbox
                        ${this.disabled ? 'mdc-checkbox--disabled' : ''}
                    `}
                >
                    <input
                        type="checkbox"
                        class="mdc-checkbox__native-control"
                        id={this.id}
                        checked={this.checked}
                        disabled={this.disabled}
                        onChange={this.onChange}
                    />
                    <div class="mdc-checkbox__background">
                        <svg
                            class="mdc-checkbox__checkmark"
                            viewBox="0 0 24 24"
                        >
                            <path
                                class="mdc-checkbox__checkmark-path"
                                fill="none"
                                d="M1.73,12.91 8.1,19.28 22.79,4.59"
                            />
                        </svg>
                        <div class="mdc-checkbox__mixedmark" />
                    </div>
                </div>
                <label htmlFor={this.id}>{this.label}</label>
            </div>
        );
    }

    private onChange = event => {
        event.stopPropagation();
        this.change.emit(this.mdcCheckbox.checked);
    };
}
