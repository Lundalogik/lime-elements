/**
 * Payload for the `hotkeyTrigger` event emitted by `limel-hotkey`.
 * @public
 */
export type LimelHotkeyTriggerDetail = {
    /**
     * Canonical hotkey string for the matched keypress,
     * e.g. `meta+k` or `ctrl+shift+p`.
     */
    hotkey: string;

    /**
     * The component-provided value associated with the hotkey.
     */
    value: string;

    /**
     * The original keyboard event that matched the configured hotkey.
     */
    keyboardEvent: KeyboardEvent;
};
