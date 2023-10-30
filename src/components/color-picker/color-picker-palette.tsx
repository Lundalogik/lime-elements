import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { FormComponent } from '../form/form.types';
import { brightnesses, colors, getColorName, getCssColor } from './swatches';

/**
 * @private
 */
@Component({
    tag: 'limel-color-picker-palette',
    shadow: true,
    styleUrl: 'color-picker-palette.scss',
})
export class Palette implements FormComponent {
    /**
     * Color value that is manually typed by the user
     */
    @Prop({ reflect: true })
    public value: string;

    /**
     * Label of the input field
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Helper text of the input field
     */
    @Prop({ reflect: true })
    public helperText: string;

    /**
     * Set to `true` if a value is required
     */
    @Prop({ reflect: true })
    public required: boolean;

    /**
     * Emits chosen value to the parent component
     */
    @Event()
    public change: EventEmitter<string>;

    public render() {
        const background = this.value ? { '--background': this.value } : {};

        return [
            <div class="color-picker-palette">{this.renderSwatches()}</div>,
            <div class="chosen-color-name">
                <limel-input-field
                    label={this.label}
                    helperText={this.helperText}
                    value={this.value}
                    onChange={this.handleChange}
                    required={this.required}
                />
                <div class="chosen-color-preview" style={background} />
            </div>,
        ];
    }

    private renderSwatches = () => {
        return colors.map((color) => {
            return brightnesses.map(this.renderSwatch(color));
        });
    };

    private renderSwatch = (color: string) => (brightness: string) => {
        const colorName = getColorName(color, brightness);
        const classList = {
            swatch: true,
            [colorName]: true,
            'swatch--selected': this.value === getCssColor(color, brightness),
        };

        return (
            <button
                class={classList}
                onClick={this.handleClick(color, brightness)}
            />
        );
    };

    private handleChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.change.emit(event.detail);
    };

    private handleClick =
        (color: string, brightness: string) => (event: MouseEvent) => {
            const value = getCssColor(color, brightness);
            event.stopPropagation();
            this.change.emit(value);
        };
}
