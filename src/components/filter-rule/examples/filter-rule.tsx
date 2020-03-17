import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-filter-rule',
    shadow: true,
})
export class FilterRuleExample {
    public render() {
        return [
            <limel-filter-rule label="My Filter Rule" />,
        ];
    }
}
