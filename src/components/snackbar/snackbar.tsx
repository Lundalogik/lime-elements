import { Languages } from '@limetech/lime-elements';
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
 * @exampleComponent limel-example-snackbar
 * @exampleComponent limel-example-snackbar-with-action
 * @exampleComponent limel-example-snackbar-with-changing-messages
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
    public timeout: number;

    /**
     * The text to display for the action button.
     */
    @Prop()
    public actionText: string;

    /**
     * True if the snackbar is dismissible, false otherwise
     */
    @Prop()
    public dismissible: boolean;

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
            <limel-icon-button
                class="mdc-icon-button mdc-snackbar__dismiss"
                icon="multiply"
                label={label}
            />
        );
    }
}
