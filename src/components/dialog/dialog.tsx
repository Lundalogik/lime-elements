import { MDCDialog } from '@lime-material/dialog';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    Watch,
} from '@stencil/core';

@Component({
    tag: 'limel-dialog',
    shadow: true,
    styleUrl: 'dialog.scss',
})
export class Dialog {
    /**
     * `true` if the dialog is open, `false` otherwise.
     * Defaults to `false`.
     */
    @Prop({ mutable: true, reflectToAttr: true })
    public open = false;

    /**
     * Emitted when the dialog is closed from inside the component.
     * (*Not* emitted when the consumer sets the `open`-property to `false`.)
     */
    @Event()
    private close: EventEmitter;

    @Element()
    private host: HTMLElement;

    private mdcDialog: MDCDialog;

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

    public componentDidUnload() {
        this.mdcDialog.destroy();
    }

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
