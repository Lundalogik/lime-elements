import { render, h } from '@stencil/vitest';

describe('limel-markdown', () => {
    describe('DOM morphing', () => {
        it('renders markdown content', async () => {
            const { root, waitForChanges } = await render(
                <limel-markdown value="**Hello** world"></limel-markdown>
            );
            await waitForChanges();

            const container = root.shadowRoot.querySelector('#markdown');
            expect(container.querySelector('strong').textContent).toBe('Hello');
        });

        it('updates content without destroying preserved elements', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-markdown value="First paragraph"></limel-markdown>
            );
            await waitForChanges();

            const container = root.shadowRoot.querySelector('#markdown');
            const firstP = container.querySelector('p');

            await setProps({ value: 'First paragraph\n\nSecond paragraph' });
            await waitForChanges();

            // The first paragraph should be the same DOM node
            expect(container.querySelector('p')).toBe(firstP);
            expect(container.querySelectorAll('p').length).toBe(2);
        });

        it('preserves a whitelisted custom element across value updates', async () => {
            const chipHtml = '<limel-chip text="Test"></limel-chip>';
            const { root, waitForChanges, setProps } = await render(
                <limel-markdown
                    value={`Before\n\n${chipHtml}`}
                ></limel-markdown>
            );
            await waitForChanges();

            const container = root.shadowRoot.querySelector('#markdown');
            const chip = container.querySelector('limel-chip');
            expect(chip).not.toBeNull();

            // Update surrounding text, keep the chip
            await setProps({
                value: `Updated before\n\n${chipHtml}\n\nAfter`,
            });
            await waitForChanges();

            const updatedChip = container.querySelector('limel-chip');
            expect(updatedChip).toBe(chip);
        });

        it('renders content after clearing and setting new value', async () => {
            const { root, waitForChanges, setProps } = await render(
                <limel-markdown value="Initial content"></limel-markdown>
            );
            await waitForChanges();

            await setProps({ value: '' });
            await waitForChanges();

            const container = root.shadowRoot.querySelector('#markdown');
            expect(container.innerHTML).toBe('');

            await setProps({ value: 'New content' });
            await waitForChanges();

            expect(container.querySelector('p').textContent).toBe(
                'New content'
            );
        });
    });

    describe('toMarkdown', () => {
        const whitelist = [
            { tagName: 'test-person', attributes: ['name'] },
            { tagName: 'test-undescribed', attributes: [] },
            { tagName: 'test-gated', attributes: ['name'] },
            { tagName: 'test-failing', attributes: [] },
        ];

        let gate: { requested: () => void; released: Promise<void> };

        beforeAll(() => {
            customElements.define(
                'test-gated',
                class extends HTMLElement {
                    public async toMarkdown() {
                        gate.requested();
                        await gate.released;

                        return `[${this.getAttribute('name')}](https://example.com/*)`;
                    }
                }
            );
            customElements.define(
                'test-person',
                class extends HTMLElement {
                    public async toMarkdown() {
                        await new Promise((resolve) => setTimeout(resolve, 0));

                        return `[${this.getAttribute('name')}](https://example.com/*)`;
                    }
                }
            );
            customElements.define(
                'test-undescribed',
                class extends HTMLElement {}
            );
            customElements.define(
                'test-failing',
                class extends HTMLElement {
                    public async toMarkdown(): Promise<string> {
                        throw new Error('Lookup failed');
                    }
                }
            );
        });

        it('returns markdown for plain content', async () => {
            const { root, waitForChanges } = await render(
                <limel-markdown value="**Hello** world"></limel-markdown>
            );
            await waitForChanges();

            expect(await root.toMarkdown()).toBe('**Hello** world');
        });

        it('replaces a describable element with its description', async () => {
            const { root, waitForChanges } = await render(
                <limel-markdown
                    value={'Ask <test-person name="Ada"></test-person> now'}
                    whitelist={whitelist}
                ></limel-markdown>
            );
            await waitForChanges();

            expect(await root.toMarkdown()).toBe(
                'Ask [Ada](https://example.com/*) now'
            );
        });

        it('describes a Stencil component through its method', async () => {
            const { root, waitForChanges } = await render(
                <limel-markdown
                    value={
                        'Ask <limel-example-markdown-person-chip name="Ada" email="ada@example.com"></limel-example-markdown-person-chip>'
                    }
                    whitelist={[
                        {
                            tagName: 'limel-example-markdown-person-chip',
                            attributes: ['name', 'email'],
                        },
                    ]}
                ></limel-markdown>
            );
            await waitForChanges();

            expect(await root.toMarkdown()).toBe(
                'Ask [Ada](mailto:ada@example.com)'
            );
        });

        it('keeps an unbalanced bracket in a name as link text', async () => {
            const { root, waitForChanges } = await render(
                <limel-markdown
                    value={
                        'Ask <limel-example-markdown-person-chip name="Ada ]" email="ada@example.com"></limel-example-markdown-person-chip>'
                    }
                    whitelist={[
                        {
                            tagName: 'limel-example-markdown-person-chip',
                            attributes: ['name', 'email'],
                        },
                    ]}
                ></limel-markdown>
            );
            await waitForChanges();

            expect(await root.toMarkdown()).toBe(
                String.raw`Ask [Ada \]](mailto:ada@example.com)`
            );
        });

        it('keeps a described element inline in a list item', async () => {
            const { root, waitForChanges } = await render(
                <limel-markdown
                    value={'- Ask <test-person name="Ada"></test-person> now'}
                    whitelist={whitelist}
                ></limel-markdown>
            );
            await waitForChanges();

            expect(await root.toMarkdown()).toBe(
                '- Ask [Ada](https://example.com/*) now'
            );
        });

        it('keeps the children of an element that does not describe itself', async () => {
            const { root, waitForChanges } = await render(
                <limel-markdown
                    value={
                        'A <test-undescribed>child</test-undescribed> and <test-undescribed></test-undescribed>'
                    }
                    whitelist={whitelist}
                ></limel-markdown>
            );
            await waitForChanges();

            expect(await root.toMarkdown()).toBe('A child and');
        });

        it('keeps the children of an element whose description fails', async () => {
            const error = vi
                .spyOn(console, 'error')
                .mockImplementation(() => {});
            const { root, waitForChanges } = await render(
                <limel-markdown
                    value={
                        'Ask <test-failing>**Ada**</test-failing> and <test-person name="Grace"></test-person>'
                    }
                    whitelist={whitelist}
                ></limel-markdown>
            );
            await waitForChanges();

            expect(await root.toMarkdown()).toBe(
                'Ask **Ada** and [Grace](https://example.com/*)'
            );
            expect(error).toHaveBeenCalledTimes(1);
            error.mockRestore();
        });

        it('writes a hard line break as two trailing spaces', async () => {
            const { root, waitForChanges } = await render(
                <limel-markdown value={'line one\nline two'}></limel-markdown>
            );
            await waitForChanges();

            expect(await root.toMarkdown()).toBe('line one  \nline two');
        });

        it('keeps the contents of code', async () => {
            const markdown =
                '```bash\ncat <<EOF\nHello\nEOF\n```\n\n    a = 1\n    b = 2';
            const { root, waitForChanges } = await render(
                <limel-markdown value={markdown}></limel-markdown>
            );
            await waitForChanges();

            expect(await root.toMarkdown()).toBe(
                '```bash\ncat <<EOF\nHello\nEOF\n```\n\n```\na = 1\nb = 2\n```'
            );
        });

        it('restores footnotes', async () => {
            const markdown =
                'A note[^1] and another[^note].\n\n[^1]: First.\n[^note]: Second.';
            const { root, waitForChanges } = await render(
                <limel-markdown value={markdown}></limel-markdown>
            );
            await waitForChanges();

            expect(await root.toMarkdown()).toBe(
                'A note[^1] and another[^2].\n\n[^1]: First.\n\n[^2]: Second.'
            );
        });

        it.each([
            ['A[^%zz].\n\n[^%zz]: One.', 'A[^1].\n\n[^1]: One.'],
            [
                'A[^%61] and B[^a].\n\n[^%61]: One.\n[^a]: Two.',
                'A[^1] and B[^2].\n\n[^1]: One.\n\n[^2]: Two.',
            ],
            ['A[^a&b].\n\n[^a&b]: One.', 'A[^1].\n\n[^1]: One.'],
        ])(
            'labels the footnotes of %j with their numbers',
            async (markdown, expected) => {
                const { root, waitForChanges } = await render(
                    <limel-markdown value={markdown}></limel-markdown>
                );
                await waitForChanges();

                expect(await root.toMarkdown()).toBe(expected);
            }
        );

        it('keeps the URL of an image that has not loaded yet', async () => {
            const { root, waitForChanges } = await render(
                <div style={{ display: 'none' }}>
                    <limel-markdown
                        value="![Proof](https://example.com/image.png)"
                        lazyLoadImages={true}
                    ></limel-markdown>
                </div>
            );
            await waitForChanges();

            const markdown = root.querySelector('limel-markdown');
            const image = markdown.shadowRoot.querySelector('img');
            expect(image.getAttribute('src')).toBeNull();

            expect(await markdown.toMarkdown()).toBe(
                '![Proof](https://example.com/image.png)'
            );
        });

        it('exports the content as it was when the export started', async () => {
            let requested: () => void;
            let release: () => void;
            const descriptionRequested = new Promise<void>((resolve) => {
                requested = resolve;
            });
            gate = {
                requested,
                released: new Promise<void>((resolve) => {
                    release = resolve;
                }),
            };

            const { root, waitForChanges } = await render(
                <limel-markdown
                    value={'Ask <test-gated name="Ada"></test-gated>'}
                    whitelist={whitelist}
                ></limel-markdown>
            );
            await waitForChanges();

            const exported = root.toMarkdown();
            await descriptionRequested;

            root.value =
                'Ask <test-gated name="Ada"></test-gated> and <test-gated name="Grace"></test-gated>';
            const container = root.shadowRoot.querySelector('#markdown');
            await vi.waitFor(() => {
                expect(container.querySelectorAll('test-gated')).toHaveLength(
                    2
                );
            });
            release();

            expect(await exported).toBe('Ask [Ada](https://example.com/*)');
        });

        it('waits for a new value to render', async () => {
            const { root, waitForChanges } = await render(
                <limel-markdown value="First"></limel-markdown>
            );
            await waitForChanges();

            root.value = 'Second';

            expect(await root.toMarkdown()).toBe('Second');
        });
    });
});
