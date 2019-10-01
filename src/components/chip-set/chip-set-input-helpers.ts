// tslint:disable no-invalid-this

import {
    ARROW_LEFT,
    ARROW_LEFT_KEY_CODE,
    ARROW_RIGHT,
    ARROW_RIGHT_KEY_CODE,
    BACKSPACE,
    BACKSPACE_KEY_CODE,
    DELETE,
    DELETE_KEY_CODE,
    ENTER,
    ENTER_KEY_CODE,
    ESCAPE,
    ESCAPE_KEY_CODE,
} from '../../util/keycodes';

/**
 * Key handler for the input field.
 * Lets the user select, activate, and remove chips with the keyboard.
 *
 * @param {KeyboardEvent} event event
 *
 * @returns {void}
 */
export function handleKeyboardEvent(event: KeyboardEvent) {
    if (this.textValue.length) {
        // If there is any text in the input field, keyboard input should
        // navigate the text, not the chips.
        return;
    }

    if (!this.value || !this.value.length) {
        // If there are no chips, there is nothing to select.
        return;
    }

    const isLeft =
        event.key === ARROW_LEFT || event.keyCode === ARROW_LEFT_KEY_CODE;
    const isRight =
        event.key === ARROW_RIGHT || event.keyCode === ARROW_RIGHT_KEY_CODE;
    const isEnter = event.key === ENTER || event.keyCode === ENTER_KEY_CODE;
    const isDelete = event.key === DELETE || event.keyCode === DELETE_KEY_CODE;
    const isBackspace =
        event.key === BACKSPACE || event.keyCode === BACKSPACE_KEY_CODE;
    const isEscape = event.key === ESCAPE || event.keyCode === ESCAPE_KEY_CODE;

    if (isLeft) {
        return handleLeft(this, event);
    }

    if (isRight) {
        return handleRight(this, event);
    }

    if (isEnter) {
        return handleEnter(this, event);
    }

    if (isDelete) {
        return handleDelete(this, event);
    }

    if (isBackspace) {
        return handleBackspace(this, event);
    }

    if (isEscape) {
        return handleEscape(this, event);
    }
}

function handleLeft(host, event) {
    event.preventDefault();
    if (host.inputChipIndexSelected === null) {
        host.inputChipIndexSelected = host.value.length - 1;
        return;
    }

    if (host.inputChipIndexSelected <= 0) {
        return;
    }

    host.inputChipIndexSelected -= 1;
}

function handleRight(host, event) {
    event.preventDefault();
    if (host.inputChipIndexSelected === null) {
        host.inputChipIndexSelected = 0;
        return;
    }

    if (host.inputChipIndexSelected >= host.value.length - 1) {
        return;
    }

    host.inputChipIndexSelected += 1;
}

function handleEnter(host, event) {
    if (host.inputChipIndexSelected !== null) {
        event.preventDefault();
        host.emitInteraction(host.value[host.inputChipIndexSelected]);
    }
}

function handleEscape(host, event) {
    if (host.inputChipIndexSelected !== null) {
        event.preventDefault();
        host.inputChipIndexSelected = null;
    }
}

function handleDelete(host, event) {
    if (host.inputChipIndexSelected !== null) {
        event.preventDefault();
        removeChip(host);
    }
}

function handleBackspace(host, event) {
    if (host.inputChipIndexSelected !== null) {
        event.preventDefault();
        removeChip(host);
    } else if (!event.repeat) {
        host.inputChipIndexSelected = host.value.length - 1;
    }
}

function removeChip(host) {
    if (host.inputChipIndexSelected !== null) {
        host.removeChip(host.value[host.inputChipIndexSelected].id);
        host.inputChipIndexSelected = null;
    }
}
