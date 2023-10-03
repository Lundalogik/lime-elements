import React from 'react';
import { FormLayoutOptions, GridLayoutOptions } from '../../../interface';

const MAX_COLUMNS = 5;
const MAX_COLUMN_WIDTH = 15;
const PX_PER_REM = 16;
const COLUMN_COUNT = '--number-of-columns';

export class GridLayout extends React.Component<LayoutProps, LayoutState> {
    private elementRef: React.RefObject<HTMLElement>;
    private observer: ResizeObserver;

    constructor(public props: LayoutProps) {
        super(props);

        this.handleResize = this.handleResize.bind(this);

        this.state = {
            maxColumns: MAX_COLUMNS,
        };
        this.elementRef = React.createRef();
    }

    public componentDidMount() {
        this.observer = new ResizeObserver(this.handleResize);
        this.observer.observe(this.elementRef.current);
    }

    public componentWillUnmount() {
        this.observer.unobserve(this.elementRef.current);
    }

    public handleResize() {
        const element = this.elementRef.current;
        const width = element.getBoundingClientRect().width;
        const maxColumns = Math.min(
            MAX_COLUMNS,
            Math.max(1, Math.floor(width / (MAX_COLUMN_WIDTH * PX_PER_REM)))
        );

        const columns = this.getColumnCount(maxColumns);
        if (element.style.getPropertyValue(COLUMN_COUNT) !== `${columns}`) {
            element.style.setProperty(COLUMN_COUNT, `${columns}`);
        }

        if (maxColumns !== this.state.maxColumns) {
            this.setState({
                maxColumns: maxColumns,
            });
        }
    }

    public render() {
        const classes = ['limel-form-layout--grid'];
        const columns = this.getColumnCount(this.state.maxColumns);

        classes.push(`layout-${columns}-columns`);
        if (this.hasAutoFlowDense()) {
            classes.push('auto-reorder-to-avoid-empty-cells');
        }

        return React.createElement(
            'div',
            {
                className: classes.join(' '),
                ref: this.elementRef,
            },
            this.props.children
        );
    }

    private getColumnCount(maxColumns: number) {
        const layout: GridLayoutOptions = this.props.options as any;

        return Math.min(layout.columns || MAX_COLUMNS, maxColumns);
    }

    private hasAutoFlowDense(): boolean {
        const layout: GridLayoutOptions = this.props.options as any;

        return layout.dense !== false;
    }
}

interface LayoutProps {
    options: FormLayoutOptions;
    children?: any;
}

interface LayoutState {
    maxColumns: number;
}
