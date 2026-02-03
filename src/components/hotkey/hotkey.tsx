import { Component, Host, Prop, h } from '@stencil/core';
import { tokenizeHotkeyString } from '../../util/hotkeys';
import { isAppleDevice } from '../../util/device';
import { formatDisplayToken } from './format-display-token';

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
    private isApple: boolean;

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

    public componentWillLoad() {
        this.isApple = isAppleDevice();
    }

    public render() {
        const parts = tokenizeHotkeyString(this.value);
        const displayParts = parts.map((part) =>
            formatDisplayToken(part, this.isApple)
        );
        const ariaLabel = displayParts
            .map((p) => p.ariaName)
            .filter(Boolean)
            .join(' ');

        return (
            <Host aria-label={ariaLabel || undefined}>
                {displayParts.map(({ display, isGlyph }, index) => (
                    <kbd
                        key={`${parts[index]}-${index}`}
                        class={isGlyph ? 'is-glyph' : undefined}
                    >
                        <span>{display}</span>
                    </kbd>
                ))}
            </Host>
        );
    }
}
