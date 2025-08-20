import { LimelListCustomEvent, ListItem } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * List with action menu
 */
@Component({
    tag: 'limel-example-list-action',
    shadow: true,
})
export class ListActionExample {
    @State()
    private lastEvent: string = 'No actions yet';

    private actionItems: Array<ListItem<number>> = [
        { text: 'Go to my fab object', value: 10 },
        { text: 'Delete object', value: 11 },
    ];

    private items: Array<ListItem<number>> = [
        {
            text: 'King of Tokyo',
            value: 1,
            icon: 'gorilla',
            actions: this.actionItems,
        },
        { text: 'Smash Up!', value: 2, icon: 'alien' },
    ];

    public render() {
        return (
            <Host>
                <limel-list items={this.items} onSelect={this.onSelectAction} />
                <limel-example-value
                    label="Last action"
                    value={this.lastEvent}
                />
            </Host>
        );
    }

    private onSelectAction = (event: LimelListCustomEvent<ListItem>) => {
        const detail = event.detail as any;
        const valuePart =
            detail && 'value' in detail ? `, value: ${detail.value}` : '';
        this.lastEvent = `Executing action: ${detail?.text ?? 'unknown'}${valuePart}`;
    };
}
