# [29.6.0](https://github.com/Lundalogik/lime-elements/compare/v29.5.0...v29.6.0) (2020-11-06)


### Features

* **form:** add support for different types of date-pickers ([c290470](https://github.com/Lundalogik/lime-elements/commit/c290470676896cc965e2ac3b487fae6783100e6e)), closes [Lundalogik/crm-feature#1584](https://github.com/Lundalogik/crm-feature/issues/1584)

# [29.5.0](https://github.com/Lundalogik/lime-elements/compare/v29.4.6...v29.5.0) (2020-11-06)


### Features

* **input-field:** add option `showLink` for type `email`, `tel`, and `url` ([d1d11a5](https://github.com/Lundalogik/lime-elements/commit/d1d11a50116fb2e4bed8479065808dccf99987df)), closes [Lundalogik/crm-feature#1565](https://github.com/Lundalogik/crm-feature/issues/1565)

## [29.4.6](https://github.com/Lundalogik/lime-elements/compare/v29.4.5...v29.4.6) (2020-11-04)


### Bug Fixes

* **input-field:** do not trigger action from leadingIcon ([5307475](https://github.com/Lundalogik/lime-elements/commit/5307475f2115b5c0109549ec3cccc03d0b127ceb))
* **input-field:** do not trigger action if input is invalid ([cdacaa6](https://github.com/Lundalogik/lime-elements/commit/cdacaa6bbc1bf2ccf14539f53573053b33bb6d0a))
* **input-field:** make it possible to use both leadingIcon and trailingIcon ([573784f](https://github.com/Lundalogik/lime-elements/commit/573784f2ce649cb54c56083f7b7ea39f4b9124a6))
* **input-field:** prevent double change-events ([70e43df](https://github.com/Lundalogik/lime-elements/commit/70e43dff112c5a865ed3461a70797b2e70c57a16))

## [29.4.5](https://github.com/Lundalogik/lime-elements/compare/v29.4.4...v29.4.5) (2020-11-04)


### Bug Fixes

* **button:** ensure button occupies whole area of the limel-button component ([b121d1c](https://github.com/Lundalogik/lime-elements/commit/b121d1ccec14de11ea3d65d650d437ddb290ae9a)), closes [#1004](https://github.com/Lundalogik/lime-elements/issues/1004)

## [29.4.4](https://github.com/Lundalogik/lime-elements/compare/v29.4.3...v29.4.4) (2020-11-04)


### Bug Fixes

* **slider:** keep slider's content inside its boundary box ([80d8748](https://github.com/Lundalogik/lime-elements/commit/80d87483f4cdc30b6d60b4b3fc1287840d3545be))
* **slider:** vertically middle align mdc-slider__pin-value-marker ([4b97aaa](https://github.com/Lundalogik/lime-elements/commit/4b97aaae3380c8f2166c545ec94da6b07fdbadd0))
* **slider:** visualize min and max points ([0656ef2](https://github.com/Lundalogik/lime-elements/commit/0656ef2975b1627671d4e819f691235bf1b98986))

## [29.4.3](https://github.com/Lundalogik/lime-elements/compare/v29.4.2...v29.4.3) (2020-11-03)


### Bug Fixes

* **input-field:** yet *another* attempt at fixing the issue of scrolling numeric input fields ([b8b4fb6](https://github.com/Lundalogik/lime-elements/commit/b8b4fb66b140533722a79ec851160f0f3f3caa9d)), closes [Lundalogik/crm-feature#1538](https://github.com/Lundalogik/crm-feature/issues/1538)

## [29.4.2](https://github.com/Lundalogik/lime-elements/compare/v29.4.1...v29.4.2) (2020-11-02)


### Bug Fixes

* **input-field:** avoid error in value watcher ([aec064f](https://github.com/Lundalogik/lime-elements/commit/aec064f40ee7a22d9d35f37fdb271ccb16a7f8c7))
* **linear-progress:** avoid error in value watcher ([91fbe24](https://github.com/Lundalogik/lime-elements/commit/91fbe24c8a06e91743cc6cc594a9d01ed409b8c0))
* **table:** avoid error in value watcher ([ecd7d14](https://github.com/Lundalogik/lime-elements/commit/ecd7d14c35f8be12e878f8126f1ce835c4ff8fc8))

## [29.4.1](https://github.com/Lundalogik/lime-elements/compare/v29.4.0...v29.4.1) (2020-11-02)


### Bug Fixes

* **slider:** ensure no error log is thrown in the console ([6a0e2b6](https://github.com/Lundalogik/lime-elements/commit/6a0e2b62066b93a3ed09e67c744b91c11154a38b)), closes [#1532](https://github.com/Lundalogik/lime-elements/issues/1532)

# [29.4.0](https://github.com/Lundalogik/lime-elements/compare/v29.3.2...v29.4.0) (2020-11-02)


### Bug Fixes

* **slider:** render minimum value if value is not a number ([73dcfd2](https://github.com/Lundalogik/lime-elements/commit/73dcfd22aa9f54b55cd7141094e376f5199f3a5b))


### Features

* **form:** add suport for range picker ([7f101ae](https://github.com/Lundalogik/lime-elements/commit/7f101ae5becd0b14c02632e8dda887bf09fd29e6)), closes [Lundalogik/crm-feature#1570](https://github.com/Lundalogik/crm-feature/issues/1570)
* **slider:** add helperText property ([afae4cf](https://github.com/Lundalogik/lime-elements/commit/afae4cfd645e44bc33dd90247acedd09caa62d58))
* **slider:** add step property ([58ebda2](https://github.com/Lundalogik/lime-elements/commit/58ebda2598ef5c27db00ff900d8e587ec7d3e808))

## [29.3.2](https://github.com/Lundalogik/lime-elements/compare/v29.3.1...v29.3.2) (2020-10-29)


### Bug Fixes

* **input-field:** do not prevent scrolling while hovering numeric input fields ([bc787dd](https://github.com/Lundalogik/lime-elements/commit/bc787dd8d063e4ebd7eb0a0e60354d46036a9322)), closes [Lundalogik/crm-feature#1538](https://github.com/Lundalogik/crm-feature/issues/1538)

## [29.3.1](https://github.com/Lundalogik/lime-elements/compare/v29.3.0...v29.3.1) (2020-10-29)


### Bug Fixes

* **table:** ensure component is completely rendered when loaded ([e13bae0](https://github.com/Lundalogik/lime-elements/commit/e13bae0f25abb34e52f522898e142a98c952565f))

# [29.3.0](https://github.com/Lundalogik/lime-elements/compare/v29.2.0...v29.3.0) (2020-10-28)


### Bug Fixes

* **input-field:** sync value with mdcvalue for all field types ([ef7a559](https://github.com/Lundalogik/lime-elements/commit/ef7a55959b68faa2e93c00eac3bd881c2135ebbc))


### Features

* **input-field:** add support for regex pattern ([a922602](https://github.com/Lundalogik/lime-elements/commit/a9226023dbbf69433c1c63140d3aaa66b363f688))

# [29.2.0](https://github.com/Lundalogik/lime-elements/compare/v29.1.0...v29.2.0) (2020-10-27)


### Bug Fixes

* **form:** make sure form is initialized with a schema ([bc1bfe3](https://github.com/Lundalogik/lime-elements/commit/bc1bfe3637b44589486133977cff819a3314164e))


### Features

* **form:** allow props on input-field to be overriden from schema ([7998fe9](https://github.com/Lundalogik/lime-elements/commit/7998fe9abd59b6117f15bc982b6305fcd8f84306)), closes [Lundalogik/crm-feature#1519](https://github.com/Lundalogik/crm-feature/issues/1519)

# [29.1.0](https://github.com/Lundalogik/lime-elements/compare/v29.0.8...v29.1.0) (2020-10-27)


### Bug Fixes

* **form:** add missing type information for schema ([b4130ca](https://github.com/Lundalogik/lime-elements/commit/b4130ca93cb70b16a2340b9325d12e9a1824efdb))


### Features

* **form:** add support for form layouts ([58ceaff](https://github.com/Lundalogik/lime-elements/commit/58ceaff8c4af057a21981f4bbef8906e52d1929f)), closes [Lundalogik/crm-feature#1479](https://github.com/Lundalogik/crm-feature/issues/1479)

## [29.0.8](https://github.com/Lundalogik/lime-elements/compare/v29.0.7...v29.0.8) (2020-10-24)


### Bug Fixes

* **table:** loader appears smoothly, instead of blinking ([e20db37](https://github.com/Lundalogik/lime-elements/commit/e20db3780859ee437e6cd91fbc395f326d0be095))

## [29.0.7](https://github.com/Lundalogik/lime-elements/compare/v29.0.6...v29.0.7) (2020-10-23)


### Bug Fixes

* **table:** always update table pages after data has been updated or loaded ([ff338d0](https://github.com/Lundalogik/lime-elements/commit/ff338d0a77a85ab287df69b058568b268874794c))
* **table:** check boolean length correctly ([f1c2e33](https://github.com/Lundalogik/lime-elements/commit/f1c2e339955cb056ca9b50ccbac224ee95a0a5d9))

## [29.0.6](https://github.com/Lundalogik/lime-elements/compare/v29.0.5...v29.0.6) (2020-10-23)


### Bug Fixes

* **switch:** ensure no exception is thrown in the console ([566df84](https://github.com/Lundalogik/lime-elements/commit/566df840c4df613fbd61a0ce0bf5a1559f58f94e))

## [29.0.5](https://github.com/Lundalogik/lime-elements/compare/v29.0.4...v29.0.5) (2020-10-22)


### Bug Fixes

* **table:** set max page of tabulator when totalRows is updated ([6684a99](https://github.com/Lundalogik/lime-elements/commit/6684a99310f202341cc70e692272c909e9a8a0b6))

## [29.0.4](https://github.com/Lundalogik/lime-elements/compare/v29.0.3...v29.0.4) (2020-10-21)


### Bug Fixes

* **types:** publish auto generated types for the source code ([3752cea](https://github.com/Lundalogik/lime-elements/commit/3752cea1aaa5b5cf3a6e3a3aae2f634c5f6cb4ec))

## [29.0.3](https://github.com/Lundalogik/lime-elements/compare/v29.0.2...v29.0.3) (2020-10-20)


### Bug Fixes

* **table:** use default formatter for column if invalid component config is provided ([b250215](https://github.com/Lundalogik/lime-elements/commit/b250215e8ac435df42c94780df81dc5b0d69a5ac))

## [29.0.2](https://github.com/Lundalogik/lime-elements/compare/v29.0.1...v29.0.2) (2020-10-14)


### Bug Fixes

* **table:** render sorting arrow correctly ([e02e6aa](https://github.com/Lundalogik/lime-elements/commit/e02e6aa83e40a5e2ad0939750a0eeebb68afdcc1))

## [29.0.1](https://github.com/Lundalogik/lime-elements/compare/v29.0.0...v29.0.1) (2020-10-14)


### Bug Fixes

* **chip-set:** only emit one startEdit event when focusing on the input field ([4e473a1](https://github.com/Lundalogik/lime-elements/commit/4e473a131dab790feb909ead0ed846795aa0ccf5)), closes [Lundalogik/crm-feature#1474](https://github.com/Lundalogik/crm-feature/issues/1474)

# [29.0.0](https://github.com/Lundalogik/lime-elements/compare/v28.5.6...v29.0.0) (2020-10-12)


### Features

* **stencil:** update to StencilJS v2 ([7f1991b](https://github.com/Lundalogik/lime-elements/commit/7f1991b1d5f31b3aa5b2ea151b3b090fdab63201))


### BREAKING CHANGES

* **stencil:** Lime Elements no longer supplies ES5-builds. Browser support for ES Modules (esm)
is now required. If you are loading `lime-elements` with one `<script type="module" src="…">` tag
and one `<script nomodule src="…">` tag, you should remove the latter.

## [28.5.6](https://github.com/Lundalogik/lime-elements/compare/v28.5.5...v28.5.6) (2020-10-05)


### Bug Fixes

* **form:** fix sort and remove list of text fields in form ([8d0ce0c](https://github.com/Lundalogik/lime-elements/commit/8d0ce0cc3f4dc13d1e1f0eb7c671b21a0fad20d5)), closes [Lundalogik/lime-elements#969](https://github.com/Lundalogik/lime-elements/issues/969)

## [28.5.5](https://github.com/Lundalogik/lime-elements/compare/v28.5.4...v28.5.5) (2020-10-02)


### Bug Fixes

* **form:** fix resetting dependent fields during schema changes in lists ([13457d4](https://github.com/Lundalogik/lime-elements/commit/13457d4925ba893a3d8f77669e034bc0108c9ee0))

## [28.5.4](https://github.com/Lundalogik/lime-elements/compare/v28.5.3...v28.5.4) (2020-09-29)


### Bug Fixes

* **file:** add leading icon to illustrate upload ([f17ca03](https://github.com/Lundalogik/lime-elements/commit/f17ca03e805630c895ffbfa550b58a3d5507e85a))

## [28.5.3](https://github.com/Lundalogik/lime-elements/compare/v28.5.2...v28.5.3) (2020-09-29)


### Bug Fixes

* **input-field:** make it possible to programmatically update value in textarea ([9c50420](https://github.com/Lundalogik/lime-elements/commit/9c5042089874912fc2b5ae89ed192191b33d1817)), closes [#952](https://github.com/Lundalogik/lime-elements/issues/952)

## [28.5.2](https://github.com/Lundalogik/lime-elements/compare/v28.5.1...v28.5.2) (2020-09-29)


### Bug Fixes

* **select:** focus style for select dropdown ([e5f0853](https://github.com/Lundalogik/lime-elements/commit/e5f08538e920c20fcd71f0598b0b01eb2bd698bf))

## [28.5.1](https://github.com/Lundalogik/lime-elements/compare/v28.5.0...v28.5.1) (2020-09-25)


### Bug Fixes

* **table:** escape html in tables ([a1dc99e](https://github.com/Lundalogik/lime-elements/commit/a1dc99e8460f72e84d9d8642b9e7ea944b7ab122)), closes [Lundalogik/crm-feature#1418](https://github.com/Lundalogik/crm-feature/issues/1418)

# [28.5.0](https://github.com/Lundalogik/lime-elements/compare/v28.4.5...v28.5.0) (2020-09-25)


### Features

* **table:** add default sorting ([a0f0448](https://github.com/Lundalogik/lime-elements/commit/a0f0448ef9fc29bfc3a49482445d00947f94431b)), closes [#961](https://github.com/Lundalogik/lime-elements/issues/961)

## [28.4.5](https://github.com/Lundalogik/lime-elements/compare/v28.4.4...v28.4.5) (2020-09-22)


### Bug Fixes

* **table:** ignore first ajax request if table is created with data ([4bfcc5d](https://github.com/Lundalogik/lime-elements/commit/4bfcc5d11970e257776710e2423bbf6acccdae2e)), closes [Lundalogik/lime-crm-components#150](https://github.com/Lundalogik/lime-crm-components/issues/150)

## [28.4.4](https://github.com/Lundalogik/lime-elements/compare/v28.4.3...v28.4.4) (2020-09-18)


### Bug Fixes

* **table:** calculate the correct width when resizing columns ([4ab6db7](https://github.com/Lundalogik/lime-elements/commit/4ab6db7c3d2562662ac4582d08a89953c8f56ecd))


### Performance Improvements

* **table:** use object pool for custom components ([3d9047a](https://github.com/Lundalogik/lime-elements/commit/3d9047a0b12a8768d3fb3646dcc465bd7b5a9152)), closes [Lundalogik/crm-feature#1384](https://github.com/Lundalogik/crm-feature/issues/1384)

## [28.4.3](https://github.com/Lundalogik/lime-elements/compare/v28.4.2...v28.4.3) (2020-09-17)


### Performance Improvements

* **portal:** create popper instance when portal is displayed ([3371b0e](https://github.com/Lundalogik/lime-elements/commit/3371b0e4269c1da36342fc6a0215a7b3deff6efe))

## [28.4.2](https://github.com/Lundalogik/lime-elements/compare/v28.4.1...v28.4.2) (2020-09-14)


### Bug Fixes

* **tab-bar:** hide unwanted scrollbars on Firefox ([1cfac35](https://github.com/Lundalogik/lime-elements/commit/1cfac35434be731e9e2ef4b57cf02e2b9c4dcad0))

## [28.4.1](https://github.com/Lundalogik/lime-elements/compare/v28.4.0...v28.4.1) (2020-09-10)


### Bug Fixes

* **tab-panel:** initialize slot elements array ([44658a0](https://github.com/Lundalogik/lime-elements/commit/44658a0b464894f55be8ad54e5b123324c5dffcd))
* **table:** add wrapper element to Tabulator ([7a9eca7](https://github.com/Lundalogik/lime-elements/commit/7a9eca7f83eb0ca2154cdc3f561c777ed15e3f2f))

# [28.4.0](https://github.com/Lundalogik/lime-elements/compare/v28.3.1...v28.4.0) (2020-09-10)


### Bug Fixes

* **chip-set:** add some space for the clear all button so it won't overlap chips ([3b159c0](https://github.com/Lundalogik/lime-elements/commit/3b159c07c88ebd6fac8f81b2a4317ebbaaa0470f))
* **chip-set:** make clear-all button keyboard accessible ([2f3ab2e](https://github.com/Lundalogik/lime-elements/commit/2f3ab2e0a35440bc30d21fc03e27114ec187abb1)), closes [#936](https://github.com/Lundalogik/lime-elements/issues/936)


### Features

* **chip-set:** add `aria-label` & `title` for clear all button ([714dc30](https://github.com/Lundalogik/lime-elements/commit/714dc3018d57dbcdcb100e228a62c98bfd2e1ade))

## [28.3.1](https://github.com/Lundalogik/lime-elements/compare/v28.3.0...v28.3.1) (2020-09-09)


### Bug Fixes

* **table:** calculate column width for custom components ([87b764a](https://github.com/Lundalogik/lime-elements/commit/87b764a86bcd891dc05736ca4eb7abd4be65ac29))

# [28.3.0](https://github.com/Lundalogik/lime-elements/compare/v28.2.0...v28.3.0) (2020-09-08)


### Features

* **chip-set:** add optional delimiters between chips ([0ebc43b](https://github.com/Lundalogik/lime-elements/commit/0ebc43b1d1f7e402b7d19e5fead71793dc4e36b9)), closes [Lundalogik/crm-feature#1351](https://github.com/Lundalogik/crm-feature/issues/1351)

# [28.2.0](https://github.com/Lundalogik/lime-elements/compare/v28.1.4...v28.2.0) (2020-09-07)


### Features

* **chip-set:** add optional leading icon ([0cfe663](https://github.com/Lundalogik/lime-elements/commit/0cfe663f65cbe1ddb07699f9714e554337f6f4a1))

## [28.1.4](https://github.com/Lundalogik/lime-elements/compare/v28.1.3...v28.1.4) (2020-09-07)


### Bug Fixes

* **table:** make Tabulator look more like old tables in web client ([aad9589](https://github.com/Lundalogik/lime-elements/commit/aad95895999ac8c2d53f3a8007af088d23377e6a))

## [28.1.3](https://github.com/Lundalogik/lime-elements/compare/v28.1.2...v28.1.3) (2020-09-07)


### Bug Fixes

* **tab-bar:** save tab state by making it mutable ([c8dfabf](https://github.com/Lundalogik/lime-elements/commit/c8dfabf28db36ad8bc1633ebd626cdb6e30dcfec)), closes [Lundalogik/crm-feature#1327](https://github.com/Lundalogik/crm-feature/issues/1327)

## [28.1.2](https://github.com/Lundalogik/lime-elements/compare/v28.1.1...v28.1.2) (2020-09-07)


### Bug Fixes

* **button-group:** fix visual defects on Firefox cause by user agent stylesheets ([746b2ef](https://github.com/Lundalogik/lime-elements/commit/746b2efcc453e80b29bceb6b8527d7bc935c9bb9))

## [28.1.1](https://github.com/Lundalogik/lime-elements/compare/v28.1.0...v28.1.1) (2020-09-02)


### Bug Fixes

* **chip-set:** add darker color when hovering over button ([a7c3cb4](https://github.com/Lundalogik/lime-elements/commit/a7c3cb46e67cd22247d5663e8a4ce6de3e083977))

# [28.1.0](https://github.com/Lundalogik/lime-elements/compare/v28.0.3...v28.1.0) (2020-09-01)


### Features

* **chip-set:** add delete all chips button ([31ad2f7](https://github.com/Lundalogik/lime-elements/commit/31ad2f7f1a7864eb0262f763f53ddc09906d3a53)), closes [Lundalogik/crm-feature#1329](https://github.com/Lundalogik/crm-feature/issues/1329)

## [28.0.3](https://github.com/Lundalogik/lime-elements/compare/v28.0.2...v28.0.3) (2020-08-31)


### Bug Fixes

* **switch:** make sure MDC component exist ([6d5601a](https://github.com/Lundalogik/lime-elements/commit/6d5601a90fb6958c27e79655b77a4e23bdf98835))

## [28.0.2](https://github.com/Lundalogik/lime-elements/compare/v28.0.1...v28.0.2) (2020-08-31)


### Performance Improvements

* **linear-progress:** remove continuous buffering animation ([db33e68](https://github.com/Lundalogik/lime-elements/commit/db33e681d1bdecb3a6109156efd2f6284ce6870d))

## [28.0.1](https://github.com/Lundalogik/lime-elements/compare/v28.0.0...v28.0.1) (2020-08-28)


### Bug Fixes

* **checkbox:** check if objects exist before destroy ([c862cde](https://github.com/Lundalogik/lime-elements/commit/c862cde90bc0f6f03b347c0f8ec9dd06a382838b))
* **form:** only unmount if element exist ([f075d3b](https://github.com/Lundalogik/lime-elements/commit/f075d3b8b003c3c29be269910d451c1d5c47de18))
* **icon-button:** check if object exist before destroy ([6a002c9](https://github.com/Lundalogik/lime-elements/commit/6a002c91e7842837062f8929d67aed796021db21))
* **menu-surface:** check if object exist before destroy ([87816ba](https://github.com/Lundalogik/lime-elements/commit/87816ba390b8ea1c2ffeb9f9fb456d387f12f506))
* **portal:** use connectedCallback to setup container ([16b101a](https://github.com/Lundalogik/lime-elements/commit/16b101ac8155925ca31ee06a393cfafed6a3fc8a))

# [28.0.0](https://github.com/Lundalogik/lime-elements/compare/v27.1.0...v28.0.0) (2020-08-28)


### Reverts

* **core-styles:** revert "let color palette be exported & accessible in webclient" ([6d73d5b](https://github.com/Lundalogik/lime-elements/commit/6d73d5ba2c6493e3c3f39bbd4ea9f7a3c3015e35))


### BREAKING CHANGES

* **core-styles:** The color palettes should be imported by the consumer, as described in the
documentation and the release notes for v27.0.0. The reverted change was a mistake due to
miscommunication. Our apologies.

# [27.1.0](https://github.com/Lundalogik/lime-elements/compare/v27.0.0...v27.1.0) (2020-08-27)


### Features

* **core-styles:** let color palette be exported & accessible in webclient ([5b27cb6](https://github.com/Lundalogik/lime-elements/commit/5b27cb650e816d69594e72068cf897fb3d039b61))

# [27.0.0](https://github.com/Lundalogik/lime-elements/compare/v26.43.1...v27.0.0) (2020-08-27)


### Features

* **color-system:** add different color palettes ([1325519](https://github.com/Lundalogik/lime-elements/commit/1325519e9a396b5918252b4ad15ca16c464620b9))


### BREAKING CHANGES

* **color-system:** The new color stylesheet `[node_modules/]@limetech/lime-elements/dist/lime-elements/style/color-palette-extended-light-mode-only.css` must be loaded. There is also a `color-palette-extended.css` in the same location. This should not be used in production until lime-elements has finished the transition to fully support dark mode in all components. ***NOTE!*** While no components currently use the new color variables, components *will* be updated to use the new variables in upcoming *minor* versions, which will be breaking if neither of the above stylesheets are loaded.

## [26.43.1](https://github.com/Lundalogik/lime-elements/compare/v26.43.0...v26.43.1) (2020-08-26)


### Bug Fixes

* **button-group:** remove visual defects on iOS ([8edc55f](https://github.com/Lundalogik/lime-elements/commit/8edc55fc211803e8e50951a96e02ee3681a1ab4c))

# [26.43.0](https://github.com/Lundalogik/lime-elements/compare/v26.42.11...v26.43.0) (2020-08-21)


### Features

* **table:** add row selection feature on table view ([170fb3a](https://github.com/Lundalogik/lime-elements/commit/170fb3adecf9ae8a99421573f21d822f3cae1903)), closes [#912](https://github.com/Lundalogik/lime-elements/issues/912)

## [26.42.11](https://github.com/Lundalogik/lime-elements/compare/v26.42.10...v26.42.11) (2020-08-21)


### Bug Fixes

* **table:** make paddings similar to old tables in the web client ([c31fba5](https://github.com/Lundalogik/lime-elements/commit/c31fba5b849fffa43b75c34bd3abcdf4f83b0f39))
* **tabulator-custom-styles:** fix layout misalignments ([e76da8a](https://github.com/Lundalogik/lime-elements/commit/e76da8a3d1e460c0a7be2e6ca997685eb01e4bad))

## [26.42.10](https://github.com/Lundalogik/lime-elements/compare/v26.42.9...v26.42.10) (2020-08-20)


### Performance Improvements

* **table:** don't set data on Tabulator unless it has changed ([9cef57c](https://github.com/Lundalogik/lime-elements/commit/9cef57cf96c5088b116dac004a75614b3601cdf2))

## [26.42.9](https://github.com/Lundalogik/lime-elements/compare/v26.42.8...v26.42.9) (2020-08-20)


### Bug Fixes

* **limel-form:** no error is thrown when parsing keys from schema w/o properties key ([c713c63](https://github.com/Lundalogik/lime-elements/commit/c713c6335c1614627b59e0b7b419086290ea9ae3))

## [26.42.8](https://github.com/Lundalogik/lime-elements/compare/v26.42.7...v26.42.8) (2020-08-18)


### Bug Fixes

* **button-groups:** make entire chip look clickable ([1f26682](https://github.com/Lundalogik/lime-elements/commit/1f26682913542064c78a9499f01606f2cb3f021e))

## [26.42.7](https://github.com/Lundalogik/lime-elements/compare/v26.42.6...v26.42.7) (2020-08-12)


### Bug Fixes

* update prismjs to reduce vulnerabilities ([6eb7436](https://github.com/Lundalogik/lime-elements/commit/6eb74361dd6faa826e35747f952ddf1ce895ff46))

## [26.42.6](https://github.com/Lundalogik/lime-elements/compare/v26.42.5...v26.42.6) (2020-08-12)


### Bug Fixes

* **tab-bar:** make sure scrollArea &  mdcTabBar exist before removing the element ([bf8cbc9](https://github.com/Lundalogik/lime-elements/commit/bf8cbc96791b61cc613f819eb915ca171fd3b05b)), closes [Lundalogik/crm-feature#1239](https://github.com/Lundalogik/crm-feature/issues/1239)

## [26.42.5](https://github.com/Lundalogik/lime-elements/compare/v26.42.4...v26.42.5) (2020-08-06)


### Bug Fixes

* **list:** too tall menus render outside screen on Safari ios with address bar ([156131c](https://github.com/Lundalogik/lime-elements/commit/156131cc83c10a3645e082003ecbae146cdd258b))

## [26.42.4](https://github.com/Lundalogik/lime-elements/compare/v26.42.3...v26.42.4) (2020-07-24)


### Bug Fixes

* **input-field:** correct placement of label for textarea ([b6a5014](https://github.com/Lundalogik/lime-elements/commit/b6a5014e2ec7f26635c5523d16eef524da692b4a)), closes [#722](https://github.com/Lundalogik/lime-elements/issues/722)

## [26.42.3](https://github.com/Lundalogik/lime-elements/compare/v26.42.2...v26.42.3) (2020-07-23)


### Bug Fixes

* **tab-bar:** fix tab-bar crashes when previous tabs are undefined ([9837e8a](https://github.com/Lundalogik/lime-elements/commit/9837e8a1fc87bf6ece3172c6f36e2268a2cbcfa0)), closes [#852](https://github.com/Lundalogik/lime-elements/issues/852)

## [26.42.2](https://github.com/Lundalogik/lime-elements/compare/v26.42.1...v26.42.2) (2020-07-22)


### Bug Fixes

* **tab-bar:** remove limel-icons when no icon name provided  in limel-tab-bar ([0b9beb2](https://github.com/Lundalogik/lime-elements/commit/0b9beb267df67e45c49d6f6904bd8c187e841122))

## [26.42.1](https://github.com/Lundalogik/lime-elements/compare/v26.42.0...v26.42.1) (2020-07-14)


### Bug Fixes

* **menu:** change 1px border, from REM value to PX to avoid visual defects ([87c1044](https://github.com/Lundalogik/lime-elements/commit/87c104448e59f6b9ce0d0780ddc06bc8308001a6))
* **menu:** force tall menus placed at the bottom to render inside the viewport ([2c02d91](https://github.com/Lundalogik/lime-elements/commit/2c02d9170d9a1ff287f1342b40e96e1b27a8d20b))

# [26.42.0](https://github.com/Lundalogik/lime-elements/compare/v26.41.0...v26.42.0) (2020-07-10)


### Features

* **form:** add support for a props factory for custom components ([314dfab](https://github.com/Lundalogik/lime-elements/commit/314dfab434fb7a3d47a56b2b12aa8bb2a4e89a6e)), closes [Lundalogik/lime-crm-components#107](https://github.com/Lundalogik/lime-crm-components/issues/107)

# [26.41.0](https://github.com/Lundalogik/lime-elements/compare/v26.40.5...v26.41.0) (2020-07-10)


### Features

* **tab-bar:** add css support for fixed & dynamic tab layouts ([92877b1](https://github.com/Lundalogik/lime-elements/commit/92877b1e0c4dea9bd3c9bfbb9b2d1bdcd90b09b4))

## [26.40.5](https://github.com/Lundalogik/lime-elements/compare/v26.40.4...v26.40.5) (2020-07-10)


### Bug Fixes

* **slider:** properly style disabled slider's thumb ([3fdde72](https://github.com/Lundalogik/lime-elements/commit/3fdde727a9b164627a16ad51db42cfa118dc23e0))

## [26.40.4](https://github.com/Lundalogik/lime-elements/compare/v26.40.3...v26.40.4) (2020-07-10)


### Bug Fixes

* **date-picker:** improve handling of click events ([962c932](https://github.com/Lundalogik/lime-elements/commit/962c93218716426080e918ae795cb7772d71b36c))

## [26.40.3](https://github.com/Lundalogik/lime-elements/compare/v26.40.2...v26.40.3) (2020-07-09)


### Bug Fixes

* **input-field:** overwrite native text field validation if consumer provides validation ([f20a2d6](https://github.com/Lundalogik/lime-elements/commit/f20a2d6739762211e36e2f24092867b3ceef07b4))

## [26.40.2](https://github.com/Lundalogik/lime-elements/compare/v26.40.1...v26.40.2) (2020-07-09)


### Bug Fixes

* **menu:** when dropdown is rendered upwards from trigger, do not cover the trigger ([93926c0](https://github.com/Lundalogik/lime-elements/commit/93926c0fd5b7e37e67dae4b2d1c7be287f541ca9))

## [26.40.1](https://github.com/Lundalogik/lime-elements/compare/v26.40.0...v26.40.1) (2020-07-09)


### Bug Fixes

* **date-picker:** improve handling of focus on the input field ([7dc63f5](https://github.com/Lundalogik/lime-elements/commit/7dc63f562ddec2a0172585653b40d7f5e145a67a)), closes [#764](https://github.com/Lundalogik/lime-elements/issues/764)

# [26.40.0](https://github.com/Lundalogik/lime-elements/compare/v26.39.1...v26.40.0) (2020-07-08)


### Bug Fixes

* **date-picker:** recreate the flatpickr if it hasn't rendered after 1 second ([d68d10c](https://github.com/Lundalogik/lime-elements/commit/d68d10c6cccd51f703ee1fd48d55cdd5329c482e))
* **menu-surface:** ensure that lists can be correctly rendered in the portal ([9c6c5bc](https://github.com/Lundalogik/lime-elements/commit/9c6c5bcc5747433a0b50a362a99d44c45e9621b4))
* **menu-surface:** ensure that the menu surface is rendered inside the viewport ([8e21e27](https://github.com/Lundalogik/lime-elements/commit/8e21e271e36e1e5d1a864d393ff409b32243177f))


### Features

* **date-picker:** add button for clearing the input value ([e0e470b](https://github.com/Lundalogik/lime-elements/commit/e0e470b3ff1d64a28cb2ff134d36fce63f9ad9bd))
* **date-picker:** use portal to improve dropdown behavior for date-pickers inside dialog ([5b04b6a](https://github.com/Lundalogik/lime-elements/commit/5b04b6af002918caac345d23c47b3415580ba41d)), closes [#815](https://github.com/Lundalogik/lime-elements/issues/815)
* **input-field:** add date and time related types to set of valid input types ([da0656d](https://github.com/Lundalogik/lime-elements/commit/da0656db55a5150c940296cc72c29ac320ec5fbd))

## [26.39.1](https://github.com/Lundalogik/lime-elements/compare/v26.39.0...v26.39.1) (2020-07-08)


### Bug Fixes

* **input-field:** remove state decorator ([90fa45b](https://github.com/Lundalogik/lime-elements/commit/90fa45becdca1a9a3d598936c88a27bd414bfdd3))
* **picker:** move chip creation to componentWillLoad ([8d1ed30](https://github.com/Lundalogik/lime-elements/commit/8d1ed3004c1d264b59500abc81dc2662f41bcded))
* **switch:** remove state decorator ([2c3be6d](https://github.com/Lundalogik/lime-elements/commit/2c3be6de45a559660fd91aea456b7577b6e0dc71))

# [26.39.0](https://github.com/Lundalogik/lime-elements/compare/v26.38.0...v26.39.0) (2020-07-08)


### Features

* **table:** added props factory function to table component definition interface ([40f6d34](https://github.com/Lundalogik/lime-elements/commit/40f6d3420d28ba890e8a2ec244ace2ce59fe03ad))

# [26.38.0](https://github.com/Lundalogik/lime-elements/compare/v26.37.1...v26.38.0) (2020-07-08)


### Features

* make dropdowns (menu, select, etc) appear above trigger if not enough space below ([d11dd71](https://github.com/Lundalogik/lime-elements/commit/d11dd71e910130eb0f561922f9ecaf202ef18b3f))

## [26.37.1](https://github.com/Lundalogik/lime-elements/compare/v26.37.0...v26.37.1) (2020-07-07)


### Bug Fixes

* **schema-field:** reset dependent fields when another fields changes ([4f2e9e1](https://github.com/Lundalogik/lime-elements/commit/4f2e9e12c84bbfc5f497279857ba76f9b21a0519))

# [26.37.0](https://github.com/Lundalogik/lime-elements/compare/v26.36.0...v26.37.0) (2020-07-07)


### Features

* **shadows:** add shadow variable for bottom bars ([3fa31c3](https://github.com/Lundalogik/lime-elements/commit/3fa31c3ea347794bfbe0adaa8f75cf47931d1811))

# [26.36.0](https://github.com/Lundalogik/lime-elements/compare/v26.35.4...v26.36.0) (2020-07-07)


### Features

* **table:** add table component ([4dc36ae](https://github.com/Lundalogik/lime-elements/commit/4dc36ae2e5256f69998af9f63b5053ff5b27400a))

## [26.35.4](https://github.com/Lundalogik/lime-elements/compare/v26.35.3...v26.35.4) (2020-07-06)


### Bug Fixes

* **form:** use Ajv to validate instead of rjsf ([17bd0a6](https://github.com/Lundalogik/lime-elements/commit/17bd0a68bef6de76baf88dc5e892d9530b306ade))

## [26.35.3](https://github.com/Lundalogik/lime-elements/compare/v26.35.2...v26.35.3) (2020-07-06)


### Bug Fixes

* **schema-field:** change null to undefined for custom web components when appropriate ([63aa319](https://github.com/Lundalogik/lime-elements/commit/63aa3192ef4086d2c614e3c5773d92018328559e))

## [26.35.2](https://github.com/Lundalogik/lime-elements/compare/v26.35.1...v26.35.2) (2020-07-06)


### Bug Fixes

* **schema-form:** emit undefined instead of null for empty value ([befd7f0](https://github.com/Lundalogik/lime-elements/commit/befd7f0b4cf2e484490ed06e31cb3387152b41fa))

## [26.35.1](https://github.com/Lundalogik/lime-elements/compare/v26.35.0...v26.35.1) (2020-07-06)


### Bug Fixes

* **input:** style the inbuilt clear search button ([deab30d](https://github.com/Lundalogik/lime-elements/commit/deab30d2e82b86be9080a381539c4b0f5c0040b8))

# [26.35.0](https://github.com/Lundalogik/lime-elements/compare/v26.34.5...v26.35.0) (2020-07-01)


### Features

* **date-picker:** add `'nb'` for Norsk Bokmål as a permitted language option ([c69f92c](https://github.com/Lundalogik/lime-elements/commit/c69f92cb3f3e2576930bddc7ac73dc1f1f6e62d5))

## [26.34.5](https://github.com/Lundalogik/lime-elements/compare/v26.34.4...v26.34.5) (2020-06-30)


### Bug Fixes

* **button:** improve button styles ([bae48f3](https://github.com/Lundalogik/lime-elements/commit/bae48f309a6950ab26224421c56459021466dce4))

## [26.34.4](https://github.com/Lundalogik/lime-elements/compare/v26.34.3...v26.34.4) (2020-06-30)


### Bug Fixes

* **slider:** redesign the slider ([0ae3a41](https://github.com/Lundalogik/lime-elements/commit/0ae3a413a8cd8a692cb9d58ec0789a20a4e6e0cf))

## [26.34.3](https://github.com/Lundalogik/lime-elements/compare/v26.34.2...v26.34.3) (2020-06-29)


### Bug Fixes

* **table:** cells won't grow over specified max-width ([86a486b](https://github.com/Lundalogik/lime-elements/commit/86a486b769084532cd02c489be2674781998f5de))

## [26.34.2](https://github.com/Lundalogik/lime-elements/compare/v26.34.1...v26.34.2) (2020-06-29)


### Bug Fixes

* **select:** set focus on menu change not every update ([ce8379a](https://github.com/Lundalogik/lime-elements/commit/ce8379a71ab046b319ce26584cda30a6957352b2))

## [26.34.1](https://github.com/Lundalogik/lime-elements/compare/v26.34.0...v26.34.1) (2020-06-29)


### Bug Fixes

* upgrade replace-in-file from 6.0.0 to 6.1.0 ([83ceb07](https://github.com/Lundalogik/lime-elements/commit/83ceb0774b9926b2c1d72e90f2100ff4440150c5))

# [26.34.0](https://github.com/Lundalogik/lime-elements/compare/v26.33.1...v26.34.0) (2020-06-26)


### Features

* **table:** set default layout to fitColumns ([f51869d](https://github.com/Lundalogik/lime-elements/commit/f51869db01f162649e46c7150440c70381dfbe71))

## [26.33.1](https://github.com/Lundalogik/lime-elements/compare/v26.33.0...v26.33.1) (2020-06-26)


### Bug Fixes

* **tablulator-paginator:** style paginators ([2638b81](https://github.com/Lundalogik/lime-elements/commit/2638b813a2aecae812a82a880b1e7c62ebb6c4a4))

# [26.33.0](https://github.com/Lundalogik/lime-elements/compare/v26.32.0...v26.33.0) (2020-06-26)


### Features

* **button-group:** add component ([91a25f1](https://github.com/Lundalogik/lime-elements/commit/91a25f12e0804b715daeabd825957a9f43a48976))

# [26.32.0](https://github.com/Lundalogik/lime-elements/compare/v26.31.2...v26.32.0) (2020-06-25)


### Features

* **table:** add custom styles for low-density and interactive rows ([888f340](https://github.com/Lundalogik/lime-elements/commit/888f340a7ee8057a490fa426f0897663f5191c7f))

## [26.31.2](https://github.com/Lundalogik/lime-elements/compare/v26.31.1...v26.31.2) (2020-06-24)


### Bug Fixes

* **limel-select:** ensure select element don't crash when it's list element doesn't exist ([0240901](https://github.com/Lundalogik/lime-elements/commit/02409016060ecf0545e5d75ad18a398c29ad057d))

## [26.31.1](https://github.com/Lundalogik/lime-elements/compare/v26.31.0...v26.31.1) (2020-06-22)


### Bug Fixes

* **table:** make it more similar to current tables ([41e80dd](https://github.com/Lundalogik/lime-elements/commit/41e80ddcb9ddf1f004c6cc179ec8cc84cae278d0))
* **tabulator-arrow:** add more interactivity on hover, to hint columns are sortable ([3dbcb82](https://github.com/Lundalogik/lime-elements/commit/3dbcb8276213b506cbdade5932f82e62903a6d9e))

# [26.31.0](https://github.com/Lundalogik/lime-elements/compare/v26.30.1...v26.31.0) (2020-06-18)


### Features

* **tab-panel:** make it possible to scroll inside the content of a tab ([2285f47](https://github.com/Lundalogik/lime-elements/commit/2285f47e763ca9795d7c7fe0eaf94dc9a27046d6)), closes [Lundalogik/crm-feature#1141](https://github.com/Lundalogik/crm-feature/issues/1141)

## [26.30.1](https://github.com/Lundalogik/lime-elements/compare/v26.30.0...v26.30.1) (2020-06-17)


### Bug Fixes

* trigger release ([f9a823d](https://github.com/Lundalogik/lime-elements/commit/f9a823d7f42697b7d1baa8779e7af78ead2ea0dc))

# [26.30.0](https://github.com/Lundalogik/lime-elements/compare/v26.29.2...v26.30.0) (2020-06-16)


### Bug Fixes

* **chip-set:** remove mdc-chip__ripple div ([adeb6da](https://github.com/Lundalogik/lime-elements/commit/adeb6da7e72b02960ed9144fe23773acb2a3734d))
* **chip-set:** rewrite layout using grid ([f322b9e](https://github.com/Lundalogik/lime-elements/commit/f322b9e9f841f36b1609d11f451e6e3d8a133d39))


### Features

* **shadows:** add shadow styles for inset elements ([c952107](https://github.com/Lundalogik/lime-elements/commit/c9521077b07c86ce6d54b549016abcc1c49dac2b))

## [26.29.2](https://github.com/Lundalogik/lime-elements/compare/v26.29.1...v26.29.2) (2020-06-12)


### Bug Fixes

* **table:** add styles and animate sorting icon ([9a9e207](https://github.com/Lundalogik/lime-elements/commit/9a9e20754632cf05cbc6b34826cda8b0ef4b7eb2))
* **table:** add styles similar to our current tables ([6dc8736](https://github.com/Lundalogik/lime-elements/commit/6dc873676684765a90395409319c9e4ccab6ac1d))

## [26.29.1](https://github.com/Lundalogik/lime-elements/compare/v26.29.0...v26.29.1) (2020-06-12)


### Performance Improvements

* **button:** hide spinners to avoid constantly running animations ([680b455](https://github.com/Lundalogik/lime-elements/commit/680b455f58fe8585af24fbd39625379e4cf70eab))

# [26.29.0](https://github.com/Lundalogik/lime-elements/compare/v26.28.0...v26.29.0) (2020-06-04)


### Features

* **table:** created simple table component ([7fbd2b4](https://github.com/Lundalogik/lime-elements/commit/7fbd2b43822d89d130ab4ea63ded1f17fadc33d0))

# [26.28.0](https://github.com/Lundalogik/lime-elements/compare/v26.27.4...v26.28.0) (2020-06-03)


### Features

* **schema-form:** add support for custom components in place of SchemaFields ([8a34158](https://github.com/Lundalogik/lime-elements/commit/8a34158186b3534e5ee100790291a4647d00270d))

## [26.27.4](https://github.com/Lundalogik/lime-elements/compare/v26.27.3...v26.27.4) (2020-06-03)


### Bug Fixes

* **dialog:** fix broken max-height, so that dialog is never taller than viewport ([63b4584](https://github.com/Lundalogik/lime-elements/commit/63b4584d5b3778020b15b6ea84ad17793f4f43e5)), closes [#786](https://github.com/Lundalogik/lime-elements/issues/786)

## [26.27.3](https://github.com/Lundalogik/lime-elements/compare/v26.27.2...v26.27.3) (2020-05-29)


### Bug Fixes

* **chip-set:** render input really hidden when it's hidden ([1aa1fc0](https://github.com/Lundalogik/lime-elements/commit/1aa1fc06e23771f174cf4b1a7d2a0442fa3130de))

## [26.27.2](https://github.com/Lundalogik/lime-elements/compare/v26.27.1...v26.27.2) (2020-05-28)


### Bug Fixes

* **input-field:** fix alignment input field with error icon ([4b6eb17](https://github.com/Lundalogik/lime-elements/commit/4b6eb1744e49dda89ef9658cf758024052e03b7d))

## [26.27.1](https://github.com/Lundalogik/lime-elements/compare/v26.27.0...v26.27.1) (2020-05-28)


### Bug Fixes

* **input-field:** force the label truncate when container is too little ([3ea61a1](https://github.com/Lundalogik/lime-elements/commit/3ea61a18d18dfc405541414770f22177b14267da))
* **select:** force the label truncate when container is too little ([0a00e0f](https://github.com/Lundalogik/lime-elements/commit/0a00e0f277a56a996a6ac29d206b7742f1f6301e))

# [26.27.0](https://github.com/Lundalogik/lime-elements/compare/v26.26.1...v26.27.0) (2020-05-27)


### Features

* **chip-set:** improve styling when chip is selected for deletion using keyboard ([dc3a3f0](https://github.com/Lundalogik/lime-elements/commit/dc3a3f039c95194f1bdfa21c0a2fa2ec15d2281f))

## [26.26.1](https://github.com/Lundalogik/lime-elements/compare/v26.26.0...v26.26.1) (2020-05-26)


### Bug Fixes

* **chip-set:** unify styles with other input types ([7d86151](https://github.com/Lundalogik/lime-elements/commit/7d861516ca95e674cb2419e863c6968da0fb45a3))
* **input-field:** unify styles with other input types ([f587020](https://github.com/Lundalogik/lime-elements/commit/f587020c5e11684c7f6ec96d4f130cd01fc0a697))
* **select:** unify styles with other input types ([0b0cf77](https://github.com/Lundalogik/lime-elements/commit/0b0cf772b9dbb8228163294929bd4630588e869b))

# [26.26.0](https://github.com/Lundalogik/lime-elements/compare/v26.25.0...v26.26.0) (2020-05-22)


### Features

* **leadingIcon:** add leadingIcon for input type search ([c93ff74](https://github.com/Lundalogik/lime-elements/commit/c93ff740f18d4e03dd5eb4f6eb98297da4997f61))

# [26.25.0](https://github.com/Lundalogik/lime-elements/compare/v26.24.1...v26.25.0) (2020-05-18)


### Features

* **icon-button:** show label for icon button on hover ([3705198](https://github.com/Lundalogik/lime-elements/commit/3705198c5bbebab71becf400ddc9cffe66e5af49))

## [26.24.1](https://github.com/Lundalogik/lime-elements/compare/v26.24.0...v26.24.1) (2020-05-15)


### Bug Fixes

* upgrade jsx-dom from 6.4.10 to 6.4.13 ([4b4275a](https://github.com/Lundalogik/lime-elements/commit/4b4275a68554ea36ba62eb5c04b4a8a1a0ef1f4a))
* upgrade jsx-dom from 6.4.10 to 6.4.13 ([c8657fe](https://github.com/Lundalogik/lime-elements/commit/c8657fe71bdf8d800b93c287d283c1a5c17de657))

# [26.24.0](https://github.com/Lundalogik/lime-elements/compare/v26.23.0...v26.24.0) (2020-05-14)


### Bug Fixes

* **icon-button:** add support for native attribute `tabindex` ([3fd793d](https://github.com/Lundalogik/lime-elements/commit/3fd793dee8d47878fac618c4f55097c0e213a363))


### Features

* **icon:** add css property `--icon-background-color` ([31e2a4f](https://github.com/Lundalogik/lime-elements/commit/31e2a4fe3e2563e051fb749ab37c03a21548f4cf))
* **icon-button:** add support for "elevated" look ([b6fadf3](https://github.com/Lundalogik/lime-elements/commit/b6fadf3a501fa11421c9370a9281d62550eda886))
* **tab-bar:** add buttons when bar can be scrolled ([c9f23f2](https://github.com/Lundalogik/lime-elements/commit/c9f23f2fd497bf3e3439c41608ccb3660bbf6662)), closes [Lundalogik/crm-feature#1022](https://github.com/Lundalogik/crm-feature/issues/1022)

# [26.23.0](https://github.com/Lundalogik/lime-elements/compare/v26.22.1...v26.23.0) (2020-05-12)


### Features

* **menu:** allow menu to have fixed positioning ([673fe79](https://github.com/Lundalogik/lime-elements/commit/673fe791dc6d66baf15c4e33aaa9182725ffd251))
* **portal:** allow portal content to have fixed positioning ([32866de](https://github.com/Lundalogik/lime-elements/commit/32866deeaccef81a2997f9ff251f1942efe66bdb))

## [26.22.1](https://github.com/Lundalogik/lime-elements/compare/v26.22.0...v26.22.1) (2020-05-07)


### Bug Fixes

* **picker:** do not focus chipset on value change when a single picker value is chosen ([7f1a7b9](https://github.com/Lundalogik/lime-elements/commit/7f1a7b92c79020477321f51cfde8d99ab54cf94f))

# [26.22.0](https://github.com/Lundalogik/lime-elements/compare/v26.21.0...v26.22.0) (2020-05-06)


### Bug Fixes

* **chip-set:** import styles directly from limel-input-field ([2d5db9d](https://github.com/Lundalogik/lime-elements/commit/2d5db9d2492b0776f4448ea54f10326ecce13c3b))


### Features

* **input-field:** add custom styles to create interactive bg-colors ([f1387c3](https://github.com/Lundalogik/lime-elements/commit/f1387c38d1174413818ec9d5f870d529018924c0))

# [26.21.0](https://github.com/Lundalogik/lime-elements/compare/v26.20.1...v26.21.0) (2020-05-06)


### Features

* **menu-surface:** menu is kept open while scrolling ([d0adbd3](https://github.com/Lundalogik/lime-elements/commit/d0adbd3f089cef034b233c7a60f48b1132ea2626))
* **portal:** use popperjs for positioning ([0949aa0](https://github.com/Lundalogik/lime-elements/commit/0949aa0588f0c23cbec50ad852fab1d1efc2134e))

## [26.20.1](https://github.com/Lundalogik/lime-elements/compare/v26.20.0...v26.20.1) (2020-04-30)


### Bug Fixes

* **list:** center-align contents of lists with or without secondary text ([caae9e7](https://github.com/Lundalogik/lime-elements/commit/caae9e7161216f3663fb4b8d8c1394756ae94e61))

# [26.20.0](https://github.com/Lundalogik/lime-elements/compare/v26.19.4...v26.20.0) (2020-04-30)


### Features

* **list:** add custom class for lists that need striped style ([d81bc57](https://github.com/Lundalogik/lime-elements/commit/d81bc5704a66e0e00ed1d6369ee50b05206aa431))

## [26.19.4](https://github.com/Lundalogik/lime-elements/compare/v26.19.3...v26.19.4) (2020-04-30)


### Bug Fixes

* **picker:** ensure picker doesn't crash if its value is set to null ([09fbd86](https://github.com/Lundalogik/lime-elements/commit/09fbd86649bb5245f7abbc43b2dcfafcd78296d2))
* **picker:** ensure picker doesn't crash if portalId is null ([a6bc01f](https://github.com/Lundalogik/lime-elements/commit/a6bc01f3a1bc9681fc487bebe69e34ce98e7ff77))

## [26.19.3](https://github.com/Lundalogik/lime-elements/compare/v26.19.2...v26.19.3) (2020-04-28)


### Bug Fixes

* **picker:** remove handler for dismissed surface to keep the list and text when scrolling ([0e842a4](https://github.com/Lundalogik/lime-elements/commit/0e842a4064a2a315393c0b765da72853ddef3fb7))

## [26.19.2](https://github.com/Lundalogik/lime-elements/compare/v26.19.1...v26.19.2) (2020-04-28)


### Bug Fixes

* **menu:** click events not propagated ([8c42522](https://github.com/Lundalogik/lime-elements/commit/8c42522d8a06d55f01c23dba87da0ede7131c35d))

## [26.19.1](https://github.com/Lundalogik/lime-elements/compare/v26.19.0...v26.19.1) (2020-04-27)


### Bug Fixes

* **form:** return descriptive title if title can't be found due to an invalid value ([4887de3](https://github.com/Lundalogik/lime-elements/commit/4887de39080b8037dcadc4f54b2f6a1cef2992a5))

# [26.19.0](https://github.com/Lundalogik/lime-elements/compare/v26.18.3...v26.19.0) (2020-04-24)


### Bug Fixes

* **portal:** ensure components inside a portal is shown at the correct position only ([7c43692](https://github.com/Lundalogik/lime-elements/commit/7c43692cf91e81ed35f488dfd8b07165cc6d3cff))


### Features

* **list:** adds action menu to list item (again) ([fe60a4a](https://github.com/Lundalogik/lime-elements/commit/fe60a4a6c66effe109824d8f15f32a8d162c76a4))
* **menu:** use limel-portal (again) ([b27c8e9](https://github.com/Lundalogik/lime-elements/commit/b27c8e9c82913b150a9fd5800ef93de68e1d6de6))

## [26.18.3](https://github.com/Lundalogik/lime-elements/compare/v26.18.2...v26.18.3) (2020-04-23)


### Bug Fixes

* **chip-set:** make chips truncate when their content is too long ([0c05c63](https://github.com/Lundalogik/lime-elements/commit/0c05c633677050bd9ff8b6c16a29b4b3a28855ac))

## [26.18.2](https://github.com/Lundalogik/lime-elements/compare/v26.18.1...v26.18.2) (2020-04-23)


### Bug Fixes

* **form:** prevent argument mismatching in case the value is an array ([274c1c7](https://github.com/Lundalogik/lime-elements/commit/274c1c73f50305ec617be3f85deac0a3f942c14f)), closes [Lundalogik/crm-feature#1057](https://github.com/Lundalogik/crm-feature/issues/1057)

## [26.18.1](https://github.com/Lundalogik/lime-elements/compare/v26.18.0...v26.18.1) (2020-04-22)


### Bug Fixes

* **file:** disable text input ([99c7f19](https://github.com/Lundalogik/lime-elements/commit/99c7f19bf2f54e63426dfc60ae3b57d8a923826c))
* **file:** you end up in a loop when you try to upload a file ([f6c8c27](https://github.com/Lundalogik/lime-elements/commit/f6c8c2708a9ab13bc077dcc338bc8287b8d60795)), closes [#708](https://github.com/Lundalogik/lime-elements/issues/708)

# [26.18.0](https://github.com/Lundalogik/lime-elements/compare/v26.17.0...v26.18.0) (2020-04-17)


### Features

* **list:** make list items more distinct & interactive ([02e816c](https://github.com/Lundalogik/lime-elements/commit/02e816c6ae280d797c3b19f683604bd200b344c9))

# [26.17.0](https://github.com/Lundalogik/lime-elements/compare/v26.16.1...v26.17.0) (2020-04-16)


### Features

* add keyboard support for autocomplete on input-field ([7e96b0e](https://github.com/Lundalogik/lime-elements/commit/7e96b0e41ac3bc5dc972e31e13b9d98664f8abd3))

## [26.16.1](https://github.com/Lundalogik/lime-elements/compare/v26.16.0...v26.16.1) (2020-04-16)


### Bug Fixes

* **picker:** handle updates to the `searcher` property ([3153044](https://github.com/Lundalogik/lime-elements/commit/3153044295a40f1f3494b826710ec15a15e05ced)), closes [Lundalogik/crm-feature#1017](https://github.com/Lundalogik/crm-feature/issues/1017)

# [26.16.0](https://github.com/Lundalogik/lime-elements/compare/v26.15.0...v26.16.0) (2020-04-15)


### Features

* **tab-bar:** restyle tabs ([b39cd90](https://github.com/Lundalogik/lime-elements/commit/b39cd907b7343b373d4f32d248683ad6b59cbe16))

# [26.15.0](https://github.com/Lundalogik/lime-elements/compare/v26.14.1...v26.15.0) (2020-04-03)


### Features

* **chip-set:** make chips look elevated and interactive ([59416a4](https://github.com/Lundalogik/lime-elements/commit/59416a4f8efdc0b4ceb59b9bd1e145cbf62d3124))

## [26.14.1](https://github.com/Lundalogik/lime-elements/compare/v26.14.0...v26.14.1) (2020-04-03)


### Bug Fixes

* **list:** revert adding action menu to list item ([87c291a](https://github.com/Lundalogik/lime-elements/commit/87c291a240085950564b5035dfb471c3e7bdf4b1)), closes [#640](https://github.com/Lundalogik/lime-elements/issues/640) [Lundalogik/crm-feature#989](https://github.com/Lundalogik/crm-feature/issues/989)
* **menu:** revert the rebuild of limel-menu using limel-portal ([4b31ec9](https://github.com/Lundalogik/lime-elements/commit/4b31ec955926e3da3ef73c21016a43bd61f69779)), closes [Lundalogik/crm-feature#1008](https://github.com/Lundalogik/crm-feature/issues/1008)

# [26.14.0](https://github.com/Lundalogik/lime-elements/compare/v26.13.1...v26.14.0) (2020-04-03)


### Bug Fixes

* **chip-set:** correctly align leading icons inside chips ([8a20617](https://github.com/Lundalogik/lime-elements/commit/8a206173a95f860757bea44f6e02da4fabbcb50c))


### Features

* **chip-set:** improve the remove (x) button on the chip ([2d15fe7](https://github.com/Lundalogik/lime-elements/commit/2d15fe718b43959c5d953d6ad40c6a9cd6b7e842))

## [26.13.1](https://github.com/Lundalogik/lime-elements/compare/v26.13.0...v26.13.1) (2020-04-03)


### Bug Fixes

* **badge:** make badge respect attribute `hidden` ([7dbfbd8](https://github.com/Lundalogik/lime-elements/commit/7dbfbd8cdf45b5ee7528cbb3fd4bace2006e2fc3))
* **badge:** make badges with one digit appear like a full circle ([330e7b7](https://github.com/Lundalogik/lime-elements/commit/330e7b777fbe055b3a16b8187bf0f6b51255fa93)), closes [#678](https://github.com/Lundalogik/lime-elements/issues/678)
* **badge:** set all sizes to whole pixels for default font size ([c493286](https://github.com/Lundalogik/lime-elements/commit/c493286bc84258b53d01e48518199bd5b6dcda2b))

# [26.13.0](https://github.com/Lundalogik/lime-elements/compare/v26.12.1...v26.13.0) (2020-03-30)


### Features

* **list:** adds action menu to list item ([6ec77f0](https://github.com/Lundalogik/lime-elements/commit/6ec77f0a09159786eb6959fd59b506aff819dba7))
* **menu:** use limel-portal ([745638f](https://github.com/Lundalogik/lime-elements/commit/745638f7c355bb877b28d94f035c7e661071322b))
* **menu-surface:** adds support for full or auto width ([126bef2](https://github.com/Lundalogik/lime-elements/commit/126bef296131435e05d85c574c162f6f1d12f480))

## [26.12.1](https://github.com/Lundalogik/lime-elements/compare/v26.12.0...v26.12.1) (2020-03-26)


### Bug Fixes

* **icon:** remove unnecessary `console.error` logging ([f191ade](https://github.com/Lundalogik/lime-elements/commit/f191adef095a69ddadb8b2fb5089587b68d18b9b))

# [26.12.0](https://github.com/Lundalogik/lime-elements/compare/v26.11.4...v26.12.0) (2020-03-25)


### Features

* **tabs:** new tab-bar and tab-panel components ([857bbab](https://github.com/Lundalogik/lime-elements/commit/857bbab106e615c00a1648931d5df0b388b248a6)), closes [#627](https://github.com/Lundalogik/lime-elements/issues/627) [#631](https://github.com/Lundalogik/lime-elements/issues/631) [#636](https://github.com/Lundalogik/lime-elements/issues/636)

## [26.11.4](https://github.com/Lundalogik/lime-elements/compare/v26.11.3...v26.11.4) (2020-03-24)


### Bug Fixes

* **tab-bar:** style icon in tab bar ([f1a48ee](https://github.com/Lundalogik/lime-elements/commit/f1a48ee7fceb095ba816c39e96516f5870106c0b))

## [26.11.3](https://github.com/Lundalogik/lime-elements/compare/v26.11.2...v26.11.3) (2020-03-19)


### Bug Fixes

* **icon:** log to console instead of raising error when no container found ([af0013a](https://github.com/Lundalogik/lime-elements/commit/af0013af433c3bd57d851d89fd9179b300fb3a1b))

## [26.11.2](https://github.com/Lundalogik/lime-elements/compare/v26.11.1...v26.11.2) (2020-03-17)


### Reverts

* Revert "chore(package): add npm script `watch:prod` to enable integration with Angular in watch-build" ([fa1128c](https://github.com/Lundalogik/lime-elements/commit/fa1128cc0e3b50953dc86ac6385f760ac27d44d0))

## [26.11.1](https://github.com/Lundalogik/lime-elements/compare/v26.11.0...v26.11.1) (2020-03-16)


### Bug Fixes

* **styles:** fix broken css variables for shadows, introduced in v26.11.0 ([00099f7](https://github.com/Lundalogik/lime-elements/commit/00099f7b041e15e001903ae5afaf1ee60e2a1294))

# [26.11.0](https://github.com/Lundalogik/lime-elements/compare/v26.10.1...v26.11.0) (2020-03-13)


### Features

* **styles:** add colors that auto adjust to dark/light modes ([f3de6f7](https://github.com/Lundalogik/lime-elements/commit/f3de6f7cb10b606ad8a948cead2df0c2295dbe06))
* **styles:** add shadows for different depths ([b6293e2](https://github.com/Lundalogik/lime-elements/commit/b6293e2c8ccd07fb83691a2310e63419d1ae66e8))

## [26.10.1](https://github.com/Lundalogik/lime-elements/compare/v26.10.0...v26.10.1) (2020-03-10)


### Bug Fixes

* **picker:** make sure chipset has been created before setting focus ([7b1f0a9](https://github.com/Lundalogik/lime-elements/commit/7b1f0a9d4b11880bfe15a3a2c8456552f95bde18))
* **tab-bar:** export tab type from package ([1092dd5](https://github.com/Lundalogik/lime-elements/commit/1092dd581244d0c9386519cf865f2709a2ab70fa))

# [26.10.0](https://github.com/Lundalogik/lime-elements/compare/v26.9.0...v26.10.0) (2020-03-10)


### Features

* **badge:** add badge component ([6cd1d27](https://github.com/Lundalogik/lime-elements/commit/6cd1d27d07a6e9eb7022620d6fe0ca6e03ea5936))

# [26.9.0](https://github.com/Lundalogik/lime-elements/compare/v26.8.1...v26.9.0) (2020-03-04)


### Features

* **tab-bar:** add new component `limel-tab-bar` ([2078f88](https://github.com/Lundalogik/lime-elements/commit/2078f88c751a5a9ee5b36b53c6fe2b1493190247)), closes [#87](https://github.com/Lundalogik/lime-elements/issues/87)

## [26.8.1](https://github.com/Lundalogik/lime-elements/compare/v26.8.0...v26.8.1) (2020-03-04)


### Bug Fixes

* **checkbox:** add ripple for indication of element focus ([945ba74](https://github.com/Lundalogik/lime-elements/commit/945ba74c537833acfc96275ad41f969c9c15d3e4)), closes [#564](https://github.com/Lundalogik/lime-elements/issues/564)

# [26.8.0](https://github.com/Lundalogik/lime-elements/compare/v26.7.3...v26.8.0) (2020-03-03)


### Features

* **config:** add feature switches to config object ([6e59877](https://github.com/Lundalogik/lime-elements/commit/6e598775ddb6d12cc39778866b6c197171a06750))

## [26.7.3](https://github.com/Lundalogik/lime-elements/compare/v26.7.2...v26.7.3) (2020-02-25)


### Bug Fixes

* **array-field-collapsible-item:** open when deep empty ([de8657a](https://github.com/Lundalogik/lime-elements/commit/de8657aeee4c81f0ebfb1109d96d930df8666638))

## [26.7.2](https://github.com/Lundalogik/lime-elements/compare/v26.7.1...v26.7.2) (2020-02-24)


### Bug Fixes

* **limel-picker:** render picker dropdown in document.body ([8d10cf1](https://github.com/Lundalogik/lime-elements/commit/8d10cf1bd2762ff930db50f6adb77d009eb62500)), closes [Lundalogik/crm-feature#971](https://github.com/Lundalogik/crm-feature/issues/971)

## [26.7.1](https://github.com/Lundalogik/lime-elements/compare/v26.7.0...v26.7.1) (2020-02-21)


### Bug Fixes

* **input-field:** prevent changing number onwheel event ([1f93faa](https://github.com/Lundalogik/lime-elements/commit/1f93faaebe9b9fd05e38e8091277c6d0e0a25b4a))

# [26.7.0](https://github.com/Lundalogik/lime-elements/compare/v26.6.0...v26.7.0) (2020-02-21)


### Bug Fixes

* **form-common:** choose title by title, name, first required field or the first nonempty string ([5ee4ebf](https://github.com/Lundalogik/lime-elements/commit/5ee4ebfaf2f6df481add4c8bc5221186e0de8cb1))


### Features

* **array-field-collapsible-item:** expand collapsible section when new item ([0eda04a](https://github.com/Lundalogik/lime-elements/commit/0eda04a1ae7d71aab81308cc0454f941c9bd3f60))

# [26.6.0](https://github.com/Lundalogik/lime-elements/compare/v26.5.3...v26.6.0) (2020-02-18)


### Bug Fixes

* **dialog:** set dialog surface to 100% height ([3018d5b](https://github.com/Lundalogik/lime-elements/commit/3018d5b8ab5c83a0e7d20a0a236446d5b34f2079)), closes [#590](https://github.com/Lundalogik/lime-elements/issues/590)


### Features

* **input-field:** add support for textarea ([701e1b3](https://github.com/Lundalogik/lime-elements/commit/701e1b3f857b062c06debed828db6b4b464d6d0a))

## [26.5.3](https://github.com/Lundalogik/lime-elements/compare/v26.5.2...v26.5.3) (2020-02-18)


### Bug Fixes

* prevent multiple instances of docz ([736360b](https://github.com/Lundalogik/lime-elements/commit/736360b556068c1c931d1c9ec7cc10e754855a6a))

## [26.5.2](https://github.com/Lundalogik/lime-elements/compare/v26.5.1...v26.5.2) (2020-02-13)


### Bug Fixes

* **text-field:** show error icon ([5b00ae5](https://github.com/Lundalogik/lime-elements/commit/5b00ae521192af7e27b00521acc94e38a36a11ad))

## [26.5.1](https://github.com/Lundalogik/lime-elements/compare/v26.5.0...v26.5.1) (2020-02-06)


### Bug Fixes

* **form:** do not emit empty strings from input field ([45b4f3f](https://github.com/Lundalogik/lime-elements/commit/45b4f3f5817990b3e0ea7c2e3283359d56137045))
* **form:** set fields to invalid if they have initial invalid data ([2cc6a19](https://github.com/Lundalogik/lime-elements/commit/2cc6a19564136c4fa50dc6211d4a0e0b9458fba1))

# [26.5.0](https://github.com/Lundalogik/lime-elements/compare/v26.4.1...v26.5.0) (2020-02-06)


### Bug Fixes

* **form:** set unique id in schema ([47c080f](https://github.com/Lundalogik/lime-elements/commit/47c080f86c74de132632ba26ba71295f3f717515))


### Features

* **form:** release form component ([0f988b3](https://github.com/Lundalogik/lime-elements/commit/0f988b3861e928f3fdcfeaa7cebc1d37afde8a31))

## [26.4.1](https://github.com/Lundalogik/lime-elements/compare/v26.4.0...v26.4.1) (2020-02-05)


### Bug Fixes

* **select:** show arrow in the dropdown ([04e701c](https://github.com/Lundalogik/lime-elements/commit/04e701c4c6f10c8fab1f1964f1fcd6d013d0770a))

# [26.4.0](https://github.com/Lundalogik/lime-elements/compare/v26.3.0...v26.4.0) (2020-02-05)


### Bug Fixes

* **select:** adjust placement of floating label to match input-field component ([ec17e42](https://github.com/Lundalogik/lime-elements/commit/ec17e42f824a2de2c099b63d7daac87677723936))
* **select:** correct default selection, which was broken in v26.1.1 ([fd4dffc](https://github.com/Lundalogik/lime-elements/commit/fd4dffc017f83ac1f89f75bb773fb97c8e53ff61)), closes [#573](https://github.com/Lundalogik/lime-elements/issues/573)
* **select:** do not emit change event when component is mounted ([5fc1f19](https://github.com/Lundalogik/lime-elements/commit/5fc1f1959d84f682c915f986ada07a99a9a67d48)), closes [#574](https://github.com/Lundalogik/lime-elements/issues/574) [#573](https://github.com/Lundalogik/lime-elements/issues/573)
* **select:** fix `disabled` state that was broken in v26.1.1 ([c4e9dce](https://github.com/Lundalogik/lime-elements/commit/c4e9dce132bba04cb9387ec623ad3d131d62d313))


### Features

* **collapsible-section:** add support for actions in the header ([ddca821](https://github.com/Lundalogik/lime-elements/commit/ddca82191768636dfbe3789a5abe40e517054dcd))
* **collapsible-section:** background-color and padding can now be set using CSS variables ([b8d60cd](https://github.com/Lundalogik/lime-elements/commit/b8d60cd169f1be10bcff012676dde73e406e23d5)), closes [Lundalogik/crm-feature#968](https://github.com/Lundalogik/crm-feature/issues/968)
* **form:** add component for array items ([2c73e62](https://github.com/Lundalogik/lime-elements/commit/2c73e626ebbfc59536128788aa9cfd5737326e3b))
* **form:** add template for object fields ([ee8d9c3](https://github.com/Lundalogik/lime-elements/commit/ee8d9c3fd77cd643ad3aeec4a954b151f8aa2f54))
* **form:** set validation errors as helper text when invalid ([a5e5c28](https://github.com/Lundalogik/lime-elements/commit/a5e5c28bdd723cb7abfc9149621c66999027b881))

# [26.3.0](https://github.com/Lundalogik/lime-elements/compare/v26.2.0...v26.3.0) (2020-01-27)


### Bug Fixes

* **form:** convert dates to strings in date-picker change handler ([d94f6cc](https://github.com/Lundalogik/lime-elements/commit/d94f6ccb3f052a4c79b8f193116da233aab95900))
* **form:** remove double titles and descriptions from form fields ([f446ce4](https://github.com/Lundalogik/lime-elements/commit/f446ce4defd21c55238fd573ccd681a1e4396e6d))
* **select:** adjust bottom margin ([a1067b9](https://github.com/Lundalogik/lime-elements/commit/a1067b9c622a6ccdbb54364c0cea16e1e39f715f))


### Features

* **form:** add validation event ([eb8add2](https://github.com/Lundalogik/lime-elements/commit/eb8add2442e5149d243ad90ef2f0aaf381f141f2))

# [26.2.0](https://github.com/Lundalogik/lime-elements/compare/v26.1.1...v26.2.0) (2020-01-23)


### Features

* **checkbox:** add required property ([68f371d](https://github.com/Lundalogik/lime-elements/commit/68f371dfbbf5c085e2ab00ee6dacff9714221e66))
* **date-picker:** add helperText property ([5e47129](https://github.com/Lundalogik/lime-elements/commit/5e4712904573a4c95f2711f1df1699df58262838))
* **form:** add component for handling boolean values ([74d885f](https://github.com/Lundalogik/lime-elements/commit/74d885f50f7f75d5472a2b89ecc4711a9b160975))
* **form:** add component for handling date values ([cdd7d00](https://github.com/Lundalogik/lime-elements/commit/cdd7d0087251a61e3bddb00fdcabcf8ecffe59aa))
* **form:** add component for handling enum values ([6120929](https://github.com/Lundalogik/lime-elements/commit/6120929521ba96decc428dacc9a34c4f8e6520db))
* **form:** add component for handling text inputs ([317e654](https://github.com/Lundalogik/lime-elements/commit/317e654b4c065bb36661bd64622c610360f96a46))
* **input-field:** improve validation ([4afe197](https://github.com/Lundalogik/lime-elements/commit/4afe197141a3aa208689d3655d0a0b3d48268373))
* **select:** add helperText property ([8b3f26c](https://github.com/Lundalogik/lime-elements/commit/8b3f26c0ec223cb9f7e9299b1dc7d5f953667c92))

## [26.1.1](https://github.com/Lundalogik/lime-elements/compare/v26.1.0...v26.1.1) (2020-01-22)


### Bug Fixes

* **select:** make select work on mobile devices again ([4cf7a0e](https://github.com/Lundalogik/lime-elements/commit/4cf7a0e60a34745544397159b5507a2d7c0e6f1f))

# [26.1.0](https://github.com/Lundalogik/lime-elements/compare/v26.0.3...v26.1.0) (2020-01-21)


### Features

* **form:** first basic version of form component (unreleased) ([409d20e](https://github.com/Lundalogik/lime-elements/commit/409d20e8ef68c8fc00da12650daba77c37065775))

## [26.0.3](https://github.com/Lundalogik/lime-elements/compare/v26.0.2...v26.0.3) (2020-01-09)


### Bug Fixes

* **select:** don't set focus on first item if null ([6b84454](https://github.com/Lundalogik/lime-elements/commit/6b84454b546adcbd36535ad426631d983377dccd))

## [26.0.2](https://github.com/Lundalogik/lime-elements/compare/v26.0.1...v26.0.2) (2019-12-19)


### Bug Fixes

* **list:** update template for single line list items ([15d7a9e](https://github.com/Lundalogik/lime-elements/commit/15d7a9e77f22e71b1bf3bec403db3d764fd4b0b7))

## [26.0.1](https://github.com/Lundalogik/lime-elements/compare/v26.0.0...v26.0.1) (2019-12-12)


### Bug Fixes

* **button:** update markup to satisfy changes in material 4.0.0 ([58dbb4d](https://github.com/Lundalogik/lime-elements/commit/58dbb4dddca31aefcac87d275268794188fb3c9e))
* **chip-set:** adjust top margin of label in input field ([7de29cc](https://github.com/Lundalogik/lime-elements/commit/7de29cc83dc58705e43657887472da4db7d242eb)), closes [#402](https://github.com/Lundalogik/lime-elements/issues/402)
* **chip-set:** update markup to satisfy changes in material 4.0.0 ([041dfcb](https://github.com/Lundalogik/lime-elements/commit/041dfcb6d126bb623d4637f095d2e46b68fae415)), closes [#402](https://github.com/Lundalogik/lime-elements/issues/402)
* **dialog:** set height of surface to 100% in fullscreen mode ([2d7b0a1](https://github.com/Lundalogik/lime-elements/commit/2d7b0a1abe5112abe3adf59833d8b08a5c64a7b8)), closes [#402](https://github.com/Lundalogik/lime-elements/issues/402)
* **list:** do not filter disabled list items ([b0bd2df](https://github.com/Lundalogik/lime-elements/commit/b0bd2dfb0ce706694630c028e7fe0e35e24cbc84)), closes [#402](https://github.com/Lundalogik/lime-elements/issues/402)
* **package:** update @limetech/material-components-web to version 2.3.1 ([1a724ee](https://github.com/Lundalogik/lime-elements/commit/1a724eec729f961352e7675fd2f3a34107cc603b))
* **package:** update @limetech/material-components-web to version 3.1.1 ([8d4bdcf](https://github.com/Lundalogik/lime-elements/commit/8d4bdcf4f3b49089c4aafb38d60c0d82e00365d3)), closes [#402](https://github.com/Lundalogik/lime-elements/issues/402)
* **package:** update @limetech/material-components-web to version 4.0.0 ([4d08006](https://github.com/Lundalogik/lime-elements/commit/4d08006ce28a976204a4bc7b0fedacecab7860e2))
* **select:** change should not fire when option is disabled ([90e8e0a](https://github.com/Lundalogik/lime-elements/commit/90e8e0acff885923a26d0f2824dc933204d1569a)), closes [#402](https://github.com/Lundalogik/lime-elements/issues/402)

# [26.0.0](https://github.com/Lundalogik/lime-elements/compare/v25.2.0...v26.0.0) (2019-12-06)


### Features

* **grid:** set default row height to 2.5rem (40px) ([8c1a818](https://github.com/Lundalogik/lime-elements/commit/8c1a818137dcb9c545acd07ff10d2dff9a09cd86))


### BREAKING CHANGES

* **grid:** The default row height of the limel-grid component has been set to 2.5rem (40px).
The row height of any given instance of limel-grid can be set using the `--lime-grid-cell-height`
CSS variable.

# [25.2.0](https://github.com/Lundalogik/lime-elements/compare/v25.1.1...v25.2.0) (2019-12-06)


### Features

* **dialog:** indicate scrollable content via a shadow ([0855358](https://github.com/Lundalogik/lime-elements/commit/08553588517eeceb298607c55f3a5e6dc1430642)), closes [#312](https://github.com/Lundalogik/lime-elements/issues/312)

## [25.1.1](https://github.com/Lundalogik/lime-elements/compare/v25.1.0...v25.1.1) (2019-12-03)


### Bug Fixes

* **dialog:** prevent header from shrinking due to large body ([d5707dd](https://github.com/Lundalogik/lime-elements/commit/d5707ddabf7a374bf6d48109fc43512d10307474))

# [25.1.0](https://github.com/Lundalogik/lime-elements/compare/v25.0.0...v25.1.0) (2019-11-28)


### Features

* **input-field:** add support for a helper text next to the input field ([10ba5e5](https://github.com/Lundalogik/lime-elements/commit/10ba5e591de5d444555847a20971444015803e87))

# [25.0.0](https://github.com/Lundalogik/lime-elements/compare/v24.6.2...v25.0.0) (2019-11-14)


### Bug Fixes

* **grid:** change default number of columns from 8 to 4 ([e40ce9a](https://github.com/Lundalogik/lime-elements/commit/e40ce9a0c4e0dcd61482284aba7f7ebce8f1aa38))
* **grid:** make sure the size of the grid is the same as the size of the `limel-grid` element ([b13be87](https://github.com/Lundalogik/lime-elements/commit/b13be878b78ab8a7977abe7acfc3cab1d3cf536c))
* **grid:** remove variable `--lime-grid-cell-width` ([b1b54de](https://github.com/Lundalogik/lime-elements/commit/b1b54defd294c8b25590086e11c8c8f9c7dafc22))
* **grid:** set `grid-auto-flow` to `row dense`, for better automatic layout if config is missing ([ade4f59](https://github.com/Lundalogik/lime-elements/commit/ade4f59f948e9e1aad05c26ff9d84c8a340cb229))


### Features

* **grid:** add variable `--lime-grid-gutter` with default of `16px`, for setting gutter width ([f88b968](https://github.com/Lundalogik/lime-elements/commit/f88b968226c7b0428de4ae3206db532db886fadc))
* **grid:** change default row height from 150px to 64px ([89648c2](https://github.com/Lundalogik/lime-elements/commit/89648c228fda09bef3af58989dcc41abb55ecffa))


### BREAKING CHANGES

* **grid:** The default row height for `limel-grid` has been changed from 150px to 64px.
* **grid:** The gutter width of limel-grid used to be hard-coded to 15px. The default value is
now 16px, but the value can be now be configured using the `--lime-grid-gutter` variable.
* **grid:** It is no longer possible to set a minimum column width. The column width is now
determined automatically from the width of the component, and the number of columns used.
* **grid:** The default number of columns for `limel-grid` has changed from `8` to `4`.

## [24.6.2](https://github.com/Lundalogik/lime-elements/compare/v24.6.1...v24.6.2) (2019-11-08)


### Bug Fixes

* **chip-set:** display correct size of trailing icon in Edge ([d8de6db](https://github.com/Lundalogik/lime-elements/commit/d8de6db98fd6a2679c605e8d465eeb4e80342708))
* **list:** display correct size of icon in Edge ([787a713](https://github.com/Lundalogik/lime-elements/commit/787a713d5cb60486a801722fdb3deaabac95ea3e))

## [24.6.1](https://github.com/Lundalogik/lime-elements/compare/v24.6.0...v24.6.1) (2019-10-30)


### Bug Fixes

* **chip-set:** correct chip layout for very long chip texts ([50df5ae](https://github.com/Lundalogik/lime-elements/commit/50df5ae91a2c1983980c6db490237e96c7fab3ec)), closes [#496](https://github.com/Lundalogik/lime-elements/issues/496)

# [24.6.0](https://github.com/Lundalogik/lime-elements/compare/v24.5.1...v24.6.0) (2019-10-23)


### Features

* **picker:** no scroll in list when five or less items ([c129158](https://github.com/Lundalogik/lime-elements/commit/c1291586ef886ca57a6aa26f133688502d905a7c))

## [24.5.1](https://github.com/Lundalogik/lime-elements/compare/v24.5.0...v24.5.1) (2019-10-18)


### Bug Fixes

* **limel-select:** ellipsis when text overflow ([82d122c](https://github.com/Lundalogik/lime-elements/commit/82d122c))

# [24.5.0](https://github.com/Lundalogik/lime-elements/compare/v24.4.0...v24.5.0) (2019-10-18)


### Bug Fixes

* **icon:** change `medium` size icon from 41x41px to 40x40px ([2c2f3a7](https://github.com/Lundalogik/lime-elements/commit/2c2f3a7))
* **list:** add divider-lines between list-items for two-line lists with badge icons ([818af98](https://github.com/Lundalogik/lime-elements/commit/818af98)), closes [#465](https://github.com/Lundalogik/lime-elements/issues/465)
* **list:** correct alignment of icon lists to match that of same size badge-icon list ([80cd931](https://github.com/Lundalogik/lime-elements/commit/80cd931))
* **list:** set icon color to a non-transparent grey, since our icons look bad with transparency ([f58c84a](https://github.com/Lundalogik/lime-elements/commit/f58c84a))
* **picker:** increase icon size in dropdown list (use new default size) ([5370dae](https://github.com/Lundalogik/lime-elements/commit/5370dae))


### Features

* **chip-set:** add option `maxItems` to prevent adding new chips to input chip-set ([0d4b8eb](https://github.com/Lundalogik/lime-elements/commit/0d4b8eb))
* **list:** change default size of icons and badge-icons from `medium` to `small` ([4204c37](https://github.com/Lundalogik/lime-elements/commit/4204c37))
* **list:** make icon color configurable ([7651920](https://github.com/Lundalogik/lime-elements/commit/7651920))
* **picker:** prevent text-input when picker is "full" ([b50dc65](https://github.com/Lundalogik/lime-elements/commit/b50dc65))


### Performance Improvements

* **list-renderer:** remove `.bind()` from template ([0972bde](https://github.com/Lundalogik/lime-elements/commit/0972bde))

# [24.4.0](https://github.com/Lundalogik/lime-elements/compare/v24.3.0...v24.4.0) (2019-10-08)


### Features

* **chip-set:** the `setFocus` method now accepts an argument for emptying the input value ([961f52a](https://github.com/Lundalogik/lime-elements/commit/961f52a))
* **picker:** pressing escape in the dropdown empties and focuses the input ([6b06bb2](https://github.com/Lundalogik/lime-elements/commit/6b06bb2))

# [24.3.0](https://github.com/Lundalogik/lime-elements/compare/v24.2.2...v24.3.0) (2019-10-08)


### Bug Fixes

* **chip-set:** remove extra empty space below chips when picker is very narrow (hide the input) ([4524d9c](https://github.com/Lundalogik/lime-elements/commit/4524d9c)), closes [#455](https://github.com/Lundalogik/lime-elements/issues/455)


### Features

* **chip-set:** add `readonly` option ([c156fa2](https://github.com/Lundalogik/lime-elements/commit/c156fa2))
* **picker:** add `readonly` option ([6e653e7](https://github.com/Lundalogik/lime-elements/commit/6e653e7)), closes [#429](https://github.com/Lundalogik/lime-elements/issues/429)
* **picker:** add css variables for controlling component background color ([369b673](https://github.com/Lundalogik/lime-elements/commit/369b673))

## [24.2.2](https://github.com/Lundalogik/lime-elements/compare/v24.2.1...v24.2.2) (2019-10-07)


### Bug Fixes

* **button:** fix issue where button might show both "loading" and "loading done" state ([0b529c3](https://github.com/Lundalogik/lime-elements/commit/0b529c3))

## [24.2.1](https://github.com/Lundalogik/lime-elements/compare/v24.2.0...v24.2.1) (2019-10-02)


### Bug Fixes

* **chip-set:** supplies its own x-icon, independent of icon-set used ([3b21e72](https://github.com/Lundalogik/lime-elements/commit/3b21e72))
* **snackbar:** supplies its own x-icon, independent of icon-set used ([9d36977](https://github.com/Lundalogik/lime-elements/commit/9d36977))

# [24.2.0](https://github.com/Lundalogik/lime-elements/compare/v24.1.1...v24.2.0) (2019-10-02)


### Features

* **chip-set:** chips in input chip-set can be navigated by keyboard ([1710f58](https://github.com/Lundalogik/lime-elements/commit/1710f58))

## [24.1.1](https://github.com/Lundalogik/lime-elements/compare/v24.1.0...v24.1.1) (2019-09-30)


### Bug Fixes

* **dialog:** wait 100 ms after opening before dispatching resize event ([a430fc9](https://github.com/Lundalogik/lime-elements/commit/a430fc9))

# [24.1.0](https://github.com/Lundalogik/lime-elements/compare/v24.0.2...v24.1.0) (2019-09-30)


### Bug Fixes

* **chip-set:** don't hide the input when not focused ([88bef4a](https://github.com/Lundalogik/lime-elements/commit/88bef4a))
* **chip-set:** fix incorrect required-behavior ([f2c27fc](https://github.com/Lundalogik/lime-elements/commit/f2c27fc))
* **chip-set:** improve keyboard navigation for input chip-sets ([81edd58](https://github.com/Lundalogik/lime-elements/commit/81edd58))
* **chip-set:** reflect the properties `required` and `searchLabel` to attributes ([9ffe38c](https://github.com/Lundalogik/lime-elements/commit/9ffe38c))
* **list:** correct tab-flow for list-items ([62e1e3d](https://github.com/Lundalogik/lime-elements/commit/62e1e3d))
* **picker:** fix focus and blur behavior ([3365f09](https://github.com/Lundalogik/lime-elements/commit/3365f09)), closes [#428](https://github.com/Lundalogik/lime-elements/issues/428)
* **picker:** improve keyboard-navigation ([280165b](https://github.com/Lundalogik/lime-elements/commit/280165b))


### Features

* **chip-set:** add option and method to let consumer control when input is emptied ([5d33ec5](https://github.com/Lundalogik/lime-elements/commit/5d33ec5))

## [24.0.2](https://github.com/Lundalogik/lime-elements/compare/v24.0.1...v24.0.2) (2019-09-24)


### Bug Fixes

* **chip-set:** adds margin to search label ([68870ac](https://github.com/Lundalogik/lime-elements/commit/68870ac))
* **chip-set:** reflect properties `type` and `label` to attribute ([69aa336](https://github.com/Lundalogik/lime-elements/commit/69aa336))

## [24.0.1](https://github.com/Lundalogik/lime-elements/compare/v24.0.0...v24.0.1) (2019-09-20)


### Bug Fixes

* **picker:** the `interact` event supplies a `ListItem<number | string>` instead of `ListItem<any>` ([6df40e5](https://github.com/Lundalogik/lime-elements/commit/6df40e5))

# [24.0.0](https://github.com/Lundalogik/lime-elements/compare/v23.0.2...v24.0.0) (2019-09-18)


### Bug Fixes

* **picker:** remove leaking of internal implementation details through the `interact` event ([d4a3d11](https://github.com/Lundalogik/lime-elements/commit/d4a3d11))


### BREAKING CHANGES

* **picker:** The `interact` event used to supply a `Chip` used internally by limel-picker,
instead of the `ListItem` supplied to limel-picker by the consumer. This has now been fixed.
Implementations relying on the incorrect behavior will need to be updated.

## [23.0.2](https://github.com/Lundalogik/lime-elements/compare/v23.0.1...v23.0.2) (2019-09-16)


### Bug Fixes

* **chip set:** invalid state of required input chip-set not handled correctly ([c7dcbf1](https://github.com/Lundalogik/lime-elements/commit/c7dcbf1))
* **chip-set:** add required marker to input chip-set ([ae5a967](https://github.com/Lundalogik/lime-elements/commit/ae5a967))

## [23.0.1](https://github.com/Lundalogik/lime-elements/compare/v23.0.0...v23.0.1) (2019-09-13)


### Bug Fixes

* **select:** only emit one change event when selecting a value ([a7d4284](https://github.com/Lundalogik/lime-elements/commit/a7d4284))

# [23.0.0](https://github.com/Lundalogik/lime-elements/compare/v22.6.1...v23.0.0) (2019-09-10)


### Bug Fixes

* **icon:** move icons to private repo and packages ([acb2c01](https://github.com/Lundalogik/lime-elements/commit/acb2c01))


### BREAKING CHANGES

* **icon:** The icon set previously delivered with lime-elements
has been removed. The icons will be provided by the Lime products
which use lime-elements. External consumers of lime-elements need to
supply their own icons. Please see the documentation for limel-icon
for more info.

## [22.6.1](https://github.com/Lundalogik/lime-elements/compare/v22.6.0...v22.6.1) (2019-09-05)


### Bug Fixes

* **chip-set:** add missing export of chip types ([8b13349](https://github.com/Lundalogik/lime-elements/commit/8b13349))
* **date-picker:** add missing export of date types ([58b7d9b](https://github.com/Lundalogik/lime-elements/commit/58b7d9b))
* **file:** add missing export of file types ([5837c46](https://github.com/Lundalogik/lime-elements/commit/5837c46))
* **list:** add missing export of list types ([a360e1f](https://github.com/Lundalogik/lime-elements/commit/a360e1f))

# [22.6.0](https://github.com/Lundalogik/lime-elements/compare/v22.5.1...v22.6.0) (2019-09-04)


### Bug Fixes

* **select:** render select menu in document.body ([cc3f3f8](https://github.com/Lundalogik/lime-elements/commit/cc3f3f8)), closes [Lundalogik/crm-feature#839](https://github.com/Lundalogik/crm-feature/issues/839)
* **util/random-string:** make sure the string always begins with a letter, not a digit ([be69d87](https://github.com/Lundalogik/lime-elements/commit/be69d87))


### Features

* **menu-surface:** new menu-surface component ([1cbeb5d](https://github.com/Lundalogik/lime-elements/commit/1cbeb5d))
* **portal:** new component for rendering content within a different DOM node ([ad4cf42](https://github.com/Lundalogik/lime-elements/commit/ad4cf42))

## [22.5.1](https://github.com/Lundalogik/lime-elements/compare/v22.5.0...v22.5.1) (2019-09-04)


### Bug Fixes

* **slider:** fix background color for disabled slider ([2b1a890](https://github.com/Lundalogik/lime-elements/commit/2b1a890)), closes [#304](https://github.com/Lundalogik/lime-elements/issues/304)

# [22.5.0](https://github.com/Lundalogik/lime-elements/compare/v22.4.0...v22.5.0) (2019-09-02)


### Features

* **picker:** add optional message for empty search result ([b4c5b4e](https://github.com/Lundalogik/lime-elements/commit/b4c5b4e)), closes [#307](https://github.com/Lundalogik/lime-elements/issues/307)

# [22.4.0](https://github.com/Lundalogik/lime-elements/compare/v22.3.1...v22.4.0) (2019-08-27)


### Bug Fixes

* **picker:** makes icon size smaller in the list items ([4e9a9b5](https://github.com/Lundalogik/lime-elements/commit/4e9a9b5))


### Features

* **chip-set:** adds search label to input field when searching ([cf3d995](https://github.com/Lundalogik/lime-elements/commit/cf3d995))
* **picker:** adds support for displaying full list without cutting content ([e5f776f](https://github.com/Lundalogik/lime-elements/commit/e5f776f))

## [22.3.1](https://github.com/Lundalogik/lime-elements/compare/v22.3.0...v22.3.1) (2019-08-13)


### Bug Fixes

* **date-picker:** update date-picker when value is updated by the consumer ([5fe428e](https://github.com/Lundalogik/lime-elements/commit/5fe428e)), closes [Lundalogik/crm-feature#859](https://github.com/Lundalogik/crm-feature/issues/859)

# [22.3.0](https://github.com/Lundalogik/lime-elements/compare/v22.2.1...v22.3.0) (2019-08-09)


### Features

* **limel-banner:** add component ([8955a69](https://github.com/Lundalogik/lime-elements/commit/8955a69))

## [22.2.1](https://github.com/Lundalogik/lime-elements/compare/v22.2.0...v22.2.1) (2019-06-27)


### Bug Fixes

* **readme:** trigger release of updated readme to npmjs.com ([1cf3192](https://github.com/Lundalogik/lime-elements/commit/1cf3192))

# [22.2.0](https://github.com/Lundalogik/lime-elements/compare/v22.1.1...v22.2.0) (2019-06-26)


### Features

* open-source under Apache-2.0 license ([8064f12](https://github.com/Lundalogik/lime-elements/commit/8064f12)), closes [#369](https://github.com/Lundalogik/lime-elements/issues/369)

## [22.1.1](https://github.com/Lundalogik/lime-elements/compare/v22.1.0...v22.1.1) (2019-06-17)


### Bug Fixes

* **flatpickr:** switch to @limetech/flatpickr and update to v4.5.5 ([e61b756](https://github.com/Lundalogik/lime-elements/commit/e61b756))

# [22.1.0](https://github.com/Lundalogik/lime-elements/compare/v22.0.2...v22.1.0) (2019-06-17)


### Features

* **list:** add property for setting size on icon ([3aeda65](https://github.com/Lundalogik/lime-elements/commit/3aeda65))
* **snackbar:** add dismissible property ([019f706](https://github.com/Lundalogik/lime-elements/commit/019f706))

## [22.0.2](https://github.com/Lundalogik/lime-elements/compare/v22.0.1...v22.0.2) (2019-06-13)


### Bug Fixes

* **limel-icon:** undefined icons are not loaded ([dcabf2c](https://github.com/Lundalogik/lime-elements/commit/dcabf2c))

## [22.0.1](https://github.com/Lundalogik/lime-elements/compare/v22.0.0...v22.0.1) (2019-06-12)


### Bug Fixes

* **stencil:** use the 1.X version of @stencil/sass ([2625616](https://github.com/Lundalogik/lime-elements/commit/2625616))

# [22.0.0](https://github.com/Lundalogik/lime-elements/compare/v21.0.4...v22.0.0) (2019-06-12)


### Build System

* **package.json:** update @stencil/core ([097d81c](https://github.com/Lundalogik/lime-elements/commit/097d81c))


### BREAKING CHANGES

* **package.json:** **lime-elements** has been updated to use
Stencil One. This makes it incompatible with any components
built with older versions of Stencil. To upgrade to this
version of **lime-elements**, also upgrade your own code to
use Stencil One (v1.0.0 or later).

## [21.0.4](https://github.com/Lundalogik/lime-elements/compare/v21.0.3...v21.0.4) (2019-05-14)


### Bug Fixes

* **list:** remove black hover over list item with checkbox ([cbb4d34](https://github.com/Lundalogik/lime-elements/commit/cbb4d34)), closes [#364](https://github.com/Lundalogik/lime-elements/issues/364)

## [21.0.3](https://github.com/Lundalogik/lime-elements/compare/v21.0.2...v21.0.3) (2019-05-09)


### Bug Fixes

* **select:** increase z-index of scrim ([14e3b55](https://github.com/Lundalogik/lime-elements/commit/14e3b55))

## [21.0.2](https://github.com/Lundalogik/lime-elements/compare/v21.0.1...v21.0.2) (2019-05-08)


### Bug Fixes

* **select:** use correct color for the bottom line ([d40100f](https://github.com/Lundalogik/lime-elements/commit/d40100f))

## [21.0.1](https://github.com/Lundalogik/lime-elements/compare/v21.0.0...v21.0.1) (2019-04-30)


### Bug Fixes

* **dialog:** minor fixes ([468e3fc](https://github.com/Lundalogik/lime-elements/commit/468e3fc))

# [21.0.0](https://github.com/Lundalogik/lime-elements/compare/v20.2.0...v21.0.0) (2019-04-25)


### Features

* **list:** adds list type property ([3b4d5fc](https://github.com/Lundalogik/lime-elements/commit/3b4d5fc)), closes [#133](https://github.com/Lundalogik/lime-elements/issues/133)
* **radio-button:** adds radio button to be used in lists ([99dfb71](https://github.com/Lundalogik/lime-elements/commit/99dfb71))


### BREAKING CHANGES

* **list:** Removes selectable and multiple properties and adds type property.
With the type property it's now also possible to have radio button lists.

# [20.2.0](https://github.com/Lundalogik/lime-elements/compare/v20.1.1...v20.2.0) (2019-04-17)


### Bug Fixes

* **index.html:** add Roboto font ([d2a388b](https://github.com/Lundalogik/lime-elements/commit/d2a388b))


### Features

* **dialog:** add support for icon badge in header ([647d3fd](https://github.com/Lundalogik/lime-elements/commit/647d3fd)), closes [Lundalogik/crm-feature#698](https://github.com/Lundalogik/crm-feature/issues/698)

## [20.1.1](https://github.com/Lundalogik/lime-elements/compare/v20.1.0...v20.1.1) (2019-04-16)


### Bug Fixes

* **limel-file:** change event contains file ([4c51b40](https://github.com/Lundalogik/lime-elements/commit/4c51b40)), closes [#355](https://github.com/Lundalogik/lime-elements/issues/355)

# [20.1.0](https://github.com/Lundalogik/lime-elements/compare/v20.0.1...v20.1.0) (2019-04-10)


### Features

* **limel-file:** add component ([3b3f57c](https://github.com/Lundalogik/lime-elements/commit/3b3f57c)), closes [#303](https://github.com/Lundalogik/lime-elements/issues/303)

## [20.0.1](https://github.com/Lundalogik/lime-elements/compare/v20.0.0...v20.0.1) (2019-04-08)


### Bug Fixes

* **material:** update code to work with material 1.1.0 ([e2006de](https://github.com/Lundalogik/lime-elements/commit/e2006de))

# [20.0.0](https://github.com/Lundalogik/lime-elements/compare/v19.1.1...v20.0.0) (2019-04-05)


### Bug Fixes

* **list:** disabled items not handled correctly ([93a24cb](https://github.com/Lundalogik/lime-elements/commit/93a24cb))


### Code Refactoring

* **multi-select:** remove multi-select ([33fd282](https://github.com/Lundalogik/lime-elements/commit/33fd282)), closes [#203](https://github.com/Lundalogik/lime-elements/issues/203)


### Features

* **select:** add `required` property ([78be0a8](https://github.com/Lundalogik/lime-elements/commit/78be0a8)), closes [Lundalogik/lime-webclient#973](https://github.com/Lundalogik/lime-webclient/issues/973)
* **select:** add property for selecting multiple values ([1f7d193](https://github.com/Lundalogik/lime-elements/commit/1f7d193)), closes [#203](https://github.com/Lundalogik/lime-elements/issues/203)


### BREAKING CHANGES

* **multi-select:** multi-select component has been removed in favor of the select component that now
has a property called `multiple` that offers the same functionality in a better way

## [19.1.1](https://github.com/Lundalogik/lime-elements/compare/v19.1.0...v19.1.1) (2019-04-05)


### Performance Improvements

* **menu:** remove event listeners when component is destroyed ([3e7f71f](https://github.com/Lundalogik/lime-elements/commit/3e7f71f))

# [19.1.0](https://github.com/Lundalogik/lime-elements/compare/v19.0.1...v19.1.0) (2019-03-29)


### Features

* **list:** improve list to handle multiple selection with checkboxes ([78ffd99](https://github.com/Lundalogik/lime-elements/commit/78ffd99))

## [19.0.1](https://github.com/Lundalogik/lime-elements/compare/v19.0.0...v19.0.1) (2019-03-29)


### Performance Improvements

* **mdc:** remove event listeners when components are destroyed ([f0d131a](https://github.com/Lundalogik/lime-elements/commit/f0d131a))

# [19.0.0](https://github.com/Lundalogik/lime-elements/compare/v18.0.2...v19.0.0) (2019-03-29)


### Bug Fixes

* **chip set:** use icon badges ([898b247](https://github.com/Lundalogik/lime-elements/commit/898b247))


### Features

* **icon:** add `badge` attribute to limel-icon, and only add extra padding when true ([e4fa6a8](https://github.com/Lundalogik/lime-elements/commit/e4fa6a8))


### BREAKING CHANGES

* **icon:** Reverts breaking change to limel-icon from v17.0.0 (fd006f8).

## [18.0.2](https://github.com/Lundalogik/lime-elements/compare/v18.0.1...v18.0.2) (2019-03-28)


### Performance Improvements

* remove lamda and bind() from templates ([a048973](https://github.com/Lundalogik/lime-elements/commit/a048973)), closes [#346](https://github.com/Lundalogik/lime-elements/issues/346)

## [18.0.1](https://github.com/Lundalogik/lime-elements/compare/v18.0.0...v18.0.1) (2019-03-26)


### Bug Fixes

* **icon:** change box-sizing to border-box ([fb045e4](https://github.com/Lundalogik/lime-elements/commit/fb045e4))
* **spinner:** change box-sizing to border-box ([eff16bf](https://github.com/Lundalogik/lime-elements/commit/eff16bf))

# [18.0.0](https://github.com/Lundalogik/lime-elements/compare/v17.0.0...v18.0.0) (2019-03-26)


### Features

* change definition of 1rem from 10px to 16px ([35b00e5](https://github.com/Lundalogik/lime-elements/commit/35b00e5)), closes [Lundalogik/crm-feature#813](https://github.com/Lundalogik/crm-feature/issues/813)


### BREAKING CHANGES

* All size values have been rescaled to assume 1rem=16px.

# [17.0.0](https://github.com/Lundalogik/lime-elements/compare/v16.2.1...v17.0.0) (2019-03-21)


### Bug Fixes

* **color:** use correct color variable ([594eeb0](https://github.com/Lundalogik/lime-elements/commit/594eeb0))
* **icon:** define icon sizes ([eb706e7](https://github.com/Lundalogik/lime-elements/commit/eb706e7))
* **limel-multi-select:** stop internal change-events from propagating outside the component ([9b6a09a](https://github.com/Lundalogik/lime-elements/commit/9b6a09a))
* **limel-select:** stop internal change-events from propagating outside the component ([cbbade3](https://github.com/Lundalogik/lime-elements/commit/cbbade3))
* **picker:** added value generic property to list item ([e1e44b6](https://github.com/Lundalogik/lime-elements/commit/e1e44b6))
* **spinner:** define spinner sizes ([415065d](https://github.com/Lundalogik/lime-elements/commit/415065d))


### Code Refactoring

* **badge:** remove badge component ([8b81ef9](https://github.com/Lundalogik/lime-elements/commit/8b81ef9))
* **button group:** remove button group ([6df45df](https://github.com/Lundalogik/lime-elements/commit/6df45df))


### Features

* **flex container:** new flex container component ([e0a65ef](https://github.com/Lundalogik/lime-elements/commit/e0a65ef))
* **icon:** allow setting background color on icon ([fd006f8](https://github.com/Lundalogik/lime-elements/commit/fd006f8))


### BREAKING CHANGES

* **picker:** Removed the index signature from ListItem interface. Consumers of list items should
pass any custom values in the value property instead
* **button group:** Button group has been removed in favor of flex container, which offers the same
functionality with a cleaner API and is not constrained to only containing buttons
* **badge:** The badge component has been removed. Code that uses the badge component should use
the icon component instead, which offers the same functionality.

## [16.2.1](https://github.com/Lundalogik/lime-elements/compare/v16.2.0...v16.2.1) (2019-03-18)


### Bug Fixes

* **input field:** render icon correctly ([6517fcc](https://github.com/Lundalogik/lime-elements/commit/6517fcc))

# [16.2.0](https://github.com/Lundalogik/lime-elements/compare/v16.1.3...v16.2.0) (2019-03-08)


### Features

* **checkbox:** adds checkbox component ([ebc9272](https://github.com/Lundalogik/lime-elements/commit/ebc9272))

## [16.1.3](https://github.com/Lundalogik/lime-elements/compare/v16.1.2...v16.1.3) (2019-03-08)


### Bug Fixes

* **limel-date-picker:** fix momentjs locale being set globally by datepicker ([307f8d6](https://github.com/Lundalogik/lime-elements/commit/307f8d6)), closes [#323](https://github.com/Lundalogik/lime-elements/issues/323)

## [16.1.2](https://github.com/Lundalogik/lime-elements/compare/v16.1.1...v16.1.2) (2019-03-08)


### Bug Fixes

* correct scss imports so we do not break consumer builds ([c9b4fe6](https://github.com/Lundalogik/lime-elements/commit/c9b4fe6)), closes [#329](https://github.com/Lundalogik/lime-elements/issues/329)

## [16.1.1](https://github.com/Lundalogik/lime-elements/compare/v16.1.0...v16.1.1) (2019-03-07)


### Bug Fixes

* **chip set:** stop input change event from propagating ([e2c7b32](https://github.com/Lundalogik/lime-elements/commit/e2c7b32))
* **picker:** fix focus handling of picker in edge ([2017784](https://github.com/Lundalogik/lime-elements/commit/2017784))

# [16.1.0](https://github.com/Lundalogik/lime-elements/compare/v16.0.4...v16.1.0) (2019-03-07)


### Features

* **button:** add outlined button style ([26612a6](https://github.com/Lundalogik/lime-elements/commit/26612a6)), closes [#317](https://github.com/Lundalogik/lime-elements/issues/317)
* **button:** add support for icons on buttons ([37b2c5a](https://github.com/Lundalogik/lime-elements/commit/37b2c5a)), closes [#317](https://github.com/Lundalogik/lime-elements/issues/317)

## [16.0.4](https://github.com/Lundalogik/lime-elements/compare/v16.0.3...v16.0.4) (2019-03-05)


### Bug Fixes

* **chart:** remove exposed ChartJS interfaces ([0881b89](https://github.com/Lundalogik/lime-elements/commit/0881b89))

## [16.0.3](https://github.com/Lundalogik/lime-elements/compare/v16.0.2...v16.0.3) (2019-03-05)


### Bug Fixes

* **limel-date-picker:** don't format value for native pickers ([94be85f](https://github.com/Lundalogik/lime-elements/commit/94be85f))
* **limel-date-picker:** enable moving caret with keyboard ([dd49360](https://github.com/Lundalogik/lime-elements/commit/dd49360)), closes [#306](https://github.com/Lundalogik/lime-elements/issues/306)
* **limel-date-picker:** fix pickers broken on mobile ([5f17cd4](https://github.com/Lundalogik/lime-elements/commit/5f17cd4)), closes [#311](https://github.com/Lundalogik/lime-elements/issues/311)
* **limel-date-picker:** make sure week numbers are determined according to iso standard ([fd9dbf2](https://github.com/Lundalogik/lime-elements/commit/fd9dbf2))


### Performance Improvements

* **limel-date-picker:** on window resize, redraw picker instead of creating a new instance ([3327377](https://github.com/Lundalogik/lime-elements/commit/3327377))

## [16.0.2](https://github.com/Lundalogik/lime-elements/compare/v16.0.1...v16.0.2) (2019-02-26)


### Bug Fixes

* **limel-dialog:** open dialog on Microsoft Edge several times ([05c857f](https://github.com/Lundalogik/lime-elements/commit/05c857f)), closes [#314](https://github.com/Lundalogik/lime-elements/issues/314)

## [16.0.1](https://github.com/Lundalogik/lime-elements/compare/v16.0.0...v16.0.1) (2019-02-19)


### Bug Fixes

* **limel-date-picker:** change picker value when changing the input ([cf7dc60](https://github.com/Lundalogik/lime-elements/commit/cf7dc60)), closes [#297](https://github.com/Lundalogik/lime-elements/issues/297)

# [16.0.0](https://github.com/Lundalogik/lime-elements/compare/v15.0.7...v16.0.0) (2019-02-18)


### Features

* **limel-chart:** add component ([62b2b2c](https://github.com/Lundalogik/lime-elements/commit/62b2b2c)), closes [#287](https://github.com/Lundalogik/lime-elements/issues/287)
* **limel-grid:** add new limel-grid component ([5572b6b](https://github.com/Lundalogik/lime-elements/commit/5572b6b)), closes [#289](https://github.com/Lundalogik/lime-elements/issues/289) [Lundalogik/crm-feature#758](https://github.com/Lundalogik/crm-feature/issues/758)


### BREAKING CHANGES

* **limel-grid:** The scss-mixin grid-fullscreen has been removed. It is replaced by the new
limel-grid component.

## [15.0.7](https://github.com/Lundalogik/lime-elements/compare/v15.0.6...v15.0.7) (2019-02-15)


### Bug Fixes

* **limel-date-picker:** keep formatted value in sync ([1444754](https://github.com/Lundalogik/lime-elements/commit/1444754)), closes [#295](https://github.com/Lundalogik/lime-elements/issues/295)

## [15.0.6](https://github.com/Lundalogik/lime-elements/compare/v15.0.5...v15.0.6) (2019-02-13)


### Bug Fixes

* **limel-dialog:** set focus trap on hidden input field ([263937b](https://github.com/Lundalogik/lime-elements/commit/263937b))

## [15.0.5](https://github.com/Lundalogik/lime-elements/compare/v15.0.4...v15.0.5) (2019-02-08)


### Bug Fixes

* snackbar listens to action event again ([2860213](https://github.com/Lundalogik/lime-elements/commit/2860213))

## [15.0.4](https://github.com/Lundalogik/lime-elements/compare/v15.0.3...v15.0.4) (2019-02-05)


### Bug Fixes

* **limel-multi-select:** fix label styles ([9a6af5d](https://github.com/Lundalogik/lime-elements/commit/9a6af5d))

## [15.0.3](https://github.com/Lundalogik/lime-elements/compare/v15.0.2...v15.0.3) (2019-02-05)


### Bug Fixes

* **limel-picker:** focus event: stop propagration when element removed ([805c674](https://github.com/Lundalogik/lime-elements/commit/805c674))

## [15.0.2](https://github.com/Lundalogik/lime-elements/compare/v15.0.1...v15.0.2) (2019-02-05)


### Bug Fixes

* **limel-multi-select:** use floating label styles ([fcdd9dd](https://github.com/Lundalogik/lime-elements/commit/fcdd9dd))
* **limel-slider:** use floating label styles ([4a5e469](https://github.com/Lundalogik/lime-elements/commit/4a5e469))

## [15.0.1](https://github.com/Lundalogik/lime-elements/compare/v15.0.0...v15.0.1) (2019-02-04)


### Bug Fixes

* **multi-select:** change color on multi-select radio buttons to a dark-grey color ([7c47810](https://github.com/Lundalogik/lime-elements/commit/7c47810)), closes [#254](https://github.com/Lundalogik/lime-elements/issues/254)
* **multi-select:** remove border-bottom styling ([9e79010](https://github.com/Lundalogik/lime-elements/commit/9e79010))
* **slider:** remove border-bottom styling ([791ca7f](https://github.com/Lundalogik/lime-elements/commit/791ca7f))

# [15.0.0](https://github.com/Lundalogik/lime-elements/compare/v14.0.0...v15.0.0) (2019-02-01)


### chore

* **limel-autocomplete:** delete component ([8ef2ad2](https://github.com/Lundalogik/lime-elements/commit/8ef2ad2)), closes [#274](https://github.com/Lundalogik/lime-elements/issues/274)


### Features

* **limel-input-field:** add prop completions as suggestions value can autocomplete to ([0eddeae](https://github.com/Lundalogik/lime-elements/commit/0eddeae)), closes [#274](https://github.com/Lundalogik/lime-elements/issues/274)


### BREAKING CHANGES

* **limel-autocomplete:** limel-autocomplete is deleted, use limel-input-field with completions instead

# [14.0.0](https://github.com/Lundalogik/lime-elements/compare/v13.4.0...v14.0.0) (2019-02-01)


### Code Refactoring

* **grid:** rename mixin `fullpage-grid` to `grid-fullpage` ([749dc3f](https://github.com/Lundalogik/lime-elements/commit/749dc3f))


### BREAKING CHANGES

* **grid:** In order to better accommodate other grid mixins in the future, the mixin
`fullpage-grid` has been renamed to `grid-fullpage`.

# [13.4.0](https://github.com/Lundalogik/lime-elements/compare/v13.3.0...v13.4.0) (2019-01-31)


### Features

* **grid:** add scss mixin for fullpage-grid ([5b81baf](https://github.com/Lundalogik/lime-elements/commit/5b81baf)), closes [Lundalogik/crm-feature#709](https://github.com/Lundalogik/crm-feature/issues/709) [Lundalogik/crm-feature#710](https://github.com/Lundalogik/crm-feature/issues/710)

# [13.3.0](https://github.com/Lundalogik/lime-elements/compare/v13.2.3...v13.3.0) (2019-01-30)


### Bug Fixes

* **limel-slider:** change pin color to white ([b83c585](https://github.com/Lundalogik/lime-elements/commit/b83c585)), closes [#252](https://github.com/Lundalogik/lime-elements/issues/252)


### Features

* **limel-slider:** define highlight color by variable ([07b687c](https://github.com/Lundalogik/lime-elements/commit/07b687c)), closes [#252](https://github.com/Lundalogik/lime-elements/issues/252)

## [13.2.3](https://github.com/Lundalogik/lime-elements/compare/v13.2.2...v13.2.3) (2019-01-29)


### Bug Fixes

* **limel-dialog:** possible to create fullsize dialog ([590f592](https://github.com/Lundalogik/lime-elements/commit/590f592))

## [13.2.2](https://github.com/Lundalogik/lime-elements/compare/v13.2.1...v13.2.2) (2019-01-28)


### Bug Fixes

* **limel-select:** add icon to select list ([d0dc5a9](https://github.com/Lundalogik/lime-elements/commit/d0dc5a9))

## [13.2.1](https://github.com/Lundalogik/lime-elements/compare/v13.2.0...v13.2.1) (2019-01-28)


### Bug Fixes

* **input-field:** floating label if value is set or field is focused ([85d4c0e](https://github.com/Lundalogik/lime-elements/commit/85d4c0e))

# [13.2.0](https://github.com/Lundalogik/lime-elements/compare/v13.1.0...v13.2.0) (2019-01-25)


### Features

* **limel-badges:** allow badges ([161dfd4](https://github.com/Lundalogik/lime-elements/commit/161dfd4)), closes [Lundalogik/crm-feature#695](https://github.com/Lundalogik/crm-feature/issues/695)
* **limel-list:** overwrite material badge size in a list ([f825806](https://github.com/Lundalogik/lime-elements/commit/f825806)), closes [Lundalogik/crm-feature#695](https://github.com/Lundalogik/crm-feature/issues/695)

# [13.1.0](https://github.com/Lundalogik/lime-elements/compare/v13.0.3...v13.1.0) (2019-01-25)


### Bug Fixes

* **limel-picker:** set chip-set id from listItem id if existing ([d260906](https://github.com/Lundalogik/lime-elements/commit/d260906)), closes [#256](https://github.com/Lundalogik/lime-elements/issues/256)


### Features

* **limel-picker:** add interact event ([2e191d1](https://github.com/Lundalogik/lime-elements/commit/2e191d1)), closes [#256](https://github.com/Lundalogik/lime-elements/issues/256)

## [13.0.3](https://github.com/Lundalogik/lime-elements/compare/v13.0.2...v13.0.3) (2019-01-25)


### Bug Fixes

* add border to multi-select ([5986223](https://github.com/Lundalogik/lime-elements/commit/5986223))
* add border to slider ([b4784f1](https://github.com/Lundalogik/lime-elements/commit/b4784f1))

## [13.0.2](https://github.com/Lundalogik/lime-elements/compare/v13.0.1...v13.0.2) (2019-01-25)


### Bug Fixes

* change border bottom color on input fields ([2981bc9](https://github.com/Lundalogik/lime-elements/commit/2981bc9))
* input field for limel-input is white ([beae022](https://github.com/Lundalogik/lime-elements/commit/beae022))
* input field for limel-picker is white ([1533a54](https://github.com/Lundalogik/lime-elements/commit/1533a54))
* input field for limel-select is white ([62c8f5c](https://github.com/Lundalogik/lime-elements/commit/62c8f5c))

## [13.0.1](https://github.com/Lundalogik/lime-elements/compare/v13.0.0...v13.0.1) (2019-01-25)


### Bug Fixes

* **picker:** improve performance for limel-picker ([7b01dac](https://github.com/Lundalogik/lime-elements/commit/7b01dac))

# [13.0.0](https://github.com/Lundalogik/lime-elements/compare/v12.1.1...v13.0.0) (2019-01-21)


### Bug Fixes

* **collapsible-section:** header is set as a property ([f4074e4](https://github.com/Lundalogik/lime-elements/commit/f4074e4))


### BREAKING CHANGES

* **collapsible-section:** New interface for lime-collapsible-section

## [12.1.1](https://github.com/Lundalogik/lime-elements/compare/v12.1.0...v12.1.1) (2019-01-21)


### Bug Fixes

* **fonts:** change fontsizes ([478c608](https://github.com/Lundalogik/lime-elements/commit/478c608))

# [12.1.0](https://github.com/Lundalogik/lime-elements/compare/v12.0.5...v12.1.0) (2019-01-17)


### Features

* **limel-dialog:** add closing event ([e98038f](https://github.com/Lundalogik/lime-elements/commit/e98038f)), closes [#244](https://github.com/Lundalogik/lime-elements/issues/244)

## [12.0.5](https://github.com/Lundalogik/lime-elements/compare/v12.0.4...v12.0.5) (2019-01-14)


### Bug Fixes

* **limel-date-picker:** fix language config for provided translations ([58722f2](https://github.com/Lundalogik/lime-elements/commit/58722f2)), closes [#241](https://github.com/Lundalogik/lime-elements/issues/241)

## [12.0.4](https://github.com/Lundalogik/lime-elements/compare/v12.0.3...v12.0.4) (2019-01-14)


### Bug Fixes

* **limel-date-picker:** translate based on language property ([15ee7b6](https://github.com/Lundalogik/lime-elements/commit/15ee7b6)), closes [#241](https://github.com/Lundalogik/lime-elements/issues/241)

## [12.0.3](https://github.com/Lundalogik/lime-elements/compare/v12.0.2...v12.0.3) (2019-01-11)


### Bug Fixes

* **limel-menu:** decrease size of text and icons ([fed8c31](https://github.com/Lundalogik/lime-elements/commit/fed8c31)), closes [Lundalogik/crm-feature#704](https://github.com/Lundalogik/crm-feature/issues/704) [#210](https://github.com/Lundalogik/lime-elements/issues/210)

## [12.0.2](https://github.com/Lundalogik/lime-elements/compare/v12.0.1...v12.0.2) (2019-01-10)


### Bug Fixes

* **docs:** fix issue with documentation being published at incorrect path ([5e16f72](https://github.com/Lundalogik/lime-elements/commit/5e16f72))

## [12.0.1](https://github.com/Lundalogik/lime-elements/compare/v12.0.0...v12.0.1) (2019-01-10)


### Bug Fixes

* **limel-date-picker:** format property overwrites default date format ([3e0f4dc](https://github.com/Lundalogik/lime-elements/commit/3e0f4dc)), closes [#237](https://github.com/Lundalogik/lime-elements/issues/237)

# [12.0.0](https://github.com/Lundalogik/lime-elements/compare/v11.4.5...v12.0.0) (2019-01-10)


### Bug Fixes

* **limel-chip-set:** make method getEditMode async ([cee272f](https://github.com/Lundalogik/lime-elements/commit/cee272f))


### BREAKING CHANGES

* **limel-chip-set:** The method `getEditMode` on limel-chip-set is now async (it will return a promise).

## [11.4.5](https://github.com/Lundalogik/lime-elements/compare/v11.4.4...v11.4.5) (2019-01-03)


### Bug Fixes

* **limel-menu:** no word wrapping in menu items ([446a1be](https://github.com/Lundalogik/lime-elements/commit/446a1be)), closes [#230](https://github.com/Lundalogik/lime-elements/issues/230)

## [11.4.4](https://github.com/Lundalogik/lime-elements/compare/v11.4.3...v11.4.4) (2018-12-21)


### Bug Fixes

* **limel-date-picker:** fix width calculation if initially hidden ([d0f8de3](https://github.com/Lundalogik/lime-elements/commit/d0f8de3)), closes [#228](https://github.com/Lundalogik/lime-elements/issues/228)

## [11.4.3](https://github.com/Lundalogik/lime-elements/compare/v11.4.2...v11.4.3) (2018-12-19)


### Bug Fixes

* **install:** add postinstall.js to published files ([3e5a239](https://github.com/Lundalogik/lime-elements/commit/3e5a239))

## [11.4.2](https://github.com/Lundalogik/lime-elements/compare/v11.4.1...v11.4.2) (2018-12-18)


### Bug Fixes

* **build:** fix postinstall to check if files exist ([2093bfd](https://github.com/Lundalogik/lime-elements/commit/2093bfd))

## [11.4.1](https://github.com/Lundalogik/lime-elements/compare/v11.4.0...v11.4.1) (2018-12-18)


### Bug Fixes

* **limel-picker:** fix z-index in list by using mdc-menu-surface css ([83eb102](https://github.com/Lundalogik/lime-elements/commit/83eb102)), closes [#179](https://github.com/Lundalogik/lime-elements/issues/179)

# [11.4.0](https://github.com/Lundalogik/lime-elements/compare/v11.3.0...v11.4.0) (2018-12-18)


### Features

* **date-picker:** implements date pickers ([86d73a4](https://github.com/Lundalogik/lime-elements/commit/86d73a4))
* **translations:** adds translations support ([fa400ce](https://github.com/Lundalogik/lime-elements/commit/fa400ce))

# [11.3.0](https://github.com/Lundalogik/lime-elements/compare/v11.2.1...v11.3.0) (2018-12-17)


### Bug Fixes

* **picker:** show pre-selected items ([0a66848](https://github.com/Lundalogik/lime-elements/commit/0a66848))


### Features

* **limel-dialog:** add property closingActions incl. example ([fb14313](https://github.com/Lundalogik/lime-elements/commit/fb14313)), closes [#139](https://github.com/Lundalogik/lime-elements/issues/139)

## [11.2.1](https://github.com/Lundalogik/lime-elements/compare/v11.2.0...v11.2.1) (2018-12-03)


### Bug Fixes

* **chip-set:** add animation to input element ([ef0c717](https://github.com/Lundalogik/lime-elements/commit/ef0c717))

# [11.2.0](https://github.com/Lundalogik/lime-elements/compare/v11.1.0...v11.2.0) (2018-11-29)


### Features

* **colors:** define properties for setting colors ([a6c1333](https://github.com/Lundalogik/lime-elements/commit/a6c1333))

# [11.1.0](https://github.com/Lundalogik/lime-elements/compare/v11.0.0...v11.1.0) (2018-11-29)


### Features

* **chip-set:** allow setting background color when type is input ([7ba0fd3](https://github.com/Lundalogik/lime-elements/commit/7ba0fd3))
* **input-field:** allow setting background color of field ([c770fe2](https://github.com/Lundalogik/lime-elements/commit/c770fe2))
* **select:** allow setting background color of field ([c1e1375](https://github.com/Lundalogik/lime-elements/commit/c1e1375))

# [11.0.0](https://github.com/Lundalogik/lime-elements/compare/v10.0.2...v11.0.0) (2018-11-26)


### Bug Fixes

* **input-field:** onChange with number input emits a number instead of string ([1047f25](https://github.com/Lundalogik/lime-elements/commit/1047f25))


### chore

* **icons:** move icons to base folder ([0b58309](https://github.com/Lundalogik/lime-elements/commit/0b58309))


### Features

* **text-field:** adds support for number formatting ([661f9c6](https://github.com/Lundalogik/lime-elements/commit/661f9c6))


### BREAKING CHANGES

* **icons:** Icons have been moved out from the folder structure and are all located in one folder instead
* **text-field:** Renames limel-text-field to limel-input-field.

## [10.0.2](https://github.com/Lundalogik/lime-elements/compare/v10.0.1...v10.0.2) (2018-11-22)


### Bug Fixes

* **limel-picker:** fix issue where suggestions might be shown even if the component is blurred ([54afe6b](https://github.com/Lundalogik/lime-elements/commit/54afe6b)), closes [#194](https://github.com/Lundalogik/lime-elements/issues/194) [Lundalogik/crm-feature#636](https://github.com/Lundalogik/crm-feature/issues/636)

## [10.0.1](https://github.com/Lundalogik/lime-elements/compare/v10.0.0...v10.0.1) (2018-11-20)


### Bug Fixes

* **picker:** set focus to text field when picker receives focus ([7abe7a2](https://github.com/Lundalogik/lime-elements/commit/7abe7a2))

# [10.0.0](https://github.com/Lundalogik/lime-elements/compare/v9.9.0...v10.0.0) (2018-11-20)


### Bug Fixes

* **limel-chip-set:** change name of method `focus` to `setFocus` ([f849e8e](https://github.com/Lundalogik/lime-elements/commit/f849e8e))


### BREAKING CHANGES

* **limel-chip-set:** The method `focus()` on `limel-chip-set` has been renamed to `setFocus()`.

# [9.9.0](https://github.com/Lundalogik/lime-elements/compare/v9.8.0...v9.9.0) (2018-11-19)


### Features

* **list:** support for icons ([eb1021f](https://github.com/Lundalogik/lime-elements/commit/eb1021f))
* **menu:** support for icons ([7eee825](https://github.com/Lundalogik/lime-elements/commit/7eee825))
* **picker:** support for icons ([ccda724](https://github.com/Lundalogik/lime-elements/commit/ccda724))

# [9.8.0](https://github.com/Lundalogik/lime-elements/compare/v9.7.0...v9.8.0) (2018-11-15)


### Features

* **dialog:** allow size to be set through CSS variables ([fad7f1c](https://github.com/Lundalogik/lime-elements/commit/fad7f1c))

# [9.7.0](https://github.com/Lundalogik/lime-elements/compare/v9.6.0...v9.7.0) (2018-11-15)


### Features

* **limel-slider:** add factor property ([a412f72](https://github.com/Lundalogik/lime-elements/commit/a412f72)), closes [#196](https://github.com/Lundalogik/lime-elements/issues/196)

# [9.6.0](https://github.com/Lundalogik/lime-elements/compare/v9.5.0...v9.6.0) (2018-11-14)


### Bug Fixes

* **limel-collapsible-section:** call dispatchResizeEvent when section opened ([cc092fd](https://github.com/Lundalogik/lime-elements/commit/cc092fd)), closes [#192](https://github.com/Lundalogik/lime-elements/issues/192)


### Features

* **picker:** support for suggestions and searching for an empty value ([2e1a61c](https://github.com/Lundalogik/lime-elements/commit/2e1a61c))

# [9.5.0](https://github.com/Lundalogik/lime-elements/compare/v9.4.0...v9.5.0) (2018-11-13)


### Features

* **limel-icon-button:** add method `relayout` that triggers re-layout of hover-highlight ([2808c53](https://github.com/Lundalogik/lime-elements/commit/2808c53))

# [9.4.0](https://github.com/Lundalogik/lime-elements/compare/v9.3.0...v9.4.0) (2018-11-12)


### Features

* **limel-icon-button:** add component ([4423e20](https://github.com/Lundalogik/lime-elements/commit/4423e20)), closes [#186](https://github.com/Lundalogik/lime-elements/issues/186)

# [9.3.0](https://github.com/Lundalogik/lime-elements.git/compare/v9.2.1...v9.3.0) (2018-11-05)


### Bug Fixes

* **chip-set:** clear text value on input blur ([ad87834](https://github.com/Lundalogik/lime-elements.git/commit/ad87834))
* **linear-progress:** set text-align inside progress bar to left ([a6ca6b6](https://github.com/Lundalogik/lime-elements.git/commit/a6ca6b6))
* **list:** update variable name ([cdb1fe1](https://github.com/Lundalogik/lime-elements.git/commit/cdb1fe1))


### Features

* **picker:** only allow unique values to be selected ([04da767](https://github.com/Lundalogik/lime-elements.git/commit/04da767))
* **picker:** set focus on chip set input when selecting from the picker ([06b9eec](https://github.com/Lundalogik/lime-elements.git/commit/06b9eec))
* **picker:** use chip set input in picker ([ceddc15](https://github.com/Lundalogik/lime-elements.git/commit/ceddc15))

## [9.2.1](https://github.com/Lundalogik/lime-elements.git/compare/v9.2.0...v9.2.1) (2018-11-01)


### Bug Fixes

* **limel-slider:** adjust disabled state to material style ([ad5e0d6](https://github.com/Lundalogik/lime-elements.git/commit/ad5e0d6)), closes [#154](https://github.com/Lundalogik/lime-elements.git/issues/154)

# [9.2.0](https://github.com/Lundalogik/lime-elements.git/compare/v9.1.1...v9.2.0) (2018-10-30)


### Features

* **chip:** new chip-set component ([8a7ba66](https://github.com/Lundalogik/lime-elements.git/commit/8a7ba66))

## [9.1.1](https://github.com/Lundalogik/lime-elements/compare/v9.1.0...v9.1.1) (2018-10-29)


### Bug Fixes

* **icon:** reduces the gap between sizes to steps of 0.5 rem ([0b289c9](https://github.com/Lundalogik/lime-elements/commit/0b289c9))

# [9.1.0](https://github.com/Lundalogik/lime-elements/compare/v9.0.2...v9.1.0) (2018-10-24)


### Features

* **badge:** new badge component ([a01e0e1](https://github.com/Lundalogik/lime-elements/commit/a01e0e1))
* **linear-progress:** add indeterminate prop ([19ac5df](https://github.com/Lundalogik/lime-elements/commit/19ac5df))
* **linear-progress:** add variable for setting background color ([fcf6cad](https://github.com/Lundalogik/lime-elements/commit/fcf6cad))

## [9.0.2](https://github.com/Lundalogik/lime-elements/compare/v9.0.1...v9.0.2) (2018-10-23)


### Bug Fixes

* **icon:** modify icon sizes ([2db4043](https://github.com/Lundalogik/lime-elements/commit/2db4043))
* **icon:** replace all black colors with current color ([4c38ce6](https://github.com/Lundalogik/lime-elements/commit/4c38ce6))

## [9.0.1](https://github.com/Lundalogik/lime-elements/compare/v9.0.0...v9.0.1) (2018-10-19)


### Bug Fixes

* **limel-dialog:** trigger resize-event after opening-animation has finished ([34ab9dc](https://github.com/Lundalogik/lime-elements/commit/34ab9dc)), closes [#153](https://github.com/Lundalogik/lime-elements/issues/153)

# [9.0.0](https://github.com/Lundalogik/lime-elements/compare/v8.1.2...v9.0.0) (2018-10-17)


### Bug Fixes

* **limel-dialog:** fix broken markup and resulting styling of the header ([ff81efc](https://github.com/Lundalogik/lime-elements/commit/ff81efc))


### BREAKING CHANGES

* **limel-dialog:** The `header` slot has been replaced with the `heading` attribute.

## [8.1.2](https://github.com/Lundalogik/lime-elements/compare/v8.1.1...v8.1.2) (2018-10-16)


### Bug Fixes

* **collapsible-section:** remove unnecessary event dispatching ([068afd5](https://github.com/Lundalogik/lime-elements/commit/068afd5)), closes [#160](https://github.com/Lundalogik/lime-elements/issues/160)

## [8.1.1](https://github.com/Lundalogik/lime-elements/compare/v8.1.0...v8.1.1) (2018-10-16)


### Bug Fixes

* **dialog:** remove unnecessary event dispatching ([225d985](https://github.com/Lundalogik/lime-elements/commit/225d985)), closes [#159](https://github.com/Lundalogik/lime-elements/issues/159)

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
