import { render, h } from '@stencil/vitest';
import { vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import {
    stringSchema,
    numberSchema,
    booleanSchema,
    enumSchema,
    requiredFieldSchema,
    twoRequiredFieldsSchema,
    emailFormatSchema,
    optionalOneOfSchema,
    selectWithOptionMetadataSchema,
    multiSelectWithOptionMetadataSchema,
    arraySchema,
    nestedObjectSchema,
    arrayOfObjectsSchema,
    arrayOfObjectsSchemaWithRequired,
    dynamicSchema,
    dynamicSchemaUpdated,
    helpSchema,
    arrayHelpSchema,
    arrayOfObjectsHelpSchema,
    gridLayoutSchema,
    collapsibleSchema,
    collapsibleSchemaWithRequired,
    dateSchema,
    integerSchema,
    serverErrorsSchema,
    transformErrorsSchema,
    customComponentSchema,
    undefinedComponentSchema,
    emptySchema,
    hiddenFieldSchema,
    readOnlyFieldSchema,
    arrayMaxItemsSchema,
    arrayItemControlsSchema,
    rowLayoutSchema,
    rowLayoutWithCustomComponentSchema,
    nestedArrayObjectSchema,
    topLevelStringCustomComponentSchema,
    nestedStringCustomComponentSchema,
    arrayItemWithDependenciesSchema,
    arrayItemWithDependenciesAndCustomConfigSchema,
    nestedSchemaPathSchema,
    nestedLayoutSchemaPathSchema,
    stringWithDefaultCustomComponentSchema,
    getConditionalCustomComponentSchema,
    arrayItemWithEnumAndDefaultSchema,
    requiredCheckboxSchema,
    nestedTitlesSchema,
    nestedCollapsibleSchema,
    untitledCollapsibleSchema,
    titledRowLayoutSchema,
    untitledRootSchema,
    untitledRowSchema,
} from './form.test-schemas';

const fieldTypeTests = [
    {
        name: 'string',
        schema: stringSchema,
        element: 'limel-input-field',
        label: 'Name',
    },
    {
        name: 'number',
        schema: numberSchema,
        element: 'limel-input-field',
        label: 'Age',
    },
    {
        name: 'boolean',
        schema: booleanSchema,
        element: 'limel-checkbox',
        label: 'Active',
    },
    {
        name: 'enum',
        schema: enumSchema,
        element: 'limel-select',
        label: 'Color',
    },
    {
        name: 'date',
        schema: dateSchema,
        element: 'limel-date-picker',
        label: 'Birthday',
    },
    {
        name: 'integer',
        schema: integerSchema,
        element: 'limel-input-field',
        label: 'Count',
    },
];

test.each(fieldTypeTests)(
    'renders $element for $name schema',
    async ({ schema, element, label }) => {
        const { formContent } = await renderForm({ schema });
        const rendered = formContent.querySelector(element);
        expect(rendered).toBeTruthy();
        expect(rendered.getAttribute('label')).toEqual(label);
    }
);

test('emits change event with updated form data', async () => {
    const onChange = vi.fn();
    const { change } = await renderForm({
        schema: stringSchema,
        onChange,
    });

    await change('Name', 'Alice');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].detail).toEqual({ name: 'Alice' });
});

test('does not auto-select a const from an optional oneOf, but keeps real defaults', async () => {
    const onChange = vi.fn();
    const { change } = await renderForm({
        schema: optionalOneOfSchema,
        onChange,
    });

    await change('Name', 'Alice');

    // `choice` is an optional oneOf and must stay empty (the user can leave it
    // blank), while `withDefault` still gets its declared default applied.
    expect(onChange.mock.lastCall[0].detail).toEqual({
        name: 'Alice',
        withDefault: 'preset',
    });
});

test('maps icon, description and readOnly of a `oneOf` onto select options', async () => {
    const { formContent } = await renderForm({
        schema: selectWithOptionMetadataSchema,
    });

    const select: HTMLLimelSelectElement =
        formContent.querySelector('limel-select');

    expect(select.options).toEqual([
        {
            text: 'A',
            value: 'a',
            secondaryText: 'The first option',
            icon: 'check',
            disabled: false,
        },
        {
            text: 'B',
            value: 'b',
            secondaryText: undefined,
            icon: { name: 'lock', color: 'grey' },
            disabled: true,
        },
        {
            text: 'C',
            value: 'c',
            secondaryText: undefined,
            icon: undefined,
            disabled: false,
        },
    ]);
});

test('maps icon, description and readOnly of an `anyOf` onto multi select options', async () => {
    const { formContent } = await renderForm({
        schema: multiSelectWithOptionMetadataSchema,
    });

    const select: HTMLLimelSelectElement =
        formContent.querySelector('limel-select');

    expect(select.multiple).toBe(true);
    expect(select.options).toEqual([
        {
            text: 'A',
            value: 'a',
            secondaryText: 'The first option',
            icon: 'check',
            disabled: false,
        },
        {
            text: 'B',
            value: 'b',
            secondaryText: undefined,
            icon: { name: 'lock', color: 'grey' },
            disabled: true,
        },
    ]);
});

test('keeps the icon on the selected option, so the trigger can render it', async () => {
    const { formContent } = await renderForm({
        schema: selectWithOptionMetadataSchema,
        value: { choice: 'a' },
    });

    const select: HTMLLimelSelectElement =
        formContent.querySelector('limel-select');

    expect(select.value).toEqual({
        text: 'A',
        value: 'a',
        secondaryText: 'The first option',
        icon: 'check',
        disabled: false,
    });
});

const validationTests = [
    {
        name: 'required field with empty value',
        schema: requiredFieldSchema,
        validValue: { name: 'valid' },
        invalidValue: {},
        expectedErrorKeyword: 'required',
    },
    {
        name: 'email format with invalid value',
        schema: emailFormatSchema,
        validValue: { email: 'valid@example.com' },
        invalidValue: { email: 'not-an-email' },
        expectedErrorKeyword: 'format',
    },
];

test.each(validationTests)(
    'emits validate event with errors for $name',
    async ({ schema, validValue, invalidValue, expectedErrorKeyword }) => {
        const onValidate = vi.fn();
        const { root, waitForChanges, setProps } = await renderForm({
            schema,
            value: validValue,
            onValidate,
        });

        await setProps({ value: invalidValue });
        await waitForReactRender(root, waitForChanges);

        expect(onValidate).toHaveBeenCalled();
        const detail = onValidate.mock.lastCall[0].detail;
        expect(detail.valid).toBe(false);
        expect(detail.errors.length).toBe(1);
        expect(detail.errors[0].name).toBe(expectedErrorKeyword);
    }
);

test('emits validate with valid=false on mount when value is invalid', async () => {
    const onValidate = vi.fn();
    await renderForm({
        schema: requiredFieldSchema,
        value: {},
        onValidate,
    });

    expect(onValidate).toHaveBeenCalled();
    const detail = onValidate.mock.lastCall[0].detail;
    expect(detail.valid).toBe(false);
    expect(detail.errors.length).toBeGreaterThan(0);
    expect(detail.errors[0].name).toBe('required');
});

test('does not emit validate on mount when value is already valid', async () => {
    const onValidate = vi.fn();
    await renderForm({
        schema: requiredFieldSchema,
        value: { name: 'Alice' },
        onValidate,
    });

    const validCalls = onValidate.mock.calls.filter(
        (call) => call[0].detail.valid === true
    );
    expect(validCalls).toEqual([]);
});

test('does not flag untouched required-empty fields by default', async () => {
    const { formContent } = await renderForm({
        schema: twoRequiredFieldsSchema,
        value: {},
    });

    const inputs = formContent.querySelectorAll('limel-input-field');
    expect([...inputs].every((el: any) => el.invalid === false)).toBe(true);
});

test('flags untouched required-empty siblings when `revealErrors` is set to true', async () => {
    const { formContent, change, root, waitForChanges, setProps } =
        await renderForm({
            schema: twoRequiredFieldsSchema,
            value: {},
        });

    // A change first, so RJSF has propagated its per-field error state.
    await change('Name', 'Alice');
    await setProps({ revealErrors: true });
    await waitForReactRender(root, waitForChanges);

    const nickname = [
        ...formContent.querySelectorAll('limel-input-field'),
    ].find((el) => el.getAttribute('label') === 'Nickname') as any;

    expect(nickname.invalid).toBe(true);
});

test('unflags untouched required-empty siblings when `revealErrors` is reset', async () => {
    const { formContent, change, root, waitForChanges, setProps } =
        await renderForm({
            schema: twoRequiredFieldsSchema,
            value: {},
            revealErrors: true,
        });

    await change('Name', 'Alice');
    await setProps({ revealErrors: false, value: {} });
    await waitForReactRender(root, waitForChanges);

    const nickname = [
        ...formContent.querySelectorAll('limel-input-field'),
    ].find((el) => el.getAttribute('label') === 'Nickname') as any;

    expect(nickname.invalid).toBe(false);
});

test('validates against new schema after schema changes at runtime', async () => {
    const onValidate = vi.fn();
    const { root, waitForChanges, setProps } = await renderForm({
        schema: stringSchema,
        value: { name: 'Alice' },
        onValidate,
    });

    await setProps({ schema: requiredFieldSchema, value: {} });
    await waitForReactRender(root, waitForChanges);

    expect(onValidate).toHaveBeenCalled();
    const detail = onValidate.mock.lastCall[0].detail;
    expect(detail.valid).toBe(false);
    expect(detail.errors[0].name).toBe('required');
});

test('validates against new content when schema changes but $id stays the same', async () => {
    // Two schemas sharing an $id but differing in content must be treated
    // as distinct by the validator — otherwise a cached validator from
    // the first schema would reject the second schema's properties as
    // additional.
    const emptySchema = {
        $id: 'shared-id',
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
    };
    const schemaWithName = {
        $id: 'shared-id',
        type: 'object',
        properties: { name: { type: 'string', title: 'Name' } },
        required: ['name'],
        additionalProperties: false,
    };

    const onValidate = vi.fn();
    const { root, waitForChanges, setProps } = await renderForm({
        schema: emptySchema,
        value: {},
        onValidate,
    });

    // Swap to a schema that requires a property the value doesn't yet have.
    await setProps({ schema: schemaWithName, value: {} });
    await waitForReactRender(root, waitForChanges);

    const invalidDetail = onValidate.mock.lastCall[0].detail;
    expect(invalidDetail.valid).toBe(false);
    expect(invalidDetail.errors[0].name).toBe('required');

    // Provide the required value — should now validate.
    await setProps({ schema: schemaWithName, value: { name: 'hello' } });
    await waitForReactRender(root, waitForChanges);

    const validDetail = onValidate.mock.lastCall[0].detail;
    expect(validDetail.valid).toBe(true);
    expect(validDetail.errors).toEqual([]);
});

test('renders disabled fields when disabled prop is set', async () => {
    const { formContent } = await renderForm({
        schema: stringSchema,
        disabled: true,
    });

    const inputField = formContent.querySelector('limel-input-field');
    expect(inputField).toBeTruthy();
    expect(inputField.getAttribute('disabled')).not.toBeNull();
});

test('renders array items with add button', async () => {
    const { formContent } = await renderForm({
        schema: arraySchema,
        value: { tags: ['first'] },
    });

    const inputField = formContent.querySelector('limel-input-field');
    expect(inputField).toBeTruthy();
    expect(inputField.getAttribute('value')).toEqual('first');

    const addButton = formContent.querySelector('limel-button.button-add-new');
    expect(addButton).toBeTruthy();
});

test('renders nested object fields', async () => {
    const { formContent } = await renderForm({
        schema: nestedObjectSchema,
    });

    const inputFields = formContent.querySelectorAll('limel-input-field');
    expect(inputFields.length).toBe(2);

    const labels = [...inputFields].map((el) => el.getAttribute('label'));
    expect(labels).toContain('Street');
    expect(labels).toContain('City');
});

test('draws the titles smaller and lighter the deeper they are', async () => {
    const { formContent } = await renderForm({ schema: nestedTitlesSchema });

    expect(headingStyle(formContent, 'Form')).toEqual({
        fontSize: '23.616px',
        fontWeight: '800',
        hasBar: false,
    });
    expect(headingStyle(formContent, 'Section')).toEqual({
        fontSize: '22.128px',
        fontWeight: '700',
        hasBar: true,
    });
    expect(headingStyle(formContent, 'Subsection')).toEqual({
        fontSize: '20.736px',
        fontWeight: '600',
        hasBar: false,
    });
});

test('gives the titles heading levels that follow how deep they are', async () => {
    const { formContent } = await renderForm({ schema: nestedTitlesSchema });

    expect(findHeading(formContent, 'Form').localName).toBe('h1');
    expect(findHeading(formContent, 'Section').localName).toBe('h2');
    expect(findHeading(formContent, 'Subsection').localName).toBe('h3');
    expect(findHeading(formContent, 'List').localName).toBe('h2');
});

test('starts the heading levels at the heading level of the form', async () => {
    const { formContent } = await renderForm({
        schema: nestedTitlesSchema,
        headingLevel: 3,
    });

    expect(findHeading(formContent, 'Form').localName).toBe('h3');
    expect(findHeading(formContent, 'Section').localName).toBe('h4');
    expect(findHeading(formContent, 'Subsection').localName).toBe('h5');
});

test('starts the heading levels at the heading level of the form when it has no title', async () => {
    const { formContent } = await renderForm({
        schema: untitledRootSchema,
        headingLevel: 3,
    });

    expect(findHeading(formContent, 'Section').localName).toBe('h3');
});

test('warns and starts the heading levels at h1 when the heading level is not from 1 to 6', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { formContent } = await renderForm({
        schema: nestedTitlesSchema,
        headingLevel: 7,
    });

    expect(findHeading(formContent, 'Form').localName).toBe('h1');
    expect(warn).toHaveBeenCalledTimes(1);

    warn.mockRestore();
});

test('warns when the heading level changes to one that is not from 1 to 6', async () => {
    const { setProps, waitForChanges } = await renderForm({
        schema: nestedTitlesSchema,
    });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await setProps({ headingLevel: 0 });
    await waitForChanges();

    expect(warn).toHaveBeenCalledTimes(1);

    warn.mockRestore();
});

test('draws no heading below h6', async () => {
    const { formContent } = await renderForm({
        schema: nestedTitlesSchema,
        headingLevel: 6,
    });

    expect(findHeading(formContent, 'Form').localName).toBe('h6');
    expect(findHeading(formContent, 'Subsection').localName).toBe('h6');
});

test('draws the headings again when the heading level changes', async () => {
    const { formContent, setProps, waitForChanges } = await renderForm({
        schema: nestedTitlesSchema,
    });

    await setProps({ headingLevel: 2 });
    await waitForChanges();

    expect(findHeading(formContent, 'Form').localName).toBe('h2');
    expect(findHeading(formContent, 'Section').localName).toBe('h3');
});

test('gives the title of a row the heading level of a section in the same place', async () => {
    const { formContent } = await renderForm({ schema: titledRowLayoutSchema });

    expect(findHeading(formContent, 'Form').localName).toBe('h1');
    expect(findHeading(formContent, 'First').localName).toBe('h2');
    expect(findHeading(formContent, 'Second').localName).toBe('h2');
});

test('starts the heading levels at h1 when the form has no title', async () => {
    const { formContent } = await renderForm({ schema: untitledRootSchema });

    expect(findHeading(formContent, 'Section').localName).toBe('h1');
});

test('counts a collapsible item of a list as a heading level', async () => {
    const { formContent, waitForChanges } = await renderForm({
        schema: nestedArrayObjectSchema,
        value: { people: [{}] },
    });
    await waitForChanges();

    expect(findHeading(formContent, 'People').localName).toBe('h1');
    expect(findSectionHeading(formContent, 'New item').localName).toBe('h2');
    expect(findHeading(formContent, 'Address').localName).toBe('h3');
});

test('gives a collapsible section the heading level of its depth', async () => {
    const { formContent, waitForChanges } = await renderForm({
        schema: nestedCollapsibleSchema,
    });
    await waitForChanges();

    expect(findHeading(formContent, 'Form').localName).toBe('h1');
    expect(findSectionHeading(formContent, 'Details').localName).toBe('h2');
    expect(findSectionHeading(formContent, 'Address').localName).toBe('h3');
    expect(findHeading(formContent, 'Position').localName).toBe('h4');
});

test('does not count a collapsible section without a title as a heading level', async () => {
    const { formContent } = await renderForm({
        schema: untitledCollapsibleSchema,
    });

    expect(findHeading(formContent, 'Section').localName).toBe('h2');
});

test('starts the collapsible sections at h1 when the form has no title', async () => {
    const { formContent, waitForChanges } = await renderForm({
        schema: collapsibleSchema,
    });
    await waitForChanges();

    expect(findSectionHeading(formContent, 'Details').localName).toBe('h1');
});

test('starts the collapsible sections at the heading level of the form', async () => {
    const { formContent, waitForChanges } = await renderForm({
        schema: collapsibleSchema,
        headingLevel: 3,
    });
    await waitForChanges();

    expect(findSectionHeading(formContent, 'Details').localName).toBe('h3');
});

test('draws no heading for the row of a field without a title', async () => {
    const { formContent } = await renderForm({ schema: untitledRowSchema });

    const emptyHeadings = [
        ...formContent.querySelectorAll('h1, h2, h3, h4, h5, h6'),
    ].filter((heading) => !heading.textContent);

    expect(emptyHeadings).toHaveLength(0);
});

test('keeps the fields when the title of the form is removed', async () => {
    const { formContent, root, waitForChanges, setProps } = await renderForm({
        schema: nestedTitlesSchema,
    });
    const field = formContent.querySelector('limel-input-field');

    await setProps({ schema: { ...nestedTitlesSchema, title: undefined } });
    await waitForReactRender(root, waitForChanges);

    expect(formContent.querySelector('limel-input-field')).toBe(field);
});

test('draws the title of a list like the title of a section', async () => {
    const { formContent } = await renderForm({ schema: nestedTitlesSchema });

    expect(headingStyle(formContent, 'List')).toEqual(
        headingStyle(formContent, 'Section')
    );
});

test('renders array of objects as collapsible items', async () => {
    const { formContent } = await renderForm({
        schema: arrayOfObjectsSchema,
        value: { heroes: [{ name: 'Batman' }] },
    });

    const collapsible = formContent.querySelector('limel-collapsible-section');
    expect(collapsible).toBeTruthy();
    expect(collapsible.getAttribute('header')).toContain('Batman');
});

test('renders new fields when schema changes at runtime', async () => {
    const { formContent, root, waitForChanges, setProps } = await renderForm({
        schema: dynamicSchema,
    });

    let inputFields = formContent.querySelectorAll('limel-input-field');
    expect(inputFields.length).toBe(1);

    await setProps({ schema: dynamicSchemaUpdated });
    await waitForReactRender(root, waitForChanges);

    inputFields = formContent.querySelectorAll('limel-input-field');
    expect(inputFields.length).toBe(2);

    const labels = [...inputFields].map((el) => el.getAttribute('label'));
    expect(labels).toContain('Email');
});

test('renders a field that a change adds to the schema, even when it has a default', async () => {
    const onChange = vi.fn();
    const { formContent, root, waitForChanges, setProps } = await renderForm({
        schema: getConditionalCustomComponentSchema({}),
        value: {},
        onChange,
    });

    changeField(formContent, 'Trigger', 'show');
    await waitForChanges();

    // Answer the `change` event with the value the form emitted, and a schema
    // built from it, the way a form with a dynamic schema does.
    const emitted = onChange.mock.lastCall[0].detail;
    await setProps({
        value: emitted,
        schema: getConditionalCustomComponentSchema(emitted),
    });
    await waitForReactRender(root, waitForChanges);

    expect(formContent.querySelector('limel-color-picker')).toBeTruthy();
});

test('opens a newly added array item whose schema fills in defaults', async () => {
    const { formContent, root, waitForChanges } = await renderForm({
        schema: arrayItemWithEnumAndDefaultSchema,
        value: {},
    });

    const addButton = formContent.querySelector(
        'limel-button.button-add-new'
    ) as HTMLElement;
    addButton.click();
    await waitForReactRender(root, waitForChanges);

    const section: any = formContent.querySelector('limel-collapsible-section');
    expect(section).toBeTruthy();
    expect(section.isOpen).toBe(true);
});

test('keeps a required checkbox unanswered until the user ticks it', async () => {
    const onChange = vi.fn();
    const onValidate = vi.fn();
    await renderForm({
        schema: requiredCheckboxSchema,
        value: {},
        onChange,
        onValidate,
    });

    // `@rjsf/core` 6.9 started filling a required boolean with `false`, which
    // would satisfy `required` without the user answering the question.
    expect(onChange).not.toHaveBeenCalled();
    expect(onValidate.mock.lastCall[0].detail.valid).toBe(false);
});

test('renders help icons when schema has lime.help', async () => {
    const { formContent } = await renderForm({
        schema: helpSchema,
    });

    const help = formContent.querySelector('limel-help');
    expect(help).toBeTruthy();
});

test('renders help on an array of simple items when the schema has lime.help', async () => {
    const { formContent } = await renderForm({
        schema: arrayHelpSchema,
        value: { tags: ['first', 'second'] },
    });

    const helps = formContent.querySelectorAll('limel-help');
    expect(helps).toHaveLength(1);
    expect(helps[0].value).toEqual('Words that describe the post');
});

test('renders help once on an array of objects, whatever the number of items', async () => {
    const { formContent } = await renderForm({
        schema: arrayOfObjectsHelpSchema,
        value: { heroes: [{ name: 'Batman' }, { name: 'Robin' }] },
    });

    const helps = formContent.querySelectorAll('limel-help');
    expect(helps).toHaveLength(1);
    expect(helps[0].value).toEqual('The heroes of the team');
});

test('renders no help on an array when the schema has no lime.help', async () => {
    const { formContent } = await renderForm({
        schema: arrayOfObjectsSchema,
        value: { heroes: [{ name: 'Batman' }] },
    });

    expect(formContent.querySelector('limel-help')).toBeNull();
});

test('renders grid layout when schema has lime.layout.type grid', async () => {
    const { formContent } = await renderForm({
        schema: gridLayoutSchema,
    });

    const grid = formContent.querySelector('.limel-form-layout--grid');
    expect(grid).toBeTruthy();

    const inputFields = grid.querySelectorAll('limel-input-field');
    expect(inputFields.length).toBe(2);
});

test('emits data-schema-path on each layout wrapper', async () => {
    const { formContent } = await renderForm({
        schema: nestedSchemaPathSchema,
    });

    const paths = [
        ...formContent.querySelectorAll(
            '.limel-form-layout--default[data-schema-path]'
        ),
    ].map((el) => el.dataset.schemaPath);

    expect(paths).toEqual([
        '/',
        '/section',
        '/section/details',
        '/section/details/contact',
    ]);
});

test('emits data-schema-path on each field wrapper', async () => {
    const { formContent } = await renderForm({
        schema: nestedSchemaPathSchema,
    });

    const field = formContent.querySelector<HTMLElement>(
        '[data-schema-path="/section/details/contact/name"]'
    );

    expect(field).toBeTruthy();
    expect(field.querySelector('limel-input-field')).toBeTruthy();
    expect(
        formContent.querySelector('.rjsf-field[data-schema-path="/section"]')
    ).toBeNull();
});

test('highlightedField opens the collapsed section a field is in and focuses it', async () => {
    const { root, formContent } = await renderForm({
        schema: collapsibleSchema,
        highlightedField: ['details', 'info'],
    });

    await vi.waitFor(() => expect(focusedLabel(root)).toBe('Info'));
    expect(formContent.querySelector('limel-collapsible-section').isOpen).toBe(
        true
    );
});

test('highlightedField opens the collapsed list item a field is in', async () => {
    const { root, formContent, setProps } = await renderForm({
        schema: arrayOfObjectsSchema,
        value: { heroes: [{ name: 'Batman' }, { name: 'Robin' }] },
    });
    const items = formContent.querySelectorAll('limel-collapsible-section');
    expect(formContent.querySelector('limel-input-field')).toBeNull();

    await setProps({ highlightedField: ['heroes', 1, 'name'] });

    await vi.waitFor(() => {
        const focused = root.shadowRoot
            .activeElement as HTMLLimelInputFieldElement;
        expect(focused?.value).toBe('Robin');
    });
    expect([...items].map((item) => item.isOpen)).toEqual([false, true]);
});

test('highlightedField shows the closest field above a path the form cannot show', async () => {
    const { root } = await renderForm({
        schema: collapsibleSchema,
        highlightedField: ['details', 'info', 'deeper'],
    });

    await vi.waitFor(() => expect(focusedLabel(root)).toBe('Info'));
});

test('highlightedField shows an object field that a custom component draws', async () => {
    const { root } = await renderForm({
        schema: {
            type: 'object',
            properties: {
                card: {
                    type: 'object',
                    title: 'Card',
                    properties: { title: { type: 'string' } },
                    lime: { component: { name: 'limel-input-field' } },
                },
            },
        },
        highlightedField: ['card', 'title'],
    });

    await vi.waitFor(() =>
        expect(root.shadowRoot.activeElement?.tagName).toBe('LIMEL-INPUT-FIELD')
    );
});

test('highlightedField shows a free-form object that the code editor draws', async () => {
    const { root, formContent } = await renderForm({
        schema: {
            type: 'object',
            properties: {
                meta: {
                    type: 'object',
                    title: 'Meta',
                    additionalProperties: true,
                },
            },
        },
        highlightedField: ['meta', 'anything'],
    });

    const meta = formContent.querySelector('[data-schema-path="/meta"]');
    expect(meta.querySelector('limel-code-editor')).toBeTruthy();
    await vi.waitFor(() =>
        expect(meta.classList).toContain('limel-form-field--highlighted')
    );
    expect(root.shadowRoot.activeElement?.tagName).toBe('LIMEL-CODE-EDITOR');
});

test('highlightedField waits for a schema given at the same time', async () => {
    const { root, setProps } = await renderForm({ schema: stringSchema });

    await setProps({
        schema: collapsibleSchema,
        highlightedField: ['details', 'info'],
    });

    await vi.waitFor(() => expect(focusedLabel(root)).toBe('Info'));
});

test('highlightedField does nothing for a path the form does not have', async () => {
    const { root } = await renderForm({
        schema: collapsibleSchema,
        highlightedField: ['missing'],
    });

    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(root.shadowRoot.activeElement).toBeNull();
});

test('highlightedField highlights the field', async () => {
    const { formContent } = await renderForm({
        schema: stringSchema,
        highlightedField: ['name'],
    });
    const field = formContent.querySelector<HTMLElement>(
        '[data-schema-path="/name"]'
    );

    await vi.waitFor(() =>
        expect(field.classList).toContain('limel-form-field--highlighted')
    );
});

test('highlightedField shows an equal path again only after it was cleared', async () => {
    const { root, setProps } = await renderForm({
        schema: stringSchema,
        highlightedField: ['name'],
    });
    await vi.waitFor(() => expect(focusedLabel(root)).toBe('Name'));
    const blur = () => (root.shadowRoot.activeElement as HTMLElement).blur();

    blur();
    await setProps({ highlightedField: ['name'] });
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(root.shadowRoot.activeElement).toBeNull();

    await setProps({ highlightedField: undefined });
    await setProps({ highlightedField: ['name'] });
    await vi.waitFor(() => expect(focusedLabel(root)).toBe('Name'));
});

test('emits data-schema-path on grid and row layout wrappers', async () => {
    const { formContent } = await renderForm({
        schema: nestedLayoutSchemaPathSchema,
    });

    expect(
        formContent.querySelector<HTMLElement>('.limel-form-layout--grid')
            ?.dataset.schemaPath
    ).toBe('/grid');
    expect(
        formContent.querySelector<HTMLElement>('.limel-form-row--layout')
            ?.dataset.schemaPath
    ).toBe('/row');
});

test('renders collapsible section when schema has lime.collapsible', async () => {
    const { formContent } = await renderForm({
        schema: collapsibleSchema,
    });

    const collapsible = formContent.querySelector('limel-collapsible-section');
    expect(collapsible).toBeTruthy();
    expect(collapsible.getAttribute('header')).toEqual('Details');
});

test('does not mark collapsible section as invalid when all nested fields are valid', async () => {
    const { formContent } = await renderForm({
        schema: collapsibleSchema,
        value: { details: { info: 'ok' } },
        revealErrors: true,
    });

    const collapsible = formContent.querySelector('limel-collapsible-section');
    expect(collapsible.invalid).toBe(false);
});

test('keeps collapsible section silent until `revealErrors` is true, even with server errors', async () => {
    const { formContent, root, waitForChanges, setProps } = await renderForm({
        schema: collapsibleSchema,
        value: { details: { info: 'value' } },
        errors: { details: { info: ['Something is wrong'] } },
    });

    const collapsible = formContent.querySelector('limel-collapsible-section');
    expect(collapsible.invalid).toBe(false);

    await setProps({ revealErrors: true });
    await waitForReactRender(root, waitForChanges);

    expect(collapsible.invalid).toBe(true);
});

test('marks collapsible section as invalid when a nested field fails schema validation and `revealErrors` is true', async () => {
    const { formContent, change, root, waitForChanges, setProps } =
        await renderForm({
            schema: collapsibleSchemaWithRequired,
            value: { details: { info: 'something' } },
        });

    await change('Info', '');
    await setProps({ revealErrors: true });
    await waitForReactRender(root, waitForChanges);

    const collapsible = formContent.querySelector('limel-collapsible-section');
    expect(collapsible.invalid).toBe(true);
});

test('marks a collapsed array-of-objects item as invalid when it contains errors and `revealErrors` is true', async () => {
    // Both items stay collapsed because their data is non-empty, so the
    // invalid field inside the second item is never rendered. The header
    // must still surface the problem, which it can only do by reading the
    // `errorSchema` rather than walking its (unrendered) children.
    const { formContent, root, waitForChanges, setProps } = await renderForm({
        schema: arrayOfObjectsSchemaWithRequired,
        value: { heroes: [{ name: 'Batman' }, { name: 'Robin' }] },
        errors: { heroes: { 1: { name: ['This hero is already taken'] } } },
    });

    const items = formContent.querySelectorAll('limel-collapsible-section');
    expect(items.length).toBe(2);

    // Silent until errors are revealed, even though item 2 has an error.
    expect((items[1] as any).invalid).toBe(false);

    await setProps({ revealErrors: true });
    await waitForReactRender(root, waitForChanges);

    // The invalid item reflects the error on its still-collapsed header,
    // while the valid item stays silent.
    expect((items[0] as any).invalid).toBe(false);
    expect((items[1] as any).invalid).toBe(true);
});

test('renders custom component when schema has lime.component', async () => {
    const { formContent } = await renderForm({
        schema: customComponentSchema,
    });

    const switchEl = formContent.querySelector('limel-switch');
    expect(switchEl).toBeTruthy();

    const checkbox = formContent.querySelector('limel-checkbox');
    expect(checkbox).toBeNull();
});

test('falls back to default widget when custom component is not defined', async () => {
    const { formContent } = await renderForm({
        schema: undefinedComponentSchema,
    });

    const input = formContent.querySelector('limel-input-field');
    expect(input).toBeTruthy();
    expect(input.getAttribute('label')).toEqual('Field');
});

test('hides drag handle and remove button when array item controls are disabled', async () => {
    const { formContent } = await renderForm({
        schema: arrayItemControlsSchema,
        value: { items: ['one', 'two'] },
    });

    const dragHandle = formContent.querySelector('limel-drag-handle');
    const removeButton = formContent.querySelector(
        ':scope .array-item limel-icon-button[icon="trash"]'
    );
    expect(dragHandle).toBeNull();
    expect(removeButton).toBeNull();
});

test('reorders array items when an item is dragged by its drag handle', async () => {
    const onChange = vi.fn();
    const { formContent } = await renderForm({
        schema: arraySchema,
        value: { tags: ['one', 'two', 'three'] },
        onChange,
    });
    const [first, , third] = formContent.querySelectorAll<HTMLElement>(
        ':scope .array-items > .array-item'
    );

    await userEvent.dragAndDrop(
        first.querySelector(':scope [data-drag-handle]'),
        third
    );

    await vi.waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.lastCall[0].detail).toEqual({
        tags: ['two', 'three', 'one'],
    });
});

test('displays server errors passed via errors prop', async () => {
    const { formContent } = await renderForm({
        schema: serverErrorsSchema,
        value: { name: 'test' },
        errors: { name: ['Name is already taken'] },
    });

    const inputField = formContent.querySelector('limel-input-field');
    expect(inputField).toBeTruthy();
    expect(inputField.getAttribute('helper-text')).toContain(
        'Name is already taken'
    );
});

test('emits valid=false when server errors are present', async () => {
    const onValidate = vi.fn();
    await renderForm({
        schema: serverErrorsSchema,
        value: { name: 'test' },
        errors: { name: ['Name is already taken'] },
        onValidate,
    });

    expect(onValidate).toHaveBeenCalled();
    const detail = onValidate.mock.lastCall[0].detail;
    expect(detail.valid).toBe(false);
});

test('passes validation errors through transformErrors', async () => {
    const transformErrors = vi.fn((errors) =>
        errors.map((e) => ({
            ...e,
            message: e.name === 'pattern' ? 'Custom message' : e.message,
        }))
    );

    const { change } = await renderForm({
        schema: transformErrorsSchema,
        value: { code: 'ABC' },
        transformErrors,
    });

    await change('Code', 'abc');

    const errors = transformErrors.mock.results.at(-1).value;
    expect(errors).toContainEqual(
        expect.objectContaining({ name: 'pattern', message: 'Custom message' })
    );
});

test('renders without crashing when schema has no properties', async () => {
    const { formContent } = await renderForm({ schema: emptySchema });
    expect(formContent).toBeTruthy();
    expect(formContent.querySelector('limel-input-field')).toBeNull();
});

test('renders without crashing when value is null', async () => {
    const { formContent } = await renderForm({
        schema: stringSchema,
        value: null,
    });
    expect(formContent).toBeTruthy();
});

test('does not render hidden fields', async () => {
    const { formContent } = await renderForm({
        schema: hiddenFieldSchema,
    });

    const inputFields = formContent.querySelectorAll('limel-input-field');
    expect(inputFields.length).toBe(1);
    expect(inputFields[0].getAttribute('label')).toEqual('Visible');
});

test('renders readonly fields as readonly', async () => {
    const { formContent } = await renderForm({
        schema: readOnlyFieldSchema,
        value: { locked: 'cannot edit' },
    });

    const inputField = formContent.querySelector('limel-input-field');
    expect(inputField).toBeTruthy();
    expect(inputField.getAttribute('readonly')).not.toBeNull();
});

test('hides add button when array is at maxItems', async () => {
    const { formContent } = await renderForm({
        schema: arrayMaxItemsSchema,
        value: { tags: ['one', 'two'] },
    });

    const addButton = formContent.querySelector('limel-button.button-add-new');
    expect(addButton).toBeNull();
});

test('shows add button for empty array', async () => {
    const { formContent } = await renderForm({
        schema: arraySchema,
        value: { tags: [] },
    });

    const addButton = formContent.querySelector('limel-button.button-add-new');
    expect(addButton).toBeTruthy();

    const items = formContent.querySelectorAll('limel-input-field');
    expect(items.length).toBe(0);
});

test('ignores extra properties in value not defined in schema', async () => {
    const { formContent } = await renderForm({
        schema: stringSchema,
        value: { name: 'Alice', unknown: 'ignored' },
    });

    const inputFields = formContent.querySelectorAll('limel-input-field');
    expect(inputFields.length).toBe(1);
    expect(inputFields[0].getAttribute('label')).toEqual('Name');
});

test('renders row layout with suppressed field labels and descriptions', async () => {
    const { formContent } = await renderForm({
        schema: rowLayoutSchema,
        value: { first: 'hello', second: 'world' },
    });

    const rowLayout = formContent.querySelector('.limel-form-row--layout');
    expect(rowLayout).toBeTruthy();

    const rows = rowLayout.querySelectorAll('.row');
    expect(rows.length).toBe(2);

    const firstRow = rows[0];
    expect(firstRow.querySelector('.title').textContent).toEqual('First');

    const inputFields = rowLayout.querySelectorAll('limel-input-field');
    expect(inputFields.length).toBe(2);

    for (const field of inputFields) {
        expect(field.getAttribute('label')).toEqual('');
        expect(field.getAttribute('helper-text')).toEqual('');
    }
});

test('suppresses label and description for custom components in row layout', async () => {
    const { formContent } = await renderForm({
        schema: rowLayoutWithCustomComponentSchema,
        value: { name: 'hello', active: true },
    });

    const switchEl = formContent.querySelector('limel-switch');
    expect(switchEl).toBeTruthy();
    expect(switchEl.getAttribute('label')).toEqual('');
    expect(switchEl.getAttribute('helper-text')).toEqual('');
});

test('renders collapsible section with correct id from field path', async () => {
    const { formContent } = await renderForm({
        schema: collapsibleSchema,
    });

    const collapsible = formContent.querySelector('limel-collapsible-section');
    expect(collapsible).toBeTruthy();
    expect(collapsible.getAttribute('id')).toEqual('.properties.details');
});

test('renders nested objects inside array items without inheriting array context', async () => {
    const { formContent } = await renderForm({
        schema: nestedArrayObjectSchema,
        value: {
            people: [{}],
        },
    });

    const collapsible = formContent.querySelector('limel-collapsible-section');
    expect(collapsible).toBeTruthy();
    expect(collapsible.getAttribute('is-open')).not.toBeNull();

    const inputFields = formContent.querySelectorAll('limel-input-field');
    const labels = [...inputFields].map((el) => el.getAttribute('label'));
    expect(labels).toContain('Name');
    expect(labels).toContain('Street');
    expect(labels).toContain('City');

    const nestedCollapsibles = formContent.querySelectorAll(
        ':scope limel-collapsible-section limel-collapsible-section'
    );
    expect(nestedCollapsibles.length).toBe(0);
});

test('converts null to undefined via schema-field when top-level custom component clears', async () => {
    const onChange = vi.fn();
    const { change } = await renderForm({
        schema: topLevelStringCustomComponentSchema,
        value: { icon: 'star' },
        onChange,
    });

    await change('Icon', undefined);

    expect(onChange).toHaveBeenCalled();
    const latest = onChange.mock.lastCall[0].detail;
    expect(latest.icon).toBeUndefined();
});

test('keeps a cleared field empty when the schema declares a default', async () => {
    const onChange = vi.fn();
    const { change } = await renderForm({
        schema: stringWithDefaultCustomComponentSchema,
        value: { icon: 'arrow', name: 'Alice' },
        onChange,
    });

    await change('Icon', undefined);

    const latest = onChange.mock.lastCall[0].detail;
    expect(latest.icon).toBeUndefined();
});

test('keeps a cleared field empty when another field is cleared afterwards', async () => {
    const onChange = vi.fn();
    const { change } = await renderForm({
        schema: stringWithDefaultCustomComponentSchema,
        value: { icon: 'arrow', name: 'Alice' },
        onChange,
    });

    await change('Icon', undefined);
    await change('Name', '');

    const latest = onChange.mock.lastCall[0].detail;
    expect(latest.icon).toBeUndefined();
});

test('resets dependent sibling in array item when trigger field changes', async () => {
    const onChange = vi.fn();
    const { change } = await renderForm({
        schema: arrayItemWithDependenciesSchema,
        value: { entries: [{}] },
        onChange,
    });

    await change('Use A', true);
    await change('Value A', 'hello');
    await change('Use A', false);

    const latest = onChange.mock.lastCall[0].detail;
    expect(latest.entries[0].valueA).toBeUndefined();
});

test('preserves nested-object leaf change inside array item with additionalProperties:true and dependencies', async () => {
    const onChange = vi.fn();
    const { change } = await renderForm({
        schema: arrayItemWithDependenciesAndCustomConfigSchema,
        value: { entries: [{}] },
        onChange,
    });

    await change('Use A', true);
    await change('Config', { color: 'red' });

    const latest = onChange.mock.lastCall[0].detail;
    expect(latest.entries[0].config).toEqual({ color: 'red' });
    expect(latest.entries[0].useA).toBe(true);
});

test('converts null to undefined via array-field when nested custom component clears', async () => {
    const onChange = vi.fn();
    const { change } = await renderForm({
        schema: nestedStringCustomComponentSchema,
        value: { views: [{}] },
        onChange,
    });

    await change('Icon', 'star');
    await change('Icon', undefined);

    const latest = onChange.mock.lastCall[0].detail;
    expect(latest.views[0].icon).toBeUndefined();
});

describe('number fields, when the browser formats decimals with a comma', () => {
    const amountSchema = {
        type: 'object',
        properties: { amount: { type: 'number', title: 'Amount' } },
    };
    const countSchema = {
        type: 'object',
        properties: { count: { type: 'integer', title: 'Count' } },
    };
    const shareSchema = {
        type: 'object',
        properties: {
            share: {
                type: 'number',
                title: 'Share',
                minimum: 0,
                maximum: 1,
                multipleOf: 0.01,
            },
        },
    };

    let originalLanguages: PropertyDescriptor | undefined;
    let languagesOverridden = false;

    const useLanguages = (languages: string[]) => {
        if (!languagesOverridden) {
            originalLanguages = Object.getOwnPropertyDescriptor(
                navigator,
                'languages'
            );
            languagesOverridden = true;
        }

        Object.defineProperty(navigator, 'languages', {
            get: () => languages,
            configurable: true,
        });
    };

    afterEach(() => {
        if (!languagesOverridden) {
            return;
        }

        if (originalLanguages) {
            Object.defineProperty(navigator, 'languages', originalLanguages);
        } else {
            delete (navigator as any).languages;
        }

        originalLanguages = undefined;
        languagesOverridden = false;
    });

    it('gives the input field a value the native number input accepts', async () => {
        useLanguages(['sv-SE']);

        const { formContent } = await renderForm({
            schema: amountSchema,
            value: { amount: 1.5 },
        });

        const field: any = formContent.querySelector('limel-input-field');
        expect(field.value).toBe('1.5');
    });

    it('leaves an integer alone', async () => {
        useLanguages(['sv-SE']);

        const { formContent } = await renderForm({
            schema: countSchema,
            value: { count: 7 },
        });

        const field: any = formContent.querySelector('limel-input-field');
        expect(field.value).toBe('7');
    });

    it('gives the slider a numeric value', async () => {
        useLanguages(['sv-SE']);

        const { formContent } = await renderForm({
            schema: shareSchema,
            value: { share: 0.25 },
        });

        const slider: any = formContent.querySelector('limel-slider');
        expect(slider.value).toBe(0.25);
    });

    it('leaves the value alone when decimals are formatted with a dot', async () => {
        useLanguages(['en-US']);

        const { formContent } = await renderForm({
            schema: amountSchema,
            value: { amount: 1.5 },
        });

        const field: any = formContent.querySelector('limel-input-field');
        expect(field.value).toBe('1.5');
    });
});

function findHeading(formContent: Element, title: string) {
    return [...formContent.querySelectorAll('h1, h2, h3, h4, h5, h6')].find(
        (element) => element.textContent === title
    );
}

function findSectionHeading(formContent: Element, header: string) {
    const section = [
        ...formContent.querySelectorAll('limel-collapsible-section'),
    ].find((element) => element.getAttribute('header') === header);

    return section.shadowRoot.querySelector('.title');
}

function headingStyle(formContent: Element, title: string) {
    const heading = findHeading(formContent, title);
    const { fontSize, fontWeight } = getComputedStyle(heading);
    const bar = getComputedStyle(heading, '::before');

    return {
        fontSize,
        fontWeight,
        hasBar: bar.content !== 'none' && bar.display !== 'none',
    };
}

async function renderForm(props: Record<string, any> = {}) {
    const { value = {}, ...rest } = props;
    const result = await render(
        <limel-form value={value} {...rest}></limel-form>
    );
    await waitForReactRender(result.root, result.waitForChanges);

    const formContent = result.root.shadowRoot.querySelector('.root');

    const change = async (label: string, newValue: unknown) => {
        changeField(formContent, label, newValue);
        await waitForReactRender(result.root, result.waitForChanges);
    };

    return { ...result, formContent, change };
}

function changeField(formContent: Element, label: string, value: unknown) {
    const fields = formContent.querySelectorAll(
        'limel-input-field, limel-select, limel-checkbox, limel-switch, limel-date-picker'
    );
    const field = [...fields].find((el) => el.getAttribute('label') === label);

    if (!field) {
        throw new Error(`No form field found with label "${label}"`);
    }

    field.dispatchEvent(
        new CustomEvent('change', {
            detail: value,
            bubbles: true,
            composed: true,
        })
    );
}

function focusedLabel(root: HTMLElement): string | null {
    return root.shadowRoot.activeElement?.getAttribute('label') ?? null;
}

async function waitForReactRender(
    root: HTMLElement,
    waitForChanges: () => Promise<void>
) {
    for (let i = 0; i < 10; i++) {
        await waitForChanges();
        if (root.shadowRoot?.querySelector('.root *')) {
            return;
        }
    }

    throw new Error('React did not render within 10 ticks');
}
