export * from './components';
export * from './interface';

declare module '@stencil/core/internal' {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSXBase {
        interface HTMLAttributes {
            popover?: 'auto' | 'manual';
        }
    }
}
