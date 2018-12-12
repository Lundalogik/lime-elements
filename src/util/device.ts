export function isIOSDevice() {
    return /iPad|iPhone|iPod/i.test(window.navigator.userAgent);
}

export function isAndroidDevice() {
    return /Android/i.test(window.navigator.userAgent);
}
