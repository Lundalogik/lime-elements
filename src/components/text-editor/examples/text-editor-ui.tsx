import { Option, LimelSelectCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * UI
 * By configuring the `ui` prop, you can define how the editor should be
 * rendered for the end users. The following options are available:
 * - `standard`: The default editor appearance with a full toolbar and
 *    standard layout.
 * - `minimal`: A compact editor appearance, ideal for limited space
 *    scenarios such as mobile devices. In this mode, the toolbar is hidden
 *    until the editor is focused.
 *
 * :::important
 * It's very important to add a `placeholder` or `label` when using
 * the `minimal` UI. The reason is that without a placeholder or a label,
 * there is no visual clue for the user to realize that the grey box is
 * actually an input field that they can type in,
 * since the toolbar would not be shown unless the input filed is focused.
 * :::
 */
@Component({
    tag: 'limel-example-text-editor-ui',
    shadow: true,
})
export class TextEditorUiExample {
    @State()
    private selectedUi: Option<'standard' | 'minimal'> = {
        text: 'standard',
        value: 'standard',
    };

    private availableUis: Array<Option<'standard' | 'minimal'>> = [
        { text: 'standard', value: 'standard' },
        { text: 'minimal', value: 'minimal' },
    ];

    @State()
    private value: string;

    public render() {
        const placeholderText =
            this.selectedUi.value === 'minimal' ? 'Write a comment…' : '';

        return [
            <limel-text-editor
                value={this.value}
                onChange={this.handleChange}
                ui={this.selectedUi.value}
                placeholder={placeholderText}
            />,
            <limel-example-controls
                style={{ '--example-controls-column-layout': 'auto-fit' }}
            >
                <limel-example-value value={this.value} />
                <limel-select
                    label="ui"
                    options={this.availableUis}
                    value={this.selectedUi}
                    onChange={this.handleNewSelection}
                />
            </limel-example-controls>,
        ];
    }

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private handleNewSelection = (
        event: LimelSelectCustomEvent<Option<'standard' | 'minimal'>>,
    ) => {
        this.selectedUi = event.detail;
    };
}
