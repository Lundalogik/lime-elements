import {
    findNavigationTarget,
    findTabStop,
    isNavigationKey,
    NavigationOptions,
    NO_NAVIGATION_TARGET,
} from './keyboard-navigation';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Date'];

const row: NavigationOptions<string> = { orientation: 'horizontal' };
const column: NavigationOptions<string> = { orientation: 'vertical' };
const wrappingRow: NavigationOptions<string> = { ...row, wrap: true };

const rowWithout = (...unreachable: string[]): NavigationOptions<string> => ({
    ...row,
    isDisabled: (item) => unreachable.includes(item),
});

describe('isNavigationKey', () => {
    const keyboardEvent = (init: KeyboardEventInit): KeyboardEvent =>
        new KeyboardEvent('keydown', init);

    describe('in a row', () => {
        it.each([['ArrowLeft'], ['ArrowRight'], ['Home'], ['End']])(
            'accepts "%s"',
            (key: string) => {
                const event = keyboardEvent({ key: key });

                expect(isNavigationKey(event, row)).toBe(true);
            }
        );

        it.each([
            ['ArrowUp'],
            ['ArrowDown'],
            ['PageUp'],
            ['PageDown'],
            ['Enter'],
            [' '],
            ['Tab'],
            ['Escape'],
            ['a'],
        ])('rejects "%s"', (key: string) => {
            const event = keyboardEvent({ key: key });

            expect(isNavigationKey(event, row)).toBe(false);
        });
    });

    describe('in a column', () => {
        it.each([['ArrowUp'], ['ArrowDown'], ['Home'], ['End']])(
            'accepts "%s"',
            (key: string) => {
                const event = keyboardEvent({ key: key });

                expect(isNavigationKey(event, column)).toBe(true);
            }
        );

        it.each([['ArrowLeft'], ['ArrowRight'], ['Enter'], ['a']])(
            'rejects "%s"',
            (key: string) => {
                const event = keyboardEvent({ key: key });

                expect(isNavigationKey(event, column)).toBe(false);
            }
        );
    });

    it('accepts a key that is pressed with shift', () => {
        const event = keyboardEvent({ key: 'ArrowRight', shiftKey: true });

        expect(isNavigationKey(event, row)).toBe(true);
    });

    it.each([['altKey'], ['ctrlKey'], ['metaKey']])(
        'rejects a key that is pressed with %s, which the browser uses',
        (modifier: string) => {
            // Alt and Left is "back" in a browser, and Home and End scroll the
            // page when combined with Ctrl or Cmd.
            const event = keyboardEvent({ key: 'ArrowLeft', [modifier]: true });

            expect(isNavigationKey(event, row)).toBe(false);
        }
    );
});

describe('findNavigationTarget', () => {
    it('finds nothing without items', () => {
        expect(findNavigationTarget([], 'ArrowRight', 0, row)).toBe(
            NO_NAVIGATION_TARGET
        );
        expect(findNavigationTarget([], 'Home', 0, row)).toBe(
            NO_NAVIGATION_TARGET
        );
    });

    describe('in a row', () => {
        it('moves to the next item with the right arrow', () => {
            expect(findNavigationTarget(FRUITS, 'ArrowRight', 0, row)).toBe(1);
            expect(findNavigationTarget(FRUITS, 'ArrowRight', 2, row)).toBe(3);
        });

        it('moves to the previous item with the left arrow', () => {
            expect(findNavigationTarget(FRUITS, 'ArrowLeft', 3, row)).toBe(2);
            expect(findNavigationTarget(FRUITS, 'ArrowLeft', 1, row)).toBe(0);
        });

        it('ignores the up and down arrows', () => {
            expect(findNavigationTarget(FRUITS, 'ArrowDown', 1, row)).toBe(
                NO_NAVIGATION_TARGET
            );
            expect(findNavigationTarget(FRUITS, 'ArrowUp', 1, row)).toBe(
                NO_NAVIGATION_TARGET
            );
        });
    });

    describe('in a column', () => {
        it('moves to the next item with the down arrow', () => {
            expect(findNavigationTarget(FRUITS, 'ArrowDown', 1, column)).toBe(
                2
            );
        });

        it('moves to the previous item with the up arrow', () => {
            expect(findNavigationTarget(FRUITS, 'ArrowUp', 1, column)).toBe(0);
        });

        it('ignores the left and right arrows', () => {
            expect(findNavigationTarget(FRUITS, 'ArrowRight', 1, column)).toBe(
                NO_NAVIGATION_TARGET
            );
            expect(findNavigationTarget(FRUITS, 'ArrowLeft', 1, column)).toBe(
                NO_NAVIGATION_TARGET
            );
        });
    });

    describe('with Home and End', () => {
        it.each([[row], [column]])('moves to the first item', (options) => {
            expect(findNavigationTarget(FRUITS, 'Home', 2, options)).toBe(0);
        });

        it.each([[row], [column]])('moves to the last item', (options) => {
            expect(findNavigationTarget(FRUITS, 'End', 1, options)).toBe(3);
        });

        it('stays where it is on the item it is already on', () => {
            expect(findNavigationTarget(FRUITS, 'Home', 0, row)).toBe(0);
            expect(findNavigationTarget(FRUITS, 'End', 3, row)).toBe(3);
        });
    });

    describe('at the end of the items', () => {
        it('stays on the last item by default', () => {
            expect(findNavigationTarget(FRUITS, 'ArrowRight', 3, row)).toBe(3);
        });

        it('stays on the first item by default', () => {
            expect(findNavigationTarget(FRUITS, 'ArrowLeft', 0, row)).toBe(0);
        });

        it('continues at the first item, when it wraps', () => {
            expect(
                findNavigationTarget(FRUITS, 'ArrowRight', 3, wrappingRow)
            ).toBe(0);
        });

        it('continues at the last item, when it wraps', () => {
            expect(
                findNavigationTarget(FRUITS, 'ArrowLeft', 0, wrappingRow)
            ).toBe(3);
        });

        it('stays on the only item, even when it wraps', () => {
            expect(
                findNavigationTarget(['Apple'], 'ArrowRight', 0, wrappingRow)
            ).toBe(0);
        });
    });

    describe('without a current item', () => {
        it.each([[NO_NAVIGATION_TARGET], [99]])(
            'starts at the first item going forward, from %s',
            (current: number) => {
                expect(
                    findNavigationTarget(FRUITS, 'ArrowRight', current, row)
                ).toBe(0);
            }
        );

        it.each([[NO_NAVIGATION_TARGET], [99]])(
            'starts at the last item going back, from %s',
            (current: number) => {
                expect(
                    findNavigationTarget(FRUITS, 'ArrowLeft', current, row)
                ).toBe(3);
            }
        );
    });

    describe('with items that cannot be reached', () => {
        it('moves past them', () => {
            const options = rowWithout('Banana', 'Cherry');

            expect(findNavigationTarget(FRUITS, 'ArrowRight', 0, options)).toBe(
                3
            );
            expect(findNavigationTarget(FRUITS, 'ArrowLeft', 3, options)).toBe(
                0
            );
        });

        it('moves on from an item that cannot be reached', () => {
            const options = rowWithout('Banana');

            expect(findNavigationTarget(FRUITS, 'ArrowRight', 1, options)).toBe(
                2
            );
            expect(findNavigationTarget(FRUITS, 'ArrowLeft', 1, options)).toBe(
                0
            );
        });

        it('moves to the first item that can be reached with Home', () => {
            const options = rowWithout('Apple');

            expect(findNavigationTarget(FRUITS, 'Home', 3, options)).toBe(1);
        });

        it('moves to the last item that can be reached with End', () => {
            const options = rowWithout('Date');

            expect(findNavigationTarget(FRUITS, 'End', 0, options)).toBe(2);
        });

        it('stays, when the rest of the items cannot be reached', () => {
            const options = rowWithout('Cherry', 'Date');

            expect(findNavigationTarget(FRUITS, 'ArrowRight', 1, options)).toBe(
                1
            );
        });

        it('wraps past them', () => {
            const options = { ...wrappingRow, ...rowWithout('Apple', 'Date') };

            expect(findNavigationTarget(FRUITS, 'ArrowRight', 2, options)).toBe(
                1
            );
            expect(findNavigationTarget(FRUITS, 'ArrowLeft', 1, options)).toBe(
                2
            );
        });

        it('stays, when it wraps but nothing else can be reached', () => {
            const options = {
                ...wrappingRow,
                ...rowWithout('Apple', 'Cherry', 'Date'),
            };

            expect(findNavigationTarget(FRUITS, 'ArrowRight', 1, options)).toBe(
                1
            );
        });

        it('starts at the first item that can be reached, without a current item', () => {
            const options = rowWithout('Apple');

            expect(
                findNavigationTarget(
                    FRUITS,
                    'ArrowRight',
                    NO_NAVIGATION_TARGET,
                    options
                )
            ).toBe(1);
        });

        it('starts at the last item that can be reached, without a current item', () => {
            const options = rowWithout('Date');

            expect(
                findNavigationTarget(
                    FRUITS,
                    'ArrowLeft',
                    NO_NAVIGATION_TARGET,
                    options
                )
            ).toBe(2);
        });

        it.each([['ArrowRight'], ['ArrowLeft'], ['Home'], ['End']])(
            'finds nothing with "%s", when none of the items can be reached',
            (key: string) => {
                const options = rowWithout(...FRUITS);

                expect(findNavigationTarget(FRUITS, key, 1, options)).toBe(
                    NO_NAVIGATION_TARGET
                );
            }
        );

        it('hands the items to the function that tells whether they can be reached', () => {
            const items = [{ label: 'a' }, { label: 'b', disabled: true }];
            const isDisabled = vi.fn((item: { disabled?: boolean }) =>
                Boolean(item.disabled)
            );

            findNavigationTarget(items, 'ArrowRight', 0, {
                orientation: 'horizontal',
                isDisabled: isDisabled,
            });

            expect(isDisabled).toHaveBeenCalledWith(items[1]);
        });
    });

    describe('with other keys', () => {
        it.each([['Enter'], [' '], ['Tab'], ['PageDown'], ['a'], ['']])(
            'finds nothing with "%s"',
            (key: string) => {
                expect(findNavigationTarget(FRUITS, key, 1, row)).toBe(
                    NO_NAVIGATION_TARGET
                );
            }
        );
    });
});

describe('findTabStop', () => {
    it('is the preferred item', () => {
        expect(findTabStop(FRUITS, 2)).toBe(2);
    });

    it.each([[NO_NAVIGATION_TARGET], [99]])(
        'is the first item, when the preferred one is %s',
        (preferred: number) => {
            expect(findTabStop(FRUITS, preferred)).toBe(0);
        }
    );

    it('is the first item that can be reached, when the preferred one cannot', () => {
        expect(findTabStop(FRUITS, 1, rowWithout('Banana'))).toBe(0);
        expect(findTabStop(FRUITS, 1, rowWithout('Apple', 'Banana'))).toBe(2);
    });

    it('is the first item that can be reached, when there is no preferred one', () => {
        expect(
            findTabStop(FRUITS, NO_NAVIGATION_TARGET, rowWithout('Apple'))
        ).toBe(1);
    });

    it('is nothing, when none of the items can be reached', () => {
        expect(findTabStop(FRUITS, 1, rowWithout(...FRUITS))).toBe(
            NO_NAVIGATION_TARGET
        );
    });

    it('is nothing, without items', () => {
        expect(findTabStop([], 0)).toBe(NO_NAVIGATION_TARGET);
    });
});
