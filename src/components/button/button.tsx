import { Component, Element, Prop, Watch } from '@stencil/core';

@Component({
    tag: 'limel-button',
    styleUrl: 'button.scss',
    shadow: true,
})
export class Button {
    @Prop({ reflectToAttr: true })
    public label: string;

    @Prop({ reflectToAttr: true })
    public primary = false;

    @Prop({ reflectToAttr: true })
    public disabled = false;

    @Prop({ reflectToAttr: true })
    public loading = false;

    @Element()
    private limelButton: HTMLElement;

    public render() {
        return (
            <button
                class={`
                    mdc-button
                    ${this.primary ? 'mdc-button--unelevated' : ''}
                    ${this.loading ? 'loading' : ''}
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
        if (oldValue && !newValue) {
            button.classList.add('just-loaded');
            const TIMEOUT = 2000;
            setTimeout(() => {
                button.classList.remove('just-loaded');
            }, TIMEOUT);
        }
    }
}
