import{r as t,h as e}from"./index-ab490ba1.js";const l=class{constructor(e){t(this,e),this.selectedItems=[],this.allItems=[{text:"Admiral Swiggins",value:1},{text:"Ayla",value:2},{text:"Clunk",value:3},{text:"Coco",value:4},{text:"Derpl",value:5},{text:"Froggy G",value:6},{text:"Gnaw",value:7},{text:"Lonestar",value:8},{text:"Leon",value:9},{text:"Raelynn",value:10},{text:"Skølldir",value:11},{text:"Voltar",value:12},{text:"Yuri",value:13}],this.availableItems=[...this.allItems],this.search=t=>new Promise((e=>e(""===t?this.availableItems:this.availableItems.filter((e=>e.text.toLowerCase().includes(t.toLowerCase())))))),this.onChange=t=>{this.selectedItems=[...t.detail],this.updateAvailableItems()},this.updateAvailableItems=()=>{this.availableItems=this.allItems.filter((t=>!this.selectedItems.find((e=>t.value===e.value))))},this.onInteract=t=>{console.log("Value interacted with:",t.detail)}}render(){return[e("limel-picker",{label:"Favorite awesomenaut",value:this.selectedItems,multiple:!0,searcher:this.search,onChange:this.onChange,onInteract:this.onInteract}),e("limel-example-value",{value:this.selectedItems})]}};export{l as limel_example_picker_multiple}