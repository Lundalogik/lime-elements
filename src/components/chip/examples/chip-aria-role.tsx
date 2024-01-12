import { Component, h } from '@stencil/core';

/**
 * Correct usage of ARIA roles
 *
 * Chips represent choices, filters, or tags, organized in a block or bundled into a group.
 * While sighted users see the visually bundled group of chips in a well-designed UI,
 * screen reader users only hear the chip text, one at a time.
 * This can make it difficult for users of assistive technologies to understand
 * the context of the chip.
 *
 * To provide an accessible experience, it's important to place the chips in
 * a semantically correct structure, such as a list or a table,
 * or properly use ARIA roles on the chip and its container.
 *
 * In this example, we demonstrate how to use ARIA roles to improve accessibility for chips.
 * However, it's recommended to read up on the subject to fully understand the
 * implications of ARIA roles.
 *
 * For more information on ARIA roles, refer to the
 * [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles).
 */
@Component({
    tag: 'limel-example-chip-aria-role',
    shadow: true,
    styleUrl: 'limel-example-chip-aria-role.scss',
})
export class ChipAriaRoleExample {
    public render() {
        return (
            <div role="grid" aria-label="Filter bar" aria-colcount="3">
                <div role="rowgroup">
                    <div role="row">
                        <limel-chip
                            role="gridcell"
                            aria-colindex="1"
                            text="Age > 20"
                            removable={true}
                        />
                        <limel-chip
                            role="gridcell"
                            aria-colindex="2"
                            text="Gender = Female"
                            removable={true}
                        />
                        <limel-chip
                            role="gridcell"
                            aria-colindex="3"
                            text="Income > $3000 / mo."
                            removable={true}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
