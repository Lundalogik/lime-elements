import { Component, h, State } from '@stencil/core';
import { InfoTileProgress } from '@limetech/lime-elements';

/**
 * Displaying a progress bar
 *
 * By defining a numeric `progressValue`, you can display
 * a circular progress bar to visualize more data on the component.
 * This can for instance help illustrate how much of a
 * set goal has been reached, which together with the `value` will help users
 * get a better overview of the provided data.
 *
 * When the circular progress is shown, that would become the primary
 * illustrative element on the component,
 * which means the icon will be rendered smaller, only as a supportive
 * contextual visual element.
 *
 * :::tip
 * It is possible to customize the progress bar's suffix, but it is
 * set to display the percentage sign (**%**) by default.
 * :::
 *
 */
@Component({
    tag: 'limel-example-info-tile-progress',
    shadow: true,
    styleUrl: 'info-tile-progress.scss',
})
export class InfoTileProgressExample {
    @State()
    private progress: InfoTileProgress = {
        value: 76,
        prefix: '↑',
        displayPercentageColors: true,
    };

    public render() {
        return [
            <limel-info-tile
                label="Won deals this month"
                icon="money"
                prefix="Total value"
                value="70,659"
                suffix="EUR"
                link={{ href: '#' }}
                progress={this.progress}
            />,
            <limel-example-controls>
                <limel-input-field
                    label="Progress value"
                    type="number"
                    value={`${this.progress.value}`}
                    onChange={this.handleChange}
                />
            </limel-example-controls>,
        ];
    }

    private handleChange = (event) => {
        this.progress = {
            ...this.progress,
            value: +event.detail,
        };
    };
}
