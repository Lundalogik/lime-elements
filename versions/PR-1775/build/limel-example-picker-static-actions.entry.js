import{r as t,h as e}from"./index-7dccb886.js";const i=class{constructor(e){t(this,e),this.allItems=[{text:"Admiral Swiggins",value:1},{text:"Ayla",value:2},{text:"Clunk",value:3},{text:"Coco",value:4},{text:"Derpl",value:5},{text:"Froggy G",value:6},{text:"Gnaw",value:7},{text:"Lonestar",value:8},{text:"Leon",value:9},{text:"Raelynn",value:10},{text:"Skølldir",value:11},{text:"Voltar",value:12},{text:"Yuri",value:13}],this.actions=[{text:"Add a dog",icon:"dog",iconColor:"rgb(var(--color-orange-default))",value:{id:"dog"}},{text:"Add a cat",icon:"cat",iconColor:"rgb(var(--color-green-default))",value:{id:"cat"}}],this.actionPositions=[{text:"Bottom",value:"bottom"},{text:"Top",value:"top"}],this.actionScrollBehaviors=[{text:"Sticky",value:"sticky"},{text:"Scroll",value:"scroll"}],this.selectedItem=null,this.lastUsedAction=null,this.actionScrollBehavior=this.actionScrollBehaviors[0],this.actionPosition=this.actionPositions[0],this.search=this.search.bind(this),this.onChange=this.onChange.bind(this),this.onAction=this.onAction.bind(this),this.setBehavior=this.setBehavior.bind(this),this.setPosition=this.setPosition.bind(this)}render(){var t,i;return[e("limel-picker",{label:"Select your favorite pet",value:this.selectedItem,searchLabel:"Search your awesomenaut",searcher:this.search,onChange:this.onChange,onInteract:this.onInteract,onAction:this.onAction,actions:this.actions,actionScrollBehavior:null===(t=this.actionScrollBehavior)||void 0===t?void 0:t.value,actionPosition:null===(i=this.actionPosition)||void 0===i?void 0:i.value}),e("p",null,e("limel-flex-container",{justify:"end"},e("limel-select",{style:{width:"12rem"},label:"Action Scroll Behavior",onChange:this.setBehavior,value:this.actionScrollBehavior,options:this.actionScrollBehaviors}),e("limel-select",{style:{width:"10rem","margin-left":"0.5rem"},label:"Action Position",onChange:this.setPosition,value:this.actionPosition,options:this.actionPositions}))),e("limel-example-value",{label:"Last pressed action",value:this.lastUsedAction})]}search(t){return new Promise((e=>{""===t&&e(this.allItems),e(this.allItems.filter((e=>e.text.toLowerCase().includes(t.toLowerCase()))))}))}onChange(t){this.selectedItem=t.detail}onAction(t){this.lastUsedAction=t.detail}onInteract(t){console.log("Value interacted with:",t.detail)}setBehavior(t){this.actionScrollBehavior=t.detail}setPosition(t){this.actionPosition=t.detail}};export{i as limel_example_picker_static_actions}