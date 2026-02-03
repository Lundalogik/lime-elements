import { Component, Host, Prop, h } from '@stencil/core';
import { tokenizeHotkeyString } from '../../util/hotkeys';
import { isAppleDevice } from '../../util/device';

/**
 * This is a display-only component used to visualize keyboard shortcuts.
 * It renders hotkey strings as styled `<kbd>` elements with
 * platform-aware glyphs (e.g. `⌘` on macOS, `⊞ Win` on Windows).
 *
 * It does **not** listen for or handle any keyboard events.
 * Keyboard event handling is the responsibility of the parent component
 * (e.g. `limel-menu` or `limel-select`).
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
     * The hotkey string to visualize, e.g. `"meta+c"` or `"shift+enter"`.
     */
    @Prop({ reflect: true })
    public value: string;

    /**
     * When `true`, the hotkey is rendered in a visually disabled state.
     */
    @Prop({ reflect: true })
    public disabled = false;

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
}
