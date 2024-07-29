import { Component, h, State } from '@stencil/core';
import { ListSeparator, MenuItem } from '@limetech/lime-elements';

/**
 * Split button with loading
 *
 *
 */
@Component({
    tag: 'limel-example-split-button-loading',
    shadow: true,
})
export class SplitButtonLoadingExample {
    @State()
    private loading = false;

    @State()
    private disabled = false;

    @State()
    private loadingFailed = false;
    private items: Array<ListSeparator | MenuItem> = [
        { text: 'Later today', secondaryText: 'at 16:45' },
        { text: 'Tomorrow', secondaryText: 'at 08:00' },
    ];

    public render() {
        return (
            <limel-split-button
                primary={true}
                loading={this.loading}
                loadingFailed={this.loadingFailed}
                disabled={this.disabled}
                label="Send"
                icon="send"
                items={this.items}
                onClick={this.onClick}
                onSelect={this.handleSelect}
            />
        );
    }

    private onClick = () => {
        console.log('Button clicked.');
        this.disabled = true;
        this.loading = true;
        this.loadingFailed = false;

        const TIME_LOADING = 2000;
        setTimeout(() => {
            this.loading = false;
            this.disabled = false;
            this.loadingFailed = false;
        }, TIME_LOADING);
    };

    private handleSelect = (event: CustomEvent<MenuItem>) => {
        console.log('Menu item chosen', event.detail.text);
        this.loading = true;
        this.disabled = true;
        this.loadingFailed = false;

        const TIME_LOADING = 2000;
        setTimeout(() => {
            this.loading = false;
            this.disabled = false;
            this.loadingFailed = false;
        }, TIME_LOADING);
    };
}
