import {
    Column,
    ColumnAggregate,
    ColumnAggregatorType,
    RowData,
} from './table.types';
import { isEmpty, toNumber } from './values';

const AVERAGE_DECIMALS = 2;

const warnedColumns = new WeakSet<Column>();

const toNumbers = (values: unknown[]) =>
    values
        .map((value) => toNumber(value))
        .filter((value) => value !== undefined);

const sum = (values: unknown[]) =>
    toNumbers(values).reduce((total, value) => total + value, 0);

const average = (values: unknown[]) => {
    const numbers = toNumbers(values);
    if (numbers.length === 0) {
        return '0';
    }

    return String(
        Number.parseFloat(
            (sum(numbers) / numbers.length).toFixed(AVERAGE_DECIMALS)
        )
    );
};

const extreme = (
    values: unknown[],
    pick: (first: number, second: number) => number
) => {
    const numbers = toNumbers(values);
    if (numbers.length === 0) {
        return '';
    }

    let result = numbers[0];
    for (const value of numbers) {
        result = pick(result, value);
    }

    return result;
};

const builtInAggregators: Record<
    ColumnAggregatorType,
    (values: unknown[]) => unknown
> = {
    [ColumnAggregatorType.Average]: average,
    [ColumnAggregatorType.Maximum]: (values) => extreme(values, Math.max),
    [ColumnAggregatorType.Minimum]: (values) => extreme(values, Math.min),
    [ColumnAggregatorType.Sum]: sum,
    [ColumnAggregatorType.Count]: (values) =>
        values.filter((value) => !isEmpty(value)).length,
};

function warnAboutUnknownAggregator(column: Column) {
    if (warnedColumns.has(column)) {
        return;
    }

    warnedColumns.add(column);
    console.warn(
        `limel-table: unknown aggregator "${String(column.aggregator)}" for column "${String(column.field)}". Nothing is shown for it.`
    );
}

/**
 * @param columns - the columns of the table
 * @param aggregates - the aggregate values given to the table
 * @returns `true` when at least one column shows an aggregated value
 */
export function hasAggregation(
    columns: Column[],
    aggregates?: ColumnAggregate[] | null
): boolean {
    return columns.some(
        (column) =>
            !!column.aggregator ||
            !!aggregates?.some((aggregate) => aggregate.field === column.field)
    );
}

/**
 * @param column - the column to aggregate
 * @param rows - all rows of the table
 * @param aggregates - the aggregate values given to the table
 * @returns the value to show for the column in the aggregates row
 */
export function getAggregatedValue(
    column: Column,
    rows: RowData[],
    aggregates?: ColumnAggregate[] | null
): unknown {
    const aggregator = column.aggregator;
    if (typeof aggregator === 'function') {
        return aggregator(
            column,
            rows.map((row) => row[column.field]),
            rows
        );
    }

    if (aggregator) {
        if (!Object.hasOwn(builtInAggregators, aggregator)) {
            warnAboutUnknownAggregator(column);

            return;
        }

        return builtInAggregators[aggregator](
            rows.map((row) => row[column.field])
        );
    }

    const aggregate = aggregates?.find((item) => item.field === column.field);
    if (!aggregate) {
        return;
    }

    return column.formatter
        ? column.formatter(aggregate.value)
        : aggregate.value;
}
