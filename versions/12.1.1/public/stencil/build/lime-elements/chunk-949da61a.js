const h = window.LimeElements.h;

import { a as MDCFoundation, b as MDCComponent } from './chunk-6a33c04e.js';
import { b as MDCListFoundation, a as MDCList } from './chunk-0d7e14a7.js';

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDC Menu. Provides an interface for managing
 * - selected element classes
 * - get focused elements
 * - toggling a checkbox inside a list item
 *
 * Additionally, provides type information for the adapter to the Closure
 * compiler.
 *
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 *
 * @record
 */
class MDCMenuAdapter {
  /**
   * Adds a class to the element at the index provided.
   * @param {number} index
   * @param {string} className
   */
  addClassToElementAtIndex(index, className) {}

  /**
   * Removes a class from the element at the index provided
   * @param {number} index
   * @param {string} className
   */
  removeClassFromElementAtIndex(index, className) {}

  /**
   * Adds an attribute, with value, to the element at the index provided.
   * @param {number} index
   * @param {string} attr
   * @param {string} value
   */
  addAttributeToElementAtIndex(index, attr, value) {}

  /**
   * Removes an attribute from an element at the index provided.
   * @param {number} index
   * @param {string} attr
   */
  removeAttributeFromElementAtIndex(index, attr) {}

  /**
   * Returns true if the element contains the className.
   * @param {?HTMLElement} element
   * @param {string} className
   * @return {boolean} true if the element contains the className
   */
  elementContainsClass(element, className) {}

  /**
   * Closes the menu-surface.
   */
  closeSurface() {}

  /**
   * Returns the index for the element provided.
   * @param {?HTMLElement} element
   * @return {number} index of the element in the list or -1 if it is not in the list.
   */
  getElementIndex(element) {}

  /**
   * Returns the parentElement of the provided element.
   * @param {?HTMLElement} element
   * @return {?HTMLElement} parentElement of the element provided.
   */
  getParentElement(element) {}

  /**
   * Returns the element within the selectionGroup containing the selected element class.
   * @param {!HTMLElement} selectionGroup
   * @return {number} element within the selectionGroup that contains the selected element class.
   */
  getSelectedElementIndex(selectionGroup) {}

  /**
   * Emits an event using the evtData.
   * @param {{
 *    index: number
 *   }} evtData
   */
  notifySelected(evtData) {}
}

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/** @enum {string} */
const cssClasses = {
  ROOT: 'mdc-menu',
  MENU_SELECTED_LIST_ITEM: 'mdc-menu-item--selected',
  MENU_SELECTION_GROUP: 'mdc-menu__selection-group',
};

/** @enum {string} */
const strings = {
  SELECTED_EVENT: 'MDCMenu:selected',
  ARIA_SELECTED_ATTR: 'aria-selected',
  LIST_SELECTOR: '.mdc-list',
  CHECKBOX_SELECTOR: 'input[type="checkbox"]',
};

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* eslint no-unused-vars: [2, {"args": "none"}] */

/**
 * Adapter for MDCMenuSurface. Provides an interface for managing
 * - classes
 * - dom
 * - focus
 * - position
 * - dimensions
 * - event handlers
 *
 * Additionally, provides type information for the adapter to the Closure
 * compiler.
 *
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 *
 * @record
 */
class MDCMenuSurfaceAdapter {
  /** @param {string} className */
  addClass(className) {}

  /** @param {string} className */
  removeClass(className) {}

  /**
   * @param {string} className
   * @return {boolean}
   */
  hasClass(className) {}

  /** @return {boolean} */
  hasAnchor() {}

  /** Emits an event when the menu surface is closed. */
  notifyClose() {}

  /** Emits an event when the menu surface is opened. */
  notifyOpen() {}

  /**
   * @return {boolean}
   * @param {EventTarget} el
   */
  isElementInContainer(el) {}

  /** @return {boolean} */
  isRtl() {}

  /** @param {string} origin */
  setTransformOrigin(origin) {}

  /** @return {boolean} */
  isFocused() {}

  /** Saves the element that was focused before the menu surface was opened. */
  saveFocus() {}

  /** Restores focus to the element that was focused before the menu surface was opened. */
  restoreFocus() {}

  /** @return {boolean} */
  isFirstElementFocused() {}

  /** @return {boolean} */
  isLastElementFocused() {}

  /** Focuses the first focusable element in the menu-surface. */
  focusFirstElement() {}

  /** Focuses the first focusable element in the menu-surface. */
  focusLastElement() {}

  /** @return {!{width: number, height: number}} */
  getInnerDimensions() {}

  /** @return {!{width: number, height: number, top: number, right: number, bottom: number, left: number}} */
  getAnchorDimensions() {}

  /** @return {!{ width: number, height: number }} */
  getWindowDimensions() {}

  /** @return {!{ width: number, height: number }} */
  getBodyDimensions() {}

  /** @return {!{ width: number, height: number }} */
  getWindowScroll() {}

  /** @param {!{
  *   top: (string|undefined),
  *   right: (string|undefined),
  *   bottom: (string|undefined),
  *   left: (string|undefined)
  * }} position */
  setPosition(position) {}

  /** @param {string} height */
  setMaxHeight(height) {}
}

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/** @enum {string} */
const cssClasses$1 = {
  ANCHOR: 'mdc-menu-surface--anchor',
  ANIMATING_CLOSED: 'mdc-menu-surface--animating-closed',
  ANIMATING_OPEN: 'mdc-menu-surface--animating-open',
  FIXED: 'mdc-menu-surface--fixed',
  OPEN: 'mdc-menu-surface--open',
  ROOT: 'mdc-menu-surface',
};

/** @enum {string} */
const strings$1 = {
  CLOSED_EVENT: 'MDCMenuSurface:closed',
  OPENED_EVENT: 'MDCMenuSurface:opened',
  FOCUSABLE_ELEMENTS: 'button:not(:disabled), [href]:not([aria-disabled="true"]), input:not(:disabled), ' +
  'select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])',
};

/** @enum {number} */
const numbers = {
  // Total duration of menu-surface open animation.
  TRANSITION_OPEN_DURATION: 120,
  // Total duration of menu-surface close animation.
  TRANSITION_CLOSE_DURATION: 75,
  // Margin left to the edge of the viewport when menu-surface is at maximum possible height.
  MARGIN_TO_EDGE: 32,
  // Ratio of anchor width to menu-surface width for switching from corner positioning to center positioning.
  ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO: 0.67,
};

/**
 * Enum for bits in the {@see Corner) bitmap.
 * @enum {number}
 */
const CornerBit = {
  BOTTOM: 1,
  CENTER: 2,
  RIGHT: 4,
  FLIP_RTL: 8,
};

/**
 * Enum for representing an element corner for positioning the menu-surface.
 *
 * The START constants map to LEFT if element directionality is left
 * to right and RIGHT if the directionality is right to left.
 * Likewise END maps to RIGHT or LEFT depending on the directionality.
 *
 * @enum {number}
 */
const Corner = {
  TOP_LEFT: 0,
  TOP_RIGHT: CornerBit.RIGHT,
  BOTTOM_LEFT: CornerBit.BOTTOM,
  BOTTOM_RIGHT: CornerBit.BOTTOM | CornerBit.RIGHT,
  TOP_START: CornerBit.FLIP_RTL,
  TOP_END: CornerBit.FLIP_RTL | CornerBit.RIGHT,
  BOTTOM_START: CornerBit.BOTTOM | CornerBit.FLIP_RTL,
  BOTTOM_END: CornerBit.BOTTOM | CornerBit.RIGHT | CornerBit.FLIP_RTL,
};

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @typedef {{
 *   top: number,
 *   right: number,
 *   bottom: number,
 *   left: number
 * }}
 */
let AnchorMargin;

/* eslint-disable no-unused-vars */
/**
 * @typedef {{
 *   viewport: { width: number, height: number },
 *   viewportDistance: {top: number, right: number, bottom: number, left: number},
 *   anchorHeight: number,
 *   anchorWidth: number,
 *   surfaceHeight: number,
 *   surfaceWidth: number,
 *   bodyDimensions,
 *   windowScroll,
 * }}
 */
let AutoLayoutMeasurements;

/**
 * @extends {MDCFoundation<!MDCMenuSurfaceAdapter>}
 */
class MDCMenuSurfaceFoundation extends MDCFoundation {
  /** @return enum{cssClasses} */
  static get cssClasses() {
    return cssClasses$1;
  }

  /** @return enum{string} */
  static get strings() {
    return strings$1;
  }

  /** @return enum {number} */
  static get numbers() {
    return numbers;
  }

  /** @return enum{number} */
  static get Corner() {
    return Corner;
  }

  /**
   * {@see MDCMenuSurfaceAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCMenuSurfaceAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCMenuSurfaceAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      hasClass: () => false,
      hasAnchor: () => false,
      notifyClose: () => {},
      notifyOpen: () => {},
      isElementInContainer: () => false,
      isRtl: () => false,
      setTransformOrigin: () => {},
      isFocused: () => false,
      saveFocus: () => {},
      restoreFocus: () => {},
      isFirstElementFocused: () => {},
      isLastElementFocused: () => {},
      focusFirstElement: () => {},
      focusLastElement: () => {},
      getInnerDimensions: () => ({}),
      getAnchorDimensions: () => ({}),
      getWindowDimensions: () => ({}),
      getBodyDimensions: () => ({}),
      getWindowScroll: () => ({}),
      setPosition: () => {},
      setMaxHeight: () => {},
    });
  }

  /** @param {!MDCMenuSurfaceAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCMenuSurfaceFoundation.defaultAdapter, adapter));

    /** @private {boolean} */
    this.isOpen_ = false;
    /** @private {number} */
    this.openAnimationEndTimerId_ = 0;
    /** @private {number} */
    this.closeAnimationEndTimerId_ = 0;
    /** @private {number} */
    this.animationRequestId_ = 0;
    /** @private {!{ width: number, height: number }} */
    this.dimensions_;
    /** @private {!Corner} */
    this.anchorCorner_ = Corner.TOP_START;
    /** @private {!AnchorMargin} */
    this.anchorMargin_ = {top: 0, right: 0, bottom: 0, left: 0};
    /** @private {?AutoLayoutMeasurements} */
    this.measures_ = null;
    /** @private {boolean} */
    this.quickOpen_ = false;
    /** @private {boolean} */
    this.hoistedElement_ = false;
    /** @private {boolean} */
    this.isFixedPosition_ = false;
    /** @private {!{x: number, y: number}} */
    this.position_ = {x: 0, y: 0};
  }

  init() {
    const {ROOT, OPEN} = MDCMenuSurfaceFoundation.cssClasses;

    if (!this.adapter_.hasClass(ROOT)) {
      throw new Error(`${ROOT} class required in root element.`);
    }

    if (this.adapter_.hasClass(OPEN)) {
      this.isOpen_ = true;
    }
  }

  destroy() {
    clearTimeout(this.openAnimationEndTimerId_);
    clearTimeout(this.closeAnimationEndTimerId_);
    // Cancel any currently running animations.
    cancelAnimationFrame(this.animationRequestId_);
  }

  /**
   * @param {!Corner} corner Default anchor corner alignment of top-left menu surface corner.
   */
  setAnchorCorner(corner) {
    this.anchorCorner_ = corner;
  }

  /**
   * @param {!AnchorMargin} margin set of margin values from anchor.
   */
  setAnchorMargin(margin) {
    this.anchorMargin_.top = typeof margin.top === 'number' ? margin.top : 0;
    this.anchorMargin_.right = typeof margin.right === 'number' ? margin.right : 0;
    this.anchorMargin_.bottom = typeof margin.bottom === 'number' ? margin.bottom : 0;
    this.anchorMargin_.left = typeof margin.left === 'number' ? margin.left : 0;
  }

  /**
   * Used to indicate if the menu-surface is hoisted to the body.
   * @param {boolean} isHoisted
   */
  setIsHoisted(isHoisted) {
    this.hoistedElement_ = isHoisted;
  }

  /**
   * Used to set the menu-surface calculations based on a fixed position menu.
   * @param {boolean} isFixedPosition
   */
  setFixedPosition(isFixedPosition) {
    this.isFixedPosition_ = isFixedPosition;
  }

  /**
   * Sets the menu-surface position on the page.
   * @param {number} x
   * @param {number} y
   */
  setAbsolutePosition(x, y) {
    this.position_.x = this.typeCheckisFinite_(x) ? x : 0;
    this.position_.y = this.typeCheckisFinite_(y) ? y : 0;
  }

  /** @param {boolean} quickOpen */
  setQuickOpen(quickOpen) {
    this.quickOpen_ = quickOpen;
  }

  /**
   * Handle clicks and close if not within menu-surface element.
   * @param {!Event} evt
   */
  handleBodyClick(evt) {
    const el = evt.target;

    if (this.adapter_.isElementInContainer(el)) {
      return;
    }

    this.close();
  };

  /**
   * Handle keys that close the surface.
   * @param {!Event} evt
   */
  handleKeydown(evt) {
    const {keyCode, key, shiftKey} = evt;

    const isEscape = key === 'Escape' || keyCode === 27;
    const isTab = key === 'Tab' || keyCode === 9;

    if (isEscape) {
      this.close();
    } else if (isTab) {
      if (this.adapter_.isLastElementFocused() && !shiftKey) {
        this.adapter_.focusFirstElement();
        evt.preventDefault();
      } else if (this.adapter_.isFirstElementFocused() && shiftKey) {
        this.adapter_.focusLastElement();
        evt.preventDefault();
      }
    }
  }

  /**
   * @return {!AutoLayoutMeasurements} Measurements used to position menu surface popup.
   */
  getAutoLayoutMeasurements_() {
    let anchorRect = this.adapter_.getAnchorDimensions();
    const viewport = this.adapter_.getWindowDimensions();
    const bodyDimensions = this.adapter_.getBodyDimensions();
    const windowScroll = this.adapter_.getWindowScroll();

    if (!anchorRect) {
      anchorRect = /** @type {ClientRect} */ ({
        x: this.position_.x,
        y: this.position_.y,
        top: this.position_.y,
        bottom: this.position_.y,
        left: this.position_.x,
        right: this.position_.x,
        height: 0,
        width: 0,
      });
    }

    return {
      viewport,
      bodyDimensions,
      windowScroll,
      viewportDistance: {
        top: anchorRect.top,
        right: viewport.width - anchorRect.right,
        left: anchorRect.left,
        bottom: viewport.height - anchorRect.bottom,
      },
      anchorHeight: anchorRect.height,
      anchorWidth: anchorRect.width,
      surfaceHeight: this.dimensions_.height,
      surfaceWidth: this.dimensions_.width,
    };
  }

  /**
   * Computes the corner of the anchor from which to animate and position the menu surface.
   * @return {!Corner}
   * @private
   */
  getOriginCorner_() {
    // Defaults: open from the top left.
    let corner = Corner.TOP_LEFT;

    const {viewportDistance, anchorHeight, anchorWidth, surfaceHeight, surfaceWidth} = this.measures_;
    const isBottomAligned = Boolean(this.anchorCorner_ & CornerBit.BOTTOM);
    const availableTop = isBottomAligned ? viewportDistance.top + anchorHeight + this.anchorMargin_.bottom
      : viewportDistance.top + this.anchorMargin_.top;
    const availableBottom = isBottomAligned ? viewportDistance.bottom - this.anchorMargin_.bottom
      : viewportDistance.bottom + anchorHeight - this.anchorMargin_.top;

    const topOverflow = surfaceHeight - availableTop;
    const bottomOverflow = surfaceHeight - availableBottom;
    if (bottomOverflow > 0 && topOverflow < bottomOverflow) {
      corner |= CornerBit.BOTTOM;
    }

    const isRtl = this.adapter_.isRtl();
    const isFlipRtl = Boolean(this.anchorCorner_ & CornerBit.FLIP_RTL);
    const avoidHorizontalOverlap = Boolean(this.anchorCorner_ & CornerBit.RIGHT);
    const isAlignedRight = (avoidHorizontalOverlap && !isRtl) ||
      (!avoidHorizontalOverlap && isFlipRtl && isRtl);
    const availableLeft = isAlignedRight ? viewportDistance.left + anchorWidth + this.anchorMargin_.right :
      viewportDistance.left + this.anchorMargin_.left;
    const availableRight = isAlignedRight ? viewportDistance.right - this.anchorMargin_.right :
      viewportDistance.right + anchorWidth - this.anchorMargin_.left;

    const leftOverflow = surfaceWidth - availableLeft;
    const rightOverflow = surfaceWidth - availableRight;

    if ((leftOverflow < 0 && isAlignedRight && isRtl) ||
        (avoidHorizontalOverlap && !isAlignedRight && leftOverflow < 0) ||
        (rightOverflow > 0 && leftOverflow < rightOverflow)) {
      corner |= CornerBit.RIGHT;
    }

    return /** @type {Corner} */ (corner);
  }

  /**
   * @param {!Corner} corner Origin corner of the menu surface.
   * @return {number} Horizontal offset of menu surface origin corner from corresponding anchor corner.
   * @private
   */
  getHorizontalOriginOffset_(corner) {
    const {anchorWidth} = this.measures_;
    // isRightAligned corresponds to using the 'right' property on the surface.
    const isRightAligned = Boolean(corner & CornerBit.RIGHT);
    const avoidHorizontalOverlap = Boolean(this.anchorCorner_ & CornerBit.RIGHT);

    if (isRightAligned) {
      const rightOffset = avoidHorizontalOverlap ? anchorWidth - this.anchorMargin_.left : this.anchorMargin_.right;

      // For hoisted or fixed elements, adjust the offset by the difference between viewport width and body width so
      // when we calculate the right value (`adjustPositionForHoistedElement_`) based on the element position,
      // the right property is correct.
      if (this.hoistedElement_ || this.isFixedPosition_) {
        return rightOffset - (this.measures_.viewport.width - this.measures_.bodyDimensions.width);
      }

      return rightOffset;
    }

    return avoidHorizontalOverlap ? anchorWidth - this.anchorMargin_.right : this.anchorMargin_.left;
  }

  /**
   * @param {!Corner} corner Origin corner of the menu surface.
   * @return {number} Vertical offset of menu surface origin corner from corresponding anchor corner.
   * @private
   */
  getVerticalOriginOffset_(corner) {
    const {anchorHeight} = this.measures_;
    const isBottomAligned = Boolean(corner & CornerBit.BOTTOM);
    const avoidVerticalOverlap = Boolean(this.anchorCorner_ & CornerBit.BOTTOM);
    let y = 0;

    if (isBottomAligned) {
      y = avoidVerticalOverlap ? anchorHeight - this.anchorMargin_.top : -this.anchorMargin_.bottom;
    } else {
      y = avoidVerticalOverlap ? (anchorHeight + this.anchorMargin_.bottom) : this.anchorMargin_.top;
    }
    return y;
  }

  /**
   * @param {!Corner} corner Origin corner of the menu surface.
   * @return {number} Maximum height of the menu surface, based on available space. 0 indicates should not be set.
   * @private
   */
  getMenuSurfaceMaxHeight_(corner) {
    let maxHeight = 0;
    const {viewportDistance} = this.measures_;
    const isBottomAligned = Boolean(corner & CornerBit.BOTTOM);
    const {MARGIN_TO_EDGE} = MDCMenuSurfaceFoundation.numbers;

    // When maximum height is not specified, it is handled from css.
    if (isBottomAligned) {
      maxHeight = viewportDistance.top + this.anchorMargin_.top - MARGIN_TO_EDGE;
      if (!(this.anchorCorner_ & CornerBit.BOTTOM)) {
        maxHeight += this.measures_.anchorHeight;
      }
    } else {
      maxHeight = viewportDistance.bottom - this.anchorMargin_.bottom + this.measures_.anchorHeight - MARGIN_TO_EDGE;
      if (this.anchorCorner_ & CornerBit.BOTTOM) {
        maxHeight -= this.measures_.anchorHeight;
      }
    }

    return maxHeight;
  }

  /** @private */
  autoPosition_() {
    // Compute measurements for autoposition methods reuse.
    this.measures_ = this.getAutoLayoutMeasurements_();

    const corner = this.getOriginCorner_();
    const maxMenuSurfaceHeight = this.getMenuSurfaceMaxHeight_(corner);
    const verticalAlignment = (corner & CornerBit.BOTTOM) ? 'bottom' : 'top';
    let horizontalAlignment = (corner & CornerBit.RIGHT) ? 'right' : 'left';
    const horizontalOffset = this.getHorizontalOriginOffset_(corner);
    const verticalOffset = this.getVerticalOriginOffset_(corner);
    let position = {
      [horizontalAlignment]: horizontalOffset ? horizontalOffset : '0',
      [verticalAlignment]: verticalOffset ? verticalOffset : '0',
    };
    const {anchorWidth, surfaceWidth} = this.measures_;
    // Center align when anchor width is comparable or greater than menu surface, otherwise keep corner.
    if (anchorWidth / surfaceWidth > numbers.ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO) {
      horizontalAlignment = 'center';
    }

    // If the menu-surface has been hoisted to the body, it's no longer relative to the anchor element
    if (this.hoistedElement_ || this.isFixedPosition_) {
      position = this.adjustPositionForHoistedElement_(position);
    }

    for (const prop in position) {
      if (position.hasOwnProperty(prop) && position[prop] !== '0') {
        position[prop] = `${parseInt(position[prop], 10)}px`;
      }
    }

    this.adapter_.setTransformOrigin(`${horizontalAlignment} ${verticalAlignment}`);
    this.adapter_.setPosition(position);
    this.adapter_.setMaxHeight(maxMenuSurfaceHeight ? maxMenuSurfaceHeight + 'px' : '');

    // Clear measures after positioning is complete.
    this.measures_ = null;
  }

  /**
   * Calculates the offsets for positioning the menu-surface when the menu-surface has been
   * hoisted to the body.
   * @param {!{
   *   top: (string|undefined),
   *   right: (string|undefined),
   *   bottom: (string|undefined),
   *   left: (string|undefined)
   * }} position
   * @return {!{
   *   top: (string|undefined),
   *   right: (string|undefined),
   *   bottom: (string|undefined),
   *   left: (string|undefined)
   * }} position
   * @private
   */
  adjustPositionForHoistedElement_(position) {
    const {windowScroll, viewportDistance} = this.measures_;

    for (const prop in position) {
      if (position.hasOwnProperty(prop)) {
        // Hoisted surfaces need to have the anchor elements location on the page added to the
        // position properties for proper alignment on the body.
        if (viewportDistance.hasOwnProperty(prop)) {
          position[prop] = parseInt(position[prop], 10) + viewportDistance[prop];
        }

        // Surfaces that are absolutely positioned need to have additional calculations for scroll
        // and bottom positioning.
        if (!this.isFixedPosition_) {
          if (prop === 'top') {
            position[prop] = parseInt(position[prop], 10) + windowScroll.y;
          } else if (prop === 'bottom') {
            position[prop] = parseInt(position[prop], 10) - windowScroll.y;
          } else if (prop === 'left') {
            position[prop] = parseInt(position[prop], 10) + windowScroll.x;
          } else if (prop === 'right') {
            position[prop] = parseInt(position[prop], 10) - windowScroll.x;
          }
        }
      }
    }

    return position;
  }

  /**
   * Open the menu surface.
   */
  open() {
    this.adapter_.saveFocus();

    if (!this.quickOpen_) {
      this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
    }

    this.animationRequestId_ = requestAnimationFrame(() => {
      this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
      this.dimensions_ = this.adapter_.getInnerDimensions();
      this.autoPosition_();
      if (this.quickOpen_) {
        this.adapter_.notifyOpen();
      } else {
        this.openAnimationEndTimerId_ = setTimeout(() => {
          this.openAnimationEndTimerId_ = 0;
          this.adapter_.removeClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
          this.adapter_.notifyOpen();
        }, numbers.TRANSITION_OPEN_DURATION);
      }
    });
    this.isOpen_ = true;
  }

  /**
   * Closes the menu surface.
   */
  close() {
    if (!this.quickOpen_) {
      this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
    }

    requestAnimationFrame(() => {
      this.adapter_.removeClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
      if (this.quickOpen_) {
        this.adapter_.notifyClose();
      } else {
        this.closeAnimationEndTimerId_ = setTimeout(() => {
          this.closeAnimationEndTimerId_ = 0;
          this.adapter_.removeClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
          this.adapter_.notifyClose();
        }, numbers.TRANSITION_CLOSE_DURATION);
      }
    });

    this.isOpen_ = false;
    this.maybeRestoreFocus_();
  }

  /**
   * The last focused element when the menu surface was opened should regain focus, if the user is
   * focused on or within the menu surface when it is closed.
   * @private
   */
  maybeRestoreFocus_() {
    if (this.adapter_.isFocused() || this.adapter_.isElementInContainer(document.activeElement)) {
      this.adapter_.restoreFocus();
    }
  }

  /** @return {boolean} */
  isOpen() {
    return this.isOpen_;
  }

  /**
   * isFinite that doesn't force conversion to number type.
   * Equivalent to Number.isFinite in ES2015, but is not included in IE11.
   * @param {number} num
   * @return {boolean}
   * @private
   */
  typeCheckisFinite_(num) {
    return typeof num === 'number' && isFinite(num);
  }
}

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const ELEMENTS_KEY_ALLOWED_IN = ['input', 'button', 'textarea', 'select', 'a'];

/**
 * @extends {MDCFoundation<!MDCMenuAdapter>}
 */
class MDCMenuFoundation extends MDCFoundation {
  /** @return enum{cssClasses} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum{strings} */
  static get strings() {
    return strings;
  }

  /**
   * {@see MDCMenuAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCMenuAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCMenuAdapter} */ ({
      addClassToElementAtIndex: () => {},
      removeClassFromElementAtIndex: () => {},
      addAttributeToElementAtIndex: () => {},
      removeAttributeFromElementAtIndex: () => {},
      elementContainsClass: () => {},
      closeSurface: () => {},
      getElementIndex: () => {},
      getParentElement: () => {},
      getSelectedElementIndex: () => {},
      notifySelected: () => {},
    });
  }

  /** @param {!MDCMenuAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCMenuFoundation.defaultAdapter, adapter));

    /** @type {number} */
    this.closeAnimationEndTimerId_ = 0;
  }

  destroy() {
    if (this.closeAnimationEndTimerId_) {
      clearTimeout(this.closeAnimationEndTimerId_);
    }

    this.adapter_.closeSurface();
  }

  /**
   * Handler function for the keydown events.
   * @param {!Event} evt
   */
  handleKeydown(evt) {
    const {key, keyCode} = evt;

    const isSpace = key === 'Space' || keyCode === 32;
    const isEnter = key === 'Enter' || keyCode === 13;
    const isTab = key === 'Tab' || keyCode === 9;

    if (isSpace || isEnter) {
      this.handleAction_(evt);
    } else if (isTab) {
      this.adapter_.closeSurface();
    }
  }

  /**
   * Handler function for the click events.
   * @param {!Event} evt
   */
  handleClick(evt) {
    this.handleAction_(evt);
  }

  /**
   * Combined action handling for click/keypress events.
   * @param {!Event} evt
   * @private
   */
  handleAction_(evt) {
    const listItem = this.getListItem_(/** @type {HTMLElement} */ (evt.target));
    if (listItem) {
      this.handleSelection(listItem);
      this.preventDefaultEvent_(evt);
    }
  }

  /**
   * Handler for a selected list item.
   * @param {?HTMLElement} listItem
   */
  handleSelection(listItem) {
    const index = this.adapter_.getElementIndex(listItem);
    if (index < 0) {
      return;
    }

    this.adapter_.notifySelected({index});
    this.adapter_.closeSurface();

    // Wait for the menu to close before adding/removing classes that affect styles.
    this.closeAnimationEndTimerId_ = setTimeout(() => {
      const selectionGroup = this.getSelectionGroup_(listItem);

      if (selectionGroup !== null) {
        this.handleSelectionGroup_(/** @type {!HTMLElement} */ (selectionGroup), index);
      }
    }, MDCMenuSurfaceFoundation.numbers.TRANSITION_CLOSE_DURATION);
  }

  /**
   * Handles toggling the selected classes in a selection group when a
   * selection is made.
   * @param {!HTMLElement} selectionGroup
   * @param {number} index The selected index value
   * @private
   */
  handleSelectionGroup_(selectionGroup, index) {
    // De-select the previous selection in this group.
    const selectedIndex = this.adapter_.getSelectedElementIndex(selectionGroup);
    if (selectedIndex >= 0) {
      this.adapter_.removeAttributeFromElementAtIndex(selectedIndex, strings.ARIA_SELECTED_ATTR);
      this.adapter_.removeClassFromElementAtIndex(selectedIndex, cssClasses.MENU_SELECTED_LIST_ITEM);
    }
    // Select the new list item in this group.
    this.adapter_.addClassToElementAtIndex(index, cssClasses.MENU_SELECTED_LIST_ITEM);
    this.adapter_.addAttributeToElementAtIndex(index, strings.ARIA_SELECTED_ATTR, 'true');
  }

  /**
   * Returns the parent selection group of an element if one exists.
   * @param listItem
   * @return {?HTMLElement} parent selection group element or null.
   * @private
   */
  getSelectionGroup_(listItem) {
    let parent = this.adapter_.getParentElement(listItem);
    let isGroup = this.adapter_.elementContainsClass(parent, cssClasses.MENU_SELECTION_GROUP);

    // Iterate through ancestors until we find the group or get to the list.
    while (!isGroup && !this.adapter_.elementContainsClass(parent, MDCListFoundation.cssClasses.ROOT)) {
      parent = this.adapter_.getParentElement(parent);
      isGroup = this.adapter_.elementContainsClass(parent, cssClasses.MENU_SELECTION_GROUP);
    }

    if (isGroup) {
      return parent;
    } else {
      return null;
    }
  }

  /**
   * Find the first ancestor with the mdc-list-item class.
   * @param {?HTMLElement} target
   * @return {?HTMLElement}
   * @private
   */
  getListItem_(target) {
    let isListItem = this.adapter_.elementContainsClass(target, MDCListFoundation.cssClasses.LIST_ITEM_CLASS);

    while (!isListItem) {
      target = this.adapter_.getParentElement(target);
      if (target) {
        isListItem = this.adapter_.elementContainsClass(target, MDCListFoundation.cssClasses.LIST_ITEM_CLASS);
      } else { // target has no parent element.
        return null;
      }
    }

    return target;
  }

  /**
   * Ensures that preventDefault is only called if the containing element doesn't
   * consume the event, and it will cause an unintended scroll.
   * @param {!Event} evt
   * @private
   */
  preventDefaultEvent_(evt) {
    const target = /** @type {!HTMLElement} */ (evt.target);
    const tagName = `${target.tagName}`.toLowerCase();
    if (ELEMENTS_KEY_ALLOWED_IN.indexOf(tagName) === -1) {
      evt.preventDefault();
    }
  }
}

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/** @type {string|undefined} */
let storedTransformPropertyName_;

/**
 * Returns the name of the correct transform property to use on the current browser.
 * @param {!Window} globalObj
 * @param {boolean=} forceRefresh
 * @return {string}
 */
function getTransformPropertyName(globalObj, forceRefresh = false) {
  if (storedTransformPropertyName_ === undefined || forceRefresh) {
    const el = globalObj.document.createElement('div');
    const transformPropertyName = ('transform' in el.style ? 'transform' : 'webkitTransform');
    storedTransformPropertyName_ = transformPropertyName;
  }

  return storedTransformPropertyName_;
}

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @extends MDCComponent<!MDCMenuSurfaceFoundation>
 */
class MDCMenuSurface extends MDCComponent {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);

    /** @private {!Element} */
    this.previousFocus_;
    /** @private {!Element} */
    this.anchorElement;
    /** @private {Element} */
    this.firstFocusableElement_;
    /** @private {Element} */
    this.lastFocusableElement_;
    /** @private {!Function} */
    this.handleKeydown_;
    /** @private {!Function} */
    this.handleBodyClick_;
    /** @private {!Function} */
    this.registerBodyClickListener_;
    /** @private {!Function} */
    this.deregisterBodyClickListener_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCMenuSurface}
   */
  static attachTo(root) {
    return new MDCMenuSurface(root);
  }

  initialSyncWithDOM() {
    if (this.root_.parentElement && this.root_.parentElement.classList.contains(cssClasses$1.ANCHOR)) {
      this.anchorElement = this.root_.parentElement;
    }

    if (this.root_.classList.contains(cssClasses$1.FIXED)) {
      this.setFixedPosition(true);
    }

    this.handleKeydown_ = (evt) => this.foundation_.handleKeydown(evt);
    this.handleBodyClick_ = (evt) => this.foundation_.handleBodyClick(evt);

    this.registerBodyClickListener_ = () => document.body.addEventListener('click', this.handleBodyClick_);
    this.deregisterBodyClickListener_ = () => document.body.removeEventListener('click', this.handleBodyClick_);

    this.root_.addEventListener('keydown', this.handleKeydown_);
    this.root_.addEventListener(strings$1.OPENED_EVENT, this.registerBodyClickListener_);
    this.root_.addEventListener(strings$1.CLOSED_EVENT, this.deregisterBodyClickListener_);
  }

  destroy() {
    this.root_.removeEventListener('keydown', this.handleKeydown_);
    this.root_.removeEventListener(strings$1.OPENED_EVENT, this.registerBodyClickListener_);
    this.root_.removeEventListener(strings$1.CLOSED_EVENT, this.deregisterBodyClickListener_);
    super.destroy();
  }

  /** @return {boolean} */
  get open() {
    return this.foundation_.isOpen();
  }

  /** @param {boolean} value */
  set open(value) {
    if (value) {
      const focusableElements = this.root_.querySelectorAll(strings$1.FOCUSABLE_ELEMENTS);
      this.firstFocusableElement_ = focusableElements.length > 0 ? focusableElements[0] : null;
      this.lastFocusableElement_ = focusableElements.length > 0 ?
        focusableElements[focusableElements.length - 1] : null;
      this.foundation_.open();
    } else {
      this.foundation_.close();
    }
  }

  /**
   * Removes the menu-surface from it's current location and appends it to the
   * body to overcome any overflow:hidden issues.
   */
  hoistMenuToBody() {
    document.body.appendChild(this.root_.parentElement.removeChild(this.root_));
    this.setIsHoisted(true);
  }

  /**
   * Sets the foundation to use page offsets for an positioning when the menu
   * is hoisted to the body.
   * @param {boolean} isHoisted
   */
  setIsHoisted(isHoisted) {
    this.foundation_.setIsHoisted(isHoisted);
  }

  /**
   * Sets the element that the menu-surface is anchored to.
   * @param {!Element} element
   */
  setMenuSurfaceAnchorElement(element) {
    this.anchorElement = element;
  }

  /**
   * Sets the menu-surface to position: fixed.
   * @param {boolean} isFixed
   */
  setFixedPosition(isFixed) {
    if (isFixed) {
      this.root_.classList.add(cssClasses$1.FIXED);
    } else {
      this.root_.classList.remove(cssClasses$1.FIXED);
    }

    this.foundation_.setFixedPosition(isFixed);
  }

  /**
   * Sets the absolute x/y position to position based on. Requires the menu to be hoisted.
   * @param {number} x
   * @param {number} y
   */
  setAbsolutePosition(x, y) {
    this.foundation_.setAbsolutePosition(x, y);
    this.setIsHoisted(true);
  }

  /**
   * @param {!Corner} corner Default anchor corner alignment of top-left
   *     surface corner.
   */
  setAnchorCorner(corner) {
    this.foundation_.setAnchorCorner(corner);
  }

  /**
   * @param {!AnchorMargin} margin
   */
  setAnchorMargin(margin) {
    this.foundation_.setAnchorMargin(margin);
  }

  /** @param {boolean} quickOpen */
  set quickOpen(quickOpen) {
    this.foundation_.setQuickOpen(quickOpen);
  }

  /** @return {!MDCMenuSurfaceFoundation} */
  getDefaultFoundation() {
    return new MDCMenuSurfaceFoundation(
      /** @type {!MDCMenuSurfaceAdapter} */ (Object.assign({
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
        hasClass: (className) => this.root_.classList.contains(className),
        hasAnchor: () => !!this.anchorElement,
        notifyClose: () => this.emit(MDCMenuSurfaceFoundation.strings.CLOSED_EVENT, {}),
        notifyOpen: () => this.emit(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, {}),
        isElementInContainer: (el) => this.root_ === el || this.root_.contains(el),
        isRtl: () => getComputedStyle(this.root_).getPropertyValue('direction') === 'rtl',
        setTransformOrigin: (origin) => {
          this.root_.style[`${getTransformPropertyName(window)}-origin`] = origin;
        },
      },
      this.getFocusAdapterMethods_(),
      this.getDimensionAdapterMethods_())
      ));
  }

  /**
   * @return {!{
   * isFocused: function(): boolean,
   * saveFocus: function(),
   * restoreFocus: function(),
   * isFirstElementFocused: function(): boolean,
   * isLastElementFocused: function(): boolean,
   * focusFirstElement: function(),
   * focusLastElement: function(),
   * }}
   * @private
   */
  getFocusAdapterMethods_() {
    return {
      isFocused: () => document.activeElement === this.root_,
      saveFocus: () => {
        this.previousFocus_ = document.activeElement;
      },
      restoreFocus: () => {
        if (this.root_.contains(document.activeElement)) {
          if (this.previousFocus_ && this.previousFocus_.focus) {
            this.previousFocus_.focus();
          }
        }
      },
      isFirstElementFocused: () =>
        this.firstFocusableElement_ && this.firstFocusableElement_ === document.activeElement,
      isLastElementFocused: () =>
        this.lastFocusableElement_ && this.lastFocusableElement_ === document.activeElement,
      focusFirstElement: () =>
        this.firstFocusableElement_ && this.firstFocusableElement_.focus && this.firstFocusableElement_.focus(),
      focusLastElement: () =>
        this.lastFocusableElement_ && this.lastFocusableElement_.focus && this.lastFocusableElement_.focus(),
    };
  }

  /**
   * @return {!{
   * getInnerDimensions: function(),
   * getAnchorDimensions: function(): (HTMLElement | null | * | ClientRect),
   * getWindowDimensions: function(),
   * setPosition: function(*),
   * setMaxHeight: function(string)}}
   * @private
   */
  getDimensionAdapterMethods_() {
    return {
      getInnerDimensions: () => {
        return {width: this.root_.offsetWidth, height: this.root_.offsetHeight};
      },
      getAnchorDimensions: () => this.anchorElement && this.anchorElement.getBoundingClientRect(),
      getWindowDimensions: () => {
        return {width: window.innerWidth, height: window.innerHeight};
      },
      getBodyDimensions: () => {
        return {width: document.body.clientWidth, height: document.body.clientHeight};
      },
      getWindowScroll: () => {
        return {x: window.pageXOffset, y: window.pageYOffset};
      },
      setPosition: (position) => {
        this.root_.style.left = 'left' in position ? position.left : null;
        this.root_.style.right = 'right' in position ? position.right : null;
        this.root_.style.top = 'top' in position ? position.top : null;
        this.root_.style.bottom = 'bottom' in position ? position.bottom : null;
      },
      setMaxHeight: (height) => {
        this.root_.style.maxHeight = height;
      },
    };
  }
}

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @extends MDCComponent<!MDCMenuFoundation>
 */
class MDCMenu extends MDCComponent {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);
    /** @private {!MDCMenuSurface} */
    this.menuSurface_;
    /** @private {!MDCList} */
    this.list_;
    /** @private {!Function} */
    this.handleKeydown_;
    /** @private {!Function} */
    this.handleClick_;
    /** @private {!Function} */
    this.afterOpenedCallback_;
  }

  /**
   * @param {!HTMLElement} root
   * @return {!MDCMenu}
   */
  static attachTo(root) {
    return new MDCMenu(root);
  }

  initialize(
    menuSurfaceFactory = (el) => new MDCMenuSurface(el),
    listFactory = (el) => new MDCList(el)) {
    this.menuSurface_ = menuSurfaceFactory(this.root_);

    const list = this.root_.querySelector(strings.LIST_SELECTOR);
    if (list) {
      this.list_ = listFactory(list);
      this.list_.wrapFocus = true;
    }
  }

  initialSyncWithDOM() {
    this.afterOpenedCallback_ = () => this.handleAfterOpened_();
    this.handleKeydown_ = (evt) => this.foundation_.handleKeydown(evt);
    this.handleClick_ = (evt) => this.foundation_.handleClick(evt);

    this.menuSurface_.listen(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, this.afterOpenedCallback_);
    this.listen('keydown', this.handleKeydown_);
    this.listen('click', this.handleClick_);
  }

  destroy() {
    if (this.list_) {
      this.list_.destroy();
    }

    this.menuSurface_.destroy();
    this.menuSurface_.unlisten(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, this.afterOpenedCallback_);
    this.unlisten('keydown', this.handleKeydown_);
    this.unlisten('click', this.handleClick_);
    super.destroy();
  }

  /** @return {boolean} */
  get open() {
    return this.menuSurface_.open;
  }

  /** @param {boolean} value */
  set open(value) {
    this.menuSurface_.open = value;
  }

  /** @return {boolean} */
  get wrapFocus() {
    return this.list_.wrapFocus;
  }

  /** @param {boolean} value */
  set wrapFocus(value) {
    this.list_.wrapFocus = value;
  }

  /**
   * @param {!Corner} corner Default anchor corner alignment of top-left
   *     menu corner.
   */
  setAnchorCorner(corner) {
    this.menuSurface_.setAnchorCorner(corner);
  }

  /**
   * @param {!AnchorMargin} margin
   */
  setAnchorMargin(margin) {
    this.menuSurface_.setAnchorMargin(margin);
  }

  /**
   * Return the items within the menu. Note that this only contains the set of elements within
   * the items container that are proper list items, and not supplemental / presentational DOM
   * elements.
   * @return {!Array<!HTMLElement>}
   */
  get items() {
    return this.list_.listElements;
  }

  /**
   * Return the item within the menu at the index specified.
   * @param {number} index
   * @return {?HTMLElement}
   */
  getOptionByIndex(index) {
    const items = this.items;

    if (index < items.length) {
      return this.items[index];
    } else {
      return null;
    }
  }

  /** @param {boolean} quickOpen */
  set quickOpen(quickOpen) {
    this.menuSurface_.quickOpen = quickOpen;
  }

  /** @param {boolean} isFixed */
  setFixedPosition(isFixed) {
    this.menuSurface_.setFixedPosition(isFixed);
  }

  hoistMenuToBody() {
    this.menuSurface_.hoistMenuToBody();
  }

  /** @param {boolean} isHoisted */
  setIsHoisted(isHoisted) {
    this.menuSurface_.setIsHoisted(isHoisted);
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  setAbsolutePosition(x, y) {
    this.menuSurface_.setAbsolutePosition(x, y);
  }

  /**
   * Sets the element that the menu-surface is anchored to.
   * @param {!HTMLElement} element
   */
  setAnchorElement(element) {
    this.menuSurface_.anchorElement = element;
  }

  handleAfterOpened_() {
    const list = this.items;
    if (list.length > 0) {
      list[0].focus();
    }
  }

  /** @return {!MDCMenuFoundation} */
  getDefaultFoundation() {
    return new MDCMenuFoundation({
      addClassToElementAtIndex: (index, className) => {
        const list = this.items;
        list[index].classList.add(className);
      },
      removeClassFromElementAtIndex: (index, className) => {
        const list = this.items;
        list[index].classList.remove(className);
      },
      addAttributeToElementAtIndex: (index, attr, value) => {
        const list = this.items;
        list[index].setAttribute(attr, value);
      },
      removeAttributeFromElementAtIndex: (index, attr) => {
        const list = this.items;
        list[index].removeAttribute(attr);
      },
      elementContainsClass: (element, className) => element.classList.contains(className),
      closeSurface: () => this.open = false,
      getElementIndex: (element) => this.items.indexOf(element),
      getParentElement: (element) => element.parentElement,
      getSelectedElementIndex: (selectionGroup) => {
        return this.items.indexOf(selectionGroup.querySelector(`.${cssClasses.MENU_SELECTED_LIST_ITEM}`));
      },
      notifySelected: (evtData) => this.emit(strings.SELECTED_EVENT, {
        index: evtData.index,
        item: this.items[evtData.index],
      }),
    });
  }
}

export { Corner as a, MDCMenu as b, cssClasses$1 as c, strings$1 as d, numbers as e, CornerBit as f, cssClasses as g, strings as h };
