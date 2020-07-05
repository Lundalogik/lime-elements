import { Component, h, State } from '@stencil/core';

/**
 * Custom size
 */
@Component({
    tag: 'limel-example-dialog-size',
    shadow: true,
    styleUrl: 'dialog-size.scss',
})
export class DialogSizeExample {
    @State()
    private isOpen = false;

    constructor() {
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    public render() {
        return [
            <limel-button
                primary={true}
                label="Open"
                onClick={this.openDialog}
            />,
            <limel-dialog open={this.isOpen} onClose={this.closeDialog}>
                <p>This dialog has a custom size set through CSS variables:</p>
                <p>
                    <code>--dialog-width: 25rem</code>
                </p>
                <p>
                    <code>--dialog-height: 50%</code>
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris efficitur condimentum elit id viverra. Morbi
                    venenatis malesuada iaculis. Suspendisse potenti. Curabitur
                    rutrum quis tortor laoreet hendrerit. Sed a maximus orci.
                    Curabitur pharetra in purus vulputate tempor. Proin non
                    ullamcorper felis. Vivamus enim dolor, vulputate vel ipsum
                    sollicitudin, venenatis varius eros. Aenean dignissim
                    venenatis elit, a cursus nibh ornare in. Mauris sed congue
                    ipsum. Vivamus cursus sapien eu nibh convallis, at
                    scelerisque diam vulputate. Aliquam erat volutpat. Class
                    aptent taciti sociosqu ad litora torquent per conubia
                    nostra, per inceptos himenaeos. Morbi efficitur semper ex eu
                    lacinia. Maecenas a dictum mauris, in pulvinar ligula.
                </p>
                <p>
                    Etiam risus lectus, rhoncus eu ipsum nec, consectetur
                    iaculis ex. Suspendisse nunc ex, aliquam nec malesuada
                    vitae, porttitor eget ipsum. Aenean et pharetra nunc, quis
                    dignissim ipsum. Aenean ut arcu vestibulum, commodo nulla
                    ac, volutpat mauris. Praesent vel lectus odio. Pellentesque
                    imperdiet congue pretium. Donec finibus ligula nulla, sed
                    maximus dui pharetra a.
                </p>
                <p>
                    Nunc dictum ut eros vitae euismod. Vestibulum condimentum
                    justo nec mauris convallis condimentum. Sed ut sapien vel
                    urna consectetur efficitur. Sed quis dui enim. Maecenas
                    iaculis rhoncus magna, nec elementum massa tempor a. Donec
                    molestie porttitor rhoncus. Sed lacinia nisi augue, dapibus
                    scelerisque nisi consectetur sed. Nullam eros dui, interdum
                    ut pretium a, ultrices nec nisi. Phasellus vulputate, mi id
                    posuere tristique, ante massa efficitur nulla, vitae
                    imperdiet justo massa nec justo. Phasellus commodo mauris et
                    augue pretium, vulputate sodales ligula vehicula. Vivamus
                    tempus turpis blandit, facilisis ante ac, iaculis sem.
                    Aenean tincidunt tempus efficitur. Pellentesque iaculis
                    posuere enim, id interdum dui. Etiam molestie, mi in aliquet
                    sagittis, lectus odio semper mauris, vitae dictum nisl
                    lectus sed est. Mauris vel feugiat lorem, et luctus risus.
                </p>
                <p>
                    Nulla facilisi. Pellentesque congue metus vitae nibh
                    volutpat pretium. Vestibulum luctus nibh sit amet mi sodales
                    molestie. Maecenas dapibus, massa eu facilisis cursus, elit
                    est facilisis nibh, at gravida augue lorem non lacus. Sed eu
                    lectus semper, semper ipsum vitae, maximus metus. Etiam
                    mattis lorem purus, nec efficitur sapien dignissim sit amet.
                    Sed mollis sem id ex maximus blandit. Duis commodo blandit
                    pellentesque.
                </p>
                <p>
                    Etiam at imperdiet lacus. Vivamus vehicula turpis in rhoncus
                    pretium. Duis dapibus tellus ut enim lacinia bibendum. Morbi
                    consequat metus quis ligula ultricies sodales. Vivamus
                    aliquam, lectus quis pulvinar semper, arcu massa vehicula
                    metus, porttitor condimentum odio lectus vel mi. Cras
                    molestie, turpis eget auctor dapibus, augue metus euismod
                    dolor, nec tincidunt urna dolor nec odio. Curabitur bibendum
                    dignissim est in dapibus. Aenean dignissim nec dolor nec
                    rhoncus. Maecenas vel justo consectetur, bibendum tortor
                    vel, viverra risus. Donec elementum, ex iaculis pharetra
                    aliquet, mi enim pharetra nisl, in euismod enim ex at orci.
                    Quisque in leo sed risus cursus ornare. Nam ut turpis
                    consequat, rhoncus leo eu, dignissim nisl. Sed blandit,
                    libero vel fringilla porttitor, odio orci rutrum enim, sed
                    rhoncus quam risus eu neque.
                </p>
                <limel-flex-container justify="end" slot="button">
                    <limel-button label="Ok" onClick={this.closeDialog} />
                </limel-flex-container>
            </limel-dialog>,
        ];
    }

    private openDialog() {
        this.isOpen = true;
    }

    private closeDialog() {
        this.isOpen = false;
    }
}
