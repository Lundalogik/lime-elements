import { Button, LimelButtonGroupCustomEvent } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';
import { AiAvatarMode, AiAvatarVariant } from '../ai-avatar.types';

/**
 * Branded colors
 *
 * The avatar exposes six CSS custom properties that map to the colors with
 * the highest visual impact — each one is reused across many gradients, so
 * overriding it ripples through the whole artwork. This example retints
 * them with Lime Technology's brand colors; you can override as few or as
 * many as you want.
 *
 * Available properties:
 * - `--ai-avatar-primary-color`
 * - `--ai-avatar-accent-color`
 * - `--ai-avatar-orb-edge-color`
 * - `--ai-avatar-orb-inner-highlight-color`
 * - `--ai-avatar-hover-ring-accent-color`
 * - `--ai-avatar-hover-glow-color`
 *
 * Plus an additional property for the facial features:
 * - `--ai-avatar-stars-eyes-mouth-color`
 *
 * This property can be used to set the color of the avatar's facial features
 * (the two star-shaped eyes and the mouth). For the `minimal` variant,
 * these facial features default to `--contrast-100` when the color is defined.
 * This means, in Lime's apps which are using Lime Elements the facial features
 * of the `minimal` variant will render darker, in dark mode.
 * In other places, they will be simply rendered white.
 *
 * :::tip
 * The `solid` and `outlined` variants have all their colors set to
 * `currentColor`, which means they can be easily controlled by setting the
 * `color` property on the avatar itself or any of its ancestors. For the
 * `outlined` variant the facial features follow `currentColor` too; for
 * `solid`, the facial features still fall back to
 * `--ai-avatar-stars-eyes-mouth-color`.
 * :::
 *
 * :::note
 * Some of the internal elements for the avatar may have `mix-blend-mode` styles.
 * These styles can affect how the colors interact with each other and the background,
 * to generate a richer visual experience.
 * Therefore, the colors you choose may appear slightly different than expected.
 * :::
 *
 * Switch between modes and variants to see how the recoloring carries
 * through every state — including the rotating inner highlight in
 * `thinking` mode and the simpler gradient of the `minimal` variant.
 */
@Component({
    tag: 'limel-example-ai-avatar-branded',
    shadow: true,
    styleUrl: 'ai-avatar-branded.scss',
})
export class AiAvatarBrandedExample {
    @State()
    private mode: AiAvatarMode = 'idle';

    @State()
    private backgroundColor: string = '';

    @State()
    private color: string = '';

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

    private readonly palettes: string[] = [
        'default-colors',
        'lime-pink',
        'lime-orange',
        'lime-connect',
    ];

    public render() {
        return (
            <Host>
                {this.palettes.map((palette) => (
                    <div
                        class={`variants ${palette}`}
                        style={{
                            backgroundColor: this.backgroundColor,
                            color: this.color,
                        }}
                    >
                        {this.variants.map((variant) => (
                            <div>
                                <limel-ai-avatar
                                    variant={variant}
                                    mode={this.mode}
                                />
                                <code>{variant}</code>
                            </div>
                        ))}
                    </div>
                ))}
                <limel-example-controls>
                    <label>
                        mode
                        <limel-button-group
                            value={this.getModeButtons()}
                            onChange={this.handleModeChange}
                        />
                    </label>
                    <limel-color-picker
                        label="Background color"
                        value={this.backgroundColor}
                        onChange={this.handleBackgroundColorChange}
                    />
                    <limel-color-picker
                        label="Color"
                        value={this.color}
                        onChange={this.handleColorChange}
                        helperText="Affects the `solid` and `outlined` variants, and the facial features of the `minimal` variant"
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private getModeButtons(): Button[] {
        return this.modes.map((mode) => ({
            id: mode,
            title: mode,
            selected: mode === this.mode,
        }));
    }

    private readonly handleModeChange = (
        event: LimelButtonGroupCustomEvent<Button>
    ) => {
        event.stopPropagation();
        this.mode = event.detail.id as AiAvatarMode;
    };

    private readonly handleBackgroundColorChange = (
        event: CustomEvent<string>
    ) => {
        event.stopPropagation();
        this.backgroundColor = event.detail;
    };

    private readonly handleColorChange = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.color = event.detail;
    };
}
