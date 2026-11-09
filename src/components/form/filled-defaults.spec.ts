import { withoutFilledDefaults } from './filled-defaults';

const given = {
    title: 'Dates',
    sections: [{ title: 'A' }, { title: 'B', visible: true }],
};

const filled = {
    title: 'Dates',
    columns: 5,
    layout: { dense: true },
    sections: [
        { title: 'A', visible: true },
        { title: 'B', visible: true },
    ],
};

const sectionsOf = (result: unknown) => (result as typeof filled).sections;

it('leaves out the defaults that were filled in', () => {
    expect(withoutFilledDefaults(filled, filled, given)).toEqual(given);
});

it('keeps a default the user changed', () => {
    const value = { ...filled, columns: 3 };

    expect(withoutFilledDefaults(value, filled, given)).toEqual({
        ...given,
        columns: 3,
    });
});

it('leaves out a default the user changed back', () => {
    const value = { ...filled, columns: 5 };

    expect(withoutFilledDefaults(value, filled, given)).toEqual(given);
});

it('keeps a value that was given, even when it equals the default', () => {
    expect(sectionsOf(withoutFilledDefaults(filled, filled, given))[1]).toEqual(
        {
            title: 'B',
            visible: true,
        }
    );
});

it('keeps the defaults of a new list item', () => {
    const value = {
        ...filled,
        sections: [...filled.sections, { title: 'C', visible: true }],
    };

    expect(sectionsOf(withoutFilledDefaults(value, filled, given))).toEqual([
        { title: 'A' },
        { title: 'B', visible: true },
        { title: 'C', visible: true },
    ]);
});

it('keeps the defaults of a field a change brought in', () => {
    const value = { ...filled, propertyName: 'name' };

    expect(withoutFilledDefaults(value, filled, given)).toEqual({
        ...given,
        propertyName: 'name',
    });
});

it('matches a moved list item by its content', () => {
    const value = { ...filled, sections: [...filled.sections].reverse() };

    expect(sectionsOf(withoutFilledDefaults(value, filled, given))).toEqual([
        { title: 'B', visible: true },
        { title: 'A' },
    ]);
});

it('matches the list items left after a removal by their content', () => {
    const value = { ...filled, sections: filled.sections.slice(1) };

    expect(sectionsOf(withoutFilledDefaults(value, filled, given))).toEqual([
        { title: 'B', visible: true },
    ]);
});

it('matches a changed list item by its position', () => {
    const value = {
        ...filled,
        sections: [{ title: 'A!', visible: true }, filled.sections[1]],
    };

    expect(sectionsOf(withoutFilledDefaults(value, filled, given))).toEqual([
        { title: 'A!' },
        { title: 'B', visible: true },
    ]);
});

it('leaves out an object that only holds defaults', () => {
    const value = { ...filled, layout: { dense: true } };

    expect(withoutFilledDefaults(value, filled, given)).not.toHaveProperty(
        'layout'
    );
});

it('keeps an empty object that was given', () => {
    expect(
        withoutFilledDefaults({ layout: {} }, { layout: {} }, { layout: {} })
    ).toEqual({ layout: {} });
});

it('gives back nothing when nothing was given and nothing changed', () => {
    expect(withoutFilledDefaults({ columns: 5 }, { columns: 5 }, null)).toBe(
        null
    );
    expect(
        withoutFilledDefaults({ columns: 5 }, { columns: 5 }, undefined)
    ).toBe(undefined);
});

it('leaves out a list item that was only filled in', () => {
    expect(
        withoutFilledDefaults(
            { tags: [{ kind: 'k' }] },
            { tags: [{ kind: 'k' }] },
            { tags: [] }
        )
    ).toEqual({ tags: [] });
});

it('keeps the keys in the order they were given', () => {
    const value = { visible: false, columns: 3, title: 'Dates' };
    const filled = { visible: true, columns: 5, title: 'Dates' };

    expect(
        Object.keys(
            withoutFilledDefaults(value, filled, { title: 'Dates', columns: 5 })
        )
    ).toEqual(['title', 'columns', 'visible']);
});

it('keeps a value that a change brought in, but not an empty object', () => {
    const value = {
        ...filled,
        query: { allowGlobalSearch: true },
        rules: {},
        component: { props: {} },
    };

    expect(withoutFilledDefaults(value, filled, given)).toEqual({
        ...given,
        query: { allowGlobalSearch: true },
    });
});

it('keeps a new list item as it is', () => {
    expect(
        withoutFilledDefaults({ items: [{}] }, { items: [] }, { items: [] })
    ).toEqual({ items: [{}] });
});

it('strips an edited item while another item is added', () => {
    const value = {
        ...filled,
        sections: [
            { title: 'A!', visible: true },
            { title: 'B', visible: true },
            { title: 'C', visible: true },
        ],
    };

    expect(sectionsOf(withoutFilledDefaults(value, filled, given))).toEqual([
        { title: 'A!' },
        { title: 'B', visible: true },
        { title: 'C', visible: true },
    ]);
});

it('leaves an edited item alone when it could be either of two originals', () => {
    const value = { ...filled, sections: [{ title: 'B!', visible: true }] };

    // It has as much in common with A as with B, so it is left as it is
    expect(sectionsOf(withoutFilledDefaults(value, filled, given))).toEqual([
        { title: 'B!', visible: true },
    ]);
});

it('pairs an edited item with the original it has the most in common with', () => {
    const givenControls = {
        controls: [{ property: 'name', label: 'Name' }, { property: 'age' }],
    };
    const filledControls = {
        controls: [
            { property: 'name', label: 'Name', visible: true },
            { property: 'age', visible: true },
        ],
    };
    const value = {
        controls: [
            { property: 'age', visible: true },
            { property: 'name', label: 'Name!', visible: true },
        ],
    };

    expect(withoutFilledDefaults(value, filledControls, givenControls)).toEqual(
        {
            controls: [
                { property: 'age' },
                { property: 'name', label: 'Name!' },
            ],
        }
    );
});

it('leaves a new item alone when it shares nothing with the originals', () => {
    const value = { ...filled, sections: [...filled.sections, { icon: 'x' }] };

    expect(
        sectionsOf(withoutFilledDefaults(value, filled, given)).at(-1)
    ).toEqual({ icon: 'x' });
});

it('strips an edited item that still matches its original best', () => {
    const givenControls = {
        controls: [{ property: 'name' }, { property: 'age', label: 'Age' }],
    };
    const filledControls = {
        controls: [
            { property: 'name', visible: true },
            { property: 'age', label: 'Age', visible: true },
        ],
    };
    // `name` removed, `age` relabelled
    const value = {
        controls: [{ property: 'age', label: 'Age!', visible: true }],
    };

    expect(withoutFilledDefaults(value, filledControls, givenControls)).toEqual(
        { controls: [{ property: 'age', label: 'Age!' }] }
    );
});

it('keeps the items left after removing one from a list that is a default', () => {
    expect(
        withoutFilledDefaults({ tags: ['b'] }, { tags: ['a', 'b'] }, {})
    ).toEqual({ tags: ['b'] });
});

it('keeps an emptied list that was a default', () => {
    expect(
        withoutFilledDefaults({ tags: [] }, { tags: ['a', 'b'] }, {})
    ).toEqual({ tags: [] });
});

it('leaves out a list that still is its default', () => {
    expect(
        withoutFilledDefaults(
            { tags: ['a', 'b'], name: 'x' },
            { tags: ['a', 'b'], name: 'x' },
            { name: 'x' }
        )
    ).toEqual({ name: 'x' });
});
