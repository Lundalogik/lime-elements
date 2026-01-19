import { Component, h, Host, Prop, State } from '@stencil/core';
import { FormSchema, ListItem } from '@limetech/lime-elements';

/**
 * Composite
 *
 * A place to try different combinations of states.
 */
@Component({
    tag: 'limel-example-picker-composite',
    shadow: true,
})
export class PickerCompositeExample {
    @Prop({ mutable: true })
    public schema: FormSchema;

    @State()
    private props: {
        value: ListItem<number | string> | Array<ListItem<number | string>>;
        [key: string]: any;
    } = {
        label: 'My label',
        searchLabel: 'My search label',
        helperText: 'My helper text',
        leadingIcon: 'search',
        emptyResultMessage: 'No matches found',
        delimiter: '',
        value: [],
        required: false,
        disabled: false,
        readonly: false,
        loading: false,
        multiple: true,
        badgeIcons: true,
    };

    private eventPrinter: HTMLLimelExampleEventPrinterElement;

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

    private availableItems: Array<ListItem<number>> = [...this.allItems];

    public componentWillLoad() {
        const schema = {
            ...this.schema,
            lime: {
                layout: {
                    type: 'grid',
                },
            },
        };
        delete schema.properties.actionPosition;
        delete schema.properties.actionScrollBehavior;
        delete schema.properties.actions;
        delete schema.properties.allItems;
        delete schema.properties.searcher;
        this.schema = schema;
    }

    public render() {
        return (
            <Host>
                <limel-picker
                    {...this.props}
                    allItems={this.availableItems}
                    onChange={this.handleChange}
                    onInteract={this.handleEvent}
                />
                {this.renderForm()}
                <limel-example-event-printer
                    ref={(el) => (this.eventPrinter = el)}
                />
            </Host>
        );
    }

    private handleChange = (
        event: CustomEvent<
            ListItem<number | string> | Array<ListItem<number | string>>
        >
    ) => {
        this.props = {
            ...this.props,
            value: event.detail as any,
        };
        this.updateAvailableItems();
    };

    private updateAvailableItems = () => {
        this.availableItems = this.allItems.filter((item) => {
            return !(this.props.value as any)?.find?.(
                (selectedItem: ListItem<number | string>) => {
                    return item.value === selectedItem.value;
                }
            );
        });
    };

    private handleEvent = (event: CustomEvent) => {
        this.eventPrinter.writeEvent(event);
    };

    private renderForm() {
        return (
            <limel-example-controls
                style={{ '--example-controls-column-layout': 'auto-fit' }}
            >
                <limel-form
                    schema={this.schema}
                    value={this.props}
                    onChange={this.handleFormChange}
                />
            </limel-example-controls>
        );
    }

    private handleFormChange = (event: CustomEvent) => {
        this.props = event.detail;
    };
}
