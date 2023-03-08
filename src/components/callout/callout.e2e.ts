import { newE2EPage } from '@stencil/core/testing';

describe('limel-callout', () => {
    it('renders a callout with the default "Info" heading', async () => {
        const page = await newE2EPage({
            html: '<limel-callout></limel-callout>',
        });

        const heading = await page.find('limel-callout>>>.heading');
        const icon = await page.find('limel-callout>>>limel-icon');
        expect(heading.textContent).toEqual('Info');
        expect(icon.getAttribute('name')).toEqual('info');
    });

    it('renders a callout with the provided heading', async () => {
        const page = await newE2EPage({
            html: '<limel-callout heading="Important"></limel-callout>',
        });
        const heading = await page.find('limel-callout>>>.heading');
        expect(heading.textContent).toEqual('Important');
    });

    it('renders a callout with the provided icon', async () => {
        const page = await newE2EPage({
            html: '<limel-callout icon="unit-test"></limel-callout>',
        });

        const icon = await page.find('limel-callout>>>limel-icon');
        expect(icon.getAttribute('name')).toEqual('unit-test');
    });

    it('renders a callout with the correct icon based on type', async () => {
        const page = await newE2EPage({
            html: '<limel-callout type="example"></limel-callout>',
        });

        const icon = await page.find('limel-callout>>>limel-icon');
        expect(icon.getAttribute('name')).toEqual('test_tube');
    });

    it('renders a callout with the default icon if type is not recognized', async () => {
        const page = await newE2EPage({
            html: '<limel-callout type="non-existing-type"></limel-callout>',
        });

        const icon = await page.find('limel-callout>>>limel-icon');
        expect(icon.getAttribute('name')).toEqual('info');
    });
});
