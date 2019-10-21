import { Component, h, Prop, State } from '@stencil/core';
import * as showdown from 'showdown';

const BASE_URL = '/lime-elements/versions/24.5.1/';

@Component({
    tag: 'limel-props',
    styleUrl: 'props.scss',
})
export class Props {
    @Prop()
    public name: string;

    @State()
    private propsTableHtml = '';

    private converter = new showdown.default.Converter({
        tables: true,
        simpleLineBreaks: true,
        underline: true,
    });

    public componentWillLoad() {
        const type = this.name.replace('limel-', '');
        const url = `${BASE_URL}public/stencil/components/${type}/readme.md`;
        this.fetchData(url).then(data => {
            this.propsTableHtml = this.converter.makeHtml(data);
        });
    }

    public render() {
        return <div innerHTML={this.propsTableHtml} />;
    }

    private fetchData(url) {
        return fetch(url).then(data => {
            return data.body
                .getReader()
                .read()
                .then(({ value }) => {
                    const text = new TextDecoder('utf-8').decode(value);
                    return this.stripBuiltWithStencilLine(text);
                });
        });
    }

    private stripBuiltWithStencilLine(data) {
        return data.substring(0, data.indexOf('## Dependencies'));
    }
}
