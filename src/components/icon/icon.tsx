import { Component, Element, Prop, Watch } from '@stencil/core';
import { Config } from '../../global/config';
import { IconCache } from '../../global/icon-cache';

@Component({
    tag: 'limel-icon',
    shadow: true,
    styleUrl: 'icon.scss',
})
export class Icon {
    /**
     * Size of the icon. Possible values: `x-small`, `small`, `medium`, `large`
     */
    @Prop({ reflectToAttr: true })
    public size: string;

    /**
     * Name of the icon
     */
    @Prop({ reflectToAttr: true })
    public name: string;

    @Prop({ context: 'config' })
    public config: Config;

    @Prop({ context: 'iconCache' })
    public iconCache: IconCache;

    @Element()
    private host: HTMLElement;

    public componentDidLoad() {
        this.loadIcon(this.name);
    }

    public render() {
        return <div class="container" />;
    }

    @Watch('name')
    protected async loadIcon(name: string) {
        const svgData = await this.loadSvg(name);
        this.renderSvg(svgData);
    }

    /**
     * Load the SVG data for the icon from the icon cache
     *
     * @param {string} name name of the icon
     *
     * @returns {string} the icon SVG data
     */
    private loadSvg(name: string) {
        return this.iconCache.get(name, this.config.iconPath);
    }

    /*
     * There is no way to style external SVG files with CSS, i.e. SVGs loaded
     * with <img src="file.svg" /> or <object data="file.svg" type="image/svg+xml" />
     * will remain the way they look in the file.
     * Therefore we inject the svg as inline markup instead.
     */
    private renderSvg(svgData: string) {
        this.host.shadowRoot.querySelector('div.container').innerHTML = svgData;
    }
}
