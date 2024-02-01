import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-boolean-checkboxes',
    shadow: true,
    styleUrl: 'switch-vs-checkbox.scss',
})
export class BooleanCheckboxesExample {
    public render() {
        return (
            <div class="do-dont-container">
                <div class="do">
                    <limel-header
                        heading="Example of boolean questions in a form"
                        subheading="using single checkboxes"
                    />
                    <div class="container">
                        <p> ···</p>
                        <limel-checkbox
                            label="Subscribe to our email newsletter"
                            helperText="By checking this field, you allow us to send you weekly emails."
                        />
                        <limel-checkbox
                            label="Make my profile publicly visible"
                            helperText="When your profile page is publicly visible, anyone of the internet can see the information you publish about yourself."
                        />
                    </div>
                </div>
            </div>
        );
    }
}
