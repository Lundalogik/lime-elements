import { defaultSchema } from 'rehype-sanitize';

/**
 * Map of URL-bearing property names to their allowed protocols, sourced
 * from rehype-sanitize's defaultSchema. This means protocol updates from
 * Dependabot bumps to rehype-sanitize automatically apply here too —
 * no custom blocklist to maintain.
 *
 * We can't use rehype-sanitize directly for URL sanitization because it
 * operates on HTML attributes, not on values inside JSON strings. By the
 * time rehype-sanitize runs, `link` is just a raw JSON string attribute —
 * the `href` only becomes visible after JSON parsing in hydration.
 * So we replicate rehype-sanitize's protocol validation logic here,
 * using its own protocol list as the source of truth.
 *
 * The map covers all URL-bearing property names that rehype-sanitize
 * defines protocols for: `href`, `src`, `cite`, and `longDesc`.
 *
 * @internal
 */
export const SAFE_PROTOCOLS_BY_PROPERTY = new Map<string, Set<string>>(
    Object.entries(defaultSchema.protocols ?? {}).map(([prop, protocols]) => [
        prop,
        new Set(protocols),
    ])
);
