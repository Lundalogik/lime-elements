import { LimelProsemirrorAdapterCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';
import {
    LimeObjectSelectorPlugin,
    LimeObjectSelectorPluginProps,
    LimeObjectSelectorPluginTrigger,
} from '../plugins/limeobject-selector/types';
import { ListItem } from 'src/components/list/list-item.types';
/**
 * Searcher example
 *
 * Try typing an exclamation mark
 */
@Component({
    tag: 'limel-example-prosemirror-adapter-with-searcher-plugin',
    shadow: true,
})
export class ProsemirrorAdapterSearcherPluginExample {
    @State()
    private text: string = '';

    private plugin: LimeObjectSelectorPlugin;
    private exclamationItems: Array<ListItem<string>> = [
        { text: 'Google', value: 'https://www.google.com' },
    ];
    private atItems: Array<ListItem<string>> = [
        { text: 'Facebook', value: 'https://www.facebook.com' },
    ];

    public componentWillLoad() {
        const props: LimeObjectSelectorPluginProps = {
            trigger: '!',
            searcher: (trigger: LimeObjectSelectorPluginTrigger) => {
                if (trigger === '!') {
                    return this.getSearcher(this.exclamationItems);
                } else if (trigger === '@') {
                    return this.getSearcher(this.atItems);
                }
            },
            onChange: this.handleSearcherChange,
        };

        this.plugin = new LimeObjectSelectorPlugin(props);
    }

    public render() {
        return [
            <limel-prosemirror-adapter
                onChange={this.handleChange}
                plugins={[this.plugin]}
            />,
            <limel-example-value value={this.text} />,
        ];
    }

    private getSearcher(items: Array<ListItem<string>>) {
        return (query: string): Promise<Array<ListItem<string>>> => {
            return new Promise((resolve) => {
                if (query === '') {
                    return resolve(items);
                }

                const filteredItems = items.filter((item) => {
                    return item.text
                        .toLowerCase()
                        .includes(query.toLowerCase());
                });

                return resolve(filteredItems);
            });
        };
    }

    private handleChange = (
        event: LimelProsemirrorAdapterCustomEvent<string>,
    ): void => {
        event.stopPropagation();

        this.text = event.detail;
    };

    private handleSearcherChange = (value: string): void => {
        event.stopPropagation();

        this.text = value;
    };
}
