/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var n=function(r,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,r){n.__proto__=r}||function(n,r){for(var t in r)r.hasOwnProperty(t)&&(n[t]=r[t])})(r,t)};function r(r,t){function o(){this.constructor=r}n(r,t),r.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)}var t=function(){return(t=Object.assign||function(n){for(var r,t=1,o=arguments.length;t<o;t++)for(var f in r=arguments[t])Object.prototype.hasOwnProperty.call(r,f)&&(n[f]=r[f]);return n}).apply(this,arguments)};function o(n){var r="function"==typeof Symbol&&n[Symbol.iterator],t=0;return r?r.call(n):{next:function(){return n&&t>=n.length&&(n=void 0),{value:n&&n[t++],done:!n}}}}function f(n,r){var t="function"==typeof Symbol&&n[Symbol.iterator];if(!t)return n;var o,f,i=t.call(n),u=[];try{for(;(void 0===r||r-- >0)&&!(o=i.next()).done;)u.push(o.value)}catch(c){f={error:c}}finally{try{o&&!o.done&&(t=i.return)&&t.call(i)}finally{if(f)throw f.error}}return u}function i(){for(var n=[],r=0;r<arguments.length;r++)n=n.concat(f(arguments[r]));return n}export{r as _,t as a,i as b,o as c};