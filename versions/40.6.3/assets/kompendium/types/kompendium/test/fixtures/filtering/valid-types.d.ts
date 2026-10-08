/**
 * Valid types that SHOULD be included in documentation
 */
/**
 * Configuration for the tooltip component
 */
export interface TooltipConfig {
    /** The tooltip text */
    text: string;
    /** Position of the tooltip */
    position: 'top' | 'bottom' | 'left' | 'right';
    /** Delay before showing (ms) */
    delay?: number;
}
/**
 * Event data for tooltip interactions
 */
export type TooltipEvent = {
    action: 'show' | 'hide';
    timestamp: number;
};
/**
 * Tooltip position options
 */
export declare enum TooltipPosition {
    Top = "top",
    Bottom = "bottom",
    Left = "left",
    Right = "right"
}
/**
 * Utility class for tooltip operations
 */
export declare class TooltipManager {
    /**
     * Show a tooltip
     * @param {TooltipConfig} config - The tooltip configuration
     */
    show(config: TooltipConfig): void;
    /** Hide the current tooltip */
    hide(): void;
}
