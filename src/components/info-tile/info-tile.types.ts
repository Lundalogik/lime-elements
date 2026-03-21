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
     * @deprecated Use `valuePrefix` instead. Will be removed in a future version.
     */
    prefix?: string;

    /**
     * The suffix which is displayed after the `value`, must be one or two characters long.
     * @deprecated Use `valueSuffix` instead. Will be removed in a future version.
     */
    suffix?: string;

    /**
     * The prefix which is displayed before the `progressValue`.
     * Keep to a few characters at most.
     */
    valuePrefix?: string;

    /**
     * The suffix which is displayed after the `value`, must be one or two characters long.
     */
    valueSuffix?: string;

    /**
     * When set to `true`, the progress bar changes color depending on its current value.
     */
    displayPercentageColors?: boolean;
}
