/* tslint:disable max-classes-per-file */
import { Component, h, Prop, State } from '@stencil/core';
import { Node } from './node';

@Component({
    tag: 'limel-filter-rule',
    shadow: true,
    styleUrl: 'filter-rule.scss',
})
export class FilterRule {
    /**
     * Label
     */
    @Prop({ reflectToAttr: true })
    public label: string;

    @Prop()
    public widgetProps: any;

    @Prop()
    public value: any;

    @State()
    public root: Node = {};

    constructor() {
        this.handleUpdateRoot = this.handleUpdateRoot.bind(this);
    }

    public render() {
        console.log('render', this.widgetProps);
        return (
            <limel-flex-container>
                <limel-filter-node
                    node={this.root}
                    onChange={this.handleUpdateRoot}
                />
            </limel-flex-container>
        );
    }

    private handleUpdateRoot(event: CustomEvent<Node>) {
        console.log('updateing root', event);
        this.root = event.detail;
    }
}
