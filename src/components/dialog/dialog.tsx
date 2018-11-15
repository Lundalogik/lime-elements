import { MDCDialog } from '@lime-material/dialog';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    Watch,
} from '@stencil/core';
import { dispatchResizeEvent } from '../../util/dispatch-resize-event';
import { createRandomString } from '../../util/random-string';

@Component({
    tag: 'limel-dialog',
    shadow: true,
    styleUrl: 'dialog.scss',
})
export class Dialog {
    /**
     * The heading for the dialog, if any.
     */
    @Prop({ reflectToAttr: true })
    public heading: string;

    /**
     * `true` if the dialog should be full-screen, `false` otherwise.
     */
    @Prop({ reflectToAttr: true })
    public fullscreen: boolean;

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
        this.id = createRandomString();
    }

    public componentDidLoad() {
        this.mdcDialog = new MDCDialog(
            this.host.shadowRoot.querySelector('.mdc-dialog')
        );
        if (this.open) {
            this.mdcDialog.open();
        }

        this.mdcDialog.listen('MDCDialog:opened', () => {
            // When the opening-animation has completed, dispatch a
            // resize-event so that any content that depends on
            // javascript for layout has a chance to update to the
            // final layout of the dialog. /Ads
            dispatchResizeEvent();
        });

        this.mdcDialog.listen('MDCDialog:closed', () => {
            if (this.open) {
                this.close.emit();
            }

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
                <div
                    class={`mdc-dialog__container ${
                        this.fullscreen ? 'full-screen' : ''
                    }`}
                >
                    <div class="mdc-dialog__surface">
                        {this.renderHeading()}
                        <div
                            class="mdc-dialog__content"
                            id={'limel-dialog-content-' + this.id}
                        >
                            <slot />
                        </div>
                        <footer class="mdc-dialog__actions">
                            <slot name="button" />
                        </footer>
                    </div>
                </div>
                <div class="mdc-dialog__scrim" />
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

    private renderHeading() {
        if (this.heading) {
            return <h2 class="mdc-dialog__title">{this.heading.trim()}</h2>;
        }
        return null;
    }
}
