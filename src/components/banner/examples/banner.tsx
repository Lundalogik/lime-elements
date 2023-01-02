import { Component, Element, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-banner',
    shadow: true,
    styleUrl: 'banner.scss',
})
export class BannerExample {
    @Element()
    private host: HTMLLimelExampleBannerElement;

    @State()
    private disabled = false;

    private message = 'This is a non-blocking but also non-transient message';

    private banner: HTMLLimelBannerElement;

    public componentDidLoad() {
        this.banner = this.host.shadowRoot.querySelector('limel-banner');
    }

    public render() {
        return [
            <limel-button
                primary={true}
                disabled={this.disabled}
                label="Show Banner"
                onClick={this.openBanner}
            />,
            <limel-banner message={this.message} icon="exclamation_mark">
                <limel-button
                    label="Some Action"
                    onClick={this.someCustomAction}
                    slot="buttons"
                />
                <limel-button
                    label="Close"
                    onClick={this.closeBanner}
                    slot="buttons"
                />
            </limel-banner>,
        ];
    }

    private openBanner = () => {
        this.banner.open();
        this.disabled = true;
    };

    private closeBanner = () => {
        this.banner.close();
        this.disabled = false;
    };

    private someCustomAction = () => {
        alert('Triggered an action of some sort');
        this.closeBanner();
    };
}
