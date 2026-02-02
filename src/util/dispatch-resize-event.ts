/**
 * Dispatches a resize event on the window.
 *
 * @internal
 */
export const dispatchResizeEvent = () => {
    if (typeof window === 'undefined') {
        return;
    }

    const resizeEvent = new UIEvent('resize', { view: window, detail: 0 });
    window.dispatchEvent(resizeEvent);
};

/**
 * Triggers a redraw of lime-elements components.
 *
 * Some components (like `limel-slider`, `limel-select`, and others using
 * Material Design Components internally) need to be visible during
 * initialization to render correctly. If a component is created while
 * hidden (e.g., inside a collapsed section or a closed dialog), it may
 * render incorrectly when made visible.
 *
 * Call this function after programmatically showing previously hidden
 * components to trigger their re-initialization.
 *
 * @example
 * ```tsx
 * import { redrawComponents } from '@limetech/lime-elements';
 *
 * // After showing a previously hidden element, wait for DOM update
 * this.showSlider = true;
 * requestAnimationFrame(() => {
 *     redrawComponents();
 * });
 * ```
 *
 * @remarks
 * This function works by dispatching a `resize` event on the window,
 * which triggers the internal re-initialization logic in affected components.
 * It's safe to call and has minimal performance impact.
 *
 * Note: This function is a no-op in non-browser environments (SSR/tests).
 *
 * @public
 */
export const redrawComponents = (): void => {
    dispatchResizeEvent();
};
