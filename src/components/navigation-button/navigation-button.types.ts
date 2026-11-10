/**
 * The type of a navigation button. The type defines how the button looks and
 * how it behaves when the user points at it.
 *
 * - `close`: closes what the button belongs to, typically a dialog, popover
 *   or panel.
 * - `back`: takes the user back to a previous screen, place or state.
 * - `expand`: opens the content the button belongs to as the main view.
 * - `shrink`: shows the content the button belongs to in a smaller view.
 * - `minimize`: minimizes the current pane.
 * - `maximize`: maximizes the current pane.
 * - `float`: opens the content the button belongs to in a floating panel on
 *   the side, on top of the current view.
 * - `newTab`: opens the content the button belongs to in a new browser tab.
 *
 * @public
 */
export type NavigationButtonType =
    | 'close'
    | 'back'
    | 'expand'
    | 'shrink'
    | 'minimize'
    | 'maximize'
    | 'float'
    | 'newTab';
