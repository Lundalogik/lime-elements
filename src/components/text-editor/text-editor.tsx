import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
    Watch,
} from '@stencil/core';
import ToastUIEditor from '@toast-ui/editor';
import { Editor, EditorProps } from '@toast-ui/react-editor';
import { createElement, createRef, RefObject } from 'react';
import ReactDOM from 'react-dom';
import { EditorType, PreviewStyle } from './types';

const LANGUAGE: string = 'en';
const PREVIEW_STYLE: PreviewStyle = 'tab';
const TOOLBAR_ITEMS: string[][] = [
    ['heading', 'bold', 'italic', 'strike'],
    ['hr', 'quote'],
    ['ul', 'ol', 'task', 'indent', 'outdent'],
    ['code', 'codeblock'],
];

/**
 * The `limel-text-editor` component wraps the toast-ui react editor. This editor
 * allows a rich text editing experience with markdown support.
 *
 * @exampleComponent limel-example-text-editor
 */
@Component({
    tag: 'limel-text-editor',
    shadow: true,
    styleUrl: 'text-editor.scss',
})
export class TextEditor {
    /**
     * The editor type to use. Defaults to `wysiwyg`
     */
    @Prop()
    public editType: EditorType = 'wysiwyg';

    /**
     * The placeholder text to display when the editor is empty
     */
    @Prop()
    public placeholder: string = null;

    /**
     * Emitted when the text content of the editor changes
     */
    @Event()
    public change: EventEmitter<{ markdown: string; HTML: string }>;

    /**
     * Emitted when the editor type changes
     */
    @Event()
    public changeMode: EventEmitter<EditorType>;

    @Element()
    private host: HTMLElement;

    private editorRef: RefObject<Editor> = null;

    @Watch('editType')
    public handleEditTypeChange(newValue: EditorType) {
        this.editor.changeMode(newValue);
    }

    @Watch('placeholder')
    public handlePlaceholderChange(newValue: string) {
        this.editor.setPlaceholder(newValue);
    }

    constructor() {
        this.editorRef = createRef();

        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return <div id="editor"></div>;
    }

    public componentDidLoad() {
        const props: EditorProps = {
            initialValue: '',
            initialEditType: this.editType,
            language: LANGUAGE,
            placeholder: this.placeholder,
            previewStyle: PREVIEW_STYLE,
            theme: 'light',
            toolbarItems: TOOLBAR_ITEMS,
            useCommandShortcut: true,
            usageStatistics: false,

            // @ts-ignore
            ref: this.editorRef,

            onChange: this.handleChange,
            onChangeMode: this.handleChangeMode,
        };

        ReactDOM.render(
            createElement(Editor, props),
            this.host.shadowRoot.querySelector('#editor'),
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private handleChange = (_: EditorType): void => {
        this.change.emit({
            markdown: this.editor.getMarkdown(),
            HTML: this.editor.getHTML(),
        });
    };

    private handleChangeMode = (editorType: EditorType): void => {
        this.changeMode.emit(editorType);
    };

    private get editor(): ToastUIEditor {
        return (this.editorRef.current as any).getInstance();
    }
}
