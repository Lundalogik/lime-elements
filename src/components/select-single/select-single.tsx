import { MDCSelect } from '@lime-material-16px/select';
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
    tag: 'limel-select-single',
    shadow: true,
    styleUrl: 'select-single.scss',
})
export class SelectSingle {
    /**
     * Set to `true` to disable the input.
     */
    @Prop({ reflectToAttr: true })
    public disabled = false;

    /**
     * The input label.
     */
    @Prop({ reflectToAttr: true })
    public label: string;

    /**
     * The currently selected item.
     */
    @Prop()
    public value: Option;

    @Prop()
    public options: Option[] = [];

    @Event()
    private change: EventEmitter<Option>;

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
            <div
                class={`
                    mdc-select
                    ${this.disabled ? 'mdc-select--disabled' : ''}
                `}
            >
                <i class="mdc-select__dropdown-icon" />
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
                <label
                    class={`
                        mdc-floating-label
                        ${this.value ? 'mdc-floating-label--float-above' : ''}
                    `}
                >
                    {this.label}
                </label>
                <div class="mdc-line-ripple" />
            </div>
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

    private onChange = (event?) => {
        if (event) {
            event.stopPropagation();
        }

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
