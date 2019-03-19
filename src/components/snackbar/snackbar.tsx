import { MDCSnackbar } from '@lime-material/snackbar';
import {
    Component,
    Element,
    Event,
    EventEmitter,
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

    public componentDidLoad() {
        this.mdcSnackbar = new MDCSnackbar(
            this.host.shadowRoot.querySelector('.mdc-snackbar')
        );

        this.mdcSnackbar.listen('MDCSnackbar:closing', event => {
            if (event.detail.reason === 'action') {
                this.action.emit();
            } else {
                this.hide.emit();
            }
        });
    }

    public componentDidUnload() {
        this.mdcSnackbar.destroy();
    }

    /**
     * Show the snackbar
     *
     * @returns {void}
     */
    @Method()
    public show() {
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
                    {this.renderAction(this.actionText)}
                </div>
            </div>
        );
    }

    private renderAction(actionText) {
        if (actionText) {
            return (
                <div class="mdc-snackbar__actions">
                    <button
                        type="button"
                        class="mdc-button mdc-snackbar__action"
                    >
                        <span class="mdc-button__label">{actionText}</span>
                    </button>
                </div>
            );
        }
    }
}
