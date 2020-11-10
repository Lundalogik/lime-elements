import { Component, h, Prop } from '@stencil/core';

@Component({
    tag: 'limel-example-form-map-component',
    shadow: true,
    styleUrl: 'map-component.scss',
})
export class ExampleMapComponent {
    @Prop()
    public label: string;

    public render() {
        return (
            <div class="custom-component">
                <span class="label">{this.label}</span>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2249.3352777658542!2d13.175623716225816!3d55.683158480534814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465397fae5b2e6d9%3A0xff3855ec5b30981f!2sLime%20Technologies%20Sweden%20AB!5e0!3m2!1sen!2sse!4v1605781801916!5m2!1sen!2sse"
                    aria-hidden="false"
                    tabindex="0"
                    frameborder="0"
                ></iframe>
            </div>
        );
    }
}
