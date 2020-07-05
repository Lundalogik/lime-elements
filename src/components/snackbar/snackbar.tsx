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

/**
 * @exampleComponent limel-example-snackbar
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

    public componentDidLoad() {
        this.mdcSnackbar = new MDCSnackbar(
            this.host.shadowRoot.querySelector('.mdc-snackbar')
        );

        this.mdcSnackbar.listen('MDCSnackbar:closing', this.handleMdcClosing);
    }

    // eslint-disable-next-line @stencil/own-methods-must-be-private
    public componentDidUnload() {
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

        const svgData = `<svg width="32" height="32" x="0px" y="0px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
    <line fill="none" id="svg_1" stroke="currentColor" stroke-width="2" x1="8" x2="24" y1="8" y2="24"/>
    <line fill="none" id="svg_2" stroke="currentColor" stroke-width="2" x1="24" x2="8" y1="8" y2="24"/>
</svg>`;

        return (
            <div class="mdc-snackbar__dismiss">
                <button class="mdc-icon-button" innerHTML={svgData} />
            </div>
        );
    }
}
