import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { FormComponent } from '../form/form.types';
import { brightnesses, colors, createSwatch, Swatch } from './swatches';
import type { CustomPalette, CustomColorSwatch } from './color-picker.types';

/**
 * @private
 */
@Component({
    tag: 'limel-color-picker-palette',
    shadow: { delegatesFocus: true },
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
     * The placeholder text shown inside the input field,
     * when the field is focused and empty.
     */
    @Prop({ reflect: true })
    public placeholder: string;

    /**
     * Set to `true` if a value is required
     */
    @Prop({ reflect: true })
    public required: boolean;

    /**
     * Set to `true` to indicate that the current value of the input field is
     * invalid.
     */
    @Prop({ reflect: true })
    public invalid = false;

    /**
     * Defines the number of columns in the color swatch grid.
     * If not provided, it will default to the number of colors in the palette.
     */
    @Prop({ reflect: true })
    public columnCount?: number;

    /**
     * Custom color palette to use instead of Lime palette. Internal prop passed from parent.
     */
    @Prop()
    public palette?: CustomPalette;

    /**
     * Emits chosen value to the parent component
     */
    @Event()
    public change: EventEmitter<string>;

    public render() {
        const background = this.value ? { '--background': this.value } : {};

        return [
            <div
                class="color-picker-palette"
                style={{
                    '--color-picker-column-count': `${this.getColumnCount()}`,
                }}
            >
                {this.renderSwatches()}
            </div>,
            <div class="chosen-color-name">
                <limel-input-field
                    label={this.label}
                    helperText={this.helperText}
                    value={this.value}
                    onChange={this.handleChange}
                    required={this.required}
                    invalid={this.invalid}
                    placeholder={this.placeholder}
                />
                <div class="chosen-color-preview" style={background} />
            </div>,
        ];
    }

    private renderSwatches = () => {
        return this.getPalette().map(this.renderSwatchButton);
    };

    private getPalette(): Swatch[] {
        if (this.usesCustomPalette()) {
            return (this.palette || []).map((entry) => {
                const normalized = this.normalizeEntry(entry);
                return {
                    name: normalized.name || normalized.value,
                    value: normalized.value,
                    disabled: normalized.disabled,
                };
            });
        }

        // Order default swatches by brightness first, then by color.
        // This gives a more intuitive CSS grid layout logic, and
        // enables adding the `columnCount` prop.
        const swatches: Swatch[] = [];
        for (const b of brightnesses) {
            for (const color of colors) {
                swatches.push(createSwatch(color, b));
            }
        }
        return swatches;
    }

    private renderSwatchButton = (swatch: Swatch, index: number) => {
        const isSelected = this.value === swatch.value;
        const classList = {
            swatch: true,
            'swatch--selected': isSelected,
            'custom-swatch': this.usesCustomPalette(),
        };

        return (
            <button
                class={classList}
                style={{ '--limel-color-picker-swatch-color': swatch.value }}
                title={swatch.name}
                disabled={swatch.disabled}
                data-index={index}
                key={index}
                onClick={this.handleSwatchClick(swatch.value)}
            />
        );
    };

    private handleChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.change.emit(event.detail);
    };

    private handleSwatchClick = (value: string) => (event: MouseEvent) => {
        event.stopPropagation();
        const newValue = this.value === value ? '' : value;
        this.change.emit(newValue);
    };

    private normalizeEntry(
        entry: string | CustomColorSwatch
    ): CustomColorSwatch {
        if (typeof entry === 'string') {
            return { value: entry };
        }
        return entry;
    }

    private usesCustomPalette(): boolean {
        return this.palette?.length > 0;
    }

    private getColumnCount(): number {
        if (this.columnCount > 0) {
            return this.columnCount;
        }

        // Default palette: fixed 20 columns (one per base color)
        if (!this.usesCustomPalette()) {
            return 20;
        }

        // Custom palette: span all provided swatches unless empty
        const palette = this.getPalette();
        return palette.length > 0 ? palette.length : 1;
    }
}
