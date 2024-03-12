import { Component, h, State } from '@stencil/core';
import { Bird, data } from '../../table/examples/birds';

/**
 * Using autocomplete with context in the Code Editor
//  * Here you see an instance of the Code Editor component with linting and
//  * folding support, which allows the user to see syntax errors in the JSON
//  * code shown in the editor. Folding makes it easier to collapse larger pieces
//  * of code.
 */

@Component({
    tag: 'limel-example-code-editor-autocomplete',
    shadow: true,
    styleUrl: 'code-editor.scss',
})
export class CodeAutocompleteExample {
    @State()
    private jinja: string = [
        'The {{birds.bobolink.name}} ({{birds.bobolink.binominalName}})',
        'lives in {{birds.bobolink.habitat}} and',
        'has a wingspan of {{birds.bobolink.wingspan}} cm.',
    ].join('\n');

    private handleChange = (event: CustomEvent<string>) => {
        this.jinja = event.detail;
    };

    private toContextData(birds: Bird[]) {
        const contextData = {};

        for (const bird of birds) {
            const key = bird.name.toLowerCase().replace(/\W+/g, '_');
            contextData[key] = bird;
        }

        return { birds: contextData };
    }

    public render() {
        // console.info(data);

        const contextData = this.toContextData(data);

        // console.info(contextData);

        return (
            <limel-code-editor
                value={this.jinja}
                language="jinja2"
                lineNumbers={true}
                hint={true}
                hintOptions={{ context: contextData }}
                onChange={this.handleChange}
            />
        );
    }
}
