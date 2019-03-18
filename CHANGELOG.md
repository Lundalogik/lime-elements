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
