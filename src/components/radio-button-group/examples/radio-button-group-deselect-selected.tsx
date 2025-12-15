import {
    ListItem,
    LimelRadioButtonGroupCustomEvent,
} from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Allowing to deselect a selected radio button
 *
 * In native radio button groups, users cannot deselect an already selected radio button.
 * This is the standard behavior across most implementations; which we also showcased in the
 * "Basic example", before this one. However, this interaction design comes with a
 * significant user experience drawback. Once a user selects one choice, they cannot regret their choice.
 * This could be problematic in some designs such as forms or survey.
 * This is because a user cannot first answer a single choice question,
 * and then decide to skip that question and leave it unanswered.
 *
 * As a developer, for such scenarios you always have to remember to provide a N/A choice or similar,
 * to enable the user or respondents to skip that question.
 * However, having a radio button group in a survey that allows respondents to leave it
 * unanswered means that the question cannot be marked as "Required" or "Compulsory".
 * A required question works best, when user has to select an option, and cannot unselect it.
 *
 * See how `handleChange` is implemented in this example, and compare it to the Basic example
 * which does not allow deselecting the currently selected option.
 */
@Component({
    tag: 'limel-example-radio-button-group-deselect-selected',
    shadow: true,
})
export class RadioButtonDeselectSelectedExample {
    @State()
    private selectedItem: ListItem<string>;

    @State()
    private disabled: boolean = false;

    private items: Array<ListItem<string>> = [
        { text: 'Very satisfied', value: 'very-satisfied' },
        { text: 'Satisfied', value: 'satisfied', selected: true },
        { text: 'Neutral', value: 'neutral' },
        { text: 'Dissatisfied', value: 'dissatisfied' },
        { text: 'Very dissatisfied', value: 'very-dissatisfied' },
    ];

    public componentWillLoad() {
        this.selectedItem = this.items.find((item) => item.selected);
    }

    public render() {
        return (
            <Host>
                <p>How satisfied are you with our product?</p>
                <limel-radio-button-group
                    items={this.items}
                    selectedItem={this.selectedItem}
                    disabled={this.disabled}
                    onChange={this.handleChange}
                />
                <limel-example-controls>
                    <limel-switch
                        value={this.disabled}
                        label="Disabled"
                        onChange={this.setDisabled}
                    />
                </limel-example-controls>
                <limel-example-value
                    label="Selected answer"
                    value={this.selectedItem?.value}
                />
            </Host>
        );
    }

    private handleChange = (
        event: LimelRadioButtonGroupCustomEvent<ListItem<string>>
    ) => {
        const item = event.detail;
        this.selectedItem = item.selected === false ? undefined : item;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };
}
