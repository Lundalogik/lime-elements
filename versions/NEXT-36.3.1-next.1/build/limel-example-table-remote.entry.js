import{r as t,h as i}from"./index-a55db97c.js";import{d as e}from"./birds-a0b078f9.js";import{c as s}from"./capitalize-91693972.js";import"./toString-0a9c1851.js";import"./_baseGetTag-49d0259e.js";import"./_arrayMap-e86f6dbb.js";import"./isArray-80298bc7.js";import"./isSymbol-f24bedd7.js";import"./isObjectLike-38996507.js";const a=class{constructor(i){t(this,i),this.columns=[],this.allData=e,this.pageSize=10,this.addUnit=t=>i=>`${i} ${t}`,this.handleLoad=t=>{console.log("Loading new data",t.detail);const i=t.detail.sorters[0];this.currentPage=t.detail.page,i&&(this.allData=[...e].sort(this.compareBy(i))),this.loadData()},this.compareBy=t=>(i,e)=>{const s=t.column,a=i[s.field],o=e[s.field];return"ASC"===t.direction?String(a).localeCompare(String(o)):String(o).localeCompare(String(a))},this.currentData=[]}componentWillLoad(){this.columns=[{title:"Name",field:"name"},{title:"Binominal name",field:"binominalName"},{title:"Wingspan",field:"wingspan",formatter:this.addUnit("cm")},{title:"Nest type",field:"nest",formatter:s},{title:"Eggs per clutch",horizontalAlign:"right",field:"eggs",aggregator:this.calculateAverage},{title:"Origin",field:"origin"}]}calculateAverage(t,i,s){return console.log(i,s),e.reduce(((i,e)=>i+e[t.field]),0)/e.length}loadData(){setTimeout((()=>{const t=(this.currentPage-1)*this.pageSize;this.currentData=this.allData.slice(t,t+this.pageSize)}),500)}render(){return i("limel-table",{mode:"remote",data:this.currentData,columns:this.columns,pageSize:this.pageSize,totalRows:e.length,onLoad:this.handleLoad})}};a.style=":host{display:block}limel-table{height:300px}";export{a as limel_example_table_remote}