import { newE2EPage } from '@stencil/core/testing';

describe('limel-list-item', () => {
    it('renders a default list item with correct role and aria-disabled', async () => {
        const page = await newE2EPage({
            html: '<limel-list-item text="Item"></limel-list-item>',
        });
        const host = await page.find('limel-list-item');
        expect(host).toEqualAttribute('role', 'listitem');
        expect(host).toEqualAttribute('aria-disabled', 'false');
        expect(host).toEqualAttribute('text', 'Item');
        expect(host).not.toHaveAttribute('secondary-text');
        expect(host).not.toHaveAttribute('aria-selected');
        expect(host).not.toHaveAttribute('aria-checked');
    });

    it('sets aria-describedby when secondaryText is provided', async () => {
        const page = await newE2EPage({
            html: '<limel-list-item text="Item" secondary-text="More"></limel-list-item>',
        });
        const host = await page.find('limel-list-item');
        const describedBy = await host.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
    });

    it('renders radio item with correct role, aria-checked and input presence', async () => {
        const page = await newE2EPage({
            html: '<limel-list-item type="radio" selected text="Radio"></limel-list-item>',
        });
        const host = await page.find('limel-list-item');
        expect(host).toEqualAttribute('role', 'radio');
        expect(host).toEqualAttribute('aria-checked', 'true');
        const radio = await host.find('input[type="radio"]');
        expect(radio).not.toBeNull();
    });

    it('renders checkbox item with correct role, aria-checked and input presence', async () => {
        const page = await newE2EPage({
            html: '<limel-list-item type="checkbox" text="Check"></limel-list-item>',
        });
        const host = await page.find('limel-list-item');
        expect(host).toEqualAttribute('role', 'checkbox');
        expect(host).toEqualAttribute('aria-checked', 'false');
        const checkbox = await host.find('input[type="checkbox"]');
        expect(checkbox).not.toBeNull();
    });

    it('renders action menu trigger without producing interact event', async () => {
        const page = await newE2EPage({
            html: '<limel-list-item type="option" text="Actions"></limel-list-item>',
        });
        const host = await page.find('limel-list-item');
        await host.setProperty('actions', [{ text: 'Action', value: 'a' }]);
        await page.waitForChanges();
        const trigger = await host.find('.action-menu-trigger');
        expect(trigger).not.toBeNull();
        const interactSpy = await page.spyOnEvent('interact');
        await trigger.click();
        await page.waitForChanges();
        expect(interactSpy).not.toHaveReceivedEvent();
    });

    it('reflects aria-selected when type=option and selected prop changes', async () => {
        const page = await newE2EPage({
            html: '<limel-list-item type="option" text="SelState"></limel-list-item>',
        });
        const host = await page.find('limel-list-item');
        expect(host).toEqualAttribute('aria-selected', 'false');
        await host.setProperty('selected', true);
        await page.waitForChanges();
        expect(host).toEqualAttribute('aria-selected', 'true');
    });

    it('renders icon and image when provided (presence checks)', async () => {
        const imgSrc =
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        const page = await newE2EPage({
            html:
                `<limel-list-item text="Media" icon="info"></limel-list-item>` +
                `<limel-list-item text="Pic"></limel-list-item>`,
        });
        const hosts = await page.findAll('limel-list-item');
        const iconHost = hosts[0];
        const imageHost = hosts[1];
        // Set complex prop via property to avoid attribute JSON parsing issues
        await imageHost.setProperty('image', { src: imgSrc, alt: 'a' });
        await page.waitForChanges();
        const iconEl = await iconHost.find('limel-icon');
        expect(iconEl).not.toBeNull();
        const imgEl = await imageHost.find('img');
        expect(imgEl).not.toBeNull();
    });
});
