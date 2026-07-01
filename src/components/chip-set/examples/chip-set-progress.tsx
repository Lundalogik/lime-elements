import { Chip } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Progress on a chip
 *
 * A chip in the set can show a determinate progress bar by setting `progress`
 * — a number between `0` and `100` — on the chip. This is useful for
 * reflecting an ongoing process on a specific chip, such as an upload.
 *
 * For an indeterminate indicator, set `loading` on the chip instead.
 */
@Component({
    tag: 'limel-example-chip-set-progress',
    shadow: true,
})
export class ChipSetProgressExample {
    @State()
    private progress = 40;

    public render() {
        const chips: Chip[] = [
            {
                id: 1,
                text: 'document.pdf',
                removable: true,
                progress: this.progress,
            },
        ];

        return (
            <Host>
                <limel-chip-set type="input" value={chips} />
                <limel-example-controls
                    style={{
                        '--example-controls-column-layout': 'auto-fit',
                    }}
                >
                    <limel-slider
                        label="Progress"
                        value={this.progress}
                        valuemin={0}
                        valuemax={100}
                        unit="%"
                        onChange={this.setProgress}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private setProgress = (event: CustomEvent<number>) => {
        event.stopPropagation();
        this.progress = event.detail;
    };
}
