import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-collapsible-section',
    shadow: true,
})
export class CollapsibleSectionExample {
    @State()
    private secondExampleIsOpen = false;

    public render() {
        return [
            <section>
                <h3>Basic example</h3>
                <limel-collapsible-section>
                    <h5 slot="header">This element goes in the header-slot</h5>
                    <p slot="body">This element goes in the body-slot.</p>
                </limel-collapsible-section>
            </section>,
            <hr />,
            <section>
                <h3>Closing and opening from outside the component</h3>
                <limel-button-group>
                    <limel-button
                        label={'toggle'}
                        primary={true}
                        onClick={this.toggleSecondExample.bind(this)}
                    />
                </limel-button-group>
                <limel-collapsible-section
                    isOpen={this.secondExampleIsOpen}
                    onOpen={this.secondExampleOnOpen.bind(this)}
                    onClose={this.secondExampleOnClose.bind(this)}
                >
                    <h5 slot="header">Click me or click the button</h5>
                    <p slot="body">Either way, the section will toggle!</p>
                </limel-collapsible-section>
            </section>,
        ];
    }

    private toggleSecondExample() {
        this.secondExampleIsOpen = !this.secondExampleIsOpen;
    }

    private secondExampleOnOpen() {
        console.log('Second example opened');
        this.secondExampleIsOpen = true;
    }

    private secondExampleOnClose() {
        console.log('Second example closed');
        this.secondExampleIsOpen = false;
    }
}
