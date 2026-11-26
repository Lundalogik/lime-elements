import { render, h, RenderResult } from '@stencil/vitest';
import { test, expect, afterEach, vi } from 'vitest';

let rendered: RenderResult;

afterEach(() => {
    rendered?.unmount();
    vi.restoreAllMocks();
});

const tile = () => rendered.root!.shadowRoot!.querySelector('.tile');

test('reads a name by the default rule when no name type is given', async () => {
    rendered = await render(<limel-initials name="Ab Rahman" />);

    expect(tile()).toEqualText('AR');
});

test('skips legal forms in the name of a company', async () => {
    rendered = await render(
        <limel-initials name="AB Harbour Lights" nameType="company" />
    );

    expect(tile()).toEqualText('HL');
});

test('shows given initials as they are, without spaces', async () => {
    rendered = await render(<limel-initials name="k m" nameType="initials" />);

    expect(tile()).toEqualText('KM');
});

test('shrinks the text of a three-letter acronym so it fits the tile', async () => {
    rendered = await render(
        <limel-initials name="TNK Logistics" nameType="company" />
    );

    expect(tile()).toEqualText('TNK');
    expect(tile()).toHaveClass('long');
});

test('keeps the default size for the usual two letters', async () => {
    rendered = await render(<limel-initials name="Northwind Bikes" />);

    expect(tile()).not.toHaveClass('long');
});

test('keeps the default size for two half-width katakana letters with sound marks', async () => {
    rendered = await render(<limel-initials name="ｶﾞｽ" nameType="initials" />);

    expect(tile()).toEqualText('ｶﾞｽ');
    expect(tile()).not.toHaveClass('long');
});

test('keeps the default size for two letters that take three code points', async () => {
    rendered = await render(<limel-initials name="कीर्ति शर्मा" />);

    expect(tile()).toEqualText('कीश');
    expect(tile()).not.toHaveClass('long');
});

test('hides the tile from assistive technology', async () => {
    rendered = await render(<limel-initials name="Northwind Bikes" />);

    expect(tile()).toHaveAttribute('aria-hidden', 'true');
});

test('renders nothing, without an error, when it is built without a name', async () => {
    const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

    rendered = await render(<limel-initials />);

    expect(tile()).toBeNull();
    expect(consoleError).not.toHaveBeenCalled();
});

test('renders nothing when the name has no letters or digits', async () => {
    rendered = await render(<limel-initials name="🎉 ..." />);

    expect(tile()).toBeNull();
});

test('renders nothing, without an error, when its name is cleared after render', async () => {
    const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

    rendered = await render(<limel-initials name="Northwind Bikes" />);

    (rendered.root as any).name = undefined;
    await rendered.waitForChanges();

    expect(tile()).toBeNull();
    expect(consoleError).not.toHaveBeenCalled();
});

test('shows a middle name as a third letter, with smaller text', async () => {
    rendered = await render(<limel-initials name="Anna Maria Svensson" />);

    expect(tile()).toEqualText('AMS');
    expect(tile()).toHaveClass('long');
});
