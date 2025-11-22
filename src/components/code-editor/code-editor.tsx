import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    State,
    Watch,
    h,
} from '@stencil/core';
import CodeMirror, {
    AsyncHintFunction,
    Editor,
    HintFunction,
    HintFunctionResolver,
    Hints,
    ShowHintOptions,
} from 'codemirror';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jinja2/jinja2';
import jslint from 'jsonlint-mod';
import { isPlainObject } from 'lodash-es';
import { ColorScheme, HintOptions, Language } from './code-editor.types';

/**
 * @exampleComponent limel-example-code-editor-autocomplete
 * @exampleComponent limel-example-code-editor
 * @exampleComponent limel-example-code-editor-readonly-with-line-numbers
 * @exampleComponent limel-example-code-editor-fold-lint
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

    @Prop()
    public hint: boolean = false;

    @Prop()
    public hintOptions: HintOptions;

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
            'Ctrl-Space': 'autocomplete',
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

        let hintOptions: ShowHintOptions = undefined;
        // let extraKeys: { 'Ctrl-Space': 'autocomplete' };
        if (this.hint) {
            hintOptions = {
                hint: this.createHintFunction(this.hintOptions),
                completeSingle: false,
                container: this.host.shadowRoot.querySelector('.editor'),
            };
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
            hintOptions: hintOptions,
            // extraKeys: { 'Ctrl-Space': 'autocomplete' },
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
        // eslint-disable-next-line sonarjs/pseudo-random
        this.random = Math.random();
    }

    private get darkMode(): MediaQueryList {
        return matchMedia('(prefers-color-scheme: dark)');
    }

    private createHintFunction(
        options: HintOptions,
    ): HintFunction | AsyncHintFunction | HintFunctionResolver | undefined {
        return (
            editor: Editor,
            showHintOptions: ShowHintOptions,
        ): Promise<Hints | null | undefined> => {
            return this.getHints(editor, showHintOptions, options);
        };
    }

    // (cm: Editor, options: ShowHintOptions): Hints | null | undefined | PromiseLike<Hints | null | undefined>
    private getHints(
        editor: Editor,
        showHintOptions: ShowHintOptions,
        options: HintOptions,
    ): Promise<Hints | null | undefined> {
        if (!options.context) {
            return null;
        }

        // console.info(editor, showHintOptions, options);

        const DELAY = 100;
        const BLOCK_START = '{{';
        const BLOCK_END = '}}';

        return new Promise((accept) => {
            setTimeout(() => {
                const cursor = editor.getCursor();
                const line = editor.getLine(cursor.line);
                const start = cursor.ch;
                const end = cursor.ch;

                let searchStart = start;
                while (
                    searchStart &&
                    /[\w\\.]/.test(line.charAt(searchStart - 1))
                ) {
                    searchStart--;
                }

                let someEnd = end;
                while (
                    someEnd < line.length - 1 &&
                    /\w/.test(line.charAt(someEnd))
                ) {
                    someEnd++;
                }

                const word = line.slice(searchStart, end);
                const theEndWord = line.slice(end, someEnd);
                const wordEndsWithDot = word.endsWith('.');

                console.info('line:', line);
                console.info('word:', word);
                console.info('the end word:', theEndWord);

                let ctx = options.context;

                const wts = word.split('.');
                let i = 0;
                let currentToken = '';
                let currentTokenDelta = 0;
                for (const wt of wts) {
                    console.info(wt);
                    if (wt && wt in ctx && ctx[wt]) {
                        i++;
                        currentToken = wt;
                        currentTokenDelta += currentToken.length;
                        ctx = ctx[wt];
                    } else {
                        break;
                    }
                }

                if (currentToken) {
                    console.info('current token:', currentToken);
                    console.info('current token delta:', currentTokenDelta);
                }

                const tokenDiff = wts.length - i;

                console.info('token diff:', tokenDiff);
                console.info(ctx);

                let list = [];

                if (tokenDiff === 0 && wordEndsWithDot && isPlainObject(ctx)) {
                    console.info('Return all keys of context object');
                    const keys = Object.keys(ctx);
                    console.info(keys);
                    list = keys.map((key) => {
                        return {
                            text: key,
                            displayText: key,
                        };
                    });
                } else if (tokenDiff === 1) {
                    const str = wts[wts.length - 1];
                    console.info(
                        `Return all keys of context object starting with ${str}`,
                    );
                    const keys = Object.keys(ctx);
                    console.info(keys);
                    list = keys
                        .filter((key) => key.startsWith(str))
                        .map((key) => {
                            return {
                                text: key,
                                displayText: key,
                            };
                        });
                } else {
                    console.info('No context match, what do we do?!!!!');
                    // list = [];
                }

                console.info(list);

                if (list.length) {
                    accept({
                        list: list,
                        from: { line: cursor.line, ch: start },
                        to: { line: cursor.line, ch: end },
                    });
                } else {
                    accept(null);
                }
            }, DELAY);
        });
    }
}
