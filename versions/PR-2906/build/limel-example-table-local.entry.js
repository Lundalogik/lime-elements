import{r as t,h as i}from"./index-6156b4fd.js";import{C as e}from"./table.types-a8f98572.js";import{d as s}from"./birds-a0b078f9.js";import{c as l}from"./capitalize-91693972.js";import"./toString-0a9c1851.js";import"./_baseGetTag-49d0259e.js";import"./_arrayMap-e86f6dbb.js";import"./isArray-80298bc7.js";import"./isSymbol-f24bedd7.js";import"./isObjectLike-38996507.js";const a=":host{display:block}limel-table{height:300px}";const r=class{constructor(i){t(this,i);this.columns=[];this.pageSize=10;this.addUnit=t=>i=>`${i} ${t}`;this.handleChangePage=t=>{this.currentPage=t.detail};this.handleSort=t=>{this.currentSorting=t.detail[0].column.title};this.currentPage=1;this.currentSorting="None"}componentWillLoad(){this.columns=[{title:"Name",field:"name"},{title:"Binominal name",field:"binominalName"},{title:"Wingspan",field:"wingspan",formatter:this.addUnit("cm")},{title:"Nest type",field:"nest",formatter:l},{title:"Eggs per clutch",field:"eggs",aggregator:e.Average,horizontalAlign:"right"},{title:"Origin",field:"origin"}]}render(){return[i("limel-table",{data:s,columns:this.columns,pageSize:this.pageSize,onChangePage:this.handleChangePage,onSort:this.handleSort}),i("limel-example-value",{label:"Current page is",value:this.currentPage}),i("limel-example-value",{label:"Currently sorting on",value:this.currentSorting})]}};r.style=a;export{r as limel_example_table_local};
//# sourceMappingURL=limel-example-table-local.entry.js.map