import { MDCTextField } from '@lime-material/textfield';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    State,
} from '@stencil/core';
import { ENTER_KEY_CODE, SPACE_KEY_CODE, ENTER, SPACE } from '../../util/keycodes';

@Component({
    tag: 'limel-text-field',
    shadow: true,
    styleUrl: 'text-field.scss',
})
export class TextField {
    /**
     * Disables the text-field when `true`.
     * Defaults to `false`.
     */
    @Prop({ reflectToAttr: true })
    public disabled = false;

    /**
     * Set to `true` to indicate that the current value of the text-field is
     * invalid.
     * Defaults to `false`.
     */
    @Prop({ reflectToAttr: true })
    public invalid = false;

    /**
     * The input label.
     */
    @Prop({ reflectToAttr: true })
    public label: string;

    /**
     * Set to `true` to indicate that the field is required.
     * Defaults to `false`.
     */
    @Prop({ reflectToAttr: true })
    public required = false;

    /**
     * The value of the field.
     * Please note that the value of this property is *not* updated by the
     * component itself when the user enters text. Instead, the new value is
     * available via the `change` event. If the new value is accepted (the
     * normal case), the consumer must update this property accordingly. If
     * the value is not updated, the change is, in effect, rejected.
     */
    @Prop({ reflectToAttr: true })
    public value: string;

    /**
     * This property just shows its value on the right side of the field
     * at this moment. As soon as we have integrated a icon library it's
     * supposed to match with an icon and display that
     */
    @Prop({ reflectToAttr: true })
    public trailingIcon: string;

    /**
     * This property determines the html-type of the field and with
     * that which keyboard to show on a mobile device.
     * Defaults to 'text'
     */
    @Prop({ reflectToAttr: true })
    public type = 'text';

    @State()
    private mdcTextField;

    @Element()
    private limelTextField: HTMLElement;

    /**
     * Emitted when the input value is changed.
     * The new value is available via the `detail` property on the event
     * object.
     */
    @Event()
    private change: EventEmitter;

    /**
     * This event is tied to the `trailingIcon` property, which doesn't work
     * at the moment. Don't use it.
     */
    @Event()
    private action: EventEmitter;

    public componentDidLoad() {
        this.mdcTextField = new MDCTextField(
            this.limelTextField.shadowRoot.querySelector('.mdc-text-field')
        );
    }

    public componentDidUnload() {
        if (this.mdcTextField) {
            this.mdcTextField.destroy();
        }
    }

    public render() {
        return (
            <label
                class={`
                    mdc-text-field
                    ${this.invalid ? 'mdc-text-field--invalid' : ''}
                    ${this.disabled ? 'mdc-text-field--disabled' : ''}
                    ${this.required ? 'mdc-text-field--required' : ''}
                    ${
                        this.trailingIcon
                            ? 'mdc-text-field--with-trailing-icon'
                            : ''
                    }
                `}
            >
                <input
                    class="mdc-text-field__input"
                    onInput={this.handleChange.bind(this)}
                    value={this.value}
                    required={this.required}
                    disabled={this.disabled}
                    type={this.type}
                />
                <span
                    class={`
                        mdc-floating-label
                        ${this.value ? 'mdc-floating-label--float-above' : ''}
                    `}
                >
                    {this.label}
                </span>
                {this.renderTrailingIcon()}
                <div class="mdc-line-ripple" />
            </label>
        );
    }

    private renderTrailingIcon() {
        if (!this.trailingIcon) {
            return;
        }

        return (
            <i
                onKeyPress={this.handleIconKeyPress.bind(this)}
                onClick={this.handleIconClick.bind(this)}
                class="mdc-text-field__icon"
                tabindex="0"
                role="button"
            >
                {this.trailingIcon}
            </i>
        );
    }

    private handleChange(event) {
        this.change.emit(event.target.value);
    }

    private handleIconClick() {
        this.action.emit();
    }

    private handleIconKeyPress(event) {
        const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
        const isSpace = event.key === SPACE || event.keyCode === SPACE_KEY_CODE;

        if (isSpace || isEnter) {
            this.action.emit();
        }
    }
}
