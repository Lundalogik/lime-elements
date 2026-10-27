import React, { PropsWithChildren, useContext } from 'react';
import { Help } from '../../help/help.types';
import { HeadingLevel } from '../form.types';

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

/**
 * The heading level that a title at the current depth in the form gets.
 */
export const HeadingLevelContext = React.createContext<HeadingLevel>(1);

/**
 * @param level - a heading level
 * @returns the level of the headings one step below, down to `h6`
 */
export function nextHeadingLevel(level: HeadingLevel): HeadingLevel {
    return Math.min(level + 1, 6) as HeadingLevel;
}

export interface HeaderProps {
    title: string;
    description?: string;
    help?: string | Partial<Help>;
}

/**
 * The title of a field, drawn with the heading level of its depth.
 *
 * @param props
 * @param props.title - the title of the field
 * @param props.description - the description of the field, in markdown
 * @param props.help - the help of the field
 */
export function Header({ title, description, help }: HeaderProps) {
    const headingLevel = useContext(HeadingLevelContext);

    return React.createElement('limel-form-header', {
        heading: title,
        headingLevel: headingLevel,
        description: description,
        help: help,
    });
}

export interface BelowHeadingProps {
    hasHeading: boolean;
}

/**
 * Gives the fields it wraps one heading level more than the level of the
 * heading above them, if there is one.
 *
 * @param props
 * @param props.hasHeading - whether the fields are below a heading
 * @param props.children - the fields
 */
export function BelowHeading({
    hasHeading,
    children,
}: PropsWithChildren<BelowHeadingProps>) {
    const level = useContext(HeadingLevelContext);

    return React.createElement(
        HeadingLevelContext.Provider,
        { value: hasHeading ? nextHeadingLevel(level) : level },
        children
    );
}
