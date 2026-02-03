import {
    Component,
    Event,
    EventEmitter,
    Host,
    Listen,
    Prop,
    h,
} from '@stencil/core';
import {
    hotkeyFromKeyboardEvent,
    isKeyboardEventFromTextInput,
    normalizeHotkeyString,
    tokenizeHotkeyString,
} from '../../util/hotkeys';
import { isAppleDevice } from '../../util/device';
import { LimelHotkeyTriggerDetail } from './hotkey.types';

/**
 * This component is used internally to visualize hotkeys in other components,
 * such as the menu. It will also emit an event when the hotkey is pressed,
 * so that the parent component can react to it.
 *
 * @exampleComponent limel-example-hotkey-basic
 * @exampleComponent limel-example-hotkey-disabled
 * @private
 */
@Component({
    tag: 'limel-hotkey',
    shadow: true,
    styleUrl: 'hotkey.scss',
})
export class Hotkey {
    /**
     * The hotkey
     */
    @Prop({ reflect: true })
    public value: string;

    /**
     * When disabled, the hotkey is still rendered but will not emit events.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Emits when the configured hotkey is pressed.
     */
    @Event({ bubbles: true, composed: true })
    public hotkeyTrigger: EventEmitter<LimelHotkeyTriggerDetail>;

    private static readonly handledFlag = '__limelHotkeyHandled';

    public render() {
        const isApple = isAppleDevice();
        const parts = tokenizeHotkeyString(this.value);
        const ariaLabel = (this.value ?? '').trim();

        return (
            <Host aria-label={ariaLabel || undefined}>
                {parts.map((part, index) => {
                    const { display, isGlyph } = this.formatDisplayToken(
                        part,
                        isApple
                    );

                    return (
                        <kbd
                            key={`${part}-${index}`}
                            class={isGlyph ? 'is-glyph' : undefined}
                        >
                            <span>{display}</span>
                        </kbd>
                    );
                })}
            </Host>
        );
    }

    private formatDisplayToken(
        token: string,
        isApple: boolean
    ): {
        display: string;
        isGlyph: boolean;
    } {
        const trimmed = (token ?? '').trim();
        if (!trimmed) {
            return { display: '', isGlyph: false };
        }

        if (trimmed === '+') {
            return { display: '+', isGlyph: false };
        }

        const lower = trimmed.toLowerCase();

        switch (lower) {
            case 'meta': {
                return isApple
                    ? { display: '⌘', isGlyph: true }
                    : { display: '⊞ Win', isGlyph: false };
            }

            case 'cmd':
            case 'command': {
                return { display: '⌘', isGlyph: true };
            }

            case 'alt':
            case 'option': {
                return isApple
                    ? { display: '⌥', isGlyph: true }
                    : { display: 'Alt', isGlyph: false };
            }

            case 'shift': {
                return { display: '⇧', isGlyph: true };
            }

            case 'enter':
            case 'return': {
                return { display: '↩', isGlyph: true };
            }

            case 'tab': {
                return { display: '⇥', isGlyph: true };
            }

            case 'delete':
            case 'del':
            case 'backspace': {
                if (isApple) {
                    return { display: '⌫', isGlyph: true };
                }
                return lower === 'backspace'
                    ? { display: 'Backspace', isGlyph: false }
                    : { display: 'Del', isGlyph: false };
            }

            case 'ctrl':
            case 'control': {
                return { display: 'Ctrl', isGlyph: false };
            }
        }

        return { display: trimmed, isGlyph: false };
    }

    @Listen('keydown', { target: 'document', capture: true })
    public handleKeyDown(event: KeyboardEvent) {
        if (this.disabled) {
            return;
        }

        if (event.defaultPrevented || event.repeat) {
            return;
        }

        if ((event as any)[Hotkey.handledFlag]) {
            return;
        }

        if (!this.value) {
            return;
        }

        if (isKeyboardEventFromTextInput(event)) {
            return;
        }

        const expected = normalizeHotkeyString(this.value);
        if (!expected) {
            return;
        }

        const pressed = hotkeyFromKeyboardEvent(event);
        if (!pressed || pressed !== expected) {
            return;
        }

        (event as any)[Hotkey.handledFlag] = true;
        this.hotkeyTrigger.emit({
            hotkey: expected,
            value: this.value,
            keyboardEvent: event,
        });
    }
}
