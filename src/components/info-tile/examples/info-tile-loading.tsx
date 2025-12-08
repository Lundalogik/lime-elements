import { Component, h, State } from '@stencil/core';

/**
 * Loading state
 *
 * Sometimes the value needs to be calculated, updated, or fetched
 * through a process that requires some time. In such cases, it is
 * a great idea to let the users know that the data is being updated.
 *
 * To do so, set the `loading` property to `true`. The component will then
 * show an indeterminate progressbar indicating the data is being updated,
 * while the older value is still being displayed.
 *
 * :::note
 * Note that this does _not_ disable the link, and most probably you
 * do not need it to be disabled either.
 * If the link should be disabled while loading, the
 * `disabled` property should be set to `true` as well.
 * :::
 */
@Component({
    tag: 'limel-example-info-tile-loading',
    shadow: true,
    styleUrl: 'info-tile-loading.scss',
})
export class InfoTileLoadingExample {
    @State()
    public loading = false;

    public render() {
        const link = {
            href: 'https://duckduckgo.com/?q=weather',
            title: 'Click to see real-time weather forecast',
        };

        return [
            <limel-info-tile
                icon="partly_cloudy_rain"
                label="Partly cloudy with a risk of rain"
                prefix="temp"
                value="23"
                suffix="°C"
                link={link}
                loading={this.loading}
            />,
            <limel-example-controls>
                <limel-switch
                    label="Loading"
                    value={this.loading}
                    onChange={this.setLoading}
                />
            </limel-example-controls>,
        ];
    }

    private setLoading = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.loading = event.detail;
    };
}
