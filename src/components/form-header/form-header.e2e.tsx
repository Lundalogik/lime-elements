import { render, h } from '@stencil/vitest';

test('draws the heading as an h1 by default', async () => {
    const { root } = await render(<limel-form-header heading="Contact" />);

    expect(root.querySelector('h1').textContent).toBe('Contact');
});

test('draws the heading with the element of the heading level', async () => {
    const { root } = await render(
        <limel-form-header heading="Contact" headingLevel={3} />
    );

    expect(root.querySelector('h3').textContent).toBe('Contact');
    expect(root.querySelector('h1')).toBeNull();
});

test('draws no heading when there is no heading text', async () => {
    const { root } = await render(
        <limel-form-header description="Who to call" />
    );

    expect(root.querySelector('h1')).toBeNull();
});

test('gives the description to a markdown component', async () => {
    const { root } = await render(
        <limel-form-header heading="Contact" description="Who to **call**" />
    );

    const markdown = root.querySelector('limel-markdown');

    expect(markdown.value).toBe('Who to **call**');
});

test('uses a help string as the value of the help', async () => {
    const { root } = await render(
        <limel-form-header heading="Contact" help="Use the work number" />
    );

    expect(root.querySelector('limel-help').value).toBe('Use the work number');
});

test('gives the properties of a help object to the help', async () => {
    const { root } = await render(
        <limel-form-header
            heading="Contact"
            help={{ value: 'Use the work number', trigger: 'Tip' }}
        />
    );

    const help = root.querySelector('limel-help');

    expect(help.value).toBe('Use the work number');
    expect(help.trigger).toBe('Tip');
});

test('does not set keys of a help object that the help has no property for', async () => {
    const { root } = await render(
        <limel-form-header
            heading="Contact"
            help={
                {
                    value: 'Use the work number',
                    innerHTML: '<b>Hello</b>',
                } as any
            }
        />
    );

    const help = root.querySelector('limel-help');

    expect(help.value).toBe('Use the work number');
    expect(help.querySelector('b')).toBeNull();
});

test('draws nothing when it has nothing to show', async () => {
    const { root } = await render(<limel-form-header />);

    expect(root.children).toHaveLength(0);
});
