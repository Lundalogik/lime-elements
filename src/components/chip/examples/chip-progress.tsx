import { Component, h, State } from '@stencil/core';

/**
 * Displaying a progress bar
 * By defining a numeric `progress` (from `0` to `100`),
 * you can display a progress bar on the chip
 * to inform the user about an ongoing progress and also
 * visualize the amount of progress that has been made so far.
 *
 * :::important
 * 1. Do not use `loading={true}` and `progress` at the same time.
 * 2. When the progress has completed, unset the `progress` property!
 * :::
 */
@Component({
    tag: 'limel-example-chip-progress',
    shadow: true,
    styleUrl: 'chip-progress.scss',
})
export class ChipProgressExample {
    @State()
    private progress = 60.4325;

    private sliderMinValue = 0;
    private sliderMaxValue = 100;

    public render() {
        return [
            <limel-chip
                text="resume.pdf"
                icon={{
                    name: 'PDF_2',
                    color: 'rgb(var(--color-red-default))',
                }}
                progress={this.progress}
                removable={true}
            />,
            <limel-chip
                text="my-cv.pdf"
                icon="PDF_2"
                progress={this.progress}
                type="filter"
            />,
            <limel-chip
                class="custom-progress-color"
                text="I've my own progress color"
                progress={this.progress}
                badge="nice"
            />,
            <limel-example-controls>
                <limel-slider
                    label="Progress value"
                    unit=" %"
                    value={this.progress}
                    valuemax={this.sliderMaxValue}
                    valuemin={this.sliderMinValue}
                    onChange={this.handleChange}
                />
            </limel-example-controls>,
        ];
    }

    private handleChange = (event: CustomEvent<number>) => {
        this.progress = event.detail;
    };
}
