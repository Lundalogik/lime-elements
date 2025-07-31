import { Option } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Truncation of multiple lines of secondary text
 *
 * The consumer component can set the `--maxLinesSecondaryText` CSS variable
 * to control how many lines of secondary text should be displayed within the available
 * space, before it is truncated.
 */
@Component({
    tag: 'limel-example-list-item-multiple-lines',
    shadow: true,
    styleUrl: 'list-item-basic.scss',
})
export class ListItemMultipleLinesExample {
    @State()
    private maxLines: Option = { text: '2', value: '2' };

    private options: Option[] = [
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' },
        { text: '4', value: '4' },
        { text: '5', value: '5' },
    ];
    public render() {
        return (
            <Host>
                <ul
                    class="is-resizable"
                    style={{ '--maxLinesSecondaryText': this.maxLines.value }}
                >
                    <limel-list-item
                        value={1}
                        text="This item only has one line of primary text, and no secondary text"
                        icon="text_width"
                    />
                    <limel-list-item
                        value={2}
                        text="Very long primary texts like this one will truncate and you cannot do anything about it. Just avoid having long primary texts."
                        secondaryText="This is a short secondary text."
                        icon="text_width"
                    />
                    <limel-list-item
                        value={3}
                        text="This item only has one line of primary text"
                        secondaryText="The length of secondary text does not exceed maximum allowed number of lines (of course depending on the width of your screen), thus the lines will not truncate."
                        icon="text_width"
                    />
                    <limel-list-item
                        value={4}
                        text="This is a short primary text"
                        secondaryText="Very long secondary texts like this one will not truncate on the first line. By default, the list will render 3 lines of text and then truncates the rest. If you need more lines of text to be shown, you can simply define it in your code, and add a maximum number there. For more information regarding this, please read the documentation."
                        icon="text_width"
                    />
                </ul>
                <limel-example-controls
                    style={{
                        '--example-controls-column-layout': 'auto-fit',
                    }}
                >
                    <limel-select
                        label="maxLinesSecondaryText"
                        options={this.options}
                        value={this.maxLines}
                        onChange={this.handleChange}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private handleChange = (event) => {
        event.stopPropagation();
        this.maxLines = event.detail;
    };
}
