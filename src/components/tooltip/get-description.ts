import { isAppleDevice } from '../../util/device';
import { normalizeHotkeyString } from '../../util/hotkeys';
import { getHotkeyAriaLabel } from '../hotkey/get-hotkey-aria-label';

/**
 * Get the text that a screen reader should read as the description of the
 * element that a tooltip describes. The label and the helper label are left
 * out when they only repeat the name of the element, or the text of one of
 * its parts, so that they are not read twice.
 *
 * @param element
 * @param label
 * @param helperLabel
 * @param hotkey
 */
export function getDescription(
    element: HTMLElement,
    label: string,
    helperLabel?: string,
    hotkey?: string
): string {
    const names = new Set(getNames(element).map(normalize));
    const parts = [label, helperLabel].filter(
        (text) => text && !names.has(normalize(text))
    );
    parts.push(getHotkeyText(hotkey));

    return parts.filter(Boolean).join('. ');
}

function getHotkeyText(hotkey?: string): string | undefined {
    const normalized = normalizeHotkeyString(hotkey);

    return normalized
        ? getHotkeyAriaLabel(normalized, isAppleDevice())
        : undefined;
}

function getNames(element: HTMLElement): string[] {
    const ariaLabel = element.getAttribute('aria-label')?.trim();
    if (ariaLabel) {
        return [ariaLabel];
    }

    const labelled = [...element.querySelectorAll('[aria-label]')];

    return [
        element.textContent,
        ...[...element.children].map((part) => part.textContent),
        ...labelled.map((labelledElement) =>
            labelledElement.getAttribute('aria-label')
        ),
    ].filter(Boolean);
}

function normalize(text: string): string {
    return text.replaceAll(/\s+/g, ' ').trim().toLowerCase();
}
