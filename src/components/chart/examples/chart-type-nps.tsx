import { Component, h, Host } from '@stencil/core';
import { chartItems } from './chart-items-nps';

/**
 * NPS® chart
 * The NPS chart visually represents customer loyalty by plotting scores that
 * range from -100 to +100. NPS is based on customer responses to a simple question:
 * "_How likely are you to recommend us?_"
 *
 * Respondents score from 0 to 10, which is then transformed into the NPS scale which starts from -100 and
 * goes up to +100. The NPS chart groups scores into three categories of:
 * <span style="background-color: rgb(var(--color-amber-light)); padding: 0 0.25rem; border-radius: 0.5rem;">detractors</span>,
 * <span style="background-color: rgb(var(--color-coral-default)); padding: 0 0.25rem; border-radius: 0.5rem;">passives</span>,
 * or <span style="background-color: rgb(var(--color-lime-light)); padding: 0 0.25rem; border-radius: 0.5rem;">promoters</span>.
 *
 * An NPS score above 30 is considered
 * <span style="background-color: rgb(var(--color-lime-light)); padding: 0 0.25rem; border-radius: 0.5rem;">good</span>,
 * while a score above 70 is considered
 * <span style="background-color: rgb(var(--color-lime-default)); padding: 0 0.25rem; border-radius: 0.5rem;">excellent</span>.
 *
 * This chart is good for:
 * - Summarizing customer satisfaction or loyalty on a single scale.
 * - Quickly identifying the distribution of detractors, passives, and promoters.
 *
 * :::tip
 * **Use:**
 * - Visualizing a single score that summarizes customer loyalty.
 * - When tracking customer loyalty over time.
 * - When tracking customer loyalty of different companies.
 * - In dashboards or reporting tools to visualize changes in customer sentiment.
 *
 * **Avoid:**
 * - For in-depth customer feedback analysis (consider pairing with more detailed survey insights).
 * - Any other data visualization than NPS scores.
 * :::
 *
 * :::important
 * For the `nps` chart type to visualize properly, the `value` property of the `ChartItem`
 * should be a number between `-100` and `100`!
 * :::
 * @sourceFile chart-items-nps.ts
 */
@Component({
    tag: 'limel-example-chart-type-nps',
    shadow: true,
    styleUrl: 'chart-examples.scss',
})
export class ChartTypeNpsExample {
    public render() {
        return (
            <Host class="large" style={{ flexDirection: 'row' }}>
                <h4>
                    Our Net Promoter Score Development During the Past 5
                    Quarters
                </h4>
                <limel-chart items={chartItems} type="nps" />
            </Host>
        );
    }
}
