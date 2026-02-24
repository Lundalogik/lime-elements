import { Component, h, State } from '@stencil/core';

/**
 * Example: Card with selectable state
 */
@Component({
    tag: 'limel-example-card-selected',
    shadow: true,
    styleUrl: 'card-selected.scss',
})
export class LimelExampleCardSelected {
    @State()
    private selected = false;

    private toggleSelected = () => {
        this.selected = !this.selected;
    };

    private handleSwitchChange = (event: CustomEvent<boolean>) => {
        this.selected = event.detail;
    };

    public render() {
        const icon = {
            name: 'ok',
            color: 'rgb(var(--color-green-default))',
            title: 'Selectable Card',
        };
        return (
            <div>
                <limel-card
                    icon={icon}
                    heading="Selectable Card"
                    value="Click the card or toggle the switch to select/deselect it."
                    selected={this.selected}
                    clickable={true}
                    onClick={this.toggleSelected}
                />
                <limel-switch
                    label="Selected"
                    value={this.selected}
                    onChange={this.handleSwitchChange}
                />
            </div>
        );
    }
}
