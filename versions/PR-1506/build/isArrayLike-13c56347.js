import{i as n}from"./eq-1533d1d3.js";var r=/^(?:0|[1-9]\d*)$/;function t(n,t){var u=typeof n;return!!(t=null==t?9007199254740991:t)&&("number"==u||"symbol"!=u&&r.test(n))&&n>-1&&n%1==0&&n<t}function u(n){return"number"==typeof n&&n>-1&&n%1==0&&n<=9007199254740991}function e(r){return null!=r&&u(r.length)&&!n(r)}export{t as a,e as b,u as i}