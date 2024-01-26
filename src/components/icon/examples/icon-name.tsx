import { Component, h } from '@stencil/core';

/**
 * Names
 * To display an icon, all you need to do is specifying its name.
 */
@Component({
    tag: 'limel-example-icon-name',
    shadow: true,
})
export class IconExample {
    public render() {
        return <limel-icon name="happy" />;
    }
}
