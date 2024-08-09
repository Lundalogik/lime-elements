import { DialogHeading, ClosingActions } from './dialog.types';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Listen,
    Prop,
    Watch,
} from '@stencil/core';
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
 * you should use the [DialogRenderer](https://lundalogik.github.io/lime-web-components/versions/latest/interfaces/DialogRenderer.html)
 * from Lime Web Components to open dialogs in Lime CRM.
 * :::
 *
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

    private id: string;

    private showFooter = true;

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
        if (!this.dialog) {
            return;
        }

        if (this.open) {
            this.dialog.showModal();
        }
    }

    @Listen('click')
    protected handleClick(event: MouseEvent) {
        if (!this.closingActions.scrimClick) {
            return;
        }

        const rect = this.dialog.getBoundingClientRect();
        const clickedInDialog =
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width;

        if (!clickedInDialog) {
            this.closeDialog();
        }
    }

    private handleCancel = (event: Event) => {
        if (!this.closingActions.escapeKey && event.cancelable) {
            event.preventDefault();

            return;
        }

        this.closeDialog();
    };

    private closeDialog() {
        if (!this.open) {
            return;
        }

        const event = this.closing.emit();
        if (event.defaultPrevented) {
            return;
        }

        this.close.emit();
        this.open = false;
    }

    public render() {
        return (
            <dialog
                class={{
                    fullscreen: !!this.fullscreen,
                }}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={'limel-dialog-title-' + this.id}
                aria-describedby={'limel-dialog-content-' + this.id}
                onCancel={this.handleCancel}
            >
                <div class="surface">
                    {this.renderHeading()}
                    <div class="content" id={'limel-dialog-content-' + this.id}>
                        <slot />
                    </div>
                    {this.renderFooter()}
                </div>
            </dialog>
        );
    }

    @Watch('open')
    protected watchHandler(newValue: boolean, oldValue: boolean) {
        if (oldValue === newValue) {
            return;
        }

        if (newValue) {
            this.dialog.showModal();
        } else {
            this.dialog.close();
        }
    }

    private isBadgeHeading(
        heading: string | DialogHeading,
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
            return <limel-header heading={this.heading} />;
        }

        return null;
    }

    private renderFooter() {
        if (this.showFooter) {
            return (
                <footer class="actions">
                    <slot name="button" />
                </footer>
            );
        }
    }

    private get dialog() {
        return this.host.shadowRoot.querySelector('dialog');
    }
}
