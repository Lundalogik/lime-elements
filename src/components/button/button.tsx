import { Component, Prop, Watch, Element } from '@stencil/core';

@Component({
    tag: 'limel-button',
    styleUrl: 'button.less',
    shadow: true
})
export class Button {

    @Prop() label: string;
    @Prop() primary: boolean = false;
    @Prop() disabled: boolean = false;
    @Prop() loading: boolean = false;
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
                <svg version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30">
                    <polygon points="20.659,10 13.774,16.884 9.884,12.994 8.542,14.335 13.595,19.387 13.777,19.563 22,11.341"></polygon>
                </svg>
            </button>
        );
    }Z
}
