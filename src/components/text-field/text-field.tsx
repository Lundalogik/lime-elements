import { MDCTextField } from '@lime-material/textfield';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    State,
} from '@stencil/core';
import { ENTER, SPACE } from '../../util/keycodes';

@Component({
    tag: 'limel-text-field',
    styleUrl: 'text-field.scss',
    shadow: true,
})
export class TextField {
    @Prop({ reflectToAttr: true })
    public disabled = false;

    @Prop({ reflectToAttr: true })
    public invalid = false;

    @Prop({ reflectToAttr: true })
    public label: string;

    @Prop({ reflectToAttr: true })
    public required = false;

    @Prop()
    public value: string;

    @Prop()
    public trailingIcon: string;

    @State()
    private mdcTextField;

    @State()
    private internalValue: string;

    @Element()
    private limelTextField: HTMLElement;

    @Event()
    private change: EventEmitter;

    @Event()
    private action: EventEmitter;

    public componentDidLoad() {
        this.internalValue = this.value;
        this.mdcTextField = new MDCTextField(
            this.limelTextField.shadowRoot.querySelector('.mdc-text-field')
        );
    }

    public componentDidUnload() {
        if (this.mdcTextField) {
            this.mdcTextField.destroy();
        }
    }

    public componentDidUpdate() {
        if (this.value !== this.internalValue) {
            this.internalValue = this.value;
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
                    id="limel-input"
                    onInput={this.handleChange.bind(this)}
                    value={this.internalValue}
                    required={this.required}
                    disabled={this.disabled}
                />
                <span
                    class={`
                        mdc-floating-label
                        ${
                            this.internalValue
                                ? 'mdc-floating-label--float-above'
                                : ''
                        }
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
        this.internalValue = event.target.value;
        this.change.emit(this.internalValue);
    }

    private handleIconClick() {
        this.action.emit();
    }

    private handleIconKeyPress(event) {
        const isEnter = event.key === 'Enter' || event.keyCode === ENTER;
        const isSpace = event.key === 'Space' || event.keyCode === SPACE;

        if (isSpace || isEnter) {
            this.action.emit();
        }
    }
}
