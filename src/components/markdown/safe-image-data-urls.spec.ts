import { isSafeImageDataUrl } from './safe-image-data-urls';

describe('isSafeImageDataUrl', () => {
    describe('accepts', () => {
        it.each([
            'data:image/png;base64,iVBORw0KGgo=',
            'data:image/jpeg;base64,/9j/4AAQ==',
            'data:image/gif;base64,R0lGODlh',
            'data:image/webp;base64,UklGRg==',
            'data:image/bmp;base64,Qk0=',
            'data:image/x-icon;base64,AAABAA==',
        ])('an allowed image format: %s', (url) => {
            expect(isSafeImageDataUrl(url)).toBe(true);
        });

        it('an uppercase protocol and MIME type', () => {
            expect(
                isSafeImageDataUrl('DATA:IMAGE/PNG;base64,iVBORw0KGgo=')
            ).toBe(true);
        });

        it('surrounding whitespace', () => {
            expect(
                isSafeImageDataUrl('  data:image/png;base64,iVBORw0KGgo=  ')
            ).toBe(true);
        });

        it('a charset parameter before the encoding', () => {
            expect(
                isSafeImageDataUrl('data:image/png;charset=utf-8;base64,iVBOR')
            ).toBe(true);
        });

        it('image data that is not base64 encoded', () => {
            expect(isSafeImageDataUrl('data:image/gif,GIF87a')).toBe(true);
        });
    });

    describe('rejects', () => {
        it('an svg, which can carry script', () => {
            expect(
                isSafeImageDataUrl('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=')
            ).toBe(false);
        });

        it.each([
            'data:text/html;base64,PHNjcmlwdD48L3NjcmlwdD4=',
            'data:application/javascript;base64,YWxlcnQoMSk=',
            'data:text/plain,hello',
        ])('a MIME type that is not an image: %s', (url) => {
            expect(isSafeImageDataUrl(url)).toBe(false);
        });

        it('a data URL without a MIME type', () => {
            expect(isSafeImageDataUrl('data:;base64,iVBORw0KGgo=')).toBe(false);
        });

        it('a data URL with no comma to end the header', () => {
            expect(isSafeImageDataUrl('data:image/png;base64')).toBe(false);
        });

        it.each([
            'https://example.com/cat.png',
            'http://example.com/cat.png',
            'javascript:alert(1)',
            '/relative/cat.png',
            '',
        ])('a URL that is not a data URL: %s', (url) => {
            expect(isSafeImageDataUrl(url)).toBe(false);
        });
    });
});
