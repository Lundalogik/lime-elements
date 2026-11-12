import { getAggregatedValue, hasAggregation } from './aggregation';
import { Column, ColumnAggregatorType } from './table.types';

const rows = [
    { id: 1, amount: 10 },
    { id: 2, amount: 25 },
    { id: 3, amount: null },
    { id: 4, amount: '5' },
];

const aggregate = (aggregator: Column['aggregator'], data: object[] = rows) =>
    getAggregatedValue(
        { title: 'Amount', field: 'amount', aggregator: aggregator },
        data
    );

describe('getAggregatedValue', () => {
    describe('with a built-in aggregator', () => {
        it('sums the values, reading numeric strings as numbers', () => {
            expect(aggregate(ColumnAggregatorType.Sum)).toBe(40);
        });

        it('averages over the numerical cells, with at most two decimals', () => {
            expect(aggregate(ColumnAggregatorType.Average)).toBe('13.33');
            expect(
                aggregate(ColumnAggregatorType.Average, [
                    { amount: 1 },
                    { amount: 2 },
                    { amount: 2 },
                ])
            ).toBe('1.67');
        });

        it('finds the largest value', () => {
            expect(aggregate(ColumnAggregatorType.Maximum)).toBe(25);
        });

        it('finds the smallest value, leaving out empty cells', () => {
            expect(aggregate(ColumnAggregatorType.Minimum)).toBe(5);
        });

        it('finds the largest and smallest value among very many rows', () => {
            const manyRows = Array.from({ length: 200_000 }, (_, index) => ({
                amount: index,
            }));
            const column = (aggregator: ColumnAggregatorType): Column => ({
                title: 'Amount',
                field: 'amount',
                aggregator: aggregator,
            });

            expect(
                getAggregatedValue(
                    column(ColumnAggregatorType.Maximum),
                    manyRows
                )
            ).toBe(199_999);
            expect(
                getAggregatedValue(
                    column(ColumnAggregatorType.Minimum),
                    manyRows
                )
            ).toBe(0);
        });

        it('leaves out cells that are not numbers', () => {
            const mixed = [
                { amount: 10 },
                { amount: '' },
                { amount: true },
                { amount: 'text' },
                { amount: undefined },
            ];

            expect(aggregate(ColumnAggregatorType.Sum, mixed)).toBe(10);
            expect(aggregate(ColumnAggregatorType.Minimum, mixed)).toBe(10);
            expect(aggregate(ColumnAggregatorType.Average, mixed)).toBe('10');
        });

        it('counts the cells that are not empty', () => {
            expect(aggregate(ColumnAggregatorType.Count)).toBe(3);
        });

        it('counts 0 and false as cells that are not empty', () => {
            const values = [
                { amount: 0 },
                { amount: false },
                { amount: null },
                { amount: '' },
            ];

            expect(aggregate(ColumnAggregatorType.Count, values)).toBe(2);
        });

        it('shows nothing as the largest value of no rows', () => {
            expect(aggregate(ColumnAggregatorType.Maximum, [])).toBe('');
        });

        it('shows zero as the average of no rows', () => {
            expect(aggregate(ColumnAggregatorType.Average, [])).toBe('0');
        });
    });

    describe('with an aggregator function', () => {
        it('gives the function the column, the values and the rows', () => {
            const aggregator = vi.fn().mockReturnValue('total');
            const column: Column = {
                title: 'Amount',
                field: 'amount',
                aggregator: aggregator,
            };

            expect(getAggregatedValue(column, rows)).toBe('total');
            expect(aggregator).toHaveBeenCalledWith(
                column,
                [10, 25, null, '5'],
                rows
            );
        });
    });

    describe('with a value from the `aggregates` prop', () => {
        const aggregates = [{ field: 'amount', value: 1234 }];

        it('shows the given value', () => {
            const column: Column = { title: 'Amount', field: 'amount' };

            expect(getAggregatedValue(column, rows, aggregates)).toBe(1234);
        });

        it('formats the given value with the formatter of the column', () => {
            const column: Column = {
                title: 'Amount',
                field: 'amount',
                formatter: (value) => `${value} kr`,
            };

            expect(getAggregatedValue(column, rows, aggregates)).toBe(
                '1234 kr'
            );
        });

        it('prefers the aggregator of the column', () => {
            const column: Column = {
                title: 'Amount',
                field: 'amount',
                aggregator: ColumnAggregatorType.Sum,
            };

            expect(getAggregatedValue(column, rows, aggregates)).toBe(40);
        });
    });

    describe('with an aggregator that is not known', () => {
        let warn: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        });

        afterEach(() => {
            warn.mockRestore();
        });

        it('shows nothing, and warns once per column', () => {
            const column = {
                title: 'Amount',
                field: 'amount',
                aggregator: 'median',
            } as unknown as Column;

            expect(getAggregatedValue(column, rows)).toBeUndefined();
            expect(getAggregatedValue(column, rows)).toBeUndefined();
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain('median');
        });

        it('shows nothing for a name that every object inherits', () => {
            const column = {
                title: 'Amount',
                field: 'amount',
                aggregator: 'constructor',
            } as unknown as Column;

            expect(getAggregatedValue(column, rows)).toBeUndefined();
            expect(warn).toHaveBeenCalledTimes(1);
        });
    });

    it('shows nothing for a column without an aggregate', () => {
        const column: Column = { title: 'Name', field: 'name' };

        expect(
            getAggregatedValue(column, rows, [{ field: 'amount', value: 1 }])
        ).toBeUndefined();
    });
});

describe('when `aggregates` is null', () => {
    const column: Column = { title: 'Amount', field: 'amount' };

    it('shows nothing, and detects no aggregation', () => {
        expect(
            getAggregatedValue(column, [{ amount: 1 }], null)
        ).toBeUndefined();
        expect(hasAggregation([column], null)).toBe(false);
    });
});

describe('hasAggregation', () => {
    it('detects an aggregation from the aggregates prop when no column carries an aggregator', () => {
        expect(
            hasAggregation(
                [
                    { title: 'Name', field: 'name' },
                    { title: 'Amount', field: 'amount' },
                ],
                [{ field: 'amount', value: 100 }]
            )
        ).toBe(true);
    });

    it('does not detect an aggregation when no column field matches an aggregate', () => {
        expect(
            hasAggregation(
                [{ title: 'Name', field: 'name' }],
                [{ field: 'amount', value: 100 }]
            )
        ).toBe(false);
    });

    it("detects an aggregation from a column's own aggregator", () => {
        expect(
            hasAggregation([
                { title: 'Amount', field: 'amount', aggregator: () => 0 },
            ])
        ).toBe(true);
    });

    it('detects nothing without columns or aggregates', () => {
        expect(hasAggregation([])).toBe(false);
    });
});
