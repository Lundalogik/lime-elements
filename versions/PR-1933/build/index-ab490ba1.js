let e,t,l,n=!1,o=!1,s=!1,i=!1,r=!1;const c="undefined"!=typeof window?window:{},f=c.document||{head:{}},a={t:0,l:"",jmp:e=>e(),raf:e=>requestAnimationFrame(e),ael:(e,t,l,n)=>e.addEventListener(t,l,n),rel:(e,t,l,n)=>e.removeEventListener(t,l,n),ce:(e,t)=>new CustomEvent(e,t)},u=e=>Promise.resolve(e),d=(()=>{try{return new CSSStyleSheet,"function"==typeof(new CSSStyleSheet).replace}catch(e){}return!1})(),$=(e,t,l)=>{l&&l.map((([l,n,o])=>{const s=h(e,l),i=p(t,o),r=m(l);a.ael(s,n,i,r),(t.o=t.o||[]).push((()=>a.rel(s,n,i,r)))}))},p=(e,t)=>l=>{try{256&e.t?e.i[t](l):(e.u=e.u||[]).push([t,l])}catch(e){de(e)}},h=(e,t)=>8&t?c:e,m=e=>0!=(2&e),y="http://www.w3.org/1999/xlink",b=new WeakMap,w=e=>"sc-"+e.$,g={},v=e=>"object"==(e=typeof e)||"function"===e,k=(e,t,...l)=>{let n=null,o=null,s=null,i=!1,r=!1,c=[];const f=t=>{for(let l=0;l<t.length;l++)n=t[l],Array.isArray(n)?f(n):null!=n&&"boolean"!=typeof n&&((i="function"!=typeof e&&!v(n))&&(n+=""),i&&r?c[c.length-1].p+=n:c.push(i?j(null,n):n),r=i)};if(f(l),t){t.key&&(o=t.key),t.name&&(s=t.name);{const e=t.className||t.class;e&&(t.class="object"!=typeof e?e:Object.keys(e).filter((t=>e[t])).join(" "))}}if("function"==typeof e)return e(null===t?{}:t,c,O);const a=j(e,null);return a.h=t,c.length>0&&(a.m=c),a.g=o,a.v=s,a},j=(e,t)=>({t:0,k:e,p:t,j:null,m:null,h:null,g:null,v:null}),S={},O={forEach:(e,t)=>e.map(C).forEach(t),map:(e,t)=>e.map(C).map(t).map(M)},C=e=>({vattrs:e.h,vchildren:e.m,vkey:e.g,vname:e.v,vtag:e.k,vtext:e.p}),M=e=>{if("function"==typeof e.vtag){const t=Object.assign({},e.vattrs);return e.vkey&&(t.key=e.vkey),e.vname&&(t.name=e.vname),k(e.vtag,t,...e.vchildren||[])}const t=j(e.vtag,e.vtext);return t.h=e.vattrs,t.m=e.vchildren,t.g=e.vkey,t.v=e.vname,t},x=(e,t,l,n,o,s)=>{if(l!==n){let i=ue(e,t),r=t.toLowerCase();if("class"===t){const t=e.classList,o=P(l),s=P(n);t.remove(...o.filter((e=>e&&!s.includes(e)))),t.add(...s.filter((e=>e&&!o.includes(e))))}else if("style"===t){for(const t in l)n&&null!=n[t]||(t.includes("-")?e.style.removeProperty(t):e.style[t]="");for(const t in n)l&&n[t]===l[t]||(t.includes("-")?e.style.setProperty(t,n[t]):e.style[t]=n[t])}else if("key"===t);else if("ref"===t)n&&n(e);else if(i||"o"!==t[0]||"n"!==t[1]){const c=v(n);if((i||c&&null!==n)&&!o)try{if(e.tagName.includes("-"))e[t]=n;else{let o=null==n?"":n;"list"===t?i=!1:null!=l&&e[t]==o||(e[t]=o)}}catch(e){}let f=!1;r!==(r=r.replace(/^xlink\:?/,""))&&(t=r,f=!0),null==n||!1===n?!1===n&&""!==e.getAttribute(t)||(f?e.removeAttributeNS(y,t):e.removeAttribute(t)):(!i||4&s||o)&&!c&&(n=!0===n?"":n,f?e.setAttributeNS(y,t,n):e.setAttribute(t,n))}else t="-"===t[2]?t.slice(3):ue(c,r)?r.slice(2):r[2]+t.slice(3),l&&a.rel(e,t,l,!1),n&&a.ael(e,t,n,!1)}},R=/\s/,P=e=>e?e.split(R):[],T=(e,t,l,n)=>{const o=11===t.j.nodeType&&t.j.host?t.j.host:t.j,s=e&&e.h||g,i=t.h||g;for(n in s)n in i||x(o,n,s[n],void 0,l,t.t);for(n in i)x(o,n,s[n],i[n],l,t.t)},E=(o,r,c,a)=>{let u,d,$,p=r.m[c],h=0;if(n||(s=!0,"slot"===p.k&&(e&&a.classList.add(e+"-s"),p.t|=p.m?2:1)),null!==p.p)u=p.j=f.createTextNode(p.p);else if(1&p.t)u=p.j=f.createTextNode("");else{if(i||(i="svg"===p.k),u=p.j=f.createElementNS(i?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml",2&p.t?"slot-fb":p.k),i&&"foreignObject"===p.k&&(i=!1),T(null,p,i),null!=e&&u["s-si"]!==e&&u.classList.add(u["s-si"]=e),p.m)for(h=0;h<p.m.length;++h)d=E(o,p,h,u),d&&u.appendChild(d);"svg"===p.k?i=!1:"foreignObject"===u.tagName&&(i=!0)}return u["s-hn"]=l,3&p.t&&(u["s-sr"]=!0,u["s-cr"]=t,u["s-sn"]=p.v||"",$=o&&o.m&&o.m[c],$&&$.k===p.k&&o.j&&L(o.j,!1)),u},L=(e,t)=>{a.t|=1;const n=e.childNodes;for(let e=n.length-1;e>=0;e--){const o=n[e];o["s-hn"]!==l&&o["s-ol"]&&(F(o).insertBefore(o,D(o)),o["s-ol"].remove(),o["s-ol"]=void 0,s=!0),t&&L(o,t)}a.t&=-2},N=(e,t,n,o,s,i)=>{let r,c=e["s-cr"]&&e["s-cr"].parentNode||e;for(c.shadowRoot&&c.tagName===l&&(c=c.shadowRoot);s<=i;++s)o[s]&&(r=E(null,n,s,e),r&&(o[s].j=r,c.insertBefore(r,D(t))))},U=(e,t,l,n,s)=>{for(;t<=l;++t)(n=e[t])&&(s=n.j,z(n),o=!0,s["s-ol"]?s["s-ol"].remove():L(s,!0),s.remove())},W=(e,t)=>e.k===t.k&&("slot"===e.k?e.v===t.v:e.g===t.g),D=e=>e&&e["s-ol"]||e,F=e=>(e["s-ol"]?e["s-ol"]:e).parentNode,A=(e,t)=>{const l=t.j=e.j,n=e.m,o=t.m,s=t.k,r=t.p;let c;null===r?(i="svg"===s||"foreignObject"!==s&&i,"slot"===s||T(e,t,i),null!==n&&null!==o?((e,t,l,n)=>{let o,s,i=0,r=0,c=0,f=0,a=t.length-1,u=t[0],d=t[a],$=n.length-1,p=n[0],h=n[$];for(;i<=a&&r<=$;)if(null==u)u=t[++i];else if(null==d)d=t[--a];else if(null==p)p=n[++r];else if(null==h)h=n[--$];else if(W(u,p))A(u,p),u=t[++i],p=n[++r];else if(W(d,h))A(d,h),d=t[--a],h=n[--$];else if(W(u,h))"slot"!==u.k&&"slot"!==h.k||L(u.j.parentNode,!1),A(u,h),e.insertBefore(u.j,d.j.nextSibling),u=t[++i],h=n[--$];else if(W(d,p))"slot"!==u.k&&"slot"!==h.k||L(d.j.parentNode,!1),A(d,p),e.insertBefore(d.j,u.j),d=t[--a],p=n[++r];else{for(c=-1,f=i;f<=a;++f)if(t[f]&&null!==t[f].g&&t[f].g===p.g){c=f;break}c>=0?(s=t[c],s.k!==p.k?o=E(t&&t[r],l,c,e):(A(s,p),t[c]=void 0,o=s.j),p=n[++r]):(o=E(t&&t[r],l,r,e),p=n[++r]),o&&F(u.j).insertBefore(o,D(u.j))}i>a?N(e,null==n[$+1]?null:n[$+1].j,l,n,r,$):r>$&&U(t,i,a)})(l,n,t,o):null!==o?(null!==e.p&&(l.textContent=""),N(l,null,t,o,0,o.length-1)):null!==n&&U(n,0,n.length-1),i&&"svg"===s&&(i=!1)):(c=l["s-cr"])?c.parentNode.textContent=r:e.p!==r&&(l.data=r)},H=e=>{let t,l,n,o,s,i,r=e.childNodes;for(l=0,n=r.length;l<n;l++)if(t=r[l],1===t.nodeType){if(t["s-sr"])for(s=t["s-sn"],t.hidden=!1,o=0;o<n;o++)if(i=r[o].nodeType,r[o]["s-hn"]!==t["s-hn"]||""!==s){if(1===i&&s===r[o].getAttribute("slot")){t.hidden=!0;break}}else if(1===i||3===i&&""!==r[o].textContent.trim()){t.hidden=!0;break}H(t)}},q=[],V=e=>{let t,l,n,s,i,r,c=0,f=e.childNodes,a=f.length;for(;c<a;c++){if(t=f[c],t["s-sr"]&&(l=t["s-cr"])&&l.parentNode)for(n=l.parentNode.childNodes,s=t["s-sn"],r=n.length-1;r>=0;r--)l=n[r],l["s-cn"]||l["s-nr"]||l["s-hn"]===t["s-hn"]||(_(l,s)?(i=q.find((e=>e.S===l)),o=!0,l["s-sn"]=l["s-sn"]||s,i?i.O=t:q.push({O:t,S:l}),l["s-sr"]&&q.map((e=>{_(e.S,l["s-sn"])&&(i=q.find((e=>e.S===l)),i&&!e.O&&(e.O=i.O))}))):q.some((e=>e.S===l))||q.push({S:l}));1===t.nodeType&&V(t)}},_=(e,t)=>1===e.nodeType?null===e.getAttribute("slot")&&""===t||e.getAttribute("slot")===t:e["s-sn"]===t||""===t,z=e=>{e.h&&e.h.ref&&e.h.ref(null),e.m&&e.m.map(z)},B=e=>ce(e).C,G=(e,t,l)=>{const n=B(e);return{emit:e=>I(n,t,{bubbles:!!(4&l),composed:!!(2&l),cancelable:!!(1&l),detail:e})}},I=(e,t,l)=>{const n=a.ce(t,l);return e.dispatchEvent(n),n},J=(e,t)=>{t&&!e.M&&t["s-p"]&&t["s-p"].push(new Promise((t=>e.M=t)))},K=(e,t)=>{if(e.t|=16,!(4&e.t))return J(e,e.R),ke((()=>Q(e,t)));e.t|=512},Q=(e,t)=>{const l=e.i;let n;return t?(e.t|=256,e.u&&(e.u.map((([e,t])=>te(l,e,t))),e.u=null),n=te(l,"componentWillLoad")):n=te(l,"componentWillUpdate"),le(n,(()=>X(e,l,t)))},X=async(e,t,l)=>{const n=e.C,o=n["s-rc"];l&&(e=>{const t=e.P,l=e.C,n=t.t,o=((e,t)=>{let l=w(t),n=he.get(l);if(e=11===e.nodeType?e:f,n)if("string"==typeof n){let t,o=b.get(e=e.head||e);o||b.set(e,o=new Set),o.has(l)||(t=f.createElement("style"),t.innerHTML=n,e.insertBefore(t,e.querySelector("link")),o&&o.add(l))}else e.adoptedStyleSheets.includes(n)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,n]);return l})(l.shadowRoot?l.shadowRoot:l.getRootNode(),t);10&n&&(l["s-sc"]=o,l.classList.add(o+"-h"))})(e);Y(e,t),o&&(o.map((e=>e())),n["s-rc"]=void 0);{const t=n["s-p"],l=()=>Z(e);0===t.length?l():(Promise.all(t).then(l),e.t|=4,t.length=0)}},Y=(i,r)=>{try{r=r.render(),i.t&=-17,i.t|=2,((i,r)=>{const c=i.C,u=i.P,d=i.T||j(null,null),$=(e=>e&&e.k===S)(r)?r:k(null,null,r);if(l=c.tagName,u.L&&($.h=$.h||{},u.L.map((([e,t])=>$.h[t]=c[e]))),$.k=null,$.t|=4,i.T=$,$.j=d.j=c.shadowRoot||c,e=c["s-sc"],t=c["s-cr"],n=0!=(1&u.t),o=!1,A(d,$),a.t|=1,s){let e,t,l,n,o,s;V($.j);let i=0;for(;i<q.length;i++)e=q[i],t=e.S,t["s-ol"]||(l=f.createTextNode(""),l["s-nr"]=t,t.parentNode.insertBefore(t["s-ol"]=l,t));for(i=0;i<q.length;i++)if(e=q[i],t=e.S,e.O){for(n=e.O.parentNode,o=e.O.nextSibling,l=t["s-ol"];l=l.previousSibling;)if(s=l["s-nr"],s&&s["s-sn"]===t["s-sn"]&&n===s.parentNode&&(s=s.nextSibling,!s||!s["s-nr"])){o=s;break}(!o&&n!==t.parentNode||t.nextSibling!==o)&&t!==o&&(!t["s-hn"]&&t["s-ol"]&&(t["s-hn"]=t["s-ol"].parentNode.nodeName),n.insertBefore(t,o))}else 1===t.nodeType&&(t.hidden=!0)}o&&H($.j),a.t&=-2,q.length=0})(i,r)}catch(e){de(e,i.C)}return null},Z=e=>{const t=e.C,l=e.i,n=e.R;te(l,"componentDidRender"),64&e.t?te(l,"componentDidUpdate"):(e.t|=64,ne(t),te(l,"componentDidLoad"),e.N(t),n||ee()),e.U(t),e.M&&(e.M(),e.M=void 0),512&e.t&&ve((()=>K(e,!1))),e.t&=-517},ee=()=>{ne(f.documentElement),ve((()=>I(c,"appload",{detail:{namespace:"lime-elements"}})))},te=(e,t,l)=>{if(e&&e[t])try{return e[t](l)}catch(e){de(e)}},le=(e,t)=>e&&e.then?e.then(t):t(),ne=e=>e.classList.add("hydrated"),oe=(e,t,l)=>{if(t.W){e.watchers&&(t.D=e.watchers);const n=Object.entries(t.W),o=e.prototype;if(n.map((([e,[n]])=>{31&n||2&l&&32&n?Object.defineProperty(o,e,{get(){return((e,t)=>ce(this).F.get(t))(0,e)},set(l){((e,t,l,n)=>{const o=ce(e),s=o.C,i=o.F.get(t),r=o.t,c=o.i;if(l=((e,t)=>null==e||v(e)?e:4&t?"false"!==e&&(""===e||!!e):2&t?parseFloat(e):1&t?e+"":e)(l,n.W[t][0]),(!(8&r)||void 0===i)&&l!==i&&(!Number.isNaN(i)||!Number.isNaN(l))&&(o.F.set(t,l),c)){if(n.D&&128&r){const e=n.D[t];e&&e.map((e=>{try{c[e](l,i,t)}catch(e){de(e,s)}}))}2==(18&r)&&K(o,!1)}})(this,e,l,t)},configurable:!0,enumerable:!0}):1&l&&64&n&&Object.defineProperty(o,e,{value(...t){const l=ce(this);return l.A.then((()=>l.i[e](...t)))}})})),1&l){const l=new Map;o.attributeChangedCallback=function(e,t,n){a.jmp((()=>{const t=l.get(e);if(this.hasOwnProperty(t))n=this[t],delete this[t];else if(o.hasOwnProperty(t)&&"number"==typeof this[t]&&this[t]==n)return;this[t]=(null!==n||"boolean"!=typeof this[t])&&n}))},e.observedAttributes=n.filter((([e,t])=>15&t[0])).map((([e,n])=>{const o=n[1]||e;return l.set(o,e),512&n[0]&&t.L.push([e,o]),o}))}}return e},se=e=>{te(e,"connectedCallback")},ie=(e,t={})=>{const l=[],n=t.exclude||[],o=c.customElements,s=f.head,i=s.querySelector("meta[charset]"),r=f.createElement("style"),u=[];let p,h=!0;Object.assign(a,t),a.l=new URL(t.resourcesUrl||"./",f.baseURI).href,e.map((e=>{e[1].map((t=>{const s={t:t[0],$:t[1],W:t[2],H:t[3]};s.W=t[2],s.H=t[3],s.L=[],s.D={};const i=s.$,r=class extends HTMLElement{constructor(e){super(e),ae(e=this,s),1&s.t&&e.attachShadow({mode:"open",delegatesFocus:!!(16&s.t)})}connectedCallback(){p&&(clearTimeout(p),p=null),h?u.push(this):a.jmp((()=>(e=>{if(0==(1&a.t)){const t=ce(e),l=t.P,n=()=>{};if(1&t.t)$(e,t,l.H),se(t.i);else{t.t|=1,12&l.t&&(e=>{const t=e["s-cr"]=f.createComment("");t["s-cn"]=!0,e.insertBefore(t,e.firstChild)})(e);{let l=e;for(;l=l.parentNode||l.host;)if(l["s-p"]){J(t,t.R=l);break}}l.W&&Object.entries(l.W).map((([t,[l]])=>{if(31&l&&e.hasOwnProperty(t)){const l=e[t];delete e[t],e[t]=l}})),(async(e,t,l,n,o)=>{if(0==(32&t.t)){{if(t.t|=32,(o=pe(l)).then){const e=()=>{};o=await o,e()}o.isProxied||(l.D=o.watchers,oe(o,l,2),o.isProxied=!0);const e=()=>{};t.t|=8;try{new o(t)}catch(e){de(e)}t.t&=-9,t.t|=128,e(),se(t.i)}if(o.style){let e=o.style;const t=w(l);if(!he.has(t)){const n=()=>{};((e,t,l)=>{let n=he.get(e);d&&l?(n=n||new CSSStyleSheet,n.replace(t)):n=t,he.set(e,n)})(t,e,!!(1&l.t)),n()}}}const s=t.R,i=()=>K(t,!0);s&&s["s-rc"]?s["s-rc"].push(i):i()})(0,t,l)}n()}})(this)))}disconnectedCallback(){a.jmp((()=>(()=>{if(0==(1&a.t)){const e=ce(this),t=e.i;e.o&&(e.o.map((e=>e())),e.o=void 0),te(t,"disconnectedCallback")}})()))}componentOnReady(){return ce(this).q}};s.V=e[0],n.includes(i)||o.get(i)||(l.push(i),o.define(i,oe(r,s,1)))}))})),r.innerHTML=l+"{visibility:hidden}.hydrated{visibility:inherit}",r.setAttribute("data-styles",""),s.insertBefore(r,i?i.nextSibling:s.firstChild),h=!1,u.length?u.map((e=>e.connectedCallback())):a.jmp((()=>p=setTimeout(ee,30)))},re=new WeakMap,ce=e=>re.get(e),fe=(e,t)=>re.set(t.i=e,t),ae=(e,t)=>{const l={t:0,C:e,P:t,F:new Map};return l.A=new Promise((e=>l.U=e)),l.q=new Promise((e=>l.N=e)),e["s-p"]=[],e["s-rc"]=[],$(e,l,t.H),re.set(e,l)},ue=(e,t)=>t in e,de=(e,t)=>(0,console.error)(e,t),$e=new Map,pe=e=>{const t=e.$.replace(/-/g,"_"),l=e.V,n=$e.get(l);return n?n[t]:import(`./${l}.entry.js`).then((e=>($e.set(l,e),e[t])),de)},he=new Map,me=[],ye=[],be=(e,t)=>l=>{e.push(l),r||(r=!0,t&&4&a.t?ve(ge):a.raf(ge))},we=e=>{for(let t=0;t<e.length;t++)try{e[t](performance.now())}catch(e){de(e)}e.length=0},ge=()=>{we(me),we(ye),(r=me.length>0)&&a.raf(ge)},ve=e=>u().then(e),ke=be(ye,!0);export{S as H,ie as b,G as c,B as g,k as h,u as p,fe as r}