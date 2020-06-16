import {
    createColumnDefinition,
    createCustomComponent,
    formatCell,
} from './columns';
import { Column } from './table.types';

describe('createCustomComponent', () => {
    let cell: any;
    let value: string;
    let field: string;
    let data: Record<string, any>;
    let column: Column;

    beforeEach(() => {
        cell = {
            getField: () => field,
            getData: () => data,
            getValue: () => value,
        };

        column = {
            field: 'foo',
            title: 'Foo',
        };

        data = {
            foo: 'Foo',
            bar: false,
        };

        field = 'foo';
        value = 'FOO';
    });

    describe('createCustomComponent', () => {
        it('creates an HTML element with the configured properties', () => {
            column.component = {
                name: 'h1',
                props: {
                    bar: 'baz',
                },
            };

            const component = createCustomComponent(cell, column, value);
            expect(component.tagName.toLowerCase()).toEqual('h1');
            expect(component).toHaveProperty('field', 'foo');
            expect(component).toHaveProperty('value', 'FOO');
            expect(component).toHaveProperty('data', {
                foo: 'Foo',
                bar: false,
            });
        });
    });

    describe('formatCell', () => {
        describe('when formatter is given', () => {
            it('returns the formatted value', () => {
                column.formatter = (v) => `formatted: ${v}`;
                expect(formatCell(cell, column)).toEqual('formatted: FOO');
            });
        });

        describe('when component is given', () => {
            it('returns the formatted value', () => {
                column.component = {
                    name: 'h1',
                };
                const component = formatCell(cell, column) as HTMLElement;
                expect(component.tagName.toLowerCase()).toEqual('h1');
                expect(component).toHaveProperty('value', 'FOO');
            });
        });

        describe('when both formatter and component is given', () => {
            it('returns the formatted value', () => {
                column.formatter = (v) => `formatted: ${v}`;
                column.component = {
                    name: 'h1',
                };
                const component = formatCell(cell, column) as HTMLElement;
                expect(component.tagName.toLowerCase()).toEqual('h1');
                expect(component).toHaveProperty('value', 'formatted: FOO');
            });
        });
    });

    describe('createColumnDefinition', () => {
        it('converts a limel-table column config to a Tabulator column definition', () => {
            column.formatter = () => '';
            column.component = {
                name: 'h1',
                props: {
                    foo: 'bar',
                },
            };

            const definition = createColumnDefinition(column);
            expect(definition).toHaveProperty('field', 'foo');
            expect(definition).toHaveProperty('title', 'Foo');

            const formatter = definition.formatter;
            expect(typeof formatter).toEqual('function');

            const params: any = definition.formatterParams;
            expect(params.component).toEqual(column.component);
            expect(params.formatter).toBe(column.formatter);
        });
    });
});
