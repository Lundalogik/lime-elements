import { LimelMenuCustomEvent, MenuItem } from '@limetech/lime-elements';
import { Component, Prop, State, h } from '@stencil/core';
import { getFullConfig } from './getDelta';
import {
    html as diff2html,
    Diff2HtmlConfig,
} from 'diff2html/lib-esm/diff2html.js';
import { createTwoFilesPatch } from 'diff/lib';

@Component({
    tag: 'limel-code-diff',
    shadow: true,
    styleUrl: 'code-diff.scss',
})
export class CodeDiff {
    @Prop()
    public path: string;

    @Prop()
    public reformatJson: boolean = false;

    @Prop()
    public single: boolean = false;

    @Prop()
    public renderOptions: Diff2HtmlConfig = {};

    protected defaultRenderOptions: Diff2HtmlConfig = {
        // outputFormat: 'side-by-side',
        outputFormat: 'line-by-line',
        drawFileList: false,
    };

    private versions;

    @State()
    private items;

    private selectedVersion: number = 0;

    public componentWillLoad() {
        this.versions = JSON.parse(
            localStorage.getItem('configMinorVersions')
        ).filter((config) => this.matchConfigSelector(config.configSelector));

        this.items = this.versions
            .map((_, id: number) => {
                return {
                    text: 'version ' + (id + 1).toString(),
                    selected: this.isSelected(id),
                };
            })
            .filter((_, id: number) => {
                return id !== this.versions.length - 1;
            });
    }

    public render() {
        return [
            <limel-menu items={this.items} onSelect={this.handleSelect}>
                <limel-button label="versions" slot="trigger"></limel-button>
            </limel-menu>,
            <div class="code-editors">
                <div
                    class={`diff__viewer ${
                        this.single ? 'diff__viewer--single' : ''
                    }`}
                    innerHTML={this.renderComparison()}
                >
                    {' '}
                </div>
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

    protected getComparisonHtml(
        versionBefore,
        versionAfter,
        jsonBefore,
        jsonAfter
    ) {
        const titleBefore = `Version ${versionBefore}`;
        const titleAfter = `Version ${versionAfter} [Latest]`;
        const defaultIndent = 4;

        let contentBefore = jsonBefore;
        let contentAfter = jsonAfter;

        if (this.reformatJson === true) {
            try {
                // Re-stringify json to remove indentation changes
                contentBefore = JSON.stringify(
                    JSON.parse(jsonBefore),
                    null,
                    defaultIndent
                );
                contentAfter = JSON.stringify(
                    JSON.parse(jsonAfter),
                    null,
                    defaultIndent
                );
            } catch (e) {
                // Formatting failed, leave content as-is
            }
        }

        const renderOptions = {
            ...this.defaultRenderOptions,
            ...this.renderOptions,
        };
        const diffArray = createTwoFilesPatch(
            titleBefore,
            titleAfter,
            contentBefore,
            contentAfter
        );

        return diff2html(diffArray, renderOptions);
    }

    private renderComparison = () => {
        return this.getComparisonHtml(
            this.selectedVersion + 1,
            this.versions.length,
            this.getVersion(this.selectedVersion),
            this.getLatestVersion()
        );
    };
}
