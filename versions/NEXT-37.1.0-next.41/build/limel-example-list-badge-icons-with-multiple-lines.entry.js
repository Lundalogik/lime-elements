import{r as e,h as t}from"./index-6156b4fd.js";const n=class{constructor(t){e(this,t);this.items=[{text:"This item only has one line of primary text, and no secondary text",value:1,icon:"text_width"},{text:"Very long primary texts like this one will truncate and you cannot do anything about it. Just avoid having long primary texts.",secondaryText:"This is a short secondary text.",value:2,icon:"text_width"},{text:"This item only has one line of primary text",value:3,secondaryText:"The lengt of secondary text does not exceed maximum allowed number of lines (of course depending on the width of your screen), thus the lines will not truncate.",icon:"text_width"},{text:"This is a short primary text",secondaryText:"Very long secondary texts like this one will not truncate on the first line. By default, the list will render 3 lines of text and then truncates the rest. If you need more lines of text to be shown, you can simply define it in your code, and add a maximum number there. For more information regarding this, please read the documentation.",value:4,icon:"text_width"}]}render(){return t("limel-list",{items:this.items,badgeIcons:true,maxLinesSecondaryText:4})}};export{n as limel_example_list_badge_icons_with_multiple_lines};
//# sourceMappingURL=limel-example-list-badge-icons-with-multiple-lines.entry.js.map