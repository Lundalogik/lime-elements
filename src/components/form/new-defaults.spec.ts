import { withNewDefaults } from './new-defaults';

it('adds a default that only applies after the change', () => {
    expect(
        withNewDefaults(
            { limetype: 'person' },
            {},
            { limetype: 'person', propertyName: 'name' }
        )
    ).toEqual({ limetype: 'person', propertyName: 'name' });
});

it('leaves out a default that applied before the change', () => {
    expect(
        withNewDefaults(
            { name: 'Alice' },
            { columns: 5 },
            { name: 'Alice', columns: 5 }
        )
    ).toEqual({ name: 'Alice' });
});

it('adds a default that the change changed', () => {
    expect(
        withNewDefaults(
            { limetype: 'company' },
            { propertyName: 'name' },
            { limetype: 'company', propertyName: 'companyName' }
        )
    ).toEqual({ limetype: 'company', propertyName: 'companyName' });
});

it('adds only the defaults that changed inside an object', () => {
    expect(
        withNewDefaults(
            { name: 'Alice' },
            { layout: { columns: 5, dense: true } },
            { name: 'Alice', layout: { columns: 5, dense: false } }
        )
    ).toEqual({ name: 'Alice', layout: { dense: false } });
});

it('adds the defaults of a new list item', () => {
    expect(
        withNewDefaults(
            { entries: [{ mode: 'a' }, {}] },
            { entries: [{ plain: 'preset' }] },
            { entries: [{ mode: 'a', plain: 'preset' }, { plain: 'preset' }] }
        )
    ).toEqual({ entries: [{ mode: 'a' }, { plain: 'preset' }] });
});

it('adds an object that only applies after the change', () => {
    expect(
        withNewDefaults(
            { property: 'company' },
            {},
            { property: 'company', query: { allowGlobalSearch: true } }
        )
    ).toEqual({ property: 'company', query: { allowGlobalSearch: true } });
});

it('keeps a value that is set', () => {
    expect(
        withNewDefaults(
            { limetype: 'person', propertyName: 'fullname' },
            {},
            { limetype: 'person', propertyName: 'fullname' }
        )
    ).toEqual({ limetype: 'person', propertyName: 'fullname' });
});

it('returns the same value when there is nothing to add', () => {
    const value = { name: 'Alice', tags: ['a'] };

    expect(
        withNewDefaults(value, { columns: 5 }, { ...value, columns: 5 })
    ).toBe(value);
});
