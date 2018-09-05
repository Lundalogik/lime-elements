import { TestWindow } from '@stencil/core/testing';
import { ButtonInner } from './button-inner';

jest.useFakeTimers();

describe('limel-button-inner', () => {
    it('builds', () => {
        expect(new ButtonInner()).toBeTruthy();
    });

    describe('with a label', () => {
        let element: HTMLLimelButtonElement;
        let testWindow: TestWindow;
        beforeEach(async () => {
            testWindow = new TestWindow();
            element = await testWindow.load({
                components: [ButtonInner],
                html: '<limel-button-inner label="Save"></limel-button-inner>',
            });
        });
        it('displays the correct label', () => {
            expect(element.querySelector('.label').textContent.trim()).toBe(
                'Save'
            );
        });

        describe('when changing the label', () => {
            beforeEach(async () => {
                element.label = 'new label';
                await testWindow.flush();
            });
            it('displays the new label', () => {
                expect(element.querySelector('.label').textContent.trim()).toBe(
                    'new label'
                );
            });
        });
    });

    describe('when the attribute `primary`', () => {
        describe('is not set', () => {
            let element: HTMLLimelButtonElement;
            let testWindow: TestWindow;
            beforeEach(async () => {
                testWindow = new TestWindow();
                element = await testWindow.load({
                    components: [ButtonInner],
                    html:
                        '<limel-button-inner label="Save"></limel-button-inner>',
                });
            });
            it('is non-primary', () => {
                expect(element.querySelector('button').classList).not.toContain(
                    'mdc-button--unelevated'
                );
            });
            it('the property returns `false`', () => {
                expect(element.primary).toBe(false);
            });

            describe('when setting the property to `true`', () => {
                beforeEach(async () => {
                    element.primary = true;
                    await testWindow.flush();
                });
                it('is primary', () => {
                    expect(element.querySelector('button').classList).toContain(
                        'mdc-button--unelevated'
                    );
                });
                it('the property returns `true`', () => {
                    expect(element.primary).toBe(true);
                });
            });
        });

        describe('is set', () => {
            let element: HTMLLimelButtonElement;
            let testWindow: TestWindow;
            beforeEach(async () => {
                testWindow = new TestWindow();
                element = await testWindow.load({
                    components: [ButtonInner],
                    html:
                        '<limel-button-inner label="Save" primary></limel-button-inner>',
                });
            });
            it('is primary', () => {
                expect(element.querySelector('button').classList).toContain(
                    'mdc-button--unelevated'
                );
            });
            it('the property returns `true`', () => {
                expect(element.primary).toBe(true);
            });

            describe('when setting the property to `false`', () => {
                beforeEach(async () => {
                    element.primary = false;
                    await testWindow.flush();
                });
                it('is non-primary', () => {
                    expect(
                        element.querySelector('button').classList
                    ).not.toContain('mdc-button--unelevated');
                });
                it('the property returns `false`', () => {
                    expect(element.primary).toBe(false);
                });
            });
        });
    });

    describe('when the attribute `disabled`', () => {
        describe('is not set', () => {
            let element: HTMLLimelButtonElement;
            let testWindow: TestWindow;
            beforeEach(async () => {
                testWindow = new TestWindow();
                element = await testWindow.load({
                    components: [ButtonInner],
                    html:
                        '<limel-button-inner label="Save"></limel-button-inner>',
                });
            });
            it('is enabled', () => {
                expect(
                    element.querySelector('button').getAttribute('disabled')
                ).toBe(null);
            });
            it('the property returns `false`', () => {
                expect(element.disabled).toBe(false);
            });

            describe('when setting the property to `true`', () => {
                beforeEach(async () => {
                    element.disabled = true;
                    await testWindow.flush();
                });
                it('is disabled', () => {
                    expect(
                        element.querySelector('button').getAttribute('disabled')
                    ).toBe('');
                });
                it('the property returns `true`', () => {
                    expect(element.disabled).toBe(true);
                });
            });
        });

        describe('is set', () => {
            let element: HTMLLimelButtonElement;
            let testWindow: TestWindow;
            beforeEach(async () => {
                testWindow = new TestWindow();
                element = await testWindow.load({
                    components: [ButtonInner],
                    html:
                        '<limel-button-inner label="Save" disabled></limel-button-inner>',
                });
            });
            it('is disabled', () => {
                expect(
                    element.querySelector('button').getAttribute('disabled')
                ).toBe('');
            });
            it('the property returns `true`', () => {
                expect(element.disabled).toBe(true);
            });

            describe('when setting the property to `false`', () => {
                beforeEach(async () => {
                    element.disabled = false;
                    await testWindow.flush();
                });
                it('is enabled', () => {
                    expect(
                        element.querySelector('button').getAttribute('disabled')
                    ).toBe(null);
                });
                it('the property returns `false`', () => {
                    expect(element.disabled).toBe(false);
                });
            });
        });
    });

    describe('when the attribute `loading`', () => {
        describe('is not set', () => {
            let element: HTMLLimelButtonElement;
            let testWindow: TestWindow;
            beforeEach(async () => {
                testWindow = new TestWindow();
                element = await testWindow.load({
                    components: [ButtonInner],
                    html:
                        '<limel-button-inner label="Save"></limel-button-inner>',
                });
            });
            it('the state is "not loading"', () => {
                expect(element.querySelector('button').classList).not.toContain(
                    'loading'
                );
                expect(element.querySelector('button').classList).not.toContain(
                    'just-loaded'
                );
            });
            it('the property returns `false`', () => {
                expect(element.loading).toBe(false);
            });

            describe('when setting the property to `true`', () => {
                beforeEach(async () => {
                    element.loading = true;
                    await testWindow.flush();
                });
                it('the state is "loading"', () => {
                    expect(element.querySelector('button').classList).toContain(
                        'loading'
                    );
                    expect(
                        element.querySelector('button').classList
                    ).not.toContain('just-loaded');
                });
                it('the property returns `true`', () => {
                    expect(element.loading).toBe(true);
                });

                describe('and then setting the property to `false`', () => {
                    beforeEach(async () => {
                        element.loading = false;
                        await testWindow.flush();
                    });
                    it('the visual state becomes "just-loaded"', () => {
                        expect(
                            element.querySelector('button').classList
                        ).not.toContain('loading');
                        expect(
                            element.querySelector('button').classList
                        ).toContain('just-loaded');
                    });
                    it('the property returns `false`', () => {
                        expect(element.loading).toBe(false);
                    });
                    it('the visual state becomes "not loading" after 2 seconds', () => {
                        expect(setTimeout).toHaveBeenLastCalledWith(
                            expect.any(Function),
                            2000
                        );
                        jest.runAllTimers();
                        expect(
                            element.querySelector('button').classList
                        ).not.toContain('loading');
                        expect(
                            element.querySelector('button').classList
                        ).not.toContain('just-loaded');
                    });
                });
            });
        });

        describe('is set', () => {
            let element: HTMLLimelButtonElement;
            let testWindow: TestWindow;
            beforeEach(async () => {
                testWindow = new TestWindow();
                element = await testWindow.load({
                    components: [ButtonInner],
                    html:
                        '<limel-button-inner label="Save" loading></limel-button-inner>',
                });
            });
            it('the state is "loading"', () => {
                expect(element.querySelector('button').classList).toContain(
                    'loading'
                );
                expect(element.querySelector('button').classList).not.toContain(
                    'just-loaded'
                );
            });
            it('the property returns `true`', () => {
                expect(element.loading).toBe(true);
            });

            describe('when setting the property to `false`', () => {
                beforeEach(async () => {
                    element.loading = false;
                    await testWindow.flush();
                });
                it('the visual state becomes "just-loaded"', () => {
                    expect(
                        element.querySelector('button').classList
                    ).not.toContain('loading');
                    expect(element.querySelector('button').classList).toContain(
                        'just-loaded'
                    );
                });
                it('the property returns `false`', () => {
                    expect(element.loading).toBe(false);
                });
                it('the visual state becomes "not loading" after 2 seconds', () => {
                    expect(setTimeout).toHaveBeenLastCalledWith(
                        expect.any(Function),
                        2000
                    );
                    jest.runAllTimers();
                    expect(
                        element.querySelector('button').classList
                    ).not.toContain('loading');
                    expect(
                        element.querySelector('button').classList
                    ).not.toContain('just-loaded');
                });

                describe('and then setting the property to `true`', () => {
                    beforeEach(async () => {
                        element.loading = true;
                        await testWindow.flush();
                    });

                    it.skip('the visual state becomes "loading"', () => {
                        expect(
                            element.querySelector('button').classList
                        ).toContain('loading');
                        expect(
                            element.querySelector('button').classList
                        ).not.toContain('just-loaded');
                    });

                    it('the property returns `true`', () => {
                        expect(element.loading).toBe(true);
                    });
                });
            });
        });
    });
});
