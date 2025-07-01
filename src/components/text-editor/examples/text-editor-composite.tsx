import {
    EditorUiType,
    LimelSelectCustomEvent,
    Option,
} from '@limetech/lime-elements';
import { Component, h, Host, State, Watch } from '@stencil/core';

/**
 * Composite example
 */
@Component({
    tag: 'limel-example-text-editor-composite',
    shadow: true,
})
export class TextEditorCompositeExample {
    @State()
    private value: string = 'Hello, world!';

    @State()
    private readonly = false;

    @State()
    private invalid = false;

    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private allowResize = false;

    @State()
    private label: string;

    @State()
    private placeholder: string;

    @State()
    private helperText: string;

    @State()
    private selectedUi: Option<EditorUiType> = {
        text: 'standard',
        value: 'standard',
    };

    private readonly availableUis: Array<Option<EditorUiType>> = [
        { text: 'standard', value: 'standard' },
        { text: 'minimal', value: 'minimal' },
        { text: 'no-toolbar', value: 'no-toolbar' },
    ];

    public render() {
        return (
            <Host>
                <limel-text-editor
                    label={this.label}
                    helperText={this.helperText}
                    value={this.value}
                    onChange={this.handleChange}
                    readonly={this.readonly}
                    required={this.required}
                    disabled={this.disabled}
                    invalid={this.invalid}
                    placeholder={this.placeholder}
                    allowResize={this.allowResize}
                    ui={this.selectedUi.value}
                />
                <limel-example-controls>
                    <limel-checkbox
                        checked={this.readonly}
                        label="Readonly"
                        onChange={this.setReadonly}
                    />
                    <limel-checkbox
                        checked={this.invalid}
                        label="Invalid"
                        onChange={this.setInvalid}
                    />
                    <limel-checkbox
                        checked={this.required}
                        label="Required"
                        onChange={this.setRequired}
                    />
                    <limel-checkbox
                        checked={this.disabled}
                        label="Disabled"
                        onChange={this.setDisabled}
                    />
                    <limel-checkbox
                        checked={this.allowResize}
                        label="Allow resize"
                        onChange={this.setAllowResize}
                    />
                    <limel-select
                        label="ui"
                        options={this.availableUis}
                        value={this.selectedUi}
                        onChange={this.handleNewSelection}
                    />
                    <hr
                        style={{
                            'grid-column': '1/-1',
                        }}
                    />
                    <limel-input-field
                        label="label"
                        value={this.label}
                        onChange={this.handleLabelChange}
                    />
                    <limel-input-field
                        label="helperText"
                        value={this.helperText}
                        onChange={this.handleHelperTextChange}
                    />
                    <limel-input-field
                        label="placeholder"
                        value={this.placeholder}
                        onChange={this.handlePlaceholderChange}
                    />
                </limel-example-controls>
                <limel-example-value value={this.value} />
            </Host>
        );
    }

    @Watch('required')
    @Watch('value')
    protected checkValidity() {
        this.invalid = this.required && !this.value;
    }

    private readonly setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };

    private readonly setRequired = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.required = event.detail;
    };

    private readonly setInvalid = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.invalid = event.detail;
    };

    private readonly setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private readonly setAllowResize = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.allowResize = event.detail;
    };

    private readonly handleLabelChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.label = event.detail;
    };

    private readonly handleHelperTextChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.helperText = event.detail;
    };

    private readonly handlePlaceholderChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.placeholder = event.detail;
    };

    private readonly handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private readonly handleNewSelection = (
        event: LimelSelectCustomEvent<Option<EditorUiType>>
    ) => {
        this.selectedUi = event.detail;
    };
}
