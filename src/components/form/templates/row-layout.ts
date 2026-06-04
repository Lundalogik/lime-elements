import React from 'react';
import { Row } from '../row/row';
import { toSchemaPath } from './object-field';
import { RowProps } from './types';

interface RowLayoutProps extends RowProps {
    schemaPath?: string[];
}

export class RowLayout extends React.Component<RowLayoutProps> {
    private elementRef: React.RefObject<HTMLElement>;

    constructor(public props: RowLayoutProps) {
        super(props);

        this.elementRef = React.createRef();
    }

    public render() {
        return React.createElement(
            'div',
            {
                className: 'limel-form-row--layout',
                'data-schema-path': toSchemaPath(this.props.schemaPath ?? []),
                ref: this.elementRef,
            },
            this.props.children.map((child, index) => {
                return React.createElement(
                    Row,
                    {
                        key: index.toString(),
                    },
                    child
                );
            })
        );
    }
}
