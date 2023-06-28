import { Button, LimelButtonGroupCustomEvent } from '@limetech/lime-elements';
import { Component, State, h } from '@stencil/core';
/**
 * Button group with badges
 *
 * Badges can be used to add further contextual information.
 * For example, if the component is used to filter a set of data
 * the badges could visualize the number of entries
 * for each filter option.
 *
 * The badge can either
 * have a `number` or `string` label.
 * Read more about how the badge truncates or abbreviates the
 * provided label [here](#/component/limel-badge/).
 */
@Component({
    tag: 'limel-example-button-group-badges',
    shadow: true,
})
export class ButtonGroupBadgesExample {
    @State()
    private buttons: Button[] = [
        {
            id: '1',
            title: 'Overdue',
            badge: '50+',
        },
        {
            id: '2',
            title: 'Today',
            badge: 9,
            selected: true,
        },
        {
            id: '3',
            title: 'Upcoming',
            badge: 23,
        },
        {
            id: '4',
            title: 'Future',
            badge: 62,
        },
    ];

    public render() {
        return [
            <limel-button-group
                onLimelChange={this.handleChange}
                value={this.buttons}
            />,
        ];
    }

    private handleChange = (event: LimelButtonGroupCustomEvent<Button>) => {
        const changedButton = event.detail;
        console.log(changedButton);

        this.buttons = this.buttons.map((button) => {
            return {
                ...button,
                selected: button.id === changedButton.id,
            };
        });
    };
}
