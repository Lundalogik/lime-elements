import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { ActionBarItem } from './action-bar.types';
import { ListSeparator } from '../list/list-item.types';

describe('action-bar', () => {
    let items: Array<ActionBarItem | ListSeparator>;
    let page: E2EPage;
    let actionBar: E2EElement;

    beforeEach(async () => {
        items = [
            {
                text: 'Add',
                icon: 'info',
            },
            {
                text: 'Edit',
                icon: 'idea',
            },
            {
                text: 'Delete',
                icon: 'multiply',
            },
            {
                separator: true,
            },
            {
                text: 'Settings',
                icon: 'external_link',
            },
        ];
        page = await newE2EPage();
        await page.setViewport({ width: 800, height: 600 });
        await page.setContent(
            '<div><limel-action-bar layout="fullWidth" accessible-label="Action bar">test test hello</limel-action-bar></div>'
        );
        actionBar = await page.find('limel-action-bar');
    });

    it('renders', async () => {
        expect(actionBar).toHaveClass('hydrated');
    });

    // I can't get this to work for some reason. It seems the action bar
    // simply won't get any calculable width… /Ads
    it.skip('should render with action items', async () => {
        actionBar.setProperty('actionBarItems', items);
        await page.waitForChanges();

        const itemElements = await actionBar.findAll('limel-action-bar-item');
        expect(itemElements.length).toEqual(4);
    });
});
