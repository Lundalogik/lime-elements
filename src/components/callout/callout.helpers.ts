import translate from '../../global/translations';

const calloutIcons: Record<string, string> = {
    note: 'info',
    important: 'exclamation_mark',
    tip: 'idea',
    caution: 'high_priority',
    warning: 'error',
};

/**
 *
 * @param icon
 * @param type
 */
export function getIcon(icon: string, type: string = 'note'): string {
    if (icon) {
        return icon;
    }

    return calloutIcons[type] ?? calloutIcons.note;
}

/**
 *
 * @param heading
 * @param type
 * @param language
 */
export function getHeading(
    heading: string,
    type: string = 'note',
    language: string = 'en'
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
