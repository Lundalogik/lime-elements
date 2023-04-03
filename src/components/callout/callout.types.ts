/**
 * Each of the supported callout types has a distinct color and icon.
 * Colors can be changed using provided CSS variables,
 * and icons can be changed too as long as you provide and icon with the same
 * file name. [Read more](#/component/limel-icon/)
 *
 * - `note`: You might read this, you might not.
 * - `important`: You should read this.
 * - `tip`: You want to read this.
 * - `caution`: I hope you read this.
 * - `warning`: You need to read this.
 */

export type CalloutType = 'note' | 'important' | 'tip' | 'caution' | 'warning';
