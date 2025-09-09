import { Component, h, Host, State } from '@stencil/core';
import { ListSeparator } from '../../../components/list-item/list-item.types';
import { MenuItem } from '../../../components/menu/menu.types';

@Component({
    tag: 'limel-example-button-disabled-vs-hidden',
    shadow: true,
    styleUrl: 'button-disabled-vs-hidden.scss',
})
export class ButtonDisabledVsHideExample {
    @State()
    private value: boolean = false;

    @State()
    private clicked: boolean = false;

    @State()
    private clickedDontExample: boolean = false;

    @State()
    public required: boolean;

    @State()
    private doNotSubmitClicked: boolean = false;

    private readonly items: Array<ListSeparator | MenuItem> = [
        { text: 'Save as', icon: 'save_as' },
    ];

    private readonly disabledItem: Array<ListSeparator | MenuItem> = [
        { text: 'Save as', icon: 'save_as', disabled: true },
    ];

    private readonly handleDoNotSubmit = () => {
        this.doNotSubmitClicked = true;
    };

    public render() {
        return (
            <Host>
                <h3>Disabled vs. Hidden</h3>
                <p>
                    When should an interactive element –like a button– be
                    "Disabled" and when should we avoid displaying it? This is a
                    crucial question in user interface design, and the choice
                    between the two should always be context-dependent. These
                    guidelines provide insights into when to apply each approach
                    to optimize user experiences.
                    <br />
                    <br />
                    <b> Disabling an interactive element:</b>
                </p>
                <p>
                    Use button disabling when the action the button represents
                    is not currently available but may become available in the
                    future. For example, you can disable a "Submit" button until
                    all required form fields are filled out. Keep in mind that
                    in such cases, users should be able to do something to
                    enable the <code>disabled</code> element!
                </p>
                <limel-example-do-do-not
                    doDescription="The submit button is disabled until required fields are filled in."
                    doNotDescription="The submit button is enabled. Clicking it only makes required fields invalid."
                >
                    <limel-checkbox
                        slot="do"
                        label="Accept terms and conditions"
                        required
                        onChange={this.setChecked}
                        checked={this.value}
                    />
                    <limel-button
                        slot="do"
                        label="Submit"
                        disabled={!this.value}
                    />
                    <limel-checkbox
                        slot="do-not"
                        label="Accept terms and conditions"
                        required
                        invalid={this.doNotSubmitClicked}
                    />
                    <limel-button
                        slot="do-not"
                        label="Submit"
                        onClick={this.handleDoNotSubmit}
                    />
                </limel-example-do-do-not>
                <p>
                    Simply showing a disabled element in the user interface
                    might not be enough for the user to realize what they should
                    do to enable it. Therefore, it's very helpful to communicate
                    to the user why they can't perform that certain action.
                    Disabled buttons for instance, could have a tooltip or
                    message explaining why they are disabled.
                </p>
                <p>
                    Another idea could be to display a more noticeable visual
                    element next to the disabled element, which hints about an
                    explanation or further information. For example, indicating
                    to the user that they need to complete a certain step or
                    meet specific conditions before proceeding.
                </p>
                <limel-example-do-do-not
                    doDescription="Disabled button together with a Tooltip that clarifies why the button is disabled."
                    doNotDescription="Disabled button without any explanation"
                >
                    <div slot="do">
                        <limel-button
                            id="tooltip-example"
                            disabled
                            icon="phone"
                            label="Call"
                        />
                        <limel-tooltip
                            label="Select a recipient to make a call"
                            elementId="tooltip-example"
                        />
                    </div>
                    <span slot="do" style={{ padding: '0 2rem' }}>
                        or
                    </span>
                    <div slot="do">
                        <limel-button
                            disabled
                            icon="plus_math"
                            label="Add recipient"
                        />
                        <limel-icon name="info" id="tooltip" size="x-small" />
                        <limel-tooltip
                            label="To activate this feature, call our support!"
                            elementId="tooltip"
                        />
                    </div>
                    <div slot="do-not">
                        <limel-button disabled icon="phone" label="Call" />
                    </div>
                </limel-example-do-do-not>
                <h3>Hiding an interactive element:</h3>
                <p>
                    Sometimes, displaying a disabled element does not make
                    sense. This could be of course due to various reasons, but a
                    common scenario is coexistence of another "enabled" element
                    that does the opposite of what the disabled element does.{' '}
                    <br /> In this example, there is no point to show two
                    buttons, one for "assigning" and one for "un-assigning". The
                    "Assign" button should be hidden if it's not relevant to a
                    context. If the user is already assigned there is no sense
                    in having the assign button, it is better to show the{' '}
                    <b> unassign</b> button instead.
                </p>
                <limel-example-do-do-not>
                    <limel-button
                        slot="do"
                        class="relevant-button"
                        icon={this.clicked ? '' : 'whole_hand_right'}
                        label={this.clicked ? 'Unassign me' : 'Assign me'}
                        onClick={this.isClicked}
                    />
                    <limel-button
                        slot="do-not"
                        class="relevant-button assign"
                        icon="whole_hand_right"
                        label="Assign me"
                        disabled={this.clickedDontExample}
                        onClick={this.isClickedDontExample}
                    />
                    <limel-button
                        slot="do-not"
                        class="relevant-button"
                        label="Unassign me"
                        disabled={!this.clickedDontExample}
                        onClick={this.isClickedDontExample}
                    />
                </limel-example-do-do-not>
                <p>
                    When an action is permanently unavailable or not allowed for
                    a particular user role (e.g., an admin-only action), it's
                    best to hide the button rather than disabling it.
                </p>
                <limel-example-do-do-not>
                    <div slot="do-not">
                        <p>What users & admins both see</p>
                        <limel-split-button
                            slot="do-not"
                            label="Save"
                            icon="save"
                            items={this.disabledItem}
                        />
                    </div>
                    <div slot="do">
                        <p>What users see</p>
                        <limel-split-button label="Save" icon="save" />
                    </div>
                    <div
                        slot="do"
                        style={{
                            borderLeft: '1px dashed rgb(var(--contrast-600))',
                        }}
                    />
                    <div slot="do">
                        <p>What admins see</p>
                        <limel-split-button
                            label="Save"
                            icon="save"
                            items={this.items}
                        />
                    </div>
                </limel-example-do-do-not>
            </Host>
        );
    }

    private readonly setChecked = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.value = event.detail;
    };

    private readonly isClicked = () => {
        this.clicked = !this.clicked;
    };

    private readonly isClickedDontExample = () => {
        this.clickedDontExample = !this.clickedDontExample;
    };
}
