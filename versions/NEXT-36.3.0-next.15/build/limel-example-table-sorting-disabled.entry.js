import{r as e,h as i}from"./index-a55db97c.js";import{i as t}from"./invoices-311a48d4.js";const l=class{constructor(i){e(this,i),this.tableData=t,this.columns=[{title:"Invoice no.",field:"invoiceNumber"},{title:"Invoice Date",field:"invoiceDate"},{title:"Reference Person",field:"referencePerson",headerSort:!1},{title:"Amount",field:"amount",horizontalAlign:"right"}]}render(){return i("limel-table",{data:this.tableData,columns:this.columns})}};l.style=":host{display:block}limel-table{height:300px}";export{l as limel_example_table_sorting_disabled}