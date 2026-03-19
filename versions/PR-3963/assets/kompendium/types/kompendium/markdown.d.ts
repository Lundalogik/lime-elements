export interface File {
    data: {
        frontmatter?: Record<string, any>;
        path?: string;
    };
    toString(): string;
}
export declare function markdownToHtml(text: string, types?: any[]): Promise<File>;
