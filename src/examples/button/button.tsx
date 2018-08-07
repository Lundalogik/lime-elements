import { Component, State } from '@stencil/core';
import { default as i18n } from 'roddeh-i18n';

@Component({
    shadow: true,
    tag: 'limel-example-button',
})
export class ButtonExample {
    @State()
    private timesClicked = 0;

    public componentWillLoad() {
        i18n.translator.add({
            "values":{
                "%n comments":[
                    [0, 0, "You haven't clicked at all yet!"],
                    [1, 1, "%n click"],
                    [2, null, "%n clicks"]
                ]
            }
        });
    }

    public render() {
        return (
            <limel-button-group reverse-order={true}>
                <limel-button
                    label={i18n("%n comments", this.timesClicked)}
                    primary={true}
                    onClick={() => {this.clickHandler();}}
                />
                <limel-button label="Cancel" />
                <limel-button label="disabled" disabled={true} />
            </limel-button-group>
        );
    }

    private clickHandler() {
        this.timesClicked += 1;
    }
}
