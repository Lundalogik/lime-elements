import { CustomElementDefinition } from '../../global/shared-types/custom-element.types';

/**
 * Default whitelist of lime-elements components that are safe to render
 * inside `limel-markdown`.
 *
 * These components are self-contained and require no complex setup.
 * URL-bearing properties (e.g. `link.href` on `limel-chip`) are
 * automatically sanitized during hydration to prevent injection attacks.
 *
 * Consumers can extend this list via the `whitelist` prop or
 * `limel-config` global config.
 *
 * @internal
 */
export const DEFAULT_MARKDOWN_WHITELIST: CustomElementDefinition[] = [
    {
        tagName: 'limel-chip',
        attributes: [
            'text',
            'icon',
            'link',
            'badge',
            'disabled',
            'readonly',
            'selected',
            'type',
            'size',
        ],
    },
    {
        tagName: 'limel-icon',
        attributes: ['name', 'size', 'badge'],
    },
    {
        tagName: 'limel-badge',
        attributes: ['label'],
    },
    {
        tagName: 'limel-callout',
        attributes: ['heading', 'icon', 'type'],
    },
    {
        tagName: 'limel-linear-progress',
        attributes: ['value', 'indeterminate'],
    },
    {
        tagName: 'limel-circular-progress',
        attributes: [
            'value',
            'max-value',
            'prefix',
            'suffix',
            'size',
            'display-percentage-colors',
        ],
    },
    {
        tagName: 'limel-spinner',
        attributes: ['size'],
    },
    {
        tagName: 'limel-info-tile',
        attributes: ['value', 'icon', 'label', 'prefix', 'suffix', 'badge'],
    },
];
