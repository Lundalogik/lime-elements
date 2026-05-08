import { h, VNode } from '@stencil/core';
import { ListComponent } from '../components/list-item/list-item.types';

/**
 * Renders a `ListComponent` as a JSX element.
 *
 * Returns `undefined` when no component is provided, when its `name` is
 * empty, or when its `name` is not a valid custom-element tag (i.e. does
 * not contain a hyphen). The hyphen requirement matches the HTML custom
 * element spec and prevents the slot from being used to render built-in
 * tags like `iframe`, `script`, or `a` with arbitrary attributes.
 *
 * If `extraClass` is provided, it is merged with any consumer-supplied
 * `class` from `component.props` and applied directly to the rendered
 * element. This lets host components style or position the rendered
 * element without wrapping it (which would otherwise block consumer
 * styles like `order` from reaching the surrounding flex layout).
 * @param component the `ListComponent` to render, or `undefined`
 * @param extraClass an optional class to apply to the rendered element,
 *                   merged with any consumer-supplied `class` in `props`
 */
export function renderListComponent(
    component: ListComponent | undefined,
    extraClass?: string
): VNode | undefined {
    if (!component?.name) {
        return;
    }

    if (!component.name.includes('-')) {
        return;
    }

    const Tag: any = component.name;
    const props = component.props || {};
    const mergedClass =
        [extraClass, props.class].filter(Boolean).join(' ') || undefined;

    return <Tag {...props} class={mergedClass} />;
}
