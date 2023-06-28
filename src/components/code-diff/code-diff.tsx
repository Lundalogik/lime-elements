import { LimelMenuCustomEvent, MenuItem } from '@limetech/lime-elements';
import { Component, Prop, State, h } from '@stencil/core';
import { getFullConfig } from './getDelta';

@Component({
    tag: 'limel-code-diff',
    shadow: true,
    styleUrl: 'code-diff.scss',
})
export class CodeDiff {
    @Prop()
    public path: string;

    private versions;

    @State()
    private items;

    private selectedVersion = 0;

    public componentWillLoad() {
        this.versions = JSON.parse(
            localStorage.getItem('configMinorVersions')
        ).filter((config) => this.matchConfigSelector(config.configSelector));

        this.items = this.versions.map((_, id: number) => {
            return {
                text: 'version ' + (id + 1).toString(),
                selected: this.isSelected(id),
            };
        });
    }

    public render() {
        return [
            <limel-menu items={this.items} onSelect={this.handleSelect}>
                <limel-button label="versions" slot="trigger"></limel-button>
            </limel-menu>,
            <div class="code-editors">
                <limel-code-editor
                    value={this.getLatestVersion()}
                    colorScheme="dark"
                ></limel-code-editor>
                <limel-code-editor
                    value={this.getVersion(this.selectedVersion)}
                    colorScheme="dark"
                ></limel-code-editor>
            </div>,
        ];
    }

    private getLatestVersion() {
        return this.getVersion(this.versions.length - 1);
    }

    private getVersion(version: number) {
        return JSON.stringify(
            getFullConfig(this.versions, version),
            null,
            '    '
        );
    }

    private handleSelect = (event: LimelMenuCustomEvent<MenuItem>) => {
        event.stopPropagation();

        const version = Number(event.detail.text.replace('version ', '')) - 1;

        this.selectedVersion = version;

        this.updateItems();
    };

    private updateItems() {
        this.items = this.items.map((item: MenuItem, id: number) => {
            const itemCopy = { ...item };
            itemCopy.selected = this.isSelected(id);

            return itemCopy;
        });
    }

    private matchConfigSelector(configPath): boolean {
        return this.path.split('/')[0] === configPath.split('/')[0];
    }

    private isSelected(id): boolean {
        return id === this.selectedVersion;
    }
}
