import { KompendiumGuide, KompendiumConfig, Guide } from '../types';
export declare function findGuides(config: Partial<KompendiumConfig>): Promise<KompendiumGuide[]>;
interface MenuNode {
    menupath: string;
    filepath: string;
}
export declare const createMenuNode: (path: string) => (guide: Guide) => MenuNode | MenuNode[];
export declare const createGuide: ({ menupath: path, filepath, }: MenuNode) => Promise<KompendiumGuide>;
export {};
