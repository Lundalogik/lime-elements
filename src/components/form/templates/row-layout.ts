import React from 'react';
import { Row } from '../row/row';
import { RowProps } from './types';
export class RowLayout extends React.Component<RowProps> {
    private elementRef: React.RefObject<HTMLElement>;

    constructor(public props: RowProps) {
        super(props);

        this.elementRef = React.createRef();
    }

    public render() {
        const classes = ['limel-form-row--layout'];

        return React.createElement(
            'div',
            {
                className: classes.join(' '),
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
