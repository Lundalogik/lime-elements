import { MDCSwitch } from '@material/switch';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Host,
    h,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import { createRandomString } from '../../util/random-string';
import {
    makeEnterClickable,
    removeEnterClickable,
} from 'src/util/make-enter-clickable';

/**
 * The Switch component is a fundamental element in UI design that serves as a toggle switch
 * to control the state of a specific setting or option in an application or website.
 * The two distinct positions of the Switch are visually indicative of the two states:
 * ON and OFF; making it easy for users to understand the current state of the controlled feature.
 *
 * The Switch component is widely used in user interfaces to enable users to
 * quickly and intuitively change binary settings.
 *
 * <limel-example-switch-vs-checkbox />
 * @exampleComponent limel-example-switch
 * @exampleComponent limel-example-switch-helper-text
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
     * Optional helper text to display below the switch
     */
    @Prop({ reflect: true })
    public helperText: string;

    /**
     * Emitted when the value has changed
     */
    @Event()
    private change: EventEmitter<boolean>;

    @Element()
    private host: HTMLLimelSwitchElement;
    private helperTextId: string = createRandomString();

    @State()
    private fieldId = createRandomString();

    private mdcSwitch: MDCSwitch;

    public connectedCallback() {
        this.initialize();
    }

    public componentWillLoad() {
        makeEnterClickable(this.host);
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
        removeEnterClickable(this.host);
        this.mdcSwitch?.destroy();
    }

    public render() {
        return (
            <Host>
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
                    aria-controls={this.helperTextId}
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
                </button>
                <label
                    class={`${
                        this.disabled || this.readonly ? 'disabled' : ''
                    }`}
                    htmlFor={this.fieldId}
                >
                    {this.label}
                </label>
                {this.renderHelperLine()}
            </Host>
        );
    }

    @Watch('value')
    protected valueWatcher(newValue: boolean) {
        if (!this.mdcSwitch) {
            return;
        }

        this.mdcSwitch.selected = newValue;
    }

    private renderHelperLine = () => {
        if (!this.hasHelperText()) {
            return;
        }

        return (
            <limel-helper-line
                helperTextId={this.helperTextId}
                helperText={this.helperText}
            />
        );
    };

    private hasHelperText = () => {
        return this.helperText !== null && this.helperText !== undefined;
    };

    private handleClick = (event: MouseEvent) => {
        event.stopPropagation();
        this.change.emit(!this.value);
    };
}
