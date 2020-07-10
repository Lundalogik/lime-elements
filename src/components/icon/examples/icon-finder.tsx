import { Chip } from '@limetech/lime-elements';
import * as iconIndex from '@lundalogik/lime-icons8/assets/icon-index.json';
import { Component, h, State } from '@stencil/core';
import { ENTER, ENTER_KEY_CODE } from '../../../util/keycodes';

@Component({
    tag: 'limel-example-icon-finder',
    shadow: true,
})
export class IconFinder {
    @State()
    private value = [];

    @State()
    private textValue = '';

    @State()
    private icons = [];

    private indexedIcons = [...iconIndex['default']]; // eslint-disable-line @typescript-eslint/dot-notation

    constructor() {
        this.chipSetOnChange = this.chipSetOnChange.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.searchIcons = this.searchIcons.bind(this);
        this.renderIconButton = this.renderIconButton.bind(this);
    }

    public render() {
        return [
            <limel-chip-set
                label="Icon finder"
                type="input"
                value={this.value}
                onChange={this.chipSetOnChange}
                onInput={this.onInput}
                onKeyUp={this.onKeyUp}
                searchLabel="Search for icons"
                emptyInputOnBlur={true}
            />,
            <div> {this.icons.map(this.renderIconButton)}</div>,
        ];
    }

    private renderIconButton(icon) {
        const iconName = icon.id.replace('.svg', '');
        const label = `Copy ${iconName}`;

        return (
            <limel-icon-button
                label={label}
                icon={iconName}
                onClick={this.copyIconName}
            />
        );
    }

    private copyIconName(event) {
        const iconName = event.target.icon;
        const element = document.createElement('textarea');
        element.value = iconName;
        document.body.appendChild(element);
        element.select();
        document.execCommand('copy');
        document.body.removeChild(element);
        console.log(`copied icon name '${iconName}' to clipboard`);
    }

    private onInput(event: CustomEvent<string>) {
        this.textValue = event.detail;
    }

    private onKeyUp(event: KeyboardEvent) {
        if (
            (event.key === ENTER || event.keyCode === ENTER_KEY_CODE) &&
            this.textValue.trim()
        ) {
            this.value = [
                ...this.value,
                this.createChip(this.textValue.trim()),
            ];
            this.searchIcons();
            this.textValue = '';
        }
    }

    private searchIcons() {
        this.icons = [];
        this.indexedIcons.forEach((icon) => {
            this.value.forEach((search) => {
                const hits = icon.tags.filter((tag) =>
                    tag.includes(search.text)
                );
                if (hits.length || icon.id.includes(search.text)) {
                    this.icons.push(icon);
                }
            });
        });
        this.icons = [...new Set(this.icons)];
    }

    private chipSetOnChange(event: CustomEvent<Chip[]>) {
        this.value = event.detail;
        this.searchIcons();
    }

    private createChip(name: string): Chip {
        return {
            id: name,
            text: name,
            removable: true,
        };
    }
}
