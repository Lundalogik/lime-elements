import { MDCDialog, util } from '@lime-material/dialog';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    Watch,
} from '@stencil/core';
import * as focusTrap from 'focus-trap';
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
     * Set to `true` to make the dialog "fullscreen".
     */
    @Prop({ reflectToAttr: true })
    public fullscreen = false;

    /**
     * `true` if the dialog is open, `false` otherwise.
     * Defaults to `false`.
     */
    @Prop({ mutable: true, reflectToAttr: true })
    public open = false;

    /**
     * Defines which action triggers a close-event.
     */
    @Prop({ reflectToAttr: true })
    public closingActions: { escapeKey: boolean; scrimClick: boolean } = {
        escapeKey: true,
        scrimClick: true,
    };
    /**
     * Emitted when the dialog is closed from inside the component.
     * (*Not* emitted when the consumer sets the `open`-property to `false`.)
     */
    @Event()
    private close: EventEmitter<void>;

    /**
     * Emitted when the dialog is in the process of being closed.
     */
    @Event()
    private closing: EventEmitter<void>;

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

        const { activate, deactivate } = util.createFocusTrapInstance(
            this.host.shadowRoot.querySelector('.mdc-dialog__surface'),
            focusTrap.default,
            this.host.shadowRoot.querySelector('#initialFocusEl')
        );

        this.mdcDialog.foundation_.adapter_.trapFocus = () => {
            activate();
        };

        this.mdcDialog.foundation_.adapter_.releaseFocus = () => {
            deactivate();
        };

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

        this.mdcDialog.listen('MDCDialog:closing', () => {
            this.closing.emit();
        });

        this.mdcDialog.scrimClickAction = this.closingActions.scrimClick
            ? 'close'
            : '';
        this.mdcDialog.escapeKeyAction = this.closingActions.escapeKey
            ? 'close'
            : '';
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
                <input hidden={true} id="initialFocusEl" />
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
