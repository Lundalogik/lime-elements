import { hasImageFailed, rememberFailedImage } from './failed-images';

describe('failed images', () => {
    test('an image that failed to load is remembered', () => {
        rememberFailedImage('https://example.com/remembered.png');

        expect(hasImageFailed('https://example.com/remembered.png')).toBe(true);
        expect(hasImageFailed('https://example.com/other.png')).toBe(false);
    });

    test('the failures are forgotten when the browser is back online', () => {
        rememberFailedImage('https://example.com/offline.png');

        window.dispatchEvent(new Event('online'));

        expect(hasImageFailed('https://example.com/offline.png')).toBe(false);
    });
});
