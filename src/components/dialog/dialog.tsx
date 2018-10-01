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

    private id: string;

    public componentWillLoad() {
        this.id = Math.random().toString(36).substr(2);
    }

    public componentDidLoad() {
        this.mdcDialog = new MDCDialog(
            this.host.shadowRoot.querySelector('.mdc-dialog')
        );
        if (this.open) {
            this.mdcDialog.open();
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
            <div
                class="mdc-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={'limel-dialog-title-' + this.id}
                aria-describedby={'limel-dialog-content-' + this.id}
            >
                <div class="mdc-dialog__container">
                    <div class="mdc-dialog__surface">
                        <header class="mdc-dialog__title" id={'limel-dialog-title-' + this.id}>
                            <slot name="header" />
                        </header>
                        <div class="mdc-dialog__content" id={'limel-dialog-content-' + this.id}>
                            <slot />
                        </div>
                        <footer class="mdc-dialog__actions">
                            <slot name="button" />
                        </footer>
                    </div>
                </div>
                <div class="mdc-dialog__scrim"></div>
            </div>
        );
    }

    @Watch('open')
    protected watchHandler(newValue: boolean, oldValue: boolean) {
        if (oldValue === newValue) {
            return;
        }

        if (newValue) {
            this.mdcDialog.open();
        } else {
            this.mdcDialog.close();
        }
    }
}
