import { EventEmitter } from '@stencil/core';
import { Tab } from '../tab-bar/tab.types';

/**
 * Interface for components rendered inside a `limel-tab-panel`
 */
export interface TabPanelComponent {
    /**
     * The tab that the component belongs to
     */
    tab: Tab;

    /**
     * Emit when the tab is updated for some reason, e.g. changing the text,
     * icon or badge
     */
    changeTab?: EventEmitter<Tab>;
}
