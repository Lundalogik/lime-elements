import { Component, Element, Prop, Watch } from '@stencil/core'; // tslint:disable-line:no-implicit-dependencies

@Component({
    shadow: true,
    styleUrl: 'button.scss',
    tag: 'limel-button',
})
export class Button {
    @Prop() public label: string;
    @Prop() public primary = false;
    @Prop({ reflectToAttr: true }) public disabled = false; // tslint:disable-line:prettier
    @Prop() public loading = false;

    @Element() private limelButton: HTMLElement;

    public render() {
        return (
            <button
                class={`
                    mdc-button
                    ${this.primary ? 'mdc-button--unelevated' : ''}
                `}
                disabled={this.disabled}
            >
                <span class="label">{this.label}</span>
                <limel-spinner />
                <svg viewBox="0 0 30 30">
                    <path d="M20.659 10l-6.885 6.884-3.89-3.89-1.342 1.341 5.053 5.052.182.176L22 11.341z" />
                </svg>
            </button>
        );
    }

    @Watch('loading')
    protected loadingWatcher(newValue: boolean, oldValue: boolean) {
        const button = this.limelButton.shadowRoot.querySelector('button');
        if (newValue && !oldValue) {
            button.classList.add('loading');
        } else if (oldValue) {
            button.classList.remove('loading');
            button.classList.add('just-loaded');
            const TIMEOUT = 2000;
            setTimeout(() => {
                button.classList.remove('just-loaded');
            }, TIMEOUT);
        }
    }
}
