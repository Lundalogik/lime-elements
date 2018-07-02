import { MDCSelect } from '@material/select'; // tslint:disable-line:no-implicit-dependencies
import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core'; // tslint:disable-line:no-implicit-dependencies
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

    @Event() public change: EventEmitter;

    @Element() public limelSelect: HTMLElement;

    private mdcSelect;

    public onChange = event => {
        this.change.emit(event);
    };

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
}
