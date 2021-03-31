import { r as registerInstance, h } from './index-fb5abbae.js';
var bacon = "\n# Bacon Ipsum!\n\nSpicy jalapeno bacon ipsum dolor amet fatback bresaola enim\nduis anim pork loin pork chop exercitation aute consectetur.\nEu pork ground round lorem laboris shoulder et shank pancetta\nswine pork belly tongue. Ham hock tenderloin cupidatat short\nloin beef brisket id sed. Chicken pariatur strip steak ad,\nsalami picanha corned beef aliquip capicola. Pork chop corned\nbeef cupidatat tail id. Ut non drumstick laborum, in turducken\nvelit strip steak commodo ipsum consequat reprehenderit ball tip\ncupim burgdoggen.\n\n## Culpa prosciutto\nJowl short ribs **meatloaf** duis in buffalo ipsum ex ut pork belly\neu. Bresaola nulla porchetta, biltong flank pastrami cow in\neiusmod brisket doner drumstick ex. Ham tri-tip aliquip veniam\nshank fatback tongue *turkey* buffalo chicken bresaola kevin\naliqua. Nulla pork chop burgdoggen, deserunt picanha shoulder\nreprehenderit consectetur esse in. Reprehenderit boudin labore in.\n\n> Ham hock tenderloin cupidatat short loin beef brisket `id` sed\n\n1. Brisket\n2. Jalapeno\n3. Tenderloin\n\n```\nif (meat === 'tenderloin') {\n    console.log('Meatlover!')\n}\n```\n\n:::note Drumstick\nChicken pariatur strip steak ad, salami picanha corned beef aliquip capicola\n:::\n\n";
var markdownCss = ":host(*){display:block}";
var MarkdownExample = /** @class */ (function () {
    function MarkdownExample(hostRef) {
        registerInstance(this, hostRef);
    }
    MarkdownExample.prototype.render = function () {
        return h("kompendium-markdown", { text: bacon });
    };
    return MarkdownExample;
}());
MarkdownExample.style = markdownCss;
export { MarkdownExample as kompendium_example_markdown };
