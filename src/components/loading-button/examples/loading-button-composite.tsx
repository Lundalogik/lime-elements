// Please DO NOT copy code from this example!
// These composite examples are not representative of how the
// components are actually used. They are for the purpose of
// demoing the UI _only_. To see how the component is used in
// code, please look at the other examples provided instead.

import { Component, h, Prop, State } from '@stencil/core';
import {
    LoadingButtonInteraction,
    LoadingResult,
} from '../loading-button.types';

/**
 * Composite
 *
 * A place to try different combinations of states.
 */
@Component({
    tag: 'limel-example-loading-button-composite',
    shadow: true,
    styles: 'limel-loading-button { margin-bottom: 1.25rem; }',
})
export class LoadingButtonCompositeExample {
    @Prop()
    public schema: any;

    @State()
    private props = {
        label: 'My button',
        primary: true,
        outlined: false,
        icon: 'dog',
        disabled: false,
    };

    private eventPrinter: HTMLLimelExampleEventPrinterElement;

    public componentWillLoad() {
        this.schema = {
            ...this.schema,
            lime: {
                layout: {
                    type: 'grid',
                },
            },
        };
    }

    public render() {
        return [
            <limel-loading-button
                {...this.props}
                onClick={this.handleClick}
                onInteract={this.handleInteract}
            />,
            this.renderForm(),
            <limel-example-event-printer
                ref={(el) => (this.eventPrinter = el)}
            />,
        ];
    }

    private handleClick = (event: Event) => {
        this.eventPrinter.writeEvent(event);
    };

    private handleInteract = (event: CustomEvent<LoadingButtonInteraction>) => {
        // Please DO NOT copy code from this example!
        // These composite examples are not representative of how the
        // components are actually used. They are for the purpose of
        // demoing the UI _only_. To see how the component is used in
        // code, please look at the other examples provided instead.

        this.eventPrinter.writeEvent(event);

        this.props = {
            ...this.props,
            disabled: true,
        };
        event.detail.indicateLoading();

        const handleLoadingSuccess = () => {
            event.detail.resolveLoading(LoadingResult.SUCCESS);

            setTimeout(() => {
                this.props = {
                    ...this.props,
                    disabled: false,
                };
            }, 3000);
        };

        setTimeout(handleLoadingSuccess, 1000);
    };

    private renderForm() {
        return (
            <limel-collapsible-section header="Settings">
                <limel-form
                    schema={this.schema}
                    value={this.props}
                    onChange={this.handleChange}
                />
            </limel-collapsible-section>
        );
    }

    private handleChange = (event: CustomEvent) => {
        this.props = event.detail;
    };
}
