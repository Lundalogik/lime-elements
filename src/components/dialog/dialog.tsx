import { DialogHeading } from '@limetech/lime-elements';
import { MDCDialog, util } from '@limetech/mdc-dialog';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
    Watch,
} from '@stencil/core';
import * as focusTrap from 'focus-trap';
import { dispatchResizeEvent } from '../../util/dispatch-resize-event';
import { createRandomString } from '../../util/random-string';

/**
 * @exampleComponent limel-example-dialog
 * @exampleComponent limel-example-dialog-heading
 * @exampleComponent limel-example-dialog-form
 * @exampleComponent limel-example-dialog-size
 * @exampleComponent limel-example-dialog-fullscreen
 * @exampleComponent limel-example-dialog-closing-actions
 *
 * @slot - Content to put inside the dialog
 * @slot button - The dialog buttons
 */
@Component({
    tag: 'limel-dialog',
    shadow: true,
    styleUrl: 'dialog.scss',
})
export class Dialog {
    /**
     * The heading for the dialog, if any.
     */
    @Prop()
    public heading: string | DialogHeading;

    /**
     * Set to `true` to make the dialog "fullscreen".
     */
    @Prop({ reflect: true })
    public fullscreen = false;

    /**
     * `true` if the dialog is open, `false` otherwise.
     */
    @Prop({ mutable: true, reflect: true })
    public open = false;

    /**
     * Defines which action triggers a close-event.
     */
    @Prop({ reflect: true })
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
    private host: HTMLLimelDialogElement;

    private mdcDialog: MDCDialog;

    private id: string;

    private showFooter = true;

    constructor() {
        this.handleMdcOpened = this.handleMdcOpened.bind(this);
        this.handleMdcClosed = this.handleMdcClosed.bind(this);
        this.handleMdcClosing = this.handleMdcClosing.bind(this);
    }

    public connectedCallback() {
        this.initialize();
    }

    public componentWillLoad() {
        this.id = createRandomString();
    }

    public componentDidLoad() {
        this.initialize();
    }

    private initialize() {
        const element = this.host.shadowRoot.querySelector('.mdc-dialog');
        if (!element) {
            return;
        }

        this.showFooter = !!this.host.querySelector('[slot="button"]');

        this.mdcDialog = new MDCDialog(element);
        if (this.open) {
            this.mdcDialog.open();
        }

        const { activate, deactivate } = util.createFocusTrapInstance(
            this.host.shadowRoot.querySelector('.mdc-dialog__surface'),
            focusTrap.default,
            this.host.shadowRoot.querySelector('#initialFocusEl') as any
        );

        // eslint-disable-next-line no-underscore-dangle
        (this.mdcDialog as any).foundation_.adapter_.trapFocus = () => {
            activate();
        };

        // eslint-disable-next-line no-underscore-dangle
        (this.mdcDialog as any).foundation_.adapter_.releaseFocus = () => {
            deactivate();
        };

        this.mdcDialog.listen('MDCDialog:opened', this.handleMdcOpened);
        this.mdcDialog.listen('MDCDialog:closed', this.handleMdcClosed);
        this.mdcDialog.listen('MDCDialog:closing', this.handleMdcClosing);

        this.mdcDialog.scrimClickAction = '';
        if (this.closingActions.scrimClick) {
            this.mdcDialog.scrimClickAction = 'close';
        }

        this.mdcDialog.escapeKeyAction = '';
        if (this.closingActions.escapeKey) {
            this.mdcDialog.escapeKeyAction = 'close';
        }
    }

    public disconnectedCallback() {
        this.mdcDialog.unlisten('MDCDialog:opened', this.handleMdcOpened);
        this.mdcDialog.unlisten('MDCDialog:closed', this.handleMdcClosed);
        this.mdcDialog.unlisten('MDCDialog:closing', this.handleMdcClosing);
        this.mdcDialog.destroy();
    }

    public render() {
        return (
            <div
                class={{
                    'mdc-dialog': true,
                    'full-screen': !!this.fullscreen,
                }}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={'limel-dialog-title-' + this.id}
                aria-describedby={'limel-dialog-content-' + this.id}
            >
                <input hidden={true} id="initialFocusEl" />
                <div class="mdc-dialog__container">
                    <div class="mdc-dialog__surface">
                        {this.renderHeading()}
                        <div
                            class="mdc-dialog__content scrollbox"
                            id={'limel-dialog-content-' + this.id}
                        >
                            <slot />
                        </div>
                        {this.renderFooter()}
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

        if (!this.mdcDialog) {
            return;
        }

        if (newValue) {
            this.mdcDialog.open();
        } else {
            this.mdcDialog.close();
        }
    }

    private handleMdcOpened() {
        // When the opening-animation has completed, dispatch a
        // resize-event so that any content that depends on
        // javascript for layout has a chance to update to the
        // final layout of the dialog. /Ads
        const waitForUiToRender = 100;
        setTimeout(dispatchResizeEvent, waitForUiToRender);
    }

    private handleMdcClosed() {
        if (this.open) {
            this.close.emit();
        }

        this.open = false;
    }

    private handleMdcClosing() {
        this.closing.emit();
    }

    private isBadgeHeading(
        heading: string | DialogHeading
    ): heading is DialogHeading {
        return typeof heading === 'object' && !!heading.title && !!heading.icon;
    }

    private renderHeading() {
        if (this.isBadgeHeading(this.heading)) {
            const {
                title,
                subtitle,
                supportingText,
                icon,
                badgeIcon,
            } = this.heading;

            return (
                <div class="dialog__heading">
                    <limel-icon
                        size="large"
                        name={icon}
                        badge={badgeIcon !== false}
                    />
                    <div>
                        {
                            <h2 class="mdc-typography--headline2 dialog__title">
                                {title}
                            </h2>
                        }
                        {subtitle ? (
                            <h3 class="mdc-typography--subtitle1 dialog__subtitle">
                                {subtitle}
                            </h3>
                        ) : null}
                        {supportingText ? (
                            <h3 class="mdc-typography--subtitle1 dialog__supporting-text">
                                {supportingText}
                            </h3>
                        ) : null}
                    </div>
                </div>
            );
        } else if (typeof this.heading === 'string') {
            return <h2 class="mdc-dialog__title">{this.heading.trim()}</h2>;
        }

        return null;
    }

    private renderFooter() {
        if (this.showFooter) {
            return (
                <footer class="mdc-dialog__actions">
                    <slot name="button" />
                </footer>
            );
        }
    }
}
