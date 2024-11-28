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

export interface TiltEffectOptions {
    clickable?: boolean; // Default: false
}

export const apply3DTiltHoverEffect = (element: HTMLElement, options: TiltEffectOptions = {}) => {
    const clickable = options.clickable ?? false;

    // Ensure Shadow DOM compatibility
    const shadowRoot = element.shadowRoot;
    if (!shadowRoot) {
        throw new Error('Element does not have a shadowRoot.');
    }

    // Inject styles into the shadowRoot
    injectStyles(shadowRoot);

    let tiltCallback: (e: MouseEvent) => void;

    const handleMouseEnter = () => {
        const bounds = element.getBoundingClientRect();

        // Ensure the glow element exists and is appended as the last child
        ensureGlowElement(element);

        tiltCallback = tiltFollowingTheCursor(bounds, element);
        document.addEventListener('mousemove', tiltCallback);

        if (clickable) {
            element.setAttribute('clickable', '');
        }
    };

    const handleMouseLeave = () => {
        document.removeEventListener('mousemove', tiltCallback);
        element.style.removeProperty('--limel-3d-hover-effect-rotate3d');
        element.style.removeProperty('--limel-3d-hover-effect-glow-position');

        if (clickable) {
            element.removeAttribute('clickable');
        }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
};

const ensureGlowElement = (element: HTMLElement): HTMLElement => {
    const shadowRoot = element.shadowRoot;
    if (!shadowRoot) {
        throw new Error('Element does not have a shadowRoot.');
    }

    let glowElement = shadowRoot.querySelector('limel-3d-hover-effect-glow');
    if (!glowElement) {
        glowElement = document.createElement('limel-3d-hover-effect-glow');
        shadowRoot.appendChild(glowElement);
    } else {
        // Re-append the glow element to ensure it’s the last child
        shadowRoot.appendChild(glowElement);
    }

    return glowElement as HTMLElement;
};

const injectStyles = (shadowRoot: ShadowRoot) => {
    if (shadowRoot.querySelector('style[data-3d-tilt-styles]')) {
        return; // Styles are already injected
    }

    const style = document.createElement('style');
    style.setAttribute('data-3d-tilt-styles', '');
    style.textContent = `
        /* Core styles for the 3D tilt effect */
        :host {
            isolation: isolate;
            transform-style: preserve-3d;
            perspective: 1000px;
        }

        @media (prefers-reduced-motion) {
            :host {
                perspective: 2000px;
            }
        }

        :host([clickable]) {
            cursor: pointer;
            box-shadow: var(--button-shadow-normal);
        }

        :host(:hover),
        :host(:focus-visible),
        :host(:focus-within) {
            will-change: background-color, box-shadow, transform;
        }

        :host(:hover) {
            transform: scale3d(1.01, 1.01, 1.01)
                rotate3d(var(--limel-3d-hover-effect-rotate3d));
            box-shadow: var(--button-shadow-hovered), var(--shadow-depth-16);
        }

        :host(:focus-visible) {
            transform: scale3d(1.01, 1.01, 1.01);
            outline: none;
        }

        :host(:active) {
            transform: scale3d(1, 1, 1) rotate3d(0, 0, 0, 0deg);
            box-shadow: var(--button-shadow-pressed);
        }

        :host(:focus-visible:active) {
            box-shadow: var(--shadow-depth-8-focused), var(--button-shadow-pressed);
        }

        /* Glow effect styles */
        limel-3d-hover-effect-glow {
            position: absolute;
            inset: 0;
            pointer-events: none;
            background-image: radial-gradient(
                circle at var(--limel-3d-hover-effect-glow-position, 50% -20%),
                rgb(var(--color-white), 0.3),
                rgb(var(--color-white), 0)
            );
            mix-blend-mode: plus-lighter;
            opacity: 0.1;
            transition: opacity 0.4s ease, background 0.4s ease;
        }

        :host([clickable]):hover limel-3d-hover-effect-glow {
            opacity: 0.5;
        }

        @media (prefers-reduced-motion) {
            limel-3d-hover-effect-glow {
                opacity: 0.2;
            }
        }
    `;

    shadowRoot.appendChild(style);
};
