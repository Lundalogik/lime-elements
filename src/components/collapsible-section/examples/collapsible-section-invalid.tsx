import { Component, h, State } from '@stencil/core';

/**
 * Using the `invalid` prop
 * When a section's `invalid` prop is set to `true`, it can display a visual feedback,
 * as well as an accessible indication to the assistive technologies,
 * to indicate that the content inside the section is invalid.
 */

@Component({
    tag: 'limel-example-collapsible-section-invalid',
    shadow: true,
})
export class CollapsibleSectionInvalidExample {
    @State()
    private value: string;

    public render() {
        return (
            <limel-collapsible-section
                header="This section can become invalid"
                invalid={this.isInvalid()}
                isOpen={true}
            >
                <p>
                    Typing an invalid email address here would result in failing
                    the simple validation script, and accordingly will set the
                    section as invalid as well.
                </p>
                <limel-input-field
                    label="Field with custom validation"
                    placeholder="Type an email address here"
                    helperText={this.getHelperText()}
                    value={this.value}
                    onChange={this.onChange}
                    invalid={this.isInvalid()}
                />
                <p>
                    This way, if the collapsible section is closed, the user
                    will still get informed about potential problems or nested
                    invalid fields within the section.
                </p>
            </limel-collapsible-section>
        );
    }

    private onChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private isInvalid = () => {
        return !!(this.value && !this.value.endsWith('@test.com'));
    };

    private getHelperText = () => {
        if (this.isInvalid()) {
            return 'Please type a valid email address';
        }
    };
}
