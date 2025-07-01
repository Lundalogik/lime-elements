import { handleKeyboardEvent } from './chip-set-input-helpers';

describe('handleKeyboardEvent', () => {
    let host;

    beforeEach(() => {
        host = createHostComponent();
    });

    describe('with no chip selected', () => {
        beforeEach(() => {
            host.inputChipIndexSelected = null;
        });

        describe('an ArrowLeft event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowLeft',
                    })
                );
            });
            it('selects the last chip', () => {
                expect(host.inputChipIndexSelected).toBe(2);
            });
        });

        describe('an ArrowRight event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowRight',
                    })
                );
            });
            it('selects the first chip', () => {
                expect(host.inputChipIndexSelected).toBe(0);
            });
        });

        describe('an Enter event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'Enter',
                    })
                );
            });
            it('does NOT call `host.emitInteraction`', () => {
                expect(host.emitInteraction).not.toHaveBeenCalled();
            });
        });

        describe('a Delete event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'Delete',
                    })
                );
            });
            it('does NOT call `host.removeChip`', () => {
                expect(host.removeChip).not.toHaveBeenCalled();
            });
        });

        describe('a Backspace event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'Backspace',
                        repeat: false,
                    })
                );
            });
            it('does NOT call `host.removeChip`', () => {
                expect(host.removeChip).not.toHaveBeenCalled();
            });
            it('selects the last chip', () => {
                expect(host.inputChipIndexSelected).toBe(2);
            });
        });

        describe('a repeating Backspace event (from holding the Backspace key down)', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'Backspace',
                        repeat: true,
                    })
                );
            });
            it('does NOT call `host.removeChip`', () => {
                expect(host.removeChip).not.toHaveBeenCalled();
            });
            it('does NOT select the last chip', () => {
                expect(host.inputChipIndexSelected).toBeNull();
            });
        });
    });

    describe('with a chip selected', () => {
        beforeEach(() => {
            host.inputChipIndexSelected = 1;
        });

        describe('an ArrowLeft event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowLeft',
                    })
                );
            });
            it('selects the preceding chip', () => {
                expect(host.inputChipIndexSelected).toBe(0);
            });
        });

        describe('an ArrowRight event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowRight',
                    })
                );
            });
            it('selects the succeeding chip', () => {
                expect(host.inputChipIndexSelected).toBe(2);
            });
        });

        describe('an Enter event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'Enter',
                    })
                );
            });
            it('calls `host.emitInteraction` with the selected chip', () => {
                expect(host.emitInteraction).toHaveBeenCalledWith(
                    host.value[1]
                );
            });
        });

        describe('a Delete event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'Delete',
                    })
                );
            });
            it('calls `host.removeChip` with the id of the selected chip', () => {
                expect(host.removeChip).toHaveBeenCalledWith(456);
            });
            it('resets selection', () => {
                expect(host.inputChipIndexSelected).toBeNull();
            });
        });

        describe('a Backspace event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'Backspace',
                        repeat: false,
                    })
                );
            });
            it('calls `host.removeChip` with the id of the selected chip', () => {
                expect(host.removeChip).toHaveBeenCalledWith(456);
            });
            it('resets selection', () => {
                expect(host.inputChipIndexSelected).toBeNull();
            });
        });

        describe('a repeating Backspace event (from holding the Backspace key down)', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'Backspace',
                        repeat: true,
                    })
                );
            });
            it('calls `host.removeChip` with the id of the selected chip', () => {
                expect(host.removeChip).toHaveBeenCalledWith(456);
            });
            it('resets selection', () => {
                expect(host.inputChipIndexSelected).toBeNull();
            });
        });

        describe('an Escape event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'Escape',
                    })
                );
            });
            it('resets selection', () => {
                expect(host.inputChipIndexSelected).toBeNull();
            });
        });
    });

    describe('with the first chip selected', () => {
        beforeEach(() => {
            host.inputChipIndexSelected = 0;
        });

        describe('an ArrowLeft event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowLeft',
                    })
                );
            });
            it('does NOT change the selection', () => {
                expect(host.inputChipIndexSelected).toBe(0);
            });
        });

        describe('an ArrowRight event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowRight',
                    })
                );
            });
            it('selects the second chip', () => {
                expect(host.inputChipIndexSelected).toBe(1);
            });
        });
    });

    describe('with the last chip selected', () => {
        beforeEach(() => {
            host.inputChipIndexSelected = 2;
        });

        describe('an ArrowLeft event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowLeft',
                    })
                );
            });
            it('selects the second-to-last chip', () => {
                expect(host.inputChipIndexSelected).toBe(1);
            });
        });

        describe('an ArrowRight event', () => {
            beforeEach(() => {
                host.handleKeyDown(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowRight',
                    })
                );
            });
            it('does NOT change the selection', () => {
                expect(host.inputChipIndexSelected).toBe(2);
            });
        });
    });
});

function createHostComponent(
    value: any[] = [
        { id: 123, name: 'Chip 1' },
        { id: 456, name: 'Chip 2' },
        { id: 789, name: 'Chip 3' },
    ]
) {
    return {
        emitInteraction: jest.fn(),
        handleKeyDown: handleKeyboardEvent,
        inputChipIndexSelected: null,
        removeChip: jest.fn(),
        textValue: '',
        value: value,
    };
}
