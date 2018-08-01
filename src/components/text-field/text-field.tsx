import { MDCTextField } from '@material/textfield';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    State,
} from '@stencil/core';

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
    @Prop() public value: string;

    @State() private mdcTextField;
    @State() private internalValue: string;

    @Element() private limelTextField: HTMLElement;

    @Event() private change: EventEmitter;

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

    public render() {
        return (
            <label
                class={`
                    mdc-text-field
                    ${this.invalid ? 'mdc-text-field--invalid' : ''}
                    ${this.disabled ? 'mdc-text-field--disabled' : ''}
                    ${this.required ? 'mdc-text-field--required' : ''}
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
                <span class="mdc-floating-label mdc-floating-label--float-above">
                    {this.label}
                </span>
                <div class="mdc-line-ripple" />
            </label>
        );
    }

    private handleChange(event) {
        this.internalValue = event.target.value;
        this.change.emit(this.internalValue);
    }
}
