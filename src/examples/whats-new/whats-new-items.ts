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
        heading: 'Set standard input props',
        description:
            'Like other input fields, the icon picker component now supports standard input field properties, such as `disabled`, `readonly`, and `required`.',
        releaseDate: '2025-10-03',
        version: '38.26.0',
        demoTag: 'limel-example-color-picker-composite',
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
    {
        componentName: 'Radio Button Group',
        heading: 'Fresh new component',
        description:
            'The Radio Button component provides a convenient way to create a group of radio buttons from an array of options. \n\n Radio buttons allow users to select a single option from multiple choices, making them ideal for exclusive selections.',
        releaseDate: '2025-08-18',
        version: '38.22.0',
        type: 'component',
        demoTag: 'limel-example-radio-button-group-icons',
    },
    {
        componentName: 'Slider',
        heading: 'Set required and invalid states',
        description:
            'New properties for the slider component let you indicate an invalid state or mark it as required.',
        releaseDate: '2025-08-05',
        version: '38.21.0',
        demoTag: 'limel-whats-new-example-slider',
    },
    {
        componentName: 'Chip',
        heading: 'Set chip Size',
        description:
            'When the size property is set to small, the chip will render with a smaller height and gap.',
        releaseDate: '2025-07-03',
        version: '38.19.0',
        demoTag: 'limel-example-chip-size',
    },
    {
        componentName: 'Info Tile',
        heading: 'Add custom content',
        description:
            'The component offers a primary `slot` that can be used to display any custom content.',
        releaseDate: '2025-06-11',
        version: '38.16.0',
        demoTag: 'limel-example-info-tile-primary-slot',
    },
    {
        componentName: 'Collapsible Section',
        heading: 'Add an icon in the header',
        description:
            'A new property lets you add an icon to the header of the section.',
        releaseDate: '2025-06-10',
        version: '38.15.0',
        demoTag: 'limel-example-collapsible-section-icon',
    },
    {
        componentName: 'Chip',
        heading: 'Color the border, when readonly',
        description:
            'In readonly state, the border color of the chip can be customized, using `--chip-readonly-border-color`.',
        releaseDate: '2025-06-09',
        version: '38.13.7',
        demoTag: 'limel-example-chip-readonly-border',
    },
    {
        componentName: 'Text Editor',
        heading: 'Enjoy a minimalist editor experience',
        description:
            'The new `no-toolbar` UI type turns the editor into a basic textarea appearance without any text styling toolbar. \n\n This mode is suitable for scenarios where you want to provide a simple text input without any visible formatting options; but still provide support for markdown syntax and rich text, using hotkeys or when pasting.',
        releaseDate: '2025-04-22',
        version: '38.9.0',
        demoTag: 'limel-example-text-editor-ui',
    },
    {
        componentName: 'Collapsible Section',
        heading: 'Invalid State',
        description:
            "When a section's `invalid` prop is set to `true`, it can display a visual feedback, as well as an accessible indication to the assistive technologies, to indicate that the content inside the section is invalid; both when the section is expanded or collapsed.",
        releaseDate: '2025-04-16',
        version: '38.8.0',
        demoTag: 'limel-example-collapsible-section-invalid',
    },
];
