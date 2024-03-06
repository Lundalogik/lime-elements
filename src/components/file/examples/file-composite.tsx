import { FileInfo, FormSchema, Languages } from '@limetech/lime-elements';
import { Component, h, Prop, State } from '@stencil/core';

/**
 * Composite
 *
 * A place to try different combinations of states.
 */
@Component({
    tag: 'limel-example-file-composite',
    shadow: true,
})
export class FileCompositeExample {
    @Prop()
    public schema: FormSchema;

    @State()
    private props = {
        label: 'Attach a file',
        value: {
            id: '123',
            filename: 'document.pdf',
        } as FileInfo,
        language: 'en' as Languages,
    };

    private eventPrinter: HTMLLimelExampleEventPrinterElement;

    public componentWillLoad() {
        this.schema.lime = {
            layout: {
                type: 'grid',
            },
        };
        this.schema.properties.value.lime = {
            layout: {
                type: 'grid',
            },
        };
    }

    public render() {
        return [
            <limel-file {...this.props} onChange={this.handleChange} />,
            this.renderForm(),
            <limel-example-event-printer
                ref={(el) => (this.eventPrinter = el)}
            />,
        ];
    }

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

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.eventPrinter.writeEvent(event);
    };

    private handleFormChange = (event: CustomEvent) => {
        this.props = { ...event.detail };
    };
}
