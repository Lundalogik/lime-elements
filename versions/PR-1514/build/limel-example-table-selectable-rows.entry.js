import{r as e,h as t}from"./index-a7da85d2.js";import{p as i}from"./persons-14c12719.js";let l=class{constructor(t){e(this,t),this.selection=[i[0],i[2]],this.tableData=i,this.columns=[{title:"Name",field:"name"},{title:"Age",field:"age",horizontalAlign:"right"},{title:"Kind",field:"kind"},{title:"Height",field:"height",horizontalAlign:"right"},{title:"Stamina",field:"stamina"},{title:"Place of Birth",field:"placeOfBirth"},{title:"Sign",field:"sign"},{title:"Date of Birth",field:"dateOfBirth"},{title:"Role",field:"role"}],this.onActivateRow=e=>{this.activeRow=e.detail},this.onSelect=e=>{this.selection=e.detail}}render(){return[t("limel-table",{data:this.tableData,activeRow:this.activeRow,selectable:!0,selection:this.selection,columns:this.columns,onActivate:this.onActivateRow,onSelect:this.onSelect,class:"has-interactive-rows"}),t("limel-example-value",{label:"Active row",value:this.activeRow}),t("limel-example-value",{label:"Selected rows",value:this.selection})]}};l.style=":host{display:block}limel-table{height:300px}";export{l as limel_example_table_selectable_rows}