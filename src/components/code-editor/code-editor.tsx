import {
    Component,
    h,
    Prop,
    Element,
    Event,
    EventEmitter,
    State,
} from '@stencil/core';
import { ColorScheme, Language } from './code-editor.types';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/matchbrackets';

/**
 * Currently this component support syntax highlighting for `javascript`,
 `json` and `typescript` formats.
 *
 * @exampleComponent limel-example-code-editor
 * @exampleComponent limel-example-code-editor-readonly-with-line-numbers
 */
@Component({
    tag: 'limel-code-editor',
    shadow: true,
    styleUrl: 'code-editor.scss',
})
export class CodeEditor {
    /**
     * The code to be rendered
     */
    @Prop()
    public value: string = '';

    /**
     * The language of the code
     */
    @Prop()
    public language: Language;

    /**
     * Disables editing of the editor content
     */
    @Prop()
    public readonly: boolean = false;

    /**
     * Displays line numbers in the editor
     */
    @Prop()
    public lineNumbers: boolean = false;

    /**
     * Select color scheme for the editor
     */
    @Prop()
    public colorScheme: ColorScheme = 'auto';

    /**
     * Emitted when the code has changed. Will only be emitted when the code
     * area has lost focus
     */
    @Event()
    public change: EventEmitter<string>;

    @Element()
    private host: HTMLLimelCodeEditorElement;

    /**
     * This is only used to trigger a redraw if the
     * `(prefers-color-scheme: dark)` media query is changed
     */
    @State()
    protected random: number;

    private editor: CodeMirror.Editor;
    private observer: ResizeObserver;

    public connectedCallback() {
        this.observer = new ResizeObserver(this.handleResize) as any;
        this.observer.observe(this.host);

        this.darkMode.addEventListener('change', this.handleChangeDarkMode);
    }

    public disconnectedCallback() {
        this.observer.unobserve(this.host);
        this.editor.off('change', this.handleChange);
        this.editor = null;

        this.darkMode.removeEventListener('change', this.handleChangeDarkMode);

        const editorElement = this.host.shadowRoot.querySelector('.editor');
        editorElement?.childNodes.forEach((child) => {
            child.remove();
        });
    }

    public componentDidRender() {
        if (this.editor) {
            return;
        }

        this.editor = this.createEditor();
    }

    private handleChangeDarkMode = () => {
        if (this.colorScheme !== 'auto') {
            return;
        }

        this.forceRedraw();
    };

    private handleChange = () => {
        this.change.emit(this.editor.getValue());
    };

    private handleResize = () => {
        if (!this.editor) {
            return;
        }

        this.editor.refresh();
    };

    private createEditor() {
        const options = this.getOptions();

        const editor = CodeMirror(
            this.host.shadowRoot.querySelector('.editor'),
            options
        );

        editor.on('change', this.handleChange);

        return editor;
    }

    private getOptions(): CodeMirror.EditorConfiguration {
        let mode: string | CodeMirror.ModeSpec<any> = this.language;
        const TAB_SIZE = 4;
        let theme = 'lime light';

        if (this.isDarkMode()) {
            theme = 'lime dark';
        }

        if (this.language === 'json') {
            mode = {
                name: 'application/json',
                json: true,
            };
        } else if (this.language === 'typescript') {
            mode = {
                name: 'application/typescript',
                typescript: true,
            };
        }

        return {
            mode: mode,
            value: this.value,
            theme: theme,
            readOnly: this.readonly,
            tabSize: TAB_SIZE,
            indentUnit: TAB_SIZE,
            lineNumbers: this.lineNumbers,
            styleActiveLine: true,
            matchBrackets: true,
        };
    }

    private isDarkMode(): boolean {
        if (this.colorScheme !== 'auto') {
            return this.colorScheme === 'dark';
        }

        return this.darkMode.matches;
    }

    public render() {
        const classList = {
            editor: true,
            readonly: this.readonly,
            'is-dark-mode': this.isDarkMode(),
            'is-light-mode': !this.isDarkMode(),
        };

        return <div class={classList} />;
    }

    private forceRedraw() {
        this.random = Math.random();
    }

    private get darkMode(): MediaQueryList {
        return matchMedia('(prefers-color-scheme: dark)');
    }
}
