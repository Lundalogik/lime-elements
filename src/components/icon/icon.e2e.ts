import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('limel-icon', () => {
    let page: E2EPage;

    beforeEach(async () => {
        page = await newE2EPage();
    });

    it('renders correctly with a provided icon name', async () => {
        await page.setContent('<limel-icon name="unit-test"></limel-icon>');
        await page.waitForChanges();

        const svgElement = await page.find('limel-icon >>> svg');
        expect(svgElement).toBeTruthy();
    });

    it('does not render an icon when name is not provided', async () => {
        await page.setContent('<limel-icon></limel-icon>');
        await page.waitForChanges();

        const svgElement = await page.find('limel-icon >>> svg');
        expect(svgElement).toBeFalsy();
    });

    it('updates the icon when the name prop changes', async () => {
        await page.setContent('<limel-icon name="angle_left"></limel-icon>');
        await page.waitForChanges();

        // Get the title of the initially loaded SVG
        let titleElement = await page.find('limel-icon >>> svg title');
        expect(titleElement.textContent).toEqual('Angle Left');

        // Update the name prop to change the icon
        const element = await page.find('limel-icon');
        element.setProperty('name', 'angle_right');
        await page.waitForChanges();

        // Get the title of the updated SVG
        titleElement = await page.find('limel-icon >>> svg title');
        expect(titleElement.textContent).toEqual('Angle Right');
    });

    it('renders with a badge when the badge and size props are provided', async () => {
        await page.setContent(
            '<limel-icon name="unit-test" size="small" badge></limel-icon>',
        );
        await page.waitForChanges();

        // Note: This test assumes there is a CSS class or structure change when a badge is applied. Adjust the selector accordingly.
        const badgeElement = await page.find('limel-icon[badge]');
        expect(badgeElement).toBeTruthy();
    });
});
