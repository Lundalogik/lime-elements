import { Option, LimelSelectCustomEvent } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * The `ui` options
 */
type TextEditorUIs = 'standard' | 'minimal' | 'no-toolbar';

/**
 * UI
 * By configuring the `ui` prop, you can define how the editor should be
 * rendered for the end users. The following options are available:
 * - `standard`: The default editor appearance with a full toolbar and
 *    standard layout.
 * - `minimal`: A compact editor appearance, ideal for limited space
 *    scenarios such as mobile devices. In this mode, the toolbar is hidden
 *    until the editor is focused.
 * - `no-toolbar`: A basic textarea appearance without any text styling toolbar.
 *    This mode is suitable for scenarios where you want to provide a simple
 *    text input without any visible formatting options; but still provide
 *    support for markdown syntax and rich text, using hotkeys or when pasting.
 *
 * :::important
 * It's very important to add a `placeholder` or `label` when using
 * the `minimal` or `no-toolbar` UI. The reason is that without a placeholder or a label,
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
    private selectedUi: Option<TextEditorUIs> = {
        text: 'standard',
        value: 'standard',
    };

    private availableUis: Array<Option<TextEditorUIs>> = [
        { text: 'standard', value: 'standard' },
        { text: 'minimal', value: 'minimal' },
        { text: 'no-toolbar', value: 'no-toolbar' },
    ];

    @State()
    private value: string;

    public render() {
        const placeholderText =
            this.selectedUi.value !== 'standard' ? 'Write a comment…' : '';

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
        event: LimelSelectCustomEvent<Option<TextEditorUIs>>,
    ) => {
        this.selectedUi = event.detail;
    };
}
