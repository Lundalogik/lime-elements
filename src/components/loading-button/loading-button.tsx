import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Method,
    Prop,
    State,
} from '@stencil/core';
import {
    LoadingButtonInteraction,
    LoadingResult,
} from './loading-button.types';

/**
 * @exampleComponent limel-example-loading-button-basic-success
 * @exampleComponent limel-example-loading-button-basic-failure
 * @exampleComponent limel-example-loading-button-reduced-presence
 * @exampleComponent limel-example-loading-button-composite
 */
@Component({
    tag: 'limel-loading-button',
    shadow: true,
    styleUrl: 'loading-button.scss',
})
export class Button {
    /**
     * The text to show on the button.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Set to `true` to make the button primary.
     */
    @Prop({ reflect: true })
    public primary = false;

    /**
     * Set to `true` to make the button outlined.
     */
    @Prop({ reflect: true })
    public outlined = false;

    /**
     * Set icon for the button
     */
    @Prop({ reflect: true })
    public icon: string;

    /**
     * Set to `true` to disable the button.
     */
    @Prop({ reflect: true })
    public disabled = false;

    @Prop({ reflect: true })
    public hasReducedPresence = false;

    /**
     * Emitted when the user clicks or otherwise activates the button.
     *
     * @type {LoadingButtonInteraction}
     */
    @Event()
    public interact: EventEmitter<LoadingButtonInteraction>;

    @Element()
    private host: HTMLLimelLoadingButtonElement;

    @State()
    private loading = false;

    private showResultTimeout;
    private innerButton: HTMLButtonElement;

    constructor() {
        this.indicateLoading = this.indicateLoading.bind(this);
        this.resolveLoading = this.resolveLoading.bind(this);
    }

    public connectedCallback() {
        this.initialize();
    }

    public componentDidLoad() {
        this.initialize();
    }

    /**
     * Call to indicate loading is in progress.
     */
    @Method()
    public async indicateLoading() {
        this.privateIndicateLoading();
    }

    /**
     * Call to indicate loading has stopped.
     *
     * @param {LoadingResult} result Indicate loading success or failure.
     */
    @Method()
    public async resolveLoading(result: LoadingResult) {
        this.privateResolveLoading(result);
    }

    public render() {
        return (
            <button
                class={`
                    mdc-button
                    ${this.primary ? 'mdc-button--unelevated' : ''}
                    ${this.loading ? 'loading' : ''}
                    ${this.outlined ? 'mdc-button--outlined' : ''}
                `}
                disabled={this.disabled}
                onClick={this.handleClick}
            >
                <div class="mdc-button__ripple" />
                {this.renderIcon()}
                <span class="label mdc-button__label">{this.label}</span>
                <limel-spinner limeBranded={false} />
                <svg class="success" viewBox="0 0 30 30">
                    <line x1="8" y1="14" x2="15" y2="20"></line>
                    <line x1="23" y1="9" x2="14" y2="20"></line>
                </svg>
                <svg class="failure" viewBox="0 0 30 30">
                    <line x1="9" y1="9" x2="21" y2="21"></line>
                    <line x1="21" y1="9" x2="9" y2="21"></line>
                </svg>
            </button>
        );
    }

    private initialize = () => {
        this.innerButton = this.host?.shadowRoot?.querySelector('button');
    };

    private privateIndicateLoading = () => {
        this.loading = true;

        this.innerButton.classList.remove(
            LoadingResult.SUCCESS,
            LoadingResult.FAILURE
        );
    };

    private privateResolveLoading = (result: LoadingResult) => {
        this.loading = false;

        this.innerButton.classList.remove(
            LoadingResult.SUCCESS,
            LoadingResult.FAILURE
        );

        if (this.showResultTimeout) {
            clearTimeout(this.showResultTimeout);
            this.showResultTimeout = null;
        }

        if (result === LoadingResult.ABORT) {
            return;
        }

        this.innerButton.classList.add(result);

        const TIMEOUT = 2000;
        this.showResultTimeout = setTimeout(() => {
            this.innerButton.classList.remove(result);
        }, TIMEOUT);
    };

    private handleClick = () => {
        this.interact.emit({
            indicateLoading: this.privateIndicateLoading,
            resolveLoading: this.privateResolveLoading,
        });
    };

    private renderIcon = (): HTMLElement => {
        if (!this.icon) {
            return;
        }

        let withoutLabelClass = '';
        if (!this.label) {
            withoutLabelClass = 'no-label';
        }

        return (
            <i class={`mdc-button__icon ${withoutLabelClass}`}>
                <limel-icon name={this.icon} />
            </i>
        );
    };
}
