/**
 * Each of the supported callout types has a distinct color and icon.
 * Colors can be changed using provided CSS variables,
 * and icons can be changed too as long as you provide and icon with the same
 * file name. [Read more](#/component/limel-icon/)
 *
 * - `tip`: useful for displaying tips and how-tos.
 * - `info`: useful for displaying information with low importance.
 * - `note`: useful for displaying information with medium importance.
 * - `warning`: useful for displaying information with high importance, like warnings.
 * - `danger`: useful for displaying information with very high importance,
 * such as warnings about actions that have destructive consequences.
 * - `success`: useful for displaying information regarding a successful operation.
 * - `failure`: useful for displaying information about a failed operation.
 * - `example`: useful for displaying an example.
 * - `quote`: useful for displaying a quote.
 */

export type CalloutType =
    | 'note'
    | 'tip'
    | 'info'
    | 'warning'
    | 'danger'
    | 'success'
    | 'failure'
    | 'example'
    | 'quote'
    | 'question';
