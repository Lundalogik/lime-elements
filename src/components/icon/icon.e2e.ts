import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { avatarAsDataUri } from './examples/avatarAsDataUri';

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

    describe('when given a relative url instead of an icon name', () => {
        it('renders an img element', async () => {
            const testUrl =
                '/assets/avatars/0e6f74c0-11d9-465b-aac6-44f33da3cb7c.png';
            await page.setContent(`<limel-icon src="${testUrl}"></limel-icon>`);
            await page.waitForChanges();

            const imgElement = await page.find('limel-icon >>> img');
            expect(imgElement).toBeTruthy();
            expect(imgElement.getAttribute('src')).toEqual(testUrl);
        });
    });

    describe('when given an absolute url instead of an icon name', () => {
        it('renders an img element', async () => {
            const testUrl =
                'http://localhost:3333/assets/avatars/0e6f74c0-11d9-465b-aac6-44f33da3cb7c.png';
            await page.setContent(`<limel-icon src="${testUrl}"></limel-icon>`);
            await page.waitForChanges();

            const imgElement = await page.find('limel-icon >>> img');
            expect(imgElement).toBeTruthy();
            expect(imgElement.getAttribute('src')).toEqual(testUrl);
        });
    });

    describe('when given a protocol-relative url instead of an icon name', () => {
        it('renders an img element', async () => {
            const testUrl =
                '//localhost:3333/assets/avatars/0e6f74c0-11d9-465b-aac6-44f33da3cb7c.png';
            await page.setContent(`<limel-icon src="${testUrl}"></limel-icon>`);
            await page.waitForChanges();

            const imgElement = await page.find('limel-icon >>> img');
            expect(imgElement).toBeTruthy();
            expect(imgElement.getAttribute('src')).toEqual(testUrl);
        });
    });

    describe('when given a data-URI instead of an icon name', () => {
        it('renders an img element', async () => {
            await page.setContent(
                `<limel-icon src="${avatarAsDataUri}"></limel-icon>`,
            );
            await page.waitForChanges();

            const imgElement = await page.find('limel-icon >>> img');
            expect(imgElement).toBeTruthy();
            expect(imgElement.getAttribute('src')).toEqual(avatarAsDataUri);
        });
    });

    it('switches between icon and image rendering based on src prop', async () => {
        const iconName = 'angle_left';
        const imageUrl =
            '/assets/avatars/0e6f74c0-11d9-465b-aac6-44f33da3cb7c.png';

        // Step 1: Set the name prop to display an SVG icon
        await page.setContent(`<limel-icon name="${iconName}"></limel-icon>`);
        await page.waitForChanges();

        // Step 2: Verify that the SVG icon is rendered
        let svgElement = await page.find('limel-icon >>> svg');
        let titleElement = await page.find('limel-icon >>> svg title');
        expect(svgElement).toBeTruthy();
        expect(titleElement.textContent).toEqual('Angle Left');

        // Step 3: Set the src prop to a URL
        const element = await page.find('limel-icon');
        element.setProperty('src', imageUrl);
        await page.waitForChanges();

        // Step 4: Verify that the <img> is rendered with the correct src attribute
        const imgElement = await page.find('limel-icon >>> img');
        expect(imgElement).toBeTruthy();
        expect(imgElement.getAttribute('src')).toEqual(imageUrl);

        // Step 5: Change the name prop to display a different SVG icon
        element.setProperty('name', 'angle_right');
        await page.waitForChanges();

        // Step 6: Verify that the <img> is still rendered with the correct src attribute
        expect(imgElement).toBeTruthy();
        expect(imgElement.getAttribute('src')).toEqual(imageUrl);

        // Step 7: Remove the src prop, reverting to SVG icon
        element.setProperty('src', null);
        await page.waitForChanges();

        // Step 8: Verify that the SVG icon is rendered again
        svgElement = await page.find('limel-icon >>> svg');
        titleElement = await page.find('limel-icon >>> svg title');
        expect(svgElement).toBeTruthy();
        expect(titleElement.textContent).toEqual('Angle Right');
    });
});
