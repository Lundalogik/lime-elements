import { Component, h, Host, State } from '@stencil/core';
import { Button, LimelButtonGroupCustomEvent } from '@limetech/lime-elements';

/**
 * Disabled item
 *
 * Individual buttons can be disabled by setting `disabled: true` on the
 * button, without disabling the rest of the group.
 *
 * :::note
 * Do not combine `disabled` with `selected` on the same button. Once the user
 * picks another button, the disabled one can never be selected again.
 * :::
 */
@Component({
    tag: 'limel-example-button-group-disabled-item',
    shadow: true,
})
export class ButtonGroupDisabledItemExample {
    @State()
    private buttons: Button[] = [
        {
            id: '1',
            title: 'First',
            selected: true,
        },
        {
            id: '2',
            title: 'Second',
            disabled: true,
        },
        {
            id: '3',
            title: 'Third',
        },
    ];

    @State()
    private disabled: boolean = false;

    private eventPrinter: HTMLLimelExampleEventPrinterElement;

    public render() {
        return (
            <Host>
                <limel-button-group
                    onChange={this.handleChange}
                    value={this.buttons}
                    disabled={this.disabled}
                />
                <limel-example-controls>
                    <limel-switch
                        label="Disabled"
                        onChange={this.toggleEnabled}
                        value={this.disabled}
                    />
                </limel-example-controls>
                <limel-example-event-printer
                    ref={(el) => (this.eventPrinter = el)}
                />
            </Host>
        );
    }

    private handleChange = (event: LimelButtonGroupCustomEvent<Button>) => {
        this.eventPrinter.writeEvent(event);
        const changedButton = event.detail;

        this.buttons = this.buttons.map((button) => {
            return {
                ...button,
                selected: button.id === changedButton.id,
            };
        });
    };

    private toggleEnabled = () => {
        this.disabled = !this.disabled;
    };
}
