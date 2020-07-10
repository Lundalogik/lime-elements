import { MDCSwitch } from '@limetech/mdc-switch';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import { createRandomString } from '../../util/random-string';

@Component({
    tag: 'limel-switch',
    shadow: true,
    styleUrl: 'switch.scss',
})
export class Switch {
    /**
     * Label to display next to the switch
     */
    @Prop({ reflectToAttr: true })
    public label: string;

    /**
     * Set to `true` to disable the switch
     */
    @Prop({ reflectToAttr: true })
    public disabled = false;

    /**
     * The value of the switch
     */
    @Prop({ reflectToAttr: true })
    public value = false;

    /**
     * Emitted when the value has changed
     */
    @Event()
    private change: EventEmitter<boolean>;

    @Element()
    private host: HTMLLimelSwitchElement;

    @State()
    private fieldId = createRandomString();

    private mdcSwitch: MDCSwitch;

    /**
     * @returns {void}
     */
    public componentDidLoad() {
        this.mdcSwitch = new MDCSwitch(
            this.host.shadowRoot.querySelector('.mdc-switch')
        );
    }

    /**
     * @returns {void}
     */
    // eslint-disable-next-line @stencil/own-methods-must-be-private
    public componentDidUnload() {
        this.mdcSwitch.destroy();
    }

    public render() {
        return [
            <div
                class={`
                    mdc-switch
                    ${this.disabled ? 'mdc-switch--disabled' : ''}
                `}
            >
                <div class="mdc-switch__track" />
                <div class="mdc-switch__thumb-underlay">
                    <div class="mdc-switch__thumb">
                        <input
                            type="checkbox"
                            class="mdc-switch__native-control"
                            id={this.fieldId}
                            role="switch"
                            onChange={this.onChange}
                            disabled={this.disabled}
                            checked={this.value}
                        />
                    </div>
                </div>
            </div>,
            <label
                class={`${this.disabled ? 'disabled' : ''}`}
                htmlFor={this.fieldId}
            >
                <span class="label">{this.label}</span>
            </label>,
        ];
    }

    @Watch('value')
    protected valueWatcher(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.mdcSwitch.checked = newValue;
        }
    }

    private onChange = (event) => {
        event.stopPropagation();
        this.change.emit(event.target.checked);
    };
}
