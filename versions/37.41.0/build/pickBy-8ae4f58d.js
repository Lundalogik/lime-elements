import{h as r,c as t,t as n,a,b as e}from"./_baseIteratee-583cc85d.js";import{a as i}from"./_arrayMap-e86f6dbb.js";import{a as u}from"./_assignValue-d635a66e.js";import{i as s,b as o}from"./isArrayLike-84e8e25f.js";import{i as f}from"./isObject-7039fcda.js";import{e as c,f as v,o as l,s as p,d as b,g as h,h as j}from"./_baseIsEqual-25d76b77.js";function m(r){var t=[];if(r!=null){for(var n in Object(r)){t.push(n)}}return t}var d=Object.prototype;var _=d.hasOwnProperty;function O(r){if(!f(r)){return m(r)}var t=c(r),n=[];for(var a in r){if(!(a=="constructor"&&(t||!_.call(r,a)))){n.push(a)}}return n}function w(r){return s(r)?v(r,true):O(r)}var y=l(Object.getPrototypeOf,Object);var g=Object.getOwnPropertySymbols;var E=!g?p:function(r){var t=[];while(r){b(t,h(r));r=y(r)}return t};function x(r){return j(r,w,E)}var I=Object.prototype;var k=I.hasOwnProperty;function q(r,t){return r!=null&&k.call(r,t)}function A(t,n){return t!=null&&r(t,n,q)}var L="Expected a function";function M(r){if(typeof r!="function"){throw new TypeError(L)}return function(){var t=arguments;switch(t.length){case 0:return!r.call(this);case 1:return!r.call(this,t[0]);case 2:return!r.call(this,t[0],t[1]);case 3:return!r.call(this,t[0],t[1],t[2])}return!r.apply(this,t)}}function T(r,a,e,i){if(!f(r)){return r}a=t(a,r);var s=-1,c=a.length,v=c-1,l=r;while(l!=null&&++s<c){var p=n(a[s]),b=e;if(p==="__proto__"||p==="constructor"||p==="prototype"){return r}if(s!=v){var h=l[p];b=i?i(h,p,l):undefined;if(b===undefined){b=f(h)?h:o(a[s+1])?[]:{}}}u(l,p,b);l=l[p]}return r}function V(r,n,e){var i=-1,u=n.length,s={};while(++i<u){var o=n[i],f=a(r,o);if(e(f,o)){T(s,t(o,r),f)}}return s}function z(r,t){if(r==null){return{}}var n=i(x(r),(function(r){return[r]}));t=e(t);return V(r,n,(function(r,n){return t(r,n[0])}))}export{y as g,A as h,M as n,z as p};
//# sourceMappingURL=pickBy-8ae4f58d.js.map