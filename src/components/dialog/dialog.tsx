import { MDCDialog } from '@lime-material/dialog';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    State,
    Watch,
} from '@stencil/core';

@Component({
    tag: 'limel-dialog',
    styleUrl: 'dialog.scss',
    shadow: true,
})
export class Dialog {
    /**
     * True if the dialog should be open, false otherwise
     */
    @Prop({ mutable: true, reflectToAttr: true })
    public open = false;

    /**
     * Fired when the dialog is being implicitly closed
     */
    @Event()
    private close: EventEmitter;

    @Element()
    private host: HTMLElement;

    @State()
    private mdcDialog: MDCDialog;

    /**
     * @param {boolean} newValue new open value
     * @param {boolean} oldValue previous open value
     *
     * @returns {void}
     */
    @Watch('open')
    public watchHandler(newValue: boolean, oldValue: boolean) {
        if (oldValue === newValue) {
            return;
        }

        if (newValue) {
            this.mdcDialog.show();
        } else {
            this.mdcDialog.close();
        }
    }

    /**
     * @returns {void}
     */
    public componentDidLoad() {
        this.mdcDialog = new MDCDialog(
            this.host.shadowRoot.querySelector('.mdc-dialog')
        );
        if (this.open) {
            this.mdcDialog.show();
        }

        this.mdcDialog.listen('MDCDialog:cancel', () => {
            this.close.emit();
            this.open = false;
        });
    }

    /**
     * @returns {void}
     */
    public componentDidUnload() {
        this.mdcDialog.destroy();
    }

    /**
     * Renders the dialog
     *
     * @returns {HTMLElement} the dialog
     */
    public render() {
        return (
            <aside
                id="limel-dialog"
                class="mdc-dialog"
                role="alertdialog"
                aria-labelledby="limel-dialog-label"
                aria-describedby="limel-dialog-description"
            >
                <div class="mdc-dialog__surface">
                    <header class="mdc-dialog__header" id="limel-dialog-label">
                        <slot name="header" />
                    </header>
                    <section
                        id="limel-dialog-description"
                        class="mdc-dialog__body mdc-dialog__body--scrollable"
                    >
                        <slot />
                    </section>
                    <footer class="mdc-dialog__footer">
                        <slot name="button" />
                    </footer>
                </div>
                <div class="mdc-dialog__backdrop" />
            </aside>
        );
    }
}
