import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-badge',
    styleUrl: 'badge.scss',
    shadow: true,
})
export class BadgeExample {
    private label1: number = 5;
    private label2: number = 995;
    private label3: number = 9951;
    private label4: number = 999990;

    public render() {
        return [
            <limel-badge class="badge" label={this.label1} />,
            <limel-badge class="badge" label={this.label2} />,
            <limel-badge class="badge" label={this.label3} />,
            <limel-badge class="badge" label={this.label4} />,
        ];
    }
}
