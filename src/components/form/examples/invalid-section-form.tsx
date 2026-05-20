import { ValidationError, ValidationStatus } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';
import { isEqual } from 'lodash-es';
import {
    InvalidSectionFormData,
    schema,
    serverErrors,
} from './invalid-section-schema';

const createInitialFormData = (): InvalidSectionFormData => ({
    personal: {
        name: 'Bruce Wayne',
        email: '', // empty on purpose
    },
    work: {
        company: 'Wayne Enterprises',
        jobTitle: '', // empty on purpose, hidden behind a collapsed section
        startYear: 1939,
    },
    contacts: [
        { name: 'Alfred Pennyworth', phone: '+44 7700 900123' },
        { name: 'Lucius Fox', phone: '' }, // empty on purpose, inside a collapsed array item
    ],
});

/**
 * Visualizing errors in forms
 * Collapsible sections reflect the validity of their nested fields.
 *
 * The form is pre-filled the way the user would receive it from a backend:
 * most values present, but three required fields intentionally empty, for
 * example because those properties were made `required` after the
 * record was saved: `Email` in the first section, `Job title` in the
 * collapsed `Work` section, and `Phone` for the `Lucius Fox` entry in the
 * `Emergency contacts` array (whose item is also collapsed). Neither field
 * is flagged as invalid on load, to avoid pestering the user before they've
 * decided to save. The empty fields hidden behind a collapsed section or a
 * collapsed array item are the interesting ones; because the user can't see
 * them without expanding, which is why those headers need to surface the
 * problem too.
 *
 * As soon as the user changes any field, the `Save` button becomes
 * enabled. If the form has problems, the button shows an error icon
 * and a red background — but it stays clickable. Clicking it sets
 * `revealErrors` on `limel-form` to `true`, which lights up every
 * required-empty / invalid field and every section that contains one.
 * From there the user can follow the red thread to find what to fix.
 *
 * `Discard` resets both the data and `revealErrors`, so the form goes
 * silent again as if the page had just loaded.
 *
 * The toggle below also forces a server-side validation error on
 * `Email`, demonstrating the same behaviour driven by the `errors`
 * prop instead of by user interaction.
 *
 * @sourceFile invalid-section-schema.ts
 */
@Component({
    tag: 'limel-example-form-invalid-section',
    shadow: true,
    styleUrl: 'invalid-section-form.scss',
})
export class InvalidSectionFormExample {
    @State()
    private formData: InvalidSectionFormData = createInitialFormData();

    @State()
    private valid = false;

    @State()
    private revealErrors = false;

    @State()
    private withServerErrors = false;

    public render() {
        const errors: ValidationError | undefined = this.withServerErrors
            ? serverErrors
            : undefined;
        const dirty = !isEqual(this.formData, createInitialFormData());
        const hasProblems = !this.valid || this.withServerErrors;
        const saveLooksBroken = dirty && hasProblems;

        return (
            <Host>
                <limel-form
                    schema={schema}
                    value={this.formData}
                    errors={errors}
                    revealErrors={this.revealErrors}
                    onChange={this.handleFormChange}
                    onValidate={this.handleFormValidate}
                />
                <footer>
                    <limel-button
                        label="Discard"
                        disabled={!dirty}
                        onClick={this.handleDiscard}
                    />
                    <limel-button
                        id="invalid-section-save"
                        class={{ 'save-has-errors': saveLooksBroken }}
                        label="Save"
                        primary={true}
                        icon={saveLooksBroken ? 'error' : undefined}
                        disabled={!dirty}
                        onClick={this.handleSave}
                    />
                    {this.renderSaveTooltip(saveLooksBroken)}
                </footer>
                <limel-example-controls>
                    <limel-checkbox
                        label="Simulate a server-side error on Email"
                        checked={this.withServerErrors}
                        onChange={this.handleToggleServerErrors}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private renderSaveTooltip(show: boolean) {
        if (!show) {
            return null;
        }

        return (
            <limel-tooltip
                elementId="invalid-section-save"
                label="Form has errors. Click to reveal."
            />
        );
    }

    private handleFormChange = (event: CustomEvent<InvalidSectionFormData>) => {
        this.formData = event.detail;
    };

    private handleFormValidate = (event: CustomEvent<ValidationStatus>) => {
        this.valid = event.detail.valid;
    };

    private handleToggleServerErrors = (event: CustomEvent<boolean>) => {
        this.withServerErrors = event.detail;
    };

    private handleSave = () => {
        const hasProblems = !this.valid || this.withServerErrors;
        if (hasProblems) {
            this.revealErrors = true;

            return;
        }

        const json = JSON.stringify(this.formData, null, '    ');
        alert(`Saving:\n\n${json}`);
        this.revealErrors = false;
    };

    private handleDiscard = () => {
        this.formData = createInitialFormData();
        this.revealErrors = false;
    };
}
