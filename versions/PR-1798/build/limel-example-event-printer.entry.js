import{r as t,h as n}from"./index-7dccb886.js";import{c as e,a as r}from"./_commonjsHelpers-5ec8f9b7.js";var i=e((function(t){t.exports=function(){var t=6e4,n=36e5,e="millisecond",r="second",i="minute",s="hour",u="day",a="week",o="month",h="quarter",c="year",f="date",l="Invalid Date",d=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,m=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,v={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},p=function(t,n,e){var r=String(t);return!r||r.length>=n?t:""+Array(n+1-r.length).join(e)+t},y={s:p,z:function(t){var n=-t.utcOffset(),e=Math.abs(n),r=Math.floor(e/60),i=e%60;return(n<=0?"+":"-")+p(r,2,"0")+":"+p(i,2,"0")},m:function t(n,e){if(n.date()<e.date())return-t(e,n);var r=12*(e.year()-n.year())+(e.month()-n.month()),i=n.clone().add(r,o),s=e-i<0,u=n.clone().add(r+(s?-1:1),o);return+(-(r+(e-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:o,y:c,w:a,d:u,D:f,h:s,m:i,s:r,ms:e,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},b="en",M={};M[b]=v;var g=function(t){return t instanceof w},S=function t(n,e,r){var i;if(!n)return b;if("string"==typeof n){var s=n.toLowerCase();M[s]&&(i=s),e&&(M[s]=e,i=s);var u=n.split("-");if(!i&&u.length>1)return t(u[0])}else{var a=n.name;M[a]=n,i=a}return!r&&i&&(b=i),i||!r&&b},D=function(t,n){if(g(t))return t.clone();var e="object"==typeof n?n:{};return e.date=t,e.args=arguments,new w(e)},_=y;_.l=S,_.i=g,_.w=function(t,n){return D(t,{locale:n.$L,utc:n.$u,x:n.$x,$offset:n.$offset})};var w=function(){function v(t){this.$L=S(t.locale,null,!0),this.parse(t)}var p=v.prototype;return p.parse=function(t){this.$d=function(t){var n=t.date,e=t.utc;if(null===n)return new Date(NaN);if(_.u(n))return new Date;if(n instanceof Date)return new Date(n);if("string"==typeof n&&!/Z$/i.test(n)){var r=n.match(d);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return e?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(n)}(t),this.$x=t.x||{},this.init()},p.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},p.$utils=function(){return _},p.isValid=function(){return!(this.$d.toString()===l)},p.isSame=function(t,n){var e=D(t);return this.startOf(n)<=e&&e<=this.endOf(n)},p.isAfter=function(t,n){return D(t)<this.startOf(n)},p.isBefore=function(t,n){return this.endOf(n)<D(t)},p.$g=function(t,n,e){return _.u(t)?this[n]:this.set(e,t)},p.unix=function(){return Math.floor(this.valueOf()/1e3)},p.valueOf=function(){return this.$d.getTime()},p.startOf=function(t,n){var e=this,h=!!_.u(n)||n,l=_.p(t),d=function(t,n){var r=_.w(e.$u?Date.UTC(e.$y,n,t):new Date(e.$y,n,t),e);return h?r:r.endOf(u)},m=function(t,n){return _.w(e.toDate()[t].apply(e.toDate("s"),(h?[0,0,0,0]:[23,59,59,999]).slice(n)),e)},v=this.$W,p=this.$M,y=this.$D,b="set"+(this.$u?"UTC":"");switch(l){case c:return h?d(1,0):d(31,11);case o:return h?d(1,p):d(0,p+1);case a:var M=this.$locale().weekStart||0,g=(v<M?v+7:v)-M;return d(h?y-g:y+(6-g),p);case u:case f:return m(b+"Hours",0);case s:return m(b+"Minutes",1);case i:return m(b+"Seconds",2);case r:return m(b+"Milliseconds",3);default:return this.clone()}},p.endOf=function(t){return this.startOf(t,!1)},p.$set=function(t,n){var a,h=_.p(t),l="set"+(this.$u?"UTC":""),d=(a={},a[u]=l+"Date",a[f]=l+"Date",a[o]=l+"Month",a[c]=l+"FullYear",a[s]=l+"Hours",a[i]=l+"Minutes",a[r]=l+"Seconds",a[e]=l+"Milliseconds",a)[h],m=h===u?this.$D+(n-this.$W):n;if(h===o||h===c){var v=this.clone().set(f,1);v.$d[d](m),v.init(),this.$d=v.set(f,Math.min(this.$D,v.daysInMonth())).$d}else d&&this.$d[d](m);return this.init(),this},p.set=function(t,n){return this.clone().$set(t,n)},p.get=function(t){return this[_.p(t)]()},p.add=function(e,h){var f,l=this;e=Number(e);var d=_.p(h),m=function(t){var n=D(l);return _.w(n.date(n.date()+Math.round(t*e)),l)};if(d===o)return this.set(o,this.$M+e);if(d===c)return this.set(c,this.$y+e);if(d===u)return m(1);if(d===a)return m(7);var v=(f={},f[i]=t,f[s]=n,f[r]=1e3,f)[d]||1,p=this.$d.getTime()+e*v;return _.w(p,this)},p.subtract=function(t,n){return this.add(-1*t,n)},p.format=function(t){var n=this,e=this.$locale();if(!this.isValid())return e.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=_.z(this),s=this.$H,u=this.$m,a=this.$M,o=e.weekdays,h=e.months,c=function(t,e,i,s){return t&&(t[e]||t(n,r))||i[e].slice(0,s)},f=function(t){return _.s(s%12||12,t,"0")},d=e.meridiem||function(t,n,e){var r=t<12?"AM":"PM";return e?r.toLowerCase():r},v={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:_.s(a+1,2,"0"),MMM:c(e.monthsShort,a,h,3),MMMM:c(h,a),D:this.$D,DD:_.s(this.$D,2,"0"),d:String(this.$W),dd:c(e.weekdaysMin,this.$W,o,2),ddd:c(e.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:_.s(s,2,"0"),h:f(1),hh:f(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:_.s(u,2,"0"),s:String(this.$s),ss:_.s(this.$s,2,"0"),SSS:_.s(this.$ms,3,"0"),Z:i};return r.replace(m,(function(t,n){return n||v[t]||i.replace(":","")}))},p.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},p.diff=function(e,f,l){var d,m=_.p(f),v=D(e),p=(v.utcOffset()-this.utcOffset())*t,y=this-v,b=_.m(this,v);return b=(d={},d[c]=b/12,d[o]=b,d[h]=b/3,d[a]=(y-p)/6048e5,d[u]=(y-p)/864e5,d[s]=y/n,d[i]=y/t,d[r]=y/1e3,d)[m]||y,l?b:_.a(b)},p.daysInMonth=function(){return this.endOf(o).$D},p.$locale=function(){return M[this.$L]},p.locale=function(t,n){if(!t)return this.$L;var e=this.clone(),r=S(t,n,!0);return r&&(e.$L=r),e},p.clone=function(){return _.w(this.$d,this)},p.toDate=function(){return new Date(this.valueOf())},p.toJSON=function(){return this.isValid()?this.toISOString():null},p.toISOString=function(){return this.$d.toISOString()},p.toString=function(){return this.$d.toUTCString()},v}(),Y=w.prototype;return D.prototype=Y,[["$ms",e],["$s",r],["$m",i],["$H",s],["$W",u],["$M",o],["$y",c],["$D",f]].forEach((function(t){Y[t[1]]=function(n){return this.$g(n,t[0],t[1])}})),D.extend=function(t,n){return t.$i||(t(n,w,D),t.$i=!0),D},D.locale=S,D.isDayjs=g,D.unix=function(t){return D(1e3*t)},D.en=M[b],D.Ls=M,D.p={},D}()}));const s=class{constructor(n){t(this,n),this.caughtEvents=[],this.formatEvent=this.formatEvent.bind(this),this.pushEvent=this.pushEvent.bind(this)}async writeEvent(t){console.log(t),this.pushEvent(t)}render(){return n("section",{class:"events-display"},n("header",null,n("h5",null,"Caught events:")),this.caughtEvents.map(this.formatEvent))}formatEvent({timestamp:t,event:e}){return n("details",null,n("summary",null,`${t} ${e.toString().replace(/\[object (.*)\]/,"$1")}: `,"type=",n("code",null,e.type)," detail=",n("code",null,`${e.detail}`)),n("pre",null,n("code",null,function(t){if(!t)return;const n={eventName:t.toString(),altKey:t.altKey,bubbles:t.bubbles,button:t.button,buttons:t.buttons,cancelBubble:t.cancelBubble,cancelable:t.cancelable,clientX:t.clientX,clientY:t.clientY,composed:t.composed,ctrlKey:t.ctrlKey,currentTarget:t.currentTarget?t.currentTarget.outerHTML:null,defaultPrevented:t.defaultPrevented,detail:t.detail,eventPhase:t.eventPhase,fromElement:t.fromElement?t.fromElement.outerHTML:null,isTrusted:t.isTrusted,layerX:t.layerX,layerY:t.layerY,metaKey:t.metaKey,movementX:t.movementX,movementY:t.movementY,offsetX:t.offsetX,offsetY:t.offsetY,pageX:t.pageX,pageY:t.pageY,path:t.path&&t.path.length?t.path.map((t=>t.localName)):null,relatedTarget:t.relatedTarget?t.relatedTarget.outerHTML:null,returnValue:t.returnValue,screenX:t.screenX,screenY:t.screenY,shiftKey:t.shiftKey,sourceCapabilities:null,target:t.target?t.target.outerHTML:null,timeStamp:t.timeStamp,toElement:t.toElement?t.toElement.outerHTML:null,type:t.type,view:t.view?t.view.toString():null,which:t.which,x:t.x,y:t.y};return t.sourceCapabilities&&(n.sourceCapabilities=t.sourceCapabilities.toString()),JSON.stringify(n,null,2)}(e))))}pushEvent(t){this.caughtEvents=[{timestamp:i().format("HH:mm:ss.SSS"),event:t},...this.caughtEvents]}};s.style='code{font-family:"Source Code Pro", monospace;font-size:0.75rem;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none;display:inline-block;border-radius:0.1875rem;padding:0.0625rem 0.3125rem;color:rgb(var(--kompendium-contrast-1300));background-color:rgb(var(--kompendium-contrast-600))}pre>code{display:block;border-radius:0.5rem;margin:0.5rem 0;padding:1rem;overflow:auto;white-space:pre-wrap;color:rgb(var(--kompendium-contrast-800));background-color:rgb(var(--kompendium-contrast-1600))}.events-display{max-height:20rem;overflow:auto}h5{margin:0}details{font-size:0.875rem}summary{cursor:pointer}code{font-size:0.625rem}';export{s as limel_example_event_printer}