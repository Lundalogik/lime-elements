import { MenuItem, ListSeparator } from '@limetech/lime-elements';
import { Component, Element, Host, State, h } from '@stencil/core';

/**
 * Resize the menu drop-down
 */
@Component({
    tag: 'limel-example-menu-size',
    styleUrl: 'menu-size.scss',
    shadow: true,
})
export class MenuSubItemsExample {
    private items: Array<MenuItem | ListSeparator> = [
        {
            text: 'Real super heroes',
            subItems: [
                { text: 'Superman' },
                { text: 'Iron Man' },
                { text: 'Spider-Man' },
                { text: 'The Flash' },
                { text: 'Wonder Woman' },
                { text: 'Hulk' },
                { text: 'Captain America' },
                { text: 'Batman' },
                { text: 'Thor' },
                { text: 'Green Lantern (Hal Jordan)' },
            ],
        },
        {
            text: 'Fake super heroes',
            subItems: [
                { text: 'Tech Titan' },
                { text: 'Data Dynamo' },
                { text: 'Code Crusader' },
                { text: 'Cyber Avenger' },
                { text: 'Robot Wrangler' },
                { text: 'Pixel Protector' },
                { text: 'Bit Byte Blaster' },
                { text: 'Gadget Guru' },
                { text: 'Nerd Ninja' },
                { text: 'Geek Guardian' },
                { text: 'Binary Bandit' },
                { text: 'Web Wizard' },
                { text: 'Logic Lord' },
                { text: 'Captain Compiler' },
                { text: 'Mega Miner' },
                { text: 'Virus Vanquisher' },
                { text: 'Data Duchess' },
                { text: 'Hacker Hero' },
                { text: 'AI Aviator' },
                { text: 'Gizmo Gladiator' },
                { text: 'Pixel Punisher' },
                { text: 'Quantum Quasar' },
                { text: 'Crypto Crusader' },
                { text: 'Nanotech Ninja' },
                { text: 'Debugger Demon' },
                { text: 'Byte Brawler' },
                { text: 'Robot Ruler' },
                { text: 'Space Syntax' },
                { text: 'Infinite Infiltrator' },
                { text: 'Syntax Sorcerer' },
                { text: 'Genius Guardian' },
                { text: 'Data Druid' },
                { text: 'Virtual Vigilante' },
                { text: 'Quantum Quencher' },
                { text: 'Cyber Sentinel' },
                { text: 'Nanobot Ninja' },
                { text: 'Circuit Sage' },
                { text: 'Binary Blitzer' },
                { text: 'Pixel Phantom' },
                { text: 'Hologram Hero' },
                { text: 'Logic Luminator' },
                { text: 'AI Alchemist' },
                { text: 'Tech Trebuchet' },
                { text: 'Data Duchess' },
                { text: 'Virtual Voyager' },
                { text: 'Syntax Sorcerer' },
                { text: 'Genius Guardian' },
            ],
        },
    ];

    @Element()
    public host: HTMLElement;

    @State()
    private isMenuOpen: boolean = false;

    public render() {
        const width = this.host?.offsetWidth;

        return (
            <Host>
                <limel-button
                    label="Open the wide menu"
                    onClick={this.onButtonClick}
                />
                <limel-menu
                    open={this.isMenuOpen}
                    style={{
                        '--menu-surface-width': width ? `${width}px` : '',
                    }}
                    items={this.items}
                    onSelect={this.closeMenu}
                    onCancel={this.closeMenu}
                />
            </Host>
        );
    }

    private onButtonClick = () => {
        this.isMenuOpen = true;
    };

    private closeMenu = () => {
        this.isMenuOpen = false;
    };
}
