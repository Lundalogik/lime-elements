export * from './components';
export * from './interface';

declare module '@stencil/core/internal' {
    namespace JSXBase {
        interface HTMLAttributes {
            popover?: 'auto' | 'manual';
        }
    }
}
