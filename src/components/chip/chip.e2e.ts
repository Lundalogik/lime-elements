import { newE2EPage } from '@stencil/core/testing';

describe('limel-chip', () => {
    let page;

    beforeEach(async () => {
        page = await newE2EPage();
    });

    it('renders with the correct text', async () => {
        await page.setContent('<limel-chip text="Test chip"></limel-chip>');
        await page.waitForChanges();

        const element = await page.find('limel-chip >>> .chip');
        expect(element.textContent).toEqual('Test chip');
    });

    it('renders as a link when the link prop is provided', async () => {
        await page.setContent('<limel-chip></limel-chip>');

        const element = await page.find('limel-chip');
        element.setProperty('link', { href: 'http://example.com' });
        await page.waitForChanges();

        const linkElement = await page.find('limel-chip >>> a');
        expect(linkElement).toBeTruthy();

        // Check if id starts with "chip-"
        const id = await linkElement.getAttribute('id');
        expect(id).toMatch(/^chip-/);
    });

    it('renders with a badge when the badge prop is provided', async () => {
        await page.setContent(
            '<limel-chip text="Test chip" badge="5"></limel-chip>',
        );

        const element = await page.find('limel-chip >>> limel-badge');
        expect(element.getAttribute('label')).toEqual('5');
    });

    it('renders with a remove button when the removable prop is true', async () => {
        await page.setContent(
            '<limel-chip text="Test chip" removable></limel-chip>',
        );

        const element = await page.find('limel-chip >>> .remove-button');
        expect(element).not.toBeNull();
    });
});
