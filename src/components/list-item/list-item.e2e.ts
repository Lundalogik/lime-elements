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

    it('emits interact on click for selectable types', async () => {
        const page = await newE2EPage({
            html: '<limel-list-item type="option" text="Sel"></limel-list-item>',
        });
        const host = await page.find('limel-list-item');
        const spy = await page.spyOnEvent('interact');
        await host.click();
        await page.waitForChanges();
        expect(spy).toHaveReceivedEventTimes(1);
    });

    it('does not emit interact when disabled', async () => {
        const page = await newE2EPage({
            html: '<limel-list-item type="option" disabled text="Disabled"></limel-list-item>',
        });
        const host = await page.find('limel-list-item');
        const spy = await page.spyOnEvent('interact');
        await host.click();
        await page.waitForChanges();
        expect(spy).not.toHaveReceivedEvent();
    });

    it('emits interact on Enter/Space when focused (keyboard activation)', async () => {
        const page = await newE2EPage({
            html: '<limel-list-item type="option" tabindex="0" text="KB"></limel-list-item>',
        });
        const host = await page.find('limel-list-item');
        const spy = await page.spyOnEvent('interact');
        await host.focus();
        await page.keyboard.press('Enter');
        await page.waitForChanges();
        await page.keyboard.press('Space');
        await page.waitForChanges();
        expect(spy).toHaveReceivedEventTimes(2);
    });

    it('does not emit interact when activating the action menu trigger', async () => {
        const page = await newE2EPage({
            html: `<limel-list-item type="option" text="With actions"></limel-list-item>`,
        });
        const host = await page.find('limel-list-item');
        const spy = await page.spyOnEvent('interact');
        await host.setProperty('actions', [{ text: 'Action', value: 'a' }]);
        await page.waitForChanges();
        const trigger = await host.find('.action-menu-trigger');
        expect(trigger).not.toBeNull();
        await trigger.click();
        await page.waitForChanges();
        expect(spy).not.toHaveReceivedEvent();
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
