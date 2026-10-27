import { pick } from 'lodash-es';
import { Help } from '../help/help.types';

const HELP_PROPERTIES = [
    'openDirection',
    'readMoreLink',
    'trigger',
    'value',
] as const;

/**
 * @param help - the help of a field, from its schema
 * @returns the properties of `limel-help` that the help sets, and no others
 */
export function getHelpProps(help: string | Partial<Help>): Partial<Help> {
    if (typeof help === 'string') {
        return { value: help };
    }

    return pick(help, HELP_PROPERTIES);
}
