import { Button, LimelButtonGroupCustomEvent } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';
import { AiAvatarMode, AiAvatarVariant } from '../ai-avatar.types';

/**
 * Modes
 *
 * The `mode` property represents what the AI agent is currently doing. The
 * avatar's eyes, mouth, and any looping animations are driven by it. Modes
 * smoothly transition from one to another, so consumers can switch them at
 * any time as the agent's state changes.
 *
 * Note that `mode` replaces the deprecated `isThinking` property. Setting
 * `isThinking` no longer has any visual effect; use `mode="thinking"`
 * instead.
 *
 * Use the variant button-group to confirm that every mode's animations run
 * in every visual style — mode and variant are independent.
 */
@Component({
    tag: 'limel-example-ai-avatar-mode',
    shadow: true,
    styleUrl: 'ai-avatar-basic.scss',
})
export class AiAvatarModesExample {
    @State()
    private mode: AiAvatarMode = 'idle';

    @State()
    private variant: AiAvatarVariant = 'detailed';

    private readonly modes: AiAvatarMode[] = [
        'idle',
        'active',
        'thinking',
        'typing',
        'waiting',
        'working',
    ];

    private readonly variants: AiAvatarVariant[] = [
        'detailed',
        'minimal',
        'solid',
        'outlined',
    ];

    public render() {
        return (
            <Host>
                <div class="avatar-container">
                    <limel-ai-avatar variant={this.variant} mode={this.mode} />
                </div>
                <limel-example-controls>
                    <label>
                        variant
                        <limel-button-group
                            value={this.getVariantButtons()}
                            onChange={this.handleVariantChange}
                        />
                    </label>
                    <label>
                        mode
                        <limel-button-group
                            value={this.getModeButtons()}
                            onChange={this.handleModeChange}
                        />
                    </label>
                </limel-example-controls>
            </Host>
        );
    }

    private getVariantButtons(): Button[] {
        return this.variants.map((variant) => ({
            id: variant,
            title: variant,
            selected: variant === this.variant,
        }));
    }

    private getModeButtons(): Button[] {
        return this.modes.map((mode) => ({
            id: mode,
            title: mode,
            selected: mode === this.mode,
        }));
    }

    private readonly handleVariantChange = (
        event: LimelButtonGroupCustomEvent<Button>
    ) => {
        event.stopPropagation();
        this.variant = event.detail.id as AiAvatarVariant;
    };

    private readonly handleModeChange = (
        event: LimelButtonGroupCustomEvent<Button>
    ) => {
        event.stopPropagation();
        this.mode = event.detail.id as AiAvatarMode;
    };
}
