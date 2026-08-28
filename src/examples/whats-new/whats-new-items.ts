export type ShowcaseItem = {
    componentName: string;
    heading: string;
    description: string;

    /**
     * ISO-like date string, same as previously used
     */
    releaseDate: string;

    /**
     * Release version, e.g. "38.28.0" (the card will prefix with 'v')
     */
    version: string;

    /**
     * Optional type, e.g. "component"
     */
    type?: string;

    /**
     * The tag name of the demo component to render inside the card
     */
    demoTag: string;
};

export const whatsNewItems: ShowcaseItem[] = [
    {
        componentName: 'Icon Button',
        heading: 'Display a helper label in tooltip',
        description:
            'Using the `helperLabel` prop, you can display additional helper text in the tooltip, for example a keyboard shortcut.',
        releaseDate: '2026-03-19',
        version: '39.8.0',
        demoTag: 'limel-example-icon-button-helper-label',
    },
    {
        componentName: 'Code Diff',
        heading: 'Brand new component',
        description:
            'A new component for showing differences between two versions of code or JSON objects. Removed lines are highlighted in red, added lines in green, and word-level changes within modified lines are highlighted with a darker shade.',
        releaseDate: '2026-03-16',
        version: '39.7.0',
        type: 'component',
        demoTag: 'limel-example-code-diff-basic',
    },
    {
        componentName: 'Card',
        heading: 'Make 3D effect optional',
        description:
            'By default, cards have a 3D tilt hover effect with a glow. You can now disable it by setting the `show3dEffect` prop to `false`.',
        releaseDate: '2026-03-10',
        version: '39.5.7',
        demoTag: 'limel-example-card-3d-effect',
    },
    {
        componentName: 'Card',
        heading: 'Show a selected state',
        description:
            'The card component now supports a `selected` property, allowing it to visually indicate when an article is selected.',
        releaseDate: '2026-02-25',
        version: '39.5.0',
        demoTag: 'limel-example-card-selected',
    },
    {
        componentName: 'Markdown',
        heading: 'Render custom elements',
        description:
            'Using the `whitelist` prop, you can allow custom HTML elements to be rendered inside the markdown component. Specify the tag name and allowed attributes for each element.',
        releaseDate: '2026-02-24',
        version: '39.4.0',
        demoTag: 'limel-example-markdown-custom-component',
    },
    {
        componentName: 'Slider',
        heading: 'Display percentage colors',
        description:
            'Set the `displaysPercentageColors` prop to `true` and the slider will automatically visualize percentage colors in real-time, changing with intervals of 10 as users drag the slider pin.',
        releaseDate: '2026-01-31',
        version: '38.44.0',
        demoTag: 'limel-example-slider-multiplier-percentage-colors',
    },
    {
        componentName: 'Chart',
        heading: 'Display axis labels, item text & values',
        description:
            'New props `displayAxisLabels`, `displayItemText`, and `displayItemValue` let you control the visibility of axis labels, item texts, and values for chart types that have X and Y axes.',
        releaseDate: '2026-01-29',
        version: '38.43.0',
        demoTag: 'limel-example-chart-axis-labels',
    },
    {
        componentName: 'Table',
        heading: 'Control pagination location',
        description:
            'A new `paginationLocation` property lets you control where the pagination controls are rendered, either at the `top` or `bottom` of the table.',
        releaseDate: '2026-01-15',
        version: '38.38.0',
        demoTag: 'limel-example-table-pagination',
    },
    {
        componentName: 'Code Editor',
        heading: 'Copy button',
        description:
            'The code editor now features a copy button that appears on hover and focus. Its visibility can be toggled using the `showCopyButton` property.',
        releaseDate: '2026-01-09',
        version: '38.36.0',
        demoTag: 'limel-example-code-editor-copy',
    },
    {
        componentName: 'Code Editor',
        heading: 'Standard Input Props',
        description:
            'With standard input field properties like `disabled`, `readonly`, and `required`, and with labels and helper text, the component now fits seamlessly into forms and interactive UIs.',
        releaseDate: '2025-12-16',
        version: '38.34.0',
        demoTag: 'limel-example-code-editor-composite',
    },
    {
        componentName: 'Form',
        heading: 'Remove and reorder',
        description:
            'By default, users are allowed to manipulate the array of items in by reordering them, or removing them. However, using allowItemReorder and allowItemRemoval props, you can control whether these actions are allowed.',
        releaseDate: '2025-11-21',
        version: '38.30.0',
        demoTag: 'limel-example-form-array-item-controls',
    },
    {
        componentName: 'Table',
        heading: 'Disable column sorting',
        description:
            'To prevent sorting altogether, set the sortableColumns property on limel-table to false. If you only want to disable sorting for a specific column, set the columns headerSort property to false.',
        releaseDate: '2025-10-30',
        version: '38.29.0',
        demoTag: 'limel-example-table-sorting-disabled',
    },
    {
        componentName: 'Color Picker',
        heading: 'Disable manual input',
        description:
            'Keep users from entering a color value manually by setting the `disableManualInput` property to false.',
        releaseDate: '2025-10-07',
        version: '38.28.0',
        demoTag: 'limel-example-color-picker-manual-input',
    },
    {
        componentName: 'Color Picker',
        heading: 'Add a custom palette',
        description:
            'You can easily provide your own array of colors, to be rendered as a palette of swatches. \n\n Each color can optionally have a name, which will also be used as tooltip and screen reader text.',
        releaseDate: '2025-10-03',
        version: '38.25.0',
        demoTag: 'limel-example-color-picker-custom-palette',
    },
    {
        componentName: 'Profile Picture',
        heading: 'Brand new component',
        description:
            'This component can be both used as a placeholder for an avatar, and in the same time act as an interactive element that enables users to upload a new profile picture.',
        releaseDate: '2025-09-24',
        version: '38.24.0',
        type: 'component',
        demoTag: 'limel-example-profile-picture-basic',
    },
    {
        componentName: 'Icon Button',
        heading: 'Flexibly change icon colors',
        description:
            'Using the Icon interface, you can easily customize the appearance of icons within the button, tweaking its color, backgroundColor, or adding an accessible title to it.',
        releaseDate: '2025-09-02',
        version: '38.23.0',
        demoTag: 'limel-example-icon-button-icon',
    },
];
