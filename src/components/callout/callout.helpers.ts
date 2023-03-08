import translate from '../../global/translations';

const calloutIcons: Record<string, string> = {
    note: 'info',
    important: 'exclamation_mark',
    tip: 'idea',
    caution: 'high_priority',
    warning: 'error',
};

export function getIcon(type: string = 'info'): string {
    return calloutIcons[type] ?? calloutIcons.note;
}

export function getHeading(
    type: string = 'note',
    language: string = 'en'
): string {
    const key = `callout.${type}`;

    try {
        return translate.get(key, language);
    } catch (error) {
        return translate.get(key, 'en');
    }
}
