import { visit, SKIP } from "unist-util-visit";
// The target group `([^\s}|]+)` and the trailing tail `([^}\n]{0,1000})` are
// separated by a zero-width lookahead `(?=[\s}|])`. This is the crux of the
// ReDoS resistance: the two greedy classes overlap (`[^\s}|]` is a subset of
// `[^}\n]`), so without the lookahead the engine would try every partition of
// a long unbroken run between them when the mandatory closing `}` is missing —
// O(n²) catastrophic backtracking. The lookahead pins the target's right edge
// to a delimiter (whitespace, `|`, or `}`), so the target can't grow into the
// tail's territory and the match fails promptly on an unterminated `{@link X…`.
//
// The tail class is additionally bounded — it excludes newlines and is capped
// at 1000 chars — as belt-and-suspenders against a second, milder super-linear
// shape: a terminator-free span packed with many `{@link` near-misses. Without
// a bound each `exec` start would scan its tail to end-of-string, making a
// multi-start scan O(n²) even though the per-start lookahead is O(1). Stopping
// the tail at a newline (an inline `{@link}` never spans lines) and capping its
// length keeps every start's scan bounded, so the whole pass stays linear. No
// real reference has a label anywhere near 1000 chars or crosses a line.
//
// The raw tail is split into separator/label by `splitLabel` below, keeping
// both patterns in lockstep through one shared parser.
const URL_LINK_PATTERN = /\{@link\s+(https?:\/\/[^\s}|]+)(?=[\s}|])([^}\n]{0,1000})\}/g;
const INLINE_LINK_PATTERN = /\{@link\s+([^\s}|]+)(?=[\s}|])([^}\n]{0,1000})\}/g;
// Parses the raw tail captured after the target (everything up to `}`) into an
// optional display label. Handles `| label`, ` label`, and the bare (empty)
// form. Doing this in code rather than in the regex avoids the backtracking
// that an in-pattern label alternation would reintroduce.
function splitLabel(rest) {
    const pipeIndex = rest.indexOf('|');
    if (pipeIndex !== -1) {
        const pipeLabel = rest.slice(pipeIndex + 1).trim();
        if (pipeLabel.length > 0) {
            return { label: pipeLabel, explicit: true };
        }
        return { label: null, explicit: false };
    }
    const trimmed = rest.trim();
    if (trimmed.length > 0) {
        return { label: trimmed, explicit: true };
    }
    return { label: null, explicit: false };
}
// URL-targeted references are pre-converted to normal markdown links because
// remark-gfm's autolink extension would otherwise tear them apart at parse
// time, before the mdast plugin can see them.
export function normalizeInlineLinkUrls(text) {
    return text.replace(URL_LINK_PATTERN, (_match, url, rest) => {
        const { label } = splitLabel(rest);
        return `[${(label !== null && label !== void 0 ? label : url).trim()}](${url})`;
    });
}
// Turns inline TSDoc/JSDoc link references in prose into mdast link nodes.
// The resolver maps a target identifier to a URL; targets it returns null
// for are rendered as plain text so unresolved references never leave
// dangling links in the output.
export function inlineLinks(options = {}) {
    var _a;
    const resolve = (_a = options.resolve) !== null && _a !== void 0 ? _a : (() => null);
    return (tree) => {
        visit(tree, 'text', (node, index, parent) => {
            if (!parent || index === null) {
                return;
            }
            if (parent.type === 'link') {
                return;
            }
            if (!node.value.includes('{@link')) {
                return;
            }
            const replacements = transformTextNode(node.value, resolve);
            if (!replacements) {
                return;
            }
            parent.children.splice(index, 1, ...replacements);
            return [SKIP, index + replacements.length];
        });
    };
}
function transformTextNode(value, resolve) {
    INLINE_LINK_PATTERN.lastIndex = 0;
    const result = [];
    let cursor = 0;
    let match;
    let matched = false;
    while ((match = INLINE_LINK_PATTERN.exec(value)) !== null) {
        matched = true;
        const [whole, target, rest] = match;
        const start = match.index;
        if (start > cursor) {
            result.push(textNode(value.slice(cursor, start)));
        }
        const { label, explicit } = splitLabel(rest);
        const display = (label !== null && label !== void 0 ? label : target).trim();
        const url = resolveTarget(target, resolve);
        // A bare identifier reference (no explicit label) is rendered as
        // inline code so it visually matches how Kompendium styles type
        // names elsewhere. Free-form labels stay plain prose.
        let labelNode;
        if (!explicit) {
            labelNode = inlineCodeNode(display);
        }
        else {
            labelNode = textNode(display);
        }
        if (url) {
            result.push(linkNode(url, labelNode));
        }
        else {
            result.push(labelNode);
        }
        cursor = start + whole.length;
    }
    if (!matched) {
        return null;
    }
    if (cursor < value.length) {
        result.push(textNode(value.slice(cursor)));
    }
    return result;
}
function resolveTarget(target, resolve) {
    if (/^https?:\/\//i.test(target) || target.startsWith('#/')) {
        return target;
    }
    return resolve(target);
}
function textNode(value) {
    return { type: 'text', value: value };
}
function inlineCodeNode(value) {
    return { type: 'inlineCode', value: value };
}
function linkNode(url, child) {
    return {
        type: 'link',
        url: url,
        title: null,
        children: [child],
    };
}
