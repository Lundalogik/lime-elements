/**
 * Utility functions for creating a 3D tilt hover effect.
 *
 * This module provides functions to enable a 3D tilt effect for consumer components,
 * allowing elements to visually follow the cursor's position and tilt towards it.
 * It also includes a glow effect for added interactivity.
 *
 * ## Usage
 *
 * 1. **Import the utility**:
 *
 * ```tsx
 * import { getMouseEventHandlers } from './path/to/3d-tilt-hover-effect';
 * ```
 *
 * 2. **Initialize in your component**:
 *
 * Call `getMouseEventHandlers()` in your component to retrieve the `handleMouseEnter`
 * and `handleMouseLeave` functions, and attach them to the target element.
 * For example, if your interactive element is the host itself:
 *
 * ```tsx
 * @Element()
 * private host: HTMLElement;
 *
 * private handleMouseEnter: () => void;
 * private handleMouseLeave: () => void;
 *
 * public componentWillLoad() {
 *     const { handleMouseEnter, handleMouseLeave } = getMouseEventHandlers(this.host);
 *     this.handleMouseEnter = handleMouseEnter;
 *     this.handleMouseLeave = handleMouseLeave;
 * }
 * ```
 *
 * 3. **Attach event handlers in your render method**:
 *
 * ```tsx
 * public render() {
 *     return (
 *         <Host
 *             onMouseEnter={this.handleMouseEnter}
 *             onMouseLeave={this.handleMouseLeave}
 *         >
 *             <!-- Your component content -->
 *         </Host>
 *     );
 * }
 * ```
 *
 * ## Styling Requirements
 *
 * To enable the 3D tilt and glow effect:
 *
 * 1. Add a `<limel-3d-hover-effect-glow />` inside the target element,
 *    preferably as the last child.
 *
 * 2. Use the following SCSS mixins in your component:
 *
 * - **On the host element**:
 *   ```scss
 *   @include parent-of-the-3d-element;
 *   ```
 *
 * - **On the 3D element**:
 *   ```scss
 *   @include the-3d-element;
 *   ```
 *
 * - **For clickable elements**:
 *   ```scss
 *   @include the-3d-element--clickable;
 *   ```
 *
 */

export const MOUSE_SCALE_FACTOR = 100;
export const SCALING_BASE = 50;
export const ROTATION_DEGREE_MULTIPLIER = 1.6;
export const GLOW_POSITION_MULTIPLIER = 2;
export const CENTER_DIVISOR = 2;

export const tiltFollowingTheCursor =
    (the3dElementBounds: DOMRect, element: HTMLElement) => (e: MouseEvent) => {
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

        const scalingFactor = Math.sqrt(
            Math.min(the3dElementBounds.width, the3dElementBounds.height) /
                SCALING_BASE,
        );

        const rotate3d = `
            ${center.y / (MOUSE_SCALE_FACTOR * scalingFactor)},
            ${-center.x / (MOUSE_SCALE_FACTOR * scalingFactor)},
            0,
            ${(Math.log(distance) * ROTATION_DEGREE_MULTIPLIER) / scalingFactor}deg
        `;
        element.style.setProperty('--limel-3d-hover-effect-rotate3d', rotate3d);

        const glowPosition = `
            ${center.x * GLOW_POSITION_MULTIPLIER + the3dElementBounds.width / CENTER_DIVISOR}px
            ${center.y * GLOW_POSITION_MULTIPLIER + the3dElementBounds.height / CENTER_DIVISOR}px
        `;
        element.style.setProperty(
            '--limel-3d-hover-effect-glow-position',
            glowPosition,
        );
    };

export const getMouseEventHandlers = (element: HTMLElement) => {
    let tiltCallback: (e: MouseEvent) => void;

    const handleMouseEnter = () => {
        const bounds = element.getBoundingClientRect();
        tiltCallback = tiltFollowingTheCursor(bounds, element);
        document.addEventListener('mousemove', tiltCallback);
    };

    const handleMouseLeave = () => {
        document.removeEventListener('mousemove', tiltCallback);
        element.style.removeProperty('--limel-3d-hover-effect-rotate3d');
        element.style.removeProperty('--limel-3d-hover-effect-glow-position');
    };

    return {
        handleMouseEnter: handleMouseEnter,
        handleMouseLeave: handleMouseLeave,
    };
};
