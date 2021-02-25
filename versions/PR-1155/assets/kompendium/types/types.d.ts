import { JsonDocs, JsonDocsTag, JsonDocsProp, JsonDocsMethod, JsonDocMethodParameter } from './stencil-public-runtime';
export interface KompendiumConfig {
    /**
     * Output path
     */
    path: string;
    /**
     * www
     */
    publicPath: string;
    /**
     * Title to display in the header
     */
    title?: string;
    /**
     * Logo to display of the title in the header
     */
    logo?: string;
    typeRoot: string;
    guides: Guide[];
}
export declare type Guide = string | {
    name: string;
    children: Guide[];
};
export interface MenuItem {
    title?: string;
    path: string;
    icon?: string;
    children?: MenuItem[];
}
export interface KompendiumData {
    title: string;
    logo?: string;
    docs: JsonDocs;
    menu: MenuItem[];
    readme?: string;
    guides: KompendiumGuide[];
    types: TypeDescription[];
}
export interface KompendiumGuide {
    dirPath?: string;
    fileName?: string;
    filePath?: string;
    data: Record<string, any>;
    content: string;
}
export declare type TypeDescriptionType = 'interface' | 'alias' | 'enum';
export interface TypeDescription {
    type: TypeDescriptionType;
    name: string;
    docs: string;
    docsTags: JsonDocsTag[];
    sources: string[];
}
export interface InterfaceDescription extends TypeDescription {
    type: 'interface';
    typeParams: TypeParam[];
    props: Partial<JsonDocsProp>[];
    methods: MethodDescription[];
}
export interface TypeParam {
    name: string;
}
export interface AliasDescription extends TypeDescription {
    type: 'alias';
    alias: string;
}
export interface EnumDescription extends TypeDescription {
    type: 'enum';
    members: EnumMember[];
}
export interface EnumMember {
    name: string;
    docs: string;
    docsTags: JsonDocsTag[];
    value: string;
}
export interface MethodDescription extends Partial<JsonDocsMethod> {
    parameters: ParameterDescription[];
}
export interface ParameterDescription extends JsonDocMethodParameter {
    default: string;
    optional: boolean;
}
