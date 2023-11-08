import NumAbbr from 'number-abbreviate';

/**
 * Abbreviate a number
 *
 * @param value - the number to abbreviate
 * @returns abbreviated number
 */
export function abbreviate(value: number): string {
    if (typeof value !== 'number') {
        return '';
    }

    const units = ['k', 'M', 'B', 'T'];
    const numAbbr = new NumAbbr(units);

    return numAbbr.abbreviate(value, 1);
}
