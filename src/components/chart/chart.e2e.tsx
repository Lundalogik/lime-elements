import { render, h } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';
import { ChartItem } from './chart.types';

const reports: ChartItem = { text: 'Reports', value: 40, clickable: true };
const archive: ChartItem = { text: 'Archive', value: 60 };

async function setup() {
    const onInteract = vi.fn();
    const { root, waitForChanges } = await render(
        <div>
            <button>Before the chart</button>
            <limel-chart items={[reports, archive]} onInteract={onInteract} />
        </div>
    );
    await waitForChanges();

    const chart = root.querySelector('limel-chart');
    const [reportsRow, archiveRow] = chart.shadowRoot.querySelectorAll(
        'table tbody tr'
    ) as NodeListOf<HTMLElement>;

    return {
        onInteract,
        before: root.querySelector('button'),
        chart: chart,
        reportsRow: reportsRow,
        archiveRow: archiveRow,
    };
}

test('Tab moves focus from before the chart to its first item', async () => {
    const { before, chart, reportsRow } = await setup();
    before.focus();

    await userEvent.tab();

    expect(chart.shadowRoot.activeElement).toBe(reportsRow);
});

test('Enter on a clickable item emits interact with the item', async () => {
    const { onInteract, reportsRow } = await setup();
    reportsRow.focus();

    await userEvent.keyboard('{Enter}');

    expect(onInteract).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ detail: reports })
    );
});

test('Space on a clickable item emits interact with the item', async () => {
    const { onInteract, reportsRow } = await setup();
    reportsRow.focus();

    await userEvent.keyboard(' ');

    expect(onInteract).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ detail: reports })
    );
});

test('Enter on an item that is not clickable emits nothing', async () => {
    const { onInteract, archiveRow } = await setup();
    archiveRow.focus();

    await userEvent.keyboard('{Enter}');

    expect(onInteract).not.toHaveBeenCalled();
});

test('other keys on a clickable item emit nothing', async () => {
    const { onInteract, reportsRow } = await setup();
    reportsRow.focus();

    await userEvent.keyboard('a');

    expect(onInteract).not.toHaveBeenCalled();
});
