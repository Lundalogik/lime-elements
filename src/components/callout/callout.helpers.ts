import translate from '../../global/translations';

const calloutIcons: Record<string, string> = {
    note: 'info',
    important: 'exclamation_mark',
    tip: 'idea',
    caution: 'high_priority',
    warning: 'error',
};

export function getIcon(icon: string, type: string = 'note'): string {
    if (icon) {
        return icon;
    }

    return calloutIcons[type] ?? calloutIcons.note;
}

export function getHeading(
    heading: string,
    type: string = 'note',
    language: string = 'en',
): string {
    if (heading) {
        return heading;
    }

    const key = `callout.${type}`;

    try {
        return translate.get(key, language);
    } catch {
        return translate.get(key, 'en');
    }
}
