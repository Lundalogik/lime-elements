import { Component, h, State } from '@stencil/core';
import { data } from '../../table/examples/birds';

/**
 * Editable with automatic theme
 * Here you see an instance of the Code Editor component which allows editing the
 * presented code.
 * This instance has an `auto` `colorScheme`, which means it reacts
 * to the operating system's settings for preferred appearance (dark or light).
 */

@Component({
    tag: 'limel-example-code-editor',
    shadow: true,
})
export class CodeExample {
    @State()
    private json: string = JSON.stringify(data, null, '    ');

    private handleChange = (event: CustomEvent<string>) => {
        this.json = event.detail;
    };

    public render() {
        return (
            <limel-code-editor
                value={this.json}
                language="json"
                onChange={this.handleChange}
            />
        );
    }
}
