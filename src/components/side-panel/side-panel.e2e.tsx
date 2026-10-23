import { render, h } from '@stencil/vitest';
import { afterEach, expect, test, vi } from 'vitest';
import { ESCAPE } from '../../util/keycodes';
import { getAccessibleNames } from '../../util/test/accessibility-tree';
import type { SidePanelEntry } from './side-panel.types';

const OWN_EVENTS = ['close', 'changeWidth'];

type Page = Awaited<ReturnType<typeof render>>;

// A list instead of a `let`, because the lint rules do not allow reassignment of
// top-level variables in functions.
const pages: Page[] = [];

// Listeners on `document` are not removed by `unmount`, so they are aborted after
// each test.
const listeners: AbortController[] = [];

// Elements that a test adds to the page without `render`.
const addedElements: HTMLElement[] = [];

afterEach(() => {
    for (const listener of listeners.splice(0)) {
        listener.abort();
    }

    for (const element of addedElements.splice(0)) {
        element.remove();
    }

    for (const page of pages.splice(0)) {
        page.unmount();
    }
});

test('limel-side-panel: is a dialog that does not block the page', async () => {
    await renderPanel();

    expect(getPanel().getAttribute('role')).toBe('dialog');
    expect(getPanel().hasAttribute('aria-modal')).toBe(false);
});

test('limel-side-panel: uses label as the accessible name of the dialog', async () => {
    await renderPanel({ label: 'Edit the list' });

    expect(getPanel().getAttribute('aria-label')).toBe('Edit the list');
});

test('limel-side-panel: has no accessible name when label is not set', async () => {
    await renderPanel();

    expect(getPanel().hasAttribute('aria-label')).toBe(false);
});

test('limel-side-panel: moves focus into the panel when it opens', async () => {
    await renderPanel();

    expect(getHost().shadowRoot!.activeElement).toBe(getPanel());
});

test('limel-side-panel: returns focus to the element that had it before when the panel is removed', async () => {
    const opener = addButton(document.body);
    opener.focus();
    const panel = await addPanel(document.body);

    panel.remove();
    await waitForMicrotasks();

    expect(document.activeElement).toBe(opener);
});

test('limel-side-panel: returns focus to an element inside a shadow root', async () => {
    const container = document.createElement('div');
    addedElements.push(container);
    document.body.append(container);
    const shadowRoot = container.attachShadow({ mode: 'open' });
    const opener = addButton(shadowRoot);
    opener.focus();
    const panel = await addPanel(document.body);

    panel.remove();
    await waitForMicrotasks();

    expect(shadowRoot.activeElement).toBe(opener);
});

test('limel-side-panel: does not take focus back when focus is somewhere else when the panel is removed', async () => {
    const opener = addButton(document.body);
    const other = addButton(document.body);
    opener.focus();
    const panel = await addPanel(document.body);
    other.focus();

    panel.remove();
    await waitForMicrotasks();

    expect(document.activeElement).toBe(other);
});

test('limel-side-panel: does not return focus when the panel is only moved in the DOM', async () => {
    const opener = addButton(document.body);
    opener.focus();
    const panel = await addPanel(document.body);
    const newParent = document.createElement('div');
    addedElements.push(newParent);
    document.body.append(newParent);

    newParent.append(panel);
    await waitForMicrotasks();

    expect(document.activeElement).not.toBe(opener);
});

test('limel-side-panel: renders the content in the default slot', async () => {
    await renderPanel();

    expect(getContentSlot().assignedElements()).toEqual([getGivenContent()]);
});

test('limel-side-panel: emits close when the close button is clicked', async () => {
    await renderPanel();
    const closed = listenFor('close');

    await pressCloseButton();

    expect(closed).toHaveLength(1);
});

test('limel-side-panel: uses closeLabel as the label of the close button', async () => {
    await renderPanel({ closeLabel: 'Stäng' });

    expect(getCloseButton().getAttribute('aria-label')).toBe('Stäng');
    expect(getCloseButton().querySelector('limel-tooltip')!.label).toBe(
        'Stäng'
    );
});

test('limel-side-panel: shows the heading of the last stack entry', async () => {
    await renderPanel({
        stack: [{ heading: 'Start page' }, { heading: 'Sales pipe' }],
    });

    expect(getHeaderPart('.heading').textContent).toBe('Sales pipe');
});

test('limel-side-panel: shows the subheading of the last stack entry', async () => {
    await renderPanel({
        stack: [{ heading: 'Sales pipe', subheading: 'Start page widget' }],
    });

    expect(getHeaderPart('.subheading').textContent).toBe('Start page widget');
});

test('limel-side-panel: shows the icon of the last stack entry', async () => {
    await renderPanel({
        stack: [{ heading: 'Sales pipe', icon: 'sales_performance' }],
    });

    expect(getHeaderPart<HTMLLimelIconElement>('limel-icon').name).toBe(
        'sales_performance'
    );
});

test('limel-side-panel: uses the colors of the icon of the last stack entry', async () => {
    await renderPanel({
        stack: [
            {
                heading: 'Sales pipe',
                icon: {
                    name: 'sales_performance',
                    color: 'rgb(255, 0, 0)',
                    backgroundColor: 'rgb(0, 0, 255)',
                },
            },
        ],
    });

    const icon = getHeaderPart<HTMLLimelIconElement>('limel-icon');

    expect(icon.name).toBe('sales_performance');
    expect(getComputedStyle(icon).color).toBe('rgb(255, 0, 0)');
    expect(getComputedStyle(icon).backgroundColor).toBe('rgb(0, 0, 255)');
});

test('limel-side-panel: paints the header with the color of the last stack entry', async () => {
    await renderPanel({
        stack: [{ heading: 'Sales pipe', color: 'rgb(0, 128, 128)' }],
    });

    expect(getComputedStyle(getHeader()).backgroundColor).toBe(
        'rgb(0, 128, 128)'
    );
});

// The test page does not load the theme, which defines `--color-black`.
test('limel-side-panel: adds a text shadow to the headings on a painted header', async () => {
    await renderPanel({
        style: { '--color-black': '0, 0, 0' },
        stack: [
            {
                heading: 'Sales pipe',
                subheading: 'Start page widget',
                color: 'rgb(0, 128, 128)',
            },
        ],
    });

    for (const heading of getHeadings()) {
        expect(getComputedStyle(heading).textShadow).not.toBe('none');
    }
});

test('limel-side-panel: shows the headings in white on a painted header', async () => {
    await renderPanel({
        style: { '--color-white': '255, 255, 255' },
        stack: [
            {
                heading: 'Sales pipe',
                subheading: 'Start page widget',
                color: 'rgb(0, 128, 128)',
            },
        ],
    });

    for (const heading of getHeadings()) {
        expect(getComputedStyle(heading).color).toBe('rgb(255, 255, 255)');
    }
});

test('limel-side-panel: does not add a text shadow to the headings on a header without a color', async () => {
    await renderPanel({
        style: { '--color-black': '0, 0, 0' },
        stack: [{ heading: 'Sales pipe' }],
    });

    expect(getComputedStyle(getHeaderPart('.heading')).textShadow).toBe('none');
});

test('limel-side-panel: does not show a header when the stack is empty', async () => {
    await renderPanel();

    expect(getHeader()).toBeNull();
});

test('limel-side-panel: shows a button for each action, labeled with its label', async () => {
    await renderPanel({
        actions: [
            { type: 'expand', label: 'Expand' },
            { type: 'newTab', label: 'Open in a new tab' },
        ],
    });

    expect(
        getActionButtons().map((button) => button.getAttribute('aria-label'))
    ).toEqual(['Expand', 'Open in a new tab']);
});

test('limel-side-panel: shows the icon of the type of each action', async () => {
    await renderPanel({
        actions: [
            { type: 'expand', label: 'Expand' },
            { type: 'newTab', label: 'Open in a new tab' },
        ],
    });

    expect(
        getActionButtons().map(
            (button) => button.querySelector('limel-icon')!.name
        )
    ).toEqual(['expand', 'up_right_arrow']);
});

test('limel-side-panel: emits selectAction with the id of the clicked action and the click event', async () => {
    await renderPanel({
        actions: [
            { type: 'expand', label: 'Expand', id: 'expand-widget' },
            { type: 'newTab', label: 'Open in a new tab', id: 'open-widget' },
        ],
    });
    const selected = listenFor('selectAction');
    const click = new MouseEvent('click', { cancelable: true });

    getActionButtons()[1].dispatchEvent(click);

    expect(selected).toEqual([{ id: 'open-widget', event: click }]);
});

test('limel-side-panel: emits selectAction with the type of a clicked action that has no id', async () => {
    await renderPanel({ actions: [{ type: 'expand', label: 'Expand' }] });
    const selected = listenFor<{ id: string }>('selectAction');

    getActionButtons()[0].click();

    expect(selected.map((detail) => detail.id)).toEqual(['expand']);
});

test('limel-side-panel: shows the label and helperLabel of an action in a tooltip', async () => {
    await renderPanel({
        actions: [
            {
                type: 'newTab',
                label: 'Open in a new tab',
                helperLabel: 'Sales pipe',
            },
        ],
    });
    const button = getActionButtons()[0];
    const tooltip = button.querySelector('limel-tooltip')!;

    expect(tooltip.elementId).toBe(button.id);
    expect(tooltip.label).toBe('Open in a new tab');
    expect(tooltip.helperLabel).toBe('Sales pipe');
});

test('limel-side-panel: shows an action with an href as a link', async () => {
    await renderPanel({
        actions: [
            { type: 'expand', label: 'Expand', href: 'https://example.com/' },
        ],
    });
    const link = getActionButtons()[0];

    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('https://example.com/');
});

test('limel-side-panel: opens a newTab action with an href in a new tab', async () => {
    await renderPanel({
        actions: [
            { type: 'newTab', label: 'Open', href: 'https://example.com/' },
            { type: 'expand', label: 'Expand', href: 'https://example.com/' },
        ],
    });

    expect(
        getActionButtons().map((link) => link.getAttribute('target'))
    ).toEqual(['_blank', null]);
});

test('limel-side-panel: marks each action with its type, for its hover animation', async () => {
    await renderPanel({
        actions: [
            { type: 'expand', label: 'Expand' },
            { type: 'newTab', label: 'Open in a new tab' },
        ],
    });

    expect(
        getActionButtons().map((button) => button.classList.contains('expand'))
    ).toEqual([true, false]);
    expect(
        getActionButtons().map((button) => button.classList.contains('newTab'))
    ).toEqual([false, true]);
});

// `limel-tooltip` reads `--tooltip-z-index` from its host and sets it as the
// z-index of its portal container, which is outside the panel.
test('limel-side-panel: shows the toolbar tooltips above the panel', async () => {
    await renderPanel({
        style: { '--side-panel-z-index': '20' },
        actions: [{ type: 'expand', label: 'Expand' }],
    });
    const tooltips = getPage().root!.shadowRoot!.querySelectorAll(
        '.toolbar limel-tooltip'
    );

    expect(tooltips).toHaveLength(2);
    for (const tooltip of tooltips) {
        expect(zIndexOfPortalFor(tooltip)).toBe('21');
    }
});

test('limel-side-panel: shows the header-actions slot in the header', async () => {
    await renderPanel({ stack: [{ heading: 'Sales pipe' }] });

    expect(getHeader().contains(getGivenHeaderAction().assignedSlot)).toBe(
        true
    );
});

test('limel-side-panel: tells the header actions to use white text on a painted header', async () => {
    await renderPanel({
        style: { '--color-white': '255, 255, 255' },
        stack: [{ heading: 'Sales pipe', color: 'rgb(0, 128, 128)' }],
    });
    const probe = document.createElement('span');
    probe.style.color = 'var(--side-panel-header-text-color)';
    getGivenHeaderAction().append(probe);

    expect(getComputedStyle(probe).color).toBe('rgb(255, 255, 255)');
});

test('limel-side-panel: places the header actions at the right end of the header, centered vertically', async () => {
    const header = await renderPanelWithHeaderActions({
        heading: 'Sales pipe',
    });
    const headerBox = header.getBoundingClientRect();
    const actionsBox = getGivenHeaderAction().getBoundingClientRect();

    expect(headerBox.right - actionsBox.right).toBeCloseTo(12, 0);
    expect(centerOf(actionsBox)).toBeCloseTo(centerOf(headerBox), 0);
});

test('limel-side-panel: truncates a long heading before the header actions', async () => {
    const header = await renderPanelWithHeaderActions({
        heading: LONG_HEADING,
    });
    const heading = header.shadowRoot!.querySelector('.heading')!;

    expect(heading.scrollWidth).toBeGreaterThan(heading.clientWidth);
    expect(heading.getBoundingClientRect().right).toBeLessThanOrEqual(
        getGivenHeaderAction().getBoundingClientRect().left
    );
});

test('limel-side-panel: shows the full heading and subheading as a tooltip when they are cut off', async () => {
    await renderPanel({
        stack: [{ heading: LONG_HEADING, subheading: LONG_HEADING }],
    });

    expect(getHeaderPart('.heading').getAttribute('title')).toBe(LONG_HEADING);
    expect(getHeaderPart('.subheading').getAttribute('title')).toBe(
        LONG_HEADING
    );
});

test('limel-side-panel: does not make small header actions narrower when the heading is long', async () => {
    await renderPanelWithHeaderActions({ heading: LONG_HEADING });

    // `offsetWidth`, because the opening animation scales the panel.
    expect(getGivenHeaderAction().offsetWidth).toBe(SMALL_HEADER_ACTION.width);
});

test('limel-side-panel: keeps space for the headings when the header actions are wide', async () => {
    const header = await renderPanelWithHeaderActions(
        { heading: LONG_HEADING },
        { width: 2000, height: 24 }
    );
    const headerWidth = header.getBoundingClientRect().width;

    expect(
        header.shadowRoot!.querySelector('.headings')!.getBoundingClientRect()
            .width
    ).toBeGreaterThan(headerWidth * 0.4);
    expect(header.scrollWidth).toBe(header.clientWidth);
});

test('limel-side-panel: does not make the header taller when the header actions are tall', async () => {
    const entry = { heading: 'Sales pipe', subheading: 'Start page widget' };
    // `offsetHeight`, because the opening animation scales the panel.
    const normalHeader = await renderPanelWithHeaderActions(entry);
    const normalHeight = normalHeader.offsetHeight;

    const header = await renderPanelWithHeaderActions(entry, {
        width: 80,
        height: 300,
    });

    expect(header.offsetHeight).toBe(normalHeight);
});

test('limel-side-panel: does not make the header taller when the header actions are tall and there is no subheading', async () => {
    const entry = { heading: 'Sales pipe' };
    const withTinyAction = await renderPanelWithHeaderActions(entry, {
        width: 1,
        height: 1,
    });
    const normalHeight = withTinyAction.offsetHeight;

    const header = await renderPanelWithHeaderActions(entry, {
        width: 80,
        height: 300,
    });

    expect(header.offsetHeight).toBe(normalHeight);
});

test('limel-side-panel: does not show the header actions when the stack is empty', async () => {
    await renderPanel();

    expect(getGivenHeaderAction().assignedSlot).toBeNull();
    expect(getGivenHeaderAction().getClientRects()).toHaveLength(0);
});

test('limel-side-panel: shows tooltips in the header actions above the panel', async () => {
    await renderPanel({
        style: { '--side-panel-z-index': '20' },
        stack: [{ heading: 'Sales pipe' }],
    });
    const tooltip = document.createElement('limel-tooltip');
    getGivenHeaderAction().append(tooltip);

    expect(zIndexOfPortalFor(tooltip)).toBe('21');
});

test('limel-side-panel: shows a back for each stack entry except the last, labeled with its heading', async () => {
    await renderPanel({
        stack: [
            { heading: 'Start page' },
            { heading: 'Sales pipe' },
            { heading: 'Rules' },
        ],
    });

    expect(getBacks().map((back) => back.getAttribute('aria-label'))).toEqual([
        'Start page',
        'Sales pipe',
    ]);
});

test('limel-side-panel: emits selectStackEntry with the index of the clicked back', async () => {
    await renderPanel({
        stack: [
            { heading: 'Start page' },
            { heading: 'Sales pipe' },
            { heading: 'Rules' },
        ],
    });
    const selected = listenFor('selectStackEntry');

    getBacks()[1].click();

    expect(selected).toEqual([1]);
});

test('limel-side-panel: moves focus to the close button when the focused back is removed', async () => {
    const panel = await renderPanel({ stack: THREE_PANELS });
    goBackOnSelectStackEntry(panel);

    getBacks()[1].focus();
    getBacks()[1].click();
    await getPage().waitForChanges();

    expect(panel.shadowRoot!.activeElement).toBe(getCloseButton());
});

test('limel-side-panel: does not move focus when the stack is emptied and no back has focus', async () => {
    const panel = (await renderPanel({
        stack: THREE_PANELS,
    })) as HTMLLimelSidePanelElement;
    const content = getGivenContent();
    content.tabIndex = 0;
    content.focus();

    panel.stack = [];
    await getPage().waitForChanges();

    expect(document.activeElement).toBe(content);
});

// A back has no room for text, so the color of its band tells the backs apart.
test('limel-side-panel: paints the band of a back with the color of its entry', async () => {
    await renderPanel({
        stack: [
            { heading: 'Start page', color: 'rgb(0, 128, 128)' },
            { heading: 'Sales pipe' },
        ],
    });
    const band = getBacks()[0].querySelector('.back-band')!;

    expect(getComputedStyle(band).backgroundColor).toBe('rgb(0, 128, 128)');
});

test('limel-side-panel: shows the heading and subheading of a back in a tooltip', async () => {
    await renderPanel({
        stack: [
            { heading: 'Start page', subheading: 'Lime CRM' },
            { heading: 'Sales pipe' },
        ],
    });
    const back = getBacks()[0];
    const tooltip = back.querySelector('limel-tooltip')!;

    expect(tooltip.elementId).toBe(back.id);
    expect(tooltip.label).toBe('Start page');
    expect(tooltip.helperLabel).toBe('Lime CRM');
});

// Only the left edge of a back is visible, so a tooltip above the middle of
// the back would be far from the pointer.
test('limel-side-panel: opens the tooltip of a back to the left', async () => {
    await renderPanel({ stack: THREE_PANELS });

    for (const back of getBacks()) {
        expect(back.querySelector('limel-tooltip')!.openDirection).toBe('left');
    }
});

const THREE_PANELS: SidePanelEntry[] = [
    { heading: 'Start page' },
    { heading: 'Sales pipe' },
    { heading: 'Rules' },
];

// `offsetWidth`, because the backs are scaled with a transform.
test('limel-side-panel: gives each back the width of the panel', async () => {
    const panel = await renderSizedPanel(THREE_PANELS);

    expect(getBacks().map((back) => back.offsetWidth)).toEqual([400, 400]);
    expect(widthOf(panel)).toBe(400);
});

test('limel-side-panel: gives each back the width that the user resized the panel to', async () => {
    await renderSizedPanel(THREE_PANELS);
    const edge = getHandle().getBoundingClientRect().left;

    await dragHandleTo(edge, edge - 60);

    expect(getBacks().map((back) => back.offsetWidth)).toEqual([460, 460]);
});

// The test browser is 414px wide, and `elementFromPoint` only finds elements
// inside the viewport.
test('limel-side-panel: shows the backs behind the panel, further to the left the further back they are', async () => {
    const page = await render(
        <div style={{ position: 'relative', width: '400px', height: '400px' }}>
            <limel-side-panel
                style={{
                    '--side-panel-width': '200px',
                    '--side-panel-min-width': '100px',
                }}
                stack={THREE_PANELS}
            />
        </div>
    );
    pages.push(page);
    finishOpeningAnimation();
    const panelBox = getPanel().getBoundingClientRect();
    const [first, second] = getBacks().map((back) =>
        back.getBoundingClientRect()
    );

    expect(first.left).toBeLessThan(second.left);
    expect(second.left).toBeLessThan(panelBox.left);
    const inFront = getHost().shadowRoot!.elementFromPoint(
        panelBox.left + 1,
        centerOf(panelBox)
    );
    expect(getPanel().contains(inFront)).toBe(true);
});

// `offsetTop` and `offsetHeight`, because the backs are scaled with a transform.
test('limel-side-panel: draws the band of a back where the panel has its header', async () => {
    await renderSizedPanel(THREE_PANELS);
    const header = getHeader();
    const band = getBacks()[0].querySelector<HTMLElement>('.back-band')!;

    expect([band.offsetTop, band.offsetHeight]).toEqual([
        header.offsetTop,
        header.offsetHeight,
    ]);
});

test('limel-side-panel: shows the tooltips of the backs above the panel', async () => {
    await renderPanel({
        style: { '--side-panel-z-index': '20' },
        stack: THREE_PANELS,
    });

    for (const back of getBacks()) {
        expect(zIndexOfPortalFor(back.querySelector('limel-tooltip')!)).toBe(
            '21'
        );
    }
});

test('limel-side-panel: has no resize handle in full screen', async () => {
    await renderPanel({ fullScreen: true });

    expect(getHandle()).toBeNull();
});

test('limel-side-panel: does not show the backs in full screen', async () => {
    await renderPanel({ fullScreen: true, stack: THREE_PANELS });

    expect(getBacks()).toEqual([]);
});

test('limel-side-panel: moves focus to the close button when full screen removes the focused back', async () => {
    const panel = (await renderPanel({
        stack: THREE_PANELS,
    })) as HTMLLimelSidePanelElement;
    getBacks()[1].focus();

    panel.fullScreen = true;
    await getPage().waitForChanges();

    expect(panel.shadowRoot!.activeElement).toBe(getCloseButton());
});

// A consumer that builds `stack` on each render sets a new array of the same
// length together with `fullScreen`.
test('limel-side-panel: moves focus to the close button when full screen and a new stack of the same length are set together', async () => {
    const panel = (await renderPanel({
        stack: THREE_PANELS,
    })) as HTMLLimelSidePanelElement;
    getBacks()[1].focus();

    panel.fullScreen = true;
    panel.stack = [...THREE_PANELS];
    await getPage().waitForChanges();

    expect(panel.shadowRoot!.activeElement).toBe(getCloseButton());
});

test('limel-side-panel: covers the full width of the positioned ancestor in full screen, below the top inset', async () => {
    const page = await render(
        <div style={{ position: 'relative', width: '400px', height: '400px' }}>
            <limel-side-panel
                fullScreen={true}
                style={{
                    '--side-panel-top-inset': '40px',
                    '--side-panel-right-inset': '50px',
                    '--side-panel-bottom-inset': '30px',
                }}
            />
        </div>
    );
    pages.push(page);
    const panel = getPanel();

    expect([
        panel.offsetLeft,
        panel.offsetTop,
        panel.offsetWidth,
        panel.offsetHeight,
    ]).toEqual([0, 40, 400, 330]);
});

test('limel-side-panel: has no rounded corners in full screen', async () => {
    await renderPanel({ fullScreen: true });

    for (const element of [
        getPanel(),
        getHost().shadowRoot!.querySelector('.content')!,
    ]) {
        expect(getComputedStyle(element).borderTopLeftRadius).toBe('0px');
    }
});

test('limel-side-panel: covers the full width in full screen after the user resized it', async () => {
    const panel = await renderSizedPanel();
    const edge = getHandle().getBoundingClientRect().left;
    await dragHandleTo(edge, edge - 60);

    (panel as HTMLLimelSidePanelElement).fullScreen = true;
    await getPage().waitForChanges();

    expect(widthOf(panel)).toBe(1000);
});

const LONG_HEADING = 'A heading that is far too long '.repeat(5);

const PORTAL_Z_INDEXES = [
    '--dropdown-z-index',
    '--popover-z-index',
    '--tooltip-z-index',
];

test('limel-side-panel: shows dropdowns, popovers and tooltips in the content above the panel', async () => {
    await renderPanel({ style: { '--side-panel-z-index': '20' } });

    expect(
        PORTAL_Z_INDEXES.map((property) =>
            zIndexOfPortalFor(getGivenContent(), property)
        )
    ).toEqual(['21', '21', '21']);
});

test('limel-side-panel: uses the z-indexes of dropdowns, popovers and tooltips that the consumer sets', async () => {
    const panel = await renderPanel({
        style: { '--side-panel-z-index': '20' },
    });
    panel.parentElement!.style.setProperty('--dropdown-z-index', '100');
    panel.parentElement!.style.setProperty('--popover-z-index', '101');
    panel.style.setProperty('--tooltip-z-index', '102');

    expect(
        PORTAL_Z_INDEXES.map((property) =>
            zIndexOfPortalFor(getGivenContent(), property)
        )
    ).toEqual(['100', '101', '102']);
});

test('limel-side-panel: emits close when Escape is pressed', async () => {
    await renderPanel();
    const closed = listenFor('close');

    await pressEscape();

    expect(closed).toHaveLength(1);
});

test('limel-side-panel: does not emit close when the content prevents the Escape event', async () => {
    await renderPanel();
    const closed = listenFor('close');
    useEscapeOn(getGivenContent());

    await pressEscape();

    expect(closed).toEqual([]);
});

// `limel-popover` adds its listener on `document` when it opens, which is after
// the panel was connected.
test('limel-side-panel: does not emit close when a later document listener prevents the Escape event', async () => {
    await renderPanel();
    const closed = listenFor('close');
    useEscapeOn(document);

    await pressEscape();

    expect(closed).toEqual([]);
});

test('limel-side-panel: does not emit close when Escape is pressed and closeOnEscape is false', async () => {
    await renderPanel({ closeOnEscape: false });
    const closed = listenFor('close');

    await pressEscape();

    expect(closed).toEqual([]);
});

test('limel-side-panel: does not prevent the Escape event when closeOnEscape is false', async () => {
    await renderPanel({ closeOnEscape: false });
    const escape = escapeKeyDown();

    getGivenContent().dispatchEvent(escape);

    expect(escape.defaultPrevented).toBe(false);
});

test('limel-side-panel: emits close when the close button is clicked and closeOnEscape is false', async () => {
    await renderPanel({ closeOnEscape: false });
    const closed = listenFor('close');

    await pressCloseButton();

    expect(closed).toHaveLength(1);
});

test('limel-side-panel: emits close for Escape again when closeOnEscape is set back to true', async () => {
    const panel = await renderPanel({ closeOnEscape: false });
    const closed = listenFor('close');

    (panel as HTMLLimelSidePanelElement).closeOnEscape = true;
    await pressEscape();

    expect(closed).toHaveLength(1);
});

test('limel-side-panel: prevents the Escape event when it emits close', async () => {
    await renderPanel();
    const escape = escapeKeyDown();

    getGivenContent().dispatchEvent(escape);

    expect(escape.defaultPrevented).toBe(true);
});

test('limel-side-panel: removes the Escape listener when disconnected', async () => {
    await renderPanel();
    const removeEventListener = vi.spyOn(window, 'removeEventListener');

    getPage().root!.remove();

    expect(removeEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
    );
    removeEventListener.mockRestore();
});

test('limel-side-panel: is not wider than a positioned ancestor that is narrower than the minimum width', async () => {
    const page = await render(
        <div style={{ position: 'relative', width: '300px', height: '400px' }}>
            <limel-side-panel />
        </div>
    );
    pages.push(page);
    const panel = page.root!.querySelector('limel-side-panel')!;

    const width = panel
        .shadowRoot!.querySelector('section')!
        .getBoundingClientRect().width;

    expect(width).toBeLessThanOrEqual(300);
});

test('limel-side-panel: emits close only from the last opened panel when Escape is pressed', async () => {
    const [first, second] = await renderTwoPanels();
    const closed = listenForCloseOn([first, second]);

    document.body.dispatchEvent(escapeKeyDown());

    expect(closed).toEqual([second]);
});

test('limel-side-panel: emits close from no panel when the last opened panel has closeOnEscape set to false', async () => {
    const [first, second] = await renderTwoPanels();
    (second as HTMLLimelSidePanelElement).closeOnEscape = false;
    const closed = listenForCloseOn([first, second]);

    document.body.dispatchEvent(escapeKeyDown());

    expect(closed).toEqual([]);
});

test('limel-side-panel: emits close from the earlier panel when the last opened panel is removed', async () => {
    const [first, second] = await renderTwoPanels();
    const closed = listenForCloseOn([first, second]);
    second.remove();

    document.body.dispatchEvent(escapeKeyDown());

    expect(closed).toEqual([first]);
});

test('limel-side-panel: uses the width that the edge is dragged to', async () => {
    const panel = await renderSizedPanel();
    const edge = getHandle().getBoundingClientRect().left;

    await dragHandleTo(edge, edge - 60);

    expect(widthOf(panel)).toBe(460);
});

test('limel-side-panel: uses the width that the arrow keys resize it to', async () => {
    const panel = await renderSizedPanel();

    getHandle().dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
    );
    await getPage().waitForChanges();

    expect(widthOf(panel)).toBe(408);
});

test('limel-side-panel: starts with the width from --side-panel-width', async () => {
    const panel = await renderSizedPanel();

    expect(widthOf(panel)).toBe(400);
});

test('limel-side-panel: uses and emits the clamped width when dragged past the maximum width', async () => {
    const panel = await renderSizedPanel();
    const widths: number[] = [];
    panel.addEventListener('changeWidth', (event: CustomEvent<number>) => {
        widths.push(event.detail);
    });
    const edge = getHandle().getBoundingClientRect().left;

    await dragHandleTo(edge, edge - 500);

    expect(widthOf(panel)).toBe(600);
    expect(widths).toEqual([600]);
});

test('limel-side-panel: emits changeWidth when the edge is dragged', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await dragEdge({ from: 1000, to: 940 });

    expect(widths).toEqual([460]);
    expect(getPage().root!.style.getPropertyValue('--side-panel-width')).toBe(
        ''
    );
});

test('limel-side-panel: does not emit changeWidth before the drag ends', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await startDragging({ from: 1000, to: 940 });

    expect(widths).toEqual([]);
});

test('limel-side-panel: emits changeWidth once for a drag with many moves', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');
    await startDragging({ from: 1000, to: 940 });

    moveAndRelease([900, 950]);
    await getPage().waitForChanges();

    expect(widths).toEqual([450]);
});

test('limel-side-panel: does not emit changeWidth or set a width when the edge is pressed and released without moving', async () => {
    const panel = await renderSizedPanel();
    const widths = listenFor('changeWidth');

    await pressAndReleaseHandle();

    expect(widths).toEqual([]);
    expect(panel.shadowRoot!.querySelector('section')!.style.width).toBe('');
});

test('limel-side-panel: does not emit changeWidth when a drag ends at the same width', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await dragEdge({ from: 1000, to: 1100 }, { narrowest: 400 });

    expect(widths).toEqual([]);
});

// A forced layout of large content makes each pointer move slow. The width at
// the start of the drag is read once, at the first move.
test('limel-side-panel: does not measure the panel while the edge is dragged', async () => {
    await renderPanel();
    await startDragging({ from: 1000, to: 940 });
    const reads = vi.spyOn(getPanel(), 'offsetWidth', 'get');

    getHandle().dispatchEvent(
        new PointerEvent('pointermove', { clientX: 900, pointerId: 1 })
    );
    await waitForLayout();

    expect(reads).not.toHaveBeenCalled();
});

test('limel-side-panel: clamps changeWidth to the maximum width', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await dragEdge({ from: 1000, to: 800 }, { widest: 500 });

    expect(widths).toEqual([500]);
});

test('limel-side-panel: clamps changeWidth to the minimum width', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await dragEdge({ from: 1000, to: 1100 }, { narrowest: 320 });

    expect(widths).toEqual([320]);
});

// The drag asks for 600px. The panel measures that width, and must then keep
// the clamped width, not the one it measured.
test('limel-side-panel: keeps the clamped width after measuring', async () => {
    await renderPanel();

    await dragEdge({ from: 1000, to: 800 }, { widest: 500 });

    expect(getPanel().style.width).toBe('500px');
});

test('limel-side-panel: resets body styles when disconnected during a drag', async () => {
    await renderPanel();
    await startDragging({ from: 1000, to: 940 });

    getPage().root!.remove();

    expect(document.body.style.cursor).toBe('');
});

test('limel-side-panel: can be resized after it is moved in the DOM', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');
    const panel = getPage().root!;
    const parent = panel.parentElement!;

    panel.remove();
    parent.append(panel);
    await dragEdge({ from: 1000, to: 940 });

    expect(widths).toEqual([460]);
});

// A consumer often renders again during a drag, with new arrays for `stack`
// and `actions`, so the panel renders between the moves.
test('limel-side-panel: keeps resizing when the consumer renders again during a drag', async () => {
    const panel = (await renderPanel({
        stack: [{ heading: 'Sales pipe' }],
    })) as HTMLLimelSidePanelElement;
    const widths = listenFor('changeWidth');
    layOutThePanel({});
    const handle = getHandle();
    handle.setPointerCapture = vi.fn();

    handle.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 1000, pointerId: 1 })
    );
    for (const clientX of [990, 980, 970]) {
        panel.stack = [{ heading: `Sales pipe ${clientX}` }];
        await getPage().waitForChanges();
        getHandle().dispatchEvent(
            new PointerEvent('pointermove', { clientX: clientX, pointerId: 1 })
        );
    }

    getHandle().dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));
    await getPage().waitForChanges();

    expect(widths).toEqual([430]);
    expect(getHeaderPart('.heading').textContent).toBe('Sales pipe 970');
});

test('limel-side-panel: emits a wider changeWidth when ArrowLeft is pressed on the resize handle', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await pressKeyOnHandle('ArrowLeft');

    expect(widths).toEqual([408]);
});

test('limel-side-panel: emits a narrower changeWidth when ArrowRight is pressed on the resize handle', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await pressKeyOnHandle('ArrowRight');

    expect(widths).toEqual([392]);
});

test('limel-side-panel: clamps changeWidth from the keyboard to the maximum width', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await pressKeyOnHandle('ArrowLeft', { widest: 404 });

    expect(widths).toEqual([404]);
});

test('limel-side-panel: does not emit changeWidth when an arrow key does not change the width', async () => {
    await renderPanel();
    const widths = listenFor('changeWidth');

    await pressKeyOnHandle('ArrowLeft', { widest: 400 });

    expect(widths).toEqual([]);
});

test('limel-side-panel: prevents the default action of the arrow keys on the resize handle', async () => {
    await renderPanel();

    const event = await pressKeyOnHandle('ArrowLeft');

    expect(event.defaultPrevented).toBe(true);
});

test('limel-side-panel: makes the resize handle focusable', async () => {
    await renderPanel();

    expect(getSeparator().tabIndex).toBe(0);
});

test('limel-side-panel: names the resize handle after its label', async () => {
    await renderPanel({ label: 'Customer details' });

    expect(await getAccessibleNames('separator')).toEqual([
        'Resize Customer details panel',
    ]);
});

test('limel-side-panel: names the resize handle after the side panel when it has no label', async () => {
    await renderPanel();

    expect(await getAccessibleNames('separator')).toEqual([
        'Resize side panel',
    ]);
});

test.each([
    [undefined, 'Ändra storlek på sidopanelen'],
    ['Kunddetaljer', 'Ändra storlek på panelen Kunddetaljer'],
])(
    'limel-side-panel: names the resize handle in the language that is set, with the label %s',
    async (label, name) => {
        await renderPanel({ label, language: 'sv' });

        expect(await getAccessibleNames('separator')).toEqual([name]);
    }
);

test('limel-side-panel: sets the current, minimum and maximum width on the resize handle', async () => {
    const page = await render(
        <div style={{ position: 'relative', width: '1000px', height: '400px' }}>
            <limel-side-panel
                style={{
                    '--side-panel-width': '400px',
                    '--side-panel-min-width': '300px',
                }}
            />
        </div>
    );
    pages.push(page);
    await waitForLayout();
    const separator = getSeparator();

    expect(separator.getAttribute('aria-valuenow')).toBe('400');
    expect(separator.getAttribute('aria-valuemin')).toBe('300');
    expect(separator.getAttribute('aria-valuemax')).toBe('600');
});

test('limel-side-panel: updates the maximum width when the positioned ancestor gets wider', async () => {
    const host = await renderSizedPanel();
    await waitForLayout();

    host.parentElement!.style.width = '1400px';
    await waitForLayout();

    expect(getSeparator().getAttribute('aria-valuemax')).toBe('840');
});

test('limel-side-panel: does not change the style of the panel to measure the width limits', async () => {
    const host = await renderSizedPanel();
    await waitForLayout();
    const styleChanges: MutationRecord[] = [];
    const observer = new MutationObserver((records) => {
        styleChanges.push(...records);
    });
    observer.observe(getPanel(), {
        attributes: true,
        attributeFilter: ['style'],
    });

    host.style.setProperty('--side-panel-width', '500px');
    await waitForLayout();
    observer.disconnect();

    expect(getSeparator().getAttribute('aria-valuenow')).toBe('500');
    expect(styleChanges).toEqual([]);
});

test('limel-side-panel: does not measure the width limits when only the height of the panel changes', async () => {
    const host = await renderSizedPanel();
    await waitForLayout();
    const reads = spyOnLimitReads();

    host.parentElement!.style.height = '500px';
    await waitForLayout();

    expect(reads()).toBe(0);
});

test('limel-side-panel: measures the width limits once for an arrow key press', async () => {
    await renderSizedPanel();
    await waitForLayout();
    const reads = spyOnLimitReads();

    getHandle().dispatchEvent(
        new KeyboardEvent('keydown', {
            key: 'ArrowLeft',
            bubbles: true,
            cancelable: true,
        })
    );
    await waitForLayout();

    expect(reads()).toBe(2);
});

test('limel-side-panel: does not propagate close or changeWidth from the content', async () => {
    await renderPanel();
    const heard = listenOutsideFor(OWN_EVENTS);

    for (const event of OWN_EVENTS) {
        await emitFromContent(event);
    }

    expect(heard).toEqual([]);
});

// Tests the listeners inside the panel without the fallback listener on the host.
test('limel-side-panel: stops close and changeWidth inside the panel', async () => {
    await renderPanel();
    const heard = listenInsideForOwnEvents();

    for (const event of OWN_EVENTS) {
        await emitFromContentSlot(event);
    }

    expect(heard).toEqual([]);
});

// Tests the listeners inside the panel without the fallback listener on the host.
test('limel-side-panel: stops close and changeWidth from the header actions inside the panel', async () => {
    await renderPanel({ stack: [{ heading: 'Sales pipe' }] });
    const heard = listenInsideForOwnEvents();

    for (const event of OWN_EVENTS) {
        getGivenHeaderAction().assignedSlot!.dispatchEvent(
            new CustomEvent(event, { bubbles: true, composed: true })
        );
    }

    expect(heard).toEqual([]);
});

test('limel-side-panel: propagates its own close event', async () => {
    await renderPanel();
    const heard = listenOutsideFor(['close']);

    await pressCloseButton();

    expect(heard).toEqual(['close']);
});

test('limel-side-panel: propagates its own changeWidth event', async () => {
    await renderPanel();
    const heard = listenOutsideFor(['changeWidth']);

    await dragEdge({ from: 1000, to: 940 });

    expect(heard).toEqual(['changeWidth']);
});

interface Drag {
    /**
     * `clientX` of `pointerdown`
     */
    from: number;

    /**
     * `clientX` of `pointermove`
     */
    to: number;
}

interface Limits {
    /**
     * Minimum width in pixels. No minimum if not set.
     */
    narrowest?: number;

    /**
     * Maximum width in pixels. No maximum if not set.
     */
    widest?: number;
}

/**
 * Mocks `offsetWidth` on the panel. The width is 400px when no inline
 * width is set. Otherwise it is the inline width, clamped to the limits.
 *
 * @param limits - the width limits
 * @param limits.narrowest
 * @param limits.widest
 */
function layOutThePanel({ narrowest = 0, widest = Infinity }: Limits) {
    const panel = getPanel();

    Object.defineProperty(panel, 'offsetWidth', {
        configurable: true,
        get: () => {
            const set = Number.parseFloat(panel.style.width);
            const width = Number.isNaN(set) ? 400 : set;

            return Math.min(Math.max(width, narrowest), widest);
        },
    });
}

async function renderPanel(
    props: Record<string, unknown> = {}
): Promise<HTMLElement> {
    const page = await render(
        <limel-side-panel {...props}>
            <div class="given-content" />
            <button class="given-header-action" slot="header-actions" />
        </limel-side-panel>
    );
    pages.push(page);

    return page.root!;
}

interface Size {
    width: number;
    height: number;
}

const SMALL_HEADER_ACTION: Size = { width: 80, height: 24 };

/**
 * Renders a 400px wide panel with an element in the `header-actions` slot.
 *
 * @param entry - the only entry in the stack
 * @param size - the size of the element in the slot, in pixels
 * @returns the header
 */
async function renderPanelWithHeaderActions(
    entry: SidePanelEntry,
    size: Size = SMALL_HEADER_ACTION
): Promise<HTMLElement> {
    const page = await render(
        <div style={{ position: 'relative', width: '1000px', height: '400px' }}>
            <limel-side-panel
                style={{ '--side-panel-width': '400px' }}
                stack={[entry]}
            >
                <div
                    class="given-header-action"
                    slot="header-actions"
                    style={{
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                    }}
                />
            </limel-side-panel>
        </div>
    );
    pages.push(page);

    return page
        .root!.querySelector('limel-side-panel')!
        .shadowRoot!.querySelector<HTMLElement>('.header')!;
}

/**
 * Renders a panel that starts 400px wide, in a 1000px wide positioned
 * ancestor. The panel can be between 300px and 600px wide.
 *
 * @param stack - the stack of the panel
 * @returns the host
 */
async function renderSizedPanel(
    stack: SidePanelEntry[] = []
): Promise<HTMLElement> {
    const page = await render(
        <div style={{ position: 'relative', width: '1000px', height: '400px' }}>
            <limel-side-panel
                style={{
                    '--side-panel-width': '400px',
                    '--side-panel-min-width': '300px',
                }}
                stack={stack}
            />
        </div>
    );
    pages.push(page);

    return page.root!.querySelector('limel-side-panel')!;
}

/**
 * Drags the resize handle with real layout. `setPointerCapture` is mocked,
 * because synthetic events have no active pointer.
 *
 * @param from - `clientX` of `pointerdown`
 * @param to - `clientX` of `pointermove`
 */
async function dragHandleTo(from: number, to: number) {
    const handle = getHandle();
    handle.setPointerCapture = vi.fn();
    handle.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: from, pointerId: 1 })
    );
    handle.dispatchEvent(
        new PointerEvent('pointermove', { clientX: to, pointerId: 1 })
    );
    handle.dispatchEvent(
        new PointerEvent('pointerup', { clientX: to, pointerId: 1 })
    );

    await getPage().waitForChanges();
}

// `offsetWidth`, because the opening animation scales the panel.
function widthOf(panel: HTMLElement): number {
    return panel.shadowRoot!.querySelector<HTMLElement>('section')!.offsetWidth;
}

/**
 * Renders a panel, then adds a second panel after the first is ready. A second
 * call to `render` would remove the first panel.
 *
 * @returns the two hosts, in the order they were opened
 */
async function renderTwoPanels(): Promise<HTMLElement[]> {
    const first = await renderPanel();
    const second = document.createElement('limel-side-panel');
    first.after(second);
    await second.componentOnReady();

    return [first, second];
}

function getContentSlot(): HTMLSlotElement {
    return getPage().root!.shadowRoot!.querySelector('slot:not([name])')!;
}

async function pressCloseButton() {
    getCloseButton().dispatchEvent(new CustomEvent('click'));

    await getPage().waitForChanges();
}

/**
 * Dispatches a keydown event on the resize handle. The panel starts at 400px.
 *
 * @param key - the key
 * @param limits - the width limits
 * @returns the dispatched event
 */
async function pressKeyOnHandle(
    key: string,
    limits: Limits = {}
): Promise<KeyboardEvent> {
    layOutThePanel(limits);

    const event = new KeyboardEvent('keydown', {
        key: key,
        bubbles: true,
        composed: true,
        cancelable: true,
    });
    getHandle().dispatchEvent(event);
    await getPage().waitForChanges();

    return event;
}

/**
 * Drags the resize handle, then releases the pointer. The panel starts at
 * 400px.
 *
 * @param movement - the start and end positions of the pointer
 * @param limits - the width limits
 */
async function dragEdge(movement: Drag, limits: Limits = {}) {
    await startDragging(movement, limits);
    moveAndRelease([]);

    await getPage().waitForChanges();
}

/**
 * Presses the resize handle and releases the pointer without moving it.
 * `setPointerCapture` is mocked, because synthetic events have no active
 * pointer.
 */
async function pressAndReleaseHandle() {
    const handle = getHandle();
    handle.setPointerCapture = vi.fn();
    handle.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 1000, pointerId: 1 })
    );
    handle.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));

    await getPage().waitForChanges();
}

/**
 * Moves the pointer that drags the resize handle, then releases it.
 *
 * @param positions - `clientX` of each `pointermove`
 */
function moveAndRelease(positions: number[]) {
    const handle = getHandle();
    for (const clientX of positions) {
        handle.dispatchEvent(
            new PointerEvent('pointermove', { clientX: clientX, pointerId: 1 })
        );
    }

    handle.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));
}

/**
 * Drags the resize handle, and does not release the pointer. The panel starts
 * at 400px. `setPointerCapture` is mocked, because synthetic events have no
 * active pointer.
 *
 * @param movement - the start and end positions of the pointer
 * @param limits - the width limits
 */
async function startDragging(movement: Drag, limits: Limits = {}) {
    layOutThePanel(limits);

    const handle = getHandle();
    handle.setPointerCapture = vi.fn();
    handle.dispatchEvent(
        new PointerEvent('pointerdown', {
            clientX: movement.from,
            pointerId: 1,
        })
    );
    handle.dispatchEvent(
        new PointerEvent('pointermove', { clientX: movement.to, pointerId: 1 })
    );

    await getPage().waitForChanges();
}

/**
 * Dispatches a bubbling, composed event from the slotted content.
 *
 * @param event - the event name
 */
async function emitFromContent(event: string) {
    getGivenContent().dispatchEvent(
        new CustomEvent(event, { bubbles: true, composed: true })
    );

    await getPage().waitForChanges();
}

/**
 * Dispatches a bubbling, composed event from the default slot.
 *
 * @param event - the event name
 */
async function emitFromContentSlot(event: string) {
    getContentSlot().dispatchEvent(
        new CustomEvent(event, { bubbles: true, composed: true })
    );

    await getPage().waitForChanges();
}

/**
 * Dispatches an Escape keydown event from the slotted content. The event bubbles
 * to `window` and is not prevented.
 */
async function pressEscape() {
    getGivenContent().dispatchEvent(escapeKeyDown());

    await getPage().waitForChanges();
}

function escapeKeyDown(): KeyboardEvent {
    return new KeyboardEvent('keydown', {
        key: ESCAPE,
        bubbles: true,
        composed: true,
        cancelable: true,
    });
}

/**
 * Calls `preventDefault` on Escape keydown events on the target, like an open
 * dialog or dropdown does.
 *
 * @param target - the event target
 */
function useEscapeOn(target: EventTarget) {
    target.addEventListener(
        'keydown',
        (event: KeyboardEvent) => {
            if (event.key === ESCAPE) {
                event.preventDefault();
            }
        },
        { signal: listenUntilTheTestEnds() }
    );
}

/**
 * Adds a listener on the host.
 *
 * @param event - the event name
 * @returns the event details, in the order they were received
 */
function listenFor<T = unknown>(event: string): T[] {
    const details: T[] = [];
    getPage().root!.addEventListener(event, (received: CustomEvent<T>) => {
        details.push(received.detail);
    });

    return details;
}

/**
 * Adds a `close` listener on each panel.
 *
 * @param panels - the hosts to listen on
 * @returns the hosts that emitted `close`, in order
 */
function listenForCloseOn(panels: HTMLElement[]): HTMLElement[] {
    const closed: HTMLElement[] = [];

    for (const panel of panels) {
        panel.addEventListener('close', () => {
            closed.push(panel);
        });
    }

    return closed;
}

/**
 * Adds listeners on the parent of the host. A listener on the host itself would
 * also receive events that are stopped there.
 *
 * @param events - the event names
 * @returns the names of the received events, in order
 */
function listenOutsideFor(events: string[]): string[] {
    const heard: string[] = [];

    for (const event of events) {
        getPage().root!.parentElement!.addEventListener(event, () => {
            heard.push(event);
        });
    }

    return heard;
}

/**
 * Adds listeners for the panel's own event names on the `section` element in
 * the shadow root, which is an ancestor of the slots.
 *
 * @returns the names of the received events, in order
 */
function listenInsideForOwnEvents(): string[] {
    const heard: string[] = [];
    const panel = getPanel();

    for (const event of OWN_EVENTS) {
        panel.addEventListener(event, () => {
            heard.push(event);
        });
    }

    return heard;
}

function getPage(): Page {
    return pages.at(-1)!;
}

function listenUntilTheTestEnds(): AbortSignal {
    const listener = new AbortController();
    listeners.push(listener);

    return listener.signal;
}

function getCloseButton(): HTMLButtonElement {
    return getPage().root!.shadowRoot!.querySelector('button.close')!;
}

/**
 * Sets a z-index property of an element as the z-index of an element outside
 * the panel, like `limel-tooltip`, `limel-menu` and `limel-popover` do with
 * their portal containers.
 *
 * @param element - the element that reads the property
 * @param property - the custom property
 * @returns the computed z-index of the element outside the panel
 */
function zIndexOfPortalFor(
    element: Element,
    property = '--tooltip-z-index'
): string {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.zIndex =
        getComputedStyle(element).getPropertyValue(property);
    document.body.append(container);
    const zIndex = getComputedStyle(container).zIndex;
    container.remove();

    return zIndex;
}

function centerOf(box: DOMRect): number {
    return box.top + box.height / 2;
}

function getActionButtons(): HTMLElement[] {
    return [
        ...getPage().root!.shadowRoot!.querySelectorAll<HTMLElement>(
            '.actions > *'
        ),
    ];
}

function finishOpeningAnimation() {
    for (const animation of getPanel().getAnimations()) {
        animation.finish();
    }
}

function goBackOnSelectStackEntry(panel: HTMLElement) {
    panel.addEventListener(
        'selectStackEntry',
        (event: CustomEvent<number>) => {
            (panel as HTMLLimelSidePanelElement).stack = THREE_PANELS.slice(
                0,
                event.detail + 1
            );
        },
        { signal: listenUntilTheTestEnds() }
    );
}

function getBacks(): HTMLButtonElement[] {
    return [
        ...getHost().shadowRoot!.querySelectorAll<HTMLButtonElement>(
            '.stack > .back'
        ),
    ];
}

function getHeader(): HTMLLimelHeaderElement {
    return getHost().shadowRoot!.querySelector<HTMLLimelHeaderElement>(
        '.header'
    )!;
}

function getHeaderPart<T extends HTMLElement = HTMLElement>(
    selector: string
): T {
    return getHeader().shadowRoot!.querySelector<T>(selector)!;
}

function getHeadings(): NodeListOf<HTMLElement> {
    return getHeader().shadowRoot!.querySelectorAll<HTMLElement>('h1, h2');
}

function getGivenHeaderAction(): HTMLElement {
    return getPage().root!.querySelector<HTMLElement>('.given-header-action')!;
}

function getGivenContent(): HTMLElement {
    return getPage().root!.querySelector<HTMLElement>('.given-content')!;
}

/**
 * Counts the reads of the elements that the panel measures its width limits
 * with: one for the narrowest width, one for the widest.
 *
 * @returns a function that returns the number of reads so far
 */
function spyOnLimitReads(): () => number {
    const limits =
        getHost().shadowRoot!.querySelectorAll<HTMLElement>('[data-limit]');
    expect(limits).toHaveLength(2);
    const reads = [...limits].map((limit) =>
        vi.spyOn(limit, 'offsetWidth', 'get')
    );

    return () => {
        return reads.reduce((total, read) => total + read.mock.calls.length, 0);
    };
}

function addButton(parent: ParentNode): HTMLButtonElement {
    const button = document.createElement('button');
    parent.append(button);

    return button;
}

/**
 * Adds a panel to the page without `render`, and waits until it is ready.
 *
 * @param parent - the element to add the panel to
 * @returns the panel
 */
async function addPanel(parent: HTMLElement): Promise<HTMLElement> {
    const panel = document.createElement('limel-side-panel');
    addedElements.push(panel);
    parent.append(panel);
    await panel.componentOnReady();

    return panel;
}

async function waitForMicrotasks() {
    await new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Waits until resize observers have run and the panel has rendered again.
 */
async function waitForLayout() {
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await getPage().waitForChanges();
}

/**
 * The panel, also when it was rendered inside another element.
 *
 * @returns the host
 */
function getHost(): HTMLElement {
    const root = getPage().root!;
    if (root.matches('limel-side-panel')) {
        return root;
    }

    return root.querySelector('limel-side-panel')!;
}

function getHandle(): HTMLElement {
    return getHost().shadowRoot!.querySelector<HTMLElement>('.handle')!;
}

function getSeparator(): HTMLElement {
    return getHandle().shadowRoot!.querySelector<HTMLElement>(
        '[role="separator"]'
    )!;
}

function getPanel(): HTMLElement {
    return getHost().shadowRoot!.querySelector('section')!;
}
