import {
    Action,
    ActionPosition,
    ActionScrollBehavior,
    LimelPickerCustomEvent,
    LimelSelectCustomEvent,
    ListItem,
    Option,
} from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * With static actions
 *
 * Static items can be added to the picker to enable triggering custom actions
 * directly from the results dropdown list.
 *
 * :::tip
 * A typical use case of such actions is scenarios in which the picker's search
 * results or suggestions list does not include what the user wants to pick. By
 * offering custom actions right in the list, we can enable users to add missing
 * items.
 * :::
 */
@Component({
    tag: 'limel-example-picker-static-actions',
    shadow: true,
})
export class PickerStaticActionsExample {
    private allItems: Array<ListItem<number>> = [
        { text: 'Admiral Swiggins', value: 1 },
        { text: 'Ayla', value: 2 },
        { text: 'Clunk', value: 3 },
        { text: 'Coco', value: 4 },
        { text: 'Derpl', value: 5 },
        { text: 'Froggy G', value: 6 },
        { text: 'Gnaw', value: 7 },
        { text: 'Lonestar', value: 8 },
        { text: 'Leon', value: 9 },
        { text: 'Raelynn', value: 10 },
        { text: 'Skølldir', value: 11 },
        { text: 'Voltar', value: 12 },
        { text: 'Yuri', value: 13 },
    ];

    private actions: Array<ListItem<Action>> = [
        {
            text: 'Add a dog',
            icon: 'dog',
            iconColor: 'rgb(var(--color-orange-default))',
            value: { id: 'dog' },
        },
        {
            text: 'Add a cat',
            icon: 'cat',
            iconColor: 'rgb(var(--color-green-default))',
            value: { id: 'cat' },
        },
    ];

    private actionPositions: Array<Option<ActionPosition>> = [
        { text: 'Bottom', value: 'bottom' },
        { text: 'Top', value: 'top' },
    ];

    private actionScrollBehaviors: Array<Option<ActionScrollBehavior>> = [
        { text: 'Sticky', value: 'sticky' },
        { text: 'Scroll', value: 'scroll' },
    ];

    @State()
    private selectedItem: ListItem<number> = null;

    @State()
    private lastUsedAction: Action = null;

    @State()
    private actionScrollBehavior: Option<ActionScrollBehavior> =
        this.actionScrollBehaviors[0];

    @State()
    private actionPosition: Option<ActionPosition> = this.actionPositions[0];

    constructor() {
        this.search = this.search.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onAction = this.onAction.bind(this);
        this.setBehavior = this.setBehavior.bind(this);
        this.setPosition = this.setPosition.bind(this);
    }

    public render() {
        return [
            <limel-picker
                label="Select your favorite pet"
                value={this.selectedItem}
                searchLabel={'Search your awesomenaut'}
                searcher={this.search}
                onChange={this.onChange}
                onInteract={this.onInteract}
                onAction={this.onAction}
                actions={this.actions}
                actionScrollBehavior={this.actionScrollBehavior?.value}
                actionPosition={this.actionPosition?.value}
            />,
            <limel-example-controls
                style={{ '--example-controls-max-columns-width': '10rem' }}
            >
                <limel-select
                    class="is-narrow"
                    label="Action Scroll Behavior"
                    onChange={this.setBehavior}
                    value={this.actionScrollBehavior}
                    options={this.actionScrollBehaviors}
                />

                <limel-select
                    class="is-narrow"
                    label="Action Position"
                    onChange={this.setPosition}
                    value={this.actionPosition}
                    options={this.actionPositions}
                />
            </limel-example-controls>,
            <limel-example-value
                label="Last pressed action"
                value={this.lastUsedAction}
            />,
        ];
    }

    private search(query: string): Promise<ListItem[]> {
        return new Promise((resolve) => {
            if (query === '') {
                resolve(this.allItems);
            }

            const filteredItems = this.allItems.filter((item) => {
                return item.text.toLowerCase().includes(query.toLowerCase());
            });
            resolve(filteredItems);
        });
    }

    private onChange(event: LimelPickerCustomEvent<ListItem<number>>) {
        this.selectedItem = event.detail;
    }

    private onAction(event: CustomEvent<Action>) {
        this.lastUsedAction = event.detail;
    }

    private onInteract(event) {
        console.log('Value interacted with:', event.detail);
    }

    private setBehavior(
        event: LimelSelectCustomEvent<Option<ActionScrollBehavior>>
    ) {
        this.actionScrollBehavior = event.detail;
    }

    private setPosition(event: LimelSelectCustomEvent<Option<ActionPosition>>) {
        this.actionPosition = event.detail;
    }
}
