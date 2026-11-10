/**
 * @private
 */
export declare class DarkmodeSwitch {
    private theme;
    private systemSettingIsDark;
    private checkbox;
    private colorSchemeMediaQuery;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    componentWillLoad(): void;
    render(): HTMLElement;
    private getSelectRef;
    private handleSystemThemeChange;
    private handleThemeChange;
    private setTheme;
}
