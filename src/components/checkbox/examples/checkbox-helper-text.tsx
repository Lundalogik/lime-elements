import { Component, h } from '@stencil/core';

/**
 * With `helperText`
 *
 * Checkboxes can have a helper text, which is useful when providing additional information
 * can clarify functionality of the checkbox for the user.
 *
 * The helper text is displayed when user hovers the checkbox, or focuses on it using keyboard
 * navigation. However, on touchscreen devices, the helper text is always displayed.
 */

@Component({
    tag: 'limel-example-checkbox-helper-text',
    shadow: true,
})
export class CheckboxHelperTextExample {
    public render() {
        return (
            <section>
                <div>
                    <limel-checkbox
                        label="I accept terms of use"
                        helperText="You need to accept to be able to continue…"
                        id="terms"
                    />
                </div>
            </section>
        );
    }
}
