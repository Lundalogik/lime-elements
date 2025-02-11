import { Chip, LimelChipSetCustomEvent } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';
import { ENTER } from '../../../util/keycodes';

interface Icon {
    id: string;
    tags: string[];
}

/**
 * Icon Finder
 *
 * Used in the docs for `limel-icon`.
 */
@Component({
    tag: 'limel-example-icon-finder',
    shadow: true,
})
export class IconFinder {
    @State()
    private value: Chip[] = [];

    @State()
    private textValue = '';

    @State()
    private icons: Icon[] = [];

    private indexedIcons: any[] = [];

    public componentWillLoad() {
        this.loadIconIndex();
    }

    private readonly loadIconIndex = async () => {
        const response = await fetch(
            'https://lundalogik.github.io/lime-icons8/assets/icon-index.json',
        );
        const json = await response?.json?.();
        this.indexedIcons = json;
    };

    public render() {
        return (
            <Host>
                <limel-chip-set
                    label="Icon finder"
                    type="input"
                    value={this.value}
                    onChange={this.chipSetOnChange}
                    onInput={this.onInput}
                    onKeyUp={this.onKeyUp}
                    searchLabel="Type and press enter to search"
                    emptyInputOnBlur={true}
                    leadingIcon={'search'}
                />
                <div> {this.icons.map(this.renderIconButton)}</div>
            </Host>
        );
    }

    private readonly renderIconButton = (icon: Icon) => {
        const iconName = icon.id.replace('.svg', '');
        const label = `Copy ${iconName}`;

        return (
            <limel-icon-button
                label={label}
                icon={iconName}
                onClick={this.copyIconName}
            />
        );
    };

    private async copyToClipboard(text: string) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    private copyIconName(event) {
        const iconName = event.target.icon;
        const element = document.createElement('textarea');
        element.value = iconName;
        document.body.appendChild(element);
        element.select();
        this.copyToClipboard(iconName);
        document.body.removeChild(element);
        console.log(`copied icon name '${iconName}' to clipboard`);
    }

    private readonly onInput = (
        event: LimelChipSetCustomEvent<string> | InputEvent,
    ) => {
        if (event instanceof CustomEvent) {
            this.textValue = event.detail;
        }
    };

    private readonly onKeyUp = (event: KeyboardEvent) => {
        if (event.key === ENTER && this.textValue.trim()) {
            this.value = [
                ...this.value,
                this.createChip(this.textValue.trim()),
            ];
            this.searchIcons();
            this.textValue = '';
        }
    };

    private readonly searchIcons = () => {
        this.icons = [];
        this.indexedIcons.forEach((icon: Icon) => {
            this.value.forEach((search: Chip) => {
                const hits = icon.tags.filter((tag) =>
                    tag.includes(search.text),
                );
                if (hits.length || icon.id.includes(search.text)) {
                    this.icons.push(icon);
                }
            });
        });
        this.icons = [...new Set(this.icons)];
    };

    private readonly chipSetOnChange = (
        event: LimelChipSetCustomEvent<Chip[]>,
    ) => {
        this.value = event.detail;
        this.searchIcons();
    };

    private createChip(name: string): Chip {
        return {
            id: name,
            text: name,
            removable: true,
        };
    }
}
