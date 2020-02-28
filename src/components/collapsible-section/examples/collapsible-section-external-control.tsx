import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-collapsible-section-external-control',
    shadow: true,
})
export class CollapsibleSectionExternalControlExample {
    @State()
    private isOpen = false;

    constructor() {
        this.toggle = this.toggle.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    public render() {
        return (
            <section>
                <limel-flex-container justify="end">
                    <limel-button
                        label={'toggle'}
                        primary={true}
                        onClick={this.toggle}
                    />
                </limel-flex-container>
                <limel-collapsible-section
                    header="Click me or click the button"
                    isOpen={this.isOpen}
                    onOpen={this.onOpen}
                    onClose={this.onClose}
                >
                    <p>Either way, the section will toggle!</p>
                </limel-collapsible-section>
            </section>
        );
    }

    private toggle() {
        this.isOpen = !this.isOpen;
    }

    private onOpen() {
        console.log('Section opened');
        this.isOpen = true;
    }

    private onClose() {
        console.log('Section closed');
        this.isOpen = false;
    }
}
