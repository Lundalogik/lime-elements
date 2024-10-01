import { Component, h, Host, State } from '@stencil/core';
import { chartItems } from './chart-items-multi-axis-negative-start-values';

/**
 * Accessibility
 * Under the hoods, our charts are simply HTML tables.
 * This helps screen readers to interpret the data and present it to their users.
 * However, to make this semantic more accessible and more understandable,
 * there are some optional props that we highly recommend you to use.
 *
 * - `accessibleLabel`: Will be used as a `caption` for the table, and
 * describes what the chart is about. Depending on the context,
 * It might also be a good idea to include the accessible label for sighted
 * users as well, for instance, as a heading.
 * - `accessibleItemsLabel`: Will be used as a `th` for the first column of the table,
 * describing what all items in this column have in common. In this example,
 * all items are cities.
 *
 * Note that these props won't be visually rendered for sighted users, but
 * they will be presented to assistive technologies, such as screen readers
 * as well as search engines.
 *
 * Another way to improve the accessibility of the chart is to use
 * the `prefix` and `suffix` props to provide additional context to the `value`
 * of each item.
 *
 * ##### Using the `loading` prop
 * Sometimes the data set needs to be calculated, or fetched
 * through a process that requires some time. In such cases, it is
 * a great idea to let the users know that the data is being updated.
 *
 * To do so, set the `loading` property to `true`. The component will then
 * show a spinner, indicating the data is being updated. This not only improves
 * the user experience, but also the accessibility of the chart both for sighted users,
 * and behind the scenes, for users of assistive technologies.
 *
 * @sourceFile chart-items-gantt-negative-values.ts
 */
@Component({
    tag: 'limel-example-chart-accessibility',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartAccessibilityExample {
    @State()
    public loading = false;

    public render() {
        const heading = 'Temperature fluctuations past 24 hours';
        const subHeading = 'in cities we have our offices';

        return (
            <Host class="large">
                <limel-header
                    heading={heading}
                    subheading={subHeading}
                    icon="temperature_sensitive"
                />
                <limel-chart
                    type="bar"
                    items={chartItems}
                    orientation="landscape"
                    accessibleLabel={`${heading} - ${subHeading}`}
                    accessibleItemsLabel="City"
                    loading={this.loading}
                />
                <limel-example-controls>
                    <limel-checkbox
                        label="Loading"
                        checked={this.loading}
                        onChange={this.setLoading}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private setLoading = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.loading = event.detail;
    };
}
