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
            'src/components/**/examples/**',
            'src/**/*.spec.{ts,tsx}',
            'src/**/*.e2e.{ts,tsx}',
            'src/**/*.test-wrapper.{ts,tsx}',
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
        'no-submodule-imports': false,
        'no-switch-case-fall-through': true,
        'no-unused-expression': true,
        radix: true,
        'switch-default': true,
        'ter-no-proto': true,
        'ter-no-script-url': true,
        'ter-no-self-compare': true,
        'triple-equals': true,
        'prefer-conditional-expression': false,

        // Variables
        'no-shadowed-variable': true,

        // Style
        'object-literal-sort-keys': false,
        'interface-name': false,
        'array-type': [true, 'array-simple'],

        // ECMAScript 6
        'no-var-keyword': true,
        'object-literal-shorthand': [true, 'never'],
        'prefer-const': true,

        'ter-arrow-body-style': false,
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

        'jsx-no-bind': true,
        'jsx-no-lambda': true,
        'jsx-no-multiline-js': false,
        'jsx-no-string-ref': true,
        'jsx-self-close': true,
        'jsx-use-translation-function': true,
        'jsx-wrap-multiline': false,
    },
};
