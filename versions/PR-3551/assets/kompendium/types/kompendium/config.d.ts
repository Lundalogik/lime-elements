import { JsonDocs } from '../stencil-public-runtime';
import { KompendiumGuide } from './guides';
export interface KompendiumConfig {
    /**
     * Output path
     */
    path: string;
    /**
     * www
     */
    publicPath: string;
    title?: string;
}
export declare const defaultConfig: KompendiumConfig;
export interface MenuItem {
    title?: string;
    path: string;
    icon?: string;
    children?: MenuItem[];
}
export interface KompendiumData {
    title: string;
    docs: JsonDocs;
    menu: MenuItem[];
    readme?: string;
    guides: KompendiumGuide[];
}
