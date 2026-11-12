import { render, h } from '@stencil/vitest';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import {
    getAccessibleNodes,
    getAccessibleProperties,
} from '../../util/test/accessibility-tree';
import { NavigationButtonType } from './navigation-button.types';

type Page = Awaited<ReturnType<typeof render>>;

// A list instead of a `let`, because the lint rules do not allow reassignment of
// top-level variables in functions.
const pages: Page[] = [];

const TYPES: NavigationButtonType[] = [
    'close',
    'back',
    'expand',
    'shrink',
    'minimize',
    'maximize',
    'float',
    'newTab',
];

// Path data that starts with a move, like the paths of the icons do.
const PATH_DATA = /^M[\d\s.,a-zA-Z-]+$/;

afterEach(() => {
    vi.restoreAllMocks();
    for (const page of pages.splice(0)) {
        page.unmount();
    }
});

test('limel-navigation-button: renders a button when it has no href', async () => {
    const host = await renderButton({ type: 'close' });

    expect(getControl(host).tagName).toBe('BUTTON');
});

test('limel-navigation-button: renders a link when it has an href', async () => {
    const host = await renderButton({
        type: 'close',
        href: 'https://example.com/',
    });

    expect(getControl(host).tagName).toBe('A');
    expect(getControl(host).getAttribute('href')).toBe('https://example.com/');
});

test('limel-navigation-button: opens a link of the type newTab in a new tab', async () => {
    const host = await renderButton({
        type: 'newTab',
        href: 'https://example.com/',
    });

    expect(getControl(host).getAttribute('target')).toBe('_blank');
});

test('limel-navigation-button: opens a link of another type in the same tab', async () => {
    const host = await renderButton({
        type: 'close',
        href: 'https://example.com/',
    });

    expect(getControl(host).hasAttribute('target')).toBe(false);
});

test('limel-navigation-button: does not pass the referrer on when a link opens in a new tab', async () => {
    const host = await renderButton({
        type: 'newTab',
        href: 'https://example.com/',
    });

    expect(getControl(host).getAttribute('rel')).toBe('noopener noreferrer');
});

test('limel-navigation-button: sets no rel on a link that opens in the same tab', async () => {
    const host = await renderButton({
        type: 'close',
        href: 'https://example.com/',
    });

    expect(getControl(host).hasAttribute('rel')).toBe(false);
});

test.each(TYPES)(
    'limel-navigation-button: gives the control the class of the type %s',
    async (type) => {
        const host = await renderButton({ type });

        expect(getControl(host).classList.contains(type)).toBe(true);
    }
);

test.each(TYPES)(
    'limel-navigation-button: draws an embedded icon for the type %s',
    async (type) => {
        const host = await renderButton({ type });

        expect(getIconPath(host)).toMatch(PATH_DATA);
        expect(host.shadowRoot!.querySelector('limel-icon')).toBeNull();
    }
);

test('limel-navigation-button: draws a different icon for each type, except minimize and maximize', async () => {
    const paths = await renderAllTypes();

    expect(new Set(Object.values(paths)).size).toBe(TYPES.length - 1);
    expect(paths.minimize).toBe(paths.maximize);
});

test('limel-navigation-button: hides the icon from assistive technology', async () => {
    const host = await renderButton({ type: 'close' });
    const icon = host.shadowRoot!.querySelector('svg')!;

    expect(icon.getAttribute('aria-hidden')).toBe('true');
});

test('limel-navigation-button: makes the control the target of the pointer, also on top of the icon', async () => {
    const host = await renderButton({ type: 'newTab' });
    const icon = host.shadowRoot!.querySelector('svg')!;
    const box = icon.getBoundingClientRect();

    const target = host.shadowRoot!.elementFromPoint(
        box.left + box.width / 2,
        box.top + box.height / 2
    );

    expect(target).toBe(getControl(host));
});

test('limel-navigation-button: draws the icon with the color of the text', async () => {
    const host = await renderButton({ type: 'close' });
    const icon = host.shadowRoot!.querySelector('svg')!;

    expect(getComputedStyle(icon).stroke).toBe(getComputedStyle(icon).color);
});

test('limel-navigation-button: shows the label and the helper label in a tooltip', async () => {
    const host = await renderButton({
        type: 'close',
        label: 'Close',
        helperLabel: 'Esc',
    });
    const tooltip = host.shadowRoot!.querySelector('limel-tooltip')!;

    expect(tooltip.label).toBe('Close');
    expect(tooltip.helperLabel).toBe('Esc');
});

test('limel-navigation-button: points the tooltip at the control', async () => {
    const host = await renderButton({ type: 'close', label: 'Close' });
    const tooltip = host.shadowRoot!.querySelector('limel-tooltip')!;

    expect(host.shadowRoot!.querySelector(`#${tooltip.elementId}`)).toBe(
        getControl(host)
    );
});

test('limel-navigation-button: keeps the tooltip outside the control, so that its text is not text of the control', async () => {
    const host = await renderButton({ type: 'close', label: 'Close' });
    const tooltip = host.shadowRoot!.querySelector('limel-tooltip')!;

    expect(getControl(host).contains(tooltip)).toBe(false);
});

// The control is replaced when `href` is set or cleared, because a link is an
// `<a>` and a button is a `<button>`. The tooltip must follow the new control.
test('limel-navigation-button: shows the tooltip of a button that becomes a link', async () => {
    const host = await renderButton({ type: 'close', label: 'Close' });

    host.href = 'https://example.com/';
    await waitForChanges();
    hover(getControl(host));

    await vi.waitFor(() => expect(isTooltipVisible(host)).toBe(true), {
        timeout: 3000,
    });
});

test('limel-navigation-button: shows the tooltip of a link that becomes a button', async () => {
    const host = await renderButton({
        type: 'close',
        href: 'https://example.com/',
        label: 'Close',
    });

    host.href = undefined;
    await waitForChanges();
    hover(getControl(host));

    await vi.waitFor(() => expect(isTooltipVisible(host)).toBe(true), {
        timeout: 3000,
    });
});

test('limel-navigation-button: keeps the description of a button that becomes a link', async () => {
    const host = await renderButton({
        type: 'close',
        label: 'Close',
        helperLabel: 'Esc',
    });

    host.href = 'https://example.com/';
    await waitForChanges();

    await expect
        .poll(() => getAccessibleNodes('link'))
        .toEqual([{ name: 'Close', description: 'Esc' }]);
});

test('limel-navigation-button: has no tooltip when it has no label and no type', async () => {
    const host = await renderButton({});

    expect(host.shadowRoot!.querySelector('limel-tooltip')).toBeNull();
});

test.each([
    ['close', 'Close'],
    ['back', 'Back'],
    ['expand', 'Expand'],
    ['shrink', 'Shrink'],
    ['minimize', 'Minimize'],
    ['maximize', 'Maximize'],
    ['float', 'Open in side panel'],
    ['newTab', 'Open in new tab'],
])(
    'limel-navigation-button: names a button of the type %s "%s" when it has no label',
    async (type, name) => {
        await renderButton({ type });

        expect(await getAccessibleNodes('button')).toEqual([
            { name, description: '' },
        ]);
    }
);

test('limel-navigation-button: shows the name of the type in the tooltip when it has no label', async () => {
    const host = await renderButton({ type: 'close' });
    const tooltip = host.shadowRoot!.querySelector('limel-tooltip')!;

    expect(tooltip.label).toBe('Close');
});

test.each([
    ['sv', 'Stäng'],
    ['de', 'Schließen'],
    ['fi', 'Sulje'],
])(
    'limel-navigation-button: names the button in the language %s',
    async (language, name) => {
        await renderButton({ type: 'close', language });

        expect(await getAccessibleNodes('button')).toEqual([
            { name, description: '' },
        ]);
    }
);

test('limel-navigation-button: names the button again when the language changes', async () => {
    const host = await renderButton({ type: 'close' });

    host.language = 'sv';
    await waitForChanges();

    await expect
        .poll(() => getAccessibleNodes('button'))
        .toEqual([{ name: 'Stäng', description: '' }]);
});

test('limel-navigation-button: uses the label, and not the name of the type, when it has a label', async () => {
    await renderButton({
        type: 'close',
        label: 'Close customer details',
        language: 'sv',
    });

    expect(await getAccessibleNodes('button')).toEqual([
        { name: 'Close customer details', description: '' },
    ]);
});

test('limel-navigation-button: names a link after its type when it has no label', async () => {
    await renderButton({ type: 'newTab', href: 'https://example.com/' });

    expect(await getAccessibleNodes('link')).toEqual([
        { name: 'Open in new tab', description: '' },
    ]);
});

test('limel-navigation-button: uses label as the accessible name of a button', async () => {
    await renderButton({ type: 'close', label: 'Close' });

    expect(await getAccessibleNodes('button')).toEqual([
        { name: 'Close', description: '' },
    ]);
});

test('limel-navigation-button: uses label as the accessible name of a link', async () => {
    await renderButton({
        type: 'newTab',
        href: 'https://example.com/',
        label: 'Open in a new browser tab',
    });

    expect(await getAccessibleNodes('link')).toEqual([
        { name: 'Open in a new browser tab', description: '' },
    ]);
});

test('limel-navigation-button: uses helperLabel as the accessible description', async () => {
    await renderButton({
        type: 'close',
        label: 'Close',
        helperLabel: 'Esc',
    });

    expect(await getAccessibleNodes('button')).toEqual([
        { name: 'Close', description: 'Esc' },
    ]);
});

test('limel-navigation-button: moves focus to the control when the host is focused', async () => {
    const host = await renderButton({ type: 'close' });

    host.focus();

    expect(host.shadowRoot!.activeElement).toBe(getControl(host));
});

test('limel-navigation-button: lets a click reach a listener on the host', async () => {
    const onClick = vi.fn();
    const host = await renderButton({ type: 'close', onClick });

    getControl(host).click();

    expect(onClick).toHaveBeenCalledTimes(1);
});

test('limel-navigation-button: shows the hotkey in the tooltip', async () => {
    const host = await renderButton({
        type: 'close',
        label: 'Close',
        hotkey: 'escape',
    });
    const tooltip = host.shadowRoot!.querySelector('limel-tooltip')!;

    expect(tooltip.hotkey).toBe('escape');
});

test.each(['javascript:alert(1)', ' JavaScript:alert(1)', 'data:text/html,x'])(
    'limel-navigation-button: ignores the href %j, which can run a script',
    async (href) => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const host = await renderButton({ type: 'close', href });

        expect(getControl(host).tagName).toBe('BUTTON');
        expect(getControl(host).hasAttribute('href')).toBe(false);
        expect(warn).toHaveBeenCalledTimes(1);
    }
);

test('limel-navigation-button: warns when the href is changed to one that can run a script', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const host = await renderButton({
        type: 'close',
        href: 'https://example.com/',
    });

    host.href = 'javascript:alert(1)';
    await waitForChanges();

    expect(getControl(host).tagName).toBe('BUTTON');
    expect(warn).toHaveBeenCalledTimes(1);
});

test('limel-navigation-button: lets only one click through while Enter is held down', async () => {
    const onClick = vi.fn();
    const host = await renderButton({ type: 'close', onClick });
    const control = getControl(host);

    pressKey(control, 'keydown');
    control.click();
    control.click();
    control.click();

    expect(onClick).toHaveBeenCalledTimes(1);
});

test('limel-navigation-button: lets a click through again after Enter is released', async () => {
    const onClick = vi.fn();
    const host = await renderButton({ type: 'close', onClick });
    const control = getControl(host);

    pressKey(control, 'keydown');
    control.click();
    pressKey(control, 'keyup');
    control.click();

    expect(onClick).toHaveBeenCalledTimes(2);
});

test('limel-navigation-button: lets a click from a pointer through while Enter is held down', async () => {
    const onClick = vi.fn();
    const host = await renderButton({ type: 'close', onClick });
    const control = getControl(host);

    pressKey(control, 'keydown');
    control.click();
    clickWithPointer(control);
    clickWithPointer(control);

    expect(onClick).toHaveBeenCalledTimes(3);
});

test('limel-navigation-button: lets a click through on a new press of Enter, when the release of the last press was missed', async () => {
    const onClick = vi.fn();
    const host = await renderButton({ type: 'close', onClick });
    const control = getControl(host);

    pressKey(control, 'keydown');
    control.click();
    pressKey(control, 'keydown');
    control.click();

    expect(onClick).toHaveBeenCalledTimes(2);
});

test('limel-navigation-button: follows the link when click() is called on the element', async () => {
    const onClick = vi.fn();
    const host = await renderButton({
        type: 'close',
        href: '#followed-by-click',
        onClick,
    });

    host.click();

    expect(location.hash).toBe('#followed-by-click');
    expect(onClick).toHaveBeenCalledTimes(1);
    history.replaceState(null, '', location.pathname + location.search);
});

test('limel-navigation-button: lets a listener stop the link when click() is called on the element', async () => {
    const host = await renderButton({
        type: 'close',
        href: '#stopped-by-listener',
        onClick: (event: MouseEvent) => event.preventDefault(),
    });

    host.click();

    expect(location.hash).not.toBe('#stopped-by-listener');
});

test('limel-navigation-button: does not follow a disabled link when click() is called on the element', async () => {
    const host = await renderButton({
        type: 'close',
        href: '#disabled-link',
        disabled: true,
    });

    host.click();

    expect(location.hash).not.toBe('#disabled-link');
});

test('limel-navigation-button: lets click() on a button reach a listener once', async () => {
    const onClick = vi.fn();
    const host = await renderButton({ type: 'close', onClick });

    host.click();

    expect(onClick).toHaveBeenCalledTimes(1);
});

test('limel-navigation-button: gives the control the tabindex of the host', async () => {
    const host = await renderButton({ type: 'close', tabindex: '-1' });

    expect(getControl(host).getAttribute('tabindex')).toBe('-1');
});

test('limel-navigation-button: follows a change of the tabindex of the host', async () => {
    const host = await renderButton({ type: 'close', tabindex: '-1' });

    host.setAttribute('tabindex', '0');

    await vi.waitFor(() =>
        expect(getControl(host).getAttribute('tabindex')).toBe('0')
    );
});

test.each([
    ['button', undefined],
    ['link', 'https://example.com/'],
])(
    'limel-navigation-button: gives a disabled %s no tabindex, so that it cannot be focused',
    async (_mode, href) => {
        const host = await renderButton({
            type: 'close',
            href,
            tabindex: '0',
            disabled: true,
        });

        expect(getControl(host).hasAttribute('tabindex')).toBe(false);
    }
);

test('limel-navigation-button: warns only once about an href that is set right after the element is created', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const host = document.createElement('limel-navigation-button');
    host.type = 'close';
    host.label = 'Close';
    document.body.append(host);
    host.href = 'javascript:alert(1)';

    await host.componentOnReady();
    host.remove();

    expect(warn).toHaveBeenCalledTimes(1);
});

test('limel-navigation-button: ignores an href that is an array with a URL that can run a script', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const host = await renderButton({
        type: 'close',
        href: [' javascript:alert(1)'],
    });

    expect(getControl(host).tagName).toBe('BUTTON');
});

test('limel-navigation-button: draws the icon of the type maximize with the color in --navigation-button-icon-color', async () => {
    const host = await renderButton({
        type: 'maximize',
        style: { '--navigation-button-icon-color': 'rgb(255, 0, 0)' },
    });
    const icon = host.shadowRoot!.querySelector('svg')!;

    expect(getComputedStyle(icon).color).toBe('rgb(255, 0, 0)');
});

test('limel-navigation-button: gives the control no tabindex when the host has none', async () => {
    const host = await renderButton({ type: 'close' });

    expect(getControl(host).hasAttribute('tabindex')).toBe(false);
});

test.each(['--navigation-button-icon-color', '--header-menu-icon-color'])(
    'limel-navigation-button: draws the icon with the color in %s',
    async (property) => {
        const host = await renderButton({
            type: 'close',
            style: { [property]: 'rgb(255, 0, 0)' },
        });
        const icon = host.shadowRoot!.querySelector('svg')!;

        expect(getComputedStyle(icon).color).toBe('rgb(255, 0, 0)');
    }
);

test('limel-navigation-button: prefers --navigation-button-icon-color to the older property', async () => {
    const host = await renderButton({
        type: 'close',
        style: {
            '--navigation-button-icon-color': 'rgb(255, 0, 0)',
            '--header-menu-icon-color': 'rgb(0, 0, 255)',
        },
    });
    const icon = host.shadowRoot!.querySelector('svg')!;

    expect(getComputedStyle(icon).color).toBe('rgb(255, 0, 0)');
});

test('limel-navigation-button: is not disabled by default', async () => {
    await renderButton({ type: 'close', label: 'Close' });

    expect(await getAccessibleProperties('button')).toMatchObject([
        { disabled: false },
    ]);
});

test('limel-navigation-button: tells assistive technology that a disabled button is disabled', async () => {
    await renderButton({
        type: 'close',
        label: 'Close',
        disabled: true,
    });

    expect(await getAccessibleNodes('button')).toEqual([
        { name: 'Close', description: '' },
    ]);
    expect(await getAccessibleProperties('button')).toMatchObject([
        { disabled: true },
    ]);
});

test('limel-navigation-button: tells assistive technology that a disabled link is a disabled link', async () => {
    await renderButton({
        type: 'close',
        href: 'https://example.com/',
        label: 'Close',
        disabled: true,
    });

    expect(await getAccessibleNodes('link')).toEqual([
        { name: 'Close', description: '' },
    ]);
    expect(await getAccessibleProperties('link')).toMatchObject([
        { disabled: true },
    ]);
});

test('limel-navigation-button: gives a disabled link no destination, so that it cannot be followed', async () => {
    const host = await renderButton({
        type: 'newTab',
        href: 'https://example.com/',
        disabled: true,
    });
    const control = getControl(host);

    expect(control.tagName).toBe('A');
    expect(control.hasAttribute('href')).toBe(false);
    expect(control.hasAttribute('target')).toBe(false);
    expect(control.hasAttribute('rel')).toBe(false);
});

test('limel-navigation-button: gives a link its destination back when it is enabled again', async () => {
    const host = await renderButton({
        type: 'newTab',
        href: 'https://example.com/',
        disabled: true,
    });

    host.disabled = false;
    await waitForChanges();
    const control = getControl(host);

    expect(control.getAttribute('href')).toBe('https://example.com/');
    expect(control.getAttribute('target')).toBe('_blank');
    expect(control.hasAttribute('role')).toBe(false);
    expect(control.hasAttribute('aria-disabled')).toBe(false);
});

test.each([
    ['button', undefined],
    ['link', 'https://example.com/'],
])(
    'limel-navigation-button: does not move focus to a disabled %s',
    async (_mode, href) => {
        const host = await renderButton({
            type: 'close',
            href,
            disabled: true,
        });

        host.focus();

        expect(host.shadowRoot!.activeElement).toBeNull();
    }
);

test.each([
    ['button', undefined],
    ['link', 'https://example.com/'],
])(
    'limel-navigation-button: does not let a click on a disabled %s reach a listener on the host',
    async (_mode, href) => {
        const onClick = vi.fn();
        const host = await renderButton({
            type: 'close',
            href,
            disabled: true,
            onClick,
        });

        getControl(host).click();
        host.click();

        expect(onClick).not.toHaveBeenCalled();
    }
);

test.each([
    ['button', undefined],
    ['link', 'https://example.com/'],
])(
    'limel-navigation-button: shows the tooltip of a disabled %s',
    async (_mode, href) => {
        const host = await renderButton({
            type: 'close',
            href,
            label: 'Close',
            disabled: true,
        });

        hover(getControl(host));

        await vi.waitFor(() => expect(isTooltipVisible(host)).toBe(true), {
            timeout: 3000,
        });
    }
);

test.each(['expand', 'shrink'])(
    'limel-navigation-button: draws only the heads of the arrows of the type %s when the user does not point at it',
    async (type) => {
        const host = await renderButton({ type });

        expect(getArrowHeads(host)).toHaveLength(2);
        expect(getDrawnShafts(host)).toHaveLength(0);
    }
);

test.each(['expand', 'shrink'])(
    'limel-navigation-button: draws the shafts of the arrows of the type %s when the user points at it',
    async (type) => {
        const host = await renderButton({ type });

        await userEvent.hover(getControl(host));

        await vi.waitFor(() => expect(getDrawnShafts(host)).toHaveLength(2));
        await userEvent.unhover(getControl(host));
    }
);

test('limel-navigation-button: runs the hover animation when the button gets keyboard focus', async () => {
    const host = await renderButton({ type: 'expand' });

    await userEvent.tab();

    expect(getControl(host).matches(':focus-visible')).toBe(true);
    await vi.waitFor(() => expect(getDrawnShafts(host)).toHaveLength(2));
});

test('limel-navigation-button: moves the heads of the arrows of the type expand apart when the user points at it', async () => {
    const host = await renderButton({ type: 'expand' });
    const distance = getDistanceBetweenArrowHeads(host);

    await userEvent.hover(getControl(host));

    await vi.waitFor(() =>
        expect(getDistanceBetweenArrowHeads(host)).toBeGreaterThan(distance + 3)
    );
    await userEvent.unhover(getControl(host));
});

test('limel-navigation-button: moves the heads of the arrows of the type shrink together when the user points at it', async () => {
    const host = await renderButton({ type: 'shrink' });
    const distance = getDistanceBetweenArrowHeads(host);

    await userEvent.hover(getControl(host));

    await vi.waitFor(() =>
        expect(getDistanceBetweenArrowHeads(host)).toBeLessThan(distance - 3)
    );
    await userEvent.unhover(getControl(host));
});

test('limel-navigation-button: draws only one window for the type newTab when the user does not point at it', async () => {
    const host = await renderButton({ type: 'newTab' });
    const [behind, inFront] = getIconGroups(host);

    expect(getComputedStyle(behind).opacity).toBe('0');
    expect(getComputedStyle(inFront).opacity).toBe('1');
});

test('limel-navigation-button: shows a window behind the window of the type newTab, and moves them apart, when the user points at it', async () => {
    const host = await renderButton({ type: 'newTab' });
    const [behind] = getIconGroups(host);

    await userEvent.hover(getControl(host));

    await vi.waitFor(() => {
        expect(getComputedStyle(behind).opacity).toBe('0.6');
        expect(getDistanceBetweenIconGroups(host)).toBeGreaterThan(3);
    });
    await userEvent.unhover(getControl(host));
});

test('limel-navigation-button: draws the arrow of the type newTab inside the window when the user does not point at it', async () => {
    const host = await renderButton({ type: 'newTab' });

    expect(getDrawnPartOfArrowShaft(host)).toBe(0.5);
});

test('limel-navigation-button: draws the arrow of the type newTab from the window behind into the window in front when the user points at it', async () => {
    const host = await renderButton({ type: 'newTab' });

    await userEvent.hover(getControl(host));

    await vi.waitFor(() => expect(getDrawnPartOfArrowShaft(host)).toBe(1));
    await userEvent.unhover(getControl(host));
});

test.each(['expand', 'shrink', 'newTab'])(
    'limel-navigation-button: draws nothing around the icon of the type %s',
    async (type) => {
        const host = await renderButton({ type });
        const control = getControl(host);

        expect(getComputedStyle(control, '::before').content).toBe('none');
        expect(getComputedStyle(control, '::after').content).toBe('none');
    }
);

test('limel-navigation-button: draws the small pane of the maximize type when the user does not point at it', async () => {
    const host = await renderButton({ type: 'maximize' });
    const pane = getComputedStyle(getControl(host), '::before');

    expect(pane.position).toBe('absolute');
    expect(Number.parseFloat(pane.width)).toBeGreaterThan(0);
    expect(Number.parseFloat(pane.height)).toBeGreaterThan(0);
});

test('limel-navigation-button: draws the line of the back arrow as thick as the lines of the icon', async () => {
    const host = await renderButton({ type: 'back' });
    const icon = host.shadowRoot!.querySelector('svg')!;
    const unit = icon.getBoundingClientRect().width / 32;
    const strokeWidth = Number.parseFloat(getComputedStyle(icon).strokeWidth);
    const line = getComputedStyle(getControl(host), '::after');

    expect(Number.parseFloat(line.height)).toBeCloseTo(strokeWidth * unit, 3);
});

async function renderButton(
    props: Record<string, unknown>
): Promise<HTMLLimelNavigationButtonElement> {
    const page = await render(<limel-navigation-button {...props} />);
    pages.push(page);

    return page.root as HTMLLimelNavigationButtonElement;
}

function getControl(host: HTMLElement): HTMLElement {
    return host.shadowRoot!.querySelector('.navigation-button')!;
}

function getIconGroups(host: HTMLElement): SVGGElement[] {
    return [...host.shadowRoot!.querySelectorAll<SVGGElement>('g')];
}

function getArrowHeads(host: HTMLElement): SVGPathElement[] {
    return getIconGroups(host).map((arrow) => arrow.querySelector('path')!);
}

// The left edges, because the window behind is an open outline, and so its
// box is smaller on the right.
function getDistanceBetweenIconGroups(host: HTMLElement): number {
    const [first, second] = getIconGroups(host).map((group) =>
        group.getBoundingClientRect()
    );

    return Math.abs(first.left - second.left);
}

// The shaft is drawn from the tip of the arrow, and has a length of 1.
function getDrawnPartOfArrowShaft(host: HTMLElement): number {
    const shaft = getIconGroups(host).at(-1)!.querySelector('path:last-child')!;

    return 1 - Number.parseFloat(getComputedStyle(shaft).strokeDashoffset);
}

function getDrawnShafts(host: HTMLElement): SVGPathElement[] {
    const shafts =
        host.shadowRoot!.querySelectorAll<SVGPathElement>('g path:last-child');

    return [...shafts].filter(
        (shaft) =>
            Number.parseFloat(getComputedStyle(shaft).strokeDashoffset) === 0
    );
}

function getDistanceBetweenArrowHeads(host: HTMLElement): number {
    const [first, second] = getArrowHeads(host).map((head) =>
        head.getBoundingClientRect()
    );

    return Math.hypot(first.x - second.x, first.y - second.y);
}

function getIconPath(host: HTMLElement): string | null | undefined {
    return host.shadowRoot!.querySelector('svg path')?.getAttribute('d');
}

/**
 * Renders a button of each type, and gets the path of the icon of each.
 *
 * @returns the path data of the icon, by type
 */
async function renderAllTypes(): Promise<Record<string, string>> {
    const page = await render(
        <div>
            {TYPES.map((type) => (
                <limel-navigation-button type={type} label={type} />
            ))}
        </div>
    );
    pages.push(page);
    const hosts = page.root!.querySelectorAll('limel-navigation-button');

    return Object.fromEntries(
        [...hosts].map((host) => [host.type, getIconPath(host)!])
    );
}

async function waitForChanges() {
    await pages.at(-1)!.waitForChanges();
}

function pressKey(element: HTMLElement, type: 'keydown' | 'keyup') {
    element.dispatchEvent(
        new KeyboardEvent(type, { key: 'Enter', bubbles: true, composed: true })
    );
}

function clickWithPointer(element: HTMLElement) {
    element.dispatchEvent(
        new MouseEvent('click', { bubbles: true, composed: true, detail: 1 })
    );
}

function hover(element: HTMLElement) {
    element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
}

function isTooltipVisible(host: HTMLElement): boolean {
    const tooltip = host.shadowRoot!.querySelector('limel-tooltip')!;
    const portal = tooltip.shadowRoot!.querySelector('limel-portal');

    return !!(portal as HTMLLimelPortalElement | null)?.visible;
}
