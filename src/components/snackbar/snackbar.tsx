import { Languages } from '../../interface';
import { MDCSnackbar, MDCSnackbarCloseEvent } from '@material/snackbar';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Method,
    Prop,
} from '@stencil/core';
import translate from '../../global/translations';

/**
 * A Snackbar –also known as "Toast"– is used to inform the end user
 * about an action or a process in the system.
 * The information could vary from announcing that a process has just started,
 * is taking place now, has ended, or has been interrupted or canceled.
 *
 * The information that you provide using a snackbar should be:
 * - temporary
 * - contextual
 * - short
 * - and most importantly, ignorable.
 *
 * It means if the user misses the information, it shouldn't be a big deal.
 *
 * :::note
 * If the information you want to display has a higher importance or priority,
 * and you need to make sure that the user takes an action to dismiss it,
 * consider using the [Banner](/#/component/limel-banner/) component instead.
 * For more complex interactions and for delivering more detailed information,
 * [Dialog](/#/component/limel-dialog/) is a better choice.
 * :::
 * @exampleComponent limel-example-snackbar
 * @exampleComponent limel-example-snackbar-dismissible
 * @exampleComponent limel-example-snackbar-with-action
 * @exampleComponent limel-example-snackbar-with-changing-messages
 * @exampleComponent limel-example-snackbar-positioning
 */

@Component({
    tag: 'limel-snackbar',
    shadow: true,
    styleUrl: 'snackbar.scss',
})
export class Snackbar {
    /**
     * The text message to display.
     */
    @Prop()
    public message: string;

    /**
     * The amount of time in milliseconds to show the snackbar.
     */
    @Prop()
    // eslint-disable-next-line no-magic-numbers
    public timeout?: number = 5000;

    /**
     * The text to display for the action button.
     */
    @Prop()
    public actionText: string;

    /**
     * When `true` displays a dismiss button on the snackbar,
     * allowing users to close it.
     */
    @Prop()
    public dismissible: boolean = true;

    /**
     * Whether to show the snackbar with space for multiple lines of text
     */
    @Prop()
    public multiline: boolean;

    /**
     * Defines the language for translations.
     */
    @Prop()
    public language: Languages = 'en';

    @Element()
    private host: HTMLLimelSnackbarElement;

    /**
     * Emitted when the action button is pressed
     */
    @Event()
    private action: EventEmitter<void>;

    /**
     * Emitted when the snackbar hides itself
     */
    @Event()
    private hide: EventEmitter<void>;

    private mdcSnackbar: MDCSnackbar;

    constructor() {
        this.handleMdcClosing = this.handleMdcClosing.bind(this);
    }

    public connectedCallback() {
        this.initialize();
    }

    public componentDidLoad() {
        this.initialize();
    }

    private initialize() {
        const element = this.host.shadowRoot.querySelector('.mdc-snackbar');
        if (!element) {
            return;
        }

        this.mdcSnackbar = new MDCSnackbar(element);

        this.mdcSnackbar.listen('MDCSnackbar:closing', this.handleMdcClosing);
    }

    public disconnectedCallback() {
        this.mdcSnackbar.unlisten('MDCSnackbar:closing', this.handleMdcClosing);
        this.mdcSnackbar.destroy();
    }

    /**
     * Show the snackbar
     */
    @Method()
    public async show() {
        if (this.timeout) {
            this.mdcSnackbar.timeoutMs = this.timeout;
        }

        this.mdcSnackbar.labelText = this.message;

        this.mdcSnackbar.open();
    }

    public render() {
        return (
            <aside
                class={`
                    mdc-snackbar
                    ${this.multiline ? 'mdc-snackbar--stacked' : ''}
                `}
                style={{
                    '--snackbar-timeout': `${this.timeout}ms`,
                }}
            >
                <div
                    class="mdc-snackbar__surface"
                    role="status"
                    aria-relevant="additions"
                >
                    <div class="mdc-snackbar__label" aria-atomic="false"></div>
                    {this.renderActions(this.actionText, this.dismissible)}
                </div>
            </aside>
        );
    }

    private handleMdcClosing(event: MDCSnackbarCloseEvent) {
        if (event.detail.reason === 'action') {
            this.action.emit();
        } else {
            this.hide.emit();
        }
    }

    private renderActions(actionText: string, dismissible: boolean) {
        if (!actionText && !dismissible) {
            return;
        }

        return (
            <div class="mdc-snackbar__actions" aria-atomic="true">
                {this.renderActionButton(actionText)}
                {this.renderDismissButton(dismissible)}
            </div>
        );
    }

    private renderActionButton(actionText: string) {
        if (!actionText) {
            return;
        }

        return (
            <limel-button
                class="mdc-button mdc-snackbar__action"
                label={actionText}
            />
        );
    }

    private renderDismissButton(dismissible: boolean) {
        if (!dismissible) {
            return;
        }

        const label = translate.get('snackbar.dismiss', this.language);

        return (
            <div class="dismiss">
                {this.renderTimeoutVisualization()}
                <limel-icon-button
                    class="mdc-icon-button mdc-snackbar__dismiss"
                    icon="multiply"
                    label={label}
                />
            </div>
        );
    }

    private renderTimeoutVisualization() {
        return (
            <svg width="36" height="36" viewBox="0 0 36 36">
                <circle r="18" cx="18" cy="18" fill="var(--track-color)" />
                <path
                    class="track"
                    d="M 18,18 m -16,0 a 16,16 0 1,0 32,0 a 16,16 0 1,0 -32,0"
                    stroke="var(--fill-color)"
                />
            </svg>
        );
    }
}
