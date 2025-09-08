import { Component, h } from '@stencil/core';

/**
 * Missing source handling
 *
 * This example demonstrates how the image component behaves when no `src`
 * is provided. The component will not render anything when the source is
 * missing, preventing broken image placeholders from appearing.
 *
 * :::note
 * When the `src` prop is empty, null, or undefined, the component
 * returns early and renders nothing instead of a broken image icon.
 * :::
 */
@Component({
    tag: 'limel-example-image-no-source',
    shadow: true,
})
export class ImageNoSourceExample {
    public render() {
        return [
            <p>Image with valid source:</p>,
            <limel-image
                src="https://picsum.photos/200/150?random=20"
                alt="Valid image"
            />,
            <p>Image with no source (should render nothing):</p>,
            <div style={{ border: '1px dashed #ccc', padding: '1rem' }}>
                <limel-image src="" alt="No source provided" />
                <p style={{ margin: '0', color: '#666' }}>
                    ^ Nothing should appear above this text
                </p>
            </div>,
        ];
    }
}
