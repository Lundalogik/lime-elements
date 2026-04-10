import { Component, h, Host } from '@stencil/core';

/**
 * Choosing the right variant
 *
 * The three button variants create a visual hierarchy that
 * helps users quickly identify the most important action.
 * But this hierarchy only works when the variants are used
 * consistently and deliberately.
 *
 * Below are some common scenarios and how to handle them.
 */
@Component({
    tag: 'limel-example-button-button-hierarchy',
    shadow: true,
    styleUrl: 'button-button-hierarchy.scss',
})
export class ButtonHierarchyExample {
    public render() {
        return (
            <Host>
                <limel-example-do-do-not
                    doDescription="Use a single `primary` button alongside `default` buttons. This clearly signals the recommended action."
                    doNotDescription="Do not make multiple buttons `primary` in the same context. When everything is emphasized, nothing stands out."
                >
                    <div slot="do" class="button-row">
                        <limel-button label="Cancel" />
                        <limel-button label="Save" primary={true} />
                    </div>
                    <div slot="do-not" class="button-row">
                        <limel-button label="Cancel" primary={true} />
                        <limel-button label="Save" primary={true} />
                    </div>
                </limel-example-do-do-not>
                <limel-example-do-do-not
                    doDescription="Use the `outlined` variant only when you genuinely need a three-level hierarchy: primary, outlined, and default."
                    doNotDescription="Do not use `outlined` as a general-purpose secondary button. If there is no `primary` button present, `outlined` adds no meaning."
                >
                    <div slot="do" class="button-row">
                        <limel-button label="Cancel" />
                        <limel-button label="Save as draft" outlined={true} />
                        <limel-button label="Publish" primary={true} />
                    </div>
                    <div slot="do-not" class="button-row">
                        <limel-button label="Cancel" />
                        <limel-button label="Save" outlined={true} />
                    </div>
                </limel-example-do-do-not>
                <limel-example-do-do-not
                    doDescription="Use `default` buttons for actions that do not need emphasis. They work well on their own or alongside a primary button."
                    doNotDescription="Do not randomly mix `outlined` and `default` buttons when there is no clear hierarchy. This creates visual inconsistency and confuses users about which action matters more."
                >
                    <div slot="do" class="button-row">
                        <limel-button label="Export" />
                        <limel-button label="Print" />
                        <limel-button label="Share" />
                    </div>
                    <div slot="do-not" class="button-row">
                        <limel-button label="Export" outlined={true} />
                        <limel-button label="Print" />
                        <limel-button label="Share" outlined={true} />
                    </div>
                </limel-example-do-do-not>
            </Host>
        );
    }
}
