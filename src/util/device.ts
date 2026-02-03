function getUserAgent(): string {
    return typeof navigator === 'undefined' ? '' : (navigator.userAgent ?? '');
}

function getPlatform(): string {
    if (typeof navigator === 'undefined') {
        return '';
    }

    return (
        (navigator as any).userAgentData?.platform ?? navigator.platform ?? ''
    );
}

/**
 *
 */
export function isIOSDevice() {
    const userAgent = getUserAgent();
    return /iPad|iPhone|iPod/i.test(userAgent) && !(globalThis as any).MSStream;
}

/**
 *
 */
export function isAndroidDevice() {
    const userAgent = getUserAgent();
    return /Android/i.test(userAgent);
}

/**
 *
 */
export function isMobileDevice() {
    return isAndroidDevice() || isIOSDevice();
}

/**
 * Detects whether the user is on an Apple device (iOS/iPadOS/macOS).
 */
export function isAppleDevice(): boolean {
    const ua = getUserAgent();
    const platform = getPlatform();

    const isIPadIPhoneIPod = /iPad|iPhone|iPod/i.test(ua);
    // Note: iPadOS 13+ reports itself as Mac, so isMacLike covers both
    // macOS and iPadOS.
    const isMacLike = /Mac/i.test(platform);

    return isIPadIPhoneIPod || isMacLike;
}
