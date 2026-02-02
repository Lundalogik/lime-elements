import {
    ListItem,
    LimelRadioButtonGroupCustomEvent,
    LimelSelectCustomEvent,
    Option,
} from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * With secondary text for items
 *
 * It is possible to add more descriptive text to each radio button option
 * using the `secondaryText` property.
 *
 * You can also use the `maxLinesSecondaryText` prop to control how many lines of
 * secondary text are displayed before they get truncated.
 * By default, radio buttons will display 3 lines of secondary text.
 */
@Component({
    tag: 'limel-example-radio-button-group-multiple-lines',
    shadow: true,
})
export class RadioButtonGroupMultipleLinesExample {
    @State()
    private selectedItem: ListItem<string>;

    @State()
    private maxLines: number = 2;

    private maxLinesOptions: Option<string>[] = [
        { text: '1 line', value: '1' },
        { text: '2 lines', value: '2' },
        { text: '3 lines', value: '3' },
        { text: '5 lines', value: '5' },
    ];

    private items: Array<ListItem<string>> = [
        {
            text: 'Basic Plan',
            secondaryText:
                'Perfect for individuals and small teams just getting started. Includes basic features, 5GB storage, and email support.',
            value: 'basic',
            selected: true,
        },
        {
            text: 'Professional Plan',
            secondaryText:
                'Ideal for growing businesses that need more advanced features. Includes everything in Basic plus 100GB storage, priority support, advanced analytics, team collaboration tools, and custom integrations.',
            value: 'professional',
        },
        {
            text: 'Enterprise Plan',
            secondaryText:
                'Designed for large organizations with complex needs. Includes unlimited storage, dedicated account manager, 24/7 phone support, advanced security features, custom branding, API access, and enterprise-grade compliance tools.',
            value: 'enterprise',
        },
    ];

    public componentWillLoad() {
        this.selectedItem = this.items.find((item) => item.selected);
    }

    public render() {
        return [
            <limel-radio-button-group
                items={this.items}
                selectedItem={this.selectedItem}
                maxLinesSecondaryText={this.maxLines}
                onChange={this.handlePlanChange}
            />,
            <limel-example-controls>
                <limel-select
                    label="Max lines of secondary text"
                    value={this.getSelectedMaxLines()}
                    options={this.maxLinesOptions}
                    onChange={this.handleMaxLinesChange}
                />
            </limel-example-controls>,
            <limel-example-value value={this.selectedItem?.value} />,
        ];
    }

    private getSelectedMaxLines() {
        return this.maxLinesOptions.find(
            (option) => option.value === this.maxLines.toString()
        );
    }

    private handlePlanChange = (
        event: LimelRadioButtonGroupCustomEvent<ListItem<string>>
    ) => {
        const item = event.detail;
        this.selectedItem = item.selected === false ? undefined : item!;
    };

    private handleMaxLinesChange = (
        event: LimelSelectCustomEvent<Option<string>>
    ) => {
        this.maxLines = +event.detail.value;
    };
}
