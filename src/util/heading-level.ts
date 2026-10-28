import { HeadingLevel } from '../global/shared-types/heading-level.types';

/**
 * @param level - any value
 * @returns whether the value is a heading level, from `1` to `6`
 */
export function isHeadingLevel(level: unknown): level is HeadingLevel {
    return (
        typeof level === 'number' &&
        Number.isSafeInteger(level) &&
        level >= 1 &&
        level <= 6
    );
}
