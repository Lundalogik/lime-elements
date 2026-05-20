import { render, h } from '@stencil/vitest';
import { vi } from 'vitest';
import {
    stringSchema,
    numberSchema,
    booleanSchema,
    enumSchema,
    requiredFieldSchema,
    twoRequiredFieldsSchema,
    emailFormatSchema,
    arraySchema,
    nestedObjectSchema,
    arrayOfObjectsSchema,
    arrayOfObjectsSchemaWithRequired,
    dynamicSchema,
    dynamicSchemaUpdated,
    helpSchema,
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

test('renders help icons when schema has lime.help', async () => {
    const { formContent } = await renderForm({
        schema: helpSchema,
    });

    const help = formContent.querySelector('limel-help');
    expect(help).toBeTruthy();
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
        '.array-item limel-icon-button[icon="trash"]'
    );
    expect(dragHandle).toBeNull();
    expect(removeButton).toBeNull();
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
        'limel-collapsible-section limel-collapsible-section'
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
