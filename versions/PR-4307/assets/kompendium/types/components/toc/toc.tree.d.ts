import { TocEntry } from './toc.types';
/**
 * Tree helpers for navigating a (possibly nested) list of TocEntry nodes.
 * Kept in a separate module from the kompendium-toc component so they can be
 * unit-tested directly -- Stencil only allows a component module to export the
 * component class itself.
 */
export declare function collectIds(entries: TocEntry[], acc?: Set<string>): Set<string>;
export declare function findEntryById(id: string, entries: TocEntry[]): TocEntry | null;
export declare function findAncestorsOf(targetId: string, entries: TocEntry[], trail?: TocEntry[]): TocEntry[];
