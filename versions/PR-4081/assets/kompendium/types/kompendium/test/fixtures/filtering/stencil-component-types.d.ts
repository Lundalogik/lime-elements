/**
 * Simulates Stencil auto-generated types that should be EXCLUDED
 * These would normally be in components.d.ts
 */
export interface LimelButton {
    text: string;
    disabled?: boolean;
}
export interface HTMLLimelButtonElement extends HTMLElement {
    text: string;
    disabled?: boolean;
}
export interface LimelButtonChangeCustomEvent extends CustomEvent<string> {
    detail: string;
}
export interface ButtonConfig {
    variant: 'primary' | 'secondary';
    size: 'small' | 'large';
}
