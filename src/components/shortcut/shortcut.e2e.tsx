import { render, h } from '@stencil/vitest';

describe('limel-shortcut', () => {
    describe('with a label', () => {
        let root: HTMLElement;
        let waitForChanges: () => Promise<void>;
        let setProps: (props: Record<string, any>) => void;

        beforeEach(async () => {
            const result = await render(
                <limel-shortcut label="iSpiffy"></limel-shortcut>
            );
            root = result.root;
            waitForChanges = result.waitForChanges;
            setProps = result.setProps;
            await waitForChanges();
        });

        it('displays the correct label', () => {
            const label = root.shadowRoot!.querySelector('span');
            expect(label.textContent).toEqual('iSpiffy');
        });

        it('includes the label in `aria-label`', () => {
            const link = root.shadowRoot!.querySelector('a');
            expect(link.getAttribute('aria-label')).toEqual('iSpiffy');
        });

        describe('when changing the label', () => {
            beforeEach(async () => {
                setProps({ label: 'imTired' });
                await waitForChanges();
            });

            it('displays the new label', () => {
                const label = root.shadowRoot!.querySelector('span');
                expect(label.textContent).toEqual('imTired');
            });

            it('updates `aria-label`', () => {
                const link = root.shadowRoot!.querySelector('a');
                expect(link.getAttribute('aria-label')).toEqual('imTired');
            });
        });
    });

    describe('with `link` `title`', () => {
        let root: HTMLElement;
        let waitForChanges: () => Promise<void>;
        let setProps: (props: Record<string, any>) => void;

        beforeEach(async () => {
            const result = await render(
                <limel-shortcut
                    link={{ title: 'Open the iSpiffy app' }}
                ></limel-shortcut>
            );
            root = result.root;
            waitForChanges = result.waitForChanges;
            setProps = result.setProps;
            await waitForChanges();
        });

        it('sets the `title` attribute on the `link`', () => {
            const link = root.shadowRoot!.querySelector('a');
            expect(link.getAttribute('title')).toEqual('Open the iSpiffy app');
        });

        it('includes the `title` in `aria-label`', () => {
            const link = root.shadowRoot!.querySelector('a');
            expect(link.getAttribute('aria-label')).toEqual(
                'Open the iSpiffy app'
            );
        });

        describe('when changing the `link` `title`', () => {
            beforeEach(async () => {
                setProps({ link: { title: 'I need a cup of tea' } });
                await waitForChanges();
            });

            it('uses the new `title`', () => {
                const link = root.shadowRoot!.querySelector('a');
                expect(link.getAttribute('title')).toEqual(
                    'I need a cup of tea'
                );
            });

            it('updates `aria-label`', () => {
                const link = root.shadowRoot!.querySelector('a');
                expect(link.getAttribute('aria-label')).toEqual(
                    'I need a cup of tea'
                );
            });
        });
    });

    describe('with a label and a `link` `title`', () => {
        let root: HTMLElement;
        let waitForChanges: () => Promise<void>;
        let setProps: (props: Record<string, any>) => void;

        beforeEach(async () => {
            const result = await render(
                <limel-shortcut
                    label="iSpiffy"
                    link={{ title: 'Open the iSpiffy app' }}
                ></limel-shortcut>
            );
            root = result.root;
            waitForChanges = result.waitForChanges;
            setProps = result.setProps;
            await waitForChanges();
        });

        it('displays the correct `label`', () => {
            const label = root.shadowRoot!.querySelector('span');
            expect(label.textContent).toEqual('iSpiffy');
        });

        it('uses both the `label` and the `link` `title` to construct the `aria-label`', () => {
            const link = root.shadowRoot!.querySelector('a');
            expect(link.getAttribute('aria-label')).toEqual(
                'iSpiffy. Open the iSpiffy app'
            );
        });

        describe('when changing the `label`', () => {
            beforeEach(async () => {
                setProps({ label: 'imTired' });
                await waitForChanges();
            });

            it('updates `aria-label`', () => {
                const link = root.shadowRoot!.querySelector('a');
                expect(link.getAttribute('aria-label')).toEqual(
                    'imTired. Open the iSpiffy app'
                );
            });
        });

        describe('when changing the `link` `title`', () => {
            beforeEach(async () => {
                setProps({
                    link: { title: 'I need a cup of tea' },
                });
                await waitForChanges();
            });

            it('updates `aria-label`', () => {
                const link = root.shadowRoot!.querySelector('a');
                expect(link.getAttribute('aria-label')).toEqual(
                    'iSpiffy. I need a cup of tea'
                );
            });
        });
    });

    describe('with a value for badge', () => {
        let root: HTMLElement;
        let waitForChanges: () => Promise<void>;
        let setProps: (props: Record<string, any>) => void;

        beforeEach(async () => {
            const result = await render(
                <limel-shortcut badge="NEW"></limel-shortcut>
            );
            root = result.root;
            waitForChanges = result.waitForChanges;
            setProps = result.setProps;
            await waitForChanges();
        });

        it('displays a badge with the correct value', () => {
            const badge = root.shadowRoot!.querySelector('limel-badge');
            expect(badge.getAttribute('label')).toEqual('NEW');
        });

        describe('when changing the badge value', () => {
            beforeEach(async () => {
                setProps({ badge: '3' });
                await waitForChanges();
            });

            it('displays the new badge value', () => {
                const badge = root.shadowRoot!.querySelector('limel-badge');
                expect(badge.getAttribute('label')).toEqual('3');
            });
        });
    });
});
