/**
 * Represents the current activity of the AI agent. The avatar uses this
 * to drive its visual state and animations.
 *
 * Additional modes can be introduced over time without being considered
 * a breaking change.
 *
 * @public
 */
export type AiAvatarMode =
    | 'idle'
    | 'active'
    | 'thinking'
    | 'typing'
    | 'working'
    | 'waiting';

/**
 * Selects the avatar's visual style. The `detailed` variant is the fully
 * detailed orb with reflections and shines; the `minimal` variant is
 * a simplified design with a single gradient orb, a stroked outline, and a
 * soft halo. The `solid` variant is a flat symbolic representation, with a
 * filled disc and outer ring drawn in `currentColor`. The `outlined` variant
 * shares the `solid` variant's shape, but renders the inner disc as a thin
 * stroke too, so the avatar reads as two concentric rings; its facial
 * features also default to `currentColor`.
 * Eye and mouth shapes (and all animations driving them) are
 * shared across variants.
 *
 * @public
 */
export type AiAvatarVariant = 'detailed' | 'minimal' | 'solid' | 'outlined';
