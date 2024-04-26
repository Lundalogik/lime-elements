import{r,c as e,h as n}from"./index-6156b4fd.js";const t='@charset "UTF-8";:host(limel-text-editor){display:flex;flex-direction:column;width:100%}fieldset{min-width:0;min-height:0}:host(limel-text-editor[readonly]) fieldset{padding-block-start:0.75rem}:host{--mdc-theme-primary:var(\n      --lime-primary-color,\n      rgb(var(--color-teal-default))\n  );--mdc-theme-secondary:var(\n      --lime-secondary-color,\n      rgb(var(--contrast-1100))\n  );--mdc-theme-on-primary:var(\n      --lime-on-primary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-secondary:var(\n      --lime-on-secondary-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-text-disabled-on-background:var(\n      --lime-text-disabled-on-background-color,\n      rgba(var(--contrast-1700), 0.38)\n  );--mdc-theme-text-primary-on-background:var(\n      --lime-text-primary-on-background-color,\n      rgba(var(--contrast-1700), 0.87)\n  );--mdc-theme-text-secondary-on-background:var(\n      --lime-text-secondary-on-background-color,\n      rgba(var(--contrast-1700), 0.54)\n  );--mdc-theme-error:var(\n      --lime-error-background-color,\n      rgb(var(--color-red-dark))\n  );--lime-error-text-color:rgb(var(--color-red-darker));--mdc-theme-surface:var(\n      --lime-surface-background-color,\n      rgb(var(--contrast-100))\n  );--mdc-theme-on-surface:var(\n      --lime-on-surface-color,\n      rgb(var(--contrast-1500))\n  )}fieldset{box-sizing:border-box;transition:border-color 0.2s ease, background-color 0.2s ease;border:1px solid;border-radius:0.25rem;margin-inline-start:0;margin-inline-end:0;padding-block-start:0;padding-inline-start:0.75rem;padding-inline-end:0.75rem;padding-block-end:0.75rem}fieldset:not([disabled]){border-color:rgba(var(--contrast-700), 0.65);background-color:rgba(var(--contrast-200), 0.5)}fieldset:not([disabled]):hover{border-color:rgba(var(--contrast-700), 1);background-color:rgba(var(--contrast-200), 1)}fieldset:not([disabled]):focus-within{border-color:var(--mdc-theme-primary)}fieldset[disabled]{border-color:transparent}fieldset:has(legend){margin-top:calc((-0.75rem / 2) + (1px / 2))}legend{box-sizing:border-box;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:100%;color:rgba(var(--contrast-1200), 1);font-size:0.65rem;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);padding-inline-start:0.25rem;padding-inline-end:0.25rem}';const o=class{constructor(n){r(this,n);this.change=e(this,"change",7);this.handleChange=()=>r=>{r.stopPropagation();this.change.emit(r.detail)};this.disabled=undefined;this.readonly=undefined;this.helperText=undefined;this.placeholder=undefined;this.label=undefined;this.invalid=undefined;this.value=undefined}render(){return n("fieldset",{disabled:this.readonly||this.disabled},this.renderLabel(),this.renderEditor())}renderEditor(){if(this.readonly){return n("limel-markdown",{value:this.value})}return n("limel-prosemirror-adapter",{onChange:this.handleChange,value:this.value})}renderLabel(){if(!this.label){return}return n("legend",null,this.label)}};o.style=t;export{o as limel_text_editor};
//# sourceMappingURL=limel-text-editor.entry.js.map