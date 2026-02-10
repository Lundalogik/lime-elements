export declare function typeLinks(options?: any): (tree: any) => any;
export declare function wrapText(node: any, types?: string[]): ({
    type: string;
    value: string;
} | {
    type: string;
    tagName: string;
    properties: {
        href: string;
    };
    children: {
        type: string;
        value: string;
    }[];
})[];
export declare function splitTypeString(typeString: string): string[];
