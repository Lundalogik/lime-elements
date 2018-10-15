# [8.1.0](https://github.com/Lundalogik/lime-elements/compare/v8.0.1...v8.1.0) (2018-10-15)


### Features

* **linear-progress:** new linear-progress component ([82ea96b](https://github.com/Lundalogik/lime-elements/commit/82ea96b))

## [8.0.1](https://github.com/Lundalogik/lime-elements/compare/v8.0.0...v8.0.1) (2018-10-12)


### Bug Fixes

* **limel-dialog:** make it possible to open the dialog again after clicking the scrim ([bcd2b6e](https://github.com/Lundalogik/lime-elements/commit/bcd2b6e)), closes [#150](https://github.com/Lundalogik/lime-elements/issues/150)

# [8.0.0](https://github.com/Lundalogik/lime-elements/compare/v7.1.0...v8.0.0) (2018-10-11)


### Bug Fixes

* **limel-picker:** change the interface to accept a search-function which returns a promise ([0317d0f](https://github.com/Lundalogik/lime-elements/commit/0317d0f)), closes [#70](https://github.com/Lundalogik/lime-elements/issues/70)


### BREAKING CHANGES

* **limel-picker:** The `input` event has been removed. Instead, the picker should be supplied with a
searcher-function, that accepts a query string as argument, and returns a promise that is eventually
resolved with the search-result. As a result, the `items` property has also been removed, since
these are now supplied by the searcher instead.

# [7.1.0](https://github.com/Lundalogik/lime-elements/compare/v7.0.0...v7.1.0) (2018-10-10)


### Features

* **limel-multi-select:** add multi-select component ([2dce502](https://github.com/Lundalogik/lime-elements/commit/2dce502))

# [7.0.0](https://github.com/Lundalogik/lime-elements/compare/v6.1.1...v7.0.0) (2018-10-08)


### Features

* **limel-select:** change the `value` property from `string` to `Option` ([c8d2217](https://github.com/Lundalogik/lime-elements/commit/c8d2217)), closes [#129](https://github.com/Lundalogik/lime-elements/issues/129)


### BREAKING CHANGES

* **limel-select:** The type of the `value` property has been changed from `string` to `Option`. It now
holds the selected Option object, not just the `value` of the selected Option. An empty value,
previously represented by an empty string, is now represented by `null` instead.

## [6.1.1](https://github.com/Lundalogik/lime-elements/compare/v6.1.0...v6.1.1) (2018-10-05)


### Bug Fixes

* correct scss-imports to remove build-error in consuming plugins ([e57cdcf](https://github.com/Lundalogik/lime-elements/commit/e57cdcf))

# [6.1.0](https://github.com/Lundalogik/lime-elements/compare/v6.0.0...v6.1.0) (2018-10-03)


### Features

* **limel-icon:** add limel-icon component ([e073c8d](https://github.com/Lundalogik/lime-elements/commit/e073c8d))

# [6.0.0](https://github.com/Lundalogik/lime-elements/compare/v5.1.2...v6.0.0) (2018-10-03)


### Bug Fixes

* **limel-select:** set display:block on the custom-element ([0812743](https://github.com/Lundalogik/lime-elements/commit/0812743))


### Features

* move towards vanilla material styling ([a1ed101](https://github.com/Lundalogik/lime-elements/commit/a1ed101)), closes [#111](https://github.com/Lundalogik/lime-elements/issues/111)


### BREAKING CHANGES

* Visually, there are "breaking" changes. `limel-textfield` has a significantly
different look, which also affects all other components using limel-textfield: `limel-autocomplete`,
`limel-picker`. `limel-select` has received a similar update of visual style. The font has been
changed from Open Sans to Material's default Roboto.

## [5.1.2](https://github.com/Lundalogik/lime-elements/compare/v5.1.1...v5.1.2) (2018-10-02)


### Bug Fixes

* **limel-select:** update the value when the available options are changed ([ea8d31f](https://github.com/Lundalogik/lime-elements/commit/ea8d31f)), closes [#125](https://github.com/Lundalogik/lime-elements/issues/125)

## [5.1.1](https://github.com/Lundalogik/lime-elements/compare/v5.1.0...v5.1.1) (2018-09-27)


### Bug Fixes

* **limel-switch:** make switch update correctly when value is changed by consumer ([d4171b1](https://github.com/Lundalogik/lime-elements/commit/d4171b1)), closes [#121](https://github.com/Lundalogik/lime-elements/issues/121)

# [5.1.0](https://github.com/Lundalogik/lime-elements/compare/v5.0.2...v5.1.0) (2018-09-26)


### Features

* **snackbar:** new snackbar component ([065e567](https://github.com/Lundalogik/lime-elements/commit/065e567))

## [5.0.2](https://github.com/Lundalogik/lime-elements/compare/v5.0.1...v5.0.2) (2018-09-24)


### Bug Fixes

* **limel-menu:** reflect label to attribute ([90bd45d](https://github.com/Lundalogik/lime-elements/commit/90bd45d))
* **limel-menu:** set aria-hidden attribute on menu to `false` when menu is open ([9d9a744](https://github.com/Lundalogik/lime-elements/commit/9d9a744))

## [5.0.1](https://github.com/Lundalogik/lime-elements/compare/v5.0.0...v5.0.1) (2018-09-24)


### Bug Fixes

* exclude .scss files from dist-package ([6e7fabd](https://github.com/Lundalogik/lime-elements/commit/6e7fabd))

# [5.0.0](https://github.com/Lundalogik/lime-elements/compare/v4.0.1...v5.0.0) (2018-09-21)


### Bug Fixes

* export previously missing interfaces ([0de8850](https://github.com/Lundalogik/lime-elements/commit/0de8850))


### Code Refactoring

* **limel-select:** rename `IOption` to `Option` ([4d707e9](https://github.com/Lundalogik/lime-elements/commit/4d707e9))


### BREAKING CHANGES

* **limel-select:** The interface `IOption` has been renamed to `Option`. Before this release, the
interface was not correctly exported, so it is unlikely that any external consumers of
**lime-elements** actually have a breaking dependency on this interface.

## [4.0.1](https://github.com/Lundalogik/lime-elements/compare/v4.0.0...v4.0.1) (2018-09-21)


### Bug Fixes

* fix dependency on lime-material-components-web ([076e8f5](https://github.com/Lundalogik/lime-elements/commit/076e8f5))

# [4.0.0](https://github.com/Lundalogik/lime-elements/compare/v3.6.1...v4.0.0) (2018-09-21)


### Bug Fixes

* **stencil:** release 3.6.1 was actually breaking and is replaced by this release ([272c5ca](https://github.com/Lundalogik/lime-elements/commit/272c5ca))


### BREAKING CHANGES

* **stencil:** When using **lime-elements** with **Angular** or other build system using
**Webpack**, replace the line `import { defineCustomElements }  from 'lime-elements'` with `import {
defineCustomElements }  from 'lime-elements/dist/loader'`. In **Angular**, this line is found in
`main.ts`.

## [3.6.1](https://github.com/Lundalogik/lime-elements/compare/v3.6.0...v3.6.1) (2018-09-17)

### BREAKING! 3.6.1 should have been a major release. It has been unpublished. Please downgrade to 3.6.0 or upgrade to 4.0.0.

### Bug Fixes

* **limel-list:** fix component crashing when there are no elements in the list ([453dc34](https://github.com/Lundalogik/lime-elements/commit/453dc34))
* **limel-list:** set the default display value to `block` ([6431af3](https://github.com/Lundalogik/lime-elements/commit/6431af3))

# [3.6.0](https://github.com/Lundalogik/lime-elements/compare/v3.5.0...v3.6.0) (2018-09-06)


### Features

* **limel-menu:** add menu component ([c35c676](https://github.com/Lundalogik/lime-elements/commit/c35c676)), closes [#71](https://github.com/Lundalogik/lime-elements/issues/71)

# [3.5.0](https://github.com/Lundalogik/lime-elements/compare/v3.4.2...v3.5.0) (2018-09-06)


### Features

* **limel-text-field:** add property type to determine the inputs html-type ([245bf71](https://github.com/Lundalogik/lime-elements/commit/245bf71)), closes [#75](https://github.com/Lundalogik/lime-elements/issues/75)

## [3.4.2](https://github.com/Lundalogik/lime-elements/compare/v3.4.1...v3.4.2) (2018-09-06)


### Bug Fixes

* add an empty file to trigger a release for debugging-purposes ([6eb4135](https://github.com/Lundalogik/lime-elements/commit/6eb4135))
* **dummy:** no actual changes, this bump is only to have semantic-release create a changelog file ([c7f5b09](https://github.com/Lundalogik/lime-elements/commit/c7f5b09))

## [3.4.1](https://github.com/Lundalogik/lime-elements/compare/v3.4.0...v3.4.1) (2018-08-31)


### Performance Improvements

* **limel-dialog:** remove unnecessary state-decorator ([7dd2f15](https://github.com/Lundalogik/lime-elements/commit/7dd2f15))

# [3.4.0](https://github.com/Lundalogik/lime-elements/compare/v3.3.2...v3.4.0) (2018-08-30)


### Features

* **limel-collapsible-section:** add collapsible section component ([3b29074](https://github.com/Lundalogik/lime-elements/commit/3b29074)), closes [#63](https://github.com/Lundalogik/lime-elements/issues/63)

## [3.3.1](https://github.com/Lundalogik/lime-elements/compare/v3.3.0...v3.3.1) (2018-08-30)


### Performance Improvements

* **less:** remove support for styling with LESS ([64f3540](https://github.com/Lundalogik/lime-elements/commit/64f3540))

# [3.3.0](https://github.com/Lundalogik/lime-elements/compare/v3.2.1...v3.3.0) (2018-08-29)


### Features

* **stenciljs:** update stenciljs to v0.11.4 ([5ca4e18](https://github.com/Lundalogik/lime-elements/commit/5ca4e18)), closes [/github.com/ionic-team/stencil/blob/master/CHANGELOG.md#-0114-2018-08-12](https://github.com//github.com/ionic-team/stencil/blob/master/CHANGELOG.md/issues/-0114-2018-08-12)

## [3.2.1](https://github.com/Lundalogik/lime-elements/compare/v3.2.0...v3.2.1) (2018-08-23)


### Bug Fixes

* **limel-props:** fix issue with props sometimes not being parsed ([fbe2caa](https://github.com/Lundalogik/lime-elements/commit/fbe2caa))

# [3.2.0](https://github.com/Lundalogik/lime-elements/compare/v3.1.0...v3.2.0) (2018-08-20)


### Features

* **limel-list:** add list component ([ca12cf3](https://github.com/Lundalogik/lime-elements/commit/ca12cf3))
* **limel-picker:** add limel-picker component ([2233d84](https://github.com/Lundalogik/lime-elements/commit/2233d84))
* **limel-text-field:** add support for trailing icon ([3ffe17f](https://github.com/Lundalogik/lime-elements/commit/3ffe17f))
* **util:** export constants for keycodes ([9d698b1](https://github.com/Lundalogik/lime-elements/commit/9d698b1))

# [3.1.0](https://github.com/Lundalogik/lime-elements/compare/v3.0.1...v3.1.0) (2018-08-16)


### Features

* **limel-slider:** add slider component ([fb57234](https://github.com/Lundalogik/lime-elements/commit/fb57234))

## [3.0.1](https://github.com/Lundalogik/lime-elements/compare/v3.0.0...v3.0.1) (2018-08-08)


### Bug Fixes

* **limel-button:** make it possible to create button in loading state ([27d3c5f](https://github.com/Lundalogik/lime-elements/commit/27d3c5f)), closes [#52](https://github.com/Lundalogik/lime-elements/issues/52)

# [3.0.0](https://github.com/Lundalogik/lime-elements/compare/v2.4.1...v3.0.0) (2018-08-08)


### Bug Fixes

* **limel-button:** make limel-button display as inline-block ([0699df3](https://github.com/Lundalogik/lime-elements/commit/0699df3))
* **limel-button-group:** change styling attributes to css class names ([67c7fb3](https://github.com/Lundalogik/lime-elements/commit/67c7fb3))


### BREAKING CHANGES

* **limel-button-group:** Adding the `reverse-order` attribute no longer has any effect.

## [2.4.1](https://github.com/Lundalogik/lime-elements/compare/v2.4.0...v2.4.1) (2018-08-07)


### Bug Fixes

* **limel-switch:** correct colour for disabled switch in `on` state ([5b6fe02](https://github.com/Lundalogik/lime-elements/commit/5b6fe02))

# [2.4.0](https://github.com/Lundalogik/lime-elements/compare/v2.3.0...v2.4.0) (2018-08-06)


### Features

* **stencil:** stencil updated to version 0.11.0 ([2da2a38](https://github.com/Lundalogik/lime-elements/commit/2da2a38))

# [2.3.0](https://github.com/Lundalogik/lime-elements/compare/v2.2.2...v2.3.0) (2018-08-06)


### Bug Fixes

* **limel-text-field:** fix label floating on init of empty text-field ([dcb937e](https://github.com/Lundalogik/lime-elements/commit/dcb937e))


### Features

* **limel-autocomplete:** add limel-autocomplete component ([14f1967](https://github.com/Lundalogik/lime-elements/commit/14f1967))

## [2.2.2](https://github.com/Lundalogik/lime-elements/compare/v2.2.1...v2.2.2) (2018-08-02)


### Bug Fixes

* **limel-button:** add reflectToAttr to primitive properties ([77f4f10](https://github.com/Lundalogik/lime-elements/commit/77f4f10))
* **limel-dialog:** add reflectToAttr to primitive property ([d65944b](https://github.com/Lundalogik/lime-elements/commit/d65944b))
* **limel-select:** add reflectToAttr to primitive properties ([61bce7c](https://github.com/Lundalogik/lime-elements/commit/61bce7c))
* **limel-switch:** add reflectToAttr to primitive properties ([06fc6b1](https://github.com/Lundalogik/lime-elements/commit/06fc6b1))
* **limel-text-field:** add reflectToAttr to primitive properties ([ef7e70f](https://github.com/Lundalogik/lime-elements/commit/ef7e70f))

## [2.2.1](https://github.com/Lundalogik/lime-elements/compare/v2.2.0...v2.2.1) (2018-07-09)


### Bug Fixes

* **limel-spinner:** fix the broken `hidden` attribute ([204faa5](https://github.com/Lundalogik/lime-elements/commit/204faa5)), closes [#26](https://github.com/Lundalogik/lime-elements/issues/26)
* **limel-spinner:** fix the broken `size` attribute ([1599466](https://github.com/Lundalogik/lime-elements/commit/1599466)), closes [#25](https://github.com/Lundalogik/lime-elements/issues/25)

# [2.2.0](https://github.com/Lundalogik/lime-elements/compare/v2.1.0...v2.2.0) (2018-07-06)


### Features

* **limel-dialog:** add `limel-dialog` ([c6cf287](https://github.com/Lundalogik/lime-elements/commit/c6cf287))

# [2.1.0](https://github.com/Lundalogik/lime-elements/compare/v2.0.0...v2.1.0) (2018-07-05)


### Features

* **limel-text-field:** add limel-text-field ([a99caba](https://github.com/Lundalogik/lime-elements/commit/a99caba))

# [2.0.0](https://github.com/Lundalogik/lime-elements/compare/v1.4.2...v2.0.0) (2018-07-05)


### Continuous Integration

* **npm release:** update config for npm release ([7c44ef0](https://github.com/Lundalogik/lime-elements/commit/7c44ef0))


### BREAKING CHANGES

* **npm release:** All version 1.x releases are broken. There is no build output in the npm package
released.

# [1.5.0](https://github.com/Lundalogik/lime-elements/compare/v1.4.2...v1.5.0) (2018-07-05)


### Bug Fixes

* **package.json:** update release config ([98e583e](https://github.com/Lundalogik/lime-elements/commit/98e583e))


### Features

* **test:** no real commit ([769bb49](https://github.com/Lundalogik/lime-elements/commit/769bb49))

## [1.4.2](https://github.com/Lundalogik/lime-elements/compare/v1.4.1...v1.4.2) (2018-07-05)


### Bug Fixes

* **limel-select:** make 'disabled' property on option optional ([3c71ddb](https://github.com/Lundalogik/lime-elements/commit/3c71ddb))

## [1.4.1](https://github.com/Lundalogik/lime-elements/compare/v1.4.0...v1.4.1) (2018-07-05)


### Bug Fixes

* **limel-button:** make onClick work again ([95a8e58](https://github.com/Lundalogik/lime-elements/commit/95a8e58))
* **limel-select:** update property declarations ([c91ae26](https://github.com/Lundalogik/lime-elements/commit/c91ae26))
* **limel-switch:** update property declarations ([1c30951](https://github.com/Lundalogik/lime-elements/commit/1c30951))

# [1.4.0](https://github.com/Lundalogik/lime-elements/compare/v1.3.0...v1.4.0) (2018-06-29)


### Features

* **limel-select:** `limel-select` component added ([8f251b0](https://github.com/Lundalogik/lime-elements/commit/8f251b0))

# [1.3.0](https://github.com/Lundalogik/lime-elements/compare/v1.2.0...v1.3.0) (2018-06-29)


### Features

* **limel-switch:** `limel-switch` component added ([99ecb6b](https://github.com/Lundalogik/lime-elements/commit/99ecb6b))

# [1.2.0](https://github.com/Lundalogik/lime-elements/compare/v1.1.0...v1.2.0) (2018-06-28)


### Features

* **CI:** dummy minor bump ([65d1b9b](https://github.com/Lundalogik/lime-elements/commit/65d1b9b))
* **CI:** dummy minor bump plus debug flag ([250116b](https://github.com/Lundalogik/lime-elements/commit/250116b))

# [1.1.0](https://github.com/Lundalogik/lime-elements/compare/v1.0.0...v1.1.0) (2018-06-27)


### Bug Fixes

* **CI:** Debug flag removed ([d8185b1](https://github.com/Lundalogik/lime-elements/commit/d8185b1))
* **semantic-release:** Fixes bug in Makefile ([4faf38a](https://github.com/Lundalogik/lime-elements/commit/4faf38a))
* **semantic-release:** Fixes for npm publish ([feaca62](https://github.com/Lundalogik/lime-elements/commit/feaca62))
* **semantic-release:** Pass env-vars to container ([9343c36](https://github.com/Lundalogik/lime-elements/commit/9343c36))


### Features

* **README:** Improve readme ([7aced71](https://github.com/Lundalogik/lime-elements/commit/7aced71))
