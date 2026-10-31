import { render, h } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';
import { ChartItem } from './chart.types';

const reports: ChartItem = { text: 'Reports', value: 40, clickable: true };
const archive: ChartItem = { text: 'Archive', value: 60 };
const invoices: ChartItem = { text: 'Invoices', value: 20 };

async function setup() {
    const onInteract = vi.fn();
    const { root, waitForChanges } = await render(
        <div>
            <button>Before the chart</button>
            <limel-chart
                items={[reports, archive, invoices]}
                onInteract={onInteract}
            />
            <button>After the chart</button>
        </div>
    );
    await waitForChanges();

    const chart = root.querySelector('limel-chart');
    const [reportsRow, archiveRow, invoicesRow] =
        chart.shadowRoot.querySelectorAll(
            'table tbody tr'
        ) as NodeListOf<HTMLElement>;

    const [before, after] = root.querySelectorAll('button');

    return {
        onInteract,
        waitForChanges,
        before: before,
        after: after,
        chart: chart,
        reportsRow: reportsRow,
        archiveRow: archiveRow,
        invoicesRow: invoicesRow,
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

test('Tab moves on past the chart from its first item', async () => {
    const { before, after } = await setup();
    before.focus();

    await userEvent.tab();
    await userEvent.tab();

    expect(document.activeElement).toBe(after);
});

test.each(['{ArrowRight}', '{ArrowDown}'])(
    '%s moves focus to the next item',
    async (key) => {
        const { chart, reportsRow, archiveRow } = await setup();
        reportsRow.focus();

        await userEvent.keyboard(key);

        expect(chart.shadowRoot.activeElement).toBe(archiveRow);
    }
);

test.each(['{ArrowLeft}', '{ArrowUp}'])(
    '%s moves focus to the previous item',
    async (key) => {
        const { chart, reportsRow, archiveRow } = await setup();
        archiveRow.focus();

        await userEvent.keyboard(key);

        expect(chart.shadowRoot.activeElement).toBe(reportsRow);
    }
);

test('End moves focus to the last item', async () => {
    const { chart, reportsRow, invoicesRow } = await setup();
    reportsRow.focus();

    await userEvent.keyboard('{End}');

    expect(chart.shadowRoot.activeElement).toBe(invoicesRow);
});

test('Home moves focus to the first item', async () => {
    const { chart, reportsRow, invoicesRow } = await setup();
    invoicesRow.focus();

    await userEvent.keyboard('{Home}');

    expect(chart.shadowRoot.activeElement).toBe(reportsRow);
});

test('the right arrow stays on the last item', async () => {
    const { chart, invoicesRow } = await setup();
    invoicesRow.focus();

    await userEvent.keyboard('{ArrowRight}');

    expect(chart.shadowRoot.activeElement).toBe(invoicesRow);
});

test('Tab returns to the item that last had focus', async () => {
    const { before, chart, reportsRow, archiveRow, waitForChanges } =
        await setup();
    reportsRow.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();
    before.focus();

    await userEvent.tab();

    expect(chart.shadowRoot.activeElement).toBe(archiveRow);
});
