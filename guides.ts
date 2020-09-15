import { Guide } from 'kompendium';

export default [
    {
        name: 'Home',
        children: ['src/index.md', 'src/contributing.md', 'src/events.md'],
    },
    {
        name: 'DesignGuidelines',
        children: ['src/color-system.md', 'src/size-rhythms.md'],
    },
] as Guide[];
