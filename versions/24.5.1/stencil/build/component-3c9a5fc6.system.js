System.register(["./tslib.es6-7ed43ca5.system.js"],(function(t){"use strict";var e;return{setters:[function(t){e=t.b}],execute:function(){
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
var n=t("M",function(){function t(t){if(t===void 0){t={}}this.adapter_=t}Object.defineProperty(t,"cssClasses",{get:function(){return{}},enumerable:true,configurable:true});Object.defineProperty(t,"strings",{get:function(){return{}},enumerable:true,configurable:true});Object.defineProperty(t,"numbers",{get:function(){return{}},enumerable:true,configurable:true});Object.defineProperty(t,"defaultAdapter",{get:function(){return{}},enumerable:true,configurable:true});t.prototype.init=function(){};t.prototype.destroy=function(){};return t}());
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
             */var o=t("a",function(){function t(t,n){var o=[];for(var i=2;i<arguments.length;i++){o[i-2]=arguments[i]}this.root_=t;this.initialize.apply(this,e(o));this.foundation_=n===undefined?this.getDefaultFoundation():n;this.foundation_.init();this.initialSyncWithDOM()}t.attachTo=function(e){return new t(e,new n({}))};t.prototype.initialize=function(){var t=[];for(var e=0;e<arguments.length;e++){t[e]=arguments[e]}};t.prototype.getDefaultFoundation=function(){throw new Error("Subclasses must override getDefaultFoundation to return a properly configured "+"foundation class")};t.prototype.initialSyncWithDOM=function(){};t.prototype.destroy=function(){this.foundation_.destroy()};t.prototype.listen=function(t,e){this.root_.addEventListener(t,e)};t.prototype.unlisten=function(t,e){this.root_.removeEventListener(t,e)};t.prototype.emit=function(t,e,n){if(n===void 0){n=false}var o;if(typeof CustomEvent==="function"){o=new CustomEvent(t,{bubbles:n,detail:e})}else{o=document.createEvent("CustomEvent");o.initCustomEvent(t,n,false,e)}this.root_.dispatchEvent(o)};return t}())}}}));