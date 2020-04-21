import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-data-table',
    shadow: true,
    styleUrl: 'data-table.scss',
})
export class dataTableExample {
    private field = {
        header: ["name", "age", "gender"],
        body: [
            {row1: ["Zekiros", "30", "Unknown"]},
            {row2: ["Bef", "12", "Something"]}
        ]
    }


    public render() {
        return (
            <limel-data-table
                field={this.field}
            />
        );
    }
}
