import {
    Component,
    Event,
    EventEmitter,
    Host,
    Listen,
    Prop,
    Watch,
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
 * @exampleComponent limel-example-hotkey-duplicates
 * @exampleComponent limel-example-hotkey-prevent-default
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
     * When `true`, matching hotkeys call `event.preventDefault()`.
     *
     * Disable this only when you explicitly want the browser's native
     * keyboard behavior to run together with your hotkey logic.
     */
    @Prop({ reflect: true })
    public preventBrowserDefault = true;

    /**
     * Emits when the configured hotkey is pressed.
     */
    @Event({ bubbles: true, composed: true })
    public hotkeyTrigger: EventEmitter<LimelHotkeyTriggerDetail>;

    private static readonly handledFlag = '__limelHotkeyHandled';
    private static readonly duplicateWarnedFlag =
        '__limelHotkeyDuplicateWarned';
    private static readonly instancesByHotkey = new Map<string, Set<Hotkey>>();

    private registeredNormalizedHotkey: string | null = null;

    public connectedCallback() {
        this.updateRegistry();
    }

    public disconnectedCallback() {
        this.unregister();
    }

    @Watch('value')
    protected valueWatcher() {
        this.updateRegistry();
    }

    @Watch('disabled')
    protected disabledWatcher() {
        this.updateRegistry();
    }

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
        if (event.defaultPrevented || event.repeat) {
            return;
        }

        if ((event as any)[Hotkey.handledFlag]) {
            return;
        }

        const expected = this.registeredNormalizedHotkey;
        if (!expected) {
            return;
        }

        if (isKeyboardEventFromTextInput(event)) {
            return;
        }

        const pressed = hotkeyFromKeyboardEvent(event);
        if (!pressed || pressed !== expected) {
            return;
        }

        if (this.preventBrowserDefault) {
            event.preventDefault();
        }

        this.warnIfDuplicateHotkey(expected, event);

        (event as any)[Hotkey.handledFlag] = true;
        this.hotkeyTrigger.emit({
            hotkey: expected,
            value: this.value,
            keyboardEvent: event,
        });
    }

    private warnIfDuplicateHotkey(expected: string, event: KeyboardEvent) {
        if ((event as any)[Hotkey.duplicateWarnedFlag]) {
            return;
        }

        const instances = Hotkey.instancesByHotkey.get(expected);
        const count = instances?.size ?? 0;
        if (count <= 1) {
            return;
        }

        (event as any)[Hotkey.duplicateWarnedFlag] = true;

        console.warn(
            `[limel-hotkey] Duplicate hotkey detected: "${expected}" is configured ` +
                `${count} times among enabled <limel-hotkey> instances. ` +
                `Only the first handler will run for each keypress.`
        );
    }

    private updateRegistry() {
        const next =
            !this.disabled && this.value
                ? normalizeHotkeyString(this.value)
                : null;

        if (next === this.registeredNormalizedHotkey) {
            return;
        }

        this.unregister();

        if (!next) {
            return;
        }

        let set = Hotkey.instancesByHotkey.get(next);
        if (!set) {
            set = new Set();
            Hotkey.instancesByHotkey.set(next, set);
        }

        set.add(this);
        this.registeredNormalizedHotkey = next;
    }

    private unregister() {
        const key = this.registeredNormalizedHotkey;
        if (!key) {
            return;
        }

        const set = Hotkey.instancesByHotkey.get(key);
        set?.delete(this);
        if (set && set.size === 0) {
            Hotkey.instancesByHotkey.delete(key);
        }

        this.registeredNormalizedHotkey = null;
    }
}
