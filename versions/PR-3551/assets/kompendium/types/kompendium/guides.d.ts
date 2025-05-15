export interface KompendiumGuide {
    dirPath?: string;
    fileName?: string;
    filePath?: string;
    data: Record<string, any>;
    content: string;
}
export declare function findGuides(): Promise<KompendiumGuide[]>;
export declare function createGuide(filepath: string): Promise<KompendiumGuide>;
export declare function hasPath(guide: KompendiumGuide): boolean;
