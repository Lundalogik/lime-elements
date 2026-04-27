import { Component, h, Host, Prop } from '@stencil/core';
import { normalizeHotkeyString } from '../../util/hotkeys';

/**
 * This component is used internally by `limel-tooltip`.
 *
 * @private
 */
@Component({
    tag: 'limel-tooltip-content',
    shadow: true,
    styleUrl: 'tooltip-content.scss',
})
export class TooltipContent {
    /**
     * Read more in tooltip.tsx
     */
    @Prop({ reflect: true })
    label!: string;

    /**
     * Read more in tooltip.tsx
     */
    @Prop({ reflect: true })
    helperLabel?: string;

    /**
     * Read more in tooltip.tsx
     */
    @Prop({ reflect: true })
    maxlength?: number;

    /**
     * Read more in tooltip.tsx
     */
    @Prop({ reflect: true })
    hotkey?: string;

    public render() {
        let isLabelsTextLong = false;
        if (this.helperLabel && this.maxlength) {
            isLabelsTextLong =
                this.label.length + this.helperLabel.length > this.maxlength;
        }

        const style = this.maxlength
            ? { '--tooltip-max-width-of-text': `${this.maxlength}ch` }
            : undefined;

        return (
            <Host
                class={{ 'has-column-layout': isLabelsTextLong }}
                style={style}
            >
                <div class="label">{this.label}</div>
                {this.renderHelperLabel()}
                {this.renderHotkey()}
            </Host>
        );
    }

    private renderHelperLabel() {
        if (!this.helperLabel) {
            return;
        }

        return <div class="helper-label">{this.helperLabel}</div>;
    }

    private renderHotkey() {
        if (!this.hotkey) {
            return;
        }

        const normalized = normalizeHotkeyString(this.hotkey);
        if (!normalized) {
            return;
        }

        return <limel-hotkey value={normalized} />;
    }
}
