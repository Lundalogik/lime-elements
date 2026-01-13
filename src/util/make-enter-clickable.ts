import { forceUpdate } from '@stencil/core';

const eventHandlers: WeakMap<HTMLElement, EnterClickable> = new WeakMap();

class EnterClickable {
    private isActive = false;
    private hasJustReleasedEnter = true;

    constructor(private element: HTMLElement) {}

    private handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !this.isActive && !event.repeat) {
            this.isActive = true;

            if (this.element?.shadowRoot) {
                forceUpdate(this.element);
            }
        }
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && this.isActive) {
            this.isActive = false;
            this.hasJustReleasedEnter = true;

            if (this.element?.shadowRoot) {
                forceUpdate(this.element);
            }
        }
    };

    private handleBlur = () => {
        this.isActive = false;
        this.hasJustReleasedEnter = true;
    };

    private handleClick = (event: MouseEvent) => {
        if (!this.isActive) {
            return;
        }

        if (this.hasJustReleasedEnter) {
            this.hasJustReleasedEnter = false;

            return;
        }

        event.stopImmediatePropagation();
    };

    private callbacks: CallBacks = {
        keydownHandler: this.handleKeyDown.bind(this),
        keyupHandler: this.handleKeyUp.bind(this),
        blurHandler: this.handleBlur.bind(this),
        clickHandler: this.handleClick.bind(this),
    };

    public enable() {
        this.element.addEventListener('keydown', this.callbacks.keydownHandler);
        this.element.addEventListener('keyup', this.callbacks.keyupHandler);
        this.element.addEventListener('blur', this.callbacks.blurHandler);
        this.element.addEventListener(
            'click',
            this.callbacks.clickHandler,
            true
        );
    }

    public disable() {
        this.element.removeEventListener(
            'keydown',
            this.callbacks.keydownHandler
        );
        this.element.removeEventListener('keyup', this.callbacks.keyupHandler);
        this.element.removeEventListener('blur', this.callbacks.blurHandler);
        this.element.removeEventListener(
            'click',
            this.callbacks.clickHandler,
            true
        );
    }
}

/**
 * Overrides the default browser behavior for clickable elements
 * When focused and pressing down enter, avoids calling onClick repeatedly
 *
 * @param element - The clickable element
 */
export function makeEnterClickable(element: HTMLElement) {
    if (!eventHandlers.has(element)) {
        const enterClickable = new EnterClickable(element);
        enterClickable.enable();
        eventHandlers.set(element, enterClickable);
    }
}

/**
 * Removes the keyboard-enter click override behavior from an element.
 * Call this during teardown (e.g. `disconnectedCallback`) to avoid leaking
 * event listeners.
 *
 * @param element - The clickable element
 */
export function removeEnterClickable(element: HTMLElement) {
    const enterClickable: EnterClickable = eventHandlers.get(element);
    if (enterClickable) {
        enterClickable.disable();
        eventHandlers.delete(element);
    }
}

interface CallBacks {
    keydownHandler: (arg: KeyboardEvent) => void;
    keyupHandler: (arg: KeyboardEvent) => void;
    blurHandler: () => void;
    clickHandler: (arg: MouseEvent) => void;
}
