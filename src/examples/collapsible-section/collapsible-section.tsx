import { Component, State } from '@stencil/core';

@Component({
    tag: 'limel-example-collapsible-section',
    shadow: true,
})
export class CollapsibleSectionExample {
    @State()
    private secondExampleIsOpen = false;

    @State()
    private percentage = 34;

    constructor() {
        this.toggleSecondExample = this.toggleSecondExample.bind(this);
        this.secondExampleOnOpen = this.secondExampleOnOpen.bind(this);
        this.secondExampleOnClose = this.secondExampleOnClose.bind(this);
    }

    public render() {
        return [
            <section>
                <h3>Basic example</h3>
                <limel-collapsible-section header="This Text Becomes the Header">
                    <p>This element becomes the body.</p>
                </limel-collapsible-section>
            </section>,
            <hr />,
            <section>
                <h3>Closing and opening from outside the component</h3>
                <limel-flex-container justify="end">
                    <limel-button
                        label={'toggle'}
                        primary={true}
                        onClick={this.toggleSecondExample}
                    />
                </limel-flex-container>
                <limel-collapsible-section
                    header="Click Me or Click the Button"
                    isOpen={this.secondExampleIsOpen}
                    onOpen={this.secondExampleOnOpen}
                    onClose={this.secondExampleOnClose}
                >
                    <p>
                        Either way, the section will toggle!
                        <limel-slider unit="%" value={this.percentage} />
                    </p>
                </limel-collapsible-section>
            </section>,
            <hr />,
            <section>
                <h3>Body Max-Height</h3>
                <limel-collapsible-section
                    header="I Have a Scrollbar"
                    style={{ '--body-max-height': '20rem' }}
                >
                    <div>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Maecenas vulputate interdum tellus vel
                            malesuada. Nulla vitae vestibulum massa. Cras in
                            lorem sapien. Integer bibendum felis lectus, in
                            volutpat ligula sollicitudin id. Nam faucibus
                            interdum ex maximus vulputate. Fusce ornare lacus
                            libero, non sagittis arcu condimentum facilisis.
                            Aliquam erat volutpat. Integer a mauris quam.
                        </p>
                        <p>
                            Fusce eu nulla quis diam egestas molestie. Quisque
                            vestibulum ac enim ac cursus. Suspendisse aliquam
                            pellentesque justo et convallis. Vivamus nec blandit
                            metus. Integer laoreet suscipit odio at aliquam.
                            Cras rhoncus quam risus, in laoreet dolor faucibus
                            nec. Morbi consequat, urna et elementum facilisis,
                            mauris magna consequat massa, ac euismod lorem orci
                            quis neque. Nunc libero felis, faucibus convallis
                            nibh vel, semper viverra leo. Orci varius natoque
                            penatibus et magnis dis parturient montes, nascetur
                            ridiculus mus. Duis et sollicitudin massa. Nulla
                            commodo nibh nunc, in fermentum nunc convallis nec.
                            Donec viverra venenatis eros nec vulputate. Mauris
                            dictum, nibh sed eleifend efficitur, erat augue
                            aliquam sem, sit amet maximus quam elit id magna.
                            Maecenas elementum dui justo, finibus vestibulum
                            nulla vestibulum ac. Donec ut iaculis ipsum, id
                            tincidunt quam.
                        </p>
                        <p>
                            Proin quam tellus, viverra id condimentum ac,
                            sodales a tortor. Phasellus in felis ut arcu rutrum
                            condimentum. Quisque maximus, ligula eu viverra
                            rhoncus, est tellus fringilla turpis, sit amet
                            facilisis lorem nibh vitae nisi. Integer at mauris
                            orci. Donec tincidunt iaculis dolor sed pharetra.
                            Duis et gravida quam. Aliquam quis sem in dui
                            fringilla venenatis. Nunc ornare, lacus at posuere
                            elementum, tellus dui aliquet nunc, et condimentum
                            ex est quis purus. Nulla a metus eu metus varius
                            facilisis. Nam pretium vel ligula id mollis. Proin
                            id lorem fringilla nunc blandit laoreet. Fusce
                            bibendum arcu a felis iaculis interdum. Interdum et
                            malesuada fames ac ante ipsum primis in faucibus.
                        </p>
                        <p>
                            Morbi maximus odio sit amet nulla gravida, vel
                            molestie erat blandit. Aenean non enim facilisis,
                            convallis tellus eget, rhoncus est. Aliquam erat
                            volutpat. Vivamus ultrices quam sit amet felis
                            rutrum pulvinar vitae nec lacus. Ut non metus sed
                            ante rutrum placerat. Curabitur quis maximus justo.
                            Nam nulla metus, congue sit amet sem quis, vulputate
                            pellentesque libero. Praesent molestie, mauris ut
                            dignissim tincidunt, purus est hendrerit dui, vitae
                            dapibus justo velit sed eros. Morbi lectus sem,
                            vulputate nec dui ut, euismod egestas est. Duis
                            convallis tortor mauris, eget tempor enim pulvinar
                            sit amet. Cras vestibulum porta finibus. Proin
                            varius congue nunc quis dignissim. Donec non
                            venenatis nibh. Donec congue lacinia velit eu
                            iaculis. Fusce sit amet felis imperdiet ipsum mattis
                            ullamcorper condimentum vel erat.
                        </p>
                        <p>
                            Aliquam vitae magna ultricies, egestas risus in,
                            maximus mauris. Nunc ac arcu lectus. In gravida
                            semper odio, facilisis sollicitudin tellus euismod
                            ut. Nullam malesuada lacus nulla, nec malesuada erat
                            pharetra sit amet. Nunc in tempor ipsum, vel finibus
                            quam. Aliquam erat volutpat. Morbi venenatis
                            tincidunt enim, vel porttitor justo ultricies at.
                            Fusce elementum lobortis neque eu interdum. In hac
                            habitasse platea dictumst. Vestibulum efficitur
                            viverra ultrices. Suspendisse fermentum blandit
                            vulputate. In ornare pellentesque ullamcorper.
                        </p>
                    </div>
                </limel-collapsible-section>
            </section>,
        ];
    }

    private toggleSecondExample() {
        this.secondExampleIsOpen = !this.secondExampleIsOpen;
    }

    private secondExampleOnOpen() {
        console.log('Second example opened');
        this.secondExampleIsOpen = true;
    }

    private secondExampleOnClose() {
        console.log('Second example closed');
        this.secondExampleIsOpen = false;
    }
}
