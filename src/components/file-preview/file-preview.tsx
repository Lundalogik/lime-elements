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
            return (
                <img src={this.url} alt={this.alt}/>
            );
        }

        if (this.type === 'application/pdf') {
            return (
                <object data={this.url} />
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
