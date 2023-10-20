import { DialogHeading, ClosingActions } from '../../interface';
import { MDCDialog } from '@material/dialog';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
    Watch,
} from '@stencil/core';
import { isEqual } from 'lodash-es';
import { dispatchResizeEvent } from '../../util/dispatch-resize-event';
import { createRandomString } from '../../util/random-string';

/**
 * :::note
 * Regarding the `close` event: When putting other elements that emit `close`
 * events inside a dialog, those events must be caught and stopped inside the
 * dialog. If not, they will bubble to the event handler listening for `close`
 * events on the dialog, which will close the dialog too.
 *
 * See the example _Nested `close` events_.
 * :::
 *
 * :::important
 * Are you developing for
 * [Lime CRM](https://www.lime-technologies.com/en/lime-crm/)? Please note that
 * you should use the [DialogService](https://lundalogik.github.io/lime-web-components/versions/latest/#/api/dialog-service)
 * from Lime Web Components to open dialogs in Lime CRM.
 * :::
 * @exampleComponent limel-example-dialog
 * @exampleComponent limel-example-dialog-nested-close-events
 * @exampleComponent limel-example-dialog-heading
 * @exampleComponent limel-example-dialog-heading-actions
 * @exampleComponent limel-example-dialog-form
 * @exampleComponent limel-example-dialog-size
 * @exampleComponent limel-example-dialog-fullscreen
 * @exampleComponent limel-example-dialog-closing-actions
 * @exampleComponent limel-example-dialog-action-buttons
 * @slot - Content to put inside the dialog
 * @slot header-actions - The dialog header buttons
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
    public closingActions: ClosingActions = {
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
        this.showFooter = !!this.host.querySelector('[slot="button"]');
    }

    public componentDidLoad() {
        this.initialize();
    }

    private initialize() {
        const element = this.host.shadowRoot.querySelector('.mdc-dialog');
        if (!element) {
            return;
        }

        this.mdcDialog = new MDCDialog(element);
        if (this.open) {
            this.mdcDialog.open();
        }

        this.mdcDialog.listen('MDCDialog:opened', this.handleMdcOpened);
        this.mdcDialog.listen('MDCDialog:closed', this.handleMdcClosed);
        this.mdcDialog.listen('MDCDialog:closing', this.handleMdcClosing);

        this.setClosingActions();
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
                        {/*
                            The `initialFocusElement` below is needed to make
                            focus trapping work. At the time of writing, the
                            focusable elements inside the slots are not
                            detected, so we supply our own hidden element for
                            the focus trap to use. Read more here:
                            https://github.com/material-components/material-components-web/tree/v11.0.0/packages/mdc-dialog#handling-focus-trapping
                        */}
                        <input type="text" id="initialFocusElement" />
                        {this.renderHeading()}
                        <div
                            class="mdc-dialog__content"
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

    @Watch('closingActions')
    protected closingActionsChanged(
        newValue: ClosingActions,
        oldValue: ClosingActions
    ) {
        if (isEqual(newValue, oldValue)) {
            return;
        }

        this.setClosingActions();
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
            const { title, subtitle, supportingText, icon } = this.heading;

            return (
                <limel-header
                    icon={icon}
                    heading={title}
                    subheading={subtitle}
                    supportingText={supportingText}
                >
                    <slot name="header-actions" slot="actions" />
                </limel-header>
            );
        } else if (typeof this.heading === 'string') {
            return <limel-header heading={this.heading}></limel-header>;
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

    private setClosingActions() {
        this.mdcDialog.scrimClickAction = '';
        if (this.closingActions.scrimClick) {
            this.mdcDialog.scrimClickAction = 'close';
        }

        this.mdcDialog.escapeKeyAction = '';
        if (this.closingActions.escapeKey) {
            this.mdcDialog.escapeKeyAction = 'close';
        }
    }
}
