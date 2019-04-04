const userAgent = window.navigator.userAgent;

export function isIOSDevice() {
    return /iPad|iPhone|iPod/i.test(userAgent) && !(window as any).MSStream;
}

export function isAndroidDevice() {
    return /Android/i.test(userAgent);
}

export function isMobileDevice() {
    return isAndroidDevice() || isIOSDevice();
}
