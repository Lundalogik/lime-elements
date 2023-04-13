import { Component, h, Prop, State } from '@stencil/core';

/**
 * Composite
 */
@Component({
    tag: 'limel-example-callout-composite',
    shadow: true,
})
export class CalloutCompositeExample {
    @Prop()
    public schema: any;

    @State()
    private props: any = {
        heading: '',
        icon: '',
        content: 'This is my very nice [type]',
        type: 'tip',
        language: 'en',
    };

    public componentWillLoad() {
        const properties = {
            ...this.schema.properties,
            content: {
                type: 'string',
                title: 'Content',
                lime: {
                    layout: {
                        rowSpan: 2,
                        colSpan: 'all',
                    },
                    component: {
                        props: {
                            type: 'textarea',
                        },
                    },
                },
            },
        };

        this.schema = {
            ...this.schema,
            properties: properties,
            lime: {
                layout: {
                    type: 'grid',
                },
            },
        };
    }

    public render() {
        const content = this.props?.content?.replace(
            '[type]',
            this.props?.type ?? ''
        );

        return [
            <limel-callout {...this.props}>
                <div innerHTML={content} />
            </limel-callout>,
            this.renderForm(),
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

    private handleFormChange = (event: CustomEvent) => {
        this.props = { ...event.detail };
    };
}
