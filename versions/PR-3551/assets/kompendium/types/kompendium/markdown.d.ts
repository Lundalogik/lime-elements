export interface File {
    data: {
        frontmatter?: Record<string, any>;
    };
    toString(): string;
}
export declare function markdownToHtml(text: string): Promise<File>;
