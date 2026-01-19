export * from './components';
export * from './interface';

// Explicitly re-export to resolve ambiguity between components.d.ts and interface.ts
export { Tab } from './interface';
export { ListItem } from './interface';
export { FormSchema } from './interface';

declare module '@stencil/core/internal' {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSXBase {
        interface HTMLAttributes {
            popover?: 'auto' | 'manual';
        }
    }
}
