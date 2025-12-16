import {
    Component,
    h,
    Prop,
    Element,
    Event,
    EventEmitter,
    State,
    Watch,
} from '@stencil/core';
import { ColorScheme, Language } from './code-editor.types';
import CodeMirror from 'codemirror';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jinja2/jinja2';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/xml-fold';
import jslint from 'jsonlint-mod';

/**
 * @exampleComponent limel-example-code-editor
 * @exampleComponent limel-example-code-editor-readonly-with-line-numbers
 * @exampleComponent limel-example-code-editor-fold-lint-wrap
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
     * Set to `true` to make the editor read-only.
     * Use `readonly` when the editor is only there to present the data it holds,
     * and will not become possible for the current user to edit.
     */
    @Prop({ reflect: true })
    public readonly = false;

    /**
     * Set to `true` to disable the editor.
     * Use `disabled` to indicate that the editor can normally be interacted
     * with, but is currently disabled. This tells the user that if certain
     * requirements are met, the editor may become enabled again.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Displays line numbers in the editor
     */
    @Prop({ reflect: true })
    public lineNumbers = false;

    /**
     * Wraps long lines instead of showing horizontal scrollbar
     */
    @Prop({ reflect: true })
    public lineWrapping = false;

    /**
     * Allows the user to fold code
     */
    @Prop({ reflect: true })
    public fold = false;

    /**
     * Enables linting of JSON content
     */
    @Prop({ reflect: true })
    public lint = false;

    /**
     * Select color scheme for the editor
     */
    @Prop({ reflect: true })
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
        this.editor?.off('change', this.handleChange);
        this.editor = null;

        this.darkMode.removeEventListener('change', this.handleChangeDarkMode);

        const editorElement = this.host.shadowRoot.querySelector('.editor');
        // eslint-disable-next-line no-unsafe-optional-chaining
        for (const child of editorElement?.childNodes) {
            child.remove();
        }
    }

    public componentDidRender() {
        if (this.editor) {
            return;
        }

        this.editor = this.createEditor();
    }

    @Watch('value')
    protected watchValue(newValue: string) {
        if (!this.editor) {
            return;
        }

        const currentValue = this.editor.getValue();
        if (newValue === currentValue) {
            // Circuit breaker for when the change comes from the editor itself
            // The caret position will be reset without this
            return;
        }

        this.editor.getDoc().setValue(newValue || '');
    }

    @Watch('disabled')
    protected watchDisabled() {
        this.updateEditorReadOnlyState();
        this.updateInputFieldAccessibilityAttributes();
    }

    @Watch('readonly')
    protected watchReadonly() {
        this.updateEditorReadOnlyState();
        this.updateInputFieldAccessibilityAttributes();
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

        // Replace tab with spaces and use the actual indent setting for
        // the space count
        editor.setOption('extraKeys', {
            Tab: (codeMirror) => {
                const spaces = ' '.repeat(codeMirror.getOption('indentUnit'));
                codeMirror.replaceSelection(spaces);
            },
        });

        return editor;
    }

    private getOptions(): CodeMirror.EditorConfiguration {
        let mode: string | CodeMirror.ModeSpec<any> = this.language;
        const TAB_SIZE = 4;
        let theme = 'lime light';
        const gutters = [];

        if (this.isDarkMode()) {
            theme = 'lime dark';
        }

        if (this.language === 'json') {
            mode = {
                name: 'application/json',
                json: true,
            };
            if (this.lint) {
                gutters.push('CodeMirror-lint-markers');
                if (!('jsonlint' in window)) {
                    window['jsonlint'] = jslint;
                }
            }
        } else if (this.language === 'typescript') {
            mode = {
                name: 'application/typescript',
                typescript: true,
            };
        } else if (this.language === 'html') {
            mode = 'htmlmixed';
        }

        if (this.fold) {
            gutters.push('CodeMirror-foldgutter');
        }

        return {
            mode: mode,
            value: this.value || '',
            theme: theme,
            readOnly: this.getReadOnlyOption(),
            tabSize: TAB_SIZE,
            indentUnit: TAB_SIZE,
            lineNumbers: this.lineNumbers,
            lineWrapping: this.lineWrapping,
            styleActiveLine: true,
            matchBrackets: true,
            matchTags: { bothTags: true },
            lint: this.lint,
            foldGutter: this.fold,
            gutters: gutters,
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
            readonly: this.readonly || this.disabled,
            disabled: this.disabled,
            'is-dark-mode': this.isDarkMode(),
            'is-light-mode': !this.isDarkMode(),
        };

        return <div class={classList} />;
    }

    private forceRedraw() {
        // eslint-disable-next-line sonarjs/pseudo-random
        this.random = Math.random();
    }

    private get darkMode(): MediaQueryList {
        return matchMedia('(prefers-color-scheme: dark)');
    }

    private updateEditorReadOnlyState() {
        if (!this.editor) {
            return;
        }

        this.editor.setOption('readOnly', this.getReadOnlyOption());
    }

    private getReadOnlyOption(): boolean | 'nocursor' {
        if (this.disabled) {
            return 'nocursor';
        }

        return this.readonly;
    }

    private updateInputFieldAccessibilityAttributes() {
        if (!this.editor) {
            return;
        }

        const inputField = this.editor.getInputField();
        if (!inputField) {
            return;
        }

        if (this.disabled) {
            inputField.setAttribute('aria-disabled', 'true');
        } else {
            inputField.removeAttribute('aria-disabled');
        }

        if (this.readonly || this.disabled) {
            inputField.setAttribute('aria-readonly', 'true');
        } else {
            inputField.removeAttribute('aria-readonly');
        }
    }
}
