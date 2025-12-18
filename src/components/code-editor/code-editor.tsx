import {
    Component,
    h,
    Prop,
    Element,
    Event,
    EventEmitter,
    State,
    Watch,
    Host,
} from '@stencil/core';
import { createRandomString } from '../../util/random-string';
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
import translate from '../../global/translations';
import { Languages } from '../date-picker/date.types';

type CopyState = 'idle' | 'success' | 'failed';

/**
 * @exampleComponent limel-example-code-editor
 * @exampleComponent limel-example-code-editor-readonly-with-line-numbers
 * @exampleComponent limel-example-code-editor-fold-lint-wrap
 * @exampleComponent limel-example-code-editor-composite
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
     * Set to `true` to indicate that the current value of the input editor is
     * invalid.
     */
    @Prop({ reflect: true })
    public invalid = false;

    /**
     * Set to `true` to indicate that the field is required.
     */
    @Prop({ reflect: true })
    public required = false;

    /**
     * The input label.
     */
    @Prop({ reflect: true })
    public label?: string;

    /**
     * Optional helper text to display below the input field when it has focus
     */
    @Prop({ reflect: true })
    public helperText?: string;

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
     * Defines the language for translations.
     * Will translate the translatable strings on the components.
     */
    @Prop({ reflect: true })
    public translationLanguage: Languages = 'en';

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

    @State()
    private wasCopied: CopyState = 'idle';

    private editor: CodeMirror.Editor;
    private observer: ResizeObserver;
    private labelId: string;
    private helperTextId: string;

    public constructor() {
        this.labelId = createRandomString();
        this.helperTextId = createRandomString();
    }

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
        this.updateInputFieldAccessibilityAttributes();
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

    @Watch('invalid')
    protected watchInvalid() {
        this.updateInputFieldAccessibilityAttributes();
    }

    @Watch('required')
    protected watchRequired() {
        this.updateInputFieldAccessibilityAttributes();
    }

    @Watch('helperText')
    protected watchHelperText() {
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

        return (
            <Host>
                {this.renderCopyButton()}
                <limel-notched-outline
                    labelId={this.labelId}
                    label={this.label}
                    required={this.required}
                    invalid={this.invalid}
                    disabled={this.disabled}
                    readonly={this.readonly}
                    hasValue={!!this.value}
                    hasFloatingLabel={true}
                >
                    <div slot="content" class={classList} />
                </limel-notched-outline>
                {this.renderHelperLine()}
            </Host>
        );
    }

    private renderHelperLine = () => {
        if (!this.helperText) {
            return;
        }

        return (
            <limel-helper-line
                helperText={this.helperText}
                helperTextId={this.helperTextId}
                invalid={this.invalid}
            />
        );
    };

    private forceRedraw() {
        // eslint-disable-next-line sonarjs/pseudo-random
        this.random = Math.random();
    }

    private renderCopyButton() {
        const hasContent = !!(this.editor?.getValue() || this.value);

        if (!hasContent || this.disabled) {
            return;
        }

        return (
            <button
                class="copy-button"
                onClick={this.copyCode}
                type="button"
                aria-live="polite"
                aria-atomic="true"
                aria-label={this.getButtonAriaLabel()}
            >
                {this.getButtonText()}
            </button>
        );
    }

    private copyCode = async () => {
        // Prefer the live editor content; fall back to the prop value
        const text = this.editor?.getValue() ?? this.value ?? '';
        try {
            await navigator.clipboard.writeText(text);
            this.wasCopied = 'success';
            setTimeout(() => {
                this.wasCopied = 'idle';
            }, 2000);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.wasCopied = 'failed';
        }
    };

    private getButtonText() {
        if (this.wasCopied === 'success') {
            return translate.get(
                'code-editor.copied',
                this.translationLanguage
            );
        }
        if (this.wasCopied === 'failed') {
            return translate.get(
                'code-editor.copy-failed',
                this.translationLanguage
            );
        }
        return translate.get('code-editor.copy', this.translationLanguage);
    }

    private getButtonAriaLabel() {
        const label =
            this.label ||
            translate.get('code-editor', this.translationLanguage);

        const translationKeys = {
            success: 'code-editor.copied-aria-label',
            failed: 'code-editor.copy-failed-aria-label',
            idle: 'code-editor.copy-aria-label',
        };

        const key = translationKeys[this.wasCopied];

        return translate.get(key, this.translationLanguage, { label });
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

        inputField.id = this.labelId;

        if (this.helperText) {
            inputField.setAttribute('aria-describedby', this.helperTextId);
            inputField.setAttribute('aria-controls', this.helperTextId);
        } else {
            inputField.removeAttribute('aria-describedby');
            inputField.removeAttribute('aria-controls');
        }

        if (this.required) {
            inputField.setAttribute('aria-required', 'true');
        } else {
            inputField.removeAttribute('aria-required');
        }

        if (this.invalid) {
            inputField.setAttribute('aria-invalid', 'true');
        } else {
            inputField.removeAttribute('aria-invalid');
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
