import{r as i,h as t}from"./index-6156b4fd.js";import{d as e}from"./birds-a0b078f9.js";import{c as l}from"./capitalize-25fd9042.js";import"./toString-8e74de73.js";import"./_baseGetTag-044c3941.js";import"./global-e1c7e609.js";import"./_arrayMap-e86f6dbb.js";import"./isArray-80298bc7.js";import"./isSymbol-bbb65e88.js";import"./isObjectLike-38996507.js";var s;(function(i){i["Average"]="avg";i["Maximum"]="max";i["Minimum"]="min";i["Sum"]="sum";i["Count"]="count"})(s||(s={}));const a=":host{display:block}limel-table{height:300px}";const r=class{constructor(t){i(this,t);this.columns=[];this.pageSize=10;this.addUnit=i=>t=>`${t} ${i}`;this.handleChangePage=i=>{this.currentPage=i.detail};this.handleSort=i=>{this.currentSorting=i.detail[0].column.title};this.currentPage=1;this.currentSorting="None"}componentWillLoad(){this.columns=[{title:"Name",field:"name"},{title:"Binominal name",field:"binominalName"},{title:"Wingspan",field:"wingspan",formatter:this.addUnit("cm")},{title:"Nest type",field:"nest",formatter:l},{title:"Eggs per clutch",field:"eggs",aggregator:s.Average,horizontalAlign:"right"},{title:"Origin",field:"origin"}]}render(){return[t("limel-table",{data:e,columns:this.columns,pageSize:this.pageSize,onChangePage:this.handleChangePage,onSort:this.handleSort}),t("limel-example-value",{label:"Current page is",value:this.currentPage}),t("limel-example-value",{label:"Currently sorting on",value:this.currentSorting})]}};r.style=a;export{r as limel_example_table_local};
//# sourceMappingURL=limel-example-table-local.entry.js.map