export function getPercentageClass(value: number) {
    const tenPercent = 0.1;
    const twentyPercent = 0.2;
    const thirtyPercent = 0.3;
    const fortyPercent = 0.4;
    const fiftyPercent = 0.5;
    const sixtyPercent = 0.6;
    const seventyPercent = 0.7;
    const eightyPercent = 0.8;
    const ninetyPercent = 0.9;

    if (value === 0) {
        return 'percent-0';
    }

    if (value < tenPercent) {
        return 'percent-0-10';
    }

    if (value < twentyPercent) {
        return 'percent-10-20';
    }

    if (value < thirtyPercent) {
        return 'percent-20-30';
    }

    if (value < fortyPercent) {
        return 'percent-30-40';
    }

    if (value < fiftyPercent) {
        return 'percent-40-50';
    }

    if (value < sixtyPercent) {
        return 'percent-50-60';
    }

    if (value < seventyPercent) {
        return 'percent-60-70';
    }

    if (value < eightyPercent) {
        return 'percent-70-80';
    }

    if (value < ninetyPercent) {
        return 'percent-80-90';
    }

    return 'percent-90-100';
}
