import { FormSchema } from '@limetech/lime-elements';
import { Component, h, Host, Prop, State } from '@stencil/core';

/**
 * Composite
 *
 * A place to try different combinations of states.
 */
@Component({
    tag: 'limel-example-tooltip-composite',
    shadow: true,
})
export class TooltipCompositeExample {
    @Prop({ mutable: true })
    public schema: FormSchema;

    @State()
    private props = {
        label: 'Find on this page',
        helperLabel: 'alt + F',
        maxlength: 50,
    };

    public componentWillLoad() {
        this.schema = {
            ...this.schema,
            lime: {
                layout: {
                    type: 'grid',
                },
            },
        };
        delete this.schema.properties.elementId;
    }

    public render() {
        return (
            <Host>
                <limel-button
                    label="Search"
                    icon="search"
                    id="tooltip-example"
                />
                <limel-tooltip {...this.props} elementId="tooltip-example" />
                {this.renderForm()}
            </Host>
        );
    }

    private renderForm() {
        return (
            <limel-collapsible-section header="Settings">
                <limel-form
                    schema={this.schema}
                    value={this.props}
                    onChange={this.handleChange}
                />
            </limel-collapsible-section>
        );
    }

    private handleChange = (event: CustomEvent) => {
        this.props = event.detail;
    };
}
