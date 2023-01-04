import { Component, h, State } from '@stencil/core';

/**
 * Opening and closing from outside the component
 */
@Component({
    tag: 'limel-example-collapsible-section-external-control',
    shadow: true,
})
export class CollapsibleSectionExternalControlExample {
    @State()
    private isOpen = false;

    public render() {
        return [
            <limel-button
                label={'toggle'}
                primary={true}
                onClick={this.toggle}
                style={{ 'margin-bottom': '1rem' }}
            />,
            <limel-collapsible-section
                header="Click me or click the button"
                isOpen={this.isOpen}
                onOpen={this.onOpen}
                onClose={this.onClose}
            >
                <p>Either way, the section will toggle!</p>
            </limel-collapsible-section>,
        ];
    }

    private toggle = () => {
        this.isOpen = !this.isOpen;
    };

    private onOpen = () => {
        console.log('Section opened');
        this.isOpen = true;
    };

    private onClose = () => {
        console.log('Section closed');
        this.isOpen = false;
    };
}
