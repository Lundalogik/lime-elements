const DEFAULT_DELAY_FOR_SHOWING = 500;

export class TooltipTimer {
    private timerHandle: number | null = null;
    private showCallback: Function;
    private hideCallback: Function;
    private delayForShowing: number;

    constructor(
        showCallback: Function,
        hideCallback: Function,
        delayForShowing: number = DEFAULT_DELAY_FOR_SHOWING,
    ) {
        this.showCallback = showCallback;
        this.hideCallback = hideCallback;
        this.delayForShowing = delayForShowing;
    }

    showAfterDelay(): void {
        this.timerHandle = setTimeout(this.showCallback, this.delayForShowing);
    }

    hide(): void {
        clearTimeout(this.timerHandle);
        this.hideCallback();
    }
}
