import { render, h } from '@stencil/vitest';
import { ChartItem } from './chart.types';

const reports: ChartItem = { text: 'Reports', value: 40, clickable: true };
const archive: ChartItem = { text: 'Archive', value: 60 };

async function setup() {
    const onInteract = vi.fn();
    const { root, waitForChanges } = await render(
        <limel-chart items={[reports, archive]} onInteract={onInteract} />
    );
    await waitForChanges();

    const [reportsRow, archiveRow] = root.shadowRoot.querySelectorAll(
        'table tbody tr'
    ) as NodeListOf<HTMLElement>;

    return { onInteract, reportsRow, archiveRow };
}

test('clicking a clickable item emits interact with the item', async () => {
    const { onInteract, reportsRow } = await setup();

    reportsRow.click();

    expect(onInteract).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ detail: reports })
    );
});

test('clicking an item that is not clickable emits nothing', async () => {
    const { onInteract, archiveRow } = await setup();

    archiveRow.click();

    expect(onInteract).not.toHaveBeenCalled();
});

test('a clickable item is a button to assistive technology', async () => {
    const { reportsRow } = await setup();

    expect(reportsRow).toEqualAttribute('role', 'button');
});

test('an item that is not clickable is not a button', async () => {
    const { archiveRow } = await setup();

    expect(archiveRow).not.toHaveAttribute('role');
});

test('clicking the value of a clickable item of a series emits interact with the item', async () => {
    const onInteract = vi.fn();
    const lostReports = { text: 'Reports', value: 10, clickable: true };
    const { root, waitForChanges } = await render(
        <limel-chart
            type="bar"
            series={[
                { text: 'Won', items: [reports] },
                { text: 'Lost', items: [lostReports] },
            ]}
            onInteract={onInteract}
        />
    );
    await waitForChanges();

    const cells = root.shadowRoot.querySelectorAll('td');
    cells[1].click();

    expect(onInteract).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ detail: lostReports })
    );
});

test('the value of a clickable item of a series is a button to assistive technology', async () => {
    const { root, waitForChanges } = await render(
        <limel-chart type="bar" series={[{ text: 'Won', items: [reports] }]} />
    );
    await waitForChanges();

    expect(root.shadowRoot.querySelector('td')).toEqualAttribute(
        'role',
        'button'
    );
});

test('the value of a clickable item of a series is named by its place, its series, and its value', async () => {
    const { root, waitForChanges } = await render(
        <limel-chart type="bar" series={[{ text: 'Won', items: [reports] }]} />
    );
    await waitForChanges();

    expect(root.shadowRoot.querySelector('td')).toEqualAttribute(
        'aria-label',
        'Reports, Won, 40'
    );
});

test('the value of an item of a series that is not clickable is named by its table headers', async () => {
    const { root, waitForChanges } = await render(
        <limel-chart type="bar" series={[{ text: 'Won', items: [archive] }]} />
    );
    await waitForChanges();

    expect(root.shadowRoot.querySelector('td')).not.toHaveAttribute(
        'aria-label'
    );
});
