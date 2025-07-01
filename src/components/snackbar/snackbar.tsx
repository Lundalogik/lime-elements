import { Languages } from '../date-picker/date.types';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Listen,
    Method,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import translate from '../../global/translations';
import { SnackbarContainer } from './container';
import { createRandomString } from '../../util/random-string';

const container = new SnackbarContainer();
const hideAnimationDuration = 300;

/**
 * A Snackbar –also known as "Toast"– is used to inform the end user
 * about an action or a process in the system.
 * The information could vary from announcing that a process has just started,
 * is taking place now, has ended, or has been interrupted or canceled.
 *
 * The information that you provide using a snackbar should be:
 * - temporary
 * - contextual
 * - short
 * - and most importantly, ignorable.
 *
 * It means if the user misses the information, it shouldn't be a big deal.
 *
 * :::note
 * If the information you want to display has a higher importance or priority,
 * and you need to make sure that the user takes an action to dismiss it,
 * consider using the [Banner](/#/component/limel-banner/) component instead.
 * For more complex interactions and for delivering more detailed information,
 * [Dialog](/#/component/limel-dialog/) is a better choice.
 * :::
 *
 * @exampleComponent limel-example-snackbar
 * @exampleComponent limel-example-snackbar-with-action
 * @exampleComponent limel-example-snackbar-with-changing-messages
 * @exampleComponent limel-example-snackbar-dismissible
 * @exampleComponent limel-example-snackbar-persistent
 * @exampleComponent limel-example-snackbar-persistent-non-dismissible
 */
@Component({
    tag: 'limel-snackbar',
    shadow: true,
    styleUrl: 'snackbar.scss',
})
export class Snackbar {
    /**
     * `true` if the snackbar is open, `false` otherwise.
     */
    @Prop({ reflect: true })
    public open: boolean = false;

    /**
     * The text message to display.
     */
    @Prop()
    public message: string;

    /**
     * The amount of time in milliseconds to show the snackbar.
     * If set to `-1`, the snackbar will be persistent.
     * This means:
     * - either the end user will need to close it manually,
     * which requires the `dismissible` property to be set to `true`.
     * - or the snackbar needs to be closed programmatically.
     */
    @Prop({ reflect: true })
    public timeout?: number = 5000;

    /**
     * The text to display for the action button.
     */
    @Prop()
    public actionText: string;

    /**
     * When `true` displays a dismiss button on the snackbar,
     * allowing users to close it.
     */
    @Prop()
    public dismissible: boolean = true;

    /**
     * Whether to show the snackbar with space for multiple lines of text
     * @deprecated Setting this property no longer has any effect. The property will be removed in a future major version.
     */
    @Prop()
    public multiline: boolean;

    /**
     * Defines the language for translations.
     */
    @Prop()
    public language: Languages = 'en';

    @Element()
    private readonly host: HTMLLimelSnackbarElement;

    /**
     * Emitted when the action button is pressed
     */
    @Event()
    private readonly action: EventEmitter<void>;

    /**
     * Emitted when the snackbar hides itself
     */
    @Event()
    private readonly hide: EventEmitter<void>;

    @State()
    private offset: number = 0;

    @State()
    private isOpen: boolean = false;

    @State()
    private closing: boolean = true;

    private readonly snackbarId: string;
    private timeoutId?: number;

    public constructor() {
        this.snackbarId = createRandomString();
    }

    public componentDidLoad() {
        if (this.open) {
            requestAnimationFrame(this.handleOpen);
        }
    }

    @Listen('changeOffset')
    protected onChangeIndex(event: CustomEvent<number>) {
        event.stopPropagation();
        this.offset = event.detail;
    }

    @Watch('open')
    protected watchOpen() {
        if (this.open) {
            this.handleOpen();
        } else {
            this.handleClose();
        }

        this.isOpen = this.open;
    }

    /**
     * Show the snackbar
     * @deprecated Use the `open` property instead.
     */
    @Method()
    public async show() {
        console.warn(
            'The `show` method in `limel-snackbar` is deprecated. Please use the `open` property instead.'
        );
        if (!this.open) {
            this.handleOpen();
        }
    }

    public handleOpen = () => {
        if (this.isOpen) {
            return;
        }

        this.isOpen = true;
        this.closing = false;
        container.add(this.host);

        if (this.timeout && this.timeout !== -1) {
            this.timeoutId = window.setTimeout(
                this.handleClose,
                Math.max(
                    this.timeout - hideAnimationDuration,
                    hideAnimationDuration
                )
            );
        }
    };

    private readonly handleClose = () => {
        if (!this.isOpen) {
            return;
        }

        this.closing = true;

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = undefined;
        }

        setTimeout(() => {
            this.isOpen = false;
            container.remove(this.host);
            this.hide.emit();
            this.offset = 0;
        }, hideAnimationDuration);
    };

    public render() {
        return (
            <aside
                popover="manual"
                style={{
                    '--snackbar-timeout': `${Math.max(this.timeout || 0, 0)}ms`,
                    '--snackbar-distance-to-top-edge': `${this.offset}px`,
                }}
                class={{
                    open: this.open,
                    'is-closing': this.closing,
                    'limel-portal--parent': true,
                }}
                id={this.snackbarId}
                role={this.setAriaRoles()}
                aria-relevant={this.open ? 'additions' : undefined}
            >
                <div class="surface" aria-atomic="false">
                    <div class="label">{this.message}</div>
                    {this.renderActions(this.actionText)}
                    {this.renderDismissButton(this.dismissible)}
                </div>
            </aside>
        );
    }

    private setAriaRoles() {
        if (!this.open) {
            return;
        }

        if (!this.timeout || this.timeout === -1) {
            return 'alertdialog';
        }

        return 'status';
    }

    private readonly handleClickAction = () => {
        this.action.emit();
    };

    private renderActions(actionText: string) {
        if (!actionText) {
            return;
        }

        return (
            <div class="actions" aria-atomic="true">
                {this.renderActionButton(actionText)}
            </div>
        );
    }

    private renderActionButton(actionText: string) {
        if (!actionText) {
            return;
        }

        return (
            <limel-button label={actionText} onClick={this.handleClickAction} />
        );
    }

    private renderDismissButton(dismissible: boolean) {
        if (!dismissible) {
            return;
        }

        const label = translate.get('snackbar.dismiss', this.language);

        return (
            <div class="dismiss">
                {this.renderTimeoutVisualization()}
                <limel-icon-button
                    class="dismiss-button"
                    icon="multiply"
                    label={label}
                    onClick={this.handleClose}
                    aria-controls={this.snackbarId}
                />
            </div>
        );
    }

    private renderTimeoutVisualization() {
        if (!this.timeout || this.timeout === -1) {
            return;
        }

        return (
            <svg width="36" height="36" viewBox="0 0 36 36">
                <circle r="18" cx="18" cy="18" fill="var(--track-color)" />
                <path
                    class="track"
                    d="M 18,18 m -16,0 a 16,16 0 1,0 32,0 a 16,16 0 1,0 -32,0"
                    stroke="var(--fill-color)"
                />
            </svg>
        );
    }
}
