/**
 * Utility functions for creating a 3D tilt hover effect.
 *
 * This module provides functions that enables consumer components to display a nice 3D effect,
 * when being hovered; enabling them to follow the cursor's position and tilt towards it.
 *
 * ## What you need, to make this work
 * ### Typescript
 * 1. Import the functions:
 *
 * ```tsx
 * import {
 *     tiltFollowingTheCursor,
 *     handleMouseEnter,
 *     handleMouseLeave,
 * } from './path/to/3d-tilt-hover-effect';
 * ```
 *
 * 2. In your component, define the necessary properties:
 *
 * ```tsx
 * @Element() private element: HTMLElement;
 * private the3dElementBounds: DOMRect;
 * ```
 *
 * 3. If your component does not already have event handlers,
 * implement them using the imported functions from this file:
 *
 * ```tsx
 * private handleMouseEnter = () => {
 *     handleMouseEnter(this.element, 'section', (bounds) => {
 *         this.the3dElementBounds = bounds;
 *     }, this.tiltFollowingTheCursor);
 * };
 *
 * private handleMouseLeave = () => {
 *     handleMouseLeave(this.element, this.tiltFollowingTheCursor);
 * };
 *
 * private tiltFollowingTheCursor = (e: MouseEvent) => {
 *     tiltFollowingTheCursor(e, this.the3dElementBounds, this.element);
 * };
 * ```
 *
 * 4. Attach the event handlers to the relevant elements in your render method:
 *
 * ```tsx
 * public render() {
 *     return (
 *         <section
 *             onMouseEnter={this.handleMouseEnter}
 *             onMouseLeave={this.handleMouseLeave}
 *         >
 *             Your content here
 *         </section>
 *     );
 * }
 * ```
 *
 * :::note
 * - Ensure that the `element` and `the3dElementBounds` properties are properly
 * defined in your component.
 * - The `selector` parameter in `handleMouseEnter` should match the selector
 * of the element you want to apply the 3D effect to.
 * - The `tiltFollowingTheCursor` function calculates the 3D rotation and glow
 * position based on the cursor's position relative to the element's bounds.
 * :::
 *
 * ### HTML elements + CSS
 * 1. Add a `<div class="limel-3d-hover-effect-glow" />` element to your component's template,
 * inside the element you want to apply the 3D effect to, and preferably at the bottom of all
 * other elements within that element (to avoid the need to specifying `z-index`es).
 * 2. Add the following `mixin` to your component's SCSS file:
 * `limel-3d-hover-effect-glow($the3dElement, $border-radius);`
 *
 * and don't forget to define the `$the3dElement` variables for the mixin to work
 * (and optionally the `$border-radius`).
 * 3. Keep in mind that the `<div class="limel-3d-hover-effect-glow" />` will be
 * absolutely positioned inside the parent element, so make sure the parent element
 * has `position` set.
 * 4. Add the following `mixin` to the host element: `parent-of-the-3d-element`.
 * 5. Add the following `mixin` to the 3D element: `the-3d-element`.
 * 6. And if your element is supposed to be clickable, add this `mixin` as well: `the-3d-element--clickable`.
 *
 */

export const MOUSE_SCALE_FACTOR = 100;
export const ROTATION_DEGREE_MULTIPLIER = 1.6;
export const GLOW_POSITION_MULTIPLIER = 2;
export const CENTER_DIVISOR = 2;

export function tiltFollowingTheCursor(
    e: MouseEvent,
    the3dElementBounds: DOMRect,
    element: HTMLElement,
) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - the3dElementBounds.x;
    const topY = mouseY - the3dElementBounds.y;
    const center = {
        x: leftX - the3dElementBounds.width / CENTER_DIVISOR,
        y: topY - the3dElementBounds.height / CENTER_DIVISOR,
    };
    const distance = Math.sqrt(
        center.x ** CENTER_DIVISOR + center.y ** CENTER_DIVISOR,
    );

    const rotate3d = `
        ${center.y / MOUSE_SCALE_FACTOR},
        ${-center.x / MOUSE_SCALE_FACTOR},
        0,
        ${Math.log(distance) * ROTATION_DEGREE_MULTIPLIER}deg
    `;
    element.style.setProperty('--limel-3d-hover-effect-rotate3d', rotate3d);

    const glowPosition = `
        ${center.x * GLOW_POSITION_MULTIPLIER + the3dElementBounds.width / CENTER_DIVISOR}px
    `;
    element.style.setProperty(
        '--limel-3d-hover-effect-glow-position',
        glowPosition,
    );
}

export function handleMouseEnter(
    element: HTMLElement,
    selector: string,
    setBounds: (bounds: DOMRect) => void,
    tiltCallback: (e: MouseEvent) => void,
) {
    const the3dElement = element.shadowRoot.querySelector(
        selector,
    ) as HTMLElement;
    const bounds = the3dElement.getBoundingClientRect();
    setBounds(bounds);
    document.addEventListener('mousemove', tiltCallback);
}

export function handleMouseLeave(
    element: HTMLElement,
    selector: string,
    tiltCallback: (e: MouseEvent) => void,
) {
    const the3dElement = element.shadowRoot.querySelector(
        selector,
    ) as HTMLElement;
    document.removeEventListener('mousemove', tiltCallback);
    the3dElement.style.removeProperty('--limel-3d-hover-effect-rotate3d');
    the3dElement.style.removeProperty('--limel-3d-hover-effect-glow-position');
}
