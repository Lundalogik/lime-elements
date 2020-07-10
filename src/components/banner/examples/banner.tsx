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

    constructor() {
        this.openBanner = this.openBanner.bind(this);
        this.closeBanner = this.closeBanner.bind(this);
        this.someCustomAction = this.someCustomAction.bind(this);
    }

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
                <limel-flex-container
                    justify="end"
                    align="stretch"
                    slot="buttons"
                >
                    <limel-button
                        label="Some Action"
                        onClick={this.someCustomAction}
                    />
                    <limel-button label="Close" onClick={this.closeBanner} />
                </limel-flex-container>
            </limel-banner>,
        ];
    }

    private openBanner() {
        this.banner.open();
        this.disabled = true;
    }

    private closeBanner() {
        this.banner.close();
        this.disabled = false;
    }

    private someCustomAction() {
        alert('Triggered an action of some sort');
        this.closeBanner();
    }
}
