import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';
import { Option } from './option';
import { MDCSelect } from '@material/select';

@Component({
    tag: 'limel-select',
    styleUrl: 'select.scss',
    shadow: true
})
export class Select {

    @Prop() disabled = false;
    @Prop() label: string;
    @Prop() value: string;
    @Prop() options: Array<Option> = [];

    @Event() change: EventEmitter;

    @Element() limelSelect: HTMLElement;

    private mdcSelect;

    onChange = event => {
        this.change.emit(event);
    }

    componentDidLoad() {
        const element = this.limelSelect.shadowRoot.querySelector('.mdc-select');
        this.mdcSelect = new MDCSelect(element);
    }

    componentDidUnload() {
        this.mdcSelect.destroy();
    }

    render() {
        return (
            <label
                class={`
                    mdc-select
                    ${this.disabled ? 'mdc-select--disabled' : ''}
                `}
            >
                <select
                    onChange={this.onChange}
                    class="mdc-select__native-control"
                    disabled={this.disabled}
                >
                    {this.options.map((option) =>
                        <option value={option.value}
                                selected={option.value === this.value}
                                disabled={option.disabled}>
                            {option.text}
                        </option>
                    )}
                </select>
                <span
                    class={`
                        mdc-floating-label
                        ${this.value ? 'mdc-floating-label--float-above' : ''}
                    `}
                >{this.label}</span>
                <div class="mdc-line-ripple"></div>
            </label>
        )
    }
}
