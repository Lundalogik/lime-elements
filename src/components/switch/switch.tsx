import { MDCSwitch } from '@lime-material/switch';
import {
    Component,
    Element,
    Event,
    EventEmitter,
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

    @Watch('value')
    protected valueWatcher(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.mdcSwitch.checked = newValue;
        }
    }

    private onChange = event => {
        this.change.emit(event.target.checked);
    };
}
