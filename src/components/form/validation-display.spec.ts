import {
    hasValue,
    isFieldInvalid,
    isFieldRequired,
    getErrorText,
} from './validation-display';

it.each([
    ['null', null],
    ['undefined', undefined],
    ['empty string', ''],
    ['empty array', []],
    ['empty object', {}],
])('hasValue returns false for %s', (_, value) => {
    expect(hasValue(value)).toBe(false);
});

it.each([
    ['non-empty string', 'hello'],
    ['non-zero number', 42],
    ['zero', 0],
    ['boolean true', true],
    ['boolean false', false],
    ['non-empty array', [1, 2]],
    ['non-empty object', { a: 1 }],
    ['Date', new Date()],
])('hasValue returns true for %s', (_, value) => {
    expect(hasValue(value)).toBe(true);
});

it.each([
    {
        hasErrors: true,
        modified: true,
        hasValue: false,
        required: true,
        revealErrors: false,
        expected: true,
    },
    {
        hasErrors: true,
        modified: false,
        hasValue: true,
        required: true,
        revealErrors: false,
        expected: true,
    },
    {
        hasErrors: true,
        modified: false,
        hasValue: false,
        required: false,
        revealErrors: false,
        expected: true,
    },
    {
        hasErrors: false,
        modified: true,
        hasValue: true,
        required: false,
        revealErrors: false,
        expected: false,
    },
    {
        hasErrors: true,
        modified: false,
        hasValue: false,
        required: true,
        revealErrors: false,
        expected: false,
    },
    {
        // Untouched required-empty field becomes invalid when the form
        // is asked to reveal all errors (e.g. on a save attempt).
        hasErrors: true,
        modified: false,
        hasValue: false,
        required: true,
        revealErrors: true,
        expected: true,
    },
    {
        // `revealErrors` never flags fields that have no errors.
        hasErrors: false,
        modified: false,
        hasValue: false,
        required: true,
        revealErrors: true,
        expected: false,
    },
])(
    'isFieldInvalid returns $expected when hasErrors=$hasErrors, modified=$modified, hasValue=$hasValue, required=$required, revealErrors=$revealErrors',
    ({ hasErrors, modified, hasValue, required, revealErrors, expected }) => {
        expect(
            isFieldInvalid({
                hasErrors,
                modified,
                hasValue,
                required,
                revealErrors,
            })
        ).toBe(expected);
    }
);

it.each([
    { required: true, minItems: 0, expected: true },
    { required: false, minItems: 1, expected: true },
    { required: false, minItems: 0, expected: false },
])(
    'isFieldRequired returns $expected when required=$required, minItems=$minItems',
    ({ required, minItems, expected }) => {
        expect(isFieldRequired({ required, minItems })).toBe(expected);
    }
);

it.each([
    [['must be valid'], 'Enter a value', undefined, 'Must be valid'],
    [[], 'Enter a value', undefined, 'Enter a value'],
    [null, 'Enter a value', undefined, 'Enter a value'],
    [[], 'description', 'helper text', 'helper text'],
    [[], 'description', undefined, 'description'],
])(
    'getErrorText(%j, %j, %j) returns %j',
    (errors, description, fallbackText, expected) => {
        expect(getErrorText(errors, description, fallbackText)).toBe(expected);
    }
);
