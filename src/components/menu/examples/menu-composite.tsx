import { Component, h, Prop, State } from '@stencil/core';

/**
 * Composite
 *
 * A place to try different combinations of states. This example has a slightly
 * more advanced `onSelect` handler, which disables the last selected value.
 */
@Component({
    tag: 'limel-example-menu-composite',
    shadow: true,
})
export class MenuCompositeExample {
    @Prop()
    public schema: any;

    @State()
    private props = {
        badgeIcons: true,
        disabled: false,
        fixed: false,
        items: [
            {
                text: 'Copy',
                icon: 'copy',
                iconColor: 'rgb(var(--color-lime-light))',
            },
            {
                text: 'Cut',
                icon: 'cut',
                iconColor: 'rgb(var(--color-red-light))',
            },
            { separator: true },
            {
                text: 'Paste',
                disabled: true,
                icon: 'paste',
                iconColor: 'rgb(var(--color-amber-default))',
            },
        ],
        open: false,
        openDirection: 'right',
        gridLayout: false,
    };

    private eventPrinter: HTMLLimelExampleEventPrinterElement;

    public componentWillLoad() {
        this.schema = {
            ...this.schema,
            lime: {
                layout: {
                    type: 'grid',
                },
            },
        };

        delete this.schema.properties.label;
    }

    public render() {
        console.log('Composite example schema:', this.schema);

        return [
            <limel-menu
                items={this.props.items as any}
                disabled={this.props.disabled}
                openDirection={this.props.openDirection as any}
                badgeIcons={this.props.badgeIcons}
                fixed={this.props.fixed}
                open={this.props.open}
                gridLayout={this.props.gridLayout}
                onSelect={this.handleSelect}
                onCancel={this.handleCancel}
            >
                <limel-button label="Menu" slot="trigger" />
            </limel-menu>,
            <limel-collapsible-section header="Settings">
                <limel-form
                    schema={this.schema}
                    value={this.props}
                    onChange={this.handleChange}
                />
            </limel-collapsible-section>,
            <limel-example-event-printer
                ref={(el) => (this.eventPrinter = el)}
            />,
        ];
    }

    private handleSelect = (event: CustomEvent) => {
        this.eventPrinter.writeEvent(event);
        this.props.items = this.props.items.map((item) => {
            if (!('separator' in item)) {
                item.disabled = item.text === event.detail.text;
            }

            return item;
        });

        this.props = { ...this.props };
    };

    private handleCancel = (event: Event) => {
        this.eventPrinter.writeEvent(event);
    };

    private handleChange = (event: CustomEvent) => {
        this.props = event.detail;
    };
}
