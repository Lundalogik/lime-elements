import React from 'react';
import { RowProps } from '../templates/types';

export class Row extends React.Component<RowProps> {
    constructor(public props: RowProps) {
        super(props);
    }

    public render() {
        const classes = ['row'];
        if (this.icon) {
            classes.push('has-icon');
        }

        return React.createElement(
            'div',
            {
                className: classes.join(' '),
            },
            this.renderMainInformation(),
            this.renderDescription()
        );
    }

    private renderIcon() {
        if (this.icon) {
            return React.createElement('limel-icon', {
                name: this.icon,
            });
        }
    }

    private renderMainInformation() {
        return React.createElement(
            'div',
            { className: 'main-information' },
            this.renderIcon(),
            this.renderTitle(),
            this.renderChildren()
        );
    }
    private renderTitle() {
        return React.createElement(
            'h1',
            { className: 'title' },
            this.schema?.title
        );
    }

    private renderDescription() {
        if (this.schema?.description) {
            return React.createElement(
                'p',
                { className: 'description' },
                this.schema.description
            );
        }
    }

    private renderChildren() {
        const children = this.props.children;

        return {
            ...children,
            props: {
                ...children.props,
                schema: {
                    ...children.props.schema,
                    title: null,
                    description: null,
                },
            },
        };
    }

    private get schema() {
        return this.props.children.props.schema;
    }

    private get icon() {
        return this.layout?.icon;
    }

    private get layout() {
        const fieldProps = this.props.children.props;
        const schemaId: string | undefined = fieldProps.idSchema?.$id;

        const slotName =
            schemaId && schemaId.replace('root_', '').replace(/_(\d+_)?/g, '.');

        const lime =
            fieldProps.registry.formContext.ui[slotName] || this.schema?.lime;

        return lime?.layout;
    }
}
