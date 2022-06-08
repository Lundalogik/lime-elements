import{r as i,c as t,h as o,g as e}from"./index-7dccb886.js";import{d as n}from"./dispatch-resize-event-cd1d230c.js";import{c as a}from"./random-string-2246b81e.js";import{M as d,a as c}from"./component-410aad5a.js";import{m as r,c as l}from"./ponyfill-30263d5e.js";import{M as s}from"./component-5b4ac85a.js";import{A as m}from"./animationframe-b52af02d.js";import{i as g}from"./isEqual-3f80c036.js";import"./eq-1533d1d3.js";import"./_baseGetTag-49d0259e.js";import"./isObject-7039fcda.js";import"./_getNative-4698fd71.js";import"./isArray-80298bc7.js";import"./isObjectLike-38996507.js";import"./isArrayLike-13c56347.js";import"./_nodeUtil-0ed26eea.js";
/**
 * @license
 * Copyright 2016 Google Inc.
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
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var h=function(i,t){return(h=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,t){i.__proto__=t}||function(i,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(i[o]=t[o])})(i,t)};function u(i,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=i}h(i,t),i.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)}var f,p=function(){return(p=Object.assign||function(i){for(var t,o=1,e=arguments.length;o<e;o++)for(var n in t=arguments[o])Object.prototype.hasOwnProperty.call(t,n)&&(i[n]=t[n]);return i}).apply(this,arguments)},_=function(){function i(i,t){void 0===t&&(t={}),this.root=i,this.options=t,this.elFocusedBeforeTrapFocus=null}return i.prototype.trapFocus=function(){var i=this.getFocusableElements(this.root);if(0===i.length)throw new Error("FocusTrap: Element must have at least one focusable child.");this.elFocusedBeforeTrapFocus=document.activeElement instanceof HTMLElement?document.activeElement:null,this.wrapTabFocus(this.root),this.options.skipInitialFocus||this.focusInitialElement(i,this.options.initialFocusEl)},i.prototype.releaseFocus=function(){[].slice.call(this.root.querySelectorAll(".mdc-dom-focus-sentinel")).forEach((function(i){i.parentElement.removeChild(i)})),!this.options.skipRestoreFocus&&this.elFocusedBeforeTrapFocus&&this.elFocusedBeforeTrapFocus.focus()},i.prototype.wrapTabFocus=function(i){var t=this,o=this.createSentinel(),e=this.createSentinel();o.addEventListener("focus",(function(){var o=t.getFocusableElements(i);o.length>0&&o[o.length-1].focus()})),e.addEventListener("focus",(function(){var o=t.getFocusableElements(i);o.length>0&&o[0].focus()})),i.insertBefore(o,i.children[0]),i.appendChild(e)},i.prototype.focusInitialElement=function(i,t){var o=0;t&&(o=Math.max(i.indexOf(t),0)),i[o].focus()},i.prototype.getFocusableElements=function(i){return[].slice.call(i.querySelectorAll("[autofocus], [tabindex], a, input, textarea, select, button")).filter((function(i){var t="true"===i.getAttribute("aria-disabled")||null!=i.getAttribute("disabled")||null!=i.getAttribute("hidden")||"true"===i.getAttribute("aria-hidden"),o=i.tabIndex>=0&&i.getBoundingClientRect().width>0&&!i.classList.contains("mdc-dom-focus-sentinel")&&!t,e=!1;if(o){var n=getComputedStyle(i);e="none"===n.display||"hidden"===n.visibility}return o&&!e}))},i.prototype.createSentinel=function(){var i=document.createElement("div");return i.setAttribute("tabindex","0"),i.setAttribute("aria-hidden","true"),i.classList.add("mdc-dom-focus-sentinel"),i},i}(),b={CLOSING:"mdc-dialog--closing",OPEN:"mdc-dialog--open",OPENING:"mdc-dialog--opening",SCROLLABLE:"mdc-dialog--scrollable",SCROLL_LOCK:"mdc-dialog-scroll-lock",STACKED:"mdc-dialog--stacked",FULLSCREEN:"mdc-dialog--fullscreen",SCROLL_DIVIDER_HEADER:"mdc-dialog-scroll-divider-header",SCROLL_DIVIDER_FOOTER:"mdc-dialog-scroll-divider-footer",SURFACE_SCRIM_SHOWN:"mdc-dialog__surface-scrim--shown",SURFACE_SCRIM_SHOWING:"mdc-dialog__surface-scrim--showing",SURFACE_SCRIM_HIDING:"mdc-dialog__surface-scrim--hiding",SCRIM_HIDDEN:"mdc-dialog__scrim--hidden"},x={ACTION_ATTRIBUTE:"data-mdc-dialog-action",BUTTON_DEFAULT_ATTRIBUTE:"data-mdc-dialog-button-default",BUTTON_SELECTOR:".mdc-dialog__button",CLOSED_EVENT:"MDCDialog:closed",CLOSE_ACTION:"close",CLOSING_EVENT:"MDCDialog:closing",CONTAINER_SELECTOR:".mdc-dialog__container",CONTENT_SELECTOR:".mdc-dialog__content",DESTROY_ACTION:"destroy",INITIAL_FOCUS_ATTRIBUTE:"data-mdc-dialog-initial-focus",OPENED_EVENT:"MDCDialog:opened",OPENING_EVENT:"MDCDialog:opening",SCRIM_SELECTOR:".mdc-dialog__scrim",SUPPRESS_DEFAULT_PRESS_SELECTOR:["textarea",".mdc-menu .mdc-list-item",".mdc-menu .mdc-deprecated-list-item"].join(", "),SURFACE_SELECTOR:".mdc-dialog__surface"},v={DIALOG_ANIMATION_CLOSE_TIME_MS:75,DIALOG_ANIMATION_OPEN_TIME_MS:150};!function(i){i.POLL_SCROLL_POS="poll_scroll_position",i.POLL_LAYOUT_CHANGE="poll_layout_change"}(f||(f={}));var y=function(i){function t(o){var e=i.call(this,p(p({},t.defaultAdapter),o))||this;return e.dialogOpen=!1,e.isFullscreen=!1,e.animationFrame=0,e.animationTimer=0,e.escapeKeyAction=x.CLOSE_ACTION,e.scrimClickAction=x.CLOSE_ACTION,e.autoStackButtons=!0,e.areButtonsStacked=!1,e.suppressDefaultPressSelector=x.SUPPRESS_DEFAULT_PRESS_SELECTOR,e.animFrame=new m,e.contentScrollHandler=function(){e.handleScrollEvent()},e.windowResizeHandler=function(){e.layout()},e.windowOrientationChangeHandler=function(){e.layout()},e}return u(t,i),Object.defineProperty(t,"cssClasses",{get:function(){return b},enumerable:!1,configurable:!0}),Object.defineProperty(t,"strings",{get:function(){return x},enumerable:!1,configurable:!0}),Object.defineProperty(t,"numbers",{get:function(){return v},enumerable:!1,configurable:!0}),Object.defineProperty(t,"defaultAdapter",{get:function(){return{addBodyClass:function(){},addClass:function(){},areButtonsStacked:function(){return!1},clickDefaultButton:function(){},eventTargetMatches:function(){return!1},getActionFromEvent:function(){return""},getInitialFocusEl:function(){return null},hasClass:function(){return!1},isContentScrollable:function(){return!1},notifyClosed:function(){},notifyClosing:function(){},notifyOpened:function(){},notifyOpening:function(){},releaseFocus:function(){},removeBodyClass:function(){},removeClass:function(){},reverseButtons:function(){},trapFocus:function(){},registerContentEventHandler:function(){},deregisterContentEventHandler:function(){},isScrollableContentAtTop:function(){return!1},isScrollableContentAtBottom:function(){return!1},registerWindowEventHandler:function(){},deregisterWindowEventHandler:function(){}}},enumerable:!1,configurable:!0}),t.prototype.init=function(){this.adapter.hasClass(b.STACKED)&&this.setAutoStackButtons(!1),this.isFullscreen=this.adapter.hasClass(b.FULLSCREEN)},t.prototype.destroy=function(){this.animationTimer&&(clearTimeout(this.animationTimer),this.handleAnimationTimerEnd()),this.isFullscreen&&this.adapter.deregisterContentEventHandler("scroll",this.contentScrollHandler),this.animFrame.cancelAll(),this.adapter.deregisterWindowEventHandler("resize",this.windowResizeHandler),this.adapter.deregisterWindowEventHandler("orientationchange",this.windowOrientationChangeHandler)},t.prototype.open=function(i){var t=this;this.dialogOpen=!0,this.adapter.notifyOpening(),this.adapter.addClass(b.OPENING),this.isFullscreen&&this.adapter.registerContentEventHandler("scroll",this.contentScrollHandler),i&&i.isAboveFullscreenDialog&&this.adapter.addClass(b.SCRIM_HIDDEN),this.adapter.registerWindowEventHandler("resize",this.windowResizeHandler),this.adapter.registerWindowEventHandler("orientationchange",this.windowOrientationChangeHandler),this.runNextAnimationFrame((function(){t.adapter.addClass(b.OPEN),t.adapter.addBodyClass(b.SCROLL_LOCK),t.layout(),t.animationTimer=setTimeout((function(){t.handleAnimationTimerEnd(),t.adapter.trapFocus(t.adapter.getInitialFocusEl()),t.adapter.notifyOpened()}),v.DIALOG_ANIMATION_OPEN_TIME_MS)}))},t.prototype.close=function(i){var t=this;void 0===i&&(i=""),this.dialogOpen&&(this.dialogOpen=!1,this.adapter.notifyClosing(i),this.adapter.addClass(b.CLOSING),this.adapter.removeClass(b.OPEN),this.adapter.removeBodyClass(b.SCROLL_LOCK),this.isFullscreen&&this.adapter.deregisterContentEventHandler("scroll",this.contentScrollHandler),this.adapter.deregisterWindowEventHandler("resize",this.windowResizeHandler),this.adapter.deregisterWindowEventHandler("orientationchange",this.windowOrientationChangeHandler),cancelAnimationFrame(this.animationFrame),this.animationFrame=0,clearTimeout(this.animationTimer),this.animationTimer=setTimeout((function(){t.adapter.releaseFocus(),t.handleAnimationTimerEnd(),t.adapter.notifyClosed(i)}),v.DIALOG_ANIMATION_CLOSE_TIME_MS))},t.prototype.showSurfaceScrim=function(){var i=this;this.adapter.addClass(b.SURFACE_SCRIM_SHOWING),this.runNextAnimationFrame((function(){i.adapter.addClass(b.SURFACE_SCRIM_SHOWN)}))},t.prototype.hideSurfaceScrim=function(){this.adapter.removeClass(b.SURFACE_SCRIM_SHOWN),this.adapter.addClass(b.SURFACE_SCRIM_HIDING)},t.prototype.handleSurfaceScrimTransitionEnd=function(){this.adapter.removeClass(b.SURFACE_SCRIM_HIDING),this.adapter.removeClass(b.SURFACE_SCRIM_SHOWING)},t.prototype.isOpen=function(){return this.dialogOpen},t.prototype.getEscapeKeyAction=function(){return this.escapeKeyAction},t.prototype.setEscapeKeyAction=function(i){this.escapeKeyAction=i},t.prototype.getScrimClickAction=function(){return this.scrimClickAction},t.prototype.setScrimClickAction=function(i){this.scrimClickAction=i},t.prototype.getAutoStackButtons=function(){return this.autoStackButtons},t.prototype.setAutoStackButtons=function(i){this.autoStackButtons=i},t.prototype.getSuppressDefaultPressSelector=function(){return this.suppressDefaultPressSelector},t.prototype.setSuppressDefaultPressSelector=function(i){this.suppressDefaultPressSelector=i},t.prototype.layout=function(){var i=this;this.animFrame.request(f.POLL_LAYOUT_CHANGE,(function(){i.layoutInternal()}))},t.prototype.handleClick=function(i){if(this.adapter.eventTargetMatches(i.target,x.SCRIM_SELECTOR)&&""!==this.scrimClickAction)this.close(this.scrimClickAction);else{var t=this.adapter.getActionFromEvent(i);t&&this.close(t)}},t.prototype.handleKeydown=function(i){var t="Enter"===i.key||13===i.keyCode;if(t&&!this.adapter.getActionFromEvent(i)){var o=i.composedPath?i.composedPath()[0]:i.target,e=!this.suppressDefaultPressSelector||!this.adapter.eventTargetMatches(o,this.suppressDefaultPressSelector);t&&e&&this.adapter.clickDefaultButton()}},t.prototype.handleDocumentKeydown=function(i){("Escape"===i.key||27===i.keyCode)&&""!==this.escapeKeyAction&&this.close(this.escapeKeyAction)},t.prototype.handleScrollEvent=function(){var i=this;this.animFrame.request(f.POLL_SCROLL_POS,(function(){i.toggleScrollDividerHeader(),i.toggleScrollDividerFooter()}))},t.prototype.layoutInternal=function(){this.autoStackButtons&&this.detectStackedButtons(),this.toggleScrollableClasses()},t.prototype.handleAnimationTimerEnd=function(){this.animationTimer=0,this.adapter.removeClass(b.OPENING),this.adapter.removeClass(b.CLOSING)},t.prototype.runNextAnimationFrame=function(i){var t=this;cancelAnimationFrame(this.animationFrame),this.animationFrame=requestAnimationFrame((function(){t.animationFrame=0,clearTimeout(t.animationTimer),t.animationTimer=setTimeout(i,0)}))},t.prototype.detectStackedButtons=function(){this.adapter.removeClass(b.STACKED);var i=this.adapter.areButtonsStacked();i&&this.adapter.addClass(b.STACKED),i!==this.areButtonsStacked&&(this.adapter.reverseButtons(),this.areButtonsStacked=i)},t.prototype.toggleScrollableClasses=function(){this.adapter.removeClass(b.SCROLLABLE),this.adapter.isContentScrollable()&&(this.adapter.addClass(b.SCROLLABLE),this.isFullscreen&&(this.toggleScrollDividerHeader(),this.toggleScrollDividerFooter()))},t.prototype.toggleScrollDividerHeader=function(){this.adapter.isScrollableContentAtTop()?this.adapter.hasClass(b.SCROLL_DIVIDER_HEADER)&&this.adapter.removeClass(b.SCROLL_DIVIDER_HEADER):this.adapter.addClass(b.SCROLL_DIVIDER_HEADER)},t.prototype.toggleScrollDividerFooter=function(){this.adapter.isScrollableContentAtBottom()?this.adapter.hasClass(b.SCROLL_DIVIDER_FOOTER)&&this.adapter.removeClass(b.SCROLL_DIVIDER_FOOTER):this.adapter.addClass(b.SCROLL_DIVIDER_FOOTER)},t}(d),w=y.strings,E=function(i){function t(){return null!==i&&i.apply(this,arguments)||this}return u(t,i),Object.defineProperty(t.prototype,"isOpen",{get:function(){return this.foundation.isOpen()},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"escapeKeyAction",{get:function(){return this.foundation.getEscapeKeyAction()},set:function(i){this.foundation.setEscapeKeyAction(i)},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"scrimClickAction",{get:function(){return this.foundation.getScrimClickAction()},set:function(i){this.foundation.setScrimClickAction(i)},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"autoStackButtons",{get:function(){return this.foundation.getAutoStackButtons()},set:function(i){this.foundation.setAutoStackButtons(i)},enumerable:!1,configurable:!0}),t.attachTo=function(i){return new t(i)},t.prototype.initialize=function(i){var t,o;void 0===i&&(i=function(i,t){return new _(i,t)});var e=this.root.querySelector(w.CONTAINER_SELECTOR);if(!e)throw new Error("Dialog component requires a "+w.CONTAINER_SELECTOR+" container element");this.container=e,this.content=this.root.querySelector(w.CONTENT_SELECTOR),this.buttons=[].slice.call(this.root.querySelectorAll(w.BUTTON_SELECTOR)),this.defaultButton=this.root.querySelector("["+w.BUTTON_DEFAULT_ATTRIBUTE+"]"),this.focusTrapFactory=i,this.buttonRipples=[];try{for(var n=function(i){var t="function"==typeof Symbol&&Symbol.iterator,o=t&&i[t],e=0;if(o)return o.call(i);if(i&&"number"==typeof i.length)return{next:function(){return i&&e>=i.length&&(i=void 0),{value:i&&i[e++],done:!i}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}
/**
 * @license
 * Copyright 2020 Google Inc.
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
 */(this.buttons),a=n.next();!a.done;a=n.next())this.buttonRipples.push(new s(a.value))}catch(i){t={error:i}}finally{try{a&&!a.done&&(o=n.return)&&o.call(n)}finally{if(t)throw t.error}}},t.prototype.initialSyncWithDOM=function(){var i=this;this.focusTrap=(0,this.focusTrapFactory)(this.container,{initialFocusEl:this.getInitialFocusEl()||void 0}),this.handleClick=this.foundation.handleClick.bind(this.foundation),this.handleKeydown=this.foundation.handleKeydown.bind(this.foundation),this.handleDocumentKeydown=this.foundation.handleDocumentKeydown.bind(this.foundation),this.handleOpening=function(){document.addEventListener("keydown",i.handleDocumentKeydown)},this.handleClosing=function(){document.removeEventListener("keydown",i.handleDocumentKeydown)},this.listen("click",this.handleClick),this.listen("keydown",this.handleKeydown),this.listen(w.OPENING_EVENT,this.handleOpening),this.listen(w.CLOSING_EVENT,this.handleClosing)},t.prototype.destroy=function(){this.unlisten("click",this.handleClick),this.unlisten("keydown",this.handleKeydown),this.unlisten(w.OPENING_EVENT,this.handleOpening),this.unlisten(w.CLOSING_EVENT,this.handleClosing),this.handleClosing(),this.buttonRipples.forEach((function(i){i.destroy()})),i.prototype.destroy.call(this)},t.prototype.layout=function(){this.foundation.layout()},t.prototype.open=function(){this.foundation.open()},t.prototype.close=function(i){void 0===i&&(i=""),this.foundation.close(i)},t.prototype.getDefaultFoundation=function(){var i=this;return new y({addBodyClass:function(i){return document.body.classList.add(i)},addClass:function(t){return i.root.classList.add(t)},areButtonsStacked:function(){return t=i.buttons,o=new Set,[].forEach.call(t,(function(i){return o.add(i.offsetTop)})),o.size>1;var t,o},clickDefaultButton:function(){i.defaultButton&&!i.defaultButton.disabled&&i.defaultButton.click()},eventTargetMatches:function(i,t){return!!i&&r(i,t)},getActionFromEvent:function(i){if(!i.target)return"";var t=l(i.target,"["+w.ACTION_ATTRIBUTE+"]");return t&&t.getAttribute(w.ACTION_ATTRIBUTE)},getInitialFocusEl:function(){return i.getInitialFocusEl()},hasClass:function(t){return i.root.classList.contains(t)},isContentScrollable:function(){return!!(t=i.content)&&t.scrollHeight>t.offsetHeight;var t},notifyClosed:function(t){return i.emit(w.CLOSED_EVENT,t?{action:t}:{})},notifyClosing:function(t){return i.emit(w.CLOSING_EVENT,t?{action:t}:{})},notifyOpened:function(){return i.emit(w.OPENED_EVENT,{})},notifyOpening:function(){return i.emit(w.OPENING_EVENT,{})},releaseFocus:function(){i.focusTrap.releaseFocus()},removeBodyClass:function(i){return document.body.classList.remove(i)},removeClass:function(t){return i.root.classList.remove(t)},reverseButtons:function(){i.buttons.reverse(),i.buttons.forEach((function(i){i.parentElement.appendChild(i)}))},trapFocus:function(){i.focusTrap.trapFocus()},registerContentEventHandler:function(t,o){i.content instanceof HTMLElement&&i.content.addEventListener(t,o)},deregisterContentEventHandler:function(t,o){i.content instanceof HTMLElement&&i.content.removeEventListener(t,o)},isScrollableContentAtTop:function(){return!!(t=i.content)&&0===t.scrollTop;var t},isScrollableContentAtBottom:function(){return!!(t=i.content)&&Math.ceil(t.scrollHeight-t.scrollTop)===t.clientHeight;var t},registerWindowEventHandler:function(i,t){window.addEventListener(i,t)},deregisterWindowEventHandler:function(i,t){window.removeEventListener(i,t)}})},t.prototype.getInitialFocusEl=function(){return this.root.querySelector("["+w.INITIAL_FOCUS_ATTRIBUTE+"]")},t}(c);
/**
 * @license
 * Copyright 2017 Google Inc.
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
 */const C=class{constructor(o){i(this,o),this.close=t(this,"close",7),this.closing=t(this,"closing",7),this.fullscreen=!1,this.open=!1,this.closingActions={escapeKey:!0,scrimClick:!0},this.showFooter=!0,this.handleMdcOpened=this.handleMdcOpened.bind(this),this.handleMdcClosed=this.handleMdcClosed.bind(this),this.handleMdcClosing=this.handleMdcClosing.bind(this)}connectedCallback(){this.initialize()}componentWillLoad(){this.id=a(),this.showFooter=!!this.host.querySelector('[slot="button"]')}componentDidLoad(){this.initialize()}initialize(){const i=this.host.shadowRoot.querySelector(".mdc-dialog");i&&(this.mdcDialog=new E(i),this.open&&this.mdcDialog.open(),this.mdcDialog.listen("MDCDialog:opened",this.handleMdcOpened),this.mdcDialog.listen("MDCDialog:closed",this.handleMdcClosed),this.mdcDialog.listen("MDCDialog:closing",this.handleMdcClosing),this.setClosingActions())}disconnectedCallback(){this.mdcDialog.unlisten("MDCDialog:opened",this.handleMdcOpened),this.mdcDialog.unlisten("MDCDialog:closed",this.handleMdcClosed),this.mdcDialog.unlisten("MDCDialog:closing",this.handleMdcClosing),this.mdcDialog.destroy()}render(){return o("div",{class:{"mdc-dialog":!0,"full-screen":!!this.fullscreen,popup:!!window.opener},role:"alertdialog","aria-modal":"true","aria-labelledby":"limel-dialog-title-"+this.id,"aria-describedby":"limel-dialog-content-"+this.id},o("input",{hidden:!0,id:"initialFocusEl"}),o("div",{class:"mdc-dialog__container"},o("div",{class:"mdc-dialog__surface"},o("input",{type:"text",id:"initialFocusElement"}),this.renderHeading(),o("div",{class:"mdc-dialog__content scrollbox",id:"limel-dialog-content-"+this.id},o("slot",null)),this.renderFooter())),o("div",{class:"mdc-dialog__scrim"}))}watchHandler(i,t){t!==i&&this.mdcDialog&&(i?this.mdcDialog.open():this.mdcDialog.close())}closingActionsChanged(i,t){g(i,t)||this.setClosingActions()}handleMdcOpened(){setTimeout(n,100)}handleMdcClosed(){this.open&&this.close.emit(),this.open=!1}handleMdcClosing(){this.closing.emit()}isBadgeHeading(i){return"object"==typeof i&&!!i.title&&!!i.icon}renderHeading(){if(this.isBadgeHeading(this.heading)){const{title:i,subtitle:t,supportingText:e,icon:n}=this.heading;return o("limel-header",{icon:n,heading:i,subheading:t,supportingText:e})}return"string"==typeof this.heading?o("limel-header",{heading:this.heading}):null}renderFooter(){if(this.showFooter)return o("footer",{class:"mdc-dialog__actions"},o("slot",{name:"button"}))}setClosingActions(){this.mdcDialog.scrimClickAction="",this.closingActions.scrimClick&&(this.mdcDialog.scrimClickAction="close"),this.mdcDialog.escapeKeyAction="",this.closingActions.escapeKey&&(this.mdcDialog.escapeKeyAction="close")}get host(){return e(this)}static get watchers(){return{open:["watchHandler"],closingActions:["closingActionsChanged"]}}};C.style=':host{--mdc-theme-primary:var(\n      --lime-primary-color,\n      rgb(var(--color-teal-default))\n  );--mdc-theme-secondary:var(\n      --lime-secondary-color,\n      rgb(var(--contrast-1100))\n  );--mdc-theme-on-primary:var(\n      --lime-on-primary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-secondary:var(\n      --lime-on-secondary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-text-disabled-on-background:var(\n      --lime-text-disabled-on-background-color,\n      rgba(var(--contrast-1700), 0.38)\n  );--mdc-theme-text-primary-on-background:var(\n      --lime-text-primary-on-background-color,\n      rgba(var(--contrast-1700), 0.87)\n  );--mdc-theme-text-secondary-on-background:var(\n      --lime-text-secondary-on-background-color,\n      rgba(var(--contrast-1700), 0.54)\n  );--lime-error-text-color:rgb(var(--color-red-darker));--mdc-theme-surface:var(\n      --lime-surface-background-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-surface:var(\n      --lime-on-surface-color,\n      var(--lime-text-primary-on-background-color)\n  )}:host{--dialog-background-color:rgb(var(--contrast-100));--header-heading-color:var(--dialog-heading-title-color);--header-subheading-color:var(--dialog-heading-subtitle-color);--header-supporting-text-color:var(--dialog-heading-supporting-text-color);--header-icon-color:var(--dialog-heading-icon-color);--header-icon-background-color:var(--dialog-heading-icon-background-color)}.mdc-dialog .mdc-dialog__surface{background-color:#fff;background-color:var(--mdc-theme-surface, #fff)}.mdc-dialog .mdc-dialog__scrim{background-color:rgba(0, 0, 0, 0.32)}.mdc-dialog .mdc-dialog__surface-scrim{background-color:rgba(0, 0, 0, 0.32)}.mdc-dialog .mdc-dialog__title{color:rgba(0, 0, 0, 0.87)}.mdc-dialog .mdc-dialog__content{color:rgba(0, 0, 0, 0.6)}.mdc-dialog .mdc-dialog__close{color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-dialog .mdc-dialog__close .mdc-icon-button__ripple::before,.mdc-dialog .mdc-dialog__close .mdc-icon-button__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, var(--mdc-theme-on-surface, #000))}.mdc-dialog .mdc-dialog__close:hover .mdc-icon-button__ripple::before,.mdc-dialog .mdc-dialog__close.mdc-ripple-surface--hover .mdc-icon-button__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-dialog .mdc-dialog__close.mdc-ripple-upgraded--background-focused .mdc-icon-button__ripple::before,.mdc-dialog .mdc-dialog__close:not(.mdc-ripple-upgraded):focus .mdc-icon-button__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-dialog .mdc-dialog__close:not(.mdc-ripple-upgraded) .mdc-icon-button__ripple::after{transition:opacity 150ms linear}.mdc-dialog .mdc-dialog__close:not(.mdc-ripple-upgraded):active .mdc-icon-button__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-dialog .mdc-dialog__close.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-dialog.mdc-dialog--scrollable .mdc-dialog__title,.mdc-dialog.mdc-dialog--scrollable .mdc-dialog__actions,.mdc-dialog.mdc-dialog--scrollable.mdc-dialog-scroll-divider-footer .mdc-dialog__actions{border-color:rgba(0, 0, 0, 0.12)}.mdc-dialog.mdc-dialog--scrollable .mdc-dialog__title{border-bottom:1px solid rgba(0, 0, 0, 0.12);margin-bottom:0}.mdc-dialog.mdc-dialog-scroll-divider-header.mdc-dialog--fullscreen .mdc-dialog__header{box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)}.mdc-dialog .mdc-dialog__surface{border-radius:4px;border-radius:var(--mdc-shape-medium, 4px)}.mdc-dialog__surface{box-shadow:0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)}.mdc-dialog__title{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-headline6-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-headline6-font-size, 0.875rem);line-height:0.875rem;line-height:var(--mdc-typography-headline6-line-height, 0.875rem);font-weight:500;font-weight:var(--mdc-typography-headline6-font-weight, 500);letter-spacing:0.0125em;letter-spacing:var(--mdc-typography-headline6-letter-spacing, 0.0125em);text-decoration:inherit;text-decoration:var(--mdc-typography-headline6-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-headline6-text-transform, inherit)}.mdc-dialog__content{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.8125rem;font-size:var(--mdc-typography-body1-font-size, 0.8125rem);line-height:1.5rem;line-height:var(--mdc-typography-body1-line-height, 1.5rem);font-weight:400;font-weight:var(--mdc-typography-body1-font-weight, 400);letter-spacing:0.03125em;letter-spacing:var(--mdc-typography-body1-letter-spacing, 0.03125em);text-decoration:inherit;text-decoration:var(--mdc-typography-body1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body1-text-transform, inherit)}.mdc-dialog__title-icon{}.mdc-elevation-overlay{position:absolute;border-radius:inherit;pointer-events:none;opacity:0;opacity:var(--mdc-elevation-overlay-opacity, 0);transition:opacity 280ms cubic-bezier(0.4, 0, 0.2, 1);background-color:#fff;background-color:var(--mdc-elevation-overlay-color, #fff)}.mdc-dialog,.mdc-dialog__scrim{position:fixed;top:0;left:0;align-items:center;justify-content:center;box-sizing:border-box;width:100%;height:100%}.mdc-dialog{display:none;z-index:7;z-index:var(--mdc-dialog-z-index, 7)}.mdc-dialog .mdc-dialog__content{padding:20px 24px 20px 24px}.mdc-dialog .mdc-dialog__surface{min-width:280px}@media (max-width: 592px){.mdc-dialog .mdc-dialog__surface{max-width:calc(100vw - 32px)}}@media (min-width: 592px){.mdc-dialog .mdc-dialog__surface{max-width:560px}}.mdc-dialog .mdc-dialog__surface{max-height:calc(100% - 32px)}@media all and (-ms-high-contrast: none), (-ms-high-contrast: active){.mdc-dialog .mdc-dialog__container{}}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-width:none}@media (max-width: 960px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-height:560px;width:560px}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{right:-12px}}@media (max-width: 720px) and (max-width: 672px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{width:calc(100vw - 112px)}}@media (max-width: 720px) and (min-width: 672px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{width:560px}}@media (max-width: 720px) and (max-height: 720px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-height:calc(100vh - 160px)}}@media (max-width: 720px) and (min-height: 720px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{max-height:560px}}@media (max-width: 720px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{right:-12px}}@media (max-width: 720px) and (max-height: 400px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{height:100%;max-height:100vh;max-width:100vw;width:100vw;border-radius:0}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{order:-1;left:-12px}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__header{padding:0 16px 9px;justify-content:flex-start}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__title{margin-left:calc(16px - 2 * 12px)}}@media (max-width: 600px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{height:100%;max-height:100vh;max-width:100vw;width:100vw;border-radius:0}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{order:-1;left:-12px}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__header{padding:0 16px 9px;justify-content:flex-start}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__title{margin-left:calc(16px - 2 * 12px)}}@media (min-width: 960px){.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface{width:calc(100vw - 400px)}.mdc-dialog.mdc-dialog--fullscreen .mdc-dialog__surface .mdc-dialog__close{right:-12px}}.mdc-dialog.mdc-dialog__scrim--hidden .mdc-dialog__scrim{opacity:0}.mdc-dialog__scrim{opacity:0;z-index:-1}.mdc-dialog__container{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;transform:scale(0.8);opacity:0;pointer-events:none}.mdc-dialog__surface{position:relative;display:flex;flex-direction:column;flex-grow:0;flex-shrink:0;box-sizing:border-box;max-width:100%;max-height:100%;pointer-events:auto;overflow-y:auto}.mdc-dialog__surface .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}[dir=rtl] .mdc-dialog__surface,.mdc-dialog__surface[dir=rtl]{text-align:right;}@media screen and (forced-colors: active), (-ms-high-contrast: active){.mdc-dialog__surface{outline:2px solid windowText}}.mdc-dialog__surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:2px solid transparent;border-radius:inherit;content:"";pointer-events:none}@media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none){.mdc-dialog__surface::before{content:none}}.mdc-dialog__title{display:block;margin-top:0;position:relative;flex-shrink:0;box-sizing:border-box;margin:0 0 1px;padding:0 24px 9px}.mdc-dialog__title::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}[dir=rtl] .mdc-dialog__title,.mdc-dialog__title[dir=rtl]{text-align:right;}.mdc-dialog--scrollable .mdc-dialog__title{margin-bottom:1px;padding-bottom:15px}.mdc-dialog--fullscreen .mdc-dialog__header{align-items:baseline;border-bottom:1px solid transparent;display:inline-flex;justify-content:space-between;padding:0 24px 9px;z-index:1}.mdc-dialog--fullscreen .mdc-dialog__header .mdc-dialog__close{right:-12px}.mdc-dialog--fullscreen .mdc-dialog__title{margin-bottom:0;padding:0;border-bottom:0}.mdc-dialog--fullscreen.mdc-dialog--scrollable .mdc-dialog__title{border-bottom:0;margin-bottom:0}.mdc-dialog--fullscreen .mdc-dialog__close{top:5px}.mdc-dialog--fullscreen.mdc-dialog--scrollable .mdc-dialog__actions{border-top:1px solid transparent}.mdc-dialog__content{flex-grow:1;box-sizing:border-box;margin:0;overflow:auto;-webkit-overflow-scrolling:touch}.mdc-dialog__content>:first-child{margin-top:0}.mdc-dialog__content>:last-child{margin-bottom:0}.mdc-dialog__title+.mdc-dialog__content,.mdc-dialog__header+.mdc-dialog__content{padding-top:0}.mdc-dialog--scrollable .mdc-dialog__title+.mdc-dialog__content{padding-top:8px;padding-bottom:8px}.mdc-dialog__content .mdc-deprecated-list:first-child:last-child{padding:6px 0 0}.mdc-dialog--scrollable .mdc-dialog__content .mdc-deprecated-list:first-child:last-child{padding:0}.mdc-dialog__actions{display:flex;position:relative;flex-shrink:0;flex-wrap:wrap;align-items:center;justify-content:flex-end;box-sizing:border-box;min-height:52px;margin:0;padding:8px;border-top:1px solid transparent}.mdc-dialog--stacked .mdc-dialog__actions{flex-direction:column;align-items:flex-end}.mdc-dialog__button{margin-left:8px;margin-right:0;max-width:100%;text-align:right}[dir=rtl] .mdc-dialog__button,.mdc-dialog__button[dir=rtl]{margin-left:0;margin-right:8px;}.mdc-dialog__button:first-child{margin-left:0;margin-right:0}[dir=rtl] .mdc-dialog__button:first-child,.mdc-dialog__button:first-child[dir=rtl]{margin-left:0;margin-right:0;}[dir=rtl] .mdc-dialog__button,.mdc-dialog__button[dir=rtl]{text-align:left;}.mdc-dialog--stacked .mdc-dialog__button:not(:first-child){margin-top:12px}.mdc-dialog--open,.mdc-dialog--opening,.mdc-dialog--closing{display:flex}.mdc-dialog--opening .mdc-dialog__scrim{transition:opacity 150ms linear}.mdc-dialog--opening .mdc-dialog__container{transition:opacity 75ms linear, transform 150ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-dialog--closing .mdc-dialog__scrim,.mdc-dialog--closing .mdc-dialog__container{transition:opacity 75ms linear}.mdc-dialog--closing .mdc-dialog__container{transform:none}.mdc-dialog--open .mdc-dialog__scrim{opacity:1}.mdc-dialog--open .mdc-dialog__container{transform:none;opacity:1}.mdc-dialog--open.mdc-dialog__surface-scrim--shown .mdc-dialog__surface-scrim{opacity:1;z-index:1}.mdc-dialog--open.mdc-dialog__surface-scrim--hiding .mdc-dialog__surface-scrim{transition:opacity 75ms linear}.mdc-dialog--open.mdc-dialog__surface-scrim--showing .mdc-dialog__surface-scrim{transition:opacity 150ms linear}.mdc-dialog__surface-scrim{display:none;opacity:0;position:absolute;width:100%;height:100%}.mdc-dialog__surface-scrim--shown .mdc-dialog__surface-scrim,.mdc-dialog__surface-scrim--showing .mdc-dialog__surface-scrim,.mdc-dialog__surface-scrim--hiding .mdc-dialog__surface-scrim{display:block}.mdc-dialog-scroll-lock{overflow:hidden}.mdc-dialog{z-index:var(--dialog-z-index, 7)}@media (max-width: 16032px){.mdc-dialog .mdc-dialog__surface{max-width:calc(100vw - 32px)}}@media (min-width: 16032px){.mdc-dialog .mdc-dialog__surface{max-width:16000px}}@media (max-height: 16032px){.mdc-dialog.full-screen .mdc-dialog__surface{max-height:calc(100% - 32px)}}@media (min-height: 16032px){.mdc-dialog.full-screen .mdc-dialog__surface{max-height:16000px}}@media all and (-ms-high-contrast: none), (-ms-high-contrast: active){.mdc-dialog.full-screen .mdc-dialog__container{}}@media (-ms-high-contrast: none) and (min-height: 16032px), (-ms-high-contrast: active) and (min-height: 16032px){.mdc-dialog.full-screen .mdc-dialog__container{align-items:stretch;height:auto}}.mdc-dialog.full-screen .mdc-dialog__container{height:100%;width:100%}.mdc-dialog.full-screen .mdc-dialog__container .mdc-dialog__surface{height:100%;width:100%}.mdc-dialog.full-screen.popup .mdc-dialog__surface{max-height:100%;max-width:100%;border-radius:0}.mdc-dialog .mdc-dialog__container{height:100%}.mdc-dialog .mdc-dialog__surface{width:var(--dialog-width, auto);height:var(--dialog-height, auto);background-color:var(--dialog-background-color);box-shadow:var(--shadow-depth-64)}.scrollbox{--dialog-background-color-transparent:rgba(var(--contrast-100), 0);--dialog-scroll-shadow-color:rgba(var(--color-black), 0.2);--dialog-scroll-shadow-color-transparent:rgba(var(--color-black), 0);background:linear-gradient(var(--dialog-background-color) 30%, var(--dialog-background-color-transparent)), linear-gradient(var(--dialog-background-color-transparent), var(--dialog-background-color) 70%) 0 100%, radial-gradient(farthest-side at 50% 0, var(--dialog-scroll-shadow-color), var(--dialog-scroll-shadow-color-transparent)), radial-gradient(farthest-side at 50% 100%, var(--dialog-scroll-shadow-color), var(--dialog-scroll-shadow-color-transparent)) 0 100%;background-repeat:no-repeat;background-color:var(--dialog-background-color);background-size:100% 2.5rem, 100% 2.5rem, 100% 0.875rem, 100% 0.875rem;background-attachment:local, local, scroll, scroll}#initialFocusElement{position:absolute;opacity:0;pointer-events:none;z-index:-1}slot[name=header]{display:none}slot[name=button]{display:flex;gap:0.5rem;width:100%;justify-content:flex-end}@media screen and (max-width: 760px){slot[name=button]{flex-direction:column-reverse}.mdc-dialog__actions{padding:1rem 1.5rem 1.5rem 1.5rem}}';export{C as limel_dialog}