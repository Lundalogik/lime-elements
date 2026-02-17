/**
 * Format a file size in bytes into a human readable string.
 *
 * Uses base 1024 units (binary prefixes without the "i" designation)
 * and applies adaptive precision: one decimal for values < 10 of the
 * chosen unit, otherwise no decimals.
 *
 * Examples:
 *  - 0 => "0 B"
 *  - 512 => "512 B"
 *  - 1536 => "1.5 KB"
 *  - 1048576 => "1 MB"
 *  - 5368709120 => "5 GB"
 *  - formatBytes(5347737600, 2) => "4.98 GB" (value < 10 so two decimals)
 *
 * @param bytes - the size in bytes
 * @param decimals - max number of decimals for small unit values (default: 1)
 * @returns formatted size string
 */
export function formatBytes(
    bytes: number | undefined | null,
    decimals = 1
): string {
    if (bytes == null || Number.isNaN(bytes)) {
        return '';
    }

    if (bytes < 0) {
        return '';
    }

    if (bytes === 0) {
        return '0 B';
    }

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.max(
        0,
        Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)))
    );

    const value = bytes / Math.pow(k, i);
    const safeDecimals = Number.isFinite(decimals) ? Math.trunc(decimals) : 0;
    const precision = value < 10 ? Math.min(100, Math.max(0, safeDecimals)) : 0; // only keep decimals for small values
    const rounded = Number.parseFloat(value.toFixed(precision));
    return `${rounded} ${sizes[i]}`;
}
