var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
function createCommonjsModule(fn, basedir, module) {
    return module = {
        path: basedir,
        exports: {},
        require: function (path, base) {
            return commonjsRequire();
        }
    }, fn(module, module.exports), module.exports;
}
function getCjsExportFromNamespace(n) {
    return n && n['default'] || n;
}
function commonjsRequire() {
    throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}
export { commonjsGlobal as a, commonjsRequire as b, createCommonjsModule as c, getCjsExportFromNamespace as g };
