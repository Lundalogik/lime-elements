import { Fullscreen } from './fullscreen';

describe('Fullscreen', () => {
    describe('when the browser supports the Fullscreen API', () => {
        let element: any;
        let requestFullscreenSpy: ReturnType<typeof vi.fn>;
        let fullscreen: Fullscreen;

        beforeEach(() => {
            requestFullscreenSpy = vi.fn();
            element = { requestFullscreen: requestFullscreenSpy };
            fullscreen = new Fullscreen(element);
        });

        it('reports as supported', () => {
            expect(fullscreen.isSupported()).toBe(true);
        });

        it('calls the native method with the element bound as `this`', () => {
            fullscreen.requestFullscreen();

            expect(requestFullscreenSpy).toHaveBeenCalledTimes(1);
            expect(requestFullscreenSpy.mock.contexts[0]).toBe(element);
        });
    });

    describe('when the browser supports a vendor-prefixed Fullscreen API', () => {
        it('uses webkitRequestFullscreen when available', () => {
            const webkitRequestFullscreen = vi.fn();
            const fullscreen = new Fullscreen({ webkitRequestFullscreen });

            expect(fullscreen.isSupported()).toBe(true);

            fullscreen.requestFullscreen();
            expect(webkitRequestFullscreen).toHaveBeenCalledTimes(1);
        });
    });

    describe('when the browser does not support the Fullscreen API (e.g., iPhone Safari)', () => {
        let fullscreen: Fullscreen;

        beforeEach(() => {
            // Construction must not throw — this is the regression we're guarding against.
            fullscreen = new Fullscreen({});
        });

        it('reports as not supported', () => {
            expect(fullscreen.isSupported()).toBe(false);
        });

        it('is a no-op when requestFullscreen is called', () => {
            expect(() => fullscreen.requestFullscreen()).not.toThrow();
        });

        it('is a no-op when toggle is called', () => {
            expect(() => fullscreen.toggle()).not.toThrow();
        });
    });
});
