/**
 * @public
 */
export interface InfoTileProgress {
    /**
     * The value of the progress bar.
     */
    value: number;

    /**
     * The maximum value within the scale that the progress bar should visualize.
     */
    maxValue?: number;

    /**
     * The prefix which is displayed before the `progressValue`.
     * Keep to a few characters at most.
     */
    prefix?: string;

    /**
     * The suffix which is displayed after the `value`, must be one or two characters long.
     */
    suffix?: string;

    /**
     * When set to `true`, the progress bar changes color depending on its current value.
     */
    displayPercentageColors?: boolean;
}
