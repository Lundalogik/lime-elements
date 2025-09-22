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
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jinja2/jinja2';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import jslint from 'jsonlint-mod';

/**
 * @exampleComponent limel-example-code-editor
 * @exampleComponent limel-example-code-editor-readonly-with-line-numbers
 * @exampleComponent limel-example-code-editor-fold-lint
 * @exampleComponent limel-example-code-editor-expandable
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
     * Allows the user to fold code
     */
    @Prop()
    public fold: boolean = false;

    /**
     * Enables linting of JSON content
     */
    @Prop()
    public lint: boolean = false;

    /**
     * Select color scheme for the editor
     */
    @Prop()
    public colorScheme: ColorScheme = 'auto';

    /**
     * Make the editor expandable to fullscreen dialog.
     */
    @Prop()
    public expandable: boolean = false;

    /**
     * Emitted when the code has changed. Will only be emitted when the code
     * area has lost focus
     */
    @Event()
    public change: EventEmitter<string>;

    /**
     * Emitted when user wants to expand the editor
     */
    @Event()
    public expand: EventEmitter<void>;

    @State()
    private dialogOpen: boolean = false;

    private handleClickExpand = () => {
        if (!this.expandable) {
            return;
        }
        this.expand.emit();
        this.dialogOpen = true;
    };

    private handleCloseDialog = () => {
        this.dialogOpen = false;
    };

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
    private cmWrapper: HTMLElement;

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
        for (const child of editorElement?.childNodes) {
            child.remove();
        }
    }

    public componentDidRender() {
        if (!this.editor) {
            this.editor = this.createEditor();
            this.cmWrapper = this.editor.getWrapperElement() as HTMLElement;
        }
        if (!this.expandable) {
            return;
        }
        // Re-parent the existing CodeMirror DOM into dialog or back inline
        if (this.dialogOpen) {
            const dialogHost = this.host.shadowRoot.querySelector(
                '.editor-dialog-host'
            ) as HTMLElement;
            if (dialogHost && this.cmWrapper?.parentElement !== dialogHost) {
                dialogHost.append(this.cmWrapper);
                requestAnimationFrame(() => this.editor.refresh());
            }
        } else {
            const inlineHost = this.host.shadowRoot.querySelector(
                '.editor-inline-host .editor'
            ) as HTMLElement;
            if (inlineHost && this.cmWrapper?.parentElement !== inlineHost) {
                inlineHost.append(this.cmWrapper);
                requestAnimationFrame(() => this.editor.refresh());
            }
        }
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
                const spaces = [codeMirror.getOption('indentUnit') + 1].join(
                    ' '
                );
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
        }

        if (this.fold) {
            gutters.push('CodeMirror-foldgutter');
        }

        return {
            mode: mode,
            value: this.value || '',
            theme: theme,
            readOnly: this.readonly,
            tabSize: TAB_SIZE,
            indentUnit: TAB_SIZE,
            lineNumbers: this.lineNumbers,
            styleActiveLine: true,
            matchBrackets: true,
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
            readonly: this.readonly,
            'is-dark-mode': this.isDarkMode(),
            'is-light-mode': !this.isDarkMode(),
        };
        return [
            this.expandable && !this.dialogOpen && (
                <limel-icon-button
                    class="code-fullscreen-button code-fullscreen-button-focus"
                    label="Expand"
                    icon="expand"
                    onClick={this.handleClickExpand}
                    elevated={true}
                    aria-label="Expand code editor"
                />
            ),
            <div class="editor-inline-host">
                <div class={classList}></div>
            </div>,
            this.expandable && this.dialogOpen && (
                <limel-dialog
                    open
                    fullscreen={true}
                    onClose={this.handleCloseDialog}
                >
                    <limel-icon-button
                        class="code-fullscreen-button"
                        label="Collapse"
                        icon="collapse"
                        aria-label="Collapse code editor"
                        elevated={true}
                        onClick={this.handleCloseDialog}
                    />
                    <div class="editor-dialog-wrapper">
                        <div class="editor-dialog-host"></div>
                    </div>
                </limel-dialog>
            ),
        ];
    }

    private forceRedraw() {
        // eslint-disable-next-line sonarjs/pseudo-random
        this.random = Math.random();
    }

    private get darkMode(): MediaQueryList {
        return matchMedia('(prefers-color-scheme: dark)');
    }
}
