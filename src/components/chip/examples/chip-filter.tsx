import { Component, State, h } from '@stencil/core';

/**
 * Chip as filter
 * Chips are great candidates to visualize active filters.
 * However, as chips are used for other purposes as well,
 * we need to make sure that the user understands that the chip is a filter,
 * just by the look of it.
 *
 * By setting the `type` to `filter`, the chip will be rendered with a distinct style
 * suitable for visualizing filters.
 *
 * :::note
 * In this mode, clicking on the chip should also toggle its `selected` state.
 * :::
 */
@Component({
    tag: 'limel-example-chip-filter',
    shadow: true,
    styleUrl: 'chip-badge.scss',
})
export class ChipFilterExample {
    @State()
    private selected: { [id: string]: boolean } = {};

    public render() {
        return [
            <limel-chip
                id="1"
                text="photos"
                icon="image_file"
                type="filter"
                onClick={() => this.handleClick('1')}
                selected={this.selected['1']}
            />,
            <limel-chip
                id="2"
                text="videos"
                icon="video_file"
                type="filter"
                onClick={() => this.handleClick('2')}
                selected={this.selected['2']}
            />,
            <limel-chip
                id="2"
                text="audios"
                icon="audio_file"
                type="filter"
                onClick={() => this.handleClick('3')}
                selected={this.selected['3']}
            />,
        ];
    }

    private handleClick = (id: string) => {
        this.selected = {
            ...this.selected,
            [id]: !this.selected[id],
        };
    };
}
