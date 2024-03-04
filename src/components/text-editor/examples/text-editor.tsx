import {
    EditorType,
    LimelInputFieldCustomEvent,
    LimelSelectCustomEvent,
    LimelTextEditorCustomEvent,
    Option,
} from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

const EDIT_TYPE_OPTIONS: Array<Option<EditorType>> = [
    { text: 'WYSIWYG', value: 'wysiwyg' },
    { text: 'Markdown', value: 'markdown' },
];

/**
 * This example illustrates how to use the 'limel-text-editor' component.
 */
@Component({
    tag: 'limel-example-text-editor',
    shadow: true,
    styleUrl: 'text-editor.scss',
})
export class TextEditor {
    @State()
    private editType: EditorType = 'wysiwyg';

    @State()
    private placeholder: string = 'Type your text here';

    @State()
    private text: { markdown: string; HTML: string };

    public render() {
        return [
            this.renderInputFields(),
            <limel-text-editor
                editType={this.editType}
                onChange={this.handleChange}
                onChangeMode={this.handleChangeMode}
                placeholder={this.placeholder}
            />,
            <limel-example-value value={this.text} />,
        ];
    }

    private renderInputFields() {
        return [
            <limel-select
                label="editType"
                value={this.getEditTypeOption()}
                onChange={this.handleChangeEditType}
                options={EDIT_TYPE_OPTIONS}
            />,
            <limel-input-field
                label="placeholder"
                value={this.placeholder}
                onChange={this.handleChangePlaceholder}
            />,
        ];
    }

    private handleChange = (
        event: LimelTextEditorCustomEvent<{ markdown: string; HTML: string }>,
    ): void => {
        event.stopPropagation();
        this.text = event.detail;
    };

    private handleChangeMode = (
        event: LimelTextEditorCustomEvent<EditorType>,
    ) => {
        event.stopPropagation();
        this.editType = event.detail;
    };

    private handleChangeEditType = (
        event: LimelSelectCustomEvent<Option<EditorType>>,
    ): void => {
        event.stopPropagation();
        this.editType = event.detail.value;
    };

    private handleChangePlaceholder = (
        event: LimelInputFieldCustomEvent<string>,
    ) => {
        event.stopPropagation();
        this.placeholder = event.detail;
    };

    private getEditTypeOption(): Option {
        return EDIT_TYPE_OPTIONS.find(
            (option) => option.value === this.editType,
        );
    }
}
