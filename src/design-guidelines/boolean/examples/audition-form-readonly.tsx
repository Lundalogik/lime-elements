import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-audition-form-readonly',
    shadow: true,
    styleUrl: 'switch-vs-checkbox.scss',
})
export class AuditionFormReadonlyExample {
    public render() {
        return (
            <limel-example-do-do-not>
                <div slot="do" class="container">
                    <h4>Gender inclusive workplace audition summary</h4>
                    <p>The audited company have taken proper measures to…</p>
                    <limel-checkbox
                        readonly={true}
                        checked={true}
                        label="Respect and call staff by their choice of pronouns"
                    />
                    <limel-checkbox
                        readonly={true}
                        label="Allow any dress codes that represent their gender identity"
                    />
                    <limel-checkbox
                        readonly={true}
                        checked={true}
                        label="Have gender-neutral toilets"
                    />
                    <limel-checkbox
                        readonly={true}
                        checked={true}
                        label="Stop gender discrimination in the recruitment"
                    />
                    <limel-checkbox
                        readonly={true}
                        label="Have a protocol for sexual harassment in workplace"
                    />
                    <p> ···</p>
                </div>
                <div slot="do-not" class="container">
                    <h4>Gender inclusive workplace audition summary</h4>
                    <p>The audited company have taken proper measures to…</p>
                    <limel-checkbox
                        readonly={true}
                        checked={true}
                        label="Normalize sharing of pronouns"
                    />
                    <limel-checkbox
                        readonly={true}
                        label="Dress codes that represent gender identity"
                    />
                    <limel-checkbox
                        readonly={true}
                        checked={true}
                        label="Gender-neutral toilets"
                    />
                    <limel-checkbox
                        readonly={true}
                        checked={true}
                        label="Discrimination in the recruitment"
                    />
                    <limel-checkbox
                        readonly={true}
                        label="Protocol for sexual harassment"
                    />
                    <p> ···</p>
                </div>
            </limel-example-do-do-not>
        );
    }
}
