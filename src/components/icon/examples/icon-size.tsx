import { Component, h } from '@stencil/core';
/**
 * Size
 * There are preset sizes.
 * :::note
 * Setting the `bade` prop to `true` affects how big the icon is rendered,
 * but only when the `size` attribute is also set.
 * :::
 */
@Component({
    tag: 'limel-example-icon-size',
    shadow: true,
    styleUrl: 'icon-size.scss',
})
export class IconSizeExample {
    public render() {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Size</th>
                        <th>
                            With <code>badge</code>
                        </th>
                        <th>
                            Without <code>badge</code>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <code>x-small</code>
                        </td>
                        <td>
                            <limel-icon
                                name="thor_hammer"
                                size="x-small"
                                badge={true}
                            />
                            <limel-icon
                                name="mate"
                                size="x-small"
                                badge={true}
                            />
                            <limel-icon
                                name="croissant"
                                size="x-small"
                                badge={true}
                            />
                            <limel-icon
                                name="apple"
                                size="x-small"
                                badge={true}
                            />
                            <limel-icon
                                name="alps"
                                size="x-small"
                                badge={true}
                            />
                            <limel-icon
                                name="ninja"
                                size="x-small"
                                badge={true}
                            />
                        </td>
                        <td>
                            <limel-icon name="thor_hammer" size="x-small" />
                            <limel-icon name="mate" size="x-small" />
                            <limel-icon name="croissant" size="x-small" />
                            <limel-icon name="apple" size="x-small" />
                            <limel-icon name="alps" size="x-small" />
                            <limel-icon name="ninja" size="x-small" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>small</code>
                        </td>
                        <td>
                            <limel-icon
                                name="squats"
                                size="small"
                                badge={true}
                            />
                            <limel-icon
                                name="pullups"
                                size="small"
                                badge={true}
                            />
                            <limel-icon
                                name="pushups"
                                size="small"
                                badge={true}
                            />
                            <limel-icon
                                name="bench_press"
                                size="small"
                                badge={true}
                            />
                            <limel-icon
                                name="cancel"
                                size="small"
                                badge={true}
                            />
                            <limel-icon name="ok" size="small" badge={true} />
                        </td>
                        <td>
                            <limel-icon name="squats" size="small" />
                            <limel-icon name="pullups" size="small" />
                            <limel-icon name="pushups" size="small" />
                            <limel-icon name="bench_press" size="small" />
                            <limel-icon name="cancel" size="small" />
                            <limel-icon name="ok" size="small" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>medium</code>
                        </td>
                        <td>
                            <limel-icon
                                name="triforce"
                                size="medium"
                                badge={true}
                            />
                            <limel-icon
                                name="mana"
                                size="medium"
                                badge={true}
                            />
                            <limel-icon
                                name="pokemon"
                                size="medium"
                                badge={true}
                            />
                            <limel-icon name="dog" size="medium" badge={true} />
                            <limel-icon
                                name="day_of_the_tentacle"
                                size="medium"
                                badge={true}
                            />
                            <limel-icon
                                name="bad_piggies"
                                size="medium"
                                badge={true}
                            />
                        </td>
                        <td>
                            <limel-icon name="triforce" size="medium" />
                            <limel-icon name="mana" size="medium" />
                            <limel-icon name="pokemon" size="medium" />
                            <limel-icon name="dog" size="medium" />
                            <limel-icon
                                name="day_of_the_tentacle"
                                size="medium"
                            />
                            <limel-icon name="bad_piggies" size="medium" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>large</code>
                        </td>
                        <td>
                            <limel-icon name="frog" size="large" badge={true} />
                            <limel-icon
                                name="octopus"
                                size="large"
                                badge={true}
                            />
                            <limel-icon
                                name="gorilla"
                                size="large"
                                badge={true}
                            />
                            <limel-icon name="cat" size="large" badge={true} />
                            <limel-icon
                                name="dragon"
                                size="large"
                                badge={true}
                            />
                            <limel-icon
                                name="caterpillar"
                                size="large"
                                badge={true}
                            />
                        </td>
                        <td>
                            <limel-icon name="frog" size="large" />
                            <limel-icon name="octopus" size="large" />
                            <limel-icon name="gorilla" size="large" />
                            <limel-icon name="cat" size="large" />
                            <limel-icon name="dragon" size="large" />
                            <limel-icon name="caterpillar" size="large" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>custom</code>
                            <p>Size is set in CSS.</p>
                        </td>
                        <td>
                            <limel-icon
                                class="custom-size"
                                name="citrus"
                                badge={true}
                            />
                            <limel-icon
                                class="custom-size"
                                name="strawberry"
                                badge={true}
                            />
                            <limel-icon
                                class="custom-size"
                                name="broccoli"
                                badge={true}
                            />
                        </td>
                        <td>
                            <limel-icon class="custom-size" name="citrus" />
                            <limel-icon class="custom-size" name="strawberry" />
                            <limel-icon class="custom-size" name="broccoli" />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
