import { Guide } from 'kompendium';

export default [
    {
        name: 'Home',
        children: ['src/index.md', 'src/contributing.md', 'src/events.md'],
    },
    {
        name: 'DesignGuidelines',
        children: [
            'src/design-guidelines/color-system/color-system.md',
            'src/design-guidelines/shadows/shadows-and-depth.md',
            'src/design-guidelines/size/size-rhythms.md',
            'src/design-guidelines/action-buttons/action-buttons.md',
            'src/design-guidelines/decluttering.md',
        ],
    },
] as Guide[];
