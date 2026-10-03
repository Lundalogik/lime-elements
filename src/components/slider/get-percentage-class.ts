/**
 *
 * @param value
 */
export function getPercentageClass(value: number) {
    if (value === 0) {
        return 'percent-0';
    }

    if (value < 0.1) {
        return 'percent-0-10';
    }

    if (value < 0.2) {
        return 'percent-10-20';
    }

    if (value < 0.3) {
        return 'percent-20-30';
    }

    if (value < 0.4) {
        return 'percent-30-40';
    }

    if (value < 0.5) {
        return 'percent-40-50';
    }

    if (value < 0.6) {
        return 'percent-50-60';
    }

    if (value < 0.7) {
        return 'percent-60-70';
    }

    if (value < 0.8) {
        return 'percent-70-80';
    }

    if (value < 0.9) {
        return 'percent-80-90';
    }

    return 'percent-90-100';
}
