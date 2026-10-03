/**
 *
 * @param data
 */
export function isInteger(data: string): boolean {
    // eslint-disable-next-line unicorn/prefer-number-is-safe-integer -- integers beyond the safe range must still validate
    return Number.isInteger(Number(data));
}
