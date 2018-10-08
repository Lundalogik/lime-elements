import { MDCSelect } from '@lime-material/select';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import { Option } from '../../interface';

@Component({
    tag: 'limel-select',
    shadow: true,
    styleUrl: 'select.scss',
})
export class Select {
    @Prop({ reflectToAttr: true })
    public disabled = false;

    @Prop({ reflectToAttr: true })
    public label: string;

    @Prop()
    public value: Option;

    @Prop()
    public options: Option[] = [];

    @Event()
    private change: EventEmitter;

    @Element()
    private limelSelect: HTMLElement;

    @State()
    private mdcSelect;

    public componentDidLoad() {
        const element = this.limelSelect.shadowRoot.querySelector(
            '.mdc-select'
        );
        this.mdcSelect = new MDCSelect(element);
        this.onChange();
    }

    public componentDidUnload() {
        this.mdcSelect.destroy();
    }

    public render() {
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
                    {this.options.map(option => {
                        return (
                            <option
                                key={option.value}
                                value={option.value}
                                selected={
                                    this.value
                                        ? option.value === this.value.value
                                        : option.value === ''
                                }
                                disabled={option.disabled}
                            >
                                {option.text}
                            </option>
                        );
                    })}
                </select>
                <span
                    class={`
                        mdc-floating-label
                        ${this.value ? 'mdc-floating-label--float-above' : ''}
                    `}
                >
                    {this.label}
                </span>
                <div class="mdc-line-ripple" />
            </label>
        );
    }

    @Watch('options')
    protected optionsWatcher(newOptions) {
        if (newOptions && newOptions.length) {
            setTimeout(() => {
                this.mdcSelect.selectedIndex = 0;
                this.onChange();
            }, 0);
        } else {
            this.mdcSelect.value = null;
            this.mdcSelect.selectedIndex = -1;
            this.onChange();
        }
    }

    private onChange = () => {
        const mdcValue = this.mdcSelect.value;
        let value: Option;
        if (mdcValue === '') {
            value = null;
        } else {
            value = this.options.find(option => {
                return mdcValue === option.value;
            });
        }
        this.change.emit(value);
    };
}
