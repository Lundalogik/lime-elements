export function isInteger(data: string): boolean {
    return Number.isInteger(Number(data));
}

export function isNumber(data: string): boolean {
    return Number.isFinite(Number(data));
}
