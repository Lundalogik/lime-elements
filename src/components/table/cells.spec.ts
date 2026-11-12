import {
    applyProps,
    createCellView,
    createHeaderView,
    toAggregateText,
} from './cells';
import { Column } from './table.types';

describe('createCellView', () => {
    let column: Column;
    const row = { id: 1, foo: 'Foo', bar: false };

    beforeEach(() => {
        column = { field: 'foo', title: 'Foo' };
    });

    describe('when the column has neither a formatter nor a component', () => {
        it('shows the value of the field as text', () => {
            expect(createCellView(column, row)).toEqual({
                rawValue: 'Foo',
                text: 'Foo',
            });
        });

        it('keeps markup in the value as plain text', () => {
            const view = createCellView(column, { foo: '<b>bold</b>' });

            expect(view).toEqual({
                rawValue: '<b>bold</b>',
                text: '<b>bold</b>',
            });
        });
    });

    describe('when a formatter is given', () => {
        it('shows the formatted value', () => {
            column.formatter = (value) => `formatted: ${value}`;

            expect(createCellView(column, row)).toEqual({
                rawValue: 'Foo',
                text: 'formatted: Foo',
            });
        });

        it('gives the formatter the value and the row', () => {
            column.formatter = vi.fn().mockReturnValue('');
            createCellView(column, row);

            expect(column.formatter).toHaveBeenCalledWith('Foo', row);
        });
    });

    describe('when a component is given', () => {
        it('renders the component with the field, the value and the row', () => {
            column.component = { name: 'h1' };

            const { component } = createCellView(column, row);

            expect(component.name).toBe('h1');
            expect(component.props).toEqual({
                field: 'foo',
                value: 'Foo',
                data: row,
            });
        });

        it('gives the rendered element its properties', () => {
            column.component = { name: 'h1', props: { bar: 'baz' } };
            const element = document.createElement('h1');

            createCellView(column, row).component.ref(element);

            expect(element).toHaveProperty('bar', 'baz');
            expect(element).toHaveProperty('value', 'Foo');
            expect((element as any).data).toBe(row);
        });

        it('adds the configured properties and the ones from the factory', () => {
            const propsFactory = vi.fn().mockReturnValue({ limetype: 'bar' });
            column.component = {
                name: 'h1',
                props: { bar: 'baz' },
                propsFactory: propsFactory,
            };

            const view = createCellView(column, row);

            expect(propsFactory).toHaveBeenCalledWith(row);
            expect(view.component.props).toEqual({
                bar: 'baz',
                limetype: 'bar',
                field: 'foo',
                value: 'Foo',
                data: row,
            });
        });

        it('lets the factory override the configured properties', () => {
            column.component = {
                name: 'h1',
                props: { bar: 'configured' },
                propsFactory: () => ({ bar: 'from factory' }),
            };

            expect(createCellView(column, row).component.props.bar).toBe(
                'from factory'
            );
        });

        it('gives the component the formatted value', () => {
            column.formatter = (value) => `formatted: ${value}`;
            column.component = { name: 'h1' };

            expect(createCellView(column, row).component.props.value).toBe(
                'formatted: Foo'
            );
        });

        it('gives the component a value that is not a string as it is', () => {
            const value = { nested: true };
            column.component = { name: 'h1' };

            expect(
                createCellView(column, { foo: value }).component.props.value
            ).toBe(value);
        });
    });

    describe('when the component does not exist', () => {
        let warn: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            column.component = { name: 'limel-does-not-exist' };
        });

        afterEach(() => {
            warn.mockRestore();
        });

        it('shows the value as text, and says which component is missing', () => {
            expect(createCellView(column, row)).toEqual({
                rawValue: 'Foo',
                text: 'Foo',
                missingComponent: 'limel-does-not-exist',
            });
        });

        it('warns once per column', () => {
            createCellView(column, row);
            createCellView(column, row);

            expect(warn).toHaveBeenCalledTimes(1);
        });
    });

    describe('when a value is an object that cannot be shown as text', () => {
        let warn: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        });

        afterEach(() => {
            warn.mockRestore();
        });

        it('leaves the cell empty, and warns once per column without showing the value', () => {
            const rowWithObject = { id: 1, foo: { secret: 'value' } };

            expect(createCellView(column, rowWithObject).text).toBe('');
            expect(createCellView(column, rowWithObject).text).toBe('');
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain('"foo"');
            expect(warn.mock.calls[0][0]).not.toContain('secret');
        });

        it('does not warn for an empty value', () => {
            createCellView(column, { id: 1, foo: null });

            expect(warn).not.toHaveBeenCalled();
        });

        it('shows an aggregate as empty, and says once that the `aggregator` is to return text', () => {
            expect(toAggregateText(column, { secret: 'value' })).toBe('');
            expect(toAggregateText(column, { secret: 'value' })).toBe('');
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain('"foo"');
            expect(warn.mock.calls[0][0]).toContain('`aggregator`');
            expect(warn.mock.calls[0][0]).not.toContain('secret');
        });
    });

    it('shows the value as text when the component has no name', () => {
        column.component = { name: '' };

        expect(createCellView(column, row)).toEqual({
            rawValue: 'Foo',
            text: 'Foo',
        });
    });
});

describe('createHeaderView', () => {
    it('merges the configured properties with the ones from the factory', () => {
        const propsFactory = vi.fn().mockReturnValue({ icon: 'menu' });
        const column: Column = {
            field: 'foo',
            title: 'Foo',
            headerComponent: {
                name: 'limel-example-header-menu',
                props: { items: [] },
                propsFactory: propsFactory,
            },
        };

        const view = createHeaderView(column);

        expect(view.name).toBe('limel-example-header-menu');
        expect(view.props).toEqual({ items: [], icon: 'menu' });
        expect(propsFactory).toHaveBeenCalledWith(null);
    });
});

describe('applyProps', () => {
    let element: HTMLElement;

    beforeEach(() => {
        element = document.createElement('div');
    });

    it('sets values as properties, so that objects arrive as they are', () => {
        const data = { id: 1 };
        applyProps(element, { data: data, label: 'text' });

        expect((element as any).data).toBe(data);
        expect(element).toHaveProperty('label', 'text');
        expect(element.hasAttribute('label')).toBe(false);
    });

    it('adds a function named like `onMyEvent` as a listener for `myEvent`', () => {
        const listener = vi.fn();
        applyProps(element, { onMyEvent: listener });

        element.dispatchEvent(new CustomEvent('myEvent'));

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('also listens for the native event of that name, such as `keydown` for `onKeyDown`', () => {
        const listener = vi.fn();
        Object.defineProperty(element, 'onkeydown', { value: null });
        applyProps(element, { onKeyDown: listener });

        element.dispatchEvent(new Event('keydown'));

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('stops listening for the native event when the listener is taken away', () => {
        const listener = vi.fn();
        Object.defineProperty(element, 'onkeydown', { value: null });
        applyProps(element, { onKeyDown: listener });
        applyProps(element, {});

        element.dispatchEvent(new Event('keydown'));

        expect(listener).not.toHaveBeenCalled();
    });

    it('sets a function that is not named like a listener as a property', () => {
        const formatter = () => '';
        applyProps(element, { formatter: formatter });

        expect((element as any).formatter).toBe(formatter);
    });

    it('removes the listeners it added before, when given new properties', () => {
        const oldListener = vi.fn();
        const newListener = vi.fn();
        applyProps(element, { onMyEvent: oldListener });
        applyProps(element, { onMyEvent: newListener });

        element.dispatchEvent(new CustomEvent('myEvent'));

        expect(oldListener).not.toHaveBeenCalled();
        expect(newListener).toHaveBeenCalledTimes(1);
    });

    it('clears a property that the new properties no longer have', () => {
        applyProps(element, { href: '/first', label: 'text' });
        applyProps(element, { label: 'text' });

        expect((element as any).href).toBeUndefined();
        expect(element).toHaveProperty('label', 'text');
    });

    it('removes the attribute of a native property that it no longer gets', () => {
        const link = document.createElement('a');
        applyProps(link, { href: '/first' });
        applyProps(link, {});

        expect(link.hasAttribute('href')).toBe(false);
    });

    it('empties the text of a native input that no longer gets a value', () => {
        const input = document.createElement('input');
        applyProps(input, { value: 'first' });
        applyProps(input, {});

        expect(input.value).toBe('');
    });

    it('does not add a listener twice when given the same properties again', () => {
        const listener = vi.fn();
        const props = { onMyEvent: listener };
        applyProps(element, props);
        applyProps(element, props);

        element.dispatchEvent(new CustomEvent('myEvent'));

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('does nothing when there is no element', () => {
        expect(() => applyProps(null, { label: 'text' })).not.toThrow();
    });
});
