import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import type { ChartItem } from './chart.types';

@Component({
    tag: 'limel-legend',
    shadow: true,
    styleUrl: 'legend.scss',
})
export class Legend {
    @Prop() items: ChartItem[];
    @Prop() hiddenItems: Set<string>;
    @Prop() getItemText: (item: ChartItem) => string = (item) => item.text;

    @Event() legendClick: EventEmitter<ChartItem>;

    private handleLegendClick = (item: ChartItem) => {
        this.legendClick.emit(item);
    };

    render() {
        return (
            <div class="legend">
                <div class="legend-content">
                    {this.items.map((item) => {
                        const isHidden = this.hiddenItems?.has(item.text);
                        return (
                            <div
                                class={{
                                    'legend-item': true,
                                    'legend-item--hidden': isHidden,
                                }}
                                key={item.text}
                                onClick={() => this.handleLegendClick(item)}
                            >
                                <limel-badge
                                    style={{
                                        '--badge-background-color': item.color,
                                        cursor: 'pointer',
                                        opacity: isHidden ? '0.6' : '1',
                                    }}
                                />
                                <span
                                    style={{
                                        opacity: isHidden ? '0.6' : '1',
                                        marginRight: '0.5em',
                                    }}
                                >
                                    {this.getItemText(item)}
                                </span>
                                <span
                                    style={{
                                        opacity: isHidden ? '0.6' : '1',
                                    }}
                                >
                                    {Array.isArray(item.value)
                                        ? `${item.value[0]} — ${item.value[1]}`
                                        : item.value}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
