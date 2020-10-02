import {
    ColumnDefinitionFactory,
    createCustomComponent,
    createFormatter,
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
        let formatCell: Function;

        describe('when formatter is given', () => {
            beforeEach(() => {
                column.formatter = (v) => `formatted: ${v}`;
                formatCell = createFormatter(column, pool);
            });

            it('returns the formatted value', () => {
                expect(formatCell(cell, column)).toEqual('formatted: FOO');
            });
        });

        describe('when component is given', () => {
            beforeEach(() => {
                column.component = {
                    name: 'h1',
                };
                formatCell = createFormatter(column, pool);
            });

            it('returns the formatted value', () => {
                const component = formatCell(cell, column) as HTMLElement;
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
                formatCell = createFormatter(column, pool);
            });

            it('returns the formatted value', () => {
                const component = formatCell(cell, column) as HTMLElement;
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
                    formatCell = createFormatter(column, pool);
                });

                it('escapes the value', () => {
                    expect(formatCell(cell, column)).toEqual(escaped);
                });
            });

            describe('when formatter is given', () => {
                beforeEach(() => {
                    column.formatter = (v) => `formatted: ${v}`;
                    formatCell = createFormatter(column, pool);
                });

                it('escapes the value', () => {
                    expect(formatCell(cell, column)).toEqual(
                        `formatted: ${escaped}`
                    );
                });
            });

            describe('when component is given', () => {
                beforeEach(() => {
                    column.component = {
                        name: 'h1',
                    };
                    formatCell = createFormatter(column, pool);
                });

                it('returns the formatted value', () => {
                    const component = formatCell(cell, column) as HTMLElement;
                    expect(component.tagName.toLowerCase()).toEqual('h1');
                    expect(component).toHaveProperty('value', escaped);
                });
            });

            describe('when both formatter and component is given', () => {
                beforeEach(() => {
                    column.formatter = (v) => `formatted: ${v}`;
                    column.component = {
                        name: 'h1',
                    };
                    formatCell = createFormatter(column, pool);
                });

                it('returns the formatted value', () => {
                    const component = formatCell(cell, column) as HTMLElement;
                    expect(component.tagName.toLowerCase()).toEqual('h1');
                    expect(component).toHaveProperty(
                        'value',
                        `formatted: ${escaped}`
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
                formatCell = createFormatter(column, pool);
            });

            it('does not deep escape', () => {
                expect(formatCell(cell, column)).toEqual([
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
    });
});
