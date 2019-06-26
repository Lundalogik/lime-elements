import { MDCSnackbar, MDCSnackbarCloseEvent } from '@limetech/mdc-snackbar';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Method,
    Prop,
} from '@stencil/core';

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

    @Element()
    private host: HTMLElement;

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

    public componentDidLoad() {
        this.mdcSnackbar = new MDCSnackbar(
            this.host.shadowRoot.querySelector('.mdc-snackbar')
        );

        this.mdcSnackbar.listen('MDCSnackbar:closing', this.handleMdcClosing);
    }

    public componentDidUnload() {
        this.mdcSnackbar.unlisten('MDCSnackbar:closing', this.handleMdcClosing);
        this.mdcSnackbar.destroy();
    }

    // tslint:disable-next-line:valid-jsdoc
    /**
     * Show the snackbar
     */
    @Method()
    public async show() {
        if (this.timeout) {
            this.mdcSnackbar.timeoutMs = this.timeout;
        }

        this.mdcSnackbar.open();
    }

    public render() {
        return (
            <div
                class={`
                    mdc-snackbar
                    ${this.multiline ? 'mdc-snackbar--stacked' : ''}
                `}
            >
                <div class="mdc-snackbar__surface">
                    <div
                        class="mdc-snackbar__label"
                        role="status"
                        aria-live="polite"
                    >
                        {this.message}
                    </div>
                    {this.renderActions(this.actionText, this.dismissible)}
                </div>
            </div>
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
            <div class="mdc-snackbar__actions">
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
            <button type="button" class="mdc-button mdc-snackbar__action">
                <span class="mdc-button__label">{actionText}</span>
            </button>
        );
    }

    private renderDismissButton(dismissible: boolean) {
        if (!dismissible) {
            return;
        }

        return (
            <limel-icon-button class="mdc-snackbar__dismiss" icon="multiply" />
        );
    }
}
