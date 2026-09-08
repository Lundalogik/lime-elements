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
 * 2. **Define the structure of your component**:
 *
 * To enable the 3D tilt effect, the host element of your component should act as
 * the "parent-of-the-3d-element", and a nested child element should act as
 * "the-3d-element" (the interactive element). This structure is necessary
 * to properly isolate the 3D transformations and maintain visual fidelity.
 *
 * For example:
 *
 * ```tsx
 * <Host>
 *     <section class="the-3d-element">
 *         <!-- Your component content -->
 *     </section>
 * </Host>
 * ```
 *
 * Apply the required SCSS mixins to these elements:
 *
 * - **On the host element**:
 *   ```scss
 *   @include parent-of-the-3d-element;
 *   ```
 * - **On the nested "interactive" element**:
 *   ```scss
 *   @include the-3d-element;
 *   ```
 * - **For clickable interactive elements**:
 *   ```scss
 *   @include the-3d-element--clickable;
 *   ```
 * - **For the glow effect**:
 *   Add a `<limel-3d-hover-effect-glow />` inside "the-3d-element".
 *
 * 3. **Initialize in your component**:
 *
 * Use `getMouseEventHandlers()` to attach the required mouse event listeners
 * to the "interactive element" (`the-3d-element`), and call the `cleanup()` it
 * returns when the component is disconnected. For example:
 *
 * ```tsx
 * @Element()
 * private host: HTMLElement;
 *
 * private handleMouseEnter: () => void;
 * private handleMouseLeave: () => void;
 * private cleanup3dHoverEffect?: () => void;
 *
 * public componentWillLoad() {
 *     const { handleMouseEnter, handleMouseLeave, cleanup } =
 *         getMouseEventHandlers(
 *             this.host.querySelector<HTMLElement>('.the-3d-element'),
 *         );
 *     this.handleMouseEnter = handleMouseEnter;
 *     this.handleMouseLeave = handleMouseLeave;
 *     this.cleanup3dHoverEffect = cleanup;
 * }
 *
 * public disconnectedCallback() {
 *     this.cleanup3dHoverEffect?.();
 * }
 * ```
 *
 * Call it optionally: `disconnectedCallback` can run before
 * `componentWillLoad` has assigned the field.
 *
 * Skipping the `disconnectedCallback` leaks a `document` level `mousemove`
 * listener every time the element is removed while it is being hovered, and
 * leaves a moved element stuck at the angle it was last tilted to.
 *
 * 4. **Attach event handlers in your render method**:
 *
 * ```tsx
 * public render() {
 *     return (
 *         <Host>
 *             <section
 *                 class="the-3d-element"
 *                 onMouseEnter={this.handleMouseEnter}
 *                 onMouseLeave={this.handleMouseLeave}
 *             >
 *                 <!-- Your component content -->
 *                 <div class="limel-3d-hover-effect-glow" />
 *             </section>
 *         </Host>
 *     );
 * }
 * ```
 *
 * ## Styling Notes
 *
 * - The host element (`parent-of-the-3d-element`) must have these styles:
 *   ```scss
 *   @include parent-of-the-3d-element;
 *   ```
 * - The nested "interactive element" (`the-3d-element`) should have:
 *   ```scss
 *   @include the-3d-element;
 *   ```
 * - For components like Card or Info Tile, using a nested "interactive element"
 *   is the only way to achieve the 3D effect, as the host serves as the parent
 *   and must maintain proper isolation for the effect.
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
            center.x ** CENTER_DIVISOR + center.y ** CENTER_DIVISOR
        );

        const scalingFactor = Math.sqrt(
            Math.min(the3dElementBounds.width, the3dElementBounds.height) /
                SCALING_BASE
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
            glowPosition
        );
    };

export const getMouseEventHandlers = (element: HTMLElement) => {
    let tiltCallback: (e: MouseEvent) => void;

    /**
     * Stops following the cursor and returns the element to rest.
     *
     * Safe to call when tracking never started, and safe to call on an
     * element that has already been detached.
     */
    const stopTracking = () => {
        document.removeEventListener('mousemove', tiltCallback);
        element.style.removeProperty('--limel-3d-hover-effect-rotate3d');
        element.style.removeProperty('--limel-3d-hover-effect-glow-position');
    };

    const handleMouseEnter = () => {
        // A second `mouseenter` without an intervening `mouseleave` would
        // otherwise strand the previous callback on `document` with nothing
        // left holding a reference to remove it with.
        stopTracking();

        const bounds = element.getBoundingClientRect();
        tiltCallback = tiltFollowingTheCursor(bounds, element);
        document.addEventListener('mousemove', tiltCallback);
    };

    return {
        handleMouseEnter: handleMouseEnter,
        handleMouseLeave: stopTracking,

        /**
         * The same teardown as `handleMouseLeave`, for the case where no
         * `mouseleave` is coming.
         *
         * `mouseleave` never fires for an element that is removed from the
         * DOM while the pointer is still over it, which in a single page
         * application is the ordinary case: a click routes away from the
         * view holding the element. It does not fire when the element is
         * merely moved within the DOM either, and a move disconnects the
         * component just like a removal does. Call this from
         * `disconnectedCallback` so the listener does not outlive the
         * element it tilts, and so a moved element does not stay stuck at
         * the angle it was last tilted to.
         */
        cleanup: stopTracking,
    };
};
