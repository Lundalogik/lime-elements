import {
    getStoredHighlightColor,
    storeHighlightColor,
} from './highlight-color-storage';
import { DEFAULT_HIGHLIGHT_COLOR } from './highlight-mark';

const STORAGE_KEY = 'limel-text-editor.highlight-color';

const stubLocalStorage = (): Map<string, string> => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
            store.set(key, value);
        },
    });

    return store;
};

describe('highlight color storage', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('getStoredHighlightColor', () => {
        it('returns the default when localStorage is unavailable', () => {
            vi.stubGlobal('localStorage', undefined);

            expect(getStoredHighlightColor()).toBe(DEFAULT_HIGHLIGHT_COLOR);
        });

        it('returns the default when nothing is stored', () => {
            stubLocalStorage();

            expect(getStoredHighlightColor()).toBe(DEFAULT_HIGHLIGHT_COLOR);
        });

        it('returns the default when the stored value is not a color', () => {
            const store = stubLocalStorage();
            store.set(STORAGE_KEY, 'not-a-color');

            expect(getStoredHighlightColor()).toBe(DEFAULT_HIGHLIGHT_COLOR);
        });

        it('returns the default when reading throws', () => {
            vi.stubGlobal('localStorage', {
                getItem: () => {
                    throw new Error('storage access denied');
                },
            });

            expect(getStoredHighlightColor()).toBe(DEFAULT_HIGHLIGHT_COLOR);
        });

        it('canonicalizes the stored color', () => {
            const store = stubLocalStorage();
            store.set(STORAGE_KEY, 'rgb(255, 0, 0)');

            expect(getStoredHighlightColor()).toBe('#ff0000');
        });
    });

    describe('storeHighlightColor', () => {
        it('round-trips a valid color', () => {
            stubLocalStorage();

            storeHighlightColor('#ff0000');

            expect(getStoredHighlightColor()).toBe('#ff0000');
        });

        it('does nothing when localStorage is unavailable', () => {
            vi.stubGlobal('localStorage', undefined);

            expect(() => storeHighlightColor('#ff0000')).not.toThrow();
        });

        it('swallows write failures', () => {
            vi.stubGlobal('localStorage', {
                getItem: () => null,
                setItem: () => {
                    throw new Error('quota exceeded');
                },
            });

            expect(() => storeHighlightColor('#ff0000')).not.toThrow();
        });
    });
});
