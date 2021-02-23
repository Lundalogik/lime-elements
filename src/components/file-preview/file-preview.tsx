import { Component, Element, h, Prop, Watch } from '@stencil/core';

/**
 * @exampleComponent limel-example-file-preview-image
 */

@Component({
    tag: 'limel-file-preview',
    shadow: true,
    styleUrl: 'file-preview.scss',
})
export class FilePreview {
    /**
    * Link to the file
    */
    @Prop({ reflect: true })
    public url: string;

    /**
    * Alternative text for assistive technologies and screen readers
    */
    @Prop({ reflect: true })
    public alt: string;

    @Prop({reflect: true})
    public type: string;

    public render() {
        if(this.type.startsWith('image/')) {
            return [
                <div class="buttons">
                    <a
                        href={this.url}
                        title="download"
                        download>
                        <limel-icon
                            name="download_2"
                            size="medium"
                        />
                    </a>
                    <a
                        href={this.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="open in a new tab"
                        >
                        <limel-icon
                            name="external_link"
                            size="medium"
                        />
                    </a>
                </div>,
                <img src={this.url} alt={this.alt}/>
            ];
        }

        if (this.type === 'application/pdf') {
            return (
                <object data={this.url} type={this.type}/>
            );
        }

        if (this.type === 'text/plain') {
            return (
                <object data={this.url} type={this.type}/>
            );
        }

        if(this.type.startsWith('audio/')) {
            return (
                <audio controls>
                    <source src={this.url} type={this.type}/>
                </audio>
            );
        }

        if(this.type.startsWith('video/')) {
            return (
                <video controls>
                    <source src={this.url} type={this.type}/>
                </video>
            );
        }

        return;
    }
}
