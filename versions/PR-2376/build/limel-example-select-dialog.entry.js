import{r as e,h as t}from"./index-a55db97c.js";const a=class{constructor(t){e(this,t),this.heroOptions=[{text:"Luke Skywalker",value:"luke"},{text:"Han Solo",value:"han"},{text:"Leia Organa",value:"leia"}],this.villainOptions=[{text:"BB-9E",value:"bb-9e"},{text:"Unkar Plutt",value:"unkar"},{text:"Zam Wessell",value:"zam"},{text:"Greedo",value:"greedo"},{text:"Evazan and Baba",value:"evazan_baba"},{text:"Bossk",value:"bossk"},{text:"Count Dooku",value:"dooku"},{text:"Captain Phasma",value:"phasma"},{text:"Commander Cody",value:"cody"},{text:"DJ",value:"dj"},{text:"Supreme Leader Snoke",value:"snoke"},{text:"Jango Fett",value:"jango"},{text:"General Grievous",value:"grievous"},{text:"General Hux",value:"hux"},{text:"Orson Krennic",value:"orson"},{text:"Sebulba",value:"sebulba"},{text:"Boba Fett",value:"boba"},{text:"Watto",value:"watto"},{text:"Jar Jar Binks",value:"jarjar"},{text:"The Sarlacc",value:"sarlacc"},{text:"Darth Maul",value:"maul"},{text:"Jabba the Hutt",value:"jabba"},{text:"Anakin Skywalker",value:"anakin"},{text:"Grand Moff Tarkin",value:"tarkin"},{text:"Kylo Ren",value:"ren"},{text:"Emperor Palpatine",value:"palpatine"},{text:"Darth Vader",value:"vader"}],this.handleHeroChange=e=>{this.heroValue=e.detail},this.handleVillainChange=e=>{this.villainValue=e.detail},this.handleButtonClick=()=>{this.open=!0},this.handleClose=()=>{this.open=!1},this.heroValue=void 0,this.villainValue=void 0,this.open=!1}render(){return[t("limel-button",{label:"Select characters",primary:!0,onClick:this.handleButtonClick}),t("limel-dialog",{onClose:this.handleClose,open:this.open},t("limel-select",{label:"Favorite hero",value:this.heroValue,options:this.heroOptions,onLimelChange:this.handleHeroChange}),t("limel-select",{label:"Loathed villain",value:this.villainValue,options:this.villainOptions,onLimelChange:this.handleVillainChange}),t("limel-icon",{name:"star_wars"}),t("limel-button",{slot:"button",primary:!0,label:"Close",onClick:this.handleClose})),t("limel-example-value",{label:"Favorite hero",value:this.heroValue}),t("limel-example-value",{label:"Loathed villain",value:this.villainValue})]}};a.style="limel-dialog{--dialog-height:400px}limel-select{margin-bottom:1rem}limel-icon{height:300px;width:300px;color:rgb(var(--contrast-1200))}";export{a as limel_example_select_dialog}