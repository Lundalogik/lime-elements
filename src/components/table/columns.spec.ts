import {
    ColumnDefinitionFactory,
    createCustomComponent,
    createFormatter,
    formatCell,
} from './columns';
import { ElementPool } from './element-pool';
import { Column } from './table.types';

describe('createCustomComponent', () => {
    let cell: any;
    let value: any;
    let field: string;
    let data: Record<string, any>;
    let column: Column;
    let factory: ColumnDefinitionFactory;
    let pool: ElementPool;

    beforeEach(() => {
        cell = {
            getField: () => field,
            getData: () => data,
            getValue: () => value,
            getColumn: () => null,
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
        pool = new ElementPool(document);
        factory = new ColumnDefinitionFactory(pool);
    });

    describe('createCustomComponent', () => {
        it('creates an HTML element with the configured properties', () => {
            column.component = {
                name: 'h1',
                props: {
                    bar: 'baz',
                },
                propsFactory: () => {
                    return { limetype: 'bar' };
                },
            };

            const component = createCustomComponent(cell, column, value, pool);
            expect(component.tagName.toLowerCase()).toEqual('h1');
            expect(component).toHaveProperty('field', 'foo');
            expect(component).toHaveProperty('limetype', 'bar');
            expect(component).toHaveProperty('value', 'FOO');
            expect(component).toHaveProperty('data', {
                foo: 'Foo',
                bar: false,
            });
        });
    });

    describe('createFormatter', () => {
        let formatter: Function;

        describe('when formatter is given', () => {
            beforeEach(() => {
                column.formatter = (v) => `formatted: ${v}`;
                formatter = createFormatter(column, pool) as any;
            });

            it('returns the formatted value', () => {
                expect(formatter(cell, column)).toEqual('formatted: FOO');
            });
        });

        describe('when component is given', () => {
            beforeEach(() => {
                column.component = {
                    name: 'h1',
                };
                formatter = createFormatter(column, pool) as any;
            });

            it('returns the formatted value', () => {
                const component = formatter(cell, column) as HTMLElement;
                expect(component.tagName.toLowerCase()).toEqual('h1');
                expect(component).toHaveProperty('value', 'FOO');
            });
        });

        describe('when both formatter and component is given', () => {
            beforeEach(() => {
                column.formatter = (v) => `formatted: ${v}`;
                column.component = {
                    name: 'h1',
                };
                formatter = createFormatter(column, pool) as any;
            });

            it('returns the formatted value', () => {
                const component = formatter(cell, column) as HTMLElement;
                expect(component.tagName.toLowerCase()).toEqual('h1');
                expect(component).toHaveProperty('value', 'formatted: FOO');
            });
        });

        describe('when the formatted value is a string', () => {
            let escaped;

            beforeEach(() => {
                value = 'contains <em>html</em> & &lt;stuff&gt;';
                escaped =
                    'contains &lt;em&gt;html&lt;/em&gt; &amp; &amp;lt;stuff&amp;gt;';
            });

            describe('when no formatter is given', () => {
                beforeEach(() => {
                    formatter = createFormatter(column, pool) as any;
                });

                it('escapes the value', () => {
                    expect(formatter(cell, column)).toEqual(escaped);
                });
            });

            describe('when formatter is given', () => {
                beforeEach(() => {
                    column.formatter = (v) => `formatted: ${v}`;
                    formatter = createFormatter(column, pool) as any;
                });

                it('escapes the value', () => {
                    expect(formatter(cell, column)).toEqual(
                        `formatted: ${escaped}`
                    );
                });
            });

            describe('when component is given', () => {
                beforeEach(() => {
                    column.component = {
                        name: 'h1',
                    };
                    formatter = createFormatter(column, pool) as any;
                });

                it('returns the formatted value', () => {
                    const component = formatter(cell, column) as HTMLElement;
                    expect(component.tagName.toLowerCase()).toEqual('h1');
                    expect(component).toHaveProperty('value', value);
                });
            });

            describe('when both formatter and component is given', () => {
                beforeEach(() => {
                    column.formatter = (v) => `formatted: ${v}`;
                    column.component = {
                        name: 'h1',
                    };
                    formatter = createFormatter(column, pool) as any;
                });

                it('returns the formatted value', () => {
                    const component = formatter(cell, column) as HTMLElement;
                    expect(component.tagName.toLowerCase()).toEqual('h1');
                    expect(component).toHaveProperty(
                        'value',
                        `formatted: ${value}`
                    );
                });
            });
        });

        describe('when the formatted value is not a string', () => {
            beforeEach(() => {
                value = [
                    'contains <em>html</em> & &lt;stuff&gt;',
                    'here is another string',
                ];
                formatter = createFormatter(column, pool) as any;
            });

            it('does not deep escape', () => {
                expect(formatter(cell, column)).toEqual([
                    'contains <em>html</em> & &lt;stuff&gt;',
                    'here is another string',
                ]);
            });
        });
    });

    describe('ColumnDefinitionFactory.create', () => {
        it('converts a limel-table column config to a Tabulator column definition', () => {
            column.formatter = () => '';
            column.component = {
                name: 'h1',
                props: {
                    foo: 'bar',
                },
            };

            const definition = factory.create(column);
            expect(definition).toHaveProperty('field', 'foo');
            expect(definition).toHaveProperty('title', 'Foo');

            const formatter = definition.formatter;
            expect(typeof formatter).toEqual('function');

            const params: any = definition.formatterParams;
            expect(params.component).toEqual(column.component);
            expect(params.formatter).toBe(column.formatter);
        });

        it('uses the default formatter if the element set in the custom component config does not exist', () => {
            column.formatter = () => '';
            column.component = {
                name: 'not-existing-component',
            };

            const definition = factory.create(column);
            expect(definition.formatter).toBe(formatCell);
        });

        it('uses the default formatter if the custom component misses a name prop', () => {
            column.formatter = () => '';
            column.component = {} as any;

            const definition = factory.create(column);
            expect(definition.formatter).toBe(formatCell);
        });
    });
});
