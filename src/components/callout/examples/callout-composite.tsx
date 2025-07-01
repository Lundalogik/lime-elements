import { FormSchema } from '@limetech/lime-elements';
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
    public schema: FormSchema;

    @State()
    private props: any = {
        heading: '',
        icon: '',
        content: 'This is my very nice [type]',
        type: 'tip',
        language: 'en',
        style: {
            '--callout-color': '',
            '--callout-text-color': '',
            '--callout-background-color': '',
        },
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
            style: {
                type: 'object',
                title: 'Styles',
                properties: {
                    '--callout-color': {
                        type: 'string',
                        title: 'Callout Color',
                        description: '--callout-color',
                        lime: {
                            component: {
                                name: 'limel-color-picker',
                            },
                        },
                    },
                    '--callout-text-color': {
                        type: 'string',
                        title: 'Text Color',
                        description: '--callout-text-color',
                        lime: {
                            component: {
                                name: 'limel-color-picker',
                            },
                        },
                    },
                    '--callout-background-color': {
                        type: 'string',
                        title: 'Background Color',
                        description: '--callout-background-color',
                        lime: {
                            component: {
                                name: 'limel-color-picker',
                            },
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
