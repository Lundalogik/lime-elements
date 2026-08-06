import {
    Component,
    h,
    Prop,
    State,
    Event,
    EventEmitter,
    Host,
} from '@stencil/core';
import { FormComponent } from '../form/form.types';
import { ENTER } from '../../util/keycodes';
import { getLiveInputValue } from './get-live-input-value';
import type {
    CustomColorSwatch,
    ManualInputCommit,
} from './color-picker.types';

/**
 * This component enables you to select a swatch from out color palette, simply
 * by clicking on it. You can then copy the css variable name of the chosen color
 * and use it where desired.
 *
 * The color picker can also show you a preview of any valid color name or color value.
 *
 * :::note
 * Make sure to read our [guidelines about usage of colors](#/DesignGuidelines/color-system.md/) from our palette.
 * :::
 *
 * @exampleComponent limel-example-color-picker-basic
 * @exampleComponent limel-example-color-picker-custom-palette
 * @exampleComponent limel-example-color-picker-manual-input
 * @exampleComponent limel-example-color-picker-composite
 */
@Component({
    tag: 'limel-color-picker',
    shadow: true,
    styleUrl: 'color-picker.scss',
})
export class ColorPicker implements FormComponent {
    /**
     * Name or code of the chosen color
     */
    @Prop({ reflect: true })
    public value: string;

    /**
     * The label of the input field
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Helper text of the input field
     */
    @Prop({ reflect: true })
    public helperText: string;

    /**
     * Displayed as tooltips when picker is hovered.
     */
    @Prop({ reflect: true })
    public tooltipLabel: string;

    /**
     * Set to `true` if a value is required
     */
    @Prop({ reflect: true })
    public required: boolean;

    /**
     * Set to `true` to disable the field.
     * Use `disabled` to indicate that the field can normally be interacted
     * with, but is currently disabled. This tells the user that if certain
     * requirements are met, the field may become enabled again.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Set to `true` to make the field read-only.
     * Use `readonly` when the field is only there to present the data it holds,
     * and will not become possible for the current user to edit.
     */
    @Prop({ reflect: true })
    public readonly = false;

    /**
     * Set to `true` to indicate that the current value of the input field is
     * invalid.
     */
    @Prop({ reflect: true })
    public invalid = false;

    /**
     * The placeholder text shown inside the input field,
     * when the field is focused and empty.
     */
    @Prop({ reflect: true })
    public placeholder: string;

    /**
     * Set to `false` to disallow custom color values to be typed into the input field.
     * Setting this to `false` does not completely disable the color picker.
     * It will only allow users to pick from the provided color palette.
     */
    @Prop({ reflect: true })
    public manualInput = true;

    /**
     * Controls when manually typed input emits the `change` event.
     * - `'change'` (default): every change to the typed value emits `change`,
     * as it is typed.
     * - `'enter'`: typed input only updates the displayed value; `change` is
     * emitted when the user presses Enter in the input field.
     *
     * Clicking a swatch always emits `change` immediately, regardless of
     * mode.
     */
    @Prop({ reflect: true })
    public manualInputCommit: ManualInputCommit = 'change';

    /**
     * An array of either color value strings, or objects with a `name` and a `value`,
     * which replaces the default palette. Any valid CSS color format is accepted as value
     * (HEX, RGB/A, HSL, HWB, color-mix(), named colors, etc.).
     */
    @Prop()
    public palette?: Array<string | CustomColorSwatch>;

    /**
     * Defines the number of columns in the color swatch grid.
     * If not provided, it will default to the number of colors in the palette;
     * but stops at a maximum of 25 columns.
     */
    @Prop({ reflect: true })
    public paletteColumnCount?: number;

    /**
     * Emits chosen value to the parent component
     */
    @Event()
    public change: EventEmitter<string>;

    @State()
    private isOpen = false;

    /**
     * The typed-but-not-yet-committed input value in `'enter'` commit mode.
     * `null` when there is no pending edit.
     */
    @State()
    private pendingValue: string | null = null;

    public disconnectedCallback() {
        this.isOpen = false;
    }

    public componentDidRender() {
        if (this.shouldFocus && this.isOpen) {
            this.shouldFocus = false;
            this.contentElement?.focus();
        }
    }

    private contentElement?: HTMLLimelColorPickerPaletteElement;

    private shouldFocus = false;

    public render() {
        return (
            <Host>
                {this.renderTooltip()}
                {this.renderPickerPalette()}
                <limel-input-field
                    label={this.label}
                    helperText={this.helperText}
                    value={this.pendingValue ?? this.value}
                    onChange={this.handleInputChange}
                    onKeyDown={this.handleInputKeyDown}
                    required={this.required}
                    readonly={this.readonly}
                    disabled={this.disabled || !this.manualInput}
                    invalid={this.invalid}
                    placeholder={this.placeholder}
                />
            </Host>
        );
    }
    private renderTooltip = () => {
        if (!this.readonly && this.tooltipLabel) {
            return (
                <limel-tooltip
                    label={this.tooltipLabel}
                    elementId="tooltip-button"
                />
            );
        }
    };

    private renderPickerPalette = () => {
        if (this.readonly) {
            return this.renderPickerTrigger();
        }

        return (
            <limel-popover
                open={this.isOpen}
                openDirection="bottom-start"
                onClose={this.onPopoverClose}
            >
                {this.renderPickerTrigger()}
                <limel-color-picker-palette
                    ref={this.setColorPickerPaletteElement}
                    value={this.value}
                    label={this.label}
                    helperText={this.helperText}
                    placeholder={this.placeholder}
                    invalid={this.invalid}
                    onChange={this.handlePaletteChange}
                    required={this.required}
                    palette={this.palette as any}
                    columnCount={this.paletteColumnCount}
                    manualInput={this.manualInput}
                    manualInputCommit={this.manualInputCommit}
                />
            </limel-popover>
        );
    };

    private renderPickerTrigger = () => {
        const background = this.value ? { '--background': this.value } : {};

        return (
            <button
                slot="trigger"
                style={background}
                role="button"
                onClick={this.openPopover}
                id="tooltip-button"
                disabled={this.readonly || this.disabled}
            />
        );
    };

    private setColorPickerPaletteElement = (
        element: HTMLLimelColorPickerPaletteElement
    ) => {
        this.contentElement = element;
    };

    private openPopover = (event: MouseEvent) => {
        event.stopPropagation();
        this.isOpen = true;

        this.shouldFocus = this.isOpen;
    };

    private onPopoverClose = (event: CustomEvent) => {
        event.stopPropagation();
        this.isOpen = false;
    };

    private handleInputChange = (event: CustomEvent<string>) => {
        event.stopPropagation();

        if (this.manualInputCommit === 'enter') {
            this.pendingValue = event.detail;

            return;
        }

        this.change.emit(event.detail);
    };

    private handleInputKeyDown = (event: KeyboardEvent) => {
        if (this.manualInputCommit !== 'enter' || event.key !== ENTER) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        // The input field debounces its change event, so the live DOM value
        // is preferred over the last received change; otherwise a fast typist
        // pressing Enter would commit a stale value.
        const value =
            getLiveInputValue(event) ?? this.pendingValue ?? this.value;
        this.pendingValue = null;
        this.change.emit(value);
    };

    private handlePaletteChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.pendingValue = null;
        this.change.emit(event.detail);
    };
}
