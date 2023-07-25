/* eslint-disable multiline-ternary */
import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { FormComponent } from '../form/form.types';

/**
 * This component enables you to select a swatch from out color palette, simply
 * by clicking on it. You can then copy the css variable name of the chosen color
 * and use it where desired.
 *
 * The color picker can also show you a preview of any valid color name or color value.
 *
 * :::note
 * Make sure to read our [guidelines about usage of colors](/#/DesignGuidelines/color-system.md/) from our palette.
 * :::
 * @exampleComponent limel-example-color-picker
 * @exampleComponent limel-example-color-picker-readonly
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
     * Set to `true` if a value is readonly. This makes the component un-interactive.
     */
    @Prop({ reflect: true })
    public readonly: boolean;

    /**
     * Emits chosen value to the parent component
     */
    @Event()
    public change: EventEmitter<string>;

    @State()
    private isOpen = false;

    public render() {
        return [
            this.renderTooltip(),
            <div class="color-picker">
                {this.renderPickerPalette()}

                <limel-input-field
                    label={this.label}
                    helperText={this.helperText}
                    value={this.value}
                    onChange={this.handleChange}
                    required={this.required}
                    readonly={this.readonly}
                    class="chosen-color-input"
                />
            </div>,
        ];
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
                    value={this.value}
                    label={this.label}
                    helperText={this.helperText}
                    onChange={this.handleChange}
                    required={this.required}
                />
            </limel-popover>
        );
    };

    private renderPickerTrigger = () => {
        const background = this.value ? { '--background': this.value } : {};

        return (
            <button
                class="picker-trigger"
                slot="trigger"
                style={background}
                role="button"
                onClick={this.openPopover}
                id="tooltip-button"
            />
        );
    };

    private openPopover = (event: MouseEvent) => {
        event.stopPropagation();
        this.isOpen = true;
    };

    private onPopoverClose = (event: CustomEvent) => {
        event.stopPropagation();
        this.isOpen = false;
    };

    private handleChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.change.emit(event.detail);
    };
}
