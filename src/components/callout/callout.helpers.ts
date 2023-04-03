import translate from '../../global/translations';

const calloutIcons: Record<string, string> = {
    danger: 'poison',
    info: 'info',
    note: 'appointment_reminders',
    tip: 'idea',
    warning: 'error',
    success: 'ok',
    failure: 'high_priority',
    example: 'test_tube',
    quote: 'quote_left',
    question: 'help',
};

export function getIcon(icon: string, type: string = 'info'): string {
    if (icon) {
        return icon;
    }

    return calloutIcons[type] ?? calloutIcons.info;
}

export function getHeading(
    heading: string,
    type: string = 'info',
    language: string = 'en'
): string {
    if (heading) {
        return heading;
    }

    const key = `callout.${type}`;

    try {
        return translate.get(key, language);
    } catch (error) {
        return translate.get(key, 'en');
    }
}
