import {
    getIconBackgroundColor,
    getIconColor,
    getIconFillColor,
    getIconName,
    getIconTitle,
} from './get-icon-props';
import { Icon } from '../../global/shared-types/icon.types';

describe('getIconName', () => {
    it('returns the correct icon name when icon is a string', () => {
        const icon: string | Icon = 'test-icon';
        const result = getIconName(icon);
        expect(result).toEqual('test-icon');
    });

    it('returns the correct icon name when icon is an object with a name property', () => {
        const icon: string | Icon = { name: 'test-icon' };
        const result = getIconName(icon);
        expect(result).toEqual('test-icon');
    });

    it('returns undefined when icon is an object without a name property', () => {
        const icon: string | Icon = { notName: 'test-icon' } as any as Icon;
        const result = getIconName(icon);
        expect(result).toBeUndefined();
    });

    it('returns undefined when icon is null', () => {
        const icon: string | Icon = null;
        const result = getIconName(icon);
        expect(result).toBeUndefined();
    });

    it('returns undefined when icon is undefined', () => {
        const icon: string | Icon = undefined;
        const result = getIconName(icon);
        expect(result).toBeUndefined();
    });
});

// eslint-disable-next-line prefer-const
for (let { func, iconPropertyName, attributeName } of [
    {
        func: getIconColor,
        iconPropertyName: 'color',
        attributeName: 'iconColor',
    },
    {
        func: getIconFillColor,
        iconPropertyName: 'color',
        attributeName: 'fillColor',
    },
    {
        func: getIconBackgroundColor,
        iconPropertyName: 'backgroundColor',
        attributeName: 'backgroundColor',
    },
    {
        func: getIconTitle,
        iconPropertyName: 'title',
        attributeName: 'iconTitle',
    },
]) {
    describe(`${func.name}`, () => {
        let icon: string | Icon;
        let attribute: string | undefined;

        describe('when icon is a string', () => {
            beforeEach(() => {
                icon = 'test-icon';
            });
            describe(`and ${attributeName} is not provided`, () => {
                it('returns `undefined`', () => {
                    const result = func(icon);
                    expect(result).toBeUndefined();
                });
            });
            describe(`and ${attributeName} is provided`, () => {
                beforeEach(() => {
                    attribute = 'blue';
                });
                it(`returns the ${attributeName} value`, () => {
                    const result = func(icon, attribute);
                    expect(result).toEqual('blue');
                });
            });
            describe(`and ${attributeName} is \`undefined\``, () => {
                beforeEach(() => {
                    attribute = undefined;
                });
                it('returns `undefined`', () => {
                    const result = func(icon, attribute);
                    expect(result).toBeUndefined();
                });
            });
        });

        describe(`when icon is an object with a ${iconPropertyName} property`, () => {
            beforeEach(() => {
                icon = { name: 'test-icon' };
                icon[iconPropertyName] = 'red';
            });
            describe(`and ${attributeName} is not provided`, () => {
                it(`returns the icon.${iconPropertyName} value`, () => {
                    const result = func(icon);
                    expect(result).toEqual('red');
                });
            });
            describe(`and ${attributeName} is provided`, () => {
                beforeEach(() => {
                    // eslint-disable-next-line sonarjs/updated-loop-counter
                    attributeName = 'blue';
                });
                it(`returns the icon.${iconPropertyName} value`, () => {
                    const result = func(icon, attributeName);
                    expect(result).toEqual('red');
                });
            });
            describe(`and ${attributeName} is \`undefined\``, () => {
                beforeEach(() => {
                    // eslint-disable-next-line sonarjs/updated-loop-counter
                    attributeName = undefined;
                });
                it(`returns the icon.${iconPropertyName} value`, () => {
                    const result = func(icon, attributeName);
                    expect(result).toEqual('red');
                });
            });
        });

        describe(`when icon is an object withOUT the ${iconPropertyName} property`, () => {
            beforeEach(() => {
                icon = { name: 'test-icon' };
            });
            describe(`and ${attributeName} is not provided`, () => {
                it('returns `undefined`', () => {
                    const result = func(icon);
                    expect(result).toBeUndefined();
                });
            });
            describe(`and ${attributeName} is provided`, () => {
                beforeEach(() => {
                    attribute = 'blue';
                });
                it('returns `undefined`', () => {
                    const result = func(icon, attribute);
                    expect(result).toBeUndefined();
                });
            });
            describe(`and ${attributeName} is \`undefined\``, () => {
                beforeEach(() => {
                    attribute = undefined;
                });
                it('returns `undefined`', () => {
                    const result = func(icon, attribute);
                    expect(result).toBeUndefined();
                });
            });
        });

        describe('when icon is `null`', () => {
            beforeEach(() => {
                icon = null;
            });
            describe(`and ${attributeName} is not provided`, () => {
                it('returns `undefined`', () => {
                    const result = func(icon);
                    expect(result).toBeUndefined();
                });
            });
            describe(`and ${attributeName} is provided`, () => {
                beforeEach(() => {
                    attribute = 'blue';
                });
                it('returns `undefined`', () => {
                    const result = func(icon, attribute);
                    expect(result).toBeUndefined();
                });
            });
            describe(`and ${attributeName} is \`undefined\``, () => {
                beforeEach(() => {
                    attribute = undefined;
                });
                it('returns `undefined`', () => {
                    const result = func(icon, attribute);
                    expect(result).toBeUndefined();
                });
            });
        });

        describe('when icon is `undefined`', () => {
            beforeEach(() => {
                icon = undefined;
            });
            describe(`and ${attributeName} is not provided`, () => {
                it('returns `undefined`', () => {
                    const result = func(icon);
                    expect(result).toBeUndefined();
                });
            });
            describe(`and ${attributeName} is provided`, () => {
                beforeEach(() => {
                    attribute = 'blue';
                });
                it('returns `undefined`', () => {
                    const result = func(icon, attribute);
                    expect(result).toBeUndefined();
                });
            });
            describe(`and ${attributeName} is \`undefined\``, () => {
                beforeEach(() => {
                    attribute = undefined;
                });
                it('returns `undefined`', () => {
                    const result = func(icon, attribute);
                    expect(result).toBeUndefined();
                });
            });
        });
    });
}
