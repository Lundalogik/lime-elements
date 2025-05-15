export declare function exists(path: string): Promise<boolean>;
export declare function mkdir(path: string, options?: any): Promise<string>;
export declare function readFile(path: string, options?: any): Promise<string>;
export declare function writeFile(path: string, data: string, options?: any): Promise<void>;
