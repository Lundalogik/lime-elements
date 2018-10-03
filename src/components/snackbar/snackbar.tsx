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
    private action: EventEmitter;

    /**
     * Emitted when the snackbar hides itself
     */
    @Event()
    private hide: EventEmitter;

    private mdcSnackbar: MDCSnackbar;

    public componentDidLoad() {
        this.mdcSnackbar = new MDCSnackbar(
            this.host.shadowRoot.querySelector('.mdc-snackbar')
        );

        this.mdcSnackbar.listen('MDCSnackbar:hide', () => {
            this.hide.emit();
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
        const config: {
            message: string;
            multiline: boolean;
            actionOnBottom: boolean;
            actionText?: string;
            actionHandler?: () => void;
            timeout?: number;
        } = {
            message: this.message,
            multiline: !!this.multiline,
            actionOnBottom: true,
        };

        if (this.actionText) {
            config.actionText = this.actionText;
            config.actionHandler = () => {
                this.action.emit();
            };
        }

        if (this.timeout) {
            config.timeout = this.timeout;
        }

        this.mdcSnackbar.show(config);
    }

    public render() {
        return (
            <div
                class="mdc-snackbar"
                aria-live="assertive"
                aria-atomic="true"
                aria-hidden="true"
            >
                <div class="mdc-snackbar__text" />
                <div class="mdc-snackbar__action-wrapper">
                    <button type="button" class="mdc-snackbar__action-button" />
                </div>
            </div>
        );
    }
}
