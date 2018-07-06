import { MDCSelect } from '@material/select';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    State,
} from '@stencil/core';
import { IOption } from './option';

@Component({
    shadow: true,
    styleUrl: 'select.scss',
    tag: 'limel-select',
})
export class Select {
    @Prop() public disabled = false;
    @Prop() public label: string;
    @Prop() public value: string;
    @Prop() public options: IOption[] = [];

    @Event() private change: EventEmitter;

    @Element() private limelSelect: HTMLElement;

    @State() private mdcSelect;

    public componentDidLoad() {
        const element = this.limelSelect.shadowRoot.querySelector(
            '.mdc-select'
        );
        this.mdcSelect = new MDCSelect(element);
    }

    public componentDidUnload() {
        this.mdcSelect.destroy();
    }

    public render() {
        return (
            <label
                class={`mdc-select ${
                    this.disabled ? 'mdc-select--disabled' : ''
                }`}
            >
                <select
                    onChange={this.onChange}
                    class="mdc-select__native-control"
                    disabled={this.disabled}
                >
                    {this.options.map(option => {
                        return (
                            <option
                                key={option.value}
                                value={option.value}
                                selected={option.value === this.value}
                                disabled={option.disabled}
                            >
                                {option.text}
                            </option>
                        );
                    })}
                </select>
                <span
                    class={`mdc-floating-label ${
                        this.value ? 'mdc-floating-label--float-above' : ''
                    }`}
                >
                    {this.label}
                </span>
                <div class="mdc-line-ripple" />
            </label>
        );
    }

    private onChange = () => {
        this.change.emit(this.mdcSelect.value);
    };
}
