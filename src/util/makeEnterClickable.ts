import { forceUpdate } from '@stencil/core';

const eventHandlers: WeakMap<HTMLElement, EnterClickable> = new WeakMap();

class EnterClickable {
    private isActive = false;
    private hasJustReleasedEnter = true;

    constructor(private element: HTMLElement) {}

    private handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !this.isActive) {
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
        clickHandler: this.handleClick.bind(this),
    };

    public enable() {
        this.element.addEventListener('keydown', this.callbacks.keydownHandler);
        this.element.addEventListener('keyup', this.callbacks.keyupHandler);
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
 * @param {HTMLElement} element the clickable element
 */
export function makeEnterClickable(element: HTMLElement) {
    if (!eventHandlers.has(element)) {
        const enterClickable = new EnterClickable(element);
        enterClickable.enable();
        eventHandlers.set(element, enterClickable);
    }
}

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
    clickHandler: (arg: MouseEvent) => void;
}
