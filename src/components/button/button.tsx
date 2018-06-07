import { Component, Prop, Watch, Element } from '@stencil/core';

@Component({
    tag: 'limel-button',
    styleUrl: 'button.less',
    shadow: true
})
export class Button {

    @Prop() label: string;
    @Prop() primary = false;
    @Prop() disabled = false;
    @Prop() loading = false;

    @Element() limelButton: HTMLElement;

    @Watch('loading')
    loadingWatcher(newValue: boolean, oldValue: boolean) {
        const button = this.limelButton.shadowRoot.querySelector('button');
        if (newValue && !oldValue) {
            button.classList.add('loading');
        } else if (oldValue) {
            button.classList.remove('loading');
            button.classList.add('just-loaded');
            setTimeout(() => { button.classList.remove('just-loaded'); }, 2000);
        }
    }

    componentDidLoad() {
        this.loadingWatcher(this.loading, false);
        if (this.primary) {
            this.limelButton.shadowRoot.querySelector('button').classList.add('primary');
        }
    }

    render() {
        return (
            <button disabled={this.disabled}>
                <span class="label">{this.label}</span>
                <limel-spinner></limel-spinner>
                <svg width="30" height="30"><path d="M20.659 10l-6.885 6.884-3.89-3.89-1.342 1.341 5.053 5.052.182.176L22 11.341z"/></svg>
            </button>
        );
    }Z
}
