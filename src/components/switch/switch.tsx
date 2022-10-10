import { MDCSwitch } from '@material/switch';
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

/**
 * @exampleComponent limel-example-switch
 */
@Component({
    tag: 'limel-switch',
    shadow: true,
    styleUrl: 'switch.scss',
})
export class Switch {
    /**
     * Label to display next to the switch
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Disables the switch when `true`,
     * and visually shows that the switch is editable but disabled.
     * This tells the users that if certain requirements are met,
     * the switch may become interactable.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Disables the switch when `true`. This visualizes the switch slightly differently.
     * But shows no visual sign indicating that the switch is disabled
     * or can ever become interactable.
     */
    @Prop({ reflect: true })
    public readonly = false;

    /**
     * The value of the switch
     */
    @Prop({ reflect: true })
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

    public connectedCallback() {
        this.initialize();
    }

    public componentDidLoad() {
        this.initialize();
    }

    private initialize() {
        const element = this.host.shadowRoot.querySelector(
            '.mdc-switch'
        ) as HTMLButtonElement;
        if (!element) {
            return;
        }

        this.mdcSwitch = new MDCSwitch(element);
    }

    public disconnectedCallback() {
        this.mdcSwitch?.destroy();
    }

    public render() {
        return [
            <button
                id={this.fieldId}
                class={{
                    'mdc-switch': true,
                    'lime-switch--readonly': this.readonly,
                    'mdc-switch--unselected': !this.value,
                    'mdc-switch--selected': this.value,
                }}
                type="button"
                role="switch"
                aria-checked={this.value}
                disabled={this.disabled || this.readonly}
                onClick={this.handleClick}
            >
                <div class="mdc-switch__track" />
                <div class="mdc-switch__handle-track">
                    <div class="mdc-switch__handle">
                        <div class="mdc-switch__shadow">
                            <div class="mdc-elevation-overlay"></div>
                        </div>
                        <div class="mdc-switch__ripple"></div>
                        <div class="mdc-switch__icons">
                            <svg
                                class="mdc-switch__icon mdc-switch__icon--on"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
                            </svg>
                            <svg
                                class="mdc-switch__icon mdc-switch__icon--off"
                                viewBox="0 0 24 24"
                            >
                                <path d="M20 13H4v-2h16v2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </button>,
            <label
                class={`${this.disabled || this.readonly ? 'disabled' : ''}`}
                htmlFor={this.fieldId}
            >
                {this.label}
            </label>,
        ];
    }

    @Watch('value')
    protected valueWatcher(newValue: boolean) {
        if (!this.mdcSwitch) {
            return;
        }

        this.mdcSwitch.selected = newValue;
    }

    private handleClick = (event: MouseEvent) => {
        event.stopPropagation();
        this.change.emit(!this.value);
    };
}
