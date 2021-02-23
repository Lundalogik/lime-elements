import { Component, h } from '@stencil/core';

/**
 * Using the `filename` prop
 * The component looks at the URL of the provided file, and based on how the
 * URL ends, it can detect the extension and consequently choose the right way
 * of rendering it in the browser.
 *
 * However, sometimes the URLs do not have the filename in them. In this case,
 * it is vital to specify the filename, for the component to be able to render it.
 *
 * :::important
 * Make sure the provided filename contains the correct extension!
 * :::
 *
 * :::tip
 * The filename that is specified will also be the filename that is used when the
 * file is downloaded by clicking the download button on the File Viewer.
 * :::
 */
@Component({
    tag: 'limel-example-file-viewer-filename',
    shadow: true,
})
export class FileViewerFilenameExample {
    public render() {
        return (
            <limel-file-viewer
                url="https://avatars.githubusercontent.com/u/2682464?s=200&v=4"
                alt="Lime's avatar on Github"
                filename="lime-logo.png"
            />
        );
    }
}
