import { MDCSwitch } from '@lime-material/switch';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    State,
} from '@stencil/core';

@Component({
    tag: 'limel-switch',
    styleUrl: 'switch.scss',
    shadow: true,
})
export class Switch {
    @Prop({ reflectToAttr: true })
    public label: string;
    @Prop({ reflectToAttr: true })
    public disabled = false;
    @Prop({ reflectToAttr: true })
    public value = false;

    @Event()
    private change: EventEmitter;

    @Element()
    private host: HTMLElement;

    @State()
    private fieldId = createRandomString();

    @State()
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

    private onChange = event => {
        this.change.emit(event.target.checked);
    };
}

function createRandomString() {
    const USE_HEX;
    const SKIP_LEADING_ZERODOT = 2;
    return (
        Math.random()
            .toString(USE_HEX)
            .substring(SKIP_LEADING_ZERODOT) +
        Math.random()
            .toString(USE_HEX)
            .substring(SKIP_LEADING_ZERODOT)
    );
}
