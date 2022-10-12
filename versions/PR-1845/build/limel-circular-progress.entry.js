import{r,h as e}from"./index-ab490ba1.js";import{a as o}from"./format-ce615e29.js";import"./_commonjsHelpers-5ec8f9b7.js";const a=class{constructor(e){r(this,e),this.value=0,this.maxValue=100,this.suffix="%",this.displayPercentageColors=!1}render(){const r={"lime-circular-progress":!0,"displays-percentage-colors":this.displayPercentageColors},a=100*this.value/this.maxValue+"%",c=Math.round(10*this.value)/10;return e("div",{role:"progressbar",class:r,"aria-label":"%","aria-valuemin":"0","aria-valuemax":this.maxValue,"aria-valuenow":this.value,style:{"--percentage":a}},e("span",{class:"value"},o(c),e("span",{class:"suffix"},this.suffix)))}};a.style=':host{--mdc-theme-primary:var(\n      --lime-primary-color,\n      rgb(var(--color-teal-default))\n  );--mdc-theme-secondary:var(\n      --lime-secondary-color,\n      rgb(var(--contrast-1100))\n  );--mdc-theme-on-primary:var(\n      --lime-on-primary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-secondary:var(\n      --lime-on-secondary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-text-disabled-on-background:var(\n      --lime-text-disabled-on-background-color,\n      rgba(var(--contrast-1700), 0.38)\n  );--mdc-theme-text-primary-on-background:var(\n      --lime-text-primary-on-background-color,\n      rgba(var(--contrast-1700), 0.87)\n  );--mdc-theme-text-secondary-on-background:var(\n      --lime-text-secondary-on-background-color,\n      rgba(var(--contrast-1700), 0.54)\n  );--lime-error-text-color:rgb(var(--color-red-darker));--mdc-theme-surface:var(\n      --lime-surface-background-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-surface:var(\n      --lime-on-surface-color,\n      var(--lime-text-primary-on-background-color)\n  )}:host{display:block;box-sizing:border-box}:host([size=x-small]){--circular-progress-size:1.5rem;font-weight:bold}:host([size=small]){--circular-progress-size:2rem;font-weight:bold}:host([size=medium]){--circular-progress-size:3rem}:host([size=large]){--circular-progress-size:4rem}:host([size=x-large]){--circular-progress-size:5rem}.lime-circular-progress{--size:var(--circular-progress-size, 3rem);--fill-color:var(--circular-progress-fill-color, var(--mdc-theme-primary));--track-color:var(\n      --circular-progress-track-color,\n      rgb(var(--contrast-400))\n  );display:flex;align-items:center;justify-content:center;width:var(--size);height:var(--size);border-radius:50%;box-shadow:0 0 0 0.125rem rgba(var(--contrast-100), 0.8);background:conic-gradient(var(--fill-color) 0% var(--percentage), var(--track-color) var(--percentage) 100%)}.lime-circular-progress:before{content:"";position:absolute;width:calc(var(--size) * 0.75 + 0.25rem);height:calc(var(--size) * 0.75 + 0.25rem);border-radius:50%;background-color:rgb(var(--contrast-100));box-shadow:var(--button-shadow-pressed)}.value{font-size:calc(var(--size) * 0.25);color:rgb(var(--contrast-1200));z-index:1;cursor:default}.suffix{opacity:0.7}.displays-percentage-colors[style^="--percentage:1"]{--circular-progress-fill-color:var(--color-percent--10to20)}.displays-percentage-colors[style^="--percentage:2"]{--circular-progress-fill-color:var(--color-percent--20to30)}.displays-percentage-colors[style^="--percentage:3"]{--circular-progress-fill-color:var(--color-percent--30to40)}.displays-percentage-colors[style^="--percentage:4"]{--circular-progress-fill-color:var(--color-percent--40to50)}.displays-percentage-colors[style^="--percentage:5"]{--circular-progress-fill-color:var(--color-percent--50to60)}.displays-percentage-colors[style^="--percentage:6"]{--circular-progress-fill-color:var(--color-percent--60to70)}.displays-percentage-colors[style^="--percentage:7"]{--circular-progress-fill-color:var(--color-percent--70to80)}.displays-percentage-colors[style^="--percentage:8"]{--circular-progress-fill-color:var(--color-percent--80to90)}.displays-percentage-colors[style^="--percentage:9"],.displays-percentage-colors[style="--percentage:100%;"]{--circular-progress-fill-color:var(--color-percent--90to100)}.displays-percentage-colors[style="--percentage:1%;"],.displays-percentage-colors[style="--percentage:2%;"],.displays-percentage-colors[style="--percentage:3%;"],.displays-percentage-colors[style="--percentage:4%;"],.displays-percentage-colors[style="--percentage:5%;"],.displays-percentage-colors[style="--percentage:6%;"],.displays-percentage-colors[style="--percentage:7%;"],.displays-percentage-colors[style="--percentage:8%;"],.displays-percentage-colors[style="--percentage:9%;"]{--circular-progress-fill-color:var(--color-percent--0to10)}';export{a as limel_circular_progress}