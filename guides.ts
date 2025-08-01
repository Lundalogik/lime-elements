import { Guide } from 'kompendium';

export default [
    {
        name: 'Home',
        children: ['src/contributing.md', 'src/events.md', 'src/theming.md'],
    },
    {
        name: 'DesignGuidelines',
        children: [
            'src/design-guidelines/color-system/color-system.md',
            'src/design-guidelines/shadows/shadows-and-depth.md',
            'src/design-guidelines/size/size-rhythms.md',
            'src/design-guidelines/action-buttons/action-buttons.md',
            'src/design-guidelines/declutter/declutter.md',
            'src/design-guidelines/disabled-hidden/disabled-hidden.md',
            'src/design-guidelines/disabled-vs-readonly/disabled-vs-readonly.md',
            'src/design-guidelines/boolean/switch-vs-checkbox.md',
            'src/design-guidelines/boolean/labeling-boolean-fields.md',
        ],
    },
] as Guide[];
