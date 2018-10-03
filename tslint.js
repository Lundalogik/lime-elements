module.exports = {
    extends: [
        'tslint:latest',
        'tslint-react',
        'tslint-eslint-rules',
        'tslint-sonarts',
        'tslint-plugin-prettier',
        'tslint-config-prettier',
    ],
    linterOptions: {
        exclude: [
            'src/components.d.ts',
            'src/examples/**',
            'src/**/*.spec.{ts,tsx}',
            'src/**/*.e2e.{ts,tsx}',
        ],
    },

    rules: {
        prettier: true,

        // See links for details:
        // https://palantir.github.io/tslint/rules/
        // https://github.com/buzinas/tslint-eslint-rules#rules-copied-from-the-eslint-website
        //
        // Possible Errors
        'no-conditional-assignment': true,
        'no-console': true,
        'no-constant-condition': true,
        'no-control-regex': true,
        'no-debugger': true,
        'no-duplicate-case': true,
        'no-empty': true,
        'no-empty-character-class': true,
        'no-ex-assign': true,
        'no-extra-boolean-cast': true,
        'no-extra-semi': true,

        // It would be nice to have this enabled, but as long as tslint
        // doesn't support whitelisting imports, enabling it will mean
        // a minimum of one `tslint:disable-line:no-implicit-dependencies`
        // comment in each file.
        'no-implicit-dependencies': false,

        'no-inner-declarations': true,
        'no-invalid-regexp': true,
        'no-regex-spaces': true,
        'no-unexpected-multiline': true,
        'no-unsafe-finally': true,
        'ter-no-irregular-whitespace': true,
        'ter-no-sparse-arrays': true,
        'trailing-comma': [
            true,
            {
                esSpecCompliant: true,
                multiline: {
                    arrays: 'always',
                    functions: 'never',
                    objects: 'always',
                    typeLiterals: 'ignore',
                },
            },
        ],
        'use-isnan': true,
        'valid-jsdoc': true,
        'valid-typeof': true,

        // Best Practices
        ban: [true, ['alert']],
        curly: 'all',
        'cyclomatic-complexity': ['warn', { max: 2 }],
        forin: true,
        'label-position': true,
        'no-arg': true,
        'no-construct': true,
        'no-duplicate-variable': true,
        'no-empty': true,
        'no-eval': true,
        'no-invalid-this': true,
        'no-magic-numbers': true,
        'no-multi-spaces': true,
        'no-string-throw': true,
        'no-switch-case-fall-through': true,
        'no-unused-expression': true,
        radix: true,
        'switch-default': true,
        'ter-no-proto': true,
        'ter-no-script-url': true,
        'ter-no-self-compare': true,
        'triple-equals': true,

        // Variables
        'no-shadowed-variable': true,

        // Style
        'object-literal-sort-keys': false,
        'interface-name': false,

        // ECMAScript 6
        'no-var-keyword': true,
        'object-literal-shorthand': [true, 'never'],
        'prefer-const': true,

        // Motivation for always requiring curly braces
        // around the function body:
        // In a single-line body without curly braces, the value
        // of the statement is returned implicitly, which makes
        // the syntax very terse and neat. The problem is that,
        // in some cases, it can be very hard to tell if the
        // value returned is actually used for anything, or if
        // it just happens to get returned because the return
        // is implicit.
        // With curly braces, the return must be explicit.
        // - If the value is explicitly returned, it's reasonable
        //   to assume it's used somewhere.
        // - If the value is not returned, we know for certain
        //   it is not used.
        // This can significantly improve confidence when making
        // changes or refactoring the code in the future.
        'ter-arrow-body-style': [true, 'always'],
        'arrow-return-shorthand': false,

        'ter-prefer-arrow-callback': [true],

        // See link for details:
        // https://www.npmjs.com/package/tslint-react#rules
        //
        // JSX

        // It seems like `jsx-key` is only relevant in React.
        // Components built in Stencil will redraw the whole
        // component on any change in the data.
        'jsx-key': false,

        'jsx-no-bind': false,
        'jsx-no-lambda': false,
        'jsx-no-multiline-js': false,
        'jsx-no-string-ref': true,
        'jsx-self-close': true,
        'jsx-use-translation-function': true,
        'jsx-wrap-multiline': false,
    },
};
