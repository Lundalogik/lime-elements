import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-audition-form',
    shadow: true,
    styleUrl: 'switch-vs-checkbox.scss',
})
export class AuditionFormExample {
    public render() {
        return (
            <limel-example-do-do-not>
                <div slot="do" class="container">
                    <h4>Gender inclusive workplace audition summary</h4>
                    <p>The audited company have taken proper measures to…</p>
                    <limel-checkbox label="Respect and call staff by their choice of pronouns" />
                    <limel-checkbox label="Allow any dress codes that represent their gender identity" />
                    <limel-checkbox label="Have gender-neutral toilets" />
                    <limel-checkbox label="Stop gender discrimination in the recruitment" />
                    <limel-checkbox label="Have a protocol for sexual harassment in workplace" />
                    <p> ···</p>
                    <p> ···</p>
                </div>
                <div slot="do-not" class="container">
                    <h4>Gender inclusive workplace audition summary</h4>
                    <p>The audited company have taken proper measures to…</p>
                    <limel-checkbox label="Normalize sharing of pronouns" />
                    <limel-checkbox label="Dress codes that represent gender identity" />
                    <limel-checkbox label="Gender-neutral toilets" />
                    <limel-checkbox label="Discrimination in the recruitment" />
                    <limel-checkbox label="Protocol for sexual harassment" />
                    <p> ···</p>
                    <p> ···</p>
                </div>
            </limel-example-do-do-not>
        );
    }
}
