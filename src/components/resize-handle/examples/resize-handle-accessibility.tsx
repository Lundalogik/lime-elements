import { Languages, Option } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

const MIN_WIDTH = 120;
const MAX_WIDTH = 360;

const REGION_LABELS: Record<string, string> = {
    en: 'panel',
    sv: 'panelen',
    de: 'dem Panel',
    fr: 'le panneau',
};

/**
 * Accessibility
 *
 * The user reaches the handle with the <kbd>Tab</kbd> key. The accessible name
 * of the handle is "Resize" followed by `resizableRegionLabel`, for example
 * "Resize panel". When `resizableRegionLabel` is not set, the name is "Resize
 * this region". Set it to what the handle resizes, so that a screen reader user
 * can tell handles apart.
 *
 * A tooltip shows the name and how to resize. While the pointer is over the
 * handle, it says to drag the handle. While the handle has keyboard focus, it
 * says which arrow keys to press. Screen readers read the arrow keys as the
 * description of the handle.
 *
 * The name and the tooltip are translated into the language that is set in
 * `language`. Write `resizableRegionLabel` in the same language.
 *
 * In this example, change the language and switch off the region name, then
 * hover the handle or reach it with <kbd>Tab</kbd>, to see how the name and the
 * tooltip change.
 */
@Component({
    tag: 'limel-example-resize-handle-accessibility',
    shadow: true,
    styleUrl: 'resize-handle-basic.scss',
})
export class ResizeHandleAccessibilityExample {
    @State()
    private width = 200;

    @State()
    private language: Option = { text: 'English', value: 'en' };

    @State()
    private hasRegionLabel = true;

    private languages: Option[] = [
        { text: 'English', value: 'en' },
        { text: 'Svenska', value: 'sv' },
        { text: 'Deutsch', value: 'de' },
        { text: 'Français', value: 'fr' },
    ];

    public render() {
        const language = this.language.value as Languages;

        return (
            <Host>
                <section>
                    <aside style={{ width: `${this.width}px` }}>
                        <limel-resize-handle
                            resizableRegionLabel={
                                this.hasRegionLabel
                                    ? REGION_LABELS[language]
                                    : undefined
                            }
                            language={language}
                            location="left"
                            value={this.width}
                            min={MIN_WIDTH}
                            max={MAX_WIDTH}
                            onChangeSize={this.handleChangeSize}
                        />
                        <p>The panel is {this.width}px wide.</p>
                    </aside>
                </section>
                <limel-example-controls>
                    <limel-select
                        label="Language"
                        options={this.languages}
                        value={this.language}
                        onChange={this.setLanguage}
                    />
                    <limel-switch
                        label="Set resizableRegionLabel"
                        value={this.hasRegionLabel}
                        onChange={this.setHasRegionLabel}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private handleChangeSize = (event: CustomEvent<number>) => {
        const width = Math.min(Math.max(event.detail, MIN_WIDTH), MAX_WIDTH);
        this.width = Math.round(width);
    };

    private setLanguage = (event: CustomEvent<Option | Option[]>) => {
        event.stopPropagation();
        this.language = event.detail as Option;
    };

    private setHasRegionLabel = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.hasRegionLabel = event.detail;
    };
}
