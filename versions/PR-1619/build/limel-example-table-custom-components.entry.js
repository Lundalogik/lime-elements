import{r as t,h as i}from"./index-11aed7da.js";import{d as e}from"./birds-a0b078f9.js";import{c as a}from"./capitalize-91693972.js";import"./toString-0a9c1851.js";import"./_baseGetTag-49d0259e.js";import"./_arrayMap-e86f6dbb.js";import"./isArray-80298bc7.js";import"./isSymbol-f24bedd7.js";import"./isObjectLike-38996507.js";let l=class{constructor(i){t(this,i),this.columns=[],this.addUnit=t=>i=>`${i} ${t}`}componentWillLoad(){this.columns=[{title:"Name",field:"name"},{title:"Binominal name",field:"binominalName"},{title:"Wingspan",field:"wingspan",formatter:this.addUnit("cm")},{title:"Food",field:"food",component:{name:"limel-example-table-food"}},{title:"Habitat",field:"habitat",formatter:this.capitalizeStrings},{title:"Nest type",field:"nest",formatter:a},{title:"Eggs per clutch",field:"eggs",horizontalAlign:"right"},{title:"Origin",field:"origin"}]}capitalizeStrings(t){return"string"==typeof t?a(t):Array.isArray(t)?t.map((t=>a(t))).join(", "):t}render(){return i("limel-table",{data:e,columns:this.columns})}};l.style=":host{display:block}limel-table{height:300px}";export{l as limel_example_table_custom_components}