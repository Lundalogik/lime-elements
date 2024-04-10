import { TooltipTimer } from './tooltipTimer'; // Adjust the import path as necessary

describe('TooltipTimer', () => {
    jest.useFakeTimers();
    let showCallback: jest.Mock;
    let hideCallback: jest.Mock;
    const delayForShowing = 500; // Use the same default or test different values

    beforeEach(() => {
        // Initialize mock callback functions
        showCallback = jest.fn();
        hideCallback = jest.fn();
    });

    it('calls the showCallback after the specified delay', () => {
        const tooltipTimer = new TooltipTimer(
            showCallback,
            hideCallback,
            delayForShowing,
        );

        tooltipTimer.showAfterDelay();
        expect(showCallback).not.toHaveBeenCalled(); // Verify the callback has not been called immediately

        jest.advanceTimersByTime(delayForShowing + 1);
        expect(showCallback).toHaveBeenCalled(); // Verify the callback is called after the delay
    });

    it('does not call the showCallback if hide is called before the delay elapses', () => {
        const tooltipTimer = new TooltipTimer(
            showCallback,
            hideCallback,
            delayForShowing,
        );

        tooltipTimer.showAfterDelay();
        jest.advanceTimersByTime(delayForShowing / 2); // Advance half the time
        tooltipTimer.hide(); // Hide before the delay passes

        jest.advanceTimersByTime(delayForShowing);
        expect(showCallback).not.toHaveBeenCalled(); // The show callback should not be called
    });

    it('calls the hideCallback immediately when hide is called', () => {
        const tooltipTimer = new TooltipTimer(
            showCallback,
            hideCallback,
            delayForShowing,
        );

        tooltipTimer.hide();
        expect(hideCallback).toHaveBeenCalled(); // Verify hideCallback is called immediately
    });

    it('can show the tooltip again after hiding', () => {
        const tooltipTimer = new TooltipTimer(
            showCallback,
            hideCallback,
            delayForShowing,
        );

        tooltipTimer.showAfterDelay();
        jest.advanceTimersByTime(delayForShowing + 1);
        expect(showCallback).toHaveBeenCalled(); // Verify showCallback is called after the delay

        tooltipTimer.hide();
        expect(hideCallback).toHaveBeenCalled(); // Verify hideCallback is called immediately

        tooltipTimer.showAfterDelay();
        jest.advanceTimersByTime(delayForShowing + 1);
        expect(showCallback).toHaveBeenCalledTimes(2); // Verify showCallback is called again after the delay
    });
});
