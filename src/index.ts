export * from './components';
export * from './interface';
export {
    resizeImage,
    type ResizeOptions,
    type ResizeFit,
} from './util/image-resize';

declare module '@stencil/core/internal' {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSXBase {
        interface HTMLAttributes {
            popover?: 'auto' | 'manual';
        }
    }
}
