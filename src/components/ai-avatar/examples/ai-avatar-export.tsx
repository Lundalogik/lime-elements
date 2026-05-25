import { Button, LimelButtonGroupCustomEvent } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';
import { AiAvatarMode, AiAvatarVariant } from '../ai-avatar.types';

/**
 * Use as a standalone SVG
 * Inside this component, there is a SVG file. The artwork and animations
 * are all implemented inside that single SVG file using CSS-driven states.
 * These are simply applied
 * Where you show the AI avatar, using the web-component `limel-ai-avatar`,
 * you can easily control the avatar's `mode` and `variant` using its props.
 *
 * But you can also use the avatar as an icon using one of the following
 * approaches:
 *
 * ### Use as `limel-icon`
 * If you're building a Lime Technologies application (Lime CRM, Lime Go,
 * …), `@lundalogik/lime-icons8` already ships the latest version of the
 * avatar SVG as `-lime-ai-avatar`. You don't need to download anything
 * from this page. Simply render the avatar with `limel-icon` and drive
 * variant/mode through its `svgClass` prop:
 *
 * ```html
 * <limel-icon
 *     name="-lime-ai-avatar"
 *     svg-class="avatar mode-thinking variant-solid"
 * ></limel-icon>
 * ```
 *
 * `limel-icon`'s `svgClass` forwards a class string onto the inner
 * `<svg>`, so you get the same class-based controls described below
 * without having to inline the file yourself. The available classes
 * and recoloring options are identical to the inlined-SVG path.
 *
 * ### Download the SVG and inline it
 * You can also download a self-contained `.svg` file with every CSS rule
 * for every variant and mode, all animations. Nothing outside the file
 * is needed to render any of the supported visual states, except setting
 * the correct class names that change the variants or modes.
 *
 * :::important
 * To switch variant/mode after export, the SVG has to live in the same
 * document as the host page — either **inlined directly** in the HTML
 * (`<svg>…</svg>` written into the markup) or rendered through a
 * component that forwards a class onto the inner `<svg>` (such as
 * `limel-icon` with its `svgClass` prop). Referencing the file via
 * `<img src="…">` or `background-image: url(…)` loads the SVG in its
 * own document, isolated from the host page — the host's CSS can't
 * reach the SVG's DOM to set a class, and `currentColor` doesn't
 * inherit from the surrounding page. Animations still play in those
 * embed modes, but the visual state is locked to whatever was active
 * when the file was saved.
 * :::
 *
 * Once inlined, switch state by setting the class on the root `<svg>`:
 *
 * ```html
 * <svg class="avatar mode-thinking variant-solid">…</svg>
 * ```
 *
 * Available classes:
 * - `variant-detailed | variant-minimal | variant-solid | variant-outlined`
 * - `mode-idle | mode-active | mode-thinking | mode-typing | mode-waiting | mode-working`
 *
 * :::note
 * If you first set a `variant` or `mode` and then download the SVG file here,
 * the downloaded file will reflect the current state of the avatar.
 * But all animations and styles for every state are still included in the file,
 * so you can switch to any other state by changing the class, even after
 * downloading.
 * :::
 */
@Component({
    tag: 'limel-example-ai-avatar-export',
    shadow: true,
})
export class AiAvatarExportExample {
    @State()
    private mode: AiAvatarMode = 'idle';

    @State()
    private variant: AiAvatarVariant = 'minimal';

    private avatarRef?: HTMLLimelAiAvatarElement;

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
                <limel-ai-avatar
                    ref={(el: HTMLLimelAiAvatarElement) =>
                        (this.avatarRef = el)
                    }
                    variant={this.variant}
                    mode={this.mode}
                />
                <limel-example-controls
                    style={{
                        '--example-controls-max-columns-width': '100%',
                        gap: '1rem',
                        backgroundColor: 'rgb(var(--kompendium-contrast-800))',
                    }}
                >
                    <label>
                        variant
                        <limel-button-group
                            value={this.getButtons(this.variants, this.variant)}
                            onChange={this.handleVariantChange}
                        />
                    </label>
                    <label>
                        mode
                        <limel-button-group
                            value={this.getButtons(this.modes, this.mode)}
                            onChange={this.handleModeChange}
                        />
                    </label>
                    <limel-button
                        label="Download standalone SVG"
                        primary={true}
                        onClick={this.handleDownload}
                        icon="download_2"
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private getButtons<T extends string>(
        values: readonly T[],
        selected: T
    ): Button[] {
        return values.map((value) => ({
            id: value,
            title: value,
            selected: value === selected,
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

    private readonly handleDownload = () => {
        if (!this.avatarRef) {
            return;
        }
        const svgString = buildStandaloneSvg(this.avatarRef);
        const blob = new Blob([svgString], {
            type: 'image/svg+xml;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `ai-avatar-${this.variant}-${this.mode}.svg`;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
    };
}

// Build a fully self-contained SVG string from a live `limel-ai-avatar`.
// The result carries: every CSS rule for every variant + mode, all
// `@keyframes`, and a `svg { --lime-brand-color-…: … }` block resolving
// the externally-themed variables. Adding a class to the root `<svg>`
// switches state.
const buildStandaloneSvg = (avatar: HTMLLimelAiAvatarElement): string => {
    const sourceSvg = avatar.shadowRoot
        ?.querySelector('svg')
        ?.cloneNode(true) as SVGSVGElement | undefined;
    if (!sourceSvg) {
        return '';
    }

    const componentCss = collectShadowCss(avatar);
    const externalVarsBlock = resolveExternalVars(componentCss, avatar);
    const cleanedCss = stripHostRules(componentCss);

    const styleEl = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'style'
    );
    styleEl.textContent = `${externalVarsBlock}\n\n${cleanedCss}`;
    sourceSvg.insertBefore(styleEl, sourceSvg.firstChild);

    sourceSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    // The in-component SVG is `aria-hidden` because its semantic label
    // lives on the host element. Standalone, we want the SVG to expose
    // itself directly — and to do that meaningfully, copy the host's
    // accessible name onto the cloned SVG so screen readers announce
    // something more useful than a generic graphic.
    sourceSvg.removeAttribute('aria-hidden');
    sourceSvg.setAttribute('role', 'img');
    const accessibleName = avatar.getAttribute('aria-label');
    if (accessibleName) {
        sourceSvg.setAttribute('aria-label', accessibleName);
    }

    return new XMLSerializer().serializeToString(sourceSvg);
};

const collectShadowCss = (avatar: HTMLLimelAiAvatarElement): string => {
    const root = avatar.shadowRoot;
    if (!root) {
        return '';
    }

    // Stencil's globally-adopted stylesheets (portal, MDC theme, etc.) also
    // end up in the shadow root and would otherwise be dumped into the
    // exported SVG. Keep only sheets that author rules against the
    // ai-avatar host — that's the component's own SCSS.
    const sheets = [
        ...(root.adoptedStyleSheets ?? []),
        ...root.styleSheets,
    ].filter((sheet) => {
        try {
            return [...sheet.cssRules].some((rule) =>
                rule.cssText.includes(':host(limel-ai-avatar)')
            );
        } catch (error) {
            // `cssRules` access throws `SecurityError` on cross-origin
            // sheets. The ai-avatar's own sheet is same-origin, so any
            // unreadable sheet is one we wouldn't include anyway — but
            // warn so a developer who *is* missing styles can trace it.
            console.warn(
                `limel-example-ai-avatar-export: could not read cssRules for sheet ${sheet.href ?? '(no href)'}; skipping.`,
                error
            );

            return false;
        }
    });

    return sheets
        .flatMap((sheet) => {
            try {
                return [...sheet.cssRules];
            } catch (error) {
                console.warn(
                    `limel-example-ai-avatar-export: could not read cssRules for sheet ${sheet.href ?? '(no href)'} during extraction; exported SVG will be missing rules from this sheet.`,
                    error
                );

                return [];
            }
        })
        .map((rule) => rule.cssText)
        .join('\n');
};

const resolveExternalVars = (
    css: string,
    avatar: HTMLLimelAiAvatarElement
): string => {
    const matches = [...css.matchAll(/var\(\s*(--[\w-]+)/g)];
    const names = [...new Set(matches.map((m) => m[1]))];
    const external = names.filter(
        (name) =>
            !name.startsWith('--ai-avatar-') &&
            !name.startsWith('--limel-ai-avatar-')
    );
    const computed = getComputedStyle(avatar);

    const lines = external
        .map((name) => {
            const value = computed.getPropertyValue(name).trim();
            return value ? `    ${name}: ${value};` : null;
        })
        .filter((line): line is string => line !== null);

    if (lines.length === 0) {
        return '';
    }
    return `svg {\n${lines.join('\n')}\n}`;
};

// `:host(...)` and `:host` rules size the wrapper element, which doesn't
// exist in a standalone SVG. The SVG's own width/height come from its
// `svg { … }` rule, so the host rules can be dropped.
const stripHostRules = (css: string): string => {
    return css
        .replaceAll(/:host\([^)]*\)\s*\{[^}]*\}/g, '')
        .replaceAll(/:host\s*\{[^}]*\}/g, '')
        .trim();
};
