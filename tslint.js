module.exports = {
  extends: ["tslint:latest", "tslint-react", "tslint-eslint-rules"],
  linterOptions: {
    exclude: [
      "src/components.d.ts",
    ],
  },
  rules: {
    // See links for details:
    // https://palantir.github.io/tslint/rules/
    // https://github.com/buzinas/tslint-eslint-rules#rules-copied-from-the-eslint-website
    //
    // Possible Errors
    "no-conditional-assignment": true,
    "no-console": true,
    "no-constant-condition": true,
    "no-control-regex": true,
    "no-debugger": true,
    "no-duplicate-case": true,
    "no-empty": true,
    "no-empty-character-class": true,
    "no-ex-assign": true,
    "no-extra-boolean-cast": true,
    "no-extra-semi": true,
    "no-implicit-dependencies": [true],
    "no-inner-declarations": true,
    "no-invalid-regexp": true,
    "no-regex-spaces": true,
    "no-unexpected-multiline": true,
    "no-unsafe-finally": true,
    "ter-no-irregular-whitespace": true,
    "ter-no-sparse-arrays": true,
    "trailing-comma": [ true, {
            "esSpecCompliant": true,
            "multiline": {
                "arrays": "always",
                "functions": "never",
                "objects": "always",
                "typeLiterals": "ignore",
            },
        },
    ],
    "use-isnan": true,
    "valid-jsdoc": true,
    "valid-typeof": true,

    // Best Practices
    "ban": [true, ["alert"]],
    "curly": "all",
    "cyclomatic-complexity": ["warn", { "max": 2 }],
    "forin": true,
    "label-position": true,
    "no-arg": true,
    "no-construct": true,
    "no-duplicate-variable": true,
    "no-empty": true,
    "no-eval": true,
    "no-invalid-this": true,
    "no-magic-numbers": true,
    "no-multi-spaces": true,
    "no-string-throw": true,
    "no-switch-case-fall-through": true,
    "no-unused-expression": true,
    "no-unused-expression": true,
    "radix": true,
    "switch-default": true,
    "ter-no-proto": true,
    "ter-no-script-url": true,
    "ter-no-self-compare": true,
    "triple-equals": true,

    // Variables
    "no-shadowed-variable": true,
    "no-unused-variable": true,

    // Stylistic Issues
    "array-bracket-spacing": [true, "always", {
        "arraysInArrays": false,
        "objectsInArrays": false,
    }],
    "block-spacing": [ true, "always" ],
    "brace-style": [ true, "1tbs", {
        "allowSingleLine": true,
    }],
    "comment-format": [true, "check-space"],
    "eofline": true,
    "new-parens": true,
    "no-bitwise": true,
    "no-consecutive-blank-lines": true,
    "no-trailing-whitespace": true,
    "object-curly-spacing": [ true, "always" ],
    "object-literal-key-quotes": [true, "consistent-as-needed"],
    "one-variable-per-declaration": [true, "ignore-for-loop"],
    "quotemark": [true, "single", "jsx-double", "avoid-escape", "avoid-template"],
    "semicolon": [true, "always", "ignore-bound-class-methods"],
    "space-in-parens": [true, "never"],
    "ter-computed-property-spacing": [true, "never"],
    "ter-func-call-spacing": [true, "never"],
    "ter-indent": [true, 4],
    "ter-no-mixed-spaces-and-tabs": { "type": "spaces" },
    "ter-padded-blocks": [true, "never"],
    "variable-name": [true, "ban-keywords", "check-format"],

    // ECMAScript 6
    "no-var-keyword": true,
    "object-literal-shorthand": [true, "never"],
    "prefer-const": true,
    "ter-arrow-body-style": [true, "always"],
    "ter-arrow-parens": [true, "always"],
    "ter-arrow-spacing": [true],
    "ter-prefer-arrow-callback": [true],

    // See link for details:
    // https://www.npmjs.com/package/tslint-react#rules
    //
    // JSX
    "jsx-alignment": true,
    "jsx-curly-spacing": "never",
    "jsx-equals-spacing": "always",
    "jsx-no-bind": true,
    "jsx-no-lambda": true,
    "jsx-no-multiline-js": false,
    "jsx-no-string-ref": true,
    "jsx-self-close": true,
    "jsx-space-before-trailing-slash": true,
    "jsx-use-translation-function": true,
    "jsx-wrap-multiline": true,
  },
};
