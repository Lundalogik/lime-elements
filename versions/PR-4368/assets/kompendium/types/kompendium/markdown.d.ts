export interface File {
    data: {
        frontmatter?: Record<string, any>;
        path?: string;
    };
    toString(): string;
}
export declare function markdownToHtml(text: string, types?: string[], components?: string[]): Promise<File>;
