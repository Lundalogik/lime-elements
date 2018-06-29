import {
    Component,
    Element,
    Event,
    EventEmitter,
    Listen,
    Prop,
    Watch
} from '@stencil/core'; // tslint:disable-line:no-implicit-dependencies

@Component({
    shadow: true,
    styleUrl: 'button.scss',
    tag: 'limel-button',
})
export class Button {
    @Prop() public label: string;
    @Prop() public primary = false;
    @Prop() public disabled = false;
    @Prop() public loading = false;

    @Element() public limelButton: HTMLElement;

    @Event() public limelButtonClicked: EventEmitter;

    @Listen('click')
    public clickHandler() {
        if (!this.disabled) {
            this.limelButtonClicked.emit(this.limelButton);
        }
    }

    @Watch('loading')
    public loadingWatcher(newValue: boolean, oldValue: boolean) {
        const button = this.limelButton.shadowRoot.querySelector('button');
        if (newValue && !oldValue) {
            button.classList.add('loading');
        } else if (oldValue) {
            button.classList.remove('loading');
            button.classList.add('just-loaded');
            const TIMEOUT = 2000;
            setTimeout(() => { button.classList.remove('just-loaded'); }, TIMEOUT);
        }
    }

    public componentDidLoad() {
        this.loadingWatcher(this.loading, false);
        if (this.primary) {
            this.limelButton.shadowRoot.querySelector('button').classList.add('mdc-button--unelevated', 'primary');
        }
    }

    public render() {
        return (
            <button class="mdc-button" disabled={this.disabled}>
                <span class="label">{this.label}</span>
                <limel-spinner />
                <svg viewBox="0 0 30 30">
                    <path d="M20.659 10l-6.885 6.884-3.89-3.89-1.342 1.341 5.053 5.052.182.176L22 11.341z" />
                </svg>
            </button>
        );
    }
}
