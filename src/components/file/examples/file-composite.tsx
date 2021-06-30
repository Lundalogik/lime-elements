import { FileInfo, Languages } from '@limetech/lime-elements';
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
    public schema: any;

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
            <limel-collapsible-section header="Settings">
                <limel-form
                    schema={this.schema}
                    value={this.props}
                    onChange={this.handleChangeForm}
                />
            </limel-collapsible-section>
        );
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.eventPrinter.writeEvent(event);
    };

    private handleChangeForm = (event: CustomEvent) => {
        this.props = { ...event.detail };
    };
}
