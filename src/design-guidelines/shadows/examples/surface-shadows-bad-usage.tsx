import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-shadows-bad-usage',
    shadow: true,
    styleUrl: 'surface-shadows-bad-usage.scss',
})
export class SurfaceShadowBadUsageExample {
    public render() {
        return (
            <limel-example-do-do-not>
                <div slot="do-not" class="content">
                    <p>
                        Lorem Ipsum racconta una storia. Non come le altre. Un
                        individuo che, in un giorno d'estate, s'imbatte in
                        qualcosa di diverso dalla sua consuetudine. Egli
                        intreccia la sua vita con quelle di altre persone del
                        suo paese. Persone che hanno problemi di cuore, persone
                        che, semplicemente, vorrebbero qualcuno con cui parlare.
                    </p>
                    <div
                        class="box"
                        style={{
                            boxShadow: 'var(--shadow-depth-64)',
                        }}
                    >
                        <p>To look distinct, I only use a shadow effect.</p>
                        <p>
                            But that makes me look like a temporary popover or
                            some sort of message. The user might think I am
                            covering some of the content.
                        </p>
                    </div>
                    <p>
                        Il tutto amalgamato in un viaggio introspettivo nei
                        pensieri profondi dell'autore. Non è un romanzo. Questa
                        storia è semplicemente la descrizione di ciò che lo
                        scrittore si è trovato ad osservare con un taccuino tra
                        le mani. Perché non c'è nulla di più affascinante della
                        realtà.
                    </p>
                </div>

                <div slot="do" class="content">
                    <p>
                        Lorem Ipsum racconta una storia. Non come le altre. Un
                        individuo che, in un giorno d'estate, s'imbatte in
                        qualcosa di diverso dalla sua consuetudine. Egli
                        intreccia la sua vita con quelle di altre persone del
                        suo paese. Persone che hanno problemi di cuore, persone
                        che, semplicemente, vorrebbero qualcuno con cui parlare.
                    </p>
                    <div
                        class="box"
                        style={{
                            backgroundColor: 'rgb(var(--contrast-400))',
                            margin: '2rem 0',
                            paddingTop: '0.25rem',
                        }}
                    >
                        <p>
                            <limel-icon
                                name="information"
                                size="x-small"
                                badge={true}
                            />
                            To look distinct,
                        </p>
                        <p>
                            I use a different background color, a better layout
                            and enough space with my surrounding content.
                        </p>
                    </div>
                    <p>
                        Il tutto amalgamato in un viaggio introspettivo nei
                        pensieri profondi dell'autore. Non è un romanzo. Questa
                        storia è semplicemente la descrizione di ciò che lo
                        scrittore si è trovato ad osservare con un taccuino tra
                        le mani. Perché non c'è nulla di più affascinante della
                        realtà.
                    </p>
                </div>
            </limel-example-do-do-not>
        );
    }
}
