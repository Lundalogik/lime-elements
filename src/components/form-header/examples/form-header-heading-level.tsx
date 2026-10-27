import { Component, h, Host } from '@stencil/core';

/**
 * Heading level
 * The `headingLevel` decides which of the heading elements, from `h1` to
 * `h6`, draws the heading. `limel-form` sets it by how deep a section is, so
 * that a screen reader announces the sections, and the sections inside them,
 * at the right level.
 */
@Component({
    tag: 'limel-example-form-header-heading-level',
    shadow: true,
})
export class FormHeaderHeadingLevelExample {
    private readonly levels: Array<1 | 2 | 3 | 4 | 5 | 6> = [1, 2, 3, 4, 5, 6];

    public render() {
        return (
            <Host>
                {this.levels.map((level) => (
                    <limel-form-header
                        heading={`Heading level ${level}`}
                        headingLevel={level}
                    />
                ))}
            </Host>
        );
    }
}
