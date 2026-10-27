import React from 'react';
import { RowProps } from '../templates/types';
import { RowLayoutContext } from './row-context';
import { HeadingLevelContext } from '../templates/heading-level';

export class Row extends React.Component<RowProps> {
    public static readonly contextType = HeadingLevelContext;
    declare context: React.ContextType<typeof HeadingLevelContext>;

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
        const title = this.schema?.title;

        return React.createElement(
            title ? `h${this.context}` : 'div',
            { className: 'title' },
            title
        );
    }

    private renderDescription() {
        if (this.schema?.description) {
            return React.createElement('limel-markdown', {
                class: 'description',
                value: this.schema.description,
            });
        }
    }

    private renderChildren() {
        return React.createElement(
            RowLayoutContext.Provider,
            { value: true },
            this.props.children
        );
    }

    private get schema() {
        return this.props.children.props.schema;
    }

    private get icon() {
        return this.schema?.lime?.layout?.icon;
    }
}
