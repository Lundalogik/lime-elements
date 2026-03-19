import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Host,
    Prop,
    State,
} from '@stencil/core';
import { createRandomString } from '../../util/random-string';
import {
    makeEnterClickable,
    removeEnterClickable,
} from '../../util/make-enter-clickable';
import { Label } from '../dynamic-label/label.types';
import { Icon } from '../../interface';

/**
 * The Switch component is a fundamental element in UI design that serves as a toggle switch
 * to control the state of a specific setting or option in an application or website.
 * The two distinct positions of the Switch are visually indicative of the two states:
 * ON and OFF; making it easy for users to understand the current state of the controlled feature.
 *
 * The Switch component is widely used in user interfaces to enable users to
 * quickly and intuitively change binary settings.
 *
 * :::important
 * Checkboxes are sometimes used interchangeably with switches in user interfaces.
 * But there is an important difference between the two! Please read our guidelines about
 * [Switch vs. Checkbox](#/DesignGuidelines/switch-vs-checkbox.md/).
 *
 * @exampleComponent limel-example-switch
 * @exampleComponent limel-example-switch-helper-text
 * @exampleComponent limel-example-switch-readonly
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
     * Set to `true` to indicate that the current value is invalid.
     */
    @Prop({ reflect: true })
    public invalid: boolean;

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
     * The labels to use to clarify what kind of data is being visualized,
     * when the component is `readonly`.
     */
    @Prop()
    public readonlyLabels?: Array<Label<boolean>> = [];

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

    public componentWillLoad() {
        makeEnterClickable(this.host);
    }

    public disconnectedCallback() {
        removeEnterClickable(this.host);
    }

    public render() {
        return (
            <Host>
                {this.readonly
                    ? this.renderReadonly()
                    : this.renderInteractive()}
                {this.renderHelperLine()}
            </Host>
        );
    }

    private renderReadonly = () => {
        const icon: string | Icon = this.value
            ? {
                  name: 'ok',
                  color: 'var(--lime-primary-color, var(--limel-theme-primary-color))',
              }
            : 'minus';

        return (
            <limel-dynamic-label
                value={this.value}
                aria-describedby={this.ariaDescribedBy}
                defaultLabel={{ text: this.label, icon: icon }}
                labels={this.readonlyLabels}
            />
        );
    };

    private renderInteractive = () => {
        return [
            <button
                id={this.fieldId}
                type="button"
                role="switch"
                aria-checked={String(this.value)}
                disabled={this.disabled}
                onClick={this.handleClick}
                aria-describedby={this.ariaDescribedBy}
            >
                <span class="handle" />
            </button>,
            <label htmlFor={this.fieldId}>{this.label}</label>,
        ];
    };

    private renderHelperLine = () => {
        if (!this.hasHelperText()) {
            return;
        }

        return (
            <limel-helper-line
                helperTextId={this.helperTextId}
                helperText={this.helperText}
                invalid={this.invalid}
            />
        );
    };

    private get ariaDescribedBy(): string | undefined {
        return this.helperText ? this.helperTextId : undefined;
    }

    private hasHelperText = () => {
        return this.helperText !== null && this.helperText !== undefined;
    };

    private handleClick = (event: MouseEvent) => {
        event.stopPropagation();
        this.change.emit(!this.value);
    };
}
