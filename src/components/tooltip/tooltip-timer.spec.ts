import { TooltipTimer } from './tooltip-timer'; // Adjust the import path as necessary

describe('TooltipTimer', () => {
    let showCallback: Mock<any>;
    let hideCallback: Mock<any>;
    const delayForShowing = 500; // Use the same default or test different values

    beforeEach(() => {
        vi.useFakeTimers();
        // Initialize mock callback functions
        showCallback = vi.fn();
        hideCallback = vi.fn();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('calls the showCallback after the specified delay', () => {
        const tooltipTimer = new TooltipTimer(
            showCallback,
            hideCallback,
            delayForShowing
        );

        tooltipTimer.showAfterDelay();
        expect(showCallback).not.toHaveBeenCalled(); // Verify the callback has not been called immediately

        vi.advanceTimersByTime(delayForShowing + 1);
        expect(showCallback).toHaveBeenCalled(); // Verify the callback is called after the delay
    });

    it('does not call the showCallback if hide is called before the delay elapses', () => {
        const tooltipTimer = new TooltipTimer(
            showCallback,
            hideCallback,
            delayForShowing
        );

        tooltipTimer.showAfterDelay();
        vi.advanceTimersByTime(delayForShowing / 2); // Advance half the time
        tooltipTimer.hide(); // Hide before the delay passes

        vi.advanceTimersByTime(delayForShowing);
        expect(showCallback).not.toHaveBeenCalled(); // The show callback should not be called
    });

    it('calls the hideCallback immediately when hide is called', () => {
        const tooltipTimer = new TooltipTimer(
            showCallback,
            hideCallback,
            delayForShowing
        );

        tooltipTimer.hide();
        expect(hideCallback).toHaveBeenCalled(); // Verify hideCallback is called immediately
    });

    it('can show the tooltip again after hiding', () => {
        const tooltipTimer = new TooltipTimer(
            showCallback,
            hideCallback,
            delayForShowing
        );

        tooltipTimer.showAfterDelay();
        vi.advanceTimersByTime(delayForShowing + 1);
        expect(showCallback).toHaveBeenCalled(); // Verify showCallback is called after the delay

        tooltipTimer.hide();
        expect(hideCallback).toHaveBeenCalled(); // Verify hideCallback is called immediately

        tooltipTimer.showAfterDelay();
        vi.advanceTimersByTime(delayForShowing + 1);
        expect(showCallback).toHaveBeenCalledTimes(2); // Verify showCallback is called again after the delay
    });

    describe('when showAfterDelay is called multiple times before the delay elapses', () => {
        let tooltipTimer: TooltipTimer;

        beforeEach(() => {
            tooltipTimer = new TooltipTimer(
                showCallback,
                hideCallback,
                delayForShowing
            );

            tooltipTimer.showAfterDelay();
            vi.advanceTimersByTime(delayForShowing / 2); // Advance half the time
            tooltipTimer.showAfterDelay(); // Show again before the delay passes
        });
        it('calls the showCallback only once after the delay', () => {
            vi.advanceTimersByTime(delayForShowing + 1);
            expect(showCallback).toHaveBeenCalledTimes(1); // Verify showCallback is called only once
        });
        it('calls the showCallback when the delay has elapsed since the first call (it does not start the delay over)', () => {
            vi.advanceTimersByTime(delayForShowing / 2 + 1); // Advance the rest of the time
            expect(showCallback).toHaveBeenCalledTimes(1);
        });

        describe('and hide is called before the delay elapses', () => {
            beforeEach(() => {
                tooltipTimer.hide(); // Hide before the delay passes
            });

            it('does not call the showCallback after the delay', () => {
                vi.advanceTimersByTime(delayForShowing + 1);
                expect(showCallback).not.toHaveBeenCalled(); // The show callback should not be called
            });
        });
    });
});
