import { Component, State } from '@stencil/core';

@Component({
    shadow: true,
    tag: 'limel-example-tabs',
})
export class SwitchExample {
    @State() tabs = [
        {
            id: 'first',
            label: 'First tab',
        },
        {
            id: 'second',
            label: 'Second tab',
        },
        {
            id: 'third',
            label: 'Third tab',
        },
    ]
    @State() activeTab = this.tabs[0];
    public render() {
        return [
            <limel-tabs
                tabs={this.tabs}
                onChange={event => {
                    this.activeTab = event.detail;
                }}
            />,
            <div>
                {this.tabs.map(tab => (
                    <div>
                        {   this.activeTab === tab &&
                            <h4>{tab.label}</h4>
                        }
                    </div>
                ))}
            </div>
        ];
    }
}
